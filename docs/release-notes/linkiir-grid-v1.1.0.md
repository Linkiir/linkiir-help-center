---
title: Linkiir Grid v1.1.0 — Release Notes
sidebar_label: v1.1.0
---

# Linkiir Grid v1.1.0 — Release Notes

**Status:** Released  
**Tag:** `v1.1.0`

---

This release adds high-availability deployment, an adapter catalog, and rolling
upgrades, along with a broad set of improvements to the scripting page, log
search, and message queue, plus fixes across git source control and both
Windows and Linux.

## New Features

| # | Feature | Description |
|---|---------|-------------|
| #13 | Linkiir High Availability | Active-passive failover for production deployments. A primary Grid runs all services while a warm standby monitors its health and takes over automatically if the primary fails, resuming message processing without data loss. Uses a 3-node Kafka cluster and a shared PostgreSQL or MS SQL logging database. Available on the Enterprise tier. |
| #16 | Adapter Catalog | Browse, subscribe to, and update adapters from published Linkiir catalogs. Adapters are pulled into a running grid independently of product upgrades, so you can adopt new adapters without reinstalling Grid. |
| #18 | Rolling Upgrades | Upgrade Grid in place instead of downloading and running the installer each time. |
| #33 | Format code on the scripting page | Format the current file to its language conventions from a button or the `Shift+Alt+F` shortcut. |

## Enhancements

| # | Enhancement | Description |
|---|-------------|-------------|
| #17 | Message processing performance | Faster LLP source and destination processing, with configurable producer batching to tune throughput for your environment. |
| #19 | Schema editor in the scripting page | The schema editor is now built into the scripting page instead of a separate window, so schemas and scripts are edited in one place. |
| #22 | Kafka configuration in Settings | Manage Kafka connection and queue behavior, including queue retention length, directly from the Settings page. |
| #20, #55 | Monitor page search | Scope searches to specific areas and filter results, making the monitor page easier to use on large deployments. |
| #34 | Download files from the scripting page | Download individual files from the scripting page, available to users with script read permission. |
| #35 | Go to definition and peek definition | Jump to or preview a definition from the right-click menu on the scripting page. |
| #39 | Auto-refresh on the log page | The log page can refresh on a timer so new events appear without a manual reload. |
| #40 | Search message contents | Search within message contents from the log page search, not just event metadata. |
| #41 | More log purge configuration | Adjust the purge schedule, run a manual purge, and reclaim disk space for the logging database. |
| #47 | Queue retention length setting | Configure how long records are retained in the message queue. |
| #52 | Clearer push button on the scripting page | The push button now states exactly what it will push. |
| #56 | Consistent tooltips | Tooltip styling is unified across the Grid. |
| #59 | Confirm password field | Re-enter the password when creating a user or changing a password to avoid typos. |
| #60 | SSH key generation | Generate SSH keys for users directly from the Grid. |

## Bug Fixes

| # | Fix |
|---|-----|
| #21, #53 | Git graph now scopes commits to the correct node, so a node no longer shows commits made on other nodes. |
| #36 | The node dropdown on the scripting page now updates when a node is renamed. |
| #37 | Selecting a search result on the scripting page now jumps to that result in its file. |
| #38 | New and additional samples now appear in the file tree without a page refresh. |
| #42 | Resolved slow responses from the log page that could delay the page from loading. |
| #43 | HL7 message previews on the log page now respect line breaks instead of showing on a single line. |
| #44 | The project filter now lists all projects, not only those that already have events. |
| #45 | Message resubmit is now restricted by permission scope. |
| #46 | Resetting the queue no longer causes a desync that prevented the log archiver from displaying data. |
| #48 | System events are now archived. |
| #49 | A node's queue topic is now created whether it is started from the node, workflow, or project level. |
| #50 | Stopped nodes no longer report a full queue. |
| #51 | Decrypting an empty node configuration value now gives a clear message instead of a misleading error. |
| #54 | Merge commits no longer fail for accounts without a configured identity. |
| #57 | The login button text remains readable on hover. |
| #58 | Message data now displays correctly when hovering a message in the view queue window. |
| #61 | Time zones now resolve correctly on Windows when creating notification rules. |
| #62 | Default node scripts are now created on Linux. |
| #63 | File path browsing now works on Linux. |
