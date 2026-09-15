---
title: Organization Skills
description: Add, edit, and shadow Skills in Settings → AI → Skills — instructions the AI follows across every project, with activation modes and the four built-in Skills.
keywords: [AI skills, SKILL.md, activation, organization skill, built-in skill, front matter, AI settings permission]
sidebar_position: 6
---

# Organization Skills

**Settings → AI → Skills** is where you add instructions the AI follows across every project on this installation.

Opening and saving this tab needs the **AI settings** permission — see [AI Roles and Permissions](roles-and-permissions.md).

## What a Skill is

A **Skill** is written instructions the AI follows. Reviewed like code — unlike documents, which it only reads.

That difference matters when you decide where to put something. A vendor PDF is reference material and is never obeyed; a Skill is. If you want the AI to *comply* with your house HL7 convention, it belongs in a Skill, not in a document.

## The three scopes

| Scope | Where it lives | Who it applies to |
| --- | --- | --- |
| **Built-in** | Ships with the release | Everyone. Read-only |
| **Organization** | This tab | The whole instance, inherited by every project |
| **Project** | A single project | That project only — see [Project Skills](../project-knowledge/project-skills.md) |

Skills resolve **project over organization over built-in**, matched by name, case-insensitively. So a project Skill called `map-formats` replaces the organization one of that name, which in turn replaces the built-in.

## How a Skill is stored

A Skill is a single Markdown file, `SKILL.md`. Organization Skills sit on disk at:

```text
<working directory>/settings/ai_skills/<name>/SKILL.md
```

The file opens with front matter:

| Field | Required | Purpose |
| --- | --- | --- |
| `name` | Yes | The Skill's identity. Keep it identical to the name you typed, or **Edit** and **Delete** will not find it |
| `description` | No | Shown in the picker, and used to match an "apply when needed" Skill |
| `version` | No | Display only |
| `activation` | No | When the Skill loads — see below |
| `applies_to` | No | Free text. Write it as a list of distinctive terms |

## Activation

**When it applies** decides how a Skill gets into a request.

| Choice in "When it applies" | Meaning |
| --- | --- |
| **Always — every chat uses this skill** | Loaded into every request. Costs context on every turn, so keep these few and short |
| **Apply when needed — matched to the request** | Loaded only when the request shares a distinctive term with the Skill's name, description or "applies to". Matching is by term, not meaning, so use distinctive terms like HL7, X12, FHIR, ORU, segment. Common words are ignored |
| **Manual — only when named with `/`** | Never loaded unless the user names it with `/` in the chat. **The default** |

## Add a Skill

1. Go to **Settings → AI → Skills** and click **Add skill**.
2. Type a **Name**. Letters, numbers, spaces, and `-` `.` `_` are allowed.
3. Choose **When it applies**.
4. Write or paste the Markdown.
5. Click **Save skill**.

It applies on the next run. No restart.

The editor validates on save: malformed Markdown is refused with the reason, and nothing broken is stored.

:::note[There is no size limit on a Skill]
Skills are not capped by count or length. What bounds how much Skill text actually reaches a request is the reference budget in [AI Policy and Limits](policy-and-limits.md#reference-budget).
:::

## Change a built-in Skill

You do not edit a built-in Skill; you shadow it with your own of the same name.

1. On the built-in row, click **Adapt as organization skill**. The shipped Markdown opens under the same name.
2. Edit it and save. Your version wins, and the row shows "overrides built-in".

Deleting your version restores the built-in.

You can **Download** any Skill — built-in, organization, or project — to review it, or to move it to another instance.

:::note[Nothing goes missing quietly]
Skills that fail to load are listed as "N skills could not be loaded", with the path and the reason for each.
:::

## The built-in Skills

| Skill | Description | Activation |
| --- | --- | --- |
| `build-adapter` | Build, extend, or repair an adapter that connects to an external service. | Manual |
| `diagnose-fault` | Find why a node or workflow is failing. Read-only: explains, changes nothing. | Manual |
| `map-formats` | Map fields between message formats and write the transform. | Manual |
| `document-interface` | Write the reference doc beside an interface node. | Manual |

All four are Manual, so a user reaches them by naming them with `/`.

## Writing a good Skill

- Keep the rules few and absolute. A long list of soft preferences is followed less reliably than three rules that admit no exception.
- Give the reason for each rule. The reason is what lets the AI apply the rule to a case you did not anticipate.
- Order the steps, and end with a definition of done, so the AI knows when to stop.
- Name the thing to check. "Verify the MSH-9 message type matches the trigger event" beats "check the header".
- Each Skill must stand on its own. A Skill's `references/` and `assets/` folders are for whoever maintains the file — the AI never reads them.
- Bump `version` on a real change, so reviewers can tell which text was in force.

## Example

A house HL7 convention, loaded into every request:

```markdown
---
name: house-hl7-conventions
description: "Our local HL7 v2 conventions: encoding, MRN assigning authority, and ORU result units."
version: 1
activation: always
applies_to: HL7, MSH, PID, OBX, ORU, ADT, MRN, segment
---
# House HL7 v2 conventions

These hold for every interface on this installation. They exist because our
downstream EHR rejects a message silently rather than erroring, so a wrong
value here is found weeks later in a chart.

## Rules

1. Use `|^~\&` as the encoding characters. Never re-derive them from a sample —
   an upstream vendor sending something else is a fault to report, not to follow.
2. The MRN in `PID-3` always carries assigning authority `HOSP-MRN`. An MRN
   without it belongs to another facility and must not be trusted as ours.
3. Result units in `OBX-6` use UCUM codes. Free-text units are rejected by the
   receiver.
4. Never invent a `PID-5` name to fill a required field. Leave it empty and say
   so, so the gap is visible.

## Done when

The message validates against the receiver's profile and every rule above is
satisfied, or you have named which rule the source data prevents you meeting.
```

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| **Save skill** is refused as invalid Markdown | The file, usually the front matter, is malformed | Fix what the message names. Nothing was stored, so the previous version is intact |
| The Skill does not appear when you type `/` | Its activation is not **Manual**, or it failed to load | Check **When it applies**, and check the "could not be loaded" list for its path and reason |
| An "apply when needed" Skill never fires | Its name, description, and **applies to** use only common words | Add distinctive terms — `HL7`, `ORU`, `X12`, `FHIR`, `segment` — to `description` and `applies_to` |
| **Edit** or **Delete** returns a 404 | The front-matter `name` differs from the directory name | Set `name` back to the name you typed when you created the Skill |

## Next

- [AI Policy and Limits](policy-and-limits.md)
- [Project Skills](../project-knowledge/project-skills.md)
