---
title: Azure AI Foundry Provider
sidebar_label: Azure AI Foundry
description: Configure an Azure AI Foundry resource as an AI model provider in Linkiir — endpoint, region, deployment names, and web search.
keywords: [Azure AI Foundry, Entra ID, managed identity, service principal, API key, deployment name, web search, AI provider]
sidebar_position: 4
---

# Azure AI Foundry Provider

Reaches the models you have deployed in an Azure AI Foundry resource.

| | |
| --- | --- |
| **Type** | `Azure AI Foundry` |
| **API shape** | `responses` |
| **Web search** | **Available** — the **Web** switch can be turned on per model |
| **Sign-in methods** | **Entra ID managed identity (platform identity)** (the default), **Entra ID service principal (platform identity)**, **API key** |

This provider behaves like [Azure OpenAI](azure-openai.md): the same sign-in methods, the same **API version** rule, the same per-model **deployment name** field, and the same web-search behaviour. Only the resource and its endpoint differ. Read this page for what is specific to Foundry, and [Azure OpenAI](azure-openai.md) for the shared Azure detail.

## Before you start

From Azure AI Foundry:

- **An Azure AI Foundry resource**, and its endpoint, of the form `https://<name>.services.ai.azure.com`.
- **The resource's region**, for example `eastus`.
- **A deployment per model.** Azure routes by deployment name, so note each deployment name exactly ([Microsoft's deployment documentation](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/create-model-deployments)). *(Content was rephrased for compliance with licensing restrictions.)*
- **One credential** — a managed identity, a service principal's **Client ID**, or an API key from the resource.

:::caution[Platform identity is not a guaranteed default]
The Entra ID methods store no secret and resolve an identity at request time. Confirm with **Test connection** that the principal reported is the one you meant. If it fails to resolve, use **API key** instead and raise the identity problem with Azure.
:::

## Set it up

1. Open **Settings → AI → Setup** and add a provider.
2. Set **Name**, for example `foundry-prod`. It must be unique on this instance.
3. Set **Type** to **Azure AI Foundry**. The card states that the provider is addressed using the **Responses** protocol and that this protocol can carry web search.
4. Leave **API version (optional)** blank for a GA resource, or set `preview` for a resource on the preview API.
5. Set **Region** to the resource's region.
6. Open the endpoint disclosure (**Use a Private Link endpoint**) and set **Endpoint** to your `https://<name>.services.ai.azure.com` address if the resource is not reached at the default one, or if it uses a custom domain or Private Link.
7. Choose a **Sign-in method** and fill in **Managed identity (optional)**, **Client ID**, or **Secret** accordingly.
8. Under **Permitted models**, add each **Model id** and put the Foundry deployment name in the **deployment name** field beneath it whenever it differs from the id. Set **Display name**, **Cost** and **Auto**.
9. Turn **Web** on only for a deployment sized for it — see [the web-search warning](azure-openai.md#web-search).
10. **Save**, then click **Test connection**.

## Configuration reference

| Field | Default | Purpose |
| --- | --- | --- |
| **Name** | *(empty)* | Unique on this instance. Keys the stored credential |
| **Type** | — | `Azure AI Foundry` |
| **API shape** | `responses` | Derived from the Type. The shape that can carry web search |
| **API version (optional)** | *(empty)* | Blank for a GA resource. `preview` for a resource on the preview API |
| **Region** | *(empty)* | The resource's region |
| **Endpoint (optional)** | *(empty)* | The Foundry endpoint, `https://<name>.services.ai.azure.com`. Needed for a custom domain or Private Link |
| **Sign-in method** | `Entra ID managed identity (platform identity)` | Managed identity, service principal, or API key |
| **Managed identity (optional)** | *(empty)* | Managed identity method only. Blank uses the system-assigned identity |
| **Client ID** | *(empty)* | Service principal method only |
| **Secret** | *(empty)* | API key method only. Stored encrypted, never shown again |
| **Model id** | *(empty)* | The model id, used verbatim |
| **deployment name** | *(empty)* | What the request is addressed by, when it differs from the model id |
| **Display name** | Falls back to the id | What the chat picker shows |
| **On** | On | Whether this instance may use the model |
| **Cost** | `1.0` | Your relative rating. Auto compares these |
| **Auto** | Follows **On** | Whether Auto may pick the model |
| **Web** | Off | Provider-hosted web search for this deployment |

## Verify it worked

- **Test connection** shows **OK** for every enabled model, and names the principal you intended.
- The models appear in the chat picker under the Azure AI Foundry badge.

## If it didn't work

| Stage | Cause | Fix |
| --- | --- | --- |
| **Incomplete** | A required field is empty | Fill the field the card flags |
| **No credential** | No key is stored for the API key method | Enter the key, then save again |
| **Bad credential** | The key is wrong or has been rotated | Re-copy the key from the resource |
| **Not allowed** | The identity has no role granting inference on the resource | Grant the role in Azure |
| **Not enabled for account** | The subscription is not entitled to this model | Resolve it in Azure. This is not a settings fix |
| **Rate limited** | The deployment's TPM quota is exhausted | Raise the deployment's TPM quota |
| **Unknown model** | The model id or the deployment name is wrong | Re-copy both from the resource's deployments list |
| **Unreachable** | The request did not reach Azure | Check the **Endpoint** value, network egress from the Linkiir host, and TLS trust for a Private Link endpoint |
| **Failed** | Another error | Read the detail on the row |

## Next

- [Azure OpenAI](azure-openai.md) — the shared Azure detail
- [AI Model Providers](index.md)
- [Policy and Limits](../policy-and-limits.md)
