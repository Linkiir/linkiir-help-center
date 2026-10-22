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

## The page at a glance

Everything is driven from the **search box** at the top of the page. There is no separate filter panel: you narrow the table by typing into the search box, either plain words or `qualifier:value` filters such as `level:error`. See [Searching and filtering](#searching-and-filtering).

Under the search box is a toolbar:

| On the left | On the right |
| --- | --- |
| **Live** / **Paused**, whether new records are arriving (hover for why it is paused) | **Select All**, and once rows are selected, **_n_ selected** and **Clear** |
| **Columns**, to show or hide table columns | **Resubmit**, for the selected data messages |
| The **PHI** button, to show or hide patient identifiers in the table's previews | **Download**, as Plain Text or JSON |

Below that is the log table. Click a row to open it in the message inspector at the side; tick a row's checkbox to select it for **Resubmit** or **Download**.

---

## The log table

Each row shows when the record was archived, its level and type, where it came from, and a **Preview** of the message, so you can scan the table without opening each row.

The **Preview** column shows the start of the message, up to three lines, with a tag on the left saying what kind of message it is:

| Record | The tag | The preview lines |
| --- | --- | --- |
| HL7 v2 | The message type, such as `ADT^A04` | One line per segment, from `MSH` onwards |
| X12 | The transaction, such as `X12 837` | One line per segment, from `ISA` onwards |
| FHIR and other JSON | The resource type, such as `Patient` | The JSON, wrapped |
| XML, including CDA | The root element, such as `ClinicalDocument` | The XML, wrapped |
| Node and system events | — | The event's message, such as `Node created: Sink` |
| Alert deliveries | `Alert` | The name of the rule that fired |
| Script `print` output and other text | — | One line per line of text |

The preview is taken from the start of the message recorded on the index row, so it costs nothing extra to load. Long lines are cut short; open the row to read the whole message.

Previews follow the **PHI** button in the toolbar: patient identifiers are masked unless you hold **Unredact PHI** and have chosen to show them. A preview that can't be masked safely — usually a FHIR or other JSON message cut off partway — shows only its tag and *Content hidden (PHI) — select to view*. See [PHI on the Logs page](#phi-on-the-logs-page).

Columns size themselves to their content, and **Preview** takes the rest of the width. Click a column heading to sort by it; **Preview** can't be sorted. Sorting reorders the rows currently loaded in the table, not the whole log.

### Reading further back

The table loads 100 records at a time, newest first. **Load more**, at the bottom of the table, loads the next 100 older records.

The table holds up to 500 records at once, so it stays quick however far back you read. Past that, each **Load more** drops the newest 100 from the top, and a **Load newer** button appears at the top of the table to bring them back, 100 at a time. Either way, the row you were reading stays where it is on screen.

While older records are showing and the newest have been dropped, new records stop arriving — see [New records arrive on their own](#new-records-arrive-on-their-own).

### Choosing columns

**Columns**, in the toolbar, shows or hides each column. The choice is remembered in your browser, so it stays the same next time you open the page on that computer. At least one column always stays showing. Hiding a column doesn't change the sort: a table sorted by **Node** keeps that order with **Node** hidden.

---

## Searching and filtering

The search box works like the search on GitHub: **plain words search message content**, and **`qualifier:value`** narrows the table by a field. You can mix the two:

```text
level:error project:"Lab Results" PID|1||12345
```

The table updates as you pause typing, or straight away when you press **Enter**.

### Searching message content

Words that aren't a qualifier are searched for in:

| It searches | Notes |
| --- | --- |
| The message summary and error summary | The leading part of the body, as recorded on the index row |
| The full archived message body | The whole payload, not just the summary — a term in the fifth HL7 segment is found |
| Event detail bodies | Node and system event text |
| Project, workflow, and node **names** | Matched on the name you see, not the underlying identifier |

The words are matched as one plain piece of text: there are no wildcards or boolean operators, so narrow a search with qualifiers rather than with search syntax. Text that only looks like a qualifier, such as `PID:3` or `http://host`, is searched as typed. To search for something that starts with a qualifier's name, such as `node:`, put it in double quotes.

Two limits worth knowing:

- **Only archived bodies can match.** A message whose payload exceeded the archiver's maximum payload size, or whose payload has since been purged by retention, cannot be found by its content. Its index row still matches on the summary.
- **A term that matches nothing is the slow case.** No index covers message text, so a search that finds no rows walks the whole table. A search that does match stops as soon as it has filled a page.

Without **Unredact PHI**, a row only counts as a match when the term is in what you would be shown, so a masked identifier can't be found by searching for it. Such a search can stop before filling a page; the table then says **Older messages haven't been searched yet**, and **Keep searching** carries on. See [Searching masked messages](../configurations/phi-masking.md#searching-masked-messages).

Tracing one message end to end is still the correlation ID: every node it passes through records the same one, so `correlation-id:` with that ID returns the whole journey.

The one other special word is `user:`. Typing `user:alice` (or `user:"alice smith"` for a name with spaces) shows that user's audit events instead of a text search. It matches the username exactly, ignoring case. See [Audit events](../security/index.md#audit-events).

### Qualifiers

| Qualifier | Narrows to | Values |
| --- | --- | --- |
| `project:` | Records from a project | A project name |
| `workflow:` | Records from a workflow | A workflow name |
| `node:` | Records from a node | A node name |
| `type:` | A kind of record | `data`, `system`, `node` |
| `event:` | An event type | See [Event types](#event-types) |
| `level:` | A level | `info`, `warn`, `error`, `debug`, `data` |
| `range:` | A recent period | `1h`, `24h`, `7d`, `30d` |
| `after:` | Records from this date or time onwards | `2026-10-07` or `2026-10-07T09:30` |
| `before:` | Records up to this date or time | `2026-10-07` or `2026-10-07T17:30` |
| `message-id:` | One message, by its message ID | The ID |
| `correlation-id:` | Every record of one message's journey | The correlation ID |

How they combine:

- **Several values of one qualifier match any of them.** Separate them with commas, `level:error,warn`, or repeat the qualifier, `project:ADT project:Lab`. This works for every qualifier except `range:`, `after:` and `before:`, which take one value each.
- **Different qualifiers narrow together.** `project:ADT level:error` is errors in the ADT project.
- **Names with spaces go in double quotes**: `project:"Lab Results"`, `node:"HL7 Listener"`.
- **Matching ignores case**: `level:ERROR` and `level:error` are the same, and `project:"lab results"` finds **Lab Results**.
- **A name matches everything in scope with that name.** `node:Listener` is every node called Listener in the projects you can see; add `workflow:` or `project:` to pick one.
- **Naming a workflow or node is enough.** The page works out which project (and workflow) it belongs to, so `node:"HL7 Listener"` on its own finds that node's records.
- **A bare date covers the whole day.** `after:2026-10-07` starts at the beginning of that day, and `before:2026-10-07` runs to its end. Add a time, `2026-10-07T09:30`, to be exact.
- **`range:` can't be combined with `after:` or `before:`.** Use one or the other.

#### Event types

`event:` takes an event type in lowercase with dashes. Naming one also narrows `type:` to the kind of record it belongs to.

| `type:` | `event:` values |
| --- | --- |
| `node` | `node-state-change`, `message-enqueued`, `message-dequeued`, `script-print`, `error-occurred` |
| `data` | `alert-delivered` |
| `system` | `runtime-crash-loop`, `runtime-down`, `archiver-crash-loop`, `archiver-down`, `log-db-unreachable`, `engine-crash-loop` |

#### Example searches

| To see | Type |
| --- | --- |
| Errors and warnings from one project | `project:"Lab Results" level:error,warn` |
| Everything one node did in the last hour | `node:"HL7 Listener" range:1h` |
| Node errors over the last week | `event:error-occurred range:7d` |
| Data messages on a given day that mention an MRN | `type:data after:2026-10-07 before:2026-10-07 MRN12345` |
| A morning's records from two projects | `project:ADT,Lab after:2026-10-07T08:00 before:2026-10-07T12:00` |
| The full journey of one message | `correlation-id:` followed by its correlation ID |

### Suggestions as you type

A menu opens under the search box as you type. At the start of a word it lists the qualifiers; after a qualifier's colon it lists that qualifier's values — your projects, workflows and nodes, the levels, the event types, and recent dates for `after:` and `before:`. Workflows are limited to the projects already named, and nodes to the workflows.

| Key | Does |
| --- | --- |
| **/** | Jumps to the search box from anywhere on the page |
| **↓** / **↑** | Moves through the suggestions |
| **Enter** or **Tab** | Picks the highlighted suggestion. With nothing highlighted, **Enter** runs the search |
| **Esc** | Closes the suggestions; press it again to leave the search box |

After picking a value, type a comma to add another value to the same qualifier.

A long search wraps onto more lines rather than scrolling out of sight. The **×** at the end of the box clears it.

### Picking a custom time range

Typing `range:`, `after:` or `before:` offers **Custom range…** at the end of the suggestions. It opens **From** and **To** date-and-time pickers:

- Either end may be left empty, for an open-ended window.
- **From** must be before **To**.
- **Apply** replaces any time filter already in the box with `after:` and `before:` for the times you picked.

### Values that don't match

A value that doesn't match anything — a misspelt level, a project you can't see, a workflow outside the project you named — is shown in red with a wavy underline and is **not applied**. A warning icon at the end of the box lists every value that wasn't applied and why; hover over it to read them. The suggestions menu shows the same message while your cursor is on the value.

### Links and bookmarks

The page's address holds the current search, so you can bookmark a view, share the link with a colleague, or refresh the page without losing your filters. 
Alert emails and Alert Node payloads carry a **View in Logs** link that opens this page with the project, workflow, or node already filled in. See [Alerting and Notifications](../notifications/index.md). If the link points at something since deleted, or whose logs have been purged, the page says so and offers **Show all logs**.

---

## New records arrive on their own

The Logs page tails the archive. The indicator at the left of the toolbar reads **Live** or **Paused**:

- **Live** — the page checks for newer records every 10 seconds. When you are parked at the top of a newest-first table, they are merged in silently. Otherwise a floating **_n_ new records** pill appears, and the rows only move when you click it.
- **Paused** — with the reason on hover:

| Paused because | Why |
| --- | --- |
| The search has a `before:` time, or a custom range with a **To** time | That makes the view a fixed window, so nothing new can fall inside it |
| You have read far enough back that the newest records were dropped from the table | New records can only be added above the newest ones. Click **Load newer** at the top of the table until you are back at the latest, and **Live** resumes |
| The resubmit window is open | It is a task you are in the middle of |
| The log index is being rebuilt | The page is already reporting that reads are slow |

There is nothing to switch on or off. Tailing does not count as user activity, so a Logs page left open on a wall display still times its session out normally, and after several hundred tailed rows the list restarts from the newest page rather than growing without limit.

---

## Reading a message

Click a row to open it in the **message inspector**, which slides open beside the table with the message's metadata, its related messages, and its body. HL7 messages render one segment per line. The inspector only appears while a message is open, so the table has the full width the rest of the time.

To make the inspector wider or narrower, drag the grip on its left edge (hover over it for **Drag to resize**). From the keyboard, **Tab** to the grip, then **←** widens the inspector and **→** narrows it.

| Key | Does |
| --- | --- |
| **↓** / **↑** | Opens the next or previous message in the table. With none open, **↓** opens the first and **↑** the last |
| **Esc** | Closes the inspector (so does the **×** in its corner) |

The arrow keys move between messages only when you aren't typing in the search box or another field, and not while a menu or window is open.

### Related messages

**Related messages**, under the message body, shows every record of the open message — everything that shares its correlation ID — in the order it moved through the workflow:

- **The route** along the top: each node the message passed through, joined by arrows, with the node you are viewing highlighted and the total time from first record to last.
- **The stops** below it, numbered in order. Each stop is one node, with its workflow (and its project, when the message crossed projects), and the records the message left there. Between stops, the time the message took to get from one to the next, such as **+9ms**.
- **Each record** shows its level, what happened (for example *Message enqueued*), the time and how long after the first record it came, and a two-line preview like the table's **Preview** column. The record you have open is marked **Viewing**; click any other to open it.

The panel opens tall enough to show a couple of records; drag its top edge to make it taller or shorter, and close it with its **×**.

---

## PHI on the Logs page

Patient identifiers are **masked by default**: HL7 v2 fields, and values in JSON and XML (FHIR included), as **Settings → Instance → PHI Masking** sets out. There are two **PHI** buttons, and each only affects its own part of the page:

- **The toolbar's PHI button** covers the **Preview** column in the table, and the previews under [Related messages](#related-messages). It's hidden every time you open the page and stays as you set it until you reload.
- **The inspector's PHI button** covers the message open in the inspector. Every message you open starts hidden — including when you move to the next one with the arrow keys — so showing one message's identifiers never carries over to another.

Either button reads **PHI hidden** while identifiers are masked. **Holding Unredact PHI**, click it to show them in full; it then reads **Hide PHI**, and clicking it again masks them by the same rules — useful when someone is looking over your shoulder.

**Without Unredact PHI** both buttons are disabled and PHI stays hidden. The masking is done on the server, so the identifiers never reach your browser.

See [PHI Masking](../configurations/phi-masking.md).

---

## Selecting messages

Tick a row's checkbox to select it, or **Select All** to select every row loaded in the table. The toolbar then shows how many are selected and a **Clear** button. **Resubmit** and **Download** act on the selection.

A selection stays as you read on, even when the rows scroll out of the table as older ones load, and when you change the search. **Resubmit** and **Download** act on everything selected, not only the rows on screen; **Clear** empties the selection.

---

## Downloading

**Download** exports the selected rows as **Plain Text** or **JSON**, and needs **Export log messages**. It is greyed out until at least one row is selected. Each export is itself recorded as an audit event.

---

## Resubmitting a message

**Resubmit**, in the toolbar, re-publishes the selected data messages onto the queue of the node that originally produced them. The button shows how many will be resubmitted, for example **Resubmit (3)**. Only data messages can be resubmitted: node and system events in the selection are skipped, and the button's tooltip says how many.

The button is greyed out, with a tooltip explaining why, when:

- You don't hold **Resubmit messages**.
- Nothing is selected.
- None of the selected rows is a data message.

Resubmitting also needs collaboration on each record's project — records from a project you are not on are skipped and reported.

**Resubmit** opens a review window listing each message. Opening a message there lets you review it. Correcting one before it goes back out is a separate right:

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
| **View log messages** | Open the page, search and filter it, and read a message's payload |
| **Unredact PHI** | Show masked patient identifiers with the **PHI** buttons, and edit a message before resubmitting it |
| **Export log messages** | Download selected records |
| **Resubmit messages** | Re-publish a stored message onto its originating queue |

None implies another, and project collaboration decides which records you see at all. See [Users and Roles](../configurations/user-roles.md).

---

## Next

- [Log Retention and Purge](../configurations/log-retention-purge.md)
- [Log Archive Database](../configurations/log-archive-database.md)
- [Message History Is Not Being Recorded](../troubleshooting/log-archiver-connectivity.md)
