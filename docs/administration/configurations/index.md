---
title: Configurations
---

# Configurations

Configuration is divided between platform settings, environment-specific connection profiles, credentials, project definitions, and external infrastructure.

- [Project Settings](project-settings.md) — variables, credentials, templates, libraries, and Git, per project
- [Users and Roles](user-roles.md) — accounts, the permission set, and SSH keys
- [Migrating Existing Interfaces](migration.md)
- [HTTP Server Settings](http-server.md) — the embedded server every Source HTTP node shares
- [Log Archive Database](log-archive-database.md)
- [Kafka Configuration](kafka-redpanda.md)

## Where a setting lives

Linkiir splits configuration between the installation and the individual project. Knowing which is which saves a lot of searching.

| Scope | Where | Examples |
| --- | --- | --- |
| **Installation** | **Settings**, in the Grid | HTTP server port and TLS, Grid port, session timeouts, users, roles, Log Archive DB, environment variables, license |
| **Project** | The project popout | Variables, credentials, node templates, libraries, Git remote |
| **Node** | The node's configuration in the Workflow Builder | Route paths, listen ports, directories, hosts, intervals |

The **Settings** tabs are **About**, **License**, **Database**, **Environment**, **Logging**, **Http Server**, **Notifications**, **Roles**, **Users**, and **Instance**. Each is described below.

Keep secrets out of project source. Back up configuration and the master encryption key together.

---

## Settings tab reference

Brief descriptions of each Settings tab in the Grid.

### About

Displays the Linkiir version, build information, and system details. Read-only — no configuration here.

### License

Manage your Linkiir license: view current state, apply a license code, and handle transfers. See [Licensing](../licensing/index.md) for full details.

### Database

Configure the Log Archive database connection (SQLite, PostgreSQL, or MS SQL). The Log Archiver writes message history here. See [Log Archive Database](log-archive-database.md).

### Environment

Key-value pairs available to all nodes as environment variables. Use for installation-specific values that differ between environments (e.g. hostnames, paths, feature flags).

| Field | Description |
| --- | --- |
| Key | Variable name (uppercase by convention, e.g. `DEST_HOST`). |
| Value | The value available at runtime via `os.getenv("KEY")` in Lua scripts. |

Add, edit, or remove entries. Changes take effect on the next node start — running nodes do not pick up changes until restarted.

:::tip
Use environment variables for values that change between TEST and PROD, so the same project code runs in both without modification.
:::

### Logging

Controls the Log Archiver fleet: how many archiver instances run, batch sizes, and flush intervals. Also shows the Kafka bootstrap address (read-only, from `config.ini`).

| Field | Description |
| --- | --- |
| Archiver Instances | Number of parallel archiver processes (default 1). |
| Batch Size | Records batched per SQLite write (default 500). |
| Batch Interval (ms) | Maximum wait before flushing a partial batch (default 1000). |
| Kafka Bootstrap | The broker address the archivers connect to (read-only). |

For archiver troubleshooting, see [Log Archiver Connectivity](../troubleshooting/log-archiver-connectivity.md).

### Http Server

Controls the embedded HTTP(S) server that every **Source HTTP** node on the installation shares — not the Grid's own web server, which lives under **Instance**.

| Field | Description |
| --- | --- |
| Use Server | Whether the embedded server runs at all. Off stops every HTTP source node. |
| Port | Port every route answers on (default `8081`). |
| Secure | Toggle HTTPS for every route. Certificate and private key are both required when on. |
| Certificate, Private Key | Absolute paths on the server to the TLS certificate and key (PEM format). |
| Verify Peer | Require and verify a client certificate (mutual TLS). |
| Certificate Authority File | The CA signing accepted client certificates. Shown with **Verify Peer** on; blank uses the system CA store. |
| Serve Files, Serve Files Directory | Serve static files from a directory alongside the node routes. |

:::caution
Changing the port or any TLS field restarts the Runtime, so the button reads **Save & Restart**. Every running node stops and comes back with it. See [HTTP Server Settings](http-server.md).
:::

### Notifications

Configure alert delivery channels (Email, Alert Node), notification rules, and the notification engine. See [Notification Settings](../notifications/settings.md) for a full walkthrough.

### Roles

Define roles with specific permission sets. Assign roles to users to control what they can do. See [Users and Roles](user-roles.md).

### Users

Create and manage user accounts, assign roles, and manage SSH keys for Git. See [Users and Roles](user-roles.md).

### Instance

Displays the instance identifier and the working directory path. Used for support and diagnostics.

| Field | Description |
| --- | --- |
| Instance ID | A unique identifier for this Linkiir installation. |
| Working Directory | Filesystem path where settings, state, and project data are stored. |
| Backup Settings | Configure automated instance backup (remote Git). |

See [Backup and Restore](../backup-restore/index.md) for backup configuration details.
