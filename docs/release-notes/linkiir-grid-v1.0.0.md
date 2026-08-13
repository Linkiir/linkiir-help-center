---
title: Linkiir Grid v1.0.0 — Release Notes
sidebar_label: v1.0.0
---

# Linkiir Grid v1.0.0 — Release Notes

**Status:** Released  
**Tag:** `v1.0.0`

---

## New Features

| # | Feature | Description |
|---|---------|-------------|
| #2 | Linkiir Grid Dashboard | Web-based management interface for project and workflow management, node lifecycle control, real-time system status, logging search, queue monitoring, and centralized settings. |
| #3 | Linkiir Runtime | High-performance execution engine for healthcare message processing. Supports source, transform, and destination node types with scripting via Lua. Operates autonomously on the data path for maximum throughput. |
| #4 | Linkiir Log Archiver | Captures all system events, node events, and data payloads into a structured logging database. Supports SQLite (default), PostgreSQL, and MS SQL. Zero-config on fresh install with automatic schema creation. |
| #5 | Linkiir Notification | Monitoring and alerting system that detects workflow errors, upstream inactivity, and platform component failures in real time. Delivers alerts via SMTP email with deduplication and configurable rules. Operates independently so alerting continues even if other services are unavailable. |
| #6 | Linkiir License | Fully offline licensing system. Read your License ID from the Settings screen and receive a License Code from Linkiir sales. Supports Professional and Enterprise tiers. No internet connection or license server required. |
| #7 | Linkiir User and Roles | Role-based access control with user management, permission scoping (project, workflow, settings, scripts), session authentication, and SSO/SAML integration support. Authentication events are archived for audit. |
| #8 | Linkiir Source Control | Built-in Git integration for managing scripts and project assets. Commit, diff, and version history from within the Grid UI. Only committed scripts are deployed to production, ensuring safe development workflows. |
| #9 | Linkiir Migration Tool | Converts existing legacy integration engine channels into Linkiir projects and workflows. Preserves scripts with compatibility modules and imports schemas into Linkiir format. |
| #10 | Linkiir Schema Editor | Visual interface for creating and managing message schemas (HL7 v2, X12, XML, JSON). Supports schema import, message structure visualization, and script editor intellisense. Schemas are version-controlled alongside project scripts. |
| #11 | Linkiir Packaging | Cross-platform installers for Windows and Linux. Bundles all Linkiir platform components into a single distribution. No build tools required on customer machines. |
| #12 | Built-In Message Queue | Apache Kafka is included as the built-in message queue with automatic topic management, consumer coordination, and zero-configuration single-node mode. No ZooKeeper dependency. |

## Bug Fixes

None — initial release.


