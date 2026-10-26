---
title: Destination Nodes
---

# Destination Nodes

A destination node delivers a message out of the workflow. It consumes from the node connected before it and performs the external side effect.

Fields marked **needed to start** must have a usable value before the node will start.

The LLP, File/FTP and Database destinations are set up in a **Configure** dialog, like every node. See [The Configure dialog](index.md#the-configure-dialog). The tables below list each node's fields by the tab and card they appear under. Every dialog also starts with **General** and ends with **Advanced**, which hold the node's name, description, logging, encryption and permissions.

---

## Destination LLP

Sends HL7 v2 over MLLP to a remote host and handles the ACK.

In **Node Parameters**, the node shows where it sends, for example `LLP · lab.example.org:5145`, or `LLP over TLS` with **Use SSL** on. It has a card for each tab of the **Configure** dialog. Between **General** and **Advanced**, they are:

- **Connection:** the connection mode and reconnecting.
- **Messages:** the encoding and delimiters.
- **Acknowledgments:** how long it waits, how ACKs are checked, when and how often messages are resent, and the ACK error handling.
- **Security:** TLS and certificate checks.
- **Custom Parameters:** each of yours with its value.

Between **General** and **Advanced**, the **Configure** dialog has five tabs:

| Tab | Cards |
| --- | --- |
| **Connection** | **Remote server**, **Staying connected** |
| **Messages** | **Encoding**, **Framing** |
| **Acknowledgments** | **Waiting for an ACK**, **Resending** |
| **Security** | **SSL/TLS**. The tab shows **On** when **Use SSL** is on. |
| **Custom Parameters** | Fields of your own. See [Custom Parameters](index.md#custom-parameters). |

**Edit Ack**, under **Configure**, opens the node's `ack.lua` on the Scripting page. The node runs it only with **Ack Verification** set to `Custom`.

### Core fields

| Field | Default | Notes |
| --- | --- | --- |
| **Remote Host** | `localhost` | **Needed to start.** Hostname or IP of the receiving system. |
| **Remote Port** | `5145` | **Needed to start**, and must be greater than `0`. |
| **Message Encoding** | `Western (ISO-8859-1)` | Character encoding for outbound messages. |
| **Escape 8-Bit Characters** | off | Escape high-bit characters in the outbound stream. |
| **Persistent Connection** | `Yes` | `Yes` reuses one connection; `No` connects per message. |

:::caution[Check Remote Host before you start]
The default is `localhost`, which is a valid value — so a node you forgot to configure starts cleanly and sends nowhere useful. Set it deliberately, and check it after importing a project from another environment.
:::

### Framing

| Field | Default |
| --- | --- |
| **LLP Delimiters** | `Normal LLP` |
| **Messages Begin After** | `\x0B` |
| **Messages Continue Until** | `\x1C\x0D` |

### Acknowledgment

| Field | Default | Notes |
| --- | --- | --- |
| **Wait for Ack** | on | Whether to wait for an ACK before treating the message as delivered. |
| **Ack Timeout** | `10000` | Milliseconds to wait for the ACK. |
| **Ack Verification** | `Any message` | `Any message`, `Original ID and message type` for a strict match, or `Custom` to decide in the node's `ack.lua`. See [Custom ACK verification](#custom-ack-verification). |
| **Ack Error Handling** | `Stop channel` | `Stop channel`, `Queue message`, or `Discard message`. |

### Resend and reconnect

| Field | Default | Notes |
| --- | --- | --- |
| **Resend on Ack Timeout** | on | Resend when no ACK arrives within **Ack Timeout**. A connection that drops before the ACK is always resent. |
| **Resend on Ack Verification Failure** | off | Shown with `Original ID and message type` and `Custom`. Resend when the receiver rejects the message, or the ACK doesn't match it or isn't accepted by the script. Off, and always under `Any message`, a rejected message goes straight to **Ack Error Handling**. |
| **Resend Attempts Unlimited** | off | |
| **Resend Attempts** | `5` | |
| **Disconnect Between Resends** | on | Close and reopen the connection before each resend. |
| **Resend Interval** | `10000` | Milliseconds to wait before resending, with **Disconnect Between Resends** on. |
| **Attempt to Reconnect** | `Yes, with limit` | `No`, `Yes`, or `Yes, with limit`. |
| **Reconnect Attempts** | `60` | With `Yes, with limit`. |
| **Reconnect Interval** | `10000` | Milliseconds between attempts. |

A node sitting in its reconnect wait still stops when you stop it — it does not finish the interval first. Stopping a whole workflow or project joins each node in turn, so a large one takes proportionally longer to come to a stop; wait for the state to settle rather than clicking again.

### TLS

| Field | Default | Notes |
| --- | --- | --- |
| **Use SSL** | off | Turn on to connect over TLS. |
| **Certificate File** | *(empty)* | Shown with **Use SSL**. A client certificate, when the receiver asks for one. |
| **Private Key File** | *(empty)* | Shown with **Use SSL**. |
| **Verify Peer** | **on** | Shown with **Use SSL**. Checks the receiver's certificate. |
| **Certificate Authority File** | *(empty)* | Used when verifying the peer. |

:::note[Set Use SSL on both ends deliberately]
**Use SSL** is off by default on both LLP nodes, but once it's on, **Verify Peer** defaults to on here and off on Source LLP. A TLS mismatch usually looks like a connection that opens and immediately drops. When connecting two Linkiir installations, or a receiver that expects TLS, set both ends explicitly rather than relying on defaults.
:::

### Choosing Ack Error Handling

This is the most consequential setting on the node. It decides what happens when a message isn't acknowledged: the receiver rejects it, the ACK doesn't match it, or no ACK comes, once any resends have run out.

A **rejection** is an ACK whose MSA-1 code is `AE` (application error), `AR` (application reject), `CE` or `CR`. It is never treated as delivered, whichever **Ack Verification** you choose.

| Setting | Behaviour | Use when |
| --- | --- | --- |
| `Stop channel` | The node stops | Safest default. A rejection needs a human decision, and stopping preserves order and prevents a flood of failures. |
| `Queue message` | The message is held and the node continues | Rejections are expected for individual messages and must be retained for review. |
| `Discard message` | The message is dropped and the node continues | Rarely appropriate for clinical or financial data. Choose it only when loss is genuinely acceptable. |

Start with `Stop channel`. It surfaces a receiver problem immediately instead of letting hundreds of messages fail unnoticed. Stopping is safe: unprocessed messages wait in the durable queue.

### Wait for Ack and Ack Verification

| Combination | Meaning |
| --- | --- |
| **Wait for Ack** off | Delivered once written to the socket. Fastest, weakest guarantee. |
| On, `Any message` | Any reply counts as the acknowledgment, unless it is a rejection. |
| On, `Original ID and message type` | The reply must be an ACK (MSH-9) whose MSA-2 names the sent message's control ID (MSH-10), with code `AA` or `CA`. An ACK for any other message doesn't count. Strongest guarantee. |
| On, `Custom` | The node's `ack.lua` decides, after rejections are ruled out. |

Use `Original ID and message type` when the receiver may respond out of order or on a shared connection. Without it, an ACK for one message can be credited to another — which means a message that was actually rejected is recorded as delivered.

### Custom ACK verification

With **Ack Verification** set to `Custom`, the node's `ack.lua` decides whether each ACK counts. Open it with **Edit Ack**. `main(Ack, Message)` gets the ACK and the message it answers. It returns `true` to accept the ACK, or `false` and a reason:

```lua
function main(Ack, Message)
   local sent = Message:match("^MSH|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|[^|]*|([^|]*)")
   if Ack:find("MSA|AA|" .. sent, 1, true) then
      return true
   end
   return false, "the ACK doesn't accept control ID " .. sent
end
```

- **A new node's `ack.lua`** accepts an ACK whose MSA-2 names the sent message's control ID, like `Original ID and message type`. Change it to check what your receiver needs.
- **A rejection** (`AE`, `AR`, `CE`, `CR`) fails before the script runs, so a script can't accept one.
- **An ACK the script doesn't accept** is resent with **Resend on Ack Verification Failure**, then handled as **Ack Error Handling** says. Its reason shows in the logs.
- **When the script itself fails**, the node stops and logs the error, like any script failing. A failure means an error, a return that isn't `true` or `false`, or taking more than 5 seconds. The message isn't marked delivered, so it is sent again once the node is restarted.
- **The script only runs when an ACK arrives.** A timeout or a dropped connection is handled by the node as usual.

The node won't start with `Custom` if it has no `ack.lua`, or if the script doesn't compile.

### Persistent Connection

Set `Yes` when the receiver expects a long-lived connection and the volume justifies it. Set `No` when the receiver is intolerant of idle connections, or when a network device between you closes them silently — a closed-but-not-noticed connection produces confusing timeouts.

### What it logs

Each line shows with the message it is about, under **Related messages** on the **Logs** page:

| Level | Line | When |
| --- | --- | --- |
| INFO | `Received ACK AA for control ID 123 in 42 ms` | An ACK arrives and passes **Ack Verification**: its code (MSA-1), the control ID it names (MSA-2), and how long after sending it came |
| WARN | `Resending the message (attempt 2 of 6): <why>` | A resend, and why: `no ACK within 10000 ms`, `the connection closed before an ACK arrived`, or the ACK that didn't pass verification |
| WARN | `Couldn't connect to <host>:<port> (attempt 3 of 60): <error>; trying again in 10000 ms` | Each failed connection attempt |
| INFO | `Connected to <host>:<port> after N attempts` | The node connects after failing |
| ERROR | `ACK failed after N attempts for message to <host>: <why>` | The resends run out. The reason is the last attempt's, and includes the ACK when one came back, for example `ACK^R01 AE for control ID 123: unknown patient`. With `Queue message` or `Discard message`, the error names the same reason. |
| ERROR | `the ACK script failed: <error>` | With `Custom`, the script errored, returned something other than `true` or `false`, or took more than 5 seconds. The node stops. |

---

## Destination File/FTP

Writes each message to a file, locally or to an FTP/FTPS/SFTP server.

In **Node Parameters**, the node shows where it writes, either a local folder or the protocol, server, port and path. It has a card for each tab of the **Configure** dialog. Between **General** and **Advanced**, they are:

- **Files:** how messages are split into files, the file name mask and ID, and the encoding.
- **FTP:** the user it signs in as, how files are uploaded, what happens to an existing file, whether local copies are kept, and reconnecting. When FTP isn't used, the card says so.

Between **General** and **Advanced**, the **Configure** dialog has two tabs:

| Tab | Cards |
| --- | --- |
| **Files** | **Writing files**, **File names**, **Encoding** |
| **FTP** | **FTP server**, **Sign in**, **Security**, **Uploading**, **Reconnecting**. The tab shows **On** when **Upload to FTP** is on. |

### Core fields

| Field | Default | Notes |
| --- | --- | --- |
| **Output Directory** | *(empty)* | **Needed to start.** Where files are written. |
| **Write Each Message To** | `Separate files` | `Separate files` or `A single file`. |
| **Single File** | *(empty)* | The target filename, with `A single file`. |
| **Output File Encoding** | `Western (ISO-8859-1)` | Character encoding of written files. |
| **Escape 8-Bit Characters** | off | Escape high-bit characters on output. |

### Naming files, with `Separate files`

| Field | Default | Notes |
| --- | --- | --- |
| **Use as File ID** | `Unique ID (YYYYMMDDhhmmss_XXXXX)` | See the table below. |
| **Custom Timestamp Format** | `output_%Y_%m_%d_%H_%M_%S_%f.hl7` | With `Custom Timestamp`. |
| **Number of Padded Digits** | `5` | `3` to `7`, with `Padded integer index`. |
| **Next File Index** | `0` | Starting number, with either index mode. |
| **Output File Mask** | `%i.txt` | **Needed to start** with `Separate files`. Filename pattern. |
| **Temporary File Extension** | `tmp` | Extension used while writing. |

### Choosing a file ID

| Option | Suits |
| --- | --- |
| `Unique ID (YYYYMMDDhhmmss_XXXXX)` | Default choice. Safe under any volume and after a restart. |
| `Timestamp (to the millisecond)` | Human-scannable output, if two messages cannot share a millisecond. |
| `Custom Timestamp` | A receiver that parses filenames. |
| `Integer index` | A receiver that expects a sequence. |
| `Padded integer index` | A receiver that sorts filenames as text. |

Timestamp naming collides under load when two messages land in the same interval, and index naming restarts from **Next File Index** if that value is ever reset. Use `Unique ID` unless a receiver requires otherwise.

### The temporary extension matters

Linkiir writes to a temporary name and renames on completion, so a downstream watcher configured to pick up `*.txt` never sees a partial file.

Keep **Temporary File Extension** different from the extension in **Output File Mask**. If they match, a reader can grab a file mid-write — which is exactly the failure the temporary name exists to prevent.

### FTP upload

Turn on **Upload to FTP** to write to a remote server.

| Field | Default | Notes |
| --- | --- | --- |
| **FTP Protocol** | `FTP` | `FTP`, `FTPS (FTP over SSL)`, or `SFTP (Secure Shell FTP)`. |
| **Authentication** | `Username/Password` | `Username/Password` or `Private/Public Key`. |
| **FTP Server** | *(empty)* | **Needed to start** when **Upload to FTP** is on. |
| **FTP Port** | `21` | |
| **FTP Username** | *(empty)* | **Needed to start** when **Upload to FTP** is on. |
| **FTP Password** | *(empty)* | Used for FTP, FTPS, and SFTP with `Username/Password`. SFTP key sign-in doesn't use it. |
| **FTP Path** | *(empty)* | Remote directory. |
| **Certificate File**, **Private Key File** | *(empty)* | For FTPS. |
| **SFTP Private Key File**, **Public Key File** | *(empty)* | For SFTP with `Private/Public Key`. |
| **Verify Peer** | off | For FTPS. Turn on outside a trusted network. |
| **Verify Host Fingerprint** | off | For SFTP. Turn on outside a trusted network. |
| **Use Remote Temporary File** | on | Upload under a temporary name and rename on completion. |
| **FTP Overwrite Handling** | `be overwritten` | An existing file may `be overwritten`, `be renamed`, or `not be uploaded`. |
| **Keep Local Files** | on | Retain a local copy after upload. |
| **Attempt to Reconnect** | `No` | `No`, `Yes (unlimited)`, or `Yes, with limit`. |
| **Reconnect Attempts** | `60` | With `Yes, with limit`. |
| **Reconnect Interval** | `10000` | Milliseconds between attempts. |

:::note[FTP and FTPS passwords]
Earlier releases showed **FTP Password** only for SFTP, so plain FTP and FTPS signed in with an empty password. Existing nodes are updated when Linkiir starts. Check the password on any FTP or FTPS node configured before.
:::

Leave **Use Remote Temporary File** on whenever the receiver polls the upload directory, for the same reason as the local temporary extension.

**Keep Local Files** is on by default, which is useful while validating a new interface — the local copies are your evidence of what was sent. Plan for the disk they consume, or turn it off once the interface is established.

:::caution[FTP Overwrite Handling defaults to overwriting]
The default silently replaces an existing remote file of the same name. Combined with timestamp or index naming, a redelivery can overwrite a file the receiver has not read yet. Set it to `not be uploaded` when silent replacement would lose data.
:::

Earlier releases couldn't rename on the server when **FTP Path** was set. Uploads with **Use Remote Temporary File** (on by default) failed, and so did `be renamed`. Both work now.

With `be renamed`, the existing remote file is renamed to `<name>.bak` before the upload. With `not be uploaded`, the local copy is kept even when **Keep Local Files** is off, since it's the only copy written.

Put the password in the project's **Variables** tab flagged **Secret**, and reference it. See [Project Settings](../../administration/configurations/project-settings.md).

#### When an upload fails

The node retries the same message, reconnecting first if the connection dropped, before it moves on. **Attempt to Reconnect** decides how often:

| Attempt to Reconnect | After a failed upload |
| --- | --- |
| `No` | The node stops at once. |
| `Yes, with limit` | Up to **Reconnect Attempts** retries, **Reconnect Interval** apart, then the node stops. |
| `Yes (unlimited)` | Retries every **Reconnect Interval** until it succeeds or the node is stopped. |

Messages stay in order: nothing after the failed message is written until it succeeds. When the node stops, the message isn't marked delivered, so it's written again after a restart.

### What it logs

On the **Logs** page, each line shows with its message under **Related messages**. `<remote>` is the server address and path, such as `ftp://files.example.com:21/outbound/00001.hl7`.

| Level | Line | When |
| --- | --- | --- |
| INFO | `Wrote the message to <path>` | Each message, with `Separate files`. With `A single file` it reads `Appended the message to <path>`. |
| INFO | `… and uploaded it to <remote>; deleted the local copy` | With **Upload to FTP**. `(the existing file there was renamed to <name>.bak)` is added when **FTP Overwrite Handling** renamed one. `; deleted the local copy` appears when **Keep Local Files** is off. |
| WARN | `… but didn't upload it to <remote>: it already exists there, and FTP Overwrite Handling is "not be uploaded"; kept the local copy` | The remote file exists and the node is set not to replace it. |
| WARN | `Uploading the message to <remote> failed: … Trying again in 10 s (retry 1 of 60)` | Before each retry. |
| INFO | `Reconnected to <server>` | A retry reconnected after the connection dropped. |
| ERROR | `Uploading the message to <remote> failed after N attempt(s): …` | Out of retries. The node stops. |

With `be overwritten`, the node doesn't check whether the remote file exists, so the log doesn't say whether one was replaced.

---

## Destination Database

Writes the rows each message carries, a JSON object of rows by table, into SQL Server, PostgreSQL, Oracle or SQLite. It runs no script. You set up its connection, its tables and how it writes in its **Configure** dialog. Rows are inserted or upserted on each table's primary key, and never deleted.

Each message must be one JSON object of rows by table. A table's rows are one object, or an array of objects, of values by column:

```json
{
  "patients": { "mrn": "7", "family_name": "Doe" },
  "results": [
    { "mrn": "7", "code": "GLU", "value": 5.4 },
    { "mrn": "7", "code": "K", "value": 4.1 }
  ]
}
```

Table and column names must match the node's `schema.json`. Values are text, numbers, `true`/`false` or `null`, checked against each column's type. A [Data Map](data-map/index.md) with a database destination produces this shape. See [What a message must hold](database-node.md#what-a-message-must-hold) for every rule and the value formats for each column type.

In **Node Parameters**, the node has a card for each **Configure** tab that holds settings. Between **General** and **Advanced**, they are:

- **Connection:** the database and where it is, the user it signs in as, and the encryption or SSL setting for the engine.
- **Tables:** its tables, with any warnings about them.
- **Behaviour:** the write mode, unknown tables, error handling, the connection and reconnecting.

| Tab | Holds |
| --- | --- |
| **Connection** | The database, server, sign-in and encryption, with **Test connection** |
| **Tables** | The tables the node writes, kept in its own `schema.json`. **Check tables** against the database, then create the missing ones or alter the ones that differ, after reviewing their SQL. |
| **Behaviour** | **Writing** and **Staying connected** (**Connection**, keep open or close after each write, and reconnecting) |

The node's **Batching** settings are on its **Advanced** tab.

See [Database Node](database-node.md) for the full reference.

---

## Outbound HTTP and email

There is no working dedicated node type for these. Make the call from a **Transform Custom** node:

```lua
function main(Data)
   local resp, err = linkiir.link.web.post{
      url = "https://api.example.com/messages",
      body = Data,
      headers = { ["Content-Type"] = "application/json" },
      auth = { type = "bearer", token = Token },
      timeout = 30,
   }
   if not resp then
      error("delivery failed: " .. err.message)
   end
   if resp.code >= 400 then
      error("receiver returned " .. resp.code)
   end
end
```

A transform node that calls out and never pushes is a destination in every practical sense.

Raising an error on a failed delivery matters: it stops the message being treated as delivered, so it is not silently lost. Check both the transport result and the status code — `resp` being present means the request completed, not that the receiver accepted it. See [Error Handling and Retry](../error-handling.md).

:::note[Destination Custom is not usable]
The palette offers **Custom** under **Destination**, but it has no runtime implementation in this release. Use Transform Custom as above.
:::

---

## Make delivery idempotent

Delivery is at-least-once, so a message can be delivered twice after an interruption or a retry.

| Destination | How to protect the receiver |
| --- | --- |
| Destination LLP | Use `Original ID and message type` verification and let the receiver deduplicate on message control ID. |
| Destination File/FTP | Use `Unique ID` naming and **FTP Overwrite Handling** set to `not be uploaded`, so a redelivery cannot silently replace a file. |
| Outbound HTTP | Send a stable idempotency key derived from the message, if the API supports one. |
| Destination Database | Set **Write Mode** to `Upsert`, with a primary key the message carries, so a repeat updates the row it wrote before. |

Decide how the receiver detects duplicates before you go live, not after. A replay or retry must not create a duplicate clinical or financial transaction.

---

## Next

- [Source Nodes](source-nodes.md)
- [Database Node](database-node.md)
- [Custom Scripting Nodes](custom-scripting-nodes.md)
- [Error Handling and Retry](../error-handling.md)
