---
title: Project Skills
description: Add Skills to one project from its AI Knowledge tab — activation choices, how a project Skill overrides an organization or built-in one, and what committing it to git means.
keywords: [project skill, SKILL.md, ai_skills, activation, overrides built-in, project AI knowledge, git]
sidebar_position: 3
---

# Project Skills

**Project settings → AI Knowledge → Skills** is where you write the instructions the assistant follows *on this project*. The section's own subtitle says it: *Instructions the AI follows on this project.*

Use it for the conventions that are true here and nowhere else — this customer's quirks, this interface's rules, the naming scheme this repository has always used.

Any collaborator on the project can add, edit, download or delete one. The **AI settings** permission is not needed, unlike [Organization Skills](../setup/organization-skills.md).

A Skill is followed. A [document](documents.md) is only read. If you want compliance, write it here.

## Where a project Skill lives

```text
<working directory>/projects/<project guid>/ai_skills/<name>/SKILL.md
```

The file's front matter, the house style, and what bounds how much Skill text reaches a request are the same as for an organization Skill — see [Organization Skills](../setup/organization-skills.md) for the front-matter fields, the writing guidance, and the [reference budget](../setup/policy-and-limits.md#reference-budget).

:::caution[A project Skill is committed to git]
Unlike documents, project Skills live in the project's git repository. They are committed and pushed with the project, and they arrive in every clone. Write one as you would any reviewed file: never a credential, never a key, never patient data.
:::

## Add a Skill

The editor is the same one as in **Settings → AI → Skills**.

1. Open the project's settings popup, go to **AI Knowledge**, and click **Add skill** in the Skills section.
2. Type a **Name** — the placeholder shows the shape, `our-hl7-conventions`. Letters, numbers, spaces, and `-` `.` `_` are allowed.
3. Choose **When it applies**.
4. Write or paste the Markdown, or click **Upload SKILL.md** and pick a `.md` file. Uploading while creating also fills in the name for you.
5. Click **Save skill**.

It applies on the next run. No restart.

Malformed Markdown is refused on save with the reason, and nothing broken is stored.

:::note[Nothing goes missing quietly]
A Skill that fails to load is listed with its path and the reason, so you can see what is wrong rather than wonder why it never fires.
:::

## When it applies

| Choice in "When it applies" | Meaning |
| --- | --- |
| **Always — every chat uses this skill** | In every chat scoped to this project. Keep these few and short |
| **Apply when needed — matched to the request** | Loaded when the request shares a distinctive term with the Skill's name, description or "applies to". Matching is by term, not meaning — use `HL7`, `ORU`, `X12`, `FHIR`, `segment` |
| **Manual — only when named with `/`** | Loaded only when someone names it with `/` in the chat. **The default** |

A project Skill is only offered while the conversation is scoped to that project — see [Modes and Project Scope](../using-the-assistant/modes-and-scope.md).

## What this section lists

Only **this project's** Skills. Built-in and organization Skills are administered in **Settings → AI → Skills**, and they still apply here.

Precedence is by name, and the project wins: a project Skill of the same name as an organization or built-in one replaces it **for this project**. Where it shadows a built-in, the row shows *"overrides built-in"*.

That is how you keep the shipped `map-formats` behaviour everywhere except the one project that needs it done differently.

## Example

A single interface's conventions, in force on every chat for this project:

```markdown
---
name: acme-adt-conventions
description: "Conventions for the ACME ADT feed: MRN authority, name handling, and empty fields."
version: 1
activation: always
applies_to: ACME, ADT, HL7, PID, MRN, segment
---
# ACME ADT feed conventions

ACME accepts a malformed message and drops it silently, so a mistake here is
found weeks later as a missing patient.

## Rules

1. `PID-3` must carry assigning authority `ACME-MRN`. An MRN without it is from
   another facility — reject the message, do not rewrite the field.
2. Names go out as `Family^Given`, uppercase, punctuation stripped. ACME's
   matcher is exact-match on this form.
3. `PID-8` accepts only `M`, `F`, `U`. Map anything else to `U` and log it.
4. Never invent a value to satisfy a required field. Leave it empty and say so.

## Done when

Every rule above holds, or you have named the rule the source data prevents you
meeting.
```

## Verify it worked

- The Skill appears in the project's Skills list with the activation you chose.
- **Always** — start a new chat scoped to the project and ask a question it covers; the answer follows the rules.
- **Manual** — type `/` in the composer with the project in scope and choose it from the picker.
- Where it shadows a built-in of the same name, the row reads *"overrides built-in"*.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| **Save skill** is refused as invalid Markdown | The file, usually the front matter, is malformed | Fix what the message names. Nothing was stored, so the previous version is intact |
| The Skill does not appear when you type `/` | The conversation is not scoped to this project, its activation is not **Manual**, or it failed to load | Set the project in the scope selector, check **When it applies**, and check the "could not be loaded" list for the path and reason |
| An "apply when needed" Skill never fires | Its name, description, and **applies to** use only common words | Add distinctive terms — `HL7`, `ORU`, `X12`, `FHIR`, `ACME`, `segment` |
| **Edit** or **Delete** cannot find the Skill | The front-matter `name` differs from the directory name | Set `name` back to the name you typed when you created it |
| An organization Skill stopped applying on this project | A project Skill of the same name is shadowing it | Rename or delete the project Skill, or fold what you need into it |

## Next

- [Project Documents](documents.md)
- [Organization Skills](../setup/organization-skills.md)
- [Attachments, Skills and Context](../using-the-assistant/attachments-and-context.md)
- [Project AI Knowledge](index.md)
