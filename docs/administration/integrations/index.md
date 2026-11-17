---
title: The Integrations Page
description: Run and watch every workflow on the Integrations page's Workflows tab, find them with the search box, read or reposition a node's queue, and manage projects on its Projects tab.
keywords: [integrations, monitor, projects, workflow status, queue, view queue, replay, skip, reposition, search, filter, add workflow, add project]
---

# The Integrations Page

Open **Integrations** in the sidebar. The page has two tabs at the top right:

| Tab | Use it for |
| --- | --- |
| [**Workflows**](#the-workflows-tab) | Every workflow you can see, with its live status, queue and errors. Start and stop workflows and nodes, add, edit and delete workflows, and look into a node's queue. This tab opens by default. |
| [**Projects**](#the-projects-tab) | The projects that hold the workflows. Add, import, reorder and open projects. |

Both tabs share one search box: a search typed on one tab is still there when you switch to the other.

:::note[Formerly the Monitor and Projects pages]
The Workflows tab is what used to be the **Monitor** page, and the Projects tab what used to be the **Projects** page. Old links to `/monitor` and `/projects` open the matching tab, with their filters kept.
:::

---

## The Workflows tab

It shows every workflow you can see, one row each: whether it is running, when it last did something, how many messages are waiting, and how many errors it has.

### The page at a glance

Across the top is a status summary. **Workflows**, **Running**, **Stopped** and **Failed** each show how many workflows are in that state, and each is also a filter: select one to list only those workflows. **Queued** and **Errors** show the totals across every workflow.

Below it is the search box, then **Expand all** and **Collapse all**.

Below that is the workflow table. Each row shows the workflow's name, how many nodes it has, and an **Auto start** or **Encrypted** tag when that setting is on. The other columns are **Project**, **Last activity**, **Queue** and **Errors**, then the workflow's **Start**, **Stop** or **Restart** button. The edge down a row's left side shows its status. Click a column heading to sort by it.

Click a workflow to open it: its description, then its nodes, each with its own **Start**, **Stop** or **Restart** button.

Right-click a workflow or node for its actions:

| Right-click | Actions |
| --- | --- |
| A workflow | **Open in project**, **Open in builder**, **Open in scripting**, **Open in logs**, **Clear queue**, **Clear errors**, **Edit workflow**, **Delete workflow** |
| A node | **Open in builder**, **Open in scripting**, **Open in logs**, **View queue**, **Clear queue**, **Clear errors** |

**Open in project** switches to the Projects tab and opens the workflow's project. A node whose stop has stalled also offers **Force kill**.

### Adding a workflow

1. Click **Add Workflow** at the top of the page.
2. Choose the **Project** it goes in. The list starts with **New project** for anyone who may create one.
3. Enter a **Name**, and optionally a **Description**.
4. Click **Create workflow**.

The new workflow is highlighted in the table, and a message offers **Open in builder**, where you add its nodes.

Workflow names are unique within a project, ignoring case: **Orders** and **orders** can't both be in one project. The dialog says so under **Name** and holds **Create workflow** back until the name is changed. Project names are unique on the whole grid in the same way.

### Editing and deleting a workflow

Right-click a workflow and choose **Edit workflow** to change its **Name**, **Description**, **Auto start** and **Payload Encryption**. Choose **Delete workflow** to remove it, after a confirmation. Both need the **Edit workflows** permission. See [Project Settings](../configurations/project-settings.md#workflows) for what auto start and deleting do.

### Status filters

| Filter | Shows |
| --- | --- |
| **Workflows** | Every workflow |
| **Running** | Workflows that are running or processing |
| **Stopped** | Stopped workflows |
| **Failed** | Workflows with a failed node, including those where other nodes are still running |

The status filters combine with the search box: **Failed** with `project:"Lab Results"` shows the failed workflows in that project. When a search or filter hides some workflows, a line above the table says how many are shown, with **Clear filters**.

### Expand all and Collapse all

**Expand all** opens every workflow to show its nodes. **Collapse all** closes them all again.

### Searching and filtering

The search box works like the one on the [Logs page](../logs/index.md#searching-and-filtering). Plain words match project, workflow and node names. A `qualifier:value` token narrows to exactly what it names:

| Qualifier | Narrows to | Values |
| --- | --- | --- |
| `project:` | Workflows in these projects | Project name |
| `workflow:` | These workflows | Workflow name |
| `node:` | Workflows containing these nodes | Node name |
| `type:` | Workflows with a node of this type | `source`, `transform`, `destination` |
| `queue:` | Workflows by how many messages are waiting | `waiting`, `empty`, or a count such as `>100` |

Put names with spaces in double quotes: `project:"Lab Results"`. Separate several values of one qualifier with commas, or repeat it: `type:source,destination`. Values of one qualifier match any of them, and different qualifiers must all match.

#### Filtering by queue size

`queue:` takes a comparison with the number of messages waiting across the workflow:

| Token | Shows workflows with |
| --- | --- |
| `queue:waiting` | Any messages waiting |
| `queue:empty` | Nothing waiting |
| `queue:>100` | More than 100 waiting |
| `queue:>=100`, `queue:<10`, `queue:<=10` | At least 100, fewer than 10, or at most 10 waiting |

In the suggestions, **> x** writes `queue:>` and leaves the cursor there for you to type the number.

#### Which nodes are shown

When a search names nodes, by `node:`, `type:` or a plain word that matches a node's name, the workflows it finds open on their own and list only the matching nodes. A plain word that matches only a project or workflow name doesn't hide any nodes.

#### Suggestions and mistakes

As you type, a menu suggests qualifiers and then their values, scoped by the rest of the search: after `project:"Lab Results"`, `workflow:` suggests only that project's workflows. Use the arrow keys and Enter or Tab to pick one.

Qualifier names are grey and the values they apply are blue. A value that doesn't match anything, such as a misspelt project, gets a red wavy underline and is left out of the filter rather than guessed.

The tab, the search and the status filter are kept in the page's address, so a refresh or a shared link opens the same view.

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

Reading message content here needs **View log messages**, and previews are masked by the [PHI masking](../configurations/phi-masking.md) policy. The window opens with PHI hidden every time. **Holding Unredact PHI**, click **PHI hidden** next to **Refresh** to fetch the previews unmasked; it then reads **Hide PHI**, and clicking it again masks them. Without **Unredact PHI** the button is disabled. Each project you see unmasked previews from is recorded as a PHI view in the audit events. Long messages show only their start here; the Logs page has all of it.

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

## The Projects tab

A list of every project on the grid, one row each. A row shows the project's name and description, how many **Workflows** it has, its total **Queue**, and **Start all** or **Stop all** for every workflow in it. The cloud icons at the end of the row push the project to its Git remote and pull from it.

| To | Do |
| --- | --- |
| Open the project's settings | Click the row. See [Project Settings](../configurations/project-settings.md). |
| Create or import a project | Click **Add Project**. See [Adding a project](#adding-a-project). |
| See its workflows on the Workflows tab | Right-click the row, choose **Show workflows**. The Workflows tab opens filtered to this project. |
| Open the Workflow Builder | Right-click the row, choose **Open in Builder** |
| Rename or re-describe it | Right-click the row, choose **Edit project** |
| Delete it | Right-click the row, choose **Delete project**, then type the project's name to confirm |
| Sort the list | Click the **Project**, **Workflows** or **Queue** heading. A third click returns to your own order. |
| Reorder the rows | Drag a row by the grip handle at its left. Rows can't be dragged while the list is sorted. |

**Edit project** and **Delete project** are greyed out without the **Edit project details** and **Delete projects** permissions. Row order is only a display preference, so it is open to everyone and saves as soon as you drop the row.

The search box filters the list to the projects whose name or description matches, or that hold a workflow the same search would show on the Workflows tab.

A project you do not collaborate on shows as **No access**: name and description only, with no counters and no right-click menu. A project nobody collaborates on shows **No collaborators**, with **Manage collaborators** for anyone who may add them. See [Collaborators](../configurations/project-settings.md#collaborators).

### Adding a project

Click **Add Project**. The **Add project** dialog has a tab for each way in:

| Tab | Does | Needs |
| --- | --- | --- |
| **New project** | Creates an empty project from a **Name** and an optional **Description**. Click **Create project**. | **Create projects** |
| **From zip** | Imports a project exported as a `.zip` bundle. Click **Import project**. | **Import/export projects** |
| **From remote** | Clones a project from its Git remote. Click **Import project**. | **Import/export projects** |

A tab you lack the permission for is greyed out. With no projects yet, the page offers **Create Project**, **From zip** and **From remote** in place of the list.

Project names are unique on the grid, ignoring case. A name already taken is refused, whether you create, rename or import the project. See [Import and Export Projects](../deployment/import-export.md) for the two import tabs.

---

## Permissions

| Permission | Grants on this page |
| --- | --- |
| **Start/stop** | Start and stop workflows, nodes and whole projects |
| **Clear queues** | **Clear queue** on a workflow or node |
| **Reposition queues** | **Resume from this message**, **Replay all** and **Skip all** in **View queue** |
| **Clear errors** | **Clear errors** on a workflow or node |
| **Edit workflows** | **Add Workflow**, **Edit workflow** and **Delete workflow** |
| **Create projects** | **New project** in **Add Project** and in **Add Workflow** |
| **Edit project details**, **Delete projects** | **Edit project** and **Delete project** |
| **Import/export projects** | **From zip** and **From remote** in **Add Project** |

Anyone who can see a workflow can read its queue. See [Users and Roles](../configurations/user-roles.md).

---

## Related

- [Project Settings](../configurations/project-settings.md)
- [Log Search and Message History](../logs/index.md)
- [Kafka Configuration](../configurations/kafka-redpanda.md): queue retention
- [Alerting and Notifications](../notifications/index.md)
