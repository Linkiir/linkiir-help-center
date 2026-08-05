---
title: Commonly Asked Questions
---

# Commonly Asked Questions

## Should I use Redpanda or Kafka?

Both speak the same protocol, so Linkiir works identically with either. Choose on operational grounds:

| Choose | When |
| --- | --- |
| **Bundled Redpanda** | Local DEV or TEST on macOS or Linux. Smallest footprint, no JVM. |
| **Bundled Kafka** | DEV or TEST where you want Apache Kafka specifically, or a Windows install. |
| **Your own external cluster** | Production. Replication, patching, storage, monitoring, and support stay with the team that already owns them. |

For production, the deciding factor is usually which one your organisation can already operate well, not a technical difference in how Linkiir behaves.

## Can I start with a bundled broker and move to my own cluster later?

Yes, and it is a common path: build and test on the bundled broker, then point the same installation at production infrastructure when it is ready.

Your projects, workflows, settings, and message history are preserved. The connection is tested before the switch is committed, so a failed test leaves you running exactly as before.

Let running workflows drain first — in-flight messages are not migrated. See [Kafka and Redpanda Configuration](../administration/configurations/kafka-redpanda.md).

## Should production use SQLite for the Log DB?

No. Use PostgreSQL or MS SQL.

SQLite is convenient for a single local installation, but it supports one writer, which rules out scaling message-history recording and gives you no central backup or operational tooling. See [Log Archive Database](../administration/configurations/log-archive-database.md).

## PostgreSQL or MS SQL for the Log DB?

Whichever your organisation already runs well.

Both are fully supported and both scale to multiple writers. Message-history performance depends far more on schema maintenance, indexing, storage, and retention policy than on which product you pick.

## Why are there several Log Archiver instances?

To share the work of recording message history, and to keep recording if one instance stops.

Sizing is straightforward:

| Instances | Result |
| --- | --- |
| Fewer than the workload can split across | Each instance handles several shares |
| Matched to the workload | Maximum useful parallelism |
| More than that | Extra instances sit idle |

Adding instances beyond that point changes nothing. Watch lag before scaling up.

Multiple instances require PostgreSQL or MS SQL. Do not configure more than one against SQLite.

## Does recording message history slow down or consume my messages?

No. Message history is recorded independently of your workflows. Your nodes still receive every message, and a busy or stopped Archiver does not slow message delivery or remove anything from a workflow.

## Can message history be lost?

Only in one situation: if the broker discards records before they are copied to the Log DB. That happens when the Archiver is behind for longer than your retention window — typically after an extended outage.

Two things prevent it:

- Keep broker retention comfortably longer than your worst plausible outage.
- Alert on lag well before it approaches that window.

Records already written to the Log DB are safe, and a redelivery during recovery does not create duplicate rows in log search. See [Message History Is Not Being Recorded](../administration/troubleshooting/log-archiver-connectivity.md).

## Does Run Test send real messages?

No. In both Run Test and Debug, `linkiir.flow.push` is non-live: it validates your call and returns a placeholder message ID without producing anything.

Outbound calls are a different matter. `linkiir.link.web.post`, `linkiir.link.mail.send`, and database calls execute for real during a test. Point them at test endpoints while developing. See [Testing and Debugging Lua](../interface-development/lua-programming/testing-debugging.md).

## How do I trace one message across nodes?

Search its correlation ID in log search. Every node a message passes through records the same correlation ID, so one search returns the whole journey.

If the trail stops partway, check whether a script created a new message without carrying the correlation forward.

## What happens if the Runtime crashes?

Unprocessed messages stay in the queue, so nothing is lost. The Studio restarts the Runtime.

Before resuming normal operation, confirm no message was delivered twice — delivery is at-least-once, so an interruption between doing work and confirming it can cause a redelivery. See [Error Handling and Retry](../interface-development/error-handling.md).

## Can the same message be delivered twice?

Yes. Delivery is at-least-once, so a redelivery is possible after an interruption or a retry.

Design receivers to tolerate it: deduplicate on message control ID for HL7, use unique file naming for file destinations, and send an idempotency key to APIs that support one.

## Should I replay a message or rewind the queue?

Replay the specific archived message.

Rewinding a consumer position reprocesses everything from that point, which usually re-delivers messages that already succeeded. Replay targets one message. Confirm the receiver tolerates a duplicate before replaying anything.

## How do I move a project to another environment?

Two ways, for different situations:

| Method | Use when | Keeps history | Stays linked |
| --- | --- | --- | --- |
| **Zip bundle** | The two installations cannot reach each other, or you want a point-in-time copy | No | No |
| **Git remote** | Both can reach a shared repository | Yes | Yes, push and pull |

Export a bundle from the project's **Git** tab with **Export project**. Import one with **Add Project → From zip**, or clone from a repository with **Add Project → From remote**.

See [Import and Export](../administration/deployment/import-export.md).

## Do exported projects contain credentials?

Credential **names** travel; secret **values** do not. Every credential marked **Secret** arrives with its name and flag intact and its value blank, so you can see exactly what needs filling in on the target installation.

Project **variables** do travel with their values, so anything environment-specific there needs repointing after an import.

After importing, open the project's **Credentials** tab and fill in the values for that environment.

## Can I import the same project twice onto one installation?

Yes, as a zip bundle. Linkiir gives the second copy fresh internal identifiers and tells you it did:

> A project with these ids was already here, so the copy was given new ones.

The two copies are then independent. This is a handy way to clone a project as a starting point for a new one. Give the copy a distinct **Name** at import time so you can tell them apart.

Importing from a remote does not work this way — the same project cannot be on one installation twice, because it has to stay addressable for pushes back to the remote.

## Does importing a project need a restart?

No. The project appears in the list and the runtime picks it up on its own.

Before starting anything, re-enter secret credentials and repoint anything environment-specific. See [Import and Export](../administration/deployment/import-export.md).

## Can I run Linkiir on Windows in production?

Yes. Windows Server is a supported production platform.

Brokers and the Log DB are more commonly hosted on Linux, and there is no requirement for them to match the Linkiir host — Linkiir on Windows connecting to a Linux-hosted cluster and database is a normal deployment.

## Can I reach the Studio from another machine?

Not by default. Everything binds to `127.0.0.1` on a fresh install, so it is reachable only from the machine it runs on.

Before changing that: complete the administrator password change, and put the Studio behind a reverse proxy providing TLS. See [Security](../administration/security/index.md).

## What if I lose the master encryption key?

Your projects, workflows, users, and message history are unaffected. User passwords are hashed independently of this key, so nobody is locked out.

What breaks is the stored broker and Log DB passwords: they can no longer be decrypted and must be re-entered. Back the key up with your regular backups — see [Backup and Restore](../administration/backup-restore/index.md).

## Where do I set the HTTP server port?

**Settings → Http Server**, not on the node and not on the project. Every HTTP source node across every project answers on that one server, and is told apart by its **Route Path**.

That means changing the port affects every HTTP interface on the installation, and two nodes cannot share a route path. Prefix routes with the interface they belong to — `/adt/intake`, `/orders/intake` — so projects cannot collide.

## What does my license limit?

Three things, all shown on **Settings → License**:

| Limit | Effect |
| --- | --- |
| **Active Workflows** | How many workflows may run at the same time. Starting one beyond the limit is refused. |
| **Nodes per Workflow** | The largest number of nodes one workflow may contain. |
| **Expiration Date** | When the license lapses, followed by a grace period. |

It does not limit which node types you use, or how many projects, users, or interfaces you create.

Worth knowing: a workflow left started but failing still holds its slot. If you are unexpectedly at capacity, look for failed workflows you have not stopped. See [Capacity and Expiry](../administration/licensing/capacity-and-expiry.md).

## What happens when my license expires?

After the grace period, workflows drain their in-flight messages and stop. Nothing is deleted.

The Studio stays usable, message history keeps recording, and you can still open, edit, and export projects. Applying a valid code and starting your workflows returns everything to normal.

Renew on **Expiring Soon**, which appears 30 days out, rather than treating the grace period as headroom.

## Do I need a new license if I replace the server?

It depends on whether the working directory comes with it.

| Route | Licence |
| --- | --- |
| Restore the working directory onto the new host | Same License ID — your existing code keeps working |
| Install fresh and import projects | New License ID — needs a transfer |

Renaming the host, changing its IP, or moving to different hardware does not change the License ID. The working directory is what carries it. See [License Transfer](../administration/licensing/license-transfer.md).

## Are there built-in user roles?

No. You create the roles you need and choose which of five permissions each carries: **Edit**, **Start / Stop**, **Export Logs**, **View Logs**, and **IDE**. A fresh install ships one role, `admin`, holding all five.

The permission set is deliberately coarse, so some separations are not available — **Edit** covers project configuration, credentials, and exporting together. Where a stricter split matters, separate environments rather than relying on roles within one. See [Users and Roles](../administration/configurations/user-roles.md).

## Will Linkiir email me when an interface fails?

Not on its own. There is no built-in notification or alerting feature — no Notifications settings page, no error alerts, no inactivity alerts.

You have two routes, and most sites use both:

- **Alert from a script.** A Custom node can send email with `linkiir.link.mail.send` or call a webhook with `linkiir.link.web.post`. Good for data-level rejections a human needs to act on.
- **Monitor from outside.** Point your existing monitoring at `/api/health`, at broker consumer lag, and at Log DB capacity. This is what catches the failures a script cannot report — including its own node stopping.

See [Alerting and Notifications](../administration/notifications/index.md) for a minimum viable setup.

## Can I migrate scripts from another integration engine?

Largely, yes. A compatibility adapter provides the legacy global namespaces on top of the Linkiir API, so many scripts run with minimal edits. Load it with `require "legacy_adapter"` at the top of the script — without that line, only the `linkiir.*` API exists.

Node methods also answer to their legacy names, so mapping code using `nodeValue()`, `S()`, or `mapTree()` keeps working unchanged.

The work that remains is usually converting message definitions to Linkiir schemas, and redesigning anything that depended on engine-specific runtime APIs. See [Migrating Existing Interfaces](../administration/configurations/migration.md).

## How do I parse JSON?

With `linkiir.json.parse`, which returns an ordinary Lua table:

```lua
local body = linkiir.json.parse(Data)
local id = body.patientId
```

`linkiir.data` is for HL7 v2, X12, and XML — it returns a navigable node tree and needs a schema. Passing `type = "json"` to `linkiir.data.extract` is an error, and it tells you to use `linkiir.json` instead.

See [Linkiir Scripting API](../interface-development/lua-programming/linkiir-api.md).

## Is there a node for outbound HTTP or email?

Not a dedicated one. Make the call from a **Transform Custom** node using `linkiir.link.web.post` or `linkiir.link.mail.send`. A transform node that calls out and never pushes is a destination in every practical sense.

The palette does show **Custom** under **Destination**, but it has no runtime implementation in this release — use Transform Custom instead. See [Destination Nodes](../interface-development/interfaces/destination-nodes.md).
