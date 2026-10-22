---
title: PHI Masking
description: Choose which HL7 v2 fields, JSON keys, XML elements and FHIR paths are masked for anyone without Unredact PHI, in Settings → Instance → PHI Masking.
keywords: [PHI, masking, redaction, unredact, hide PHI, HL7, FHIR, JSON, XML, log search]
---

# PHI Masking

Message payloads carry patient identifiers. Linkiir masks them for everyone who doesn't hold the **Unredact PHI** permission, and **Settings → Instance → PHI Masking** decides what counts as an identifier.

The masking happens on the server: a user without **Unredact PHI** never receives the masked values at all, whatever page or API they read the message through.

---

## Where masking applies

| Where | Without **Unredact PHI** | With **Unredact PHI** |
| --- | --- | --- |
| **Logs**: a message's payload | Always masked | Masked for each message you open. The inspector's **PHI** button shows it in full, and masks it again with the same rules |
| **Logs**: the summary on each row | Masked | Shown in full |
| **Logs**: the **Preview** on each row | Always masked | Masked each time the page opens. The toolbar's **PHI** button shows the previews in full, separately from the inspector |
| **Logs**: search | Matches only what you are shown (see [Searching](#searching-masked-messages)) | Matches the whole message |
| **Logs**: Download | Exported masked | Exported in full |
| **Logs**: Resubmit | Read only, masked | Reveal a message to edit it before resubmitting. A message no rule matches says so, rather than offering to reveal it |
| **Dashboard**: a queue's message previews | Masked | Shown in full |
| **AI assistant** | Always masked, for everyone. See [AI Policy and Limits](../../ai-assistant/setup/policy-and-limits.md) | Always masked |

Masked values are replaced with `██████`. A message that still contains that character is refused for resubmission, so a masked view can never be published back onto a queue.

---

## What is masked

Every FHIR message is masked by a fixed set of [built-in FHIR paths](#built-in-fhir-paths). On top of those, the policy has three parts. Each applies to its kind of payload:

| Part | Applies to | Example |
| --- | --- | --- |
| **HL7v2 Fields** | HL7 v2 messages | `PID` fields `3, 5, 7` |
| **JSON & XML Key Names** | JSON and XML: the value of every key or element with that name, wherever it appears | `ssn` |
| **Additional JSON & XML Paths** | JSON and XML: values at a path | `Observation.performer.display`, `$.patient.ssn` |

Linkiir recognises the payload's kind from its content. Plain text that is none of the three is left as it is.

### Built-in FHIR paths

These paths are masked in every FHIR message, JSON or XML, whatever the policy says. They are the places a FHIR resource keeps its patient's identifiers, so they can't be removed. The **PHI Masking** card lists them, locked, under **Built-in FHIR Paths**.

| Resource | Masked |
| --- | --- |
| `Patient` | `identifier`, `name`, `telecom`, `address`, `birthDate`, `deceasedDateTime`, `photo`, `contact`, `extension` (mother's maiden name, birthplace, race and ethnicity) |
| `RelatedPerson` | `identifier`, `name`, `telecom`, `address`, `birthDate`, `photo` |
| `Person` | `identifier`, `name`, `telecom`, `address`, `birthDate`, `photo` |
| `Coverage` | `identifier`, `subscriberId` (the member and subscriber numbers on an insurance card) |
| Any resource (`*`) | `subject.display`, `patient.display`, `beneficiary.display`, `subscriber.display` (a reference's display text is usually the patient's name) · `text.div` (the narrative repeats what the resource holds) |

The built-in paths only apply inside FHIR resources. JSON and XML that isn't FHIR, such as an API's own response format, is not masked by them. Add key names or `$` paths for those.

:::note[No PHI masking rule matches]
A message that no rule matches is shown in full. This is most often JSON that isn't FHIR and that no key name or path in the policy covers. In the resubmit window this is called out: *No PHI masking rule matches this message, so nothing in it is hidden.*
:::

### The defaults

A new installation masks the following, on top of the built-in FHIR paths:

| Kind | Masked by default |
| --- | --- |
| HL7 v2 | PID-2, 3, 5, 6, 7, 9, 11, 12, 13, 14, 18, 19 · NK1-2, 4, 5 · IN1-16, 17, 18, 19 · GT1-3, 5, 6 |
| Key names | None |
| Additional paths | None |

**Reset everything to defaults** on the card puts these back. It does not affect the built-in FHIR paths.

### Writing a path

A path is a starting point followed by element names, separated by dots:

| Starts with | Matches from | Example |
| --- | --- | --- |
| A FHIR resource type | Every resource of that type, including those inside a Bundle | `Patient.telecom` |
| `*` | Any resource | `*.subject.display` |
| `$` | The document's root, for JSON or XML that isn't FHIR | `$.patient.ssn` |

A path steps through arrays and repeated elements on its own: `Patient.name` masks every name. `*` also stands for any single element partway along a path. Masking an element masks everything inside it.

### Limits

- A segment name is three characters: a capital letter, then capitals or digits (`PID`, `ZP1`).
- Field numbers run from 1 to 999. MSH-1 and MSH-2 hold the message's delimiters and can't be masked.
- Up to 200 key names and 200 paths, each up to 200 characters.

---

## Editing the policy

1. Open **Settings → Instance** and select **Edit** on the **PHI Masking** card.
2. Change the rows:
   - **HL7v2 Fields**: one row per segment, with its field numbers separated by commas. **Add segment** adds a row.
   - **JSON & XML Key Names**: one key name per line.
   - **Additional JSON & XML Paths**: one path per line, masked on top of the built-in FHIR paths. A built-in path typed here is already covered, so it isn't saved again; the card says which.
3. Check the **Preview**. It runs the policy you are editing, built-in paths included, against sample HL7v2, FHIR JSON and FHIR XML messages, so you can see what a change hides before saving it.
4. Select **Save**.

The next log read, export or queue preview uses the new policy. Nothing needs restarting. Each save is recorded in the instance's history.

:::caution[Saving needs two permissions]
Saving the policy needs both **Security settings** and **Unredact PHI**. Masking less shows identifiers to everyone who can't unredact. That isn't a power to give someone who sees the masked view themselves.
:::

Anyone signed in can read the policy, because the Logs page needs it to mask previews and payloads in the browser, and the policy itself contains no patient data.

---

## Messages that can't be read

A JSON or XML message is masked by locating the matched values in the text and replacing only those. The rest of the message keeps its formatting.

That requires reading the whole document. If any rule could apply to a JSON or XML message that can't be read whole, the entire message is hidden behind:

```text
██████ Hidden: this message could not be read to mask its PHI
```

This happens with malformed messages, and with summaries and queue previews that are cut off partway. Masking the part that could be read would risk showing the rest. In the Logs table, such a row's **Preview** reads *Content hidden (PHI) — select to view*.

---

## Searching masked messages

Search on the Logs page reaches into message bodies. For someone without **Unredact PHI**, a row counts as a match only if the term appears in what they would be shown: the masked message, the error summary, or a project, workflow or node name. Otherwise a search for a patient's name would list every message about that patient, even with each one masked.

Checking each row against its masked text takes longer, so each request is limited in how much it searches. When the limit is reached before a page fills, the table says **Older messages haven't been searched yet**, and **Keep searching** carries on from there. A search that stops early means only that the term matched many messages, not which ones.

Each search of message content by someone without **Unredact PHI** is recorded as a system event. The live tail repeating a search isn't. The event records the term and how many rows the masking hid, and that detail is itself always masked: only someone with **Unredact PHI** can read it.

---

## Related

- [Log Search and Message History](../logs/index.md)
- [Users and Roles](user-roles.md): **Unredact PHI** and **Security settings**
- [Security](../security/index.md)
