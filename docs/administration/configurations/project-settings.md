---
title: Project Settings
---

# Project Settings

Open a project by clicking its card on the **Projects** page. The popout that appears is where everything project-wide lives.

Across the top it shows four counters — **Workflow Count**, **Workflows Running**, **Nodes Running**, and **Current Queue** — then a row of tabs.

| Tab | Use it for |
| --- | --- |
| [Workflows](#workflows) | Create, start, stop, and open the project's workflows |
| [Variables](#variables) | Values shared by every workflow in the project |
| [Credentials](#credentials) | Connection secrets shared by every workflow in the project |
| [Templates](#templates) | Reusable node configurations, and importing them from another project |
| [Libraries](#libraries) | Versioned code bundles the project's scripts share |
| [Git](#git) | Project history, the remote, and **Export project** |
| Collaborators | Reserved. Collaborator management is not built yet. |

---

## Workflows

The default tab. Each row shows the workflow name, its state, its auto-start setting, queue depth, error count, and last activity.

| State | Meaning |
| --- | --- |
| **Off** | No nodes running |
| **Running** | Nodes running and ready |
| **Processing** | Running with messages in flight |
| **Failed** | At least one node errored |

Per-row actions:

| Action | Does |
| --- | --- |
| **Open in Builder** (hammer icon) | Opens the Workflow Builder to lay out and configure nodes |
| **Open in Monitor** (activity icon) | Opens live monitoring for that workflow |
| **Start** / **Stop** | Starts or stops every node in the workflow |

Header actions: **Add Workflow**, **Start All** / **Stop All**, and **Edit** — which reveals rename and delete on each row.

A workflow with no nodes has no Start button. There is nothing to run yet.

### Auto Start

Each row carries an **Auto start on** or **Auto start off** badge. It decides whether the Runtime starts that workflow by itself when it boots — after a server reboot, a service restart, or a Runtime restart from **Settings → Http Server**.

| Setting | At Runtime start-up |
| --- | --- |
| **Auto start on** | The workflow's nodes start automatically |
| **Auto start off** (default) | The workflow stays off until someone starts it |

To change it: click **Edit** in the tab header, open a workflow's edit dialog, and switch **Auto Start** on or off. It is saved with the workflow's name and description, and is committed to the project's history like any other change.

Turn it on for production interfaces that must come back on their own after a restart. Leave it off for anything half-built, or for a workflow whose destination is a live system you do not want written to unattended — an auto-started workflow begins consuming its queue as soon as the Runtime is up, with nobody watching.

Auto start is a property of the workflow, so it travels with the project into an export.

---

## Variables

> Project-level variables available to all workflows in this project.

Use variables for values that differ between environments but are not secret: hostnames, directory paths, account identifiers, feature switches.

1. Click **Edit**.
2. Click **Add Variable**.
3. Set a **Label** and a **Value**.
4. Click **Save**.

The label is the name your scripts and node configuration refer to, so use a stable, readable form. The default text reads `VARIABLE_NAME`.

Each row has a **Secret** checkbox. Ticking it masks the value in the UI and clears whatever was there, so you re-enter it deliberately. Use **Credentials** rather than a secret variable when the value is a password or key — it keeps the two concerns separate and makes an export easier to reason about.

:::tip Variables are what make a project portable
A project whose endpoints are variables is repointed by editing this tab. A project with hostnames typed into every node has to be edited node by node. Decide this early — it is the difference between a five-minute promotion and an afternoon of it. See [Import and Export](../deployment/import-export.md).
:::

---

## Credentials

> Project-level credentials available to all workflows in this project.

Same editor as Variables, used for connection secrets.

1. Click **Edit**.
2. Click **Add Credential**.
3. Set a **Label** — the hint text reads `Credential name` — and a **Value**.
4. Tick **Secret** for anything that must not be readable in the UI.
5. Click **Save**.

Reference credentials from node configuration and scripts by label. Never paste a password into a Lua file: the file is committed to the project's history and travels in an export.

:::caution Secret values do not travel in an export
Exporting a project keeps every credential's label and its **Secret** flag, but blanks the value. That is deliberate — a bundle is a file people pass around. After importing a project, come back to this tab and fill the values in for the new environment. The labels tell you exactly what is needed.
:::

---

## Templates

> Reusable node templates created from this project's workflows (via "Create template" on a node). Drag them from the node palette in the Workflow Builder to add a new node.

A template captures a configured node so the next one like it starts from the same settings instead of from defaults. Useful for a house-standard LLP listener, or a File/FTP node pointed at your usual directory layout.

**Creating one:** configure a node in the Workflow Builder, then use **Create template** on it. It is saved to the project and appears in the palette alongside the built-in node types.

**Copying from another project:** click **Import from Project**, pick a **Source Project**, tick the templates you want, and click **Import Selected**. This only reaches projects on the same installation. To move templates between installations, move the whole project — see [Import and Export](../deployment/import-export.md).

Template names must be unique within a project for a given node type. Importing one whose name is already taken is refused; rename the existing template first.

Each template row offers **Edit template** and delete.

---

## Libraries

> Reusable, versioned code bundles shared across this project's nodes. Created, edited, and linked to nodes from the Scripting page's Libraries picker.

This tab is read-only — a list of what exists, showing each library's name, its current working version, how many versions are published, and its description. A library that has never been published shows `unpublished`.

Create, edit, publish, and link libraries from the **Libraries** picker on the Scripting page, where a node links to a library at the point it is used.

Use a library rather than the project's `common` directory when you want versioning: a node pins a published version, so changing the library does not silently change every node that uses it.

Libraries travel inside a project export.

---

## Git

Every project is version controlled. This tab shows **Project History** — the commits covering structural changes and content edits from every user, newest first.

Click a commit to see its changed files, and a file to see its diff.

| Action | Does |
| --- | --- |
| **Export project** | Downloads the project as a `.zip` bundle another installation can import |
| **Configure remote** | Sets the **Remote SSH URL** this project pushes to and pulls from |
| Refresh icon | Re-reads the history |

**Push to remote** and **Pull from remote** are the cloud icons in the project header and on the project card. A dot on the icon means there is something to send or receive.

Both authenticate as whoever clicks them, using the **SSH private key path** set on that user in **Settings → Users**. There is no shared project key, which means a user without a key configured cannot push or pull.

The remote must be SSH — `git@host:path` or `ssh://host/path`. HTTPS URLs are not accepted. When you first configure a remote it must point at an empty repository, because the project's history is pushed into it.

See [Import and Export](../deployment/import-export.md) for moving projects between installations.

---

## Where instance-wide settings live instead

These are not project settings. They apply to the whole installation, in **Settings**:

| Setting | Tab |
| --- | --- |
| [HTTP server port and TLS](http-server.md) | **Http Server** |
| Grid port and TLS | **Instance** |
| Session timeouts | **Instance** |
| Users, and their SSH keys | **Users** |
| Roles and permissions | **Roles** |
| Log Archive DB | **Database**, **Logging** |
| Environment variables | **Environment** |
| License | **License** |

---

## Next

- [Import and Export](../deployment/import-export.md)
- [Users and Roles](user-roles.md)
- [Interface Development](../../interface-development/index.md)
