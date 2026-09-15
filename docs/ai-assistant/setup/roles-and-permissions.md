---
title: AI Roles and Permissions
sidebar_position: 3
description: Grant Use AI and AI settings to roles, and understand why the assistant can only do what the signed-in user could do themselves.
keywords: [Use AI, AI settings, ai.use, settings.ai, roles, permissions, Build mode, Linkiir AI]
---

# AI Roles and Permissions

There are exactly two AI permissions. Everything else the assistant can do comes from the permissions a user already holds.

## Before you start

| You need | For |
| --- | --- |
| **Manage roles** | Editing a role in Settings → Roles |
| **Manage users** | Assigning a role to a user in Settings → Users |

The seeded `admin` role holds every permission, including both AI ones, so an administrator can test the assistant without changing anything.

## The two AI permissions

They sit in the **AI** group of the role editor.

| Permission | Label in the role editor | What it allows |
| --- | --- | --- |
| `ai.use` | **Use AI** | Start AI runs. Grants no capability on its own — what the AI may read or change is decided by the role's other permissions, acting as the run's owner |
| `settings.ai` | **AI settings** | Read and change AI configuration and company policy: providers, models, budgets, and what the AI is allowed to do |

They are separate on purpose: using the assistant is a different act from configuring the provider and policy behind it.

## 1. Grant the permissions

1. Open **Settings → Roles**.
2. Select the role, or create one.
3. Open the **AI** group and tick **Use AI**, **AI settings**, or both.
4. **Save**.

## 2. Assign the role

1. Open **Settings → Users**.
2. Open the user and add the role.
3. **Save**. The user sees the change on their next request — no restart, no re-login needed.

:::note[Roles are additive]
A user holding two roles holds the union of both. There is no deny flag and no precedence — what is ticked is what is held.
:::

## The key idea: the assistant acts as you

This is the part worth reading twice.

An AI run acts **as the signed-in user**. Every read and every change it makes goes through Grid as that user, and is allowed or refused exactly as it would be if the person had clicked the button themselves.

So **Use AI** on its own lets someone ask questions. What the assistant can *see* and *change* comes entirely from that user's other permissions:

- A user who cannot open a project cannot get the assistant to open it either.
- A user who cannot read logs gets an assistant that cannot read logs.
- A user with no editing permissions gets an assistant that can explain and plan, but not change anything.

A role holding **Use AI** and nothing else can start a run that can do nothing but talk.

:::caution[Granting Use AI widely is not the risk — granting it alongside broad permissions is]
Adding **Use AI** to a role never widens what that role can reach. Review the role's *other* permissions if you want to bound what the assistant may do on that person's behalf. See [Security](../../administration/security/index.md).
:::

## Build mode needs an editing permission

Asking the assistant to build something is a request, not an entitlement. A Build request from a user who holds **none** of the permissions below is answered read-only, and the panel says so: *"You do not have permission to make changes, so the assistant will answer without changing anything."*

Holding **any one** of these is enough for the run to be granted the build tier:

| Permission | Label in the role editor | What the assistant can then do |
| --- | --- | --- |
| `scripts.edit` | **Edit node scripts** | Write a node's files, manage its test samples, and run and debug it against them |
| `libraries.manage` | **Manage shared libraries** | Create, edit, publish, and delete shared libraries and their dependencies |
| `workflows.edit` | **Edit workflows** | Create and delete workflows, and add, remove, connect, and move nodes on the canvas |
| `node.config_values` | **Edit config values** | Change the value of a node's existing config fields |
| `node.config_fields` | **Edit config fields** | Add, remove, or redefine the config fields themselves |
| `node.details` | **Edit node details** | Change a node's name, description, and other details |
| `templates.manage` | **Manage node templates** | Create, import, edit, and delete node templates and template groups |
| `git.manage` | **Commit, push, and pull** | Stage, commit, restore, and exchange commits with the remote |
| `node.run_commit` | **Set run commit** | Choose which commit of a node's code the runtime executes |

The run is still bounded by each individual permission. Holding **Edit workflows** and nothing else means the assistant can wire a canvas but cannot write a script.

:::note[A Build request also needs a project in scope]
With no project selected for the conversation, a Build request is answered read-only with a different reason: *"This conversation has no project in scope, so it stays read-only. Pick a project to let the assistant make changes."* Pick a project in the panel and ask again.
:::

## Reading logs and node source

The same rule applies to reads:

- Reading log messages through the assistant needs **View log messages** (`logs.view`).
- Reading node or library source needs one of the Scripting permissions — **Edit node scripts**, **Manage shared libraries**, or **Commit, push, and pull**.

When a permission is missing the assistant is refused exactly as the user would be, and reports the missing permission by name rather than failing vaguely.

Project reference documents and project Skills are different: they need only collaboration on the project, not **AI settings**.

## Three practical role shapes

| Role | Tick | Result |
| --- | --- | --- |
| **Read-only AI user** | **Use AI**, plus the read permissions the person already needs | Can ask questions and get explanations. Cannot change anything through the assistant |
| **AI builder** | **Use AI**, **Edit node scripts**, **Edit workflows** | Can ask the assistant to build and change node code and workflow structure in projects they collaborate on |
| **AI administrator** | **AI settings** — plus **Use AI** if they want to test their own configuration | Can configure providers, models, budgets, and policy. **AI settings** alone does not let them start a run |

## Verify it worked

- Sign in as the user. The **AI** button appears in the workspace header.
- Ask the assistant a question about something the user can already see. It answers.
- Ask it to change something in a project the user can edit. In Build mode it proposes the change rather than announcing it cannot.
- A user with **AI settings** sees **Settings → AI** and its **Setup**, **Policy**, **Skills**, and **Usage** sub-tabs, and can edit them.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| No **AI** button in the header | The role lacks **Use AI**, or AI is not licensed and enabled | Tick **Use AI** on the role. If it is already ticked, check [AI License and Enabling AI](license-and-enable.md) |
| The assistant answers but says it cannot make changes | The role holds none of the Build permissions above | Add the editing permission the work actually needs — usually **Edit node scripts** or **Edit workflows** |
| The assistant says the conversation has no project in scope | No project is selected for the conversation | Pick a project in the panel, then ask again |
| A tool call is refused naming a permission | The user genuinely lacks that permission | Grant the named permission to their role, or accept the limit — the assistant is refused exactly as the user would be |
| The assistant cannot see a project the user expects | The user is not a collaborator on it | Add them as a collaborator. Nothing in the AI settings can substitute for project collaboration |
| **Settings → AI** is missing for an administrator | Their role lacks **AI settings**, or the license does not carry AI | Tick **AI settings**, then check the license features list |

## Next

- [Model Providers](providers/index.md) — configure a provider and enable a model
- [Policy, Budgets and Limits](policy-and-limits.md) — bound cost and what the assistant may do
- [Using the Assistant](../using-the-assistant/index.md)
- [Security](../../administration/security/index.md)
- [Setting Up Linkiir AI](index.md)
