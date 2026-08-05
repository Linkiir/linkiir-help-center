---
title: Tips and Best Practices
---

# Tips and Best Practices

Practices worth adopting early, when they cost nothing, rather than after an incident.

## Infrastructure

**Use your own Kafka or Redpanda cluster in production.** Bundled brokers are excellent for DEV and TEST. Production wants replication, monitoring, backup planning, and a team that owns it.

**Use PostgreSQL or MS SQL for production message history.** SQLite suits one local installation. Anything beyond that wants central backup, real tooling, and room to scale.

**Keep broker retention longer than your worst plausible outage.** Retention is what gives message-history recording time to catch up after downtime. Too short, and an extended outage costs you history permanently.

**Alert on lag before it approaches retention.** This is the single alert that prevents unrecoverable gaps in message history.

**Set up external monitoring, because there is no built-in alerting.** Linkiir will not tell you an interface failed. Watch `/api/health`, broker lag, Log DB capacity, and per-interface inactivity from your own monitoring system.

**Put the license expiry date in your renewal process.** Nothing in the product will remind you, and the **Expiring Soon** badge only appears 30 days out.

## Protecting the installation

**Back up the master encryption key with the working directory.** `linkiir.env` on Windows and Linux, or `.env` for Docker. Without it, stored passwords cannot be decrypted.

**Change the administrator password before opening remote access.** In that order. A fresh install binds to localhost; do not change that until the password is set.

**Put TLS in front of the Studio before exposing it.** Use a reverse proxy. Do not publish it directly.

**Give Linkiir dedicated service accounts.** For the broker and the database. Shared administrative credentials make the audit trail useless and widen the impact of a leak.

## Environments

**Keep DEV, TEST, and PROD genuinely separate.** Different endpoints, credentials, and databases. Never point a DEV workflow at a production endpoint.

**Do not restore production configuration into TEST and start it.** Rebind every credential and endpoint first, or TEST will start delivering to production systems.

**Use synthetic data outside production.** Test samples are stored with the project and visible to anyone who can open the node. `TEST000001`, `TEST^PATIENT`, `19700101`.

## Building interfaces

**Let Linkiir carry the correlation ID.** It is what makes one message traceable across every node. Do not generate an unrelated ID when creating a new message from an inbound one.

**Rename freely.** Display names are separate from internal identifiers, so renaming for clarity costs nothing and breaks nothing.

**Guard every field you read.** Most production script failures are an unhandled `nil` from a field that happened to be present in every development sample.

**Keep test samples for the awkward cases.** Missing required field, absent optional segment, malformed input, unusual characters, largest expected message. These earn their keep the first time a sender changes something.

**Run Test before starting a node.** It catches compile and mapping errors in one click, which is faster than reading a node's error state.

**Decide what stops a feed.** For clinical interfaces, prefer stopping on error, and set **Ack Error Handling** to `Stop channel`. A node that quietly skips messages can discard a day of data before anyone notices, and stopping loses nothing — the queue is durable.

**Make delivery idempotent.** Delivery is at-least-once. Deduplicate on message control ID, use unique file naming, or send an idempotency key — decided before go-live, not after.

**Keep secrets out of scripts.** Put them in the project's **Credentials** tab with the **Secret** flag set, and reference them by name. A value in a `.lua` file is committed to the project's history.

**Make environment-specific values project variables.** Hostnames, directories, and account identifiers in the **Variables** tab are repointed in one place when you promote a project. The same values typed into every node are edited node by node.

## Operations

**Keep patient data out of general logs.** Payloads belong in the protected archive, where access is controlled. Error text, metric labels, and alert emails should carry identifiers and field names, not values.

**Replay rather than rewind.** Replaying one archived message beats rewinding a consumer position and reprocessing everything after it.

**Let a backlog drain rather than skipping it.** Skipping past a backlog makes lag disappear from monitoring and discards history permanently.

**Watch node state and lag together.** A healthy node with growing lag and a stopped node look very different but both mean messages are not arriving.

## Before going live

**Rehearse failure in TEST.** Stop the Runtime. Block a destination. Fill the Log DB disk. Restore from a backup. An interface is not production-ready until recovery has actually been performed, not just described.

**Run parallel through a full business cycle.** Include month-end and overnight batches if they behave differently from daily traffic.

**Keep rollback available.** Leave the previous interface stopped-but-restorable until the new one has been stable in production.
