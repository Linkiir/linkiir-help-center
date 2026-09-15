---
title: AI License and Enabling AI
sidebar_position: 2
description: Confirm your Linkiir license carries the AI feature, then turn AI on for the instance in Settings → AI → Setup.
keywords: [AI license, enable AI, ai feature, AI Service, System Status, Linkiir AI]
---

# AI License and Enabling AI

Two things have to happen before anything else. The license has to carry the AI feature, and an administrator has to turn AI on. They are separate acts: a licensed instance still has AI off until someone enables it.

## Before you start

| You need | For |
| --- | --- |
| **Manage license** | Reading Settings → License and applying a new license code |
| **AI settings** | Turning **Enable AI** on |

AI is a license **feature**, not a license tier. It is carried by the `ai` flag on the installed license and works on any license type that carries the flag — you do not need to move to a different edition to get it.

## 1. Confirm the license carries AI

1. Open **Settings → License**.
2. Read the features list. A licensed instance shows an **AI** row there.

If the **AI** row is absent, the license does not include AI. Request a license that includes it from your vendor, then apply the returned code — see [License ID and License Code](../../administration/licensing/license-id-code.md) for how a license is applied.

:::info[The AI tab follows the license]
**Settings → AI** only exists when the license carries AI. On an instance without it there is no AI tab and no way to navigate to one. If you have just applied a new license, reload the page.
:::

## 2. Enable AI

Licensing does not switch AI on. The default is off.

1. Open **Settings → AI → Setup**.
2. Turn on **Enable AI** — *"Turn the AI on for this instance. Requires the AI license."*
3. **Save**.

Saving with the toggle on starts the supervised AI Service immediately. Turning it off stops the service. Saving any *other* AI setting — a provider, a model, a budget — does not restart the service.

:::note[Where the AI Service runs]
The AI Service runs on the local machine only, bound to loopback, and is started and watched by Grid. Nothing about it is exposed on your network. On a High Availability pair it runs only on the active server, and moves with a failover.
:::

## Verify it worked

- **Settings → AI → Setup** shows **Enable AI** on after a reload.
- The Dashboard's **System Status** shows an `ai_service` row reading *running*. That row appears only when AI is licensed and enabled; when AI is off it is omitted entirely rather than shown as a failure.
- The **AI** button appears in the workspace header for a user whose role holds **Use AI**.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| No **AI** tab in Settings | The installed license does not carry the AI feature | Check the features list on Settings → License, then request a license that includes AI |
| **AI** tab present, **Enable AI** off, no way to change it | Your role lacks **AI settings** | Have someone with **Manage roles** grant it — see [AI Roles and Permissions](roles-and-permissions.md) |
| **Enable AI** is on, but no **AI** button in the header | The signed-in user's role lacks **Use AI** | Grant **Use AI** to their role. The button is absent, not greyed out, when the permission is missing |
| `ai_service` row says *not running* or *failed to start* | The service could not start or has stopped | See [Troubleshooting](../troubleshooting.md) |
| `ai_service` row says *running but health check failing* | The process is alive but not answering its health check | Transient — the supervisor keeps watching and restarts it if it hangs. If it persists, see [Troubleshooting](../troubleshooting.md) |
| No `ai_service` row at all | AI is not licensed *and* enabled | Work through steps 1 and 2 above |

:::note[A Runtime restart does not interrupt sessions]
AI licensing is verified against the Linkiir Runtime. If the Runtime becomes briefly unreachable, an already-verified AI license keeps working for a bounded grace period of 15 minutes, so restarting the Runtime does not cut off a conversation in progress. Past that window the check closes and AI stops until the Runtime answers again.
:::

## Next

- [AI Roles and Permissions](roles-and-permissions.md) — who may use the assistant, and what it can do on their behalf
- [Model Providers](providers/index.md) — configure a provider and enable a model
- [Licensing](../../administration/licensing/index.md)
- [Setting Up Linkiir AI](index.md)
