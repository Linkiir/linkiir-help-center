---
title: Users and Roles
---

# Users and Roles

Linkiir does not ship a fixed set of named roles. You create the roles your organisation needs, tick the permissions each one carries, then assign roles to users.

Both live in **Settings**: the **Roles** tab and the **Users** tab.

Access is decided by two independent gates, and a request has to clear both:

| Gate | Answers | Set in |
| --- | --- | --- |
| **Permissions** | What may this user *do*? | Roles, assigned to the user |
| **Collaborators** | Which projects may they do it *to*? | Each project's [Collaborators tab](project-settings.md#collaborators) |

A role granting **Edit node scripts** lets its holder edit scripts in the projects they collaborate on, and nowhere else.

---

## The permission set

There are 38 permissions in six groups. The groups are a convenience for the role editor — each one gets a heading you can tick or clear in a single click — and grouping changes nothing about what a permission does.

Every permission is a peer. None implies any other, there is no superuser, and a role grants exactly the boxes ticked on it: a role holding **Export log messages** without **View log messages** can export and not read.

### Run Control

Starting and stopping what is already built, and choosing what it runs.

| Permission | Grants |
| --- | --- |
| **Start/stop** | Start, stop, restart, and reload nodes, workflows, and projects |
| **Clear queues** | Discard the messages waiting on a node's queue |
| **Reposition queues** | Move a stopped node to a chosen point in its queue, skipping messages or replaying processed ones |
| **Set run commit** | Choose which commit of a node's code the Runtime executes |
| **Clear errors** | Mark a workflow's or node's current errors as seen on the Monitor page |

Repositioning is separate from clearing because it points both ways: moving a node backward re-delivers messages it already processed, which sends duplicates downstream.

### Projects

Everything reachable from a project card or the project popout, and the workflows inside a project.

| Permission | Grants |
| --- | --- |
| **Create projects** | Add a new, empty project |
| **Edit project details** | Rename a project and change its description |
| **Delete projects** | Remove a project and everything in it |
| **Edit project variables** | Change a project's variables and secrets |
| **Edit repository settings** | Change a project's or template group's remote and credentials |
| **Import/export projects** | Export a project archive, or import one from a file or remote |
| **Add collaborators** | Grant another user access to a project |
| **Remove collaborators** | Revoke another user's access to a project |
| **Edit workflows** | Create and delete workflows, and add, remove, connect, and move the nodes on their canvas |
| **Manage node templates** | Create, import, edit, and delete node templates and template groups |

### Logs

Reading message history.

| Permission | Grants |
| --- | --- |
| **View log messages** | Browse and filter the log index, and open a message's payload |
| **Unredact PHI** | Reveal the patient identifiers a payload is masked to hide |
| **Export log messages** | Download selected messages as a file |
| **Resubmit messages** | Re-produce a stored message onto its originating topic |

Reading a message includes reading its body — the index row already names the identifiers the payload carries, so gating the two separately drew a line where there was not one. What *is* separate is seeing PHI unmasked: payloads render redacted for everyone without **Unredact PHI**.

### Scripting

Authoring: node code, shared libraries, and source control.

| Permission | Grants |
| --- | --- |
| **Edit node scripts** | Write a node's files, manage its test samples, and run and debug it against them |
| **Manage shared libraries** | Create, edit, publish, and delete shared libraries and their dependencies |
| **Commit, push, and pull** | Stage, commit, restore, and exchange commits with the remote |

Writing a script, giving it samples, running it against them, and stepping through it are one job and one permission. Splitting them produced roles that could write a script but not check it.

**Reading node and library source needs one of these three.** Node files, library files, test samples, schemas, and file diffs — including the diffs shown in the project popout's commit history — are not part of the read floor every account gets. Any one of the three permissions above admits you to reading that code, which is the same set the Scripting page itself admits. A role with no scripting permission cannot read a node's script, from the page or from the Web API.

What stays readable without them is the metadata around the code: which files a commit touched, the working tree's change list, and a library's name and versions. Those say nothing about what the code does.

**Taking a copy off the grid is stricter.** Downloading a file from the Scripting page's Explorer needs **Edit node scripts** specifically — seeing a script takes any scripting permission, saving it to your own machine takes the one that would let you change it.

### Node Configuration

Changing how an existing node is set up, without authoring it.

| Permission | Grants |
| --- | --- |
| **Edit config values** | Change the value of a node's existing config fields |
| **Edit config fields** | Add, remove, or redefine the config fields themselves |
| **Edit node details** | Change a node's name, description, and other details |

Any one of the three opens the Builder's Node Parameters panel, and what you actually changed decides which one the save needs. See [The Node Parameters panel](../../interface-development/interfaces/index.md).

### Administration

Instance-wide settings. Nothing here grants access to projects, logs, or the Builder.

| Permission | Grants |
| --- | --- |
| **Manage users** | Create and delete users, and assign roles to them |
| **Manage roles** | Create, edit, and delete roles and their permissions |
| **Security settings** | Session timeouts and password policy |
| **Server settings** | Instance label, port, and TLS certificates |
| **Database settings** | The instance's database connection |
| **Environment variables** | Instance-wide environment variables |
| **HTTP server settings** | The inbound HTTP listener, including restarting the Runtime so a change takes effect |
| **Backup settings** | Backup schedule, and running a backup on demand |
| **Logging settings** | Log retention and destinations, and testing the queue connection |
| **Notification settings** | Alert rules, email transport, and notification channels |
| **Manage archivers** | Add, remove, start, and stop log archiver instances |
| **Manage license** | Apply, release, and remove the instance license |
| **Manage catalogs** | Subscribe to, update, and publish catalogs of adapter nodes and libraries |

---

## Roles

**Settings → Roles** lists every configured role, with a pill for each permission it holds. Anyone can read this tab; changing it needs **Manage roles**.

A fresh installation has one role, `admin`, marked **built-in**. It always holds every permission — including permissions added by a later version — and cannot be edited or deleted, so its row has no actions. It is the role assigned to the seeded administrator account.

### Create a role

1. Click **Add Role**.
2. Enter a **Role name**.
3. Tick permissions. Each group heading ticks or clears its whole group, and **Select all** / **Clear all** covers the catalog.
4. Click **Save**.

Role names must be unique.

### Change or remove a role

**Edit** on the row reopens the same checklist. The role name itself cannot be changed after creation — create a new role and reassign its users instead.

The trash icon deletes a role. Users keep the role name on their record, and a name with no matching role grants nothing, so deleting a role quietly narrows its holders' access rather than breaking their sessions. Check who is assigned before removing one.

### Roles are additive

A user's permissions are the union of every role they hold. There is no deny flag and no precedence: adding a role can only widen access, and removing one is how you narrow it.

### A workable starting set

Nothing here is built in; these are combinations worth considering.

| Role | Tick | For |
| --- | --- | --- |
| `admin` | Everything | Platform administration. Ships with the product. |
| `developer` | Projects, Scripting, Node Configuration, Run Control, and **View log messages** | Building and testing interfaces |
| `operator` | **Start/stop**, **Clear errors**, **Clear queues**, **View log messages** | Running the platform day to day without changing it |
| `support` | **View log messages** | Answering "did the message arrive?" without changing or starting anything |
| `analyst` | **View log messages**, **Export log messages** | Reporting and reconciliation |
| `access-admin` | **Manage users**, **Manage roles**, **Add collaborators**, **Remove collaborators** | Granting access without being able to read what is inside a project |

Withhold the Scripting and Node Configuration groups from operational roles. They are what separate running an interface from changing one.

:::caution[Grant PHI access deliberately]
**Unredact PHI** is what turns a masked payload into readable patient data. Decide it separately rather than letting a broad "developer" role pick it up on the way past.
:::

---

## Users

**Settings → Users** lists every account with the roles assigned to it. Managing accounts needs **Manage users**.

### Create a user

1. Click **Add User**.
2. Fill in **Username**, **Name**, and **Email address**. All three are required, and the email address must be well formed.
3. Set a **Password**, and re-type it in **Confirm Password**. **Save** stays unavailable while the two do not match.
4. Select **Roles**.
5. Optionally set **SSH private key path**.
6. Click **Save**.

The username is the login identifier and cannot be changed afterwards. A new account is created needing a password change, so the password you set is replaced by the user at their first login.

Commits are attributed to the **Name** and **Email address** on the account: every git commit Linkiir makes carries the identity of the user who triggered it. With no email address on record it falls back to `username@linkiir.local`. There is no instance-wide git identity.

### SSH private key path

This is how a user authenticates when pushing a project to a Git remote, pulling from one, or importing a project from a remote.

| Detail | Behaviour |
| --- | --- |
| It is a **path** | The path to a private key file on the Linkiir server, for example `/path/to/id_rsa`. Not pasted key material. |
| It is per user | Every push and pull authenticates as whoever triggered it. There is no shared project or admin key. |
| A browse button is provided | It starts at `~/.ssh/id_rsa`. |
| Linkiir can create one for you | The key button beside the field generates a key pair in the user's own folder — see below. |

A user with no key configured cannot push, pull, or import from a remote. They can still export and import zip bundles. Remotes must be SSH; `https://` remotes are not supported.

### Generate an SSH key

Edit the user, then click the key button beside **SSH private key path** (*Generate an SSH key, or test this one against a git server*). The account has to exist first, so this is on the Edit form rather than Add User.

| Step | What happens |
| --- | --- |
| Choose **Ed25519** or **RSA 4096**, then **Generate SSH key** | A passphrase-less key pair is created in the user's folder on the server, and the user's profile is pointed at it |
| **Copy public key** | Register this on the git host, against the account or repository Linkiir will use |
| **Test connection** | Authenticates against a host with that key and reports the verdict. One-click buttons cover GitHub, GitLab, Bitbucket, and Azure DevOps; typing a host name, an `ssh://` URL, or `git@host:org/repo` all work, and the repository part is ignored |
| **Regenerate** → **Replace key** | Creates a new pair. Confirmed in two clicks, because the old public key stops working everywhere it is registered |

Points worth knowing before you use it:

- **Ed25519 is the default.** Choose **RSA 4096** for Azure DevOps, which does not accept Ed25519 keys.
- **The key has no passphrase**, because nothing can type one during an unattended push. Its protection is file permissions on the server, plus its exclusion from the instance repository.
- **The private key is never shown, downloaded, or committed.** Only its path is stored on the profile.
- **A key is per user and self-service.** Anyone can generate and test their own key from their own row; doing it for somebody else needs **Manage users**.
- **A test can fail where a real push succeeds.** The test deliberately ignores the server's SSH configuration so that a pass proves *this* key works — a host reached through a jump host or a rewritten host name is the case to expect this on.
- **Generated keys are not in the instance repository**, so they are not carried by the backup remote Linkiir pushes to. After restoring an instance from that remote, regenerate each user's key and register the new public half. A filesystem copy of the working directory does include them. See [Backup and Restore](../backup-restore/index.md).

### Change a password

Edit the user, set **New Password**, and re-type it in **Confirm New Password**. Leaving both blank keeps the current password; once either is filled in they have to match before **Save** is available.

Users can change their own password this way — the Edit button appears on your own row whether or not you hold **Manage users**. An administrator can reset any user's password the same way. There is no "forgot password" flow.

### Delete a user

The trash icon, with a confirmation. Deleting an account ends its sessions.

:::warning[You cannot remove the last access administrator]
A change that would leave nobody holding both **Manage users** and **Manage roles** is refused — whether by deleting that user or by editing their roles down. There is no superuser to fall back on, so an installation that lost them would need manual recovery on the server.

Keep at least two accounts holding both.
:::

---

## Project access

Permissions are instance-wide; the projects they apply to are not. Membership is the [Collaborators tab](project-settings.md#collaborators) on each project.

- Every user can see that a project exists and what it is called. A project they do not collaborate on shows as **No access** — name and description, nothing else — so "ask someone for access" is a possible conversation.
- There is no owner and no implicit access. Whoever creates a project is added as its first collaborator like anyone else, and can be removed like anyone else.
- Managing membership is not the same as having it. **Add collaborators** works on every project on the instance — that is what makes lockout recoverable — but grants no access to what is inside them.
- A project with an empty collaborator list is legal, and locked to everybody until someone holding **Add collaborators** puts a name back.

Membership lives inside the project, so it travels with an export or a git sync, and deleting the project takes its access list with it.

---

## Enforcement

Permissions are enforced by the Grid itself, not merely reflected in the interface. Controls a user cannot use are disabled and name the permission they need, and calling the [Web API](../../api/web-api/linkiir-api) directly is refused the same way, with a message naming the missing permission.

---

## Practices worth adopting

**One account per person.** Shared accounts make the login and change history useless.

**Keep the seeded `admin` account for recovery.** Give people named accounts with narrower roles, and store the `admin` password in your privileged-access system.

**Assign the narrowest role that lets someone do their job.** Adding a permission later is easy; discovering after an incident that everyone could edit production is not.

**Review assignments on a schedule.** Remove access when responsibilities change, not when someone leaves.

**Set SSH keys only for the users who need them.** A key on an account that never pushes is an unnecessary credential on the host, and each one has to be registered with the git host separately.

**Withhold the Scripting group from roles that should not read interface code.** Node and library source is only readable by accounts holding one of those three permissions, so leaving them off a support or reporting role is what keeps scripts out of reach.

---

## What is not in the product today

Being explicit so you can plan around it:

| Not available | Consequence |
| --- | --- |
| Account lockout or login rate limiting | Protect the Grid at the network layer, and behind a reverse proxy if it is reachable remotely |
| Password complexity or reuse rules | Only a minimum length of 8 characters and "not the current password" are enforced. Set your own standard by policy. |
| Self-service password reset | A user can change their own password from the Users tab while signed in, but a forgotten one is reset by an administrator |
| A profile page of its own | Managing your own name, password, and SSH key happens through your row on the Users tab rather than a separate profile screen |
| External identity providers (LDAP, SAML, OIDC) | Accounts are local to the installation |
| Per-project roles | Collaboration decides *which* projects a user reaches, not what they may do once inside. Permissions are the same in every project they collaborate on. |

---

## Recovering a lost administrator password

Covered in [Create Grid User Accounts](../../getting-started/first-login.md), including the procedure for re-seeding the bootstrap account when every password is lost.

---

## Next

- [Create Grid User Accounts](../../getting-started/first-login.md)
- [Security](../security/index.md)
- [Project Settings](project-settings.md)
