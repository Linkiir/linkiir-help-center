---
title: AI Adapters — Release Notes
sidebar_label: AI Adapters
description: "Version history and changelogs for every adapter and library in the Linkiir AI Adapters catalog, with the current version of each."
keywords: [release notes, AI Adapters, versions, changelog, upgrade, lkai]
---

# AI Adapters — Release Notes

Hosted and on-premise model services, embeddings, and AI tooling.

| | |
| --- | --- |
| **Catalog** | [AI Adapters](../adapters/catalogs/ai.md) |
| **Catalog id** | `lkai` |
| **Repository** | [https://github.com/Linkiir/linkiir-ai-adapters](https://github.com/Linkiir/linkiir-ai-adapters) |
| **Minimum Grid version** | 1.0.0 |

---

## Current versions

### Adapters

| Adapter | Current version | Node type id | Changelog |
| --- | --- | --- | --- |
| [Azure OpenAI Adapter](../adapters/azure-openai.md) | **1.1.0** | `LKAI_AZURE_OPENAI_ADAPTER` | [history](#azure-openai-adapter) |

### Libraries

| Library | Current version | Changelog |
| --- | --- | --- |
| `azure_openai` | **1.1.0** | [history](#azure_openai) |

:::tip[Checking what you are on]
Open the node in the Builder: the adapter version it was built from is shown on the node, and **Settings → Catalogs** lists every node whose adapter or library has a newer release. See [how to upgrade](./catalogs.md#upgrading-to-a-newer-version).
:::

---

## Adapter history

### Azure OpenAI Adapter

`LKAI_AZURE_OPENAI_ADAPTER` · current **1.1.0** · [configuration](../adapters/azure-openai.md)

#### 1.1.0

_Released 2026-10-29_

- **Live Mode** off now stops the requests in a running node, not only in Run Test. From Grid 1.2.0 a running node makes every request whatever `live` says, so earlier versions send them even with Live Mode off.
- Uses `azure_openai` 1.1.0.
- Requires Grid 1.2.0 or later.

#### 1.0.1

_Released 2026-10-29_

- Requires Grid 1.2.0 or later. Nothing else changed: Live Mode off still does not stop requests in a running node. Use 1.1.0.

#### 1.0.0

_Released 2026-09-17_

- Initial release. Sends inbound content to an Azure OpenAI model deployment (chat completions or responses) and pushes the model output downstream.

## Library history

Library versions are immutable: a published version is never edited, and a fix ships as a new version. A node stays pinned to the version it was built against until you move it forward.

### `azure_openai`

current **1.1.0**

#### 1.1.0

_Released 2026-10-29_

- With `live` off, a request made from a running node is no longer sent: the client returns the same simulated result Run Test gives. It checks `linkiir.node.dev()`, so it needs Grid 1.2.0 or later. 1.0.0 remains published for nodes pinned to it.

#### 1.0.0

_Released 2026-09-17_

- Initial release. API-key or Azure AD client-credentials authentication, chat completions and responses endpoints.

## Next

- [Linkiir Catalogs Release Notes](./catalogs.md) — every catalog, and how to upgrade
- [AI Adapters](../adapters/catalogs/ai.md) — what this catalog contains and how to subscribe
