---
title: Monitoring Workflows
description: Watch every workflow's status, queue and errors on the Monitor page, find them with the search box, and read or reposition a node's queue.
keywords: [monitor, workflow status, queue, view queue, replay, skip, reposition, search, filter]
---

# Monitoring Workflows

The **Monitor** page shows every workflow you can see, grouped by project: whether it is running, when it last did something, how many messages are waiting, and how many errors it has. It is where you start and stop workflows and nodes, and where you look into a node's queue.

---

## The page at a glance

Across the top is a toolbar:

| Left | Right |
| --- | --- |
| The search box, which wraps onto more lines as a search grows | The status tabs **All**, **On**, **Off** and **Failed**, then **Expand all** and **Collapse all** |

Below it is the workflow table, with one group per project. Each workflow row shows its **Status**, **Last activity**, **Queue**, **Errors** and **Project**. Select a workflow's arrow to show its nodes. Click a column heading to sort by it.

Right-click a project heading, workflow or node for its actions:

| Right-click | Actions |
| --- | --- |
| A project heading | **Open in project**, **Open in logs** |
| A workflow | **Open in project**, **Open in builder**, **Open in logs**, **Clear queue**, **Clear errors** |
| A node | **Open in builder**, **Open in scripting**, **Open in logs**, **View queue**, **Clear queue**, **Clear errors** |

---

## Status tabs

| Tab | Shows |
| --- | --- |
| **All** | Every workflow |
| **On** | Workflows that are running or processing |
| **Off** | Stopped workflows |
| **Failed** | Workflows with a failed node, including those where other nodes are still running |

The tabs combine with the search box: **Failed** with `project:"Lab Results"` shows the failed workflows in that project.

---

## Expand all and Collapse all

**Expand all** opens every project group. **Collapse all** folds every group down to its heading. Both act on project groups only: workflows keep their own open or closed state, so expanding all projects doesn't list every node on the instance.

---

## Searching and filtering

The search box works like the one on the [Logs page](../logs/index.md#searching-and-filtering). Plain words match project, workflow and node names. A `qualifier:value` token narrows to exactly what it names:

| Qualifier | Narrows to | Values |
| --- | --- | --- |
| `project:` | Workflows in these projects | Project name |
| `workflow:` | These workflows | Workflow name |
| `node:` | Workflows containing these nodes | Node name |
| `type:` | Workflows with a node of this type | `source`, `transform`, `destination` |
| `queue:` | Workflows by how many messages are waiting | `waiting`, `empty`, or a count such as `>100` |

Put names with spaces in double quotes: `project:"Lab Results"`. Separate several values of one qualifier with commas, or repeat it: `type:source,destination`. Values of one qualifier match any of them, and different qualifiers must all match.

### Filtering by queue size

`queue:` takes a comparison with the number of messages waiting across the workflow:

| Token | Shows workflows with |
| --- | --- |
| `queue:waiting` | Any messages waiting |
| `queue:empty` | Nothing waiting |
| `queue:>100` | More than 100 waiting |
| `queue:>=100`, `queue:<10`, `queue:<=10` | At least 100, fewer than 10, or at most 10 waiting |

In the suggestions, **> x** writes `queue:>` and leaves the cursor there for you to type the number.

### Which nodes are shown

When a search names nodes, by `node:`, `type:` or a plain word that matches a node's name, the workflows it finds open on their own and list only the matching nodes. A plain word that matches only a project or workflow name doesn't hide any nodes.

### Suggestions and mistakes

As you type, a menu suggests qualifiers and then their values, scoped by the rest of the search: after `project:"Lab Results"`, `workflow:` suggests only that project's workflows. Use the arrow keys and Enter or Tab to pick one.

Qualifier names are grey and the values they apply are blue. A value that doesn't match anything, such as a misspelt project, gets a red wavy underline and is left out of the filter rather than guessed.

The search and tab are kept in the page's address, so a refresh or a shared link opens the same view.

---

## Viewing a node's queue

Right-click a node and choose **View queue** to see the messages on its input queue. Source nodes don't read from a queue, so there is nothing to show for them.

Across the top, three figures:

| Figure | Means |
| --- | --- |
| **Waiting** | Messages the node hasn't processed yet |
| **Can be replayed** | Messages the node already processed that are still retained on the queue |
| **Node** | **Running**, processing messages as they arrive, or **Stopped**, with waiting messages staying queued |

Below them, the queue is listed oldest first in two groups, **Already processed** and **Waiting**, divided by a **Node resumes here** line. Select a message to see it in the panel beside the list: when it was produced, its offset, its correlation ID, its size and its content. **Next to process** marks the message the node will take next.

Reading message content here needs **View log messages**, and previews follow the [PHI masking](../configurations/phi-masking.md) policy. Long messages show only their start here; the Logs page has all of it.

### Changing where the node resumes

With the node stopped and the **Reposition queues** permission, you can move the point the node resumes from:

| Action | Effect |
| --- | --- |
| **Resume from this message**, on the selected message | The node starts from that message. The panel says what that does before you confirm: it skips the waiting messages before it, or runs already-processed messages again. |
| **Replay all** | Goes back to the oldest retained message, so every processed message runs again. |
| **Skip all** | Jumps past everything waiting, without processing it. |

**Replay all** and **Skip all** ask you to confirm, with the number of messages affected.

Nothing is deleted. Messages stay on the queue until retention removes them, so a move can be undone by moving back. Replayed messages are sent on to downstream systems a second time, so confirm the receiver tolerates duplicates. To run one specific message again, [resubmitting it](../logs/index.md#resubmitting-a-message) from the Logs page is usually safer.

While the node is running, the controls are locked and say why. Stop the node first. **Refresh** reloads the queue.

---

## Permissions

| Permission | Grants on this page |
| --- | --- |
| **Start/stop** | Start and stop workflows and nodes |
| **Clear queues** | **Clear queue** on a workflow or node |
| **Reposition queues** | **Resume from this message**, **Replay all** and **Skip all** in **View queue** |
| **Clear errors** | **Clear errors** on a workflow or node |

Anyone who can see a workflow can read its queue. See [Users and Roles](../configurations/user-roles.md).

---

## Related

- [Log Search and Message History](../logs/index.md)
- [Kafka Configuration](../configurations/kafka-redpanda.md): queue retention
- [Alerting and Notifications](../notifications/index.md)
