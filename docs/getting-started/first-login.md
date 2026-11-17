---
title: Create Grid User Accounts
---

# Create Grid User Accounts

A fresh installation seeds one administrator account and blocks the rest of the product until you replace its password. This page covers that first reset, and the recovery reset you need if the password is later lost.

## Bootstrap credentials

| Field | Initial value |
| --- | --- |
| Username | `admin` |
| Password | `password` |

These credentials work only until the forced password change completes.

---

## Reset the password on first login

1. Open `http://127.0.0.1:8080` from the machine where Linkiir is installed.
2. Sign in as `admin` with the password `password`, using **Login to dashboard**.
3. The same card switches to **Choose a new password**. Enter **New password** and **Confirm new password**.
4. Click **Set new password**.

You land on the dashboard, and the rest of the Grid becomes available.

### Password rules

| Rule | Detail |
| --- | --- |
| Minimum length | 8 characters |
| Must differ | The new password cannot match the current one |

Both rules are enforced by the server, not just the browser, so you cannot bypass them with a direct API call.

There is no complexity requirement, no reuse history beyond "not the current one", and no account lockout. Set your own standard through your organisation's policy, and keep the account out of daily use.

### What is blocked until you finish

Until the change completes, the account can reach only login, logout, its own profile, and the change-password call. Every other request is refused, and says that the password change is still outstanding. This is why an install that appears to sign in and then bounce back to the login page is almost always an unfinished password change rather than a broken installation.

:::caution[Do this before opening remote access]
Linkiir binds to `127.0.0.1` on a fresh install. Complete this password change before you change the bind address, publish the port through a proxy or load balancer, or open a firewall rule. See [Security](../administration/security/index.md).
:::

---

## Recover a lost admin password

If the `admin` password is lost and no other administrator can reset it from **Settings → Users**, reset it from the command line on the server:

| Installation | Command |
| --- | --- |
| Linux or macOS, native | `linkiirctl reset_admin_password` |
| Windows | `<install folder>\bin\linkiirctl.exe reset_admin_password` |
| Docker | `docker compose -p linkiir exec linkiir-grid linkiirctl reset_admin_password`, from the bundle folder |

The command sets a random temporary password on `admin` and prints it once, in the terminal:

```text
Password for 'admin' reset. Temporary password:

    k7Qm-Xp4t-Hw9b-R2nc

You will be asked to choose a new password at your next sign-in.
```

Sign in as `admin` with that password. The card switches to **Choose a new password**, exactly as on first login, and the rest of the Grid stays blocked until you set one.

Points worth knowing:

- **Only `admin`.** Other accounts are reset by an administrator in **Settings → Users**. The command takes no options.
- **Run it as the account the Grid runs as.** It writes the `admin` account's file in the working directory, so it needs the same access to that directory as the Grid. It works whether the Grid is running or stopped.
- **Nothing else changes.** Roles, status and the rest of the account are left as they were. If `admin` is disabled, the command says so: it cannot sign in until another administrator enables it.
- **Sessions already open as `admin`** are held at the password change too, and that change asks for the current password, which is now the temporary one.
- **An `admin` managed by your directory** ([External Authentication](../administration/external-auth/index.md)) is refused: reset its password in the directory.
- The reset is recorded in the instance's history. The temporary password is not written anywhere but the terminal.

---

## Create named accounts

Once you are in, stop using the bootstrap account for daily work:

1. Open **Settings → Roles** and create the roles you need. A fresh install ships one role, `admin`, holding every permission.
2. Open **Settings → Users** and click **Add User**. Fill in **Username**, **Name**, **Email address**, **Password**, and assign **Roles**.
3. Keep the `admin` account for administrative recovery only, and store its password in your privileged-access system.

If a user will push or pull a project to a Git remote, also set **SSH private key path** on their account.

See [Users and Roles](../administration/configurations/user-roles.md) for the permission set and how to combine it into roles.

## Session timeouts

Sessions are held in the running Grid process. Two timeouts apply, both configurable in the **Instance** tab of Settings:

| Timeout | Default | Meaning |
| --- | --- | --- |
| Idle | 15 minutes | Signed out after this long without activity |
| Absolute | 12 hours | Signed out this long after signing in, regardless of activity |

Background polling the Grid does on its own does not count as activity, so an unattended tab still times out. Restarting the Grid signs everyone out.

## Next

Continue with the [Demo Projects](demo-project.md).
