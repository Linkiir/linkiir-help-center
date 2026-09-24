---
title: Upgrades
---

# Upgrades

Linkiir Grid upgrades itself. From **Settings ▸ About** you check for a new version, download it, and install it — Grid stops its services, swaps in the new version, restarts, and checks its own health. This built-in **rolling upgrade** is the recommended way to upgrade a standard install, and it replaces the old download-and-run-the-installer routine for most deployments.

The platform-specific installer procedures are still supported and remain the fallback when the built-in upgrade can't be used or something goes wrong:

- [Windows Upgrade](windows.md)
- [Linux Upgrade](linux.md)
- [macOS Upgrade](macos.md)

Use them for air-gapped servers, for Docker/container installs that upgrade by recreating the container, or to recover when a rolling upgrade won't complete.

:::info
The built-in rolling upgrade was introduced in **version 1.1.0**. If you're on **1.0.0**, the About page has no **Download** or **Install** controls — you must download the release and install it manually with the platform-specific installer for your operating system. Once you're on 1.1.0 or later, future upgrades can use the rolling upgrade.
:::

## Before you begin

- **You need the *Manage updates* permission.** Without it, the About page shows your version and update status but no **Check now**, **Download**, or **Install** controls. Ask an administrator to grant it or to perform the upgrade.
- **Confirm the backup is current and restorable**, and back up the master encryption key. Installing an update restarts the Grid, so take your normal backup first.
- **Record the current version and queue mode**, and review the release notes and any schema changes.
- **Pause production changes and schedule a maintenance window.** Installing an update stops services, restarts the Grid, and interrupts any running workflows. The Grid can be unreachable for up to 15 minutes, and you'll be signed out and sign in again once it's back.
- **Confirm the queue and Log DB are healthy**, and export critical projects for an additional logical backup.

## Check for updates

The **Settings ▸ About** page shows your current version and a status badge:

- **Up to date** — you're on the latest version your channel offers.
- **Update available** — a newer version is available.

To check on demand, click **Check now**. The page updates the badge and the "Last checked" time. If a newer version exists, an **Update available** card appears with the version, release date, download size, a short summary, and a **Release notes** link.

:::note
If the card says "Further update available", the version offered is an intermediate step and another upgrade will be offered afterward. Apply the updates in order.
:::

## Perform a rolling upgrade

For a native Linux (systemd) or Windows install, Grid downloads and installs the update for you — you do **not** need to download any files by hand.

1. Open **Settings ▸ About** and confirm **Update available**. Review the version and release notes.
2. Click **Download**. A progress bar shows the download and verification. When it finishes you'll see **Ready to install**.
3. Click **Install and restart**. A confirmation dialog explains that this will:
   - stop all Grid services,
   - restart the Grid,
   - interrupt any running workflows,
   - leave the Grid unreachable for up to 15 minutes.
4. Confirm. Grid shows an **Installing … and restarting** panel and, once it's back and healthy, the page reloads automatically. Sign in again.
5. Reopen **Settings ▸ About** and confirm the new version shows an **Up to date** badge.

That's the whole flow — download, install, done.

## What happens during an install

Once you confirm **Install and restart**:

- Grid stops its services and swaps in the new version.
- It restarts and checks its own health before finishing.
- If the new version comes up healthy, the upgrade completes and About shows the new version.
- If the new version does **not** come up healthy, Grid automatically restores the previous version — see below.

The About page shows the **Installing … and restarting** panel throughout and reloads on its own when the Grid is reachable again. If it hasn't reloaded after about 15 minutes, reload the page manually to see the current state.

## If an update is rolled back

If the new version fails its health check after installing, Grid **automatically rolls back** to the version you were on. You lose nothing: the previous version keeps running.

After a rollback, the About page shows an **Update rolled back** notice with:

- the version that was attempted,
- the reason it didn't complete,
- the path to the apply log (useful if you contact support).

You can try again later (for example after a newer release) or send the reason and log to support at **support@linkiir.com**. If the rolling upgrade repeatedly won't complete, upgrade with the platform-specific installer for your operating system instead.

## Docker installs

**Docker installs do not upgrade themselves from the About page.** A container is meant to be replaced, not modified in place — an in-place change would be lost the next time the container is recreated. So instead of **Download**/**Install** buttons, the About page shows a **Container-managed install** notice, and you upgrade by manually downloading the new image and recreating the container.

Your configuration and data live outside the container (in your mounted data directory), so they carry over when the container is recreated. Always download the version you intend to run and recreate the container from it. The [macOS Upgrade](macos.md) page covers the container-based flow in more detail.

:::note
If the card says no image is published for a release, that version isn't available as a container image yet — check the release notes or contact support.
:::

## Offline / air-gapped servers

If your server has **no internet access**, Grid can't download the update itself. In that case you manually download, copy and install from the installer.

1. On an internet-connected machine, download the release files for your platform and queue type.
2. Copy the file to the offline server.
3. Install from the local files by running the platform-specific installer for your operating system: [Windows](windows.md), [Linux](linux.md), or [macOS](macos.md).

## Update settings

If you have the *Manage updates* permission, the About page includes an **Update Settings** card where you can:

- turn automatic update checking on or off,
- choose the update channel,
- set how often Grid checks for updates,
- set a proxy URL, if your network requires one to reach the update server.

These settings only control **checking** and **downloading**. Installing an update is always a deliberate action you confirm on the About page.

## After the upgrade

A release that changes the Log DB's browse indexes rebuilds them on first start. On SQLite the **Logs** page says so while it runs — searching is slow and new records are not archived until it finishes — and it runs once. On PostgreSQL and MS SQL the Archiver creates the new indexes as it starts. Allow for it in the maintenance window on a large log database. See [Log Archive Database](../configurations/log-archive-database.md#browse-indexes-are-rebuilt-after-an-upgrade).

## Troubleshooting

**I don't see Check now / Download / Install.**
You need the *Manage updates* permission. Ask an administrator.

**The page keeps reloading during an install.**
The About page reloads on its own once the Grid is reachable again. If it keeps reloading, wait for the restart to finish, then sign in and reopen **Settings ▸ About** to see the result. Your install continues on the server regardless of the browser.

**"Check failed" or "Download failed".**
Grid couldn't reach the update server or verify the download. Check the server's internet access (or proxy setting), then click **Check now** to retry. On an offline server, download and install manually instead — see [Offline / air-gapped servers](#offline--air-gapped-servers).

**The update rolled back.**
The new version didn't pass its health check, so Grid restored the previous version automatically. See [If an update is rolled back](#if-an-update-is-rolled-back). Send the reason and apply-log path shown on the About page to **support@linkiir.com**.

**My install is container-managed.**
Docker installs upgrade by recreating the container, not from the About page. See [Docker installs](#docker-installs).

**The rolling upgrade won't complete.**
Fall back to the platform-specific installer for your operating system: [Windows](windows.md), [Linux](linux.md), or [macOS](macos.md).

Still stuck? Contact **support@linkiir.com**.
