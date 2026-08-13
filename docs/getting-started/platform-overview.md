---
title: Platform Overview
---

# Platform Overview

Linkiir is a healthcare integration platform. You design interfaces in a browser, deploy them, and then search every message and event they produced.

This page covers just enough vocabulary to follow the rest of the documentation.

## What you work with

```text
Workspace
  └─ Project
      └─ Workflow
          └─ Node
```

| Term | What it means to you |
| --- | --- |
| **Project** | A container for related interfaces. Holds workflows, scripts, schemas, project variables, credentials, and libraries. |
| **Workflow** | One end-to-end message path, and the unit you start and stop. |
| **Node** | One step in a workflow. A node receives, transforms, or delivers a message. |

A workflow is a chain of nodes:

```text
Source node  →  Transform node  →  Destination node
```

Each node hands its output to the node connected after it. You connect nodes in the workflow editor; Linkiir handles the message transport between them.

## What you install

A Linkiir installation is one package that brings up everything below. You do not install or start these individually.

| Component | What it does for you |
| --- | --- |
| **Studio** | The browser UI and API at `http://127.0.0.1:8080`. Projects, workflows, nodes, scripts, users, settings, and log search. |
| **Runtime** | Runs your nodes and scripts. Starts and stops with your workflows. |
| **Message queue** | Carries messages between nodes so a slow or stopped downstream node does not lose data. Apache Kafka, either bundled with the package or your own cluster. |
| **Log Archiver** | Copies message payloads and node events into the Log DB so you can search them later. Runs quietly in the background. |
| **Log DB** | Where message history lives. SQLite for a local install; PostgreSQL or MS SQL for production. |

The Studio supervises the Runtime and Log Archiver for you. If the Studio is running and healthy, they are too — check `http://127.0.0.1:8080/api/health` to confirm.

## Where things live

| Platform | Your projects and settings | Studio |
| --- | --- | --- |
| Windows | `C:\ProgramData\Linkiir\data` | `http://127.0.0.1:8080` |
| macOS (Docker) | `linkiir_work` Docker volume | `http://127.0.0.1:8080` |
| Linux | The configured Linkiir data directory | `http://127.0.0.1:8080` |

Everything binds to `127.0.0.1` by default, so a fresh installation is reachable only from the machine it runs on. See [Security](../administration/security/index.md) before opening remote access.

## How a message is traced

Every message carries a **message ID** and a **correlation ID** through the whole workflow. The correlation ID is the same at every node, so searching it in the Studio's log search returns the complete journey of one message — received, transformed, delivered.

Keep that in mind when writing scripts: if you create a new message from an inbound one, let Linkiir carry the correlation forward rather than generating unrelated IDs.

## Next

Continue with [Download and Install](quick-install.md).
