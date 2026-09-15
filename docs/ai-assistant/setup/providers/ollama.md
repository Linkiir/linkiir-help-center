---
title: Ollama (self-hosted)
sidebar_label: Ollama (self-hosted)
description: Configure a self-hosted Ollama server as a Linkiir AI model provider — the required endpoint, an optional key for a gateway, and the model names the assistant may use.
keywords: [Ollama, self-hosted, local model, AI provider, chat completions, endpoint, Linkiir AI]
sidebar_position: 8
---

# Ollama (self-hosted)

Reaches an Ollama server you run yourself, on your own network.

This type is addressed using the **Chat Completions** protocol. That protocol has nowhere to put a server-side search tool, so **web search is not available** here: the **Web** column shows **—** for every model. The **Endpoint** is required — a self-hosted provider has no public address to fall back on.

The fields below are the standard provider fields. For what each one means on every provider type, see the [provider field reference](index.md).

## Before you start

- Ollama installed and running somewhere **the Linkiir server** can reach. Reachable from your own laptop is not the same thing.
- At least one model pulled on that host, with `ollama pull <model>`, and the model's name to hand — that name is what you type as the model id.
- The OpenAI-compatible chat-completions URL your Ollama exposes. Ollama serves OpenAI-compatible routes under a `/v1` path alongside its native API; see [Ollama's OpenAI compatibility docs](https://docs.ollama.com/api/openai-compatibility). *(Content was rephrased for compliance with licensing restrictions.)*
- The **AI settings** permission.
- A key only if you have put an authenticating gateway or reverse proxy in front of Ollama. A bare Ollama usually needs none.

:::note[A self-hosted model keeps prompts on your own network]
Nothing leaves your network with this provider, which some sites require and many prefer. The trade-off is capability: small local models often have no tool support, so **Build** may be unavailable on them and the model picker will say so. Keep a tool-capable provider configured alongside if people need Build.
:::

## Set it up

1. Go to **Settings → AI → Setup** and click **Edit**, then **Add provider**.
2. Set **Name** to something you will recognise, for example `ollama-local`. It must be unique on the instance — the stored credential is keyed by it.
3. Set **Type** to **Ollama (self-hosted)**. The card then states that it is addressed using the **Chat Completions** protocol, and that this protocol cannot carry web search.
4. Fill in **Endpoint**. It is shown straight away for this type because it is required. Enter the complete OpenAI-compatible chat-completions URL that your Ollama exposes, reachable from the Linkiir server.
5. Leave **Sign-in method** on **API key**. Paste a key into **Secret** only if a gateway in front of Ollama demands one; otherwise leave it empty.
6. Under **Permitted models**, type each pulled model's name as the **Model id** — exactly as `ollama list` shows it, tag included. Add a **Display name** if you want a friendlier label in the chat picker, and switch **On** for every model this instance may use. Set **Cost** and **Auto** as you want them. **Web** is not offered.
7. Click **Save**.
8. Click **Test connection** and read the row for each enabled model.

:::caution[Enter the complete URL]
For a `chat_completions` provider Linkiir sends the request to the **Endpoint exactly as entered**. Enter the full OpenAI-compatible chat-completions URL that your Ollama exposes, not just `http://localhost:11434`. If **Test connection** reports **Unreachable** or **Failed**, the endpoint is the first thing to check.
:::

:::caution[`localhost` means the Linkiir server, not your machine]
The endpoint is resolved by the Linkiir server. `localhost` there is the Linkiir host itself, so it works only if Ollama runs on that same host. Otherwise use a hostname or address the server can reach.
:::

## Configuration reference

| Field | What to set for this type |
| --- | --- |
| **Name** | Anything unique on the instance. Keys the stored credential |
| **Type** | `Ollama (self-hosted)` |
| **API shape** | Derived as `chat_completions`. Change it only through **Override**, and only if you front Ollama with something that speaks a different protocol |
| **Region** | Not shown. This type is not addressed by region |
| **Endpoint** | **Required.** The complete OpenAI-compatible chat-completions URL, sent exactly as entered |
| **Sign-in method** | **API key** — the only method offered for this type |
| **Secret** | Only needed for an authenticating gateway in front of Ollama. Leave empty for a bare Ollama |
| **Permitted models → Model id** | The pulled model's name, typed verbatim, tag included |
| **Permitted models → Web** | Shows **—**. This protocol cannot carry web search |

Context window, tool support and image support are not entered here — they ship with the release per model family. A local model the release does not recognise is treated conservatively: small context, no tools, no images. It is still offered for simple questions, but it is never picked for Build and never for an image.

## Verify it worked

- **Test connection** shows one row per enabled model, and every row reads **OK**.
- The provider's collapsed row shows the model count and no "incomplete" badge.
- In the chat model picker the models appear under the **Ollama** vendor badge, with no internet indicator.
- If the picker marks a model as unavailable for **Build**, that model has no tool support — expected on many small local models.

## If it didn't work

| Test connection says | Cause | Fix |
| --- | --- | --- |
| Connection refused, reported as **Unreachable** | Ollama is not running, or is not reachable **from the Linkiir server** — reachable from your laptop is not enough | Start Ollama on its host, then confirm the Linkiir server can reach that host and port. Check firewall rules and any container or network boundary between them |
| **Unreachable** with the right host | Ollama is bound only to loopback on its own machine | Bind it to an address the Linkiir server can reach, or run it on the Linkiir host |
| **Failed** | The endpoint answered, but not with a chat-completions response | Usually the native Ollama path rather than the OpenAI-compatible one. Re-check the complete URL |
| **Incomplete** | **Endpoint** is empty, or no model is enabled | The row says which. Fill it, **Save**, re-test |
| **Unknown model** | The model is not pulled on that host, or the name or tag is wrong | Run `ollama pull <model>`, then copy the name from `ollama list`. Ids are used verbatim |
| **Bad credential** | A gateway in front of Ollama rejected the key | Correct the key, or remove the gateway requirement |
| Answers arrive but **Build** is unavailable | The local model has no tool support | Use a tool-capable model for Build, from this or another provider |
| Results look stale | **Test connection** tests the *saved* provider | The order is paste → **Save** → **Test connection** |

## Next

- [Provider field reference](index.md)
- [Other OpenAI-compatible API](openai-compatible.md)
- [Policy and Limits](../policy-and-limits.md)
- [Setting Up Linkiir AI](../index.md)
