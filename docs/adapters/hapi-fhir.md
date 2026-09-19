---
title: HAPI FHIR / OmniVera Adapter
sidebar_label: HAPI FHIR / OmniVera
description: Configure the Linkiir HAPI FHIR adapter to poll a HAPI FHIR or Smile OmniVera endpoint on an interval, over FHIR R4 or R5, with OAuth2, bearer, basic or no authentication.
keywords: [HAPI FHIR, OmniVera, Smile Digital Health, FHIR R4, FHIR R5, adapter, OAuth2, SMART backend services, hapi.fhir.org]
---

# HAPI FHIR / OmniVera Adapter

A **Source Custom** node that polls a HAPI FHIR or Smile OmniVera endpoint on an
interval and pushes every matching resource downstream as JSON.

Published in the **[Linkiir FHIR Adapters](catalogs/fhir.md)** catalog. Subscribe
to that catalog to add this adapter to your grid — see
[Adapter Catalogs](catalogs/index.md).

Current version and changelog:
[FHIR Adapters release notes](../release-notes/catalogs-fhir.md).

## One adapter, two servers

Smile **OmniVera** is Smile Digital Health's FHIR-native platform, and Smile is
the commercial steward of the open-source **HAPI FHIR** project. They are the same
server family and speak the same FHIR REST API, so one adapter reaches both. What
differs is the edge, and that is configuration rather than code:

| | Public HAPI test server | Smile OmniVera |
| --- | --- | --- |
| **Base URL** | `https://hapi.fhir.org/baseR4` or `/baseR5` | Issued per deployment and tenant by Smile |
| **Authentication** | None — the server is open | Normally OAuth2 Backend Services; sometimes a gateway-issued bearer token |
| **SMART discovery** | Not published (there is nothing to authenticate against) | Usually published at `<base>/.well-known/smart-configuration` |
| **Data** | Shared, and purged and reloaded periodically, so resource ids are not stable | Your own |
| **Suitable for** | Development, demos, learning the adapter | Production |

:::caution[The public server is not private]
`hapi.fhir.org` is a shared public sandbox. Never write real patient data to it,
and expect anything you do write to disappear when the server is reloaded. Use it
to build a workflow, then repoint the **FHIR Base URL** at your own endpoint.
:::

## What it does

On each interval the node authenticates if the mode requires it, runs the FHIR
search you configured, follows the result Bundle's pages up to your limit, and
pushes one message per resource returned.

```text
HAPI FHIR Adapter  →  your transform  →  your destination
    (interval)
```

Each pushed message carries metadata — `fhir_resource_type`, `fhir_id` and
`fhir_version` — so a downstream transform can route on resource type without
re-parsing the body.

The first poll after a start also reads the server's **CapabilityStatement** and
logs which release it reports. If that disagrees with your **FHIR Version**
setting, it says so — a base URL pointing at the wrong release is otherwise a
mistake you find much later, as puzzling validation failures on individual
resources.

## Configuration

### Connection

| Field | Default | What it is |
| --- | --- | --- |
| **Interval** | `60000` | How often to poll, in milliseconds. `60000` is one minute. |
| **FHIR Base URL** | `https://hapi.fhir.org/baseR4` | The FHIR base URL, with no trailing resource path. For OmniVera, the endpoint Smile supplied for your deployment and tenant. |
| **FHIR Version** | `FHIR R4 (4.0.1)` | `FHIR R4 (4.0.1)` or `FHIR R5 (5.0.0)`. Sent as the `fhirVersion` parameter on the `Accept` header. |
| **Verify TLS** | on | Verify the server's certificate. Leave on; turn it off only for a local test server with a self-signed certificate. |
| **Live Mode** | on | When off, requests are prepared and logged but never sent. |

:::note[FHIR Version is advisory]
FHIR defines a `fhirVersion` parameter on the JSON media type for servers hosting
more than one release, and the adapter sends it. But a server that hosts a single
release simply ignores it — the public sandbox answers R4 from `/baseR4` even when
asked for `fhirVersion=5.0`. **The base URL is what selects the release**; this
field is how the adapter asks, and what the CapabilityStatement check compares
against.
:::

### Authentication

Choose the mode, then fill in only that mode's fields.

| Mode | Use for | Fields used |
| --- | --- | --- |
| **None (public test endpoint)** | `hapi.fhir.org`, or a local `hapi-fhir-jpaserver`, which ships with no security | — |
| **OAuth2 Backend Services** | A production OmniVera deployment. The unattended flow, needing no person to sign in. | Token URL, Client ID, Client Secret, Scope |
| **Bearer Token** | A token issued outside the adapter, or a gateway that hands out service tokens | Bearer Token |
| **Basic** | A self-hosted HAPI put behind basic auth | Username, Password |

| Field | What it is |
| --- | --- |
| **Token URL** | The OAuth2 token endpoint. **Leave empty to discover it** from `<base>/.well-known/smart-configuration`. Set it when the server publishes no discovery document, or its authorization server lives elsewhere. |
| **Client ID** | The client id issued for this integration. |
| **Client Secret** | The client secret. Stored encrypted; ships empty. |
| **Scope** | Space-separated scopes, for example `system/*.read`, or `system/Patient.read system/Observation.read` to narrow it. Leave empty to accept the server's default. |
| **Bearer Token** | A token issued elsewhere. Stored encrypted. |
| **Username** / **Password** | Basic-auth credentials. The password is stored encrypted. |

The adapter exchanges credentials for a token on the first call that needs one and
reuses it until shortly before it expires. Discovery runs at most once per node
start, so a server that publishes nothing is not asked again on every poll.

:::caution[A pasted Bearer Token cannot be refreshed]
Bearer mode sends exactly what you paste. The adapter has no way to renew it, so a
short-lived token will start failing when it expires. For an unattended feed use
**OAuth2 Backend Services**, which refreshes on its own.
:::

### What to fetch

| Field | Default | What it is |
| --- | --- | --- |
| **Resource Type** | `Patient` | The FHIR resource type to search — `Patient`, `Observation`, `Encounter`, and so on. |
| **Search Query** | `_count=20` | FHIR search parameters as a query string, e.g. `family=Smith&birthdate=1970-01-01`. Use `_count` for page size and `_lastUpdated` to fetch only recent changes. |
| **Max Pages** | `1` | How many pages of results to follow. A FHIR server returns one page plus a `next` link, so `1` fetches only the first page. `0` means no limit. |

:::caution[Max Pages and unfiltered searches]
`Max Pages = 0` walks every page a search produces. Against a large repository
that is a very long poll and a great many messages. Filter with `_lastUpdated`
first, and raise the limit deliberately.
:::

## Getting started against the public sandbox

The defaults already point at the public HAPI server, so the adapter works with no
credentials:

| Field | Value |
| --- | --- |
| FHIR Base URL | `https://hapi.fhir.org/baseR4` |
| FHIR Version | `FHIR R4 (4.0.1)` |
| Authentication | `None (public test endpoint)` |
| Resource Type | `Patient` |
| Search Query | `_count=5` |

Start the node and the log reports the server it reached and how many resources it
pushed. Switch **FHIR Base URL** to `https://hapi.fhir.org/baseR5` and **FHIR
Version** to `FHIR R5 (5.0.0)` to see the same search against R5.

## Connecting to Smile OmniVera

1. Get from Smile: the **FHIR base URL** for your deployment and tenant, the
   **client id** and **client secret** for your integration, and the **scopes**
   granted to it.
2. Set **FHIR Base URL** to that endpoint and **FHIR Version** to the release it
   serves.
3. Set **Authentication** to `OAuth2 Backend Services`, fill in Client ID, Client
   Secret and Scope, and leave **Token URL** empty first — if the deployment
   publishes a SMART discovery document, the adapter finds the token endpoint on
   its own and logs it.
4. Leave **Live Mode** off and start the node once. The log will show whether
   authentication and the CapabilityStatement read both succeeded.
5. Turn **Live Mode** on.

If step 3 reports `NO_TOKEN_ENDPOINT`, the deployment does not publish discovery.
Ask Smile for the token endpoint and paste it into **Token URL**.

:::note[Asymmetric SMART Backend Services is not implemented]
This adapter authenticates with a symmetric **client secret**, which is how Smile
deployments are normally provisioned. The asymmetric `private_key_jwt` variant of
SMART Backend Services — signing a JWT assertion with a private key — is not
supported here; the [Epic](epic.md) and [Cerner](cerner.md) adapters use that
pattern. If your OmniVera tenant is configured for it, talk to Linkiir.
:::

## Building on the library

The adapter is a thin script over the **`hapi_fhir`** library, which is installed
into your project automatically when you build the node. The library reads *and*
writes, so it is the foundation for mapping in both directions — HL7 v2 to FHIR
and FHIR to HL7 v2.

```lua
package.path = linkiir.sys.nodeDir() .. '/hapi_fhir/?.lua;' .. package.path
local HapiFhir = require 'hapi_fhir'

local Fhir = HapiFhir.fromNodeConfig()
```

| Method | Does |
| --- | --- |
| `Fhir:search{ resource=, parameters= }` | `GET /<resource>?...` — returns a searchset Bundle |
| `Fhir:searchAll{ resource=, parameters=, max_pages= }` | Follows `next` links and returns `{ resources, pages }` |
| `Fhir:read{ resource=, id= }` | `GET /<resource>/<id>` |
| `Fhir:create{ resource=, parameters= }` | `POST /<resource>` |
| `Fhir:update{ resource=, id=, parameters= }` | `PUT /<resource>/<id>` — creates or replaces |
| `Fhir:delete{ resource=, id= }` | `DELETE /<resource>/<id>` |
| `Fhir:transaction{ bundle= }` | `POST /` with a transaction Bundle — all or nothing |
| `Fhir:operation{ api=, get_parameters= }` | Invoke an operation, e.g. `Patient/123/$everything` |
| `Fhir:capabilities()` | The server's CapabilityStatement |
| `Fhir:serverVersion()` | `{ release = 'R4', fhirVersion = '4.0.1', software = ... }` |
| `Fhir:authenticate()` | Force a token exchange, to validate credentials |
| `HapiFhir.resources(Bundle)` | Flatten a Bundle into a list of resources |
| `HapiFhir.nextLink(Bundle)` | The Bundle's `next` page URL, or nil |
| `HapiFhir.transactionBundle(Resources, 'POST'\|'PUT')` | Build a transaction Bundle |

Every method returns a result, or `nil` plus an error table with `code` and
`message` set — and often `http_code`, `outcome` or `body` for context.

### HL7 v2 to FHIR: use a transaction

One inbound HL7 v2 message usually becomes several resources. Post them as a
single transaction so a half-mapped patient never lands in the repository:

```lua
local Bundle = HapiFhir.transactionBundle({
   PatientResource,
   EncounterResource,
   ObservationResource,
}, 'POST')

local Result, Err = Fhir:transaction{ bundle = Bundle }
if not Result then
   linkiir.log.error('FHIR transaction failed: ' .. Err.message)
   return
end
```

Use `'PUT'` instead of `'POST'` to upsert each resource at its own id — the right
choice when the HL7 v2 MRN maps to a stable FHIR id, because replaying the same
message then updates rather than duplicates.

### FHIR to HL7 v2: read, then map

```lua
local Result, Err = Fhir:searchAll{
   resource   = 'Patient',
   parameters = { _lastUpdated = 'gt2026-09-01' },
   max_pages  = 5,
}
for _, Patient in ipairs(Result.resources) do
   -- build an HL7 v2 message from Patient and push it
end
```

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| `MISSING_CREDENTIALS` | The Authentication mode needs a field you have not filled in. Nothing was sent. |
| `NO_TOKEN_ENDPOINT` | OAuth2 with no **Token URL**, and the server publishes no `.well-known/smart-configuration`. Ask for the token endpoint and paste it in. |
| `TOKEN_HTTP_401` with `invalid_client` | Wrong Client ID or Client Secret. |
| `TOKEN_HTTP_400` with `invalid_scope` | The **Scope** asks for more than the client is granted. Try leaving Scope empty. |
| `FHIR_OPERATION_OUTCOME` | The server refused at the FHIR level — an unsupported search parameter, or an unknown resource type. The message carries the server's own explanation. |
| `PARSE_ERROR` | The response was not JSON. Usually an HTML error page from a proxy or load balancer in front of the server. |
| `HTTP_404` on every poll | The **FHIR Base URL** is not a FHIR base. Confirm `<base>/metadata` returns a CapabilityStatement. |
| Warning that the reported release differs | The base URL serves a different release from **FHIR Version**. Fix whichever is wrong. |
| Fewer resources than expected | **Max Pages** is `1`, so only the first page was fetched. Raise it. |

## Sample output

Real responses captured from the public sandbox ship with the adapter, under
[`nodes/hapi_fhir_adapter/samples/`](https://github.com/Linkiir/linkiir-fhir-adapters/tree/main/nodes/hapi_fhir_adapter/samples):
a CapabilityStatement, a Patient resource, and a searchset Bundle showing the
`next` link that paging follows.

## Next

- [Linkiir FHIR Adapters](catalogs/fhir.md) — the catalog this adapter comes from
- [Epic](epic.md) and [Cerner](cerner.md) — the asymmetric JWT pattern, for comparison
- [Using Catalog Content](../catalogs/using-catalog-content.md)
