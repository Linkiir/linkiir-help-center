---
title: Approving Changes in Build Mode
description: In Build mode the assistant stops before every change and asks. Read the change, plan, and commit cards, reject with feedback, and use Auto-approve safely.
keywords: [AI approvals, Build mode, approval card, commit approval, auto-approve, reject with feedback, AI evidence]
sidebar_position: 5
---

# Approving Changes in Build Mode

In **Build** mode the assistant does not change anything until you say so. It stops **before every change** and shows you what it intends to do. Reads are never paused — it looks around freely and only asks when it wants to write.

The panel states the posture it is working under:

> Changes apply to your development copy. Committing needs your approval.

:::note[There is no way around the gate]
No setting turns approval off, and the assistant cannot commit by itself. A commit only ever happens through the commit approval card described below.
:::

## How it works

1. You ask for something in Build mode.
2. The assistant investigates — reading files, workflows and documents — without interruption.
3. When it reaches a change, the run pauses and an approval card appears in the panel.
4. You approve, or you reject with a reason.
5. The run continues, and pauses again at the next change.

## The three cards

### A single change

The everyday card. It shows what the change does in plain words — for example *"Write a node file"* — what it is aimed at, its arguments, and any file content or document as a readable block, so you review the actual text rather than a description of it.

Not editable. Approve it, or send it back with feedback.

### A plan

When the work has several steps, the assistant proposes the ordered list first. A plan card always carries this line:

> This plan does not include committing. A commit needs its own approval.

A plan **is** editable: change a step or remove one before you approve. Approving a plan does not approve the changes in it — each change still asks in turn.

### A commit

The last gate, and the most detailed. It shows:

- the files in the commit
- per-file added and removed counts, with expandable diffs
- the test and validation results
- the identity the commit will carry

Not editable. Approve it as it stands, or reject it with a reason.

| Card | Editable? | What approving it means |
| --- | --- | --- |
| **A single change** | No | That one change is applied to your development copy |
| **A plan** | Yes — edit or remove steps | The assistant works through the steps, still asking at each change |
| **A commit** | No | The listed files are committed under the identity shown |

## Rejecting is feedback, not cancellation

When you reject, you give a reason. The reason goes back to the assistant, the run **continues**, and it revises its approach with what you told it. So "no, use the existing helper in `utils.lua`" is a more useful rejection than "no".

The evidence list under the answer then records that you declined, so the transcript shows what was proposed and refused as well as what was done.

## Auto-approve

Auto-approve is offered in **Build** only, is **off by default**, and applies to the **current conversation**. Turn it on and the per-change prompts are skipped — the assistant works through its changes without stopping.

:::caution[Auto-approve is off by default for a reason]
With it on, you no longer see each file's content before it is written. Use it for repetitive work you have already reviewed the shape of, not for a task you are describing for the first time. It **never** auto-approves a commit — a commit always asks, however Auto-approve is set.
:::

## If you close the panel

A pending decision survives closing the panel and reloading the page. Come back and it is still waiting for you. Nothing was applied and nothing was silently approved while you were away.

## Seeing afterwards what changed

| Where | What you get |
| --- | --- |
| The **"N steps of evidence"** list under the answer | What the assistant actually did, step by step, with the outcome of each |
| A commit card's diffs | The exact per-file changes that went into that commit |
| **Settings → AI → Usage** (administrators) | Usage across the installation |
| The **Logs** page (administrators) | The installation's log records |

Start with the evidence list — it is attached to the answer that made the change, which makes it the quickest way to reconstruct what happened in a run.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| Nothing asked for approval, although Build was selected | The run answered read-only, or your role does not permit changes | Check what you can do in [AI Roles and Permissions](../setup/roles-and-permissions.md). If the request only needed reading, no card is expected |
| A change I approved failed anyway | Approval permits the change; it can still fail when applied | Open the evidence list — the failed step names the reason. Fix the cause and ask again |
| I rejected it and it tried something else | Intended. Rejecting is feedback, and the run continues with your reason | Say in the reason what you want instead, or what you want it to leave alone |
| I want it to stop asking every time | Per-change prompts are on by default | Turn on **Auto-approve** for this conversation. A commit will still ask |

## Next

- [Modes and Scope](modes-and-scope.md)
- [Conversations and History](conversations.md)
- [AI Roles and Permissions](../setup/roles-and-permissions.md)
- [Troubleshooting](../troubleshooting.md)
