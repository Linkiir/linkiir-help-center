---
title: Log Search and Message History
---

# Log Search and Message History

The **Logs** page is where message history is read: what arrived, what a node did with it, what failed, and what the platform itself was doing at the time. It reads from the Log DB, which the Log Archiver fills in the background — so nothing on this page slows a workflow down, and a stopped Archiver delays history rather than losing it.

Reading anything on it needs **View log messages**. The page itself also opens for an account holding only **Export log messages**, which is what lets a reporting role download records without reading them on screen.

---

## What is recorded

| Type | Holds |
| --- | --- |
| **Data (Messages)** | The messages themselves, with their archived payload |
| **Node Events** | What a node did: state changes, messages enqueued and dequeued, script `print` output, errors |
| **System Events** | What the platform did: logins and logouts, project, workflow, and node lifecycle, configuration changes, queue clears and repositions, message resubmits, log exports, and licence changes |

System events are the instance's own audit trail. They are archived on every installation, including brokers configured to refuse topic auto-creation — Linkiir creates the topic they travel on at startup.

---

## Filtering

The left sidebar narrows the table, and every filter combines with the others:

- **Project**, **Workflow**, and **Node**. The project list offers every project you collaborate on, whether or not it has archived anything yet, so a brand-new interface is selectable before its first message lands.
- **Type**, and for Node and System events an **Event Type**.
- **Level** — Info, Warning, Error, Debug, Data.
- **Time Range** — last hour, 24 hours, 7 days, 30 days, or a custom **From**/**To**.

Alert emails and Alert Node payloads carry a link straight into this page with the project, workflow, or node already selected. See [Alerting and Notifications](../notifications/index.md).

---

## Searching

The search box matches **message content as well as names**:

| It searches | Notes |
| --- | --- |
| The message summary and error summary | The leading part of the body, as recorded on the index row |
| The full archived message body | The whole payload, not just the summary — a term in the fifth HL7 segment is found |
| Event detail bodies | Node and system event text |
| Project, workflow, and node **names** | Matched on the name you see, not the underlying identifier |

Matching is a plain substring: there are no wildcards, quoting, boolean operators, or field prefixes. Narrow a search with the sidebar filters rather than with search syntax.

Two limits worth knowing:

- **Only archived bodies can match.** A message whose payload exceeded the archiver's maximum payload size, or whose payload has since been purged by retention, cannot be found by its content. Its index row still matches on the summary.
- **A term that matches nothing is the slow case.** No index covers message text, so a search that finds no rows walks the whole table. A search that does match stops as soon as it has filled a page.

Tracing one message end to end is still the correlation ID: every node it passes through records the same one, so searching it returns the whole journey.

---

## New records arrive on their own

The Logs page tails the archive. The chip beside the toolbar buttons reads **Live** or **Paused**:

- **Live** — the page checks for newer records every 10 seconds. When you are parked at the top of a newest-first table, they are merged in silently. Otherwise a floating **_n_ new records** pill appears, and the rows only move when you click it.
- **Paused** — with the reason on hover:

| Paused because | Why |
| --- | --- |
| A custom **To** time is set | That makes the view a fixed window, so nothing new can fall inside it |
| The resubmit window is open | It is a task you are in the middle of |
| The log index is being rebuilt | The page is already reporting that reads are slow |

There is nothing to switch on or off. Tailing does not count as user activity, so a Logs page left open on a wall display still times its session out normally, and after several hundred tailed rows the list restarts from the newest page rather than growing without limit.

---

## Reading a message

Selecting a row opens it, with its metadata, its related messages, and its raw body. HL7 messages render one segment per line whether or not PHI is revealed.

Patient identifiers in an HL7 payload are **masked for everyone without Unredact PHI**. Holding that permission adds a reveal control; without it the payload stays masked.

---

## Downloading

**Download** exports the selected rows as a text or JSON file, and needs **Export log messages**. Each export is itself recorded as a system event.

---

## Resubmitting a message

**Resubmit** re-publishes selected data messages onto the queue of the node that originally produced them. It needs **Resubmit messages**, plus collaboration on each record's project — records from a project you are not on are skipped and reported.

Opening a message in the resubmit window lets you review it. Correcting one before it goes back out is a separate right:

| You hold | In the resubmit window |
| --- | --- |
| **Resubmit messages** | *View message*. Every message goes back out exactly as archived. |
| **Resubmit messages** and **Unredact PHI** | *View / edit message*. A correction applies to that resubmission only and never changes the archived record. |

This applies to every payload format, not only HL7: a FHIR or JSON body carries the same identifiers, so rewriting one takes the same permission. Text still holding masking characters is refused outright, whatever permissions you hold.

:::caution[A resubmit is a real message]
The receiving node processes it like any other message, and downstream systems see a duplicate. Confirm the receiver tolerates one before resubmitting. Replaying a specific message is almost always safer than repositioning a queue — see [Commonly Asked Questions](../../faq/common-questions.md#should-i-replay-a-message-or-rewind-the-queue).
:::

---

## Permissions at a glance

| Permission | Grants |
| --- | --- |
| **View log messages** | Open the page, filter it, and read a message's payload |
| **Unredact PHI** | Reveal masked patient identifiers, and edit a message before resubmitting it |
| **Export log messages** | Download selected records |
| **Resubmit messages** | Re-publish a stored message onto its originating queue |

None implies another, and project collaboration decides which records you see at all. See [Users and Roles](../configurations/user-roles.md).

---

## Next

- [Log Retention and Purge](../configurations/log-retention-purge.md)
- [Log Archive Database](../configurations/log-archive-database.md)
- [Message History Is Not Being Recorded](../troubleshooting/log-archiver-connectivity.md)
