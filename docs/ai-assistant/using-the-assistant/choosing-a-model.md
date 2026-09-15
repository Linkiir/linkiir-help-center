---
title: Choosing a Model
sidebar_position: 3
description: Use Auto to let each message pick the cheapest model that can do the job, read the cost bands and capability icons, and know when to override the choice yourself.
keywords: [model picker, Auto, cost band, Mixed, vision model, web search, greyed out model, Linkiir AI]
---

# Choosing a Model

The model picker is the rightmost control in the composer footer. It applies to **the message you are about to send**, not to the whole conversation — so you can change model between turns in the same chat.

## Auto

**Auto** is offered first in the list and is the default. Its hint:

> Model chosen per task — the cheapest that can do the job

The order matters. Auto filters by **capability first**, and only then by cost. A saving never routes a message to a model that would fail it:

| Your message | What Auto must pick |
| --- | --- |
| Contains an image | A vision-capable model |
| Is sent in **Build** mode | A tool-capable model |

Because the choice is made per task, a cheap question and an expensive build in the same conversation can land on different models. That is Auto working, not drifting.

## Cost

| What you see | Meaning |
| --- | --- |
| **Mixed** | Auto — the cost depends on which model each message needs |
| **Low** / **Medium** / **High** | A specific model's band |

Hover a specific model and the tooltip shows the exact multiplier. The bands come from the relative cost ratings an administrator sets in **Settings → AI → Setup**, so what counts as Low on your instance reflects your own model line-up. See [Model Providers](../setup/providers/index.md).

## Reading the list

Models are grouped under a **vendor badge**. Two icons mark capabilities:

| Icon | Meaning |
| --- | --- |
| Eye | The model can read images |
| Globe | The model can search the web |

An unavailable model is shown **greyed out with the reason** rather than hidden. You can see it exists and why you cannot use it — a disabled model looks different from a model that was never configured, and the reason tells you what to ask an administrator for.

## Your choice is honoured

Picking a specific model is honoured exactly. Nothing silently substitutes another one.

If the model you named is unavailable, the run **reports that** rather than answering on something else. An answer you get is always from the model you asked for.

:::note[Auto can be missing]
**Auto** is unavailable if an administrator has taken every model out of the Auto pool. Pick a specific model instead.
:::

## When to override Auto

Auto is the right answer most of the time. These are the cases worth thinking about:

| Situation | What to do |
| --- | --- |
| Pasting a screenshot | Pick a model with the eye icon, or leave Auto — it will pick a vision-capable model for you |
| A long, complex build | Pick a stronger model. Auto optimises for the cheapest model that *can* do the job, which is not always the one that does it best |
| A cheap, repetitive question | Pick a **Low** cost model and stay on it for that stretch of the conversation |
| You need current information from the web | Pick a model with the globe icon |

:::info[Web search is enabled per model]
The globe appears only on models an administrator has turned web search on for. No model reaches the internet otherwise. See [Model Providers](../setup/providers/index.md).
:::

## Verify it worked

- The picker shows **Auto** with cost **Mixed** on a fresh message.
- Hovering a specific model shows its exact cost multiplier.
- Changing the model on one message and sending another leaves the first answer untouched — the setting is per message.
- Send an image on a model with the eye icon and the reply describes what is in it.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| No models at all, or *"No AI model is available"* | No provider is configured, or every model is disabled | An administrator needs to add a provider and enable at least one model — see [Model Providers](../setup/providers/index.md) |
| The model I want is greyed out | The reason is shown next to it — usually disabled, not licensed for this instance, or missing a working provider credential | Read the reason, then ask an administrator for that specific change |
| **Auto** is not in the list | An administrator has taken every model out of the Auto pool | Pick a specific model. Ask an administrator to return models to the pool if you want Auto back |
| A model cannot read my screenshot | The model has no eye icon — it is not vision-capable | Switch to a model with the eye icon, or use **Auto**, which picks one when the message has an image |
| The reply says the model I picked is unavailable | It became unavailable between your picking it and sending | Pick another model, or **Auto**. Nothing was answered on a substitute |
| No globe on any model | Web search is off for every model | Ask an administrator to enable it on a specific model — see [Model Providers](../setup/providers/index.md) |
| Costs look wrong for the models we run | The relative cost ratings need adjusting | An administrator sets them in **Settings → AI → Setup** — see [Policy, Budgets and Limits](../setup/policy-and-limits.md) |

## Next

- [Modes and Project Scope](modes-and-scope.md) — what a conversation is allowed to do
- [Attachments and Context](attachments-and-context.md) — sending images and files
- [Approvals](approvals.md) — reviewing a change before it happens
- [Prompt Library](prompt-library.md) — prompts that work
- [Model Providers](../setup/providers/index.md)
- [Policy, Budgets and Limits](../setup/policy-and-limits.md)
- [Using the AI Assistant](index.md)
