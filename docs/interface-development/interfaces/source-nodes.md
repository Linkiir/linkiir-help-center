---
title: Source Nodes
---

# Source Nodes

A source node brings a message into the workflow. This page lists the fields for each source type and how to set them.

Fields marked **needed to start** must have a usable value before the node will start. Everything else has a working default or belongs to an optional mode.

The LLP and File/FTP sources are set up in a **Configure** dialog rather than in the panel's field list. See [Configure dialogs](index.md#configure-dialogs). The tables below list each node's fields by the tab and card they appear under.

---

## Source HTTP

Accepts inbound HTTP requests. Your script parses the request and sends the response.

| Field | Default | Notes |
| --- | --- | --- |
| **Route Path** | *(empty)* | **Needed to start.** The path this node answers, for example `/intake`. |
| **Worker Count** | `1` | **Needed to start**, and must be at least `1`. Concurrent requests handled. |

Its Lua script is created with the node and is also needed to start.

### The server is installation-wide

There is no port field on this node. Every HTTP source node answers on one embedded server, configured in **Settings → Http Server**: **Use Server**, **Port**, and optionally **Secure** with its certificate fields. See [HTTP Server Settings](../../administration/configurations/http-server.md).

```text
Settings → Http Server            port 9001
├─ /intake      → Source HTTP node "Intake"        (project A)
└─ /discharge   → Source HTTP node "Discharge"     (project B)
```

Consequences worth knowing:

- **Route Path** must be unique across every HTTP source node that is running, not just within one workflow. Two nodes claiming `/intake` cannot both answer it.
- Changing the port affects every HTTP source node on the installation.
- Turning **Use Server** off stops all of them.
- Enabling **Secure** makes every route HTTPS, not just some.
- Changing the port or any TLS field restarts the Runtime when saved, which stops and restarts every running node on the installation — not only the HTTP ones.

Prefix routes with the interface they belong to — `/adt/intake`, `/orders/intake` — so a second project cannot accidentally claim a path a first one already uses.

### Worker Count

How many requests the node handles simultaneously. Each worker is an independent script instance.

| Value | Behaviour |
| --- | --- |
| `1` | Strictly sequential. One request at a time, in order. |
| Higher | Concurrent. Requests are handed to a free worker, and queue briefly if all are busy. |

Raise it when concurrent inbound requests matter and your script does not depend on ordering. Leave it at `1` when you want predictable sequential handling.

Do not keep state in module-level variables when Worker Count is above `1`. Each worker has its own copy, so the behaviour depends on which worker took the request.

### Working with the request

`main(Data)` receives the complete raw HTTP request text. Parse it and respond:

```lua
function main(Data)
   local req, err = linkiir.link.web.request{ data = Data }
   if not req then
      linkiir.link.web.respond{ code = 400, body = "Bad request" }
      return
   end

   linkiir.flow.push{ data = req.body }

   linkiir.link.web.respond{
      code = 200,
      contentType = "application/json",
      body = '{"accepted":true}',
   }
end
```

A new HTTP source node starts from a default script that does roughly this: parse the request, answer `400` if it cannot be parsed, echo the body back (or `Hello from Linkiir` when the body is empty), and push the body downstream **only when it is not empty**. An empty request body is answered but not pushed, so a health check or a stray `GET` does not enqueue a blank message. Replace the default with your own handling before the node goes anywhere near production.

Method checks, path checks, authentication, and body size limits are yours to enforce in the script — there are no node fields for them. Reject what you do not accept with an explicit status code rather than letting it through.

:::caution[There is no authentication field on this node]
An HTTP source node answers any request that reaches its route. If the node needs to be reachable beyond your own machine, enforce authentication in the script and restrict access at the network layer. See [Security](../../administration/security/index.md).
:::

Walkthrough: [Edit the Script and Start the HTTP Server](../../getting-started/start-http-server.md).

---

## Source LLP

Accepts HL7 v2 messages over an MLLP socket and returns an ACK.

In **Node Parameters**, the node shows the port it listens on, for example `LLP · Port 5349`, or `LLP over TLS` with **Use SSL** on. It also shows the acknowledgment mode, whether idle connections are closed, the encoding and the delimiters. The **Configure** dialog has three tabs:

| Tab | Cards |
| --- | --- |
| **Connection** | **Listening**: the port and the idle timeout |
| **Messages** | **Acknowledgments**, **Encoding**, **Framing** |
| **Security** | **SSL/TLS**. The tab shows **On** when **Use SSL** is on. |

**Edit Ack**, under **Configure**, opens the node's ACK script, `ack.lua`, on the Scripting page. It replaces the **Edit Script** button other nodes have.

### Core fields

| Field | Default | Notes |
| --- | --- | --- |
| **Listen Port** | `5349` | **Needed to start**, and must be greater than `0`. |
| **Acknowledgment Mode** | `Default` | **Needed to start.** `Default` or `Custom`. |
| **Message Encoding** | `Western (ISO-8859-1)` | Character encoding of inbound messages. |
| **Connection Timeout** | off | Turn on to close idle connections. |
| **Connection Timeout Minutes** | `30` | Shown when **Connection Timeout** is on. |

With `Custom`, the node's `ack.lua` is also needed to start. Every LLP node is created with one.

### Framing

| Field | Default | Notes |
| --- | --- | --- |
| **LLP Delimiters** | `Normal LLP` | `Normal LLP` or `Custom`. |
| **Messages Begin After** | `\x0B` | Start byte, with `Custom`. |
| **Messages Continue Until** | `\x1C\x0D` | End bytes, with `Custom`. |

Leave **LLP Delimiters** on `Normal LLP` unless the sending system documents non-standard framing. Mismatched framing shows up as messages that never complete or connections that hang, rather than as a clear error.

### TLS

| Field | Default | Notes |
| --- | --- | --- |
| **Use SSL** | off | Turn on to accept TLS connections. |
| **Certificate File** | *(empty)* | Shown with **Use SSL**. |
| **Private Key File** | *(empty)* | Shown with **Use SSL**. |
| **Verify Peer** | off | Require and verify a client certificate. |
| **Certificate Authority File** | *(empty)* | Used when verifying the peer. |

### Choosing an acknowledgment mode

| Mode | Use when |
| --- | --- |
| `Default` | The sender accepts a standard ACK. Fastest, no script to maintain. |
| `Custom` | The sender requires specific ACK codes, application-level validation, or non-standard fields. |

With `Custom`, the node runs its `ack.lua`, and the value your script returns is sent back to the sender as the ACK. Open the script with **Edit Ack**.

A new node's `ack.lua` starts out answering every message with an `AA`, like `Default`. Change it to return an `AE` or `AR` for messages you don't accept.

:::caution[Nodes created before this release]
An older node's `ack.lua` returns nothing, so with `Custom` it sends no ACK. The sender then usually sends the message again, and each failure shows as a `No ACK sent` error on the **Logs** page. Write the script before switching an existing node to `Custom`.
:::

Decide deliberately what you acknowledge. An ACK sent before the message is safely handed onward tells the sender the message is accepted when it may not be — and once a sender has an ACK, it will not resend.

### What it logs

On the **Logs** page, alongside the message itself:

| Level | Line | When |
| --- | --- | --- |
| INFO | `Connection opened from <address>` / `Connection from <address> closed` | A sender connects or disconnects |
| INFO | `Closing the connection from <address>: idle for more than N min` | **Connection Timeout** closes an idle connection |
| WARN | `Ignored an empty frame from <address>; no ACK sent`, or a frame too short to be an HL7 message | The sender framed something that isn't a message. It gets no ACK. |
| WARN | `Closing the connection from <address>: N messages in a second, which looks like a loop` | A sender floods the node |
| ERROR | `No ACK sent: the ACK script …` | With `Custom`, the ACK script failed, timed out or returned nothing. It shows with the message under **Related messages**. The sender gets no ACK and will usually send the message again. |

The ACK the node sends back isn't logged.

---

## Source File/FTP

Polls a directory, or an FTP/FTPS/SFTP server, and creates one message per file.

In **Node Parameters**, the node shows where it reads from, either a local folder or the protocol, server, port and path. It also shows which files it picks up, how often it checks, what happens after reading, and the file type. The **Configure** dialog has three tabs:

| Tab | Cards |
| --- | --- |
| **Files** | **Picking up files**, **After reading** |
| **Content** | **File contents**, **HL7 and X12** |
| **FTP** | **FTP server**, **Sign in**, **Security**, **Remote files**, **Reconnecting**. The tab shows **On** when **Use FTP** is on. |

### Core fields

| Field | Default | Notes |
| --- | --- | --- |
| **Interval** | `10000` | **Needed to start**, and must be greater than `0`. Poll interval in milliseconds. |
| **Input Directory** | *(empty)* | **Needed to start.** Directory to poll. With **Use FTP** it isn't used, but still has to be set. |
| **File Extension** | *(empty)* | **Needed to start.** Which files to pick up. |
| **Minimum File Age** | `1` | Seconds a file must be untouched before it is read. |
| **Input File Type** | *(empty)* | `Arbitrary text`, `HL7`, or `X12`. |
| **Input File Encoding** | *(empty)* | Character encoding of file contents. |
| **Hex EOF Character** | *(empty)* | End-of-file marker, when the sender writes one. |

### HL7 and X12 input

| Field | Shown for | Notes |
| --- | --- | --- |
| **Ignored Segments List** | HL7, X12 | Segments to skip. |
| **Replace Segment Delimiter With** | HL7 | `0x0D`, for files whose segments end with something else. |
| **Replace Message Delimiter** | HL7 | `Yes, with '0x0A'`. |

:::caution[Set Minimum File Age when a sender writes in place]
A poller can read a file the sender is still writing, producing a truncated message. Set **Minimum File Age** to a few seconds, or ask the sender to write to a temporary name and rename on completion. A rename is atomic and needs no age delay.
:::

### After a local file is processed

| Field | Options |
| --- | --- |
| **Processed Files** | `Delete processed files` or `Move processed files` |
| **Processed File Path** | Where successful files go, with `Move processed files` |
| **Error File Path** | Where failed files go |

Prefer `Move processed files` over deleting. A directory of processed files is the fastest way to answer "did we receive it?", and it lets you re-drop a file to reprocess it.

### FTP, FTPS, and SFTP

Turn on **Use FTP** to poll a remote server instead of a local directory.

| Field | Default | Notes |
| --- | --- | --- |
| **FTP Protocol** | `FTP` | `FTP`, `FTPS (FTP over SSL)`, or `SFTP (Secure Shell FTP)`. |
| **Authentication** | `Username/Password` | `Username/Password` or `Private/Public Key`. Shown for SFTP. |
| **FTP Server** | *(empty)* | **Needed to start** when **Use FTP** is on. |
| **FTP Port** | `21` | |
| **FTP Username** | *(empty)* | **Needed to start** when **Use FTP** is on. |
| **FTP Password** | *(empty)* | Used for FTP, FTPS, and SFTP with `Username/Password`. SFTP key sign-in doesn't use it. |
| **FTP Path** | *(empty)* | Remote directory to poll, as a path on the server. |
| **Certificate File**, **FTPS Private Key File** | *(empty)* | For FTPS. |
| **SFTP Private Key File**, **Public Key File** | *(empty)* | For SFTP with `Private/Public Key`. |
| **Verify Peer** | off | For FTPS. Turn on outside a trusted network. |
| **Verify Host Fingerprint** | off | For SFTP. Turn on outside a trusted network. |
| **Attempt to Reconnect** | `No` | `No`, `Yes (unlimited)`, or `Yes, with limit`. |
| **Reconnect Attempts** | `60` | With `Yes, with limit`. |
| **Reconnect Interval** | `10000` | Milliseconds between attempts. |

After a remote file is downloaded and its messages are sent, **Remote Processed Files** decides what happens to it on the server:

- `Delete remote files after downloading`.
- `Move remote files after downloading to another remote directory`. Set **FTP Path for Downloaded Files**, which is **needed to start** with this option. A path starting with `/` is used as it is; any other path is under **FTP Path**, so `done` with an FTP Path of `/inbound` means `/inbound/done`. The directory must already exist on the server.

If a message can't be sent, the file stays on the server and is downloaded again on the next poll. The download is a temporary copy that is removed once read, so **Processed Files**, **Processed File Path** and **Error File Path** apply only to local files.

:::note[Remote Processed Files in earlier releases]
Earlier releases ignored **Remote Processed Files** and **FTP Path for Downloaded Files**. A downloaded file was handled by the local **Processed Files** setting instead, so it was usually deleted from the server. With an **FTP Path** set, the delete itself failed and the file was downloaded again on every poll. Check any FTP source that was set to move remote files.
:::

:::note[FTP and FTPS passwords]
Earlier releases showed **FTP Password** only for SFTP, so plain FTP and FTPS signed in with an empty password. Existing nodes are updated when Linkiir starts. Check the password on any FTP or FTPS node configured before.
:::

Choose SFTP or FTPS over plain FTP. Plain FTP sends credentials and file contents unencrypted.

Put the password in the project's **Variables** tab flagged **Secret**, and reference it, rather than typing it into the node. See [Project Settings](../../administration/configurations/project-settings.md).

### What it logs

On the **Logs** page, alongside each message. `<file>` is the local path, or for FTP the server address and path, such as `ftp://files.example.com:21/inbound/a.hl7`.

| Level | Line | When |
| --- | --- | --- |
| INFO | `Read from <file> (message 2 of 3)` | Each message. It shows with the message under **Related messages**, so you can see which file it came from. |
| INFO | `Read 3 message(s) from <file>; moved it to <path>` | Each file, once its messages are sent. The end says what happened to the file: `deleted it`, `moved it to …`, or for FTP `deleted it from the server` or `moved it to … on the server`. |
| INFO | `Skipped empty file <file>; deleted it` | An empty file. It creates no message. |
| WARN | `Couldn't connect to <server>: … Trying again in 10 s (attempt 1 of 60)` | With **Attempt to Reconnect** on, before each reconnect attempt. `Reconnected to <server> after N attempt(s)` follows when one succeeds. |
| ERROR | `Couldn't open <file>: …` | A local file can't be read. It goes to **Error File Path** if set, otherwise it stays and is tried again next poll. |
| ERROR | `Couldn't download <file>: …` | An FTP download fails. The file stays on the server and is downloaded again next poll. |
| ERROR | `Sending message 2 of 3 from <file> failed: … 1 message(s) from it were sent; …` | A message couldn't be handed on partway through a file. The end says where the file went. If it's read again, the messages already sent are sent again. |
| ERROR | `Read 3 message(s) from <file>, but …` | The messages went, but moving or deleting the file failed. A local file isn't read again. A remote file is downloaded again next poll, sending its messages again. |

If the node is stopped partway through a file, the file is left where it is and read again when the node starts.

---

## Source Custom

Runs your script on a timer. Use it when you fetch data yourself — from an API, a database, or a computation — rather than receiving it.

| Field | Default | Notes |
| --- | --- | --- |
| **Interval** | `10000` | **Needed to start**, and must be greater than `0`. Milliseconds between runs. |

Its Lua script is also needed to start.

`main` is called with **no argument** on this node type — there is no inbound message. Fetch or build your data and push each message:

```lua
function main()
   local resp, err = linkiir.link.web.get{
      url = "https://api.example.com/pending",
      timeout = 15,
   }
   if not resp then
      error("fetch failed: " .. err.message)
   end
   if resp.code >= 400 then
      error("source returned " .. resp.code)
   end

   linkiir.flow.push{ data = resp.body }
end
```

Declaring `main(Data)` here is harmless, but `Data` will be `nil`. Write `main()` so the signature matches what actually happens.

### Interval guidance

| Interval | Suits |
| --- | --- |
| `1000`–`5000` | Near-real-time polling of a fast, cheap source |
| `10000`–`60000` | Normal polling of an API or directory |
| Minutes | Batch pulls, scheduled extracts |

Keep the run shorter than the interval. A run that regularly takes longer than its interval means the node is always busy and the schedule stops being meaningful.

There is no cron-style schedule. For "once a day at 02:00", poll at a sensible interval and have the script decide whether it is time to act.

---

## Handling script errors

Custom nodes run your code, so a script error is a case you need to decide about. Whether an error stops the node or is skipped is behaviour of the node's error handling — see [Error Handling and Retry](../error-handling.md) for how to choose, and for keeping payload content out of error text.

For clinical interfaces, prefer stopping. A node that quietly skips messages can discard a day of data before anyone notices, and the durable queue means stopping loses nothing.

---

## Next

- [Destination Nodes](destination-nodes.md)
- [Custom Scripting Nodes](custom-scripting-nodes.md)
- [Linkiir Scripting API](../../api/scripting-api/index.md)
