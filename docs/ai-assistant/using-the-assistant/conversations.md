---
title: Conversations and History
description: Start, find, rename, search and delete AI conversations, read the evidence list and web sources under an answer, and know when a long chat is condensed.
keywords: [AI conversations, chat history, evidence list, web sources, conversation retention, rename conversation, AI search]
sidebar_position: 6
---

# Conversations and History

Every chat is kept, so you can come back to it. The **history drawer** in the panel lists your conversations; the answers inside each one carry their own record of what the assistant did.

## Your conversations are yours alone

Nobody else can list, read or search your conversations — including an administrator. There is no shared view of them.

They are deleted after the retention period, **90 days by default**, together with their attachments. See [AI Policy and Limits](../setup/policy-and-limits.md).

## Start a new chat

Click **New chat** in the panel. The conversation is titled from your first message, so open with the actual question rather than "hi".

A new chat also clears anything carried by the previous one — a Skill you named with `/`, its attachments, and its accumulated context.

## Find an old one

Open the history drawer. Conversations are grouped, newest first:

| Group | Contains |
| --- | --- |
| **Pinned** | Pinned conversations, kept at the top |
| **Today** | Today's |
| **Yesterday** | Yesterday's |
| **This week** | Earlier this week |
| **This month** | Earlier this month |
| **Older** | Everything before that |

Each group shows 8 conversations with a **Show more** to expand it.

**Search** runs across your own conversations only, matching their content.

## Rename and delete

- **Rename** happens in place: click the title, type, and it is saved.
- **Delete** is two-step — you confirm before anything is removed. A deleted conversation and its attachments are gone.

## Which project a conversation is about

A conversation's project comes from the **scope selector** in the composer footer. Change it there — see [Modes and Scope](modes-and-scope.md).

## Reading an answer

### The evidence list

Under an answer sits a collapsed **"N steps of evidence"**. Open it and you see what the assistant actually did, with the outcome of each step:

| Outcome | Meaning |
| --- | --- |
| **Succeeded** | The step ran and returned what it needed |
| **You declined** | You rejected the change — see [Approving Changes in Build Mode](approvals.md) |
| **Not permitted** | Your role or the policy does not allow it |
| **Not found** | What it looked for does not exist |
| **Failed** | It ran and errored |

This is how you check an answer's basis. An answer built on three "not found" steps deserves a harder look than one built on files it read successfully.

### Web sources

When the model searched the web, its sources are listed separately, marked with a **globe**. Treat those as third-party material: they are not your documentation and not reviewed by anyone in your organisation.

### Links in an answer

Answers can contain clickable links to a project, workflow, node or file. Clicking one navigates the workspace **behind** the panel, so the conversation stays open and you keep your place in it.

## Long conversations

- A long transcript loads the most recent turns first and fetches older ones as you scroll back.
- When a conversation grows long, earlier turns are condensed into a summary and the chat tells you once that it happened. Detail from those early turns may be lost. If you want the assistant working from a clean slate, start a new chat rather than pushing the old one further.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| An old conversation is gone | It passed the retention period, 90 days by default, and was deleted with its attachments | Nothing to recover. For work you need to keep, put it in the project's [AI Knowledge](../project-knowledge/documents.md) or a commit. An administrator can change retention in **Settings → AI → Policy** |
| Search finds nothing for a chat I remember | Search covers only your own conversations, and the wording may differ from what you recall | Search a distinctive term from the chat — a node name, a message type. A colleague's conversation is never searchable |
| A conversation says **Unknown project** | Its scope points at a project that no longer exists, or was never set | Set the project with the **scope selector** in the composer footer, or start a new chat in the right scope — see [Modes and Scope](modes-and-scope.md) |
| The chat says earlier turns were summarised | Expected in a long conversation | Restate the constraints that still matter, or start a new chat |

## Next

- [Modes and Scope](modes-and-scope.md)
- [Prompt Library](prompt-library.md)
- [AI Policy and Limits](../setup/policy-and-limits.md)
- [Troubleshooting](../troubleshooting.md)
