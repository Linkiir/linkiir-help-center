---
title: Setting Up Linkiir AI
sidebar_position: 1
description: The order to set up the Linkiir AI assistant — license, permissions, a model provider, then optional policy, Skills, and project knowledge.
keywords: [AI setup, Linkiir AI, enable AI, AI permissions, model provider, AI settings]
---

# Setting Up Linkiir AI

Three steps make the assistant work. Three more decide how useful its answers are. Do them in order — each depends on the one before it.

## Before you start

Decide who is doing what. The steps below need different permissions, and they are usually spread across two or three people: whoever handles licensing, whoever manages roles, and whoever holds the AI settings.

You will also need one model provider you are entitled to use — an AWS Bedrock account, an Azure OpenAI resource, or a vendor API key. Sort that out before step 3.

## The setup path

1. **[Confirm the license includes AI, and enable AI](license-and-enable.md)** — an administrator who handles licensing and instance settings.
2. **[Grant the AI permissions to the roles that need them](roles-and-permissions.md)** — whoever manages roles.
3. **[Configure at least one model provider and enable a model](providers/index.md)** — whoever holds **AI settings**.
4. *Optional:* **[Set company policy, budgets and limits](policy-and-limits.md)** — whoever holds **AI settings**.
5. *Optional:* **[Add organization Skills](organization-skills.md)** — whoever holds **AI settings**, usually with an experienced integration engineer writing the content.
6. **Per project: [add reference documents and project Skills](../project-knowledge/index.md)** — any collaborator on that project.

## Who can do it, and where

| Step | Who can do it | Where |
| --- | --- | --- |
| Confirm the license carries AI | **Manage license** | Settings → License |
| Enable AI | **AI settings** | Settings → AI → Setup |
| Grant **Use AI** / **AI settings** to a role | **Manage roles** | Settings → Roles |
| Assign a role to a user | **Manage users** | Settings → Users |
| Add a provider and enable models | **AI settings** | Settings → AI → Setup |
| Set policy, budgets, and limits | **AI settings** | Settings → AI → Policy |
| Add organization Skills | **AI settings** | Settings → AI → Skills |
| Review what AI has cost | **AI settings** | Settings → AI → Usage |
| Add project reference documents and project Skills | Collaboration on the project | The project's **AI Knowledge** tab |

:::note[Project knowledge is not an administrative task]
Step 6 needs no AI permission at all — just collaboration on the project. The **AI Knowledge** tab appears on a project once AI is licensed and enabled for the instance. The people who know an interface are the people who should be writing its reference notes.
:::

## What has to be true before the assistant works

Work down this list. Each line depends on the ones above it.

- [ ] The installed license carries the **AI** feature.
- [ ] **Enable AI** is on in Settings → AI → Setup.
- [ ] The signed-in user's role holds **Use AI**.
- [ ] At least one provider is configured with at least one enabled model.
- [ ] The AI Service is running — the Dashboard's System Status shows an `ai_service` row reading *running*.

When all five hold, the **AI** button appears in the workspace header and the assistant answers.

:::caution[The assistant acts as the signed-in user]
**Use AI** grants no access of its own. What the assistant can read or change comes from that user's other permissions. Read [AI Roles and Permissions](roles-and-permissions.md) before you grant it widely.
:::

## Next

- [AI License and Enabling AI](license-and-enable.md)
- [AI Roles and Permissions](roles-and-permissions.md)
- [Using the Assistant](../using-the-assistant/index.md)
- [Linkiir AI](../index.md)
