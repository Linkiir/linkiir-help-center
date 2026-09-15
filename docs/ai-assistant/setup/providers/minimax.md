---
title: MiniMax
sidebar_label: MiniMax
description: Configure MiniMax as a Linkiir AI model provider — an API key, the full chat-completions URL, and the model ids the assistant may use.
keywords: [MiniMax, AI provider, API key, chat completions, model provider, Linkiir AI]
sidebar_position: 7
---

# MiniMax

Reaches MiniMax's own API with a key from your MiniMax account.

This type is addressed using the **Chat Completions** protocol. That protocol has nowhere to put a server-side search tool, so **web search is not available** here: the **Web** column shows **—** for every model.

The fields below are the standard provider fields. For what each one means on every provider type, see the [provider field reference](index.md).

## Before you start

- A MiniMax account with API access.
- An API key. Create one from the API Keys area of the MiniMax platform console. MiniMax also documents the OpenAI-compatible base URL your account should use, and the base differs by service region — check which applies to yours in [MiniMax's quickstart](https://platform.minimax.io/docs/guides/quickstart-preparation). *(Content was rephrased for compliance with licensing restrictions.)*
- The **AI settings** permission, and the exact MiniMax model ids you intend to use. Ids are typed here, not discovered.

:::caution[Decide what may leave your environment]
Prompts sent to this provider leave your installation and reach MiniMax. Confirm that is permitted under your organisation's agreements before you enable a model, and set the limits in [Policy and Limits](../policy-and-limits.md).
:::

## Set it up

1. Go to **Settings → AI → Setup** and click **Edit**, then **Add provider**.
2. Set **Name** to something you will recognise, for example `minimax`. It must be unique on the instance — the stored credential is keyed by it.
3. Set **Type** to **MiniMax**. The card then states that it is addressed using the **Chat Completions** protocol, and that this protocol cannot carry web search.
4. Click **Route through a custom endpoint** and set **Endpoint** to the full chat-completions URL for your MiniMax account, taking the base from the vendor's documented endpoint for your region and adding the chat-completions path.
5. Leave **Sign-in method** on **API key**.
6. Paste the key into **Secret**. It is stored encrypted and never shown again.
7. Under **Permitted models**, type each MiniMax model id exactly as MiniMax names it, add a **Display name** if you want a friendlier label in the chat picker, and switch **On** for every model this instance may use. Set **Cost** and **Auto** as you want them. **Web** is not offered.
8. Click **Save**.
9. Click **Test connection** and read the row for each enabled model.

:::caution[Enter the complete URL]
For a `chat_completions` provider Linkiir sends the request to the **Endpoint exactly as entered**. Enter the full chat-completions URL for the service, not just its host. If **Test connection** reports **Unreachable** or **Failed**, the endpoint is the first thing to check.
:::

:::note[MiniMax models are also available through Bedrock]
If your AWS account is entitled to the MiniMax models on Bedrock, you can configure them there instead — see [AWS Bedrock](aws-bedrock.md). That route uses your AWS credential rather than a MiniMax key, and is addressed by region.
:::

## Configuration reference

| Field | What to set for this type |
| --- | --- |
| **Name** | Anything unique on the instance. Keys the stored credential |
| **Type** | `MiniMax` |
| **API shape** | Derived as `chat_completions`. Change it only through **Override**, and only if your service speaks a different protocol |
| **Region** | Not shown. This type is not addressed by region — the region is part of the URL you enter |
| **Endpoint** | Behind **Route through a custom endpoint**. The complete chat-completions URL, sent exactly as entered |
| **Sign-in method** | **API key** (the default), or **Client certificate** where you terminate mTLS |
| **Secret** | The MiniMax API key. Stored encrypted; leave the mask in place to keep the existing one |
| **Permitted models → Model id** | Typed verbatim, exactly as MiniMax names the model |
| **Permitted models → Web** | Shows **—**. This protocol cannot carry web search |

Context window, tool support and image support are not entered here — they ship with the release per model family. A model id the release does not recognise is treated conservatively: small context, no tools, no images. It is still offered for simple questions, but it is never picked for Build and never for an image.

## Verify it worked

- **Test connection** shows one row per enabled model, and every row reads **OK**.
- The provider's collapsed row shows the model count and no "incomplete" badge.
- In the chat model picker the models appear under the **MiniMax** vendor badge, with no internet indicator.

## If it didn't work

| Test connection says | Cause | Fix |
| --- | --- | --- |
| **Unreachable** | The **Endpoint** is wrong, or the Linkiir server cannot reach it | Check the full URL first, then outbound network access and any proxy |
| **Failed** | The endpoint answered, but not with a chat-completions response | Usually a host or path that is not the chat-completions URL. Re-check the complete URL |
| **Incomplete** | A required field is empty, or no model is enabled | Fix the issue named on the provider's row, then **Save** and re-test |
| **No credential** | The **Secret** was never saved, or was cleared | Paste the key again and **Save** before testing |
| **Bad credential** | The key is wrong, or belongs to a different service region | Re-copy the key, and confirm the endpoint matches the region the key was issued for |
| **Not allowed** | The key is not permitted to call this model | Check the key's permissions in the MiniMax console |
| **Not enabled for account** | The account has no access to that model | Use a model the account is entitled to |
| **Rate limited** | The account's rate or quota limit was reached | Retry later, or raise the limit with MiniMax |
| **Unknown model** | The model id is misspelled or retired | Re-copy the id from MiniMax's model list. Ids are used verbatim |
| Save is refused, naming a model and web search | **Web** was switched on before the type was set to MiniMax | Turn **Web** off — this protocol has no way to carry it |
| Results look stale | **Test connection** tests the *saved* provider | The order is paste → **Save** → **Test connection** |

## Next

- [Provider field reference](index.md)
- [AWS Bedrock](aws-bedrock.md)
- [Other OpenAI-compatible API](openai-compatible.md)
- [Policy and Limits](../policy-and-limits.md)
- [Setting Up Linkiir AI](../index.md)
