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
| **Audit Events (user actions)** | What people did: sign-ins and sign-outs, access changes, project, workflow, and node lifecycle, configuration changes and commits, queue clears and repositions, log searches, PHI views, exports, and message resubmits |
| **System Events (platform)** | What the platform did on its own: runtime and archiver health, high availability, updates, licence changes, and external-authentication notices |
| **Data (Messages)** | The messages themselves, with their archived payload |
| **Node Events** | What a node did: state changes, messages enqueued and dequeued, script `print` output, errors |

Audit events are the instance's audit trail. See [Audit events](../security/index.md#audit-events) for the full list and how to follow one user's activity. Audit and system events are archived on every installation, including brokers configured to refuse topic auto-creation — Linkiir creates the topic they travel on at startup.

---

## The log table

Each row shows when the record was archived, its level and type, where it came from, and a **Message** column previewing what it says, so you can scan the table without opening each row:

| Record | The Message column shows |
| --- | --- |
| HL7 v2 | The message type as a tag, such as `ADT^A04`, then the message from `MSH` onwards, its segments separated by `⏎` |
| X12 | The transaction as a tag, such as `X12 837`, then the message from `ISA` onwards |
| FHIR and other JSON | The resource type as a tag, such as `Patient`, then the JSON on one line |
| XML, including CDA | The root element as a tag, such as `ClinicalDocument`, then the XML on one line |
| Node and system events | The event's message, such as `Node created: Sink` |
| Alert deliveries | An `Alert` tag and the name of the rule that fired |
| Script `print` output and other text | The text on one line |

The preview is the first 75 characters, taken from the summary recorded on the index row, so it costs nothing extra to load. Select the row to read the whole message.

Previews are **always masked**, including for users holding **Unredact PHI**, by the same rules as the payload view: a table of patient names is more exposure than one opened message. A preview that can't be masked safely — usually a FHIR or other JSON message cut off partway — shows only its tag and *Content hidden (PHI) — select to view*. See [Messages that can't be read](../configurations/phi-masking.md#messages-that-cant-be-read).

### Choosing columns

**Columns**, beside the search box, shows or hides each column. The choice is remembered in your browser, so it stays the same next time you open the page on that computer. At least one column always stays showing. Hiding a column doesn't change the sort: a table sorted by **Node** keeps that order with **Node** hidden.

---

## Filtering

The left sidebar narrows the table, and every filter combines with the others:

- **Project**, **Workflow**, and **Node**. The project list offers every project you collaborate on, whether or not it has archived anything yet, so a brand-new interface is selectable before its first message lands.
- **Type**, and once a type is chosen, an **Event Type**.
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

Matching is a plain substring: there are no wildcards or boolean operators. Narrow a search with the sidebar filters rather than with search syntax.

The one exception is `user:`. Typing `user:alice` (or `user:"alice smith"` for a name with spaces) shows that user's audit events instead of a text search. It matches the username exactly, ignoring case. See [Audit events](../security/index.md#audit-events).

Two limits worth knowing:

- **Only archived bodies can match.** A message whose payload exceeded the archiver's maximum payload size, or whose payload has since been purged by retention, cannot be found by its content. Its index row still matches on the summary.
- **A term that matches nothing is the slow case.** No index covers message text, so a search that finds no rows walks the whole table. A search that does match stops as soon as it has filled a page.

Without **Unredact PHI**, a row only counts as a match when the term is in what you would be shown, so a masked identifier can't be found by searching for it. Such a search can stop before filling a page; the table then says **Older messages haven't been searched yet**, and **Keep searching** carries on. See [Searching masked messages](../configurations/phi-masking.md#searching-masked-messages).

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

Selecting a row opens it, with its metadata, its related messages, and its raw body. HL7 messages render one segment per line whether or not PHI is masked.

Patient identifiers in a payload are **masked for everyone without Unredact PHI**: HL7 v2 fields, and values in JSON and XML (FHIR included), as **Settings → Instance → PHI Masking** sets out. The masking is done on the server, so the identifiers never reach the browser. Holding **Unredact PHI** shows the payload in full, with a **Hide PHI** button that masks it again by the same rules, for reading a message with someone looking over your shoulder. See [PHI Masking](../configurations/phi-masking.md).

---

## Downloading

**Download** exports the selected rows as a text or JSON file, and needs **Export log messages**. Each export is itself recorded as an audit event.

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
