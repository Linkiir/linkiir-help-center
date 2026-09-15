---
title: Other OpenAI-compatible API
sidebar_label: Other OpenAI-compatible API
description: Configure any OpenAI-compatible service or gateway as a Linkiir AI model provider — the required endpoint, a key or client certificate, and the model ids the assistant may use.
keywords: [OpenAI-compatible, LLM gateway, proxy, AI provider, chat completions, endpoint, Linkiir AI]
sidebar_position: 9
---

# Other OpenAI-compatible API

The catch-all. Use this type for anything that exposes an OpenAI-compatible API and is not one of the named types: a corporate LLM gateway, an inference service, or a proxy sitting in front of another vendor.

It is addressed using the **Chat Completions** protocol, so **web search is not available** by default — the **Web** column shows **—** for every model. The **Endpoint** is required: there is no public default for this type.

The fields below are the standard provider fields. For what each one means on every provider type, see the [provider field reference](index.md).

## Before you start

From whoever runs the service:

- The complete chat-completions URL, reachable from the Linkiir server.
- A credential: an API key, or a client certificate where the service uses mTLS.
- The model ids the service expects. Ids are typed here verbatim, not discovered, and a gateway often renames models — ask rather than assume.
- Whether the service speaks OpenAI's Chat Completions protocol or the Responses protocol.

You will also need the **AI settings** permission.

:::caution[Decide what may leave your environment]
Unless the service runs inside your own network, prompts sent here leave your installation. Confirm the route is permitted under your organisation's agreements before you enable a model, and set the limits in [Policy and Limits](../policy-and-limits.md).
:::

## Set it up

1. Go to **Settings → AI → Setup** and click **Edit**, then **Add provider**.
2. Set **Name** to something you will recognise, for example `corp-gateway`. It must be unique on the instance — the stored credential is keyed by it.
3. Set **Type** to **Other OpenAI-compatible API**. The card then states that it is addressed using the **Chat Completions** protocol, and that this protocol cannot carry web search.
4. Fill in **Endpoint**. It is shown straight away for this type because it is required. Enter the complete chat-completions URL.
5. Set **Sign-in method** to **API key** or **Client certificate**, and put the credential in **Secret**. It is stored encrypted and never shown again.
6. Under **Permitted models**, type each **Model id** exactly as the service expects it, add a **Display name** if you want a friendlier label in the chat picker, and switch **On** for every model this instance may use. Set **Cost** and **Auto** as you want them.
7. Click **Save**.
8. Click **Test connection** and read the row for each enabled model.

:::caution[Enter the complete URL]
For a `chat_completions` provider Linkiir sends the request to the **Endpoint exactly as entered**. Enter the full chat-completions URL for the service, not just its host. If **Test connection** reports **Unreachable** or **Failed**, the endpoint is the first thing to check.
:::

:::note[If the service speaks a different protocol, override the API shape]
The **API shape** is derived from the **Type**, and stated on the card as a sentence with an **Override** link next to it. Click **Override** and choose the protocol the service actually speaks. Choosing **Responses** is also what makes the **Web** column available, so a gateway that carries a server-side web-search tool can be used for web search. Clear the override to follow the type again.
:::

## Configuration reference

| Field | What to set for this type |
| --- | --- |
| **Name** | Anything unique on the instance. Keys the stored credential |
| **Type** | `Other OpenAI-compatible API` |
| **API shape** | Derived as `chat_completions`. Use **Override** if the service speaks Responses instead |
| **Region** | Not shown. This type is not addressed by region |
| **Endpoint** | **Required.** The complete chat-completions URL, sent exactly as entered |
| **Sign-in method** | **API key** (the default), or **Client certificate** for mTLS |
| **Secret** | The key or certificate material. Stored encrypted; leave the mask in place to keep the existing one |
| **Permitted models → Model id** | Typed verbatim, exactly as the service names the model |
| **Permitted models → Web** | Shows **—** on `chat_completions`. Available only if you override the shape to `responses` |

Context window, tool support and image support are not entered here — they ship with the release per model family, matched on the model id. A gateway that renames models may therefore produce ids the release does not recognise; those are treated conservatively (small context, no tools, no images), so they are offered for simple questions but never picked for Build or for an image. Where the gateway lets you keep the vendor's own id, keep it.

## Verify it worked

- **Test connection** shows one row per enabled model, and every row reads **OK**.
- The provider's collapsed row shows the model count and no "incomplete" badge.
- The models appear in the chat model picker under a vendor badge derived from the type.

## If it didn't work

| Test connection says | Cause | Fix |
| --- | --- | --- |
| **Unreachable** | The **Endpoint** is wrong, or the Linkiir server cannot reach it | Check the full URL first, then outbound access, DNS, and any proxy between the server and the service |
| **Failed** | The endpoint answered, but not with a response this protocol can read | Either the URL is not the chat-completions path, or the service speaks a different protocol. Re-check the URL, then try **Override** on the API shape |
| **Incomplete** | **Endpoint** is empty, or no model is enabled | The row says which. Fill it, **Save**, re-test |
| **No credential** | The **Secret** was never saved, or was cleared | Paste the credential again and **Save** before testing |
| **Bad credential** | The key or certificate was rejected | Re-issue it with whoever runs the service |
| **Not allowed** | The credential is not permitted to call this model | Ask for the model to be added to the credential's allow list |
| **Rate limited** | The service's rate or quota limit was reached | Retry later, or raise the limit with whoever runs the service |
| **Unknown model** | The id is not one the service recognises | Ask for the exact id list. Ids are used verbatim |
| Save is refused, naming a model and web search | **Web** is on while the shape is `chat_completions` | Either override the shape to `responses`, or turn **Web** off |
| Results look stale | **Test connection** tests the *saved* provider | The order is paste → **Save** → **Test connection** |

## Next

- [Provider field reference](index.md)
- [OpenAI](openai.md)
- [Ollama (self-hosted)](ollama.md)
- [Policy and Limits](../policy-and-limits.md)
- [Setting Up Linkiir AI](../index.md)
