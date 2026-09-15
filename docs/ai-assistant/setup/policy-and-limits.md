---
title: AI Policy and Limits
description: Set the AI assistant's privacy, retention, budget, document, attachment, and reference limits in Settings → AI → Policy, and review what administrators can audit.
keywords: [AI policy, AI limits, retention, token budget, attachments, references, masking, AI settings permission]
sidebar_position: 5
---

# AI Policy and Limits

**Settings → AI → Policy** holds the decisions usually made once, with security or legal input, and then left alone.

Opening and saving this tab needs the **AI settings** permission — see [AI Roles and Permissions](roles-and-permissions.md).

Values apply to the whole installation. `0` means no limit, everywhere it appears.

## Privacy & safety

:::note[Masking is not optional]
Message payloads and password fields are always masked before the AI sees them. This cannot be turned off.
:::

| Setting | Default | What it does |
| --- | --- | --- |
| **Tell the AI when input is masked** | Off | Adds a note to the model's instructions so it treats a ██████ as redacted on purpose. Doesn't change what's sent |
| **Semantic document search** | Off | Search documents by meaning, not just words. Also sends document text to an embedding provider |

:::caution[Leave semantic document search off]
Document search today is full-text. Leave this off unless your vendor has advised otherwise.
:::

## Retention

| Setting | Default | What it does |
| --- | --- | --- |
| **Conversations (days)** | `90` | Conversations and their attachments are deleted after this many days |
| **Audit records (days)** | `400` | How long a record of what the AI did is kept. Usually longer than conversations |

## Budget

| Setting | Default | What it does |
| --- | --- | --- |
| **Monthly tokens per user** | `0` (no limit) | Caps how many tokens one user may spend in a period. Warns at 80%, refuses at the limit |

The period is a calendar month, measured in UTC.

When a user reaches the limit, the run is refused with a message saying the budget resets at the start of the next period. Runs already in progress are unaffected.

## Project documents

| Setting | Default | What it does |
| --- | --- | --- |
| **Documents per project** | `25` | How many documents one project may hold |
| **Max document size (MB)** | `25` | Largest single document that may be uploaded |

Documents are never removed by retention, so these two are what bound database growth. Re-uploading content the project already holds does not count against the document limit.

## Chat attachments

| Setting | Default | What it does |
| --- | --- | --- |
| **Max attachment size (MB)** | `10` | Largest single file a user may attach to a message |
| **Attachments per conversation** | `10` | How many files one conversation may carry |
| **Total attachment size per conversation (MB)** | `40` | Combined size of a conversation's attachments |
| **Conversation size kept (MB)** | `1` | How much of a conversation is kept |

:::caution[Conversation size kept is the one limit that deletes]
Past this size the oldest messages are dropped so the recent conversation survives. At the default, 1 MB is roughly a quarter-million words.
:::

## Reference budget

A **reference** is material added to a request beyond the conversation itself — a Skill's instructions, a retrieved document passage, or a file named in the request.

| Setting | Default | What it does |
| --- | --- | --- |
| **References per request** | `5` | How many references one request may carry. Extras are left out and the chat says which |
| **Reference share of context (%)** | `40` | The most of the model's context window references may fill |

:::note[This is also the bound on Skills]
There is no size or count limit on Skills themselves. What actually bounds how much Skill text reaches a request is the reference budget above. See [Organization Skills](organization-skills.md).
:::

## Always in effect

Four things hold regardless of how this tab is set, and the UI states them:

- Payloads and passwords are masked before the AI sees them.
- Generated code is validated before it runs.
- Agent telemetry never leaves this site.
- A model reaches the internet only if you turn on web search for it (Settings → AI → **Setup**).

## What administrators can review

**Settings → AI → Usage** shows token usage per user for a date range — Today, Last 7 days, This month, All time, or a custom range. Each row expands to a per-model breakdown. A user sees only their own usage unless they hold **AI settings**.

A **Reset** on that tab, which also needs **AI settings**, moves the baseline so the tab shows nothing recorded before that moment. It does not delete records and it does not affect budgets.

Separately, AI system events appear on the [Logs](../../administration/logs/index.md) page as `SYSTEM_EVENT` records with event types beginning `AI_`:

| Recorded | What it tells you |
| --- | --- |
| Run usage | Tokens a run consumed |
| Quota warning | A user passed 80% of their monthly budget |
| Quota exceeded | A run was refused because the budget was spent |
| A relaxed policy value | A limit on this page was loosened |
| A blocked run | A run the platform refused |

:::note[Only loosening is recorded]
Loosening a policy value is recorded with who changed it and the before/after. Tightening a value is not.
:::

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| An upload is refused with a size or count message | The file or the project is past one of the document or attachment caps | Raise the cap the message names, or split the upload |
| The chat says a reference was left out | The request needed more references than the budget allows, or they would fill too much of the context window | Raise **References per request** or **Reference share of context (%)**, or attach less |
| A run is refused with a message about the budget resetting | The user has spent their **Monthly tokens per user** allowance | Raise the allowance, set it to `0` for no limit, or wait for the next calendar month |
| The **Policy** tab is read-only or missing | The account lacks **AI settings** | Grant the permission to the role |

## Next

- [Organization Skills](organization-skills.md)
- [Log Search and Message History](../../administration/logs/index.md)
- [Security](../../administration/security/index.md)
