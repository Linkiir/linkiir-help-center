---
title: Azure OpenAI Provider
sidebar_label: Azure OpenAI
description: Configure an Azure OpenAI resource as an AI model provider in Linkiir — endpoint, region, deployment names, API version, and provider-hosted web search.
keywords: [Azure OpenAI, Entra ID, managed identity, service principal, API key, deployment name, API version, web search, AI provider]
sidebar_position: 3
---

# Azure OpenAI Provider

Reaches the models you have deployed in an Azure OpenAI resource.

| | |
| --- | --- |
| **Type** | `Azure OpenAI` |
| **API shape** | `responses` |
| **Web search** | **Available** — the **Web** switch can be turned on per model |
| **Sign-in methods** | **Entra ID managed identity (platform identity)** (the default), **Entra ID service principal (platform identity)**, **API key** |

The shared field reference lives on [AI Model Providers](index.md). This page covers what is specific to Azure OpenAI.

:::note[Not the same thing as the Azure OpenAI adapter]
This page configures the **AI assistant's** model provider. The [Azure OpenAI adapter](../../../adapters/azure-openai.md) is a different feature: a workflow node that sends message content to a model from inside a workflow. They are configured separately and do not share credentials.
:::

## Before you start

From the Azure portal or Azure AI Foundry:

- **An Azure OpenAI resource**, and its **endpoint URL**.
- **The resource's region**, for example `eastus`.
- **A deployment per model.** Azure routes by deployment name, so each model you want to use needs its own deployment. Note the deployment name exactly — it is what the request specifies ([Microsoft's deployment documentation](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/create-model-deployments)). *(Content was rephrased for compliance with licensing restrictions.)*
- **Enough TPM quota** on each deployment for how you intend to use it. Web search turns are large.
- **One credential**:

| Sign-in method | What you need |
| --- | --- |
| **Entra ID managed identity (platform identity)** | A managed identity granted a role on the resource. The **Managed identity (optional)** field takes a user-assigned identity; blank uses the system-assigned one |
| **Entra ID service principal (platform identity)** | An app registration granted a role on the resource, plus its **Client ID** |
| **API key** | A key from the resource |

:::caution[Platform identity is not a guaranteed default]
The Entra ID methods store no secret and resolve an identity at request time. Confirm with **Test connection** that the principal reported is the one you meant. If it fails to resolve, use **API key** instead and raise the identity problem with Azure.
:::

## Set it up

1. Open **Settings → AI → Setup** and add a provider.
2. Set **Name**, for example `azure-openai-prod`. It must be unique on this instance.
3. Set **Type** to **Azure OpenAI**. The card states that the provider is addressed using the **Responses** protocol and that this protocol can carry web search.
4. Set **API version (optional)**: leave it **blank for a GA resource**, or set it to `preview` for a resource on the preview API.
5. Set **Region** to the resource's region.
6. Leave **Endpoint** alone unless the resource uses a custom domain or Private Link — the disclosure link reads **Use a Private Link endpoint**.
7. Choose a **Sign-in method** and fill what it asks for:

   | Method | Fill in |
   | --- | --- |
   | Entra ID managed identity | **Managed identity (optional)** — blank uses the system-assigned identity |
   | Entra ID service principal | **Client ID** |
   | API key | **Secret** |

8. Under **Permitted models**, add each **Model id** and, in the **deployment name** field beneath it, the Azure deployment name — whenever it differs from the model id. Set **Display name**, **Cost** and **Auto** as you want them.
9. Turn **Web** on for any deployment that should be allowed to search the web. Read the warning below first.
10. **Save**.
11. Click **Test connection**.

:::note[Azure's credential header is handled for you]
Azure expects its own credential header rather than a standard bearer token. Linkiir applies this automatically for the Azure types — there is nothing to configure.
:::

## Web search

Turning **Web** on for a deployment lets the provider run a web search as part of the turn. Two consequences, both of which the settings page also states:

:::warning[What web search costs you]
With web search on, **the provider runs the search**: your query and any fetched pages pass through its infrastructure, and third-party content comes back into the conversation. A search turn also costs far more tokens — roughly 15,000 — so a small deployment may rate-limit. A deployment without enough TPM quota reports **Rate limited** on Test connection.
:::

Turn it on deliberately, on one deployment sized for it, rather than across the board. If you switch **Web** on for a model whose provider cannot carry search, saving is refused with an explanatory error.

## Configuration reference

| Field | Default | Purpose |
| --- | --- | --- |
| **Name** | *(empty)* | Unique on this instance. Keys the stored credential |
| **Type** | — | `Azure OpenAI` |
| **API shape** | `responses` | Derived from the Type. The shape that can carry web search |
| **API version (optional)** | *(empty)* | Blank for a GA resource. `preview` for a resource on the preview API |
| **Region** | *(empty)* | The resource's region, for example `eastus` |
| **Endpoint (optional)** | *(empty)* | Not needed unless the resource uses a custom domain or Private Link |
| **Sign-in method** | `Entra ID managed identity (platform identity)` | Managed identity, service principal, or API key |
| **Managed identity (optional)** | *(empty)* | Managed identity method only. Blank uses the system-assigned identity |
| **Client ID** | *(empty)* | Service principal method only. The application (client) id |
| **Secret** | *(empty)* | API key method only. Stored encrypted, never shown again |
| **Model id** | *(empty)* | The model id, used verbatim for capability lookup |
| **deployment name** | *(empty)* | What the request is addressed by, when it differs from the model id |
| **Display name** | Falls back to the id | What the chat picker shows |
| **On** | On | Whether this instance may use the model |
| **Cost** | `1.0` | Your relative rating. Auto compares these |
| **Auto** | Follows **On** | Whether Auto may pick the model |
| **Web** | Off | Provider-hosted web search for this deployment |

## Verify it worked

- **Test connection** shows **OK** for every enabled model, with the reply, latency and token counts on each row.
- The principal line names the identity you intended.
- The models appear in the chat picker under the Azure OpenAI badge.
- If you enabled **Web**, ask the assistant something that needs current information and check that the answer cites what it found.

## If it didn't work

| Stage | Cause | Fix |
| --- | --- | --- |
| **Incomplete** | A required field is empty | Fill the field the card flags |
| **No credential** | No secret is stored for the API key method | Enter the key, then save again |
| **Bad credential** | The key is wrong or has been rotated | Re-copy the key from the resource |
| **Not allowed** | The identity has no role granting inference on the resource | Grant the role in Azure, then test again |
| **Not enabled for account** | The subscription is not entitled to this model | Resolve it in Azure. This is not a settings fix |
| **Rate limited** | The deployment's TPM quota is exhausted — common the first time web search is used | Raise the deployment's TPM quota in Azure |
| **Unknown model** | The model id or the deployment name is wrong | Re-copy both from the resource's deployments list |
| **Unreachable** | The request did not reach Azure | Check network egress from the Linkiir host, and TLS trust if you use a Private Link endpoint |
| **Failed** | Another error | Read the detail on the row |
| Save is refused mentioning web search | **Web** is on for a model whose API shape cannot carry it | Turn **Web** off, or move that model to a `responses` provider |

## Next

- [Azure AI Foundry](azure-ai-foundry.md)
- [AI Model Providers](index.md)
- [Policy and Limits](../policy-and-limits.md)
