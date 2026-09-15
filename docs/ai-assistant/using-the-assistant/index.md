---
title: Using the AI Assistant
sidebar_position: 1
description: Open the AI panel, learn what each control in the composer does, send your first message, and read the answer the assistant gives back.
keywords: [AI panel, AI button, chat, composer, mode, project scope, model picker, steps of evidence, Linkiir AI]
---

# Using the AI Assistant

The assistant lives in a panel docked to the right of the workspace. You open it, type a question, and read the answer next to the thing you were already looking at.

Everything it can see and change comes from your own permissions and project access. See [AI Roles and Permissions](../setup/roles-and-permissions.md).

## Open the panel

| Way in | What happens |
| --- | --- |
| The **AI** button in the workspace header (a sparkles icon) | The panel opens |
| **⌘/Ctrl + I** | The panel opens and the cursor lands in the composer, ready to type |

The panel is resizable by dragging its edge, and it remembers its width and whether it was open — per user, so your layout is yours.

Two markers can appear on the **AI** button:

| Marker | Meaning |
| --- | --- |
| A small dot | A run finished while the panel was closed. Open it to read the answer |
| A different indicator | The AI Service is not ready. See [Troubleshooting](../troubleshooting.md) |

:::note[No AI button at all?]
The button is absent rather than greyed out when your role lacks **Use AI**, or when AI is not licensed and enabled. There is nothing to click and nothing you have missed — ask an administrator. See [AI Roles and Permissions](../setup/roles-and-permissions.md).
:::

## What the panel holds

The header has three controls: **new chat**, **conversation history**, and **close**.

The composer is where you type. Its placeholder tells you what it accepts:

```text
Ask me a question…  / for skills, @ to reference, Enter to send
```

The composer footer holds four controls, left to right:

| Control | What it does | Detail |
| --- | --- | --- |
| **Attach** (paperclip) | Adds a file or an image to the message you are about to send | [Attachments and Context](attachments-and-context.md) |
| **Mode** dropdown | Decides whether this conversation may change anything, and how the answer is shaped | [Modes and Project Scope](modes-and-scope.md) |
| **Project scope** selector | Tells the assistant which project "this project" means | [Modes and Project Scope](modes-and-scope.md) |
| **Model** picker | Chooses which model answers this one message | [Choosing a Model](choosing-a-model.md) |

The header controls map to the rest of this section too:

| Control | What it does | Detail |
| --- | --- | --- |
| **New chat** | Starts a fresh conversation. The mode resets, and the scope starts at the project you are working in | [Conversations](conversations.md) |
| **Conversation history** | Reopens an earlier conversation, with its mode and scope as you left them | [Conversations](conversations.md) |

## Your first question

Worth doing once, because it shows you what the answer looks like.

1. Open a project and a workflow you already know.
2. Press **⌘/Ctrl + I**.
3. Leave the mode on **Default** and the model on **Auto**. Both defaults are the right choice for a question.
4. Check the project scope selector shows the project you are in. On a new chat it will.
5. Type `what does this workflow do?` and press **Enter**.

Watch it read the workflow, then explain it. Nothing was changed — **Default** cannot change anything.

:::info[More prompts that work]
The [Prompt Library](prompt-library.md) has prompts for diagnosing a failing node, planning a change, and building an interface, with the mode to use for each.
:::

## Reading the answer

An answer has three parts:

| Part | What it is |
| --- | --- |
| The reply | The explanation, plan, or account of what was changed |
| **N steps of evidence** | A collapsed list of what the assistant actually read to get there. Expand it to check its working |
| Links | Anything it names or changed is clickable — the workflow, the node, the document. Click through to the real thing |

The end of a run shows the tokens used and the time taken.

## Running a turn

While a run is in flight the **Send** button becomes **Stop**.

- **Stop** is honoured at the next step boundary, never in the middle of a tool call. Work already done is kept, and the conversation shows *"Stopped."*
- Every run is bounded: at most **24 steps**, **16 tool calls**, and **120 seconds**. Reaching a limit stops the run and reports what it accomplished, rather than failing silently.
- When a conversation gets long, earlier turns are condensed into a summary and the chat says so once.

:::note[A long ask is better split up]
If a run keeps hitting its limits, the request is doing too much in one turn. Ask for the first part, then the next — a conversation keeps its context between turns.
:::

## Verify it worked

- The **AI** button is in the workspace header, and **⌘/Ctrl + I** opens the panel with the cursor in the composer.
- The composer footer shows a mode, a project, and a model.
- A question about something you can already see gets an answer, with an **N steps of evidence** list you can expand.
- Closing and reopening the workspace brings the panel back at the width you left it.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| No **AI** button in the header | Your role lacks **Use AI**, or AI is not licensed and enabled | Ask an administrator to tick **Use AI** on your role — see [AI Roles and Permissions](../setup/roles-and-permissions.md) |
| *"The AI Service is unavailable"* | The local AI Service is not ready yet, or has stopped | Wait a moment and send again — Grid restarts it. If it persists, see [Troubleshooting](../troubleshooting.md) |
| *"No AI model is available"* | No provider is configured, or every model is disabled | An administrator needs to add a provider and enable a model — see [Model Providers](../setup/providers/index.md) |
| The assistant says it cannot make changes | The mode was **Build** but your role holds no editing permission, or the conversation has no project in scope | See [Modes and Project Scope](modes-and-scope.md) |
| The panel opens but the composer is empty of controls | The panel is dragged too narrow | Widen it by dragging its edge |
| A run stops early with a summary of what it did | It reached a step, tool call, or time limit | Ask for the remainder in the next message |

## Next

- [Modes and Project Scope](modes-and-scope.md) — what a conversation is allowed to do
- [Choosing a Model](choosing-a-model.md) — Auto, cost bands, and when to override
- [Attachments and Context](attachments-and-context.md) — files, images, and what the assistant already knows
- [Approvals](approvals.md) — reviewing a change before it happens
- [Conversations](conversations.md) — history, new chats, and what is remembered
- [Prompt Library](prompt-library.md) — prompts that work
- [Project documents](../project-knowledge/documents.md) — answer from your own specs and guides
- [AI Assistant](../index.md) — the section overview
- [Troubleshooting](../troubleshooting.md)
