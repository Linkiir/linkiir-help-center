---
title: Project Settings
---

# Project Settings

Open a project by clicking its row on the **Projects** tab of the [Integrations](../integrations/index.md#the-projects-tab) page. The popout that appears is where everything project-wide lives.

The Projects tab is also where you create, import, rename, delete and reorder projects. See [The Projects tab](../integrations/index.md#the-projects-tab).

---

## The project popout

Its header shows the project's name and description (and a **Grid Default** chip on the [Grid Default](../integrations/index.md#the-grid-default-project) project), with **Export project** and the **Push to remote** and **Pull from remote** cloud icons. Below it are four counters — **Workflow count**, **Workflows running**, **Nodes running**, and **Current queue** — then a row of tabs.

| Tab | Use it for |
| --- | --- |
| [Workflows](#workflows) | Create, start, stop, and open the project's workflows |
| [Variables](#variables) | Values shared by every workflow in the project |
| [Templates](#templates) | Reusable node configurations, and importing them from another project |
| [Libraries](#libraries) | Versioned code bundles the project's scripts share |
| [Git](#git) | Project history and the remote |
| [Collaborators](#collaborators) | Who may open this project at all |

---

## Workflows

The default tab. Each row shows the workflow name and description, a status dot, its auto-start setting, queue depth, error count, and last activity. Hover over the dot to see the workflow's state.

| State | Meaning |
| --- | --- |
| **Off** | No nodes running |
| **Running** | Nodes running and ready |
| **Processing** | Running with messages in flight |
| **Failed** | At least one node errored |
| **Degraded** | A node errored while others are still running |

Per-row actions:

| Action | Does |
| --- | --- |
| **Open in Workflows view** (workflow icon) | Opens the Integrations page's **Workflows** tab filtered to this project, with the workflow's name in the search box |
| **Open in Builder** (hammer icon) | Opens the Workflow Builder to lay out and configure nodes |
| **Open in Scripting** (code icon) | Opens the workflow on the Scripting page |
| **Open in Logs** (scroll icon) | Opens the Logs page for the workflow |
| **Start** / **Stop** | Starts or stops every node in the workflow |
| **Restart** | Shown instead of **Start** / **Stop** on a failed or degraded workflow |

Header actions: **Start All** / **Stop All**, **Add Workflow**, and a sort button that cycles the order rows are listed in. **Add Workflow** here adds the workflow to this project; the Integrations page's **Add Workflow** asks which project it goes in.

Right-click a workflow row for **Edit workflow** — name, description, **Auto start**, and **Payload Encryption** — **Move to project…**, and **Delete workflow**. They need the **Edit workflows** permission; without it the menu does not open. The same actions are on a workflow's right-click menu on the Integrations page's [Workflows tab](../integrations/index.md#editing-and-deleting-a-workflow). See [Moving a workflow to another project](../integrations/index.md#moving-a-workflow-to-another-project).

Workflow names are unique within a project, ignoring case, so a name already used in the project is refused.

**Delete workflow** removes the workflow and its nodes from every user's copy of the project, including changes in it that nobody has committed yet. What was committed stays in the project's history.

A workflow with no nodes has no Start button. There is nothing to run yet.

### Auto Start

Each row carries an **Auto start on** or **Auto start off** badge. It decides whether the Runtime starts that workflow by itself when it boots — after a server reboot, a service restart, or a Runtime restart from **Settings → Http Server**.

| Setting | At Runtime start-up |
| --- | --- |
| **Auto start on** | The workflow's nodes start automatically |
| **Auto start off** (default) | The workflow stays off until someone starts it |

To change it: right-click the workflow row, choose **Edit workflow**, and switch **Auto start** on or off. It is saved with the workflow's name and description, and is committed to the project's history like any other change.

Turn it on for production interfaces that must come back on their own after a restart. Leave it off for anything half-built, or for a workflow whose destination is a live system you do not want written to unattended — an auto-started workflow begins consuming its queue as soon as the Runtime is up, with nobody watching.

Auto start is a property of the workflow, so it travels with the project into an export.

---

## Variables

> Values shared by every workflow in this project. Use one in a node setting with the `{x}` button (it reads `${project:NAME}`), or in a script with `linkiir.config.project().NAME`. Nodes pick up a change when they restart.

The Grid Default project can't hold variables. Its **Variables** tab says so and offers **New project** to anyone who may create one. Create a project of your own, then move the workflows into it.

Use variables for the values that differ between environments: hostnames, directory paths, account identifiers, feature switches — and, with the **Secret** flag set, the passwords and keys those endpoints need.

1. Click **Edit**.
2. Click **Add Variable**.
3. Set a **Label** and a **Value**.
4. Click **Save**.

### Naming a variable

The label is the variable's name: node settings refer to it as `${project:LABEL}` and scripts as `linkiir.config.project().LABEL`. Pick a stable name, since renaming it means updating everything that uses it.

A name can use letters, digits, `_`, `.` and `-`, and can't start with a digit, so `DEST_HOST`, `api.host` and `sftp-user` are all fine. Each name can be used only once in a project. The tab points out a name that breaks these rules, and **Save** stays unavailable until it's fixed.

### Using a variable in a node

In a node's **Configure** dialog, text, path, number and password fields can take a project variable. On/off switches and lists can't. See [Using project variables in a node](../../interface-development/interfaces/index.md#using-project-variables-in-a-node).

- **Text fields** can mix a variable with other text, such as `https://${project:API_HOST}/v1`.
- **Number fields** take a variable as their whole value.
- The **Node Parameters** panel shows the variable's value, not the `${project:...}` text. Passwords still show as dots.

### Using a variable in a script

```lua
local Vars = linkiir.config.project()     -- every variable by name
local Host = Vars.API_HOST
local Token = Vars.API_TOKEN               -- secrets come back decrypted

local Url = linkiir.config.resolve('https://${project:API_HOST}/v1')
```

A node field that holds a reference reads as the variable's value through `linkiir.config.node()` too. See [Node Configuration](../../api/scripting-api/node-configuration.md).

### When a change takes effect

A running node reads the project's variables when it starts. After changing a variable, restart the nodes that use it. A node doesn't need a new commit or pin to pick up the change.

**Run Test** and **Debug** on the Scripting page use your own copy of the project's variables, which is updated when the variables are saved.

### Where a variable is used

Each variable that node settings use shows a count, such as **2 uses**. Hover over it to see which workflow, node and field.

If a save renames or removes a variable that nodes still use, or makes one secret while an ordinary field uses it, a **Variables in use** window lists those nodes before anything is saved. Choose **Keep editing** to go back, or **Save anyway** to save. Those nodes then refuse to start until their settings are changed.

### Secrets

Each row has a **Secret** checkbox. This is where connection passwords and keys belong — there is no separate credentials tab. Ticking **Secret** masks the value in the UI and clears whatever was there, so you re-enter it deliberately, and the value is encrypted at rest rather than stored as plain text. Password-typed fields on a node's configuration are protected the same way.

A secret variable can be used only in a node's **password** fields, and in scripts. An ordinary field can't use one, because ordinary values can appear in logs. The `{x}` button offers secrets only on password fields, and a node that uses one elsewhere won't save. Never paste a password into a Lua file: the file is committed to the project's history and travels in an export.

If a secret can't be read, the node or script says why:

| Message ends with | What to do |
| --- | --- |
| …was encrypted with a different key than the grid's encryption key | Re-enter the value on this tab. It was saved by another installation, or before this grid's key changed. |
| …should be encrypted, but its stored value isn't | Re-enter the value on this tab. |
| …is encrypted, but the grid's encryption key isn't available here | Re-entering won't help. The grid was started without its encryption key; contact your administrator. |

:::note
Renaming a secret keeps its stored value as it was. If a secret already couldn't be read, re-enter it as well as renaming it.
:::

:::caution[Secrets do not survive a move to another installation]
Secrets leave in their encrypted form, and only the installation that encrypted them can read them back. Import the bundle somewhere else and every secret arrives unreadable — the labels are intact, the values are not usable. Re-enter them on the target before starting anything.

Restoring onto the same installation, with the same key, keeps them working.
:::

:::tip[Variables are what make a project portable]
A project whose endpoints are variables is repointed by editing this tab. A project with hostnames typed into every node has to be edited node by node. Decide this early — it is the difference between a five-minute promotion and an afternoon of it. See [Import and Export](../deployment/import-export.md).
:::

---

## Templates

> Reusable node templates created from this project's workflows (via "Create template" on a node). Drag them from the node palette in the Workflow Builder to add a new node.

A template captures a configured node so the next one like it starts from the same settings instead of from defaults. Useful for a house-standard LLP listener, or a File/FTP node pointed at your usual directory layout.

**Creating one:** configure a node in the Workflow Builder, then use **Create template** on it. It is saved to the project and appears in the palette alongside the built-in node types.

The whole node is captured — every script it has and the library versions it pins, not just its entry-point script. A node built from an adapter carries several modules and a library dependency, and a template holding only one file could not run.

**Sample messages** are the one part you choose, and they are left out by default. Every other file in a node is something an author wrote; a sample is a message captured to test against, which on a live grid is real traffic. Turn **Sample Messages** on only when the samples are safe to travel — a template can be reused by a colleague, copied into another project, or promoted into a catalog and shipped to customers.

Files that came from a pinned library are deliberately not copied. Those belong to the pin, and are restored from the version the template names — carrying frozen copies would mean a template that kept shipping a library's old code after its pin had moved on.

**Replacing one:** saving a template whose name is already taken for that node type replaces it outright rather than merging. The dialog says so before you confirm, because names collide once punctuation and case are stripped — "My Adapter" lands on "my adapter" without your having aimed at it. Nodes already built from the old template keep their own copies and are unaffected.

**Copying from another project:** click **Import from Project**, pick a **Source Project**, tick the templates you want, and click **Import Selected**. Any libraries the templates pin that this project does not already have come across with them. This only reaches projects on the same installation. To move templates between installations, move the whole project — see [Import and Export](../deployment/import-export.md) — or publish them in a [catalog](../../catalogs/index.md).

Right-click a template row for **Edit template** and **Delete template**. Both need the **Manage node templates** permission.

---

## Libraries

> Reusable, versioned code bundles shared across this project's nodes. Created, edited, and linked to nodes from the Scripting page's Libraries picker.

The tab lists what exists, showing each library's name, its current working version, how many versions are published, and its description. A library that has never been published shows `unpublished`.

Create, edit, publish, and link libraries from the **Libraries** picker on the Scripting page, where a node links to a library at the point it is used.

**Copying from another project:** click **Import from Project**, pick a **Source Project**, tick the libraries you want, and click **Import Selected**. The whole library comes across — the working copy and every published version. A name already taken in this project is refused rather than merged, and this only reaches projects on the same installation.

**Copying straight to a node:** the Scripting page's **Add Library** picker has an **Other Projects** tab when there is another project. Pick the project in **Project to copy from**, choose the library's version, and click **Add**. The library comes across with every published version, and the version you picked is linked to the node. A library with no published versions shows **Import** instead, which copies it without linking it. A library this project already has reads **In this project**: link it from the **Project Libraries** tab instead.

**Removing one:** right-click a library row and choose **Remove library from project** (needs **Manage shared libraries**). Before you confirm, the dialog lists every node that currently links to it — workflow, node, and the version each is pinned to — so you can see what the removal touches. Those nodes are unlinked automatically and keep running: their own scripts are untouched, but anything they called from the library is gone.

Use a library rather than the project's `common` directory when you want versioning: a node pins a published version, so changing the library does not silently change every node that uses it.

Libraries travel inside a project export. Importing a project also carries the library versions its nodes pin, so those nodes arrive able to resolve their dependencies.

**Published versions are immutable.** Publishing checks the project hub rather than only your own clone, so two collaborators cannot each publish a different `2.0.0`. Publishing propagates to other collaborators' clones straight away, so their version pickers and update indicators reflect it without waiting for a pull.

Libraries can also be installed from a subscribed catalog, and a catalog library upgrade is offered to every project that has it installed. See [Using catalog content](../../catalogs/using-catalog-content.md).

Linkiir also ships one library with the Grid: **lkcodemap**, which translates codes through code tables. It is listed under **Linkiir** on the picker's **Catalog Libraries** tab, and is installed into a project the first time a Data Map node is made there. See [Code Tables in Lua](../../interface-development/lua-programming/code-tables.md).

---

## Collaborators

> Only collaborators can open this project. Everyone else sees that it exists and nothing more.

Permissions decide what a user may do; this tab decides which projects they may do it to. Both have to allow an action for it to go through — see [Users and Roles](user-roles.md).

A collaborator is a user or a role. A role puts everyone who holds it on the project, for as long as they hold it: give someone the role and they can open the project, take the role away and they can't. The tab lists **Roles** and **Users** in two groups. Each role shows how many users hold it now; each user shows whether the account is local or external, and **Disabled** for a disabled account.

| Action | Needs | Does |
| --- | --- | --- |
| **Add Collaborators** | **Add collaborators** | Opens the **Add collaborators** dialog |
| Trash icon on a row | **Remove collaborators** | Removes that user or role, after a confirmation |

The **Add collaborators** dialog has a **Users** tab and a **Roles** tab, sharing one filter box. Tick users and roles on either tab, then add them together. Users already on the project, and roles already on it, aren't listed. A disabled account can't be ticked. External users appear only after they have signed in once.

Removing a role takes access away from its users, unless they are on the project by name or through another role. Deleting a role in **Settings → Roles** removes it from every project too.

Your own row is marked **You**, and you can remove yourself — the confirmation says so plainly, because it takes your own access away.

The Grid Default project has no collaborators: everyone can open it. Its **Collaborators** tab says so and offers **New project**, for a project of your own that only the people you choose can open.

There is no owner. Whoever creates the project is added as its first collaborator like anybody else. That means the project can end up with no users and no roles, which is legal and shows as *Nobody is on this project. It cannot be opened until someone is added.* Anyone holding **Add collaborators** can reopen it, on any project on the instance; that permission is what makes a lockout recoverable, and it grants no access to the contents on its own.

A project you are not on still appears on the Integrations page's **Projects** tab as **No access**, with its name and description and nothing else — no workflows, no counters, no right-click menu. Someone holding **Add collaborators** or **Remove collaborators** can still open such a project, and the popout then shows this tab and nothing else: enough to grant access, not enough to read the project.

The collaborator list lives inside the project, so it travels with an export and with a git sync, and deleting the project takes it along.

---

## Git

Every project is version controlled. This tab shows **Project History** — the commits covering structural changes and content edits from every user, newest first.

Click a commit to see its changed files, and a file to see its diff.

Above the history, the tab says which remote the project is linked to, or **Local only - no remote configured**, and how many commits there are.

| Action | Does |
| --- | --- |
| **Configure remote** | Sets the **Remote SSH URL** this project pushes to and pulls from |
| Refresh icon | Re-reads the history |

**Export project**, in the popout's header, downloads the project as a `.zip` bundle another installation can import. See [Import and Export](../deployment/import-export.md).

**Push to remote** and **Pull from remote** are the cloud icons in the popout's header and on the project's row on the Projects tab. A dot on the icon means there is something to send or receive.

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
