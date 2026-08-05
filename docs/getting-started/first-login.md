---
title: Reset the Admin User
---

# Reset the Admin User

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

You land on the dashboard, and the rest of the Studio becomes available.

### Password rules

| Rule | Detail |
| --- | --- |
| Minimum length | 8 characters |
| Must differ | The new password cannot match the current one |

Both rules are enforced by the server, not just the browser, so you cannot bypass them with a direct API call.

There is no complexity requirement, no reuse history beyond "not the current one", and no account lockout. Set your own standard through your organisation's policy, and keep the account out of daily use.

### What is blocked until you finish

Until the change completes, the account can reach only login, logout, its own profile, and the change-password call. Every other API request is refused with `password_change_required`. This is why an install that appears to sign in and then bounce back to the login page is almost always an unfinished password change rather than a broken installation.

:::caution Do this before opening remote access
Linkiir binds to `127.0.0.1` on a fresh install. Complete this password change before you change the bind address, publish the port through a proxy or load balancer, or open a firewall rule. See [Security](../administration/security/index.md).
:::

---

## Create named accounts

Once you are in, stop using the bootstrap account for daily work:

1. Open **Settings → Roles** and create the roles you need. A fresh install ships one role, `admin`, holding every permission.
2. Open **Settings → Users** and click **Add User**. Fill in **Username**, **Name**, **Email address**, **Password**, and assign **Roles**.
3. Keep the `admin` account for administrative recovery only, and store its password in your privileged-access system.

If a user will push or pull a project to a Git remote, also set **SSH private key path** on their account.

See [Users and Roles](../administration/configurations/user-roles.md) for the permission set and how to combine it into roles.

## Session timeouts

Sessions are held in the running Studio process. Two timeouts apply, both configurable in the **Instance** tab of Settings:

| Timeout | Default | Meaning |
| --- | --- | --- |
| Idle | 15 minutes | Signed out after this long without activity |
| Absolute | 24 hours | Signed out this long after signing in, regardless of activity |

Background polling the Studio does on its own does not count as activity, so an unattended tab still times out. Restarting the Studio signs everyone out.

---

## Recovery: reset the admin user when the password is lost

If the administrator password is lost, you can make Linkiir re-seed the bootstrap `admin` account. Every time the Studio starts it checks its working directory for missing files and restores them without overwriting anything: if the `admin` account's file is gone, it recreates `admin` with the password `password` and the forced-change flag set — exactly like a fresh install.

So the recovery is: move the `admin` account aside, restart, and sign in with the bootstrap credentials again.

:::warning Move only what you need to
Moving the whole `users` directory removes every account, not just `admin`. Named users, their roles, and their passwords are gone and have to be recreated. Moving only `users/admin` re-seeds the administrator and leaves other accounts intact.

Your projects, workflows, message history, and settings are **not** affected either way.

Copy whatever you move somewhere safe first — that copy is your only way back if you recover a password later.
:::

### Windows

```powershell
# 1. Stop the Grid
Stop-Service LinkiirGrid

# 2. Move the accounts aside (keep the copy)
Move-Item "C:\ProgramData\Linkiir\data\users" "C:\ProgramData\Linkiir\data\users.backup"

# 3. Start the Grid — it re-seeds the admin account
Start-Service LinkiirGrid
```

### macOS and Linux (Docker)

The user store lives in the `linkiir_work` volume, so work through the container.

```bash
# 1. Move the accounts aside (keep the copy)
docker compose exec linkiir-grid \
  mv /var/lib/linkiir/work/users /var/lib/linkiir/work/users.backup

# 2. Restart so the Grid re-seeds the admin account
./scripts/linkiirctl restart
```

:::note Confirm the path for your release
The working directory inside the container is set by your installation's configuration. Confirm it before running the command:

```bash
docker compose exec linkiir-grid sh -c 'ls "$LINKIIR_WORK_DIR"'
```

If that variable is not set in your build, find the `working_dir` value in the rendered `config.ini`:

```bash
docker compose exec linkiir-grid sh -c 'grep -A2 "\[paths\]" /etc/linkiir/config.ini'
```
:::

### Linux (native install)

Stop the service, move `users` aside inside the configured Linkiir data directory, then start the service again:

```bash
sudo systemctl stop linkiir-grid
sudo mv /var/lib/linkiir/data/users /var/lib/linkiir/data/users.backup
sudo systemctl start linkiir-grid
```

Adjust the path to match your installation's data directory. See [Install on Linux](../administration/installation/linux.md).

### After the recovery reset

1. Open `http://127.0.0.1:8080`.
2. Sign in as `admin` / `password`.
3. Complete the forced password change.
4. Recreate any named accounts you removed.
5. Delete the `users.backup` copy once you are satisfied, since it still contains the old password hashes.

Restarting the Studio ends every session, so anyone still logged in is returned to the login page.

The Studio also writes a warning to its log when it re-seeds the account, which is a useful confirmation that the step worked:

```text
Created default admin account with password 'password' — change it in Settings › Users
```

---

## Next

Continue with [Create a Project, Workflow, and Source HTTP Node](create-project-workflow.md).
