---
title: Modes and Project Scope
sidebar_position: 2
description: Pick a mode to decide whether a conversation may change anything and how the answer is shaped, and set project scope to tell the assistant which project you mean.
keywords: [Default mode, Diagnose, Plan, Build, project scope, No project, another project, Unknown project, Linkiir AI]
---

# Modes and Project Scope

Two controls in the composer footer decide what a conversation can do: the **mode**, and the **project scope**. Everything else is just what you type.

## Modes

The mode is set per conversation and resets when you start a new chat.

| Mode | Hint shown in the UI | Can it change anything? |
| --- | --- | --- |
| **Default** | General coding assistance | No |
| **Diagnose** | Work out why something is failing, and explain the cause | No |
| **Plan** | Break work into steps, without changing anything | No |
| **Build** | Make changes, with approval at each boundary | Yes, with approval |

A mode changes two things: whether the run may change anything, and how the answer is shaped.

The three read-only modes get **24 read tools**. **Build** adds **29 tools that can change things** on top of those.

### Default

General coding assistance. Reads what it needs, answers the question, changes nothing. This is where most work happens, and it is the mode a new chat starts in.

### Diagnose

Reach for it when something is failing and you do not yet know why. Diagnose establishes the cause before proposing a fix, and says plainly when the evidence is insufficient rather than guessing at a likely-sounding one.

### Plan

Reach for it before a change you have not thought through. Plan produces ordered steps with the reason for each, and names what could go wrong. It changes nothing — you read the plan, then decide.

### Build

Reach for it when you want the work done. Build works in small steps and stops at anything needing a decision, so you approve at each boundary rather than reading about it afterwards. See [Approvals](approvals.md).

### Which mode?

| The question I have | Mode |
| --- | --- |
| "What does this workflow do?" | **Default** |
| "How do I write this transform?" | **Default** |
| "Why is this node erroring?" | **Diagnose** |
| "These messages are being dropped somewhere" | **Diagnose** |
| "What would it take to split this workflow in two?" | **Plan** |
| "Give me the steps to add HL7 validation here" | **Plan** |
| "Add a filter node between these two" | **Build** |
| "Fix the bug you just found" | **Build** |

:::note[Diagnose then Build is the natural pair]
Find the cause in **Diagnose**, then switch the same conversation to **Build** and ask for the fix. The conversation keeps what it learned.
:::

## Selecting Build is a request, not an entitlement

Choosing **Build** asks for permission to change things. It does not grant it.

A user who holds no editing permission gets a read-only answer and is told so, in these words:

> You do not have permission to make changes, so the assistant will answer without changing anything.

The answer is still useful — it explains what would need to change. It just does not change it. Which editing permissions unlock Build, and what each one allows, is in [AI Roles and Permissions](../setup/roles-and-permissions.md).

**Build** also needs a project in scope. With **No project** selected it can do exactly two things, covered below.

## Project scope

The scope selector sits in the composer footer, between the mode dropdown and the model picker.

Scope tells the assistant which project "this project" means, and it is what lets it search that project's documents.

### What the selector lists

- Every project you can open. If you cannot open it, it is not there.
- **No project** — a real choice, not a missing value.
- A search box, for instances with enough projects that scrolling is tedious.

### How scope is set

| Situation | What happens |
| --- | --- |
| You start a new chat | It is scoped to the project you are working in, taken from the page you opened the panel on |
| You reopen an existing conversation | Its scope is exactly what it was. A conversation never changes its own scope |
| You want a different project | Change it yourself in the selector — deliberately |

The scope is remembered with the conversation.

### With No project

The assistant can still explain, plan, and answer general questions. It cannot:

- create or edit workflows, nodes, or files
- search project documents

In **Build** with no project it can do exactly two things: **create a project**, and **validate Lua**. So *"create me a project"* is a legitimate scopeless request — you do not need to pick a project first to make one.

### When the page and the scope disagree

If the page you are on belongs to a different project than the conversation's scope, the page chip is badged **another project**, and the scope is **not** moved.

The assistant is told both facts — where you are, and what the conversation is scoped to — and will ask which you meant rather than choosing for you.

:::caution[The scope does not follow you around the workspace]
Navigating to another project mid-conversation does not re-point the conversation. This is deliberate: a conversation that quietly changed which project it was editing would be a bad surprise. Change the scope yourself, or start a new chat.
:::

### Scope the assistant sets itself

There is one exception. If the assistant creates a project and the conversation had no scope, the conversation adopts the new project. Your next message is already pointed at it.

### Unknown project

A conversation scoped to a project you can no longer open shows **Unknown project**. The project was deleted, or your access to it was removed. Pick a different project, or start a new chat.

## Verify it worked

- The composer footer shows a mode and a project name.
- A new chat opens on **Default**, scoped to the project you are in.
- Switching to **Build** with an editing permission gets you an approval prompt on the first change, not a refusal.
- Asking about a project document returns something from that project — proof the scope is doing its job. See [Project documents](../project-knowledge/documents.md).

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| **Build** answers read-only: *"You do not have permission to make changes…"* | Your role holds none of the Build permissions | Ask an administrator for the editing permission the work needs — see [AI Roles and Permissions](../setup/roles-and-permissions.md) |
| **Build** answers read-only and mentions no project in scope | The conversation is on **No project** | Pick a project in the scope selector and ask again |
| The assistant says it has no project in scope | Same cause — it cannot reach workflows, nodes, files, or project documents without one | Pick a project. If you meant to create one, ask it to — that works with no scope |
| The page chip is badged **another project** | You navigated to a project other than the conversation's scope | Answer the assistant's question, or set the scope to the project you actually mean |
| Scope shows **Unknown project** | The project was deleted, or your access to it was removed | Pick a project you can open, or start a new chat |
| The mode reset on its own | You started a new chat. The mode is per conversation | Set the mode again on the new chat |
| A project is missing from the selector | You are not a collaborator on it | Ask to be added as a collaborator — no AI setting substitutes for project access |

## Next

- [Choosing a Model](choosing-a-model.md) — Auto, cost bands, and when to override
- [Approvals](approvals.md) — what Build stops for, and how to review it
- [Attachments and Context](attachments-and-context.md) — files, images, and what the assistant already knows
- [Conversations](conversations.md) — history and what a conversation remembers
- [AI Roles and Permissions](../setup/roles-and-permissions.md)
- [Policy, Budgets and Limits](../setup/policy-and-limits.md)
- [Using the AI Assistant](index.md)
