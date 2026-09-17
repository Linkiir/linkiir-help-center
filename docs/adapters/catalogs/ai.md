---
title: Linkiir AI Adapters
description: "Model and AI service adapters: hosted and on-premise LLMs, embeddings, and AI tooling. Subscribe from the public repository https://github.com/Linkiir/linkiir-ai-adapters."
keywords: [catalog, AI, LLM, Azure OpenAI, models]
---

# Linkiir AI Adapters

Model and AI service adapters: hosted and on-premise LLMs, embeddings, and AI tooling.

| | |
| --- | --- |
| **Repository** | [https://github.com/Linkiir/linkiir-ai-adapters](https://github.com/Linkiir/linkiir-ai-adapters) |
| **Catalog id** | `lkai` |
| **Adapters** | 1 |
| **Libraries** | 1 |
| **Publisher** | Linkiir Inc |

:::note
The AI adapters in this catalog are workflow nodes that call a model as part of an interface. They are separate from the built-in [AI Assistant](../../ai-assistant/index.md), which helps you build interfaces inside the Grid console.
:::

## Subscribe to this catalog

In Grid, open **Settings → Catalogs** and click **Subscribe to a catalog**.

| Field | Value |
| --- | --- |
| **Repository URL or folder** | `https://github.com/Linkiir/linkiir-ai-adapters` |
| **Branch or tag** | `main` |
| **SSH key** | Leave empty — this is a public repository, cloned anonymously |
| **CA bundle** | Leave empty |

```
https://github.com/Linkiir/linkiir-ai-adapters
```

The catalog is cloned into a staging area and validated before anything is
installed. Once it is in, its adapters appear in the Builder's node palette and
can be filtered by catalog. Full walkthrough:
[Subscribing to a Catalog](../../catalogs/subscribing.md).

:::info[Subscribing needs a permission]
Every catalog operation — subscribing, updating and removing — needs the
Administration-tier **Manage catalogs** permission. See
[Users and Roles](../../administration/configurations/user-roles.md).
:::

## Adapters in this catalog

| Adapter | Node type | Node type id | Documentation |
| --- | --- | --- | --- |
| [Azure OpenAI Adapter](../azure-openai.md) | transform | `LKAI_AZURE_OPENAI_ADAPTER` | see page |

### Azure OpenAI Adapter

Send message content to an Azure OpenAI model deployment and route the response downstream.

`LKAI_AZURE_OPENAI_ADAPTER` · transform node · [Configuration and fields](../azure-openai.md)

## Libraries in this catalog

Shared Lua modules the adapters depend on. Grid installs the version an adapter pins automatically when you build a node from it — there is nothing to install by hand.

| Library | Version | What it does |
| --- | --- | --- |
| `azure_openai` | 1.0.0 | Azure OpenAI client — API key or Azure AD client-credentials authentication, chat completions and responses endpoints. |

:::tip[Library versions are immutable]
A published library version is never changed. A fix ships as a new version, and each node stays pinned to the version it was built against, so updating a catalog cannot disturb a node already running.
:::

## Credentials

Every adapter here ships with its credential fields **empty**, deliberately. Password fields are encrypted with your own grid's key, so a value shipped from the repository could not be decrypted on your machine. Enter yours on the node after you build it, leave **Live Mode** off for the first run, and keep **Verify TLS** on.

## Next

- [Adapter Catalogs](index.md) — every published Linkiir catalog
- [Using Catalog Content](../../catalogs/using-catalog-content.md) — build a node from an adapter and keep it updated
- [How Adapters Work](../how-adapters-work.md)
