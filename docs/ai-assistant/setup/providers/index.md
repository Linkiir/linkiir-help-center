---
title: AI Model Providers
sidebar_label: AI Model Providers
description: Configure the model providers the Linkiir AI assistant sends prompts to — connection, credentials, permitted models, and Test connection.
keywords: [AI provider, model, Settings, AI Setup, permitted models, Test connection, API shape, web search]
sidebar_position: 1
---

# AI Model Providers

A **provider** is the model vendor Linkiir sends prompts to — an AWS account reached through Bedrock, an Azure resource, a vendor's own API, or a model you run yourself. Each provider carries its own credentials and its own list of models this instance may use.

**At least one provider with at least one enabled model is required before the assistant can answer anything.** Until then the chat panel has nothing to send a prompt to.

Providers are configured in **Settings → AI → Setup**, which needs the **AI settings** permission. Each provider is a card with two groups of fields — **Connection** (where it is) and **Credentials** (how we sign in) — followed by its **Permitted models** table.

## Supported provider types

| UI label (Type) | Use it for | Page |
| --- | --- | --- |
| **AWS Bedrock** | Claude, GPT-OSS, Amazon Nova, MiniMax and others through an AWS account | [AWS Bedrock](aws-bedrock.md) |
| **Azure AI Foundry** | Models deployed in an Azure AI Foundry resource | [Azure AI Foundry](azure-ai-foundry.md) |
| **Azure OpenAI** | An Azure OpenAI resource | [Azure OpenAI](azure-openai.md) |
| **OpenAI** | OpenAI directly | [OpenAI](openai.md) |
| **xAI (Grok)** | xAI's Grok models | [xAI (Grok)](xai-grok.md) |
| **MiniMax** | MiniMax's own API | [MiniMax](minimax.md) |
| **Ollama (self-hosted)** | A model you run yourself | [Ollama](ollama.md) |
| **Other OpenAI-compatible API** | Any service exposing an OpenAI-compatible API | [Other OpenAI-compatible API](openai-compatible.md) |

You can configure several providers at once. They coexist: a Bedrock account, an Azure resource and a self-hosted model can all be live, and every enabled model from every provider appears in the chat model picker.

## API shapes

The **API shape** is the wire protocol a provider is addressed by. Choosing a **Type** normally settles it, so the form states the resolved shape as a sentence with an **Override** link rather than asking you again.

| API shape | Used by | Web search |
| --- | --- | --- |
| `converse` | AWS Bedrock | No |
| `chat_completions` | OpenAI-compatible services, MiniMax, Ollama | No |
| `responses` | Azure OpenAI, Azure AI Foundry, OpenAI, xAI (Grok) | **Yes** |

:::info[The one consequence to remember]
**Web search only works on a `responses` provider.** On any other shape the **Web** column shows `—` and cannot be switched on. If people need the assistant to search the web, that provider has to be a `responses` one.
:::

## Connection fields

| Field | Shown for | Purpose |
| --- | --- | --- |
| **Name** | All | Unique on this instance. Keys the stored credential. |
| **Type** | All | The service. Sets the protocol, narrows the sign-in methods below, and drives the vendor badge in chat. |
| **API shape** | All | `converse`, `chat_completions` or `responses`. Normally derived from the Type and shown as a sentence with an **Override** link. Only `responses` can carry web search. |
| **API version (optional)** | `responses` providers | Blank for a GA resource. Set `preview` for an Azure resource on the preview API. |
| **Region** | AWS and Azure types | The provider region, for example `us-east-1`. |
| **Endpoint** | Required for **Ollama** and **Other OpenAI-compatible API** | Where the provider is reached. For the other types it is optional and tucked behind a disclosure link, for a VPC/PrivateLink or Private Link endpoint, a custom domain, or a proxy. |

## Credentials fields

| Field | Purpose |
| --- | --- |
| **Sign-in method** | Narrowed to the methods the selected Type actually has. Platform identity is listed first because it stores no secret. |
| Credential id | The non-secret half of the credential, named for the method: **Access key ID**, **Role ARN (optional)**, **Client ID**, or **Managed identity (optional)**. Kept readable so the form can show which credential is configured. An **API key** is a single opaque value and has no companion field. |
| **Secret** / **Secret access key** | Stored encrypted, never shown again. Leave the mask to keep the current secret. |

:::caution[Platform identity is not a guaranteed default]
The platform-identity sign-in methods — **AWS IAM role (platform identity)**, **Entra ID managed identity (platform identity)** and **Entra ID service principal (platform identity)** — store no secret and resolve an identity at request time. Confirm with **Test connection** that the principal reported is the one you meant. If it fails to resolve, use a key-based method instead and raise the identity problem with your vendor.
:::

## Permitted models

Model ids are **typed, not discovered**. Nothing fetches a catalogue from the vendor, so the id you enter is the id used in the request — verbatim. Copy it from the vendor's console.

| Column | Default | Meaning |
| --- | --- | --- |
| **Model id** | — | The provider's own model id, used verbatim |
| **Display name** | Falls back to the id | What the chat model picker shows |
| **On** | On | Whether this instance may use the model |
| **Cost** | `1.0` | A relative multiplier **you** set. `1.0` means "the everyday model". Auto compares these to pick the cheapest capable model. Nothing fetches a price list. |
| **Auto** | Follows **On** | Whether Auto may pick this model |
| **Web** | Off | Provider-hosted web search. Shows `—` when the API shape cannot carry it |

For a `responses` provider only, each row also has a **deployment name** sub-field under the model id: what the request is addressed by when it differs from the model id. Azure routes by deployment name, so this is where an Azure deployment name goes.

:::note[Capabilities are not entered]
Context window, tool support and image support are **not** fields. They ship with the release, per model family. A model the release does not recognise is treated conservatively — small context, no tools, no images — so it is still offered for simple questions but is never chosen for Build or for a prompt containing an image. If a model you rely on behaves that way, check the id for a typo first.
:::

Saving is refused with an explanatory error if **Web** is on for a model whose API shape cannot carry web search.

## Which model should I enable?

- **At least one model that supports tools.** Build needs tool calls; a model without them can answer questions but cannot make changes.
- **One model that can read images**, if people will paste screenshots into the chat.
- **Cost ratings that mean something.** Leave your everyday model at `1.0`, rate a cheap small model below it and an expensive frontier model above it. Auto's "cheapest capable" choice is only as good as these numbers.
- **Auto on for the models you are happy to be picked automatically.** Turning Auto off for a model keeps it available in the picker while excluding it from automatic selection.

## How model availability is decided

A model is offered in the chat picker when its provider has a supported API shape, has credentials configured, and is reachable. When one of those is missing the model is **not hidden** — it appears greyed out with the reason, so an operator can see that a model exists and what is stopping it, rather than wondering where it went.

## Test connection

**Test connection** appears on a provider card in edit mode. It sends one fixed synthetic prompt — *reply with the single word: ok* — through exactly the path a real chat turn uses, then reports the principal the provider authenticated as and one row per enabled model.

It tests the **saved** provider, not what is currently typed into the form. So the order is:

1. Paste your values.
2. **Save**.
3. **Test connection**.

Each model row shows the stage it reached, because the stages have different fixes:

| Stage | What it means | What to do |
| --- | --- | --- |
| **OK** | The round trip worked. The row shows the reply, the latency and the token counts | Nothing |
| **Incomplete** | A field this provider needs is empty | Fill the field the card flags |
| **No credential** | No credential is stored for this provider | Enter the secret, or pick a sign-in method that matches what you have |
| **Bad credential** | The credential was rejected | Re-copy the key or secret from the vendor. Keys get rotated |
| **Not allowed** | The credential is valid but the policy is too narrow | Widen the IAM policy (or Azure role) to allow invoking this model |
| **Not enabled for account** | The vendor account is not entitled to this model | Grant model access on the vendor side. This is not a settings fix |
| **Rate limited** | The deployment's capacity is exhausted | Raise the deployment's TPM quota, or test fewer models at once |
| **Unknown model** | The provider does not recognise the model id | Re-copy the exact id from the vendor console |
| **Unreachable** | The request never arrived | Check network egress from the Linkiir host, and TLS trust for a private endpoint |
| **Failed** | The call errored for another reason | Read the detail on the row |

A pass is stamped with the time it was made. It is a fact about that moment, not a standing guarantee.

## Verify it worked

- **Test connection** reports **OK** for every model you enabled, and the principal shown is the one you intended.
- The chat model picker lists your enabled models under the right vendor badge, none of them greyed out.
- A short question in the chat panel gets an answer.

## Next

- [AWS Bedrock](aws-bedrock.md)
- [Azure OpenAI](azure-openai.md)
- [Azure AI Foundry](azure-ai-foundry.md)
- [OpenAI](openai.md)
- [xAI (Grok)](xai-grok.md)
- [MiniMax](minimax.md)
- [Ollama](ollama.md)
- [Other OpenAI-compatible API](openai-compatible.md)
- [Policy and Limits](../policy-and-limits.md)
