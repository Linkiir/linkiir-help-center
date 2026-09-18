---
title: FHIR Validator
sidebar_label: FHIR Validator
description: "Use the Linkiir FHIR Validator to validate a resource against a FHIR server's $validate operation and forward it only when it validates. Strict valid / invalid / unknown, fail-closed."
keywords: [FHIR, validation, $validate, OperationOutcome, adapter, transform, HAPI, conformance]
---

# FHIR Validator

A **Transform Custom** node that validates an inbound FHIR resource against a
FHIR server's `$validate` operation and forwards it downstream **only when it
validates**.

Published in the **[Linkiir FHIR Adapters](catalogs/fhir.md)** catalog. Subscribe
to that catalog to add this node to your grid — see
[Adapter Catalogs](catalogs/index.md).

Current version and changelog:
[FHIR Adapters release notes](../release-notes/catalogs-fhir.md).

## What it does

When a FHIR resource arrives, the node POSTs it to the configured server's
type-level `$validate` operation, reads the `OperationOutcome` the server
returns, and decides one of three things:

| Verdict | Meaning | What happens |
| --- | --- | --- |
| **valid** | The server reported no errors | The resource is forwarded downstream, unchanged |
| **invalid** | The server reported an error or fatal issue | The resource is **not** forwarded |
| **unknown** | No reliable verdict could be obtained | The resource is **not** forwarded |

```text
FHIR Resource Creator  →  FHIR Validator  →  FHIR destination (Epic, HAPI, …)
                              (only valid resources pass)
```

Put it in front of a FHIR destination so an invalid resource never reaches the
server that would reject or misstore it.

### It fails closed

This is the design's most important property. **Anything short of a conclusive
pass is not forwarded.** A timeout, an HTTP 4xx or 5xx, a malformed response, or
a profile the server cannot resolve all come back as **unknown**, and unknown
does not pass. The node never guesses a resource is valid.

Two consequences worth knowing:

- **HTTP 200 is not the verdict.** `$validate` answers 200 and puts the result
  in the `OperationOutcome`, so a 200 carrying an error issue is **invalid**, not
  valid.
- **A resource is validated remotely, never locally.** There is no built-in
  validator — the FHIR server that will store the data is the authority on
  whether it is acceptable.

## Configuration reference

| Field | Default | What it does |
| --- | --- | --- |
| **FHIR Base URL** | `https://hapi.fhir.org/baseR4` | The FHIR base URL whose `$validate` operation to call. For production use a PHI-approved endpoint — the public HAPI server must not receive real patient data. |
| **Profile Canonical** | _(empty)_ | Optional. A profile canonical URL to validate against. Empty validates against the resource's base definition. The profile must actually be installed on the server; if it cannot be resolved the result is **unknown**, not a silent fall back to base validation. |
| **On Invalid** | `Stop` | What to do when the server reports the resource is invalid. `Stop` logs the issues and forwards nothing. `Push to error route` forwards to the Error Topic. |
| **On Unknown** | `Stop` | What to do when no verdict could be obtained. Fails closed either way — `Stop` forwards nothing, `Push to error route` sends to the Error Topic. Never forwards downstream. |
| **Error Topic** | _(empty)_ | The topic to publish to when On Invalid or On Unknown is `Push to error route`. |
| **Block Warnings** | off | When on, a resource that is valid but carries warning issues is treated like invalid and not forwarded. Off (default) forwards a resource that has only warnings, which is how FHIR defines validity. |
| **Timeout** | `20` | How long to wait for the validation server, in seconds. |
| **Live Mode** | on | When off, no request is sent. Because a resource cannot be confirmed valid without asking the server, Live Mode off yields **unknown** and forwards nothing — it is for wiring up the node, not passing traffic through untested. |
| **Verify TLS** | on | Verify the server's certificate. Leave on; turn it off only for a local test server with a self-signed certificate. |

No credential fields: the public HAPI endpoint needs none. If your endpoint
requires authentication, that is a follow-up that reuses the auth handling from
the FHIR adapters — talk to Linkiir.

## The validate operation

The node calls the FHIR type-level validate operation. It is a POST, it does
**not** create the resource, and capitalization matters — the resource type is
`Patient`, not `patient`:

```http
POST https://hapi.fhir.org/baseR4/Patient/$validate
Content-Type: application/fhir+json
Accept: application/fhir+json

{ "resourceType": "Patient", "name": [{ "family": "Smith", "given": ["Jane"] }] }
```

To try it by hand (single-quote the URL so the shell does not expand `$validate`;
use synthetic data only):

```bash
curl -s -X POST 'https://hapi.fhir.org/baseR4/Patient/$validate' \
  -H 'Content-Type: application/fhir+json' \
  -H 'Accept: application/fhir+json' \
  --data-binary '{"resourceType":"Patient","name":[{"family":"Smith","given":["Jane"]}]}'
```

The server responds with an `OperationOutcome`. A valid resource returns
informational or no issues; an invalid one returns issues with `severity` of
`error` or `fatal`.

## Validate before you send (the common use)

The verdict logic lives in the **`fhir_validate`** library, which is installed
into your project when you build the node. That means another node — or an
adapter about to POST a resource — can validate first, without the Validator
node being in the workflow at all:

```lua
package.path = linkiir.sys.nodeDir() .. '/fhir_validate/?.lua;' .. package.path
local Validate = require 'fhir_validate'

local V = Validate.new{ BaseUrl = 'https://hapi.fhir.org/baseR4' }
local Status = V:check(PatientJson)

if Status ~= 'valid' then
   linkiir.log.error('refusing to send a resource that did not validate: ' .. Status)
   return
end
-- only now hand PatientJson to the Epic / HAPI adapter that will create it
```

This is how you stop an invalid resource reaching Epic, Cerner, HAPI or OmniVera:
validate it against the same server first, and send only what passes.

## Set it up

1. Add the **FHIR Validator** node to a workflow from the palette.
2. Set **FHIR Base URL** to the server that will validate — the same server you
   intend to send to, so its rules are the ones applied.
3. Connect the node producing FHIR resources (for example the
   [FHIR Resource Creator](fhir-resource-creator.md)) to its input, and the FHIR
   destination to its output.
4. Leave **Live Mode** off and send one message through to confirm wiring;
   remember that with Live Mode off the verdict is always unknown and nothing is
   forwarded.
5. Turn **Live Mode** on.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Everything comes out **unknown** | **Live Mode** is off, or the server is unreachable, or the base URL is not a FHIR endpoint. Confirm `<base>/metadata` returns a CapabilityStatement. |
| A resource you expected to pass is **invalid** | The server found a real conformance error. The node log carries the `OperationOutcome` issues. |
| A custom profile always yields **unknown** | The profile is not installed on that server, so it cannot be resolved. Install it on the server, or validate against a tenant that has it. |
| Nothing is ever forwarded | Every verdict is invalid or unknown, and the node fails closed. Check the log for the reason on each message. |
| Valid resources with warnings are dropped | **Block Warnings** is on. Turn it off to forward warning-only resources. |

## Sample output

Real `$validate` responses captured from the public HAPI server ship with the
node, under
[`nodes/fhir_validator/samples/`](https://github.com/Linkiir/linkiir-fhir-adapters/tree/main/nodes/fhir_validator/samples):
a valid outcome, an invalid outcome, and the Patient that produced them.

## Next

- [FHIR Resource Creator](fhir-resource-creator.md) — build the resource this validates
- [HAPI FHIR / OmniVera Adapter](hapi-fhir.md) — a destination to guard
- [Linkiir FHIR Adapters](catalogs/fhir.md) — the catalog this node comes from
