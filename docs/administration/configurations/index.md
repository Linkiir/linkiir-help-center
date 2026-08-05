---
title: Configurations
---

# Configurations

Configuration is divided between platform settings, environment-specific connection profiles, credentials, project definitions, and external infrastructure.

- [Project Settings](project-settings.md) — variables, credentials, templates, libraries, and Git, per project
- [Users and Roles](user-roles.md) — accounts, the permission set, and SSH keys
- [Migrating Existing Interfaces](migration.md)
- [Log Archive Database](log-archive-database.md)
- [Kafka and Redpanda](kafka-redpanda.md)

## Where a setting lives

Linkiir splits configuration between the installation and the individual project. Knowing which is which saves a lot of searching.

| Scope | Where | Examples |
| --- | --- | --- |
| **Installation** | **Settings**, in the Studio | HTTP server port and TLS, Studio port, session timeouts, users, roles, Log Archive DB, environment variables, license |
| **Project** | The project popout | Variables, credentials, node templates, libraries, Git remote |
| **Node** | The node's configuration in the Workflow Builder | Route paths, listen ports, directories, hosts, intervals |

The **Settings** tabs are **About**, **License**, **Database**, **Environment**, **Logging**, **Http Server**, **Roles**, **Users**, and **Instance**.

Keep secrets out of project source. Back up configuration and the master encryption key together.
