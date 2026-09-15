---
title: OpenAI
sidebar_label: OpenAI
description: Configure OpenAI as a Linkiir AI model provider — an API key, the endpoint, and the model ids the assistant may use.
keywords: [OpenAI, AI provider, API key, model provider, responses, web search, Linkiir AI]
sidebar_position: 5
---

# OpenAI

Reaches OpenAI's own API with a key from your OpenAI account.

This type is addressed using the **Responses** protocol, so **web search is possible** on its models — the **Web** column in the models table is available rather than greyed out.

The fields below are the standard provider fields. For what each one means on every provider type, see the [provider field reference](index.md).

## Before you start

- An OpenAI account with API access, and an idea of which models that account is entitled to.
- An API key. Create one on the API keys page of the OpenAI platform console — the full secret is shown only at the moment you create it, so copy it then. See [OpenAI's help article on finding your API key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key). *(Content was rephrased for compliance with licensing restrictions.)*
- The **AI settings** permission, and the exact model ids you intend to use. Ids are typed here, not discovered.

:::caution[Decide what may leave your environment]
Prompts sent to this provider leave your installation and reach OpenAI. Confirm that is permitted under your organisation's agreements before you enable a model, and set the limits in [Policy and Limits](../policy-and-limits.md).
:::

## Set it up

1. Go to **Settings → AI → Setup** and click **Edit**, then **Add provider**.
2. Set **Name** to something you will recognise, for example `openai`. It must be unique on the instance — the stored credential is keyed by it.
3. Set **Type** to **OpenAI**. The card then states that it is addressed using the **Responses** protocol, and that this protocol can carry web search.
4. Click **Route through a custom endpoint** and set **Endpoint** to your OpenAI API base URL. Read the caution below before you decide what to type here.
5. Leave **Sign-in method** on **API key**.
6. Paste the key into **Secret**. It is stored encrypted and never shown again.
7. Under **Permitted models**, type each model id exactly as OpenAI names it — a current GPT model id, for example `gpt-4o` — and give it a **Display name** if you want the chat picker to show something friendlier. Switch **On** for every model this instance may use, set **Cost** to your own relative rating, and set **Auto** and **Web** as you want them.
8. Click **Save**.
9. Click **Test connection** and read the row for each enabled model.

:::caution[The endpoint decides whether this type can reach your account]
Linkiir builds the request URL for this type from the **Endpoint** you supply, appending its own request path to it. Which value works depends on your account and on the release you are running, so there is no single URL this page can promise.

If **Test connection** reports **Unreachable** or **Failed**, set **Endpoint** explicitly to the full API URL for your account, **Save** again, and re-test. If it still fails, configure the same models through [Other OpenAI-compatible API](openai-compatible.md), or through [AWS Bedrock](aws-bedrock.md) or [Azure OpenAI](azure-openai.md) instead. Ask your vendor to confirm the supported endpoint form for your release.
:::

## Configuration reference

| Field | What to set for this type |
| --- | --- |
| **Name** | Anything unique on the instance. Keys the stored credential |
| **Type** | `OpenAI` |
| **API shape** | Derived as `responses`. Change it only through **Override**, and only if your service speaks a different protocol |
| **Region** | Not shown. This type is not addressed by region |
| **Endpoint** | Behind **Route through a custom endpoint**. Set it for this type — see the caution above |
| **Sign-in method** | **API key** (the default), or **Client certificate** where you terminate mTLS |
| **Secret** | The API key. Stored encrypted; leave the mask in place to keep the existing one |
| **Permitted models → Model id** | Typed verbatim, exactly as OpenAI names the model |
| **Permitted models → deployment name** | The second box under the model id. Leave blank unless the service addresses the model by a different name |
| **Permitted models → Web** | Available on this type. Turn it on per model to allow provider-hosted web search |

Context window, tool support and image support are not entered here — they ship with the release per model family. A model id the release does not recognise is treated conservatively: small context, no tools, no images. It is still offered for simple questions, but it is never picked for Build and never for an image.

## Verify it worked

- **Test connection** shows one row per enabled model, and every row reads **OK**.
- The provider's collapsed row shows the model count and no "incomplete" badge.
- In the chat model picker the models appear under the **OpenAI** vendor badge.
- A model with **Web** on shows the internet indicator in the picker.

## If it didn't work

| Test connection says | Cause | Fix |
| --- | --- | --- |
| **Incomplete** | A required field is empty, or no model is enabled | Fix the issue named on the provider's row, then **Save** and re-test |
| **No credential** | The **Secret** was never saved, or was cleared | Paste the key again and **Save** before testing |
| **Bad credential** | The key is wrong, revoked or rotated | Create a new key in the OpenAI console and paste it in |
| **Not allowed** | The key exists but is not permitted to call this model | Check the key's project and permissions in the OpenAI console |
| **Not enabled for account** | The account has no access to that model | Use a model the account is entitled to |
| **Rate limited** | The account's rate or quota limit was reached | Retry later, or raise the limit with OpenAI |
| **Unknown model** | The model id is misspelled or retired | Re-copy the id from OpenAI's model list. Ids are used verbatim |
| **Unreachable** / **Failed** | The **Endpoint** is not a form this release can address | Follow the caution above: set the endpoint explicitly, re-**Save**, re-test, then fall back to [Other OpenAI-compatible API](openai-compatible.md) |
| Save is refused, naming a model and web search | **Web** is on for a model whose API shape cannot carry it | Only the `responses` shape can. If you overrode the shape, either clear the override or turn **Web** off |
| Results look stale | **Test connection** tests the *saved* provider | The order is paste → **Save** → **Test connection** |

## Next

- [Provider field reference](index.md)
- [Other OpenAI-compatible API](openai-compatible.md)
- [xAI (Grok)](xai-grok.md)
- [Policy and Limits](../policy-and-limits.md)
- [Setting Up Linkiir AI](../index.md)
