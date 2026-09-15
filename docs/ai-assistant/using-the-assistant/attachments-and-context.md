---
title: Attachments, Skills and Context
description: Attach images and text files to a chat, name a Skill with /, and control what the context strip sends with your next message.
keywords: [AI attachments, image attachment, vision model, slash skill, context strip, page chip, AI chat context]
sidebar_position: 4
---

# Attachments, Skills and Context

Three controls sit around the composer and decide what the assistant has to work with: the **paperclip** attaches a file to this conversation, **`/`** names a Skill, and the **context strip** above the composer shows what your next message will carry.

## Attachments

Click the paperclip in the composer, or drop a file onto it.

### Accepted file types

| Kind | Extensions |
| --- | --- |
| **Images** | `.png` `.jpg` `.jpeg` `.webp` `.gif` |
| **Text and data** | `.txt` `.md` `.hl7` `.xml` `.json` `.csv` `.log` `.yaml` `.yml` `.sql` `.lua` |

:::note[PDF, Word and Excel are not chat attachments]
A specification, a vendor manual, or a mapping spreadsheet belongs in the project's AI Knowledge, where it is indexed and available to everyone working on that project. See [AI Knowledge Documents](../project-knowledge/documents.md).
:::

Executables and archives are refused. The check reads the file's content as well as its extension, so renaming it changes nothing — you get a message saying what was refused.

### Default limits

An administrator can change these in **Settings → AI → Policy** — see [AI Policy and Limits](../setup/policy-and-limits.md).

| Limit | Default |
| --- | --- |
| Size of one file | 10 MB |
| Files per conversation | 10 |
| Total size per conversation | 40 MB |
| Extracted text used from one text file | 20,000 characters |

The composer shows how much room is left. A text file longer than the character limit is truncated, and the rest is not read — so paste the section that matters rather than attaching a 5 MB log.

### Images need a model that can see

An image is only useful to a model that reads images. Pick a model with the **eye** icon, or leave the model on **Auto**, which requires vision when an image is attached. A text-only model is told an image was attached but cannot see it, and will answer around it. See [Choosing a Model](choosing-a-model.md).

### An attachment belongs to the conversation

| | Chat attachment | AI Knowledge document |
| --- | --- | --- |
| **Belongs to** | This one conversation | The project |
| **Indexed for search** | No | Yes |
| **Who can see it** | You only | Everyone who can open the project |
| **How long it lives** | Until the conversation is deleted — 90 days by default | Until you remove it |
| **Accepted types** | Images, text and data files | Includes PDF, Word and Excel |
| **What it is for** | A screenshot, a sample message, one log excerpt | Standing reference the whole team relies on |

An attachment never appears in another conversation, and it is never indexed.

## Naming a Skill with `/`

Type `/` in the composer and a picker opens listing the Skills available to this conversation, filtered as you type on both name and description.

:::caution[Selecting from the picker is what attaches the Skill]
Typing `/diagnose-fault` by hand and pressing send does not attach anything — it is just text. Choose the entry from the picker.
:::

Once attached, the Skill's instructions apply for the rest of that conversation. Starting a new chat clears it.

Which Skills you see:

| Source | When it is offered |
| --- | --- |
| **Built-in** | Always |
| **Organization** | Always |
| **Project** | When the conversation is scoped to that project |

They resolve **project over organization over built-in**, matched by name. Skills whose activation is **Always** apply without being named at all, and **Apply when needed** ones are matched from the wording of your request — so you only reach for `/` when you want to force a Skill that would not otherwise fire. See [Organization Skills](../setup/organization-skills.md) and [Project Skills](../project-knowledge/project-skills.md).

## The context strip

The strip above the composer shows what your next message will carry. Every item on it can be removed.

### The page chip

The page chip is where you are in the workspace. On a node's scripting page it reads like:

```text
Scripting — main.lua
```

and in the builder like:

```text
Builder — workflow b2c3d4e5
```

It sends the **kind of page** and the **identifiers of what the URL names** — never file contents. If the page belongs to a different project than the conversation's scope, the chip is badged **another project**.

Why it is useful: standing on a node's script, you can ask *"what is wrong with this code?"* without naming the file. The chip tells the assistant which file you mean, and it reads that file with its own tools.

Remove the chip and nothing about the page is sent. Navigate somewhere else and a fresh chip is offered.

### `@` for what the conversation already knows

`@` in the composer offers the items already known to the conversation. It is not a browser for arbitrary files.

| To make this available | Do this |
| --- | --- |
| A specification or manual | Add it to the project's [AI Knowledge](../project-knowledge/documents.md) |
| A specific node or file | Open it, so the page chip names it — or name it in your question |

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| The file is refused as too large | It is over the per-file cap, 10 MB by default | Attach an excerpt, or ask an administrator to raise the cap in **Settings → AI → Policy** |
| "Too many files" | The conversation has reached its file count or total size | Remove an attachment, or start a new chat |
| An executable or archive is refused | Those types are blocked, by content as well as extension | Attach the source or text file itself, not a `.zip` or a binary |
| The model does not react to my screenshot | The selected model cannot read images | Pick a model with the **eye** icon, or switch to **Auto** |
| A PDF is refused | PDF is not a chat attachment type | Add it as an [AI Knowledge document](../project-knowledge/documents.md) instead |
| The Skill I typed did nothing | It was typed as text, not selected | Type `/`, then choose the Skill from the picker |
| There is no page chip on the dashboard | That page names nothing specific, so there is nothing to send | Open the workflow, node or file you mean, and the chip appears |
| The chip says **another project** | The page belongs to a project other than the conversation's scope | Switch scope in the composer footer, or remove the chip — see [Modes and Scope](modes-and-scope.md) |

## Next

- [Modes and Scope](modes-and-scope.md)
- [Choosing a Model](choosing-a-model.md)
- [Approving Changes in Build Mode](approvals.md)
- [AI Knowledge Documents](../project-knowledge/documents.md)
