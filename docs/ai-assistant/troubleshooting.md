---
title: AI Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 90
description: Symptoms, causes, and fixes for the Linkiir AI Assistant — a missing AI button, an unavailable AI Service, no model available, token budgets, Build mode, project scope, documents, and Skills.
keywords: [AI troubleshooting, AI Service unavailable, no AI model available, token budget, Build mode, ai_service.log, AI_ system events]
---

# AI Troubleshooting

Work down the table to the symptom you are seeing. Each row names what causes it and what to change.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| No AI button in the workspace header | The license has no `ai` feature, AI is not enabled, or your role lacks **Use AI**. The button is absent rather than greyed out | Check **Settings → License** lists AI, that **Settings → AI → Setup** has **Enable AI** on, and that your role holds **Use AI** |
| The panel says "The AI Service is unavailable", with a **Retry** button | The supervised AI Service is not running | Click **Retry**. If it persists, an administrator should read the AI Service log at `<working directory>/logs/ai_service.log` |
| The AI Service reports `stopped` repeatedly | A previous AI Service process is still holding its loopback port (default `50071`), usually after an ungraceful shutdown. Every new start fails to bind and exits | Find the process holding the port and stop it. The supervisor starts a fresh service on its next check |
| "No AI model is available" in the chat | No provider is configured, or every model is disabled or unavailable | In **Settings → AI → Setup**, add a provider and enable a model, then use **Test connection** |
| A model is listed but greyed out, with a reason | The reason is shown in the model picker. Common ones are no credentials configured and provider unreachable | Fix the named cause in **Settings → AI → Setup** and re-run **Test connection** |
| "This run would exceed the token budget" | The per-user monthly token budget is reached | Wait for the reset at the start of the next month, or ask an administrator to raise **Monthly tokens per user** in **Settings → AI → Policy** |
| **Build** mode is greyed out | Your role holds no editing permission. The panel names what is missing — Build needs an editing permission such as **Edit node scripts** | An administrator adds an editing permission to your role in **Settings → Roles** |
| The assistant answers read-only although **Build** was selected | The build tier was withheld because your role holds no mutating permission. The chat states this in the reply | An administrator grants the permission the chat names, in **Settings → Roles** |
| The assistant says it has no project in scope | The conversation is not scoped to a project | Pick a project in the scope selector in the composer footer |
| The assistant cannot find a document you uploaded | The conversation has no project in scope, or the document row does not show **Indexed** | Check both: set the project scope in the composer, and confirm the row reads **Indexed** in **Project settings → AI Knowledge** |
| A scanned PDF is not searchable | It has no text layer, and the document row states so | Upload a text-based version of the same document |
| A Skill does not appear in the `/` picker | Its activation is not `manual`, or it failed to load. Load failures are listed as "N skills could not be loaded" with the reason | Set the Skill's activation to `manual` to make it selectable, or fix the reason given for the load failure |

### Finding the process on the AI Service port

| Platform | Command |
| --- | --- |
| macOS, Linux | `lsof -nP -iTCP:50071 -sTCP:LISTEN` |
| Windows | `netstat -ano \| findstr :50071` |

Stop the process the command reports, then wait for the supervisor's next health check.

:::note[If you changed the port]
`50071` is the default AI Service port. If it was changed for this installation, use the configured port in these commands.
:::

## Where the logs are

| What | Where |
| --- | --- |
| AI Service log — startup failures, port binding, provider call errors | `<working directory>/logs/ai_service.log` |
| AI system events — usage, quota warnings, policy relaxations, blocked runs | The **Logs** page, filtered to `SYSTEM_EVENT`, event types beginning `AI_` |

Filter the **Logs** page to `SYSTEM_EVENT` and look for event types with an `AI_` prefix. Those records tell you whether a run was blocked, whether a token budget threshold was crossed, and when a policy was relaxed. See [Logs](../administration/logs/index.md).

:::caution[Log files hold no secrets, and should stay that way]
Provider credentials are stored encrypted and are never written to `ai_service.log`. If you attach a log to a support request, still read it through first — prompts and node configuration can carry environment detail you would rather not send.
:::

## Next

- [License and enable AI](setup/license-and-enable.md)
- [Model providers](setup/providers/index.md)
- [Policy and limits](setup/policy-and-limits.md)
- [Logs](../administration/logs/index.md)
- [Support](../support/index.md)
