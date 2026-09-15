---
title: AI Assistant
description: Linkiir AI is an assistant built into Linkiir Grid that reads real state through Linkiir's own APIs to help you build, diagnose, and fix integrations.
keywords: [Linkiir AI, AI assistant, AI settings, AI license, Skills, project AI knowledge, chat, security, guardrails]
---

# AI Assistant

Linkiir AI is an assistant built into Linkiir Grid that helps engineers build, diagnose, and fix integrations. It reads real state — projects, workflows, node configuration, logs — through Linkiir's own APIs, acting as the signed-in user with exactly that user's permissions and project access. It cannot see a project you cannot see, and it cannot change anything you could not change yourself.

The assistant is optional, and off until it is deliberately switched on.

:::info[What can I actually ask it?]
Start with the [Prompt Library](using-the-assistant/prompt-library.md) — working prompts for diagnosing a failing node, explaining a workflow, planning a change, and building an interface.
:::

## The feature

| Feature | What it is | Where |
| --- | --- | --- |
| **AI License** | The `ai` feature flag on the Linkiir license. Without it, nothing AI appears anywhere in the product | **Settings → License** |
| **AI Settings** | Providers and models, company policy, Skills, and usage reporting. Four sub-tabs: **Setup**, **Policy**, **Skills**, **Usage** | **Settings → AI** |
| **AI user roles** | Two permissions: **Use AI** to start runs, and **AI settings** to configure AI for the instance | **Settings → Roles** |
| **AI Assistant chat** | The assistant panel itself, opened from the workspace header | Workspace header |
| **Project AI Knowledge** | Reference documents and Skills that apply to one project only | **Project settings → AI Knowledge** |

## Set it up

In this order:

1. [License and enable AI](setup/license-and-enable.md) — confirm the license carries the AI feature, then turn AI on.
2. [Roles and permissions](setup/roles-and-permissions.md) — grant **Use AI** to the people who need the assistant, and **AI settings** to administrators.
3. [Model providers](setup/providers/index.md) — add at least one provider and enable a model. Until you do, the chat has nothing to run on.
4. [Organization Skills](setup/organization-skills.md) — optional. Written procedures the assistant follows across every project.
5. [Policy and limits](setup/policy-and-limits.md) — token budgets, retention, and what the assistant is allowed to do.

## How it works, briefly

- Linkiir AI runs as two processes: **Grid**, the backend and UI you sign in to, and a supervised local **AI Service** that listens on loopback only. Grid starts it, watches it, and restarts it if it stops.
- The assistant acts as the signed-in user. Every read and every change goes back through Grid's own APIs.

## Built for a regulated environment

A general-purpose AI coding assistant is usually pointed at a checkout on a developer's machine, and it inherits whatever that machine can reach (Cursor, GitHub Copilot and Claude Code are the familiar examples of the category). Linkiir AI is not built that way, because the systems it touches carry clinical data. It reaches Linkiir only through a fixed set of tools, it acts as the signed-in user, and it cannot change anything without an explicit approval from you.

| Concern | A general-purpose AI coding assistant | Linkiir AI |
| --- | --- | --- |
| **How it reaches your work** | Typically direct filesystem and shell access to a checkout | Through a fixed Tool Gateway: a defined set of tools, each wrapping an existing Linkiir API. There is no filesystem access and no shell |
| **What it may change** | Usually anything in the working tree | Nothing at all in three of the four modes. In Build, only through a tool that exists for that purpose, and only after you approve it |
| **Whose permissions it uses** | The developer's machine account | The signed-in Linkiir user's role and project collaboration, checked on every single call |
| **Committing** | Often can commit | Cannot. It can stage a change; the commit happens only when you approve the commit card. There is no commit tool |
| **Clinical data** | Whatever is on disk is readable | Message payloads and password fields are masked before the model sees them, and this cannot be switched off |
| **Internet access** | Usually reaches the internet freely | None, unless an administrator turns web search on for a specific model |
| **Audit** | Varies | Every attempted change is recorded with its outcome, and usage is reported per user |

### The guardrails

| Guardrail | What it means |
| --- | --- |
| **Read-only by default** | Three of the four modes — Default, Diagnose and Plan — cannot change anything. Only Build can, and selecting Build is a request, not an entitlement |
| **Every change stops for approval** | In Build the assistant pauses before each change and shows exactly what it is about to do. Rejecting it sends your feedback back and the work continues, revised. No setting turns approval off |
| **A commit always asks** | Auto-approve can skip the per-change prompts for a conversation, but it never auto-approves a commit — and the assistant has no way to commit by itself |
| **The Tool Gateway, not the filesystem** | The assistant works through a defined set of tools, each wrapping an API Linkiir already exposes. In a read-only mode every one of those tools is a read, by construction. There is no arbitrary file write and no command execution |
| **It acts as you, never as more than you** | A run borrows the signed-in user's authority through a short-lived token, and every call is authorized as that user. User A cannot obtain a capability their role does not hold, and cannot reach a project they are not a collaborator on — asking the assistant is not a way around either check |
| **Conversations are private per user** | Your conversations, and the files you attach to them, are yours. Nobody else can list, read or search them, including an administrator |
| **Documents are data, never instructions** | Content the assistant reads — a vendor PDF, a log payload, a tool result — is treated as reference material. Text inside a document telling it to ignore its rules has no effect. Only a reviewed Skill may direct how it works |
| **Generated code is validated before it runs** | Lua the assistant writes is checked for syntax errors, banned constructs and raw file-access primitives, and every `linkiir.*` call is verified against Linkiir's Scripting API registry. A call to a function that does not exist is an error, so a hallucinated API call cannot be saved. The check runs server-side on the save path and again before execution, so the assistant cannot skip it |
| **Bounded by policy** | Per-user token budgets, retention windows for conversations and audit records, and caps on documents, attachments and how much reference material one request may carry |
| **Off unless switched on** | The whole feature requires the AI license feature, an administrator enabling it, and the **Use AI** permission on a role. Without all three there is no assistant and nothing runs |

### What this gives you

- You can let an engineer use the assistant on a live integration project without widening their access.
- The blast radius of a wrong answer is a proposal you decline, not a changed file.
- You can answer "what did the AI change, and who approved it".
- Your existing roles and project collaboration still govern everything — there is no separate AI permission model to keep in step.
- PHI handling does not depend on anyone remembering to switch on a setting.

:::note[Where the detail lives]
[Modes and Project Scope](using-the-assistant/modes-and-scope.md) for what each mode may do, [Approving Changes in Build Mode](using-the-assistant/approvals.md) for the approval cards and Auto-approve, [AI Roles and Permissions](setup/roles-and-permissions.md) for who gets access, [AI Policy and Limits](setup/policy-and-limits.md) for masking, budgets and retention, and [Security](../administration/security/index.md) for how Linkiir is secured overall.
:::

## Start here

| If you want to | Read |
| --- | --- |
| Turn the assistant on for the first time | [License and enable AI](setup/license-and-enable.md) |
| Give a team access to it | [Roles and permissions](setup/roles-and-permissions.md) |
| Connect it to a model | [Model providers](setup/providers/index.md) |
| Know what to type into the chat | [Prompt Library](using-the-assistant/prompt-library.md) |
| Learn the chat panel — modes, models, project scope | [Using the assistant](using-the-assistant/index.md) |
| Let the assistant answer from your own specs and guides | [Project documents](project-knowledge/documents.md) |
| Cap spend and set retention | [Policy and limits](setup/policy-and-limits.md) |
| See who is using it and how much | [Policy and limits](setup/policy-and-limits.md) |
| Fix something that isn't working | [Troubleshooting](troubleshooting.md) |

## Next

- [Prompt Library](using-the-assistant/prompt-library.md)
- [License and enable AI](setup/license-and-enable.md)
- [Troubleshooting](troubleshooting.md)
- [Security](../administration/security/index.md)
