---
title: Unreleased — Release Notes
sidebar_label: Unreleased
---

# Unreleased — Release Notes

**Status:** In development

Changes on `main` that have not yet been assigned a release version.

---

## New Features

| # | Feature | Description |
|---|---------|-------------|
| #16 | Catalogs (adapter distribution) | Distribute adapter node templates and shared libraries between grids over a git repository, on any host, or a folder on a mounted share or removable drive for installations with no network route. Subscribe, review an incoming update's diff, and pull it. Nodes built from a catalog adapter stay linked to it and are updated in place, keeping their configuration, wiring, and identity. Catalogs can be created and published from any grid whose repository accepts a push, so one catalog can be maintained from more than one installation. Gated on the new **Manage catalogs** permission. See [Catalogs](../catalogs/index.md). |
| #16 | Bulk adapter and library updates | After a pull, Settings lists every node across the grid whose adapter has a newer release, and every node still on an older version of a library, so a chosen set can be moved forward together. Nodes that cannot be updated are reported and stepped over rather than failing the batch. |
| #16 | Node templates capture the whole node | Creating a template now copies every script the node has and the library versions it pins, not just its entry-point script. Sample messages are excluded by default and included by an explicit toggle, since on a live grid a sample is real traffic. |
| #19 | Schema Editor merged into the Scripting page | Schemas are no longer edited on a separate page. Opening an HL7 v2 or X12 grammar file on the Scripting page shows the Schema Editor's structure view in place of the text editor. |
| — | Format code | A **Format** button and <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd> in the Scripting editor. |
| — | Queue retention setting | **Queue Retention (days)** under Settings → Logging, applied to the broker by Linkiir and reconciled at startup. See [Kafka and Redpanda](../administration/configurations/kafka-redpanda.md). |
| — | Resizable node palette | The Builder's node palette can be resized, and filtered by catalog when several are subscribed. |
| — | Monitor filters | The Monitor page filters workflows by **Project**, **Node type**, and **Queue** from controls beside the search box, alongside the existing status tabs and name search. Filters combine, a line above the table reports how many workflows are showing, and the current view is held in the page's address so a narrowed view can be bookmarked or shared. Filtering by node type also narrows an expanded workflow to just the matching nodes. |
| #17 | Configurable producer batching | `LINKIIR_QUEUE_LINGER_MS` trades latency for batching on throughput-bound installations, without a rebuild. The default stays `0`, which is what latency-bound flows such as LLP want. |
| — | Log retention and purge | **Log Retention Days** and **Purge Time** under Settings → Logging delete archived records past a chosen age on a daily schedule, then compact the archive so the space returns to the disk. **Purge Now** applies the same rule early, after showing exactly what it would delete and reclaim. See [Log Retention and Purge](../administration/configurations/log-retention-purge.md). |
| — | Log search reaches message content | The Logs page search box matches the whole archived message body, not only the summary line, so a term in any segment of a message is found. Project, workflow, and node names still match alongside it. See [Log Search and Message History](../administration/logs/index.md). |
| — | The Logs page keeps itself current | New records are picked up every 10 seconds. A **Live**/**Paused** chip says which state the page is in, and rows are merged silently while you are watching the top of the table or offered behind a *new records* pill when you are not. |
| — | Generate a user's SSH key from the Grid | Settings → Users can create an Ed25519 or RSA 4096 key pair for a user, show the public half to register with the git host, and test it against GitHub, GitLab, Bitbucket, or Azure DevOps. The private key stays on the server, is never displayed, and is excluded from the instance repository. See [Users and Roles](../administration/configurations/user-roles.md#generate-an-ssh-key). |
| — | XML construction API | `linkiir.data` now builds and mutates an XML tree — add elements, read and write attributes, replace an element's content from a fragment, remove or clear children, and collect children by name — so outbound XML is assembled through the API rather than concatenated as text. See [Message Data](../api/scripting-api/message-data.md). |
| — | Download a file from the Scripting page | **Download** on a file in the Explorer's context menu, gated on **Edit node scripts**. |
| — | Confirm password when setting one | Adding a user and changing a password both ask for the password twice, and refuse to save on a mismatch. |

## Improvements

| # | Improvement | Description |
|---|---------|-------------|
| #17 | HTTP connection reuse | Outbound `linkiir.link.web.*` calls reuse a connection per thread instead of opening one per call, so HTTP keep-alive survives. Removes a local ephemeral-port ceiling that surfaced as connection failures under sustained load. |
| #16 | Any git host for catalogs | Catalog repositories are no longer restricted to a particular provider. |
| #16 | Published library versions are immutable across collaborators | Publishing checks the project hub rather than only the publisher's own clone, so two collaborators cannot each publish a different version under the same name. Publishing now propagates to other clones immediately. |
| #16 | Pinned libraries carry across project import | Importing a project brings the library versions its nodes pin, so those nodes arrive able to resolve their dependencies. |
| — | Node and library source is no longer an open read | Reading a node's files, its samples, its schemas, and file diffs now needs one of the three Scripting permissions. Previously the Scripting page's route guard kept that code off screen while the API still served it to any signed-in account. |
| — | The Push button says what a push sends | On the Scripting page, the count is how many pending commits belong to the open node, and the tooltip and footer spell out when the project holds others that the same push would send. |
| — | Search results jump to the match | Selecting a result in the Scripting page's search panel opens that file and moves the cursor to the line, with the matched text selected. |
| — | Commits are always attributed | Every git operation carries the acting user's name and email address, falling back to their username. Merges made by background propagation no longer fail on hosts where the service account has no git identity of its own — which on Windows was every host. |
| — | Queue depth survives a stopped node | Committed queue positions are remembered by Linkiir and restored when a node starts, and Linkiir asks the broker to keep group offsets at least as long as the records. A node stopped for longer than a week no longer reports its whole retained history as queued, or replays it on the next start. See [Kafka Configuration](../administration/configurations/kafka-redpanda.md#consumer-group-offsets-must-outlive-the-records). |
| — | System events are archived everywhere | The topic carrying logins, lifecycle, configuration, queue, and licence events is created at startup, so those records reach the Logs page on brokers configured to refuse topic auto-creation. |
| — | Catalog subscribe form simplified | The **Install as** field is gone — a catalog is installed under its repository's name — and the SSH key path has a browse button. |
| — | Queue rather than Kafka in the interface | The sidebar's status indicator and the Dashboard's system status card label the broker **Queue**. |

## Bug Fixes

| # | Fix | Description |
|---|-----|-------------|
| #21 | Node commits shown under the wrong node | The Scripting page's git history could list commits belonging to a different node. |
| — | Failed node creation left a dead node behind | A node that failed to be created is now cleaned up rather than left in place. |
| — | Scripting page did not load files until refresh | An edge case where a node's files stayed empty until the page was reloaded. |
| — | Default node scripts missing on Linux | The installer did not create the default node scripts. |
| — | File browse path on Linux | Browsing for a file path failed on Linux. |
| — | Library modal display issues | Visual fixes to the library picker. |
| — | Tooltips | Unified tooltip behavior across the site. |
| — | Monitor status tabs matched the wrong thing | **Failed** never matched any workflow, and **On** and **Off** followed each workflow's auto-start setting rather than what it was actually doing. The tabs now match the status shown on the row, and **Failed** covers degraded workflows as well as failed ones. |
| — | **Open in Monitor** did not filter to the project | Opening the Monitor from a project card, a project's workflow panel, or a workflow in the project popup left the page showing every project. It now opens filtered to the project you came from. |
| — | Anyone could edit a message before resubmitting it | Correcting a payload on its way back out now needs **Unredact PHI** for every format, not only HL7. A FHIR or JSON body carries the same identifiers. |
| — | Logs project filter listed only projects with history | The filter now offers every project you collaborate on, so a new interface is selectable before its first message lands and a project does not drop out when retention purges its last record. |
| — | Log filters were slow to load | The query behind the filter dropdowns no longer sorts the whole table, so it returns instead of timing out on a large archive. |
| — | Raw HL7 ran together on one line | Unmasked HL7 now renders one segment per line, the way the masked view already did. |
| — | Resetting the broker desynchronised the archive | Archived records are identified by their timestamp as well as their queue position, so recreating a topic no longer makes new records collide with existing rows and silently stop appearing. SQLite archives migrate themselves at startup. See [Log Archive Database](../administration/configurations/log-archive-database.md#archived-records-are-identified-by-position-and-time). |
| — | Starting a node on its own left it without its queue | Starting a single node created no queue topics for it; starting its workflow or project did. |
| — | Script output missing when starting a workflow or project | Script `print` output and node log lines were only wired up when a node was started individually. |
| — | Empty encrypted node config value reported the wrong error | Reading an encrypted field that holds no value said the key was wrong rather than that the value was empty. |
| — | Samples folder needed a refresh to appear | Adding the first sample to a node now shows the `samples` folder in the Explorer straight away. |
| — | Node picker did not follow a rename | Renaming a node left the Scripting page's node dropdown showing the old name until reload. |
| — | Timezone detection on Windows | A Windows host reports a timezone name the IANA database does not use, which is now recognised for what it is: the Grid falls back to UTC, says so in its log, and asks for the Grid timezone to be set explicitly. A runtime with no timezone database at all is reported as the deployment problem it is rather than as an invalid zone choice. See [Notification Settings](../administration/notifications/settings.md#grid-timezone). |
