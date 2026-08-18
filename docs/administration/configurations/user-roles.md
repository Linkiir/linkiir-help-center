---
title: Users and Roles
---

# Users and Roles

Linkiir does not ship a fixed set of named roles. You create the roles your organisation needs and choose which permissions each one carries, then assign roles to users.

Both live in **Settings**: the **Roles** tab and the **Users** tab.

---

## The permission set

There are five permissions. A role is a name plus any combination of them.

| Permission | Grants |
| --- | --- |
| **Edit** | Changing configuration — projects, workflows, nodes, and their settings |
| **Start / Stop** | Starting and stopping workflows and nodes |
| **Export Logs** | Exporting message history out of the Grid |
| **View Logs** | Reading message history and node events |
| **IDE** | The script editor, including Run Test and Debug |

That is the whole list. There is no separate permission for viewing raw payloads, changing credentials, purging logs, or exporting projects.

:::caution Design your separation of duties around what the platform enforces
Because the permission set is coarse, some separations you may want are not available as a permission. **Edit** covers project and node configuration together, and anyone with **Edit** on a project can change its credentials and export it. Where a stricter split matters, use separate installations per environment rather than relying on roles to enforce it within one — see [Deployment](../deployment/index.md).
:::

---

## Roles

**Settings → Roles** lists every configured role and the permissions each holds.

A fresh installation has one role: `admin`, holding all five permissions. It is the role assigned to the seeded administrator account.

### Create a role

1. Click **Add Role**.
2. Enter a **Role name**.
3. Click the permission pills to select the **Permissions** it grants.
4. Click **Save**.

Role names must be unique.

### Change or remove a role

Use **Edit** on the row to change its permissions. The role name itself cannot be changed after creation — create a new role and reassign its users instead.

The trash icon deletes a role. Deleting a role does not delete the users who held it, so check who is assigned before removing one.

### A workable starting set

Nothing here is built in; these are combinations worth considering.

| Role | Permissions | For |
| --- | --- | --- |
| `admin` | All five | Platform administration. Ships with the product. |
| `developer` | Edit, Start / Stop, View Logs, IDE | Building and testing interfaces |
| `operator` | Start / Stop, View Logs | Running the platform day to day without changing it |
| `support` | View Logs | Answering "did the message arrive?" without any ability to change or start anything |
| `analyst` | View Logs, Export Logs | Reporting and reconciliation |

Withhold **Edit** and **IDE** from operational roles. They are what separate running an interface from changing one.

---

## Users

**Settings → Users** lists every account with the roles assigned to it.

### Create a user

1. Click **Add User**.
2. Fill in **Username**, **Name**, and **Email address**. All three are required.
3. Set a **Password**.
4. Select **Roles** from the pill grid.
5. Optionally set **SSH private key path**.
6. Click **Save**.

The username is the login identifier and cannot be changed afterwards.

### SSH private key path

This is how a user authenticates when pushing a project to a Git remote, pulling from one, or importing a project from a remote.

| Detail | Behaviour |
| --- | --- |
| It is a **path** | The path to a private key file on the Linkiir server, for example `/path/to/id_rsa`. Not pasted key material. |
| It is per user | Every push and pull authenticates as whoever triggered it. There is no shared project or admin key. |
| A browse button is provided | It starts at `~/.ssh/id_rsa`. |

A user with no key configured cannot push, pull, or import from a remote. They can still export and import zip bundles.

### Change a password

Edit the user and set **New Password**. Leaving it blank keeps the current password. An administrator can reset any user's password this way; there is no self-service password reset or "forgot password" flow.

### Delete a user

The trash icon, with a confirmation. Deleting an account ends its sessions.

---

## Practices worth adopting

**One account per person.** Shared accounts make the login and change history useless.

**Keep the seeded `admin` account for recovery.** Give people named accounts with narrower roles, and store the `admin` password in your privileged-access system.

**Assign the narrowest role that lets someone do their job.** Adding a permission later is easy; discovering after an incident that everyone had **Edit** is not.

**Review assignments on a schedule.** Remove access when responsibilities change, not when someone leaves.

**Set SSH keys only for the users who need them.** A key path on an account that never pushes is an unnecessary credential on the host.

---

## What is not in the product today

Being explicit so you can plan around it:

| Not available | Consequence |
| --- | --- |
| Account lockout or login rate limiting | Protect the Grid at the network layer, and behind a reverse proxy if it is reachable remotely |
| Password complexity or reuse rules | Only a minimum length of 8 characters and "not the current password" are enforced. Set your own standard by policy. |
| Self-service password reset | An administrator resets passwords from the Users tab |
| A self-service profile page | Users cannot set their own SSH key; an administrator does it |
| External identity providers (LDAP, SAML, OIDC) | Accounts are local to the installation |
| Per-project membership | Roles apply across the installation, not per project. The Collaborators tab on a project is reserved but not built. |

---

## Recovering a lost administrator password

Covered in [Reset the Admin User](../../getting-started/first-login.md), including the procedure for re-seeding the bootstrap account when every password is lost.

---

## Next

- [Reset the Admin User](../../getting-started/first-login.md)
- [Security](../security/index.md)
- [Project Settings](project-settings.md)
