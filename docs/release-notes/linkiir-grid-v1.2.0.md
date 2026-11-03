---
title: Linkiir Grid v1.2.0 — Release Notes
sidebar_label: v1.2.0
---

# Linkiir Grid v1.2.0 — Release Notes

**Status:** Released  
**Tag:** `v1.2.0`

---

This release strengthens security and compliance with log encryption, SSO and
LDAP sign-in, and SOC 2 readiness. It adds database source and destination
nodes, graphical message mapping, and project variables, along with a wide set
of improvements to the schema editor, scripting page, log search, and monitor
page, plus fixes across mapping, the log page, and both Windows and Linux.

## New Features

| # | Feature | Description |
|---|---------|-------------|
| #14 | Linkiir Log Encryption | Protect message payloads with application-layer encryption. Business payloads (HL7, FHIR, CDA, X12) are encrypted before they enter the message queue and decrypted only for authorized consumers, so sensitive data is never stored in the clear. Uses strong AES-256 encryption with per-message keys. |
| #27 | SOC 2 readiness | Security hardening in support of SOC 2, including node script sandboxing, controls over system command execution from scripts, and resolution of issues raised by security and dependency scans. |
| #75 | SSO and LDAP authentication | Sign in to the Grid using your organization's single sign-on (SSO) or LDAP directory, so access is managed through your existing identity provider. |
| #68 | Graphical message mapping | Map a message from one format to another visually, drawing connections between source and target fields instead of writing mapping code by hand. |
| #94 | Database source and destination nodes | New node types that read from and write to databases, so a workflow can pull records from a database as a source or deliver results into a database as a destination. |
| #98 | Project variables in node configuration and scripts | Define variables once at the project level and reuse them across node configuration and scripts, making it easier to manage shared values and move projects between environments. |
| #30 | Resubmit messages to a different workflow | Resubmit a message into a different workflow than the one it originally ran in, not just back into its own. |
| #29 | Regex matching in the schema editor | Use regular expressions and combined conditions in schema editor rules, so a single rule can express more complex matching logic. |
| #95 | Preview a log message without selecting it | See a quick preview of a log message directly from the log list, without opening it first. |
| #104 | List view on the project page | Switch the project page between the card layout and a compact list view. |
| #77 | Browse available Linkiir catalogs | A button on the catalogs settings page lists all Linkiir-published catalogs so you can add them directly. |
| #78 | Catalog version control for Grid | Catalogs can specify which Grid versions a node or library supports, so you only import content compatible with your Grid. |

## Enhancements

| # | Enhancement | Description |
|---|-------------|-------------|
| #69 | FHIR and CDA in the schema editor | The schema editor now supports FHIR and CDA, so these formats can be modeled and mapped alongside HL7, X12, XML, and JSON. |
| #91 | Visual JSON and XML mapping | The schema editor shows JSON and XML structures visually, making them easier to read and map. |
| #85 | Database schemas in the schema editor | Design database table schemas in the schema editor, create tables in the database, and use them with Linkiir's database functions. |
| #105 | Improved HL7 tree handling | HL7 parsing and tree editing are more natural to work with and use memory more efficiently. |
| #90 | Easier log search | Improved log search filtering makes it easier to find specific messages, such as all messages related to a particular user. |
| #97 | Reworked monitor page | A redesigned monitor page with improved search and an updated view-queue window. |
| #72 | Adjustable dashboard timeframe | Narrow the timeframe on the dashboard message graph to focus on a specific period. |
| #89 | Reorder node parameters | Drag and drop to reorder the parameters on a node directly in the UI. |
| #99 | Consistent node configuration dialogs | File, FTP, and LLP nodes now use the updated node configuration dialog for a consistent experience across node types. |
| #67 | Settings page cleanup | The settings page has been tidied up to reduce clutter and make options easier to find. |
| #73 | Guidance when no projects exist | When the Grid has no projects yet, the page now prompts you to create one instead of appearing blank. |
| #83 | Keyboard shortcuts for run and debug | Run and debug a script from a keyboard shortcut instead of clicking the buttons on the scripting page. |
| #86 | Longer run-test timeout | The scripting page run-test timeout has been increased so longer tests have time to complete. |
| #101 | Refreshed theme | Grid colors have been updated to match the Linkiir site theme. |
| #26 | Configurable hide-PHI control | The hide-PHI button can now be configured to suit your environment. |
| #66 | ODBC for the log archiver | The log archiver uses ODBC for database connections, with the required driver installed as part of setup on Linux and a hint in the UI when a driver is missing. |
| #93 | PostgreSQL SSL default | Reviewed and confirmed the PostgreSQL driver's default SSL behavior. |
| #64 | Consistent Python version | The bundled Python version is aligned across Windows and Linux. |
| #74 | Third-party library review | Third-party libraries have been documented and reviewed for updates. |

## Bug Fixes

| # | Fix |
|---|-----|
| #70 | The "Next Purge" information now updates immediately when purge rules change, without a page refresh. |
| #71 | Message previews, particularly FHIR, now display cleanly across different screen sizes instead of appearing cluttered. |
| #87 | Log page filters are now kept in the page link, so refreshing keeps your selected filters instead of resetting them. |
| #92 | The scripting page file explorer now lists all files, showing a note for files that cannot be opened in the editor. |
| #84 | Scripts can now reliably write Lua tables to database tables, with correct insert-or-update behavior across supported databases. |
| #106 | Source nodes now make their first poll immediately on start instead of waiting for the full poll interval. |
| #102 | Fixes for issues found during automated UI testing. |
