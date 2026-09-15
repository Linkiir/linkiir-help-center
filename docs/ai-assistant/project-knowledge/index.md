---
title: Project AI Knowledge
description: Give one project its own reference documents and Skills from the project's AI Knowledge tab, and decide which of the two a piece of material belongs in.
keywords: [AI Knowledge, project documents, project skills, reference material, implementation guide, mapping sheet, project settings]
sidebar_position: 1
---

# Project AI Knowledge

Every project has an **AI Knowledge** tab in its settings popup. It is where you give that one project the material the assistant should work from: the specs it can look up, and the rules it has to follow.

The tab appears once AI is licensed and enabled for the installation. **Any collaborator on the project** can use it — adding a document or a Skill needs no AI permission.

Two sections, and they behave differently:

| Section | Subtitle in the UI | What it is |
| --- | --- | --- |
| **Documents** | *Read for reference, never obeyed.* | Reference material the assistant can search when a question calls for it |
| **Skills** | *Instructions the AI follows on this project.* | Written instructions the assistant applies while it works |

## Decide which one you need

A Skill is **followed**. A document is only **read**.

That is the whole distinction, and it decides everything else. A vendor's implementation guide is reference material — the assistant will quote it, but it will never treat it as an order. A house rule you want complied with belongs in a Skill.

| Put it in | When | Example |
| --- | --- | --- |
| **A document** | Reference material the AI should be able to look up | An HL7 v2 implementation guide, an X12 837 companion guide, a FHIR profile, a vendor API PDF, a customer mapping workbook, an OpenAPI spec |
| **A Skill** | A rule or procedure you want followed | Our field naming conventions, our error-handling standard, how we structure an adapter, which code sets to use |

Put the vendor's 200-page guide in **Documents**. Put the three paragraphs of "and this is how *we* do it" in a **Skill**.

## How the assistant uses them

**Documents are searched on demand.** Adding one does not push it into the prompt. When the conversation has a project in scope and the question calls for it, the assistant searches that project's documents and pulls the passages it needs. What it read shows up in the answer's evidence list, so you can check where a claim came from. No project in scope means no document search — see [Modes and Project Scope](../using-the-assistant/modes-and-scope.md).

**Skills are applied according to their activation.** An **Always** Skill is in every request for the project. An **Apply when needed** Skill is matched from the wording of the request. A **Manual** one waits until someone names it with `/`.

:::note[A chat attachment is a third, throwaway thing]
The paperclip in the composer attaches a file to one conversation. It is yours only, it is never indexed, and it disappears with the conversation. Use it for a screenshot, a sample message, or one log excerpt — not for the spec the whole team relies on. See [Attachments, Skills and Context](../using-the-assistant/attachments-and-context.md).
:::

## Start here

| I want to | Go to |
| --- | --- |
| Let the assistant answer from a vendor spec or a mapping workbook | [Project Documents](documents.md) |
| Make the assistant follow this project's conventions | [Project Skills](project-skills.md) |
| Write a rule that applies to every project, not one | [Organization Skills](../setup/organization-skills.md) |
| Change the document count or size caps | [AI Policy and Limits](../setup/policy-and-limits.md#project-documents) |
| Attach a screenshot or a sample message to one chat | [Attachments, Skills and Context](../using-the-assistant/attachments-and-context.md) |

## Next

- [Project Documents](documents.md)
- [Project Skills](project-skills.md)
- [AI Assistant](../index.md)
- [Troubleshooting](../troubleshooting.md)
