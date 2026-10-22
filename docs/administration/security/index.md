---
title: Security
---

# Security

What a fresh Linkiir installation gives you, what it does not, and what to do about each before you put patient data through it. It ends with [audit events](#audit-events): how to see who did what.

## Where a fresh install starts

| Aspect | Out of the box |
| --- | --- |
| Network exposure | Bound to `127.0.0.1`. Reachable only from the machine it runs on. |
| Administrator account | `admin` / `password`, blocked from everything until the password is changed |
| Transport | Plain HTTP. TLS is available but not configured. |
| Stored secrets | Broker and Log DB passwords encrypted with a generated master key |
| User passwords | Hashed individually |
| Sessions | 15-minute idle timeout, 24-hour absolute timeout |

The two things to do first: change the administrator password, and decide how the Grid will be reached.

---

## 1. Complete the administrator password change

A fresh installation seeds `admin` with the password `password` and blocks every other part of the product until it is changed. Do this before anything else. See [Reset the Admin User](../../getting-started/first-login.md).

Then stop using it for daily work. Create named accounts with the narrowest roles that let people do their jobs, and keep `admin` in your privileged-access system for recovery. See [Users and Roles](../configurations/user-roles.md).

Enforced password rules are a minimum length of 8 characters and "not the same as the current password". There is no complexity requirement and no reuse history, so the strength of your credentials is a matter of your own policy.

Repeated failed sign-ins are slowed down rather than locking the account. Within any 15 minutes, Linkiir pauses sign-ins after 5 failures for one username from one address, or 20 failures from one address, and the user sees *Too many sign-in attempts*. Each pause is recorded as a **Login Throttled** [audit event](#audit-events). It is a brake on password guessing, not a substitute for restricting who can reach the login page at the network layer.

To use your organisation's own accounts, MFA, and password policy instead of Linkiir passwords, set up [External Authentication](../external-auth/index.md) with Active Directory, Entra ID, or Okta.

---

## 2. Protect remote access

Linkiir binds to localhost, and nothing you do inside the Grid changes that. Opening remote access is a deliberate act: changing the bind address, publishing a port, or putting a proxy in front.

Before you do:

- Complete the administrator password change.
- Put TLS in front of the Grid. Terminate it at Linkiir where its own TLS settings suffice, or at a reverse proxy or load balancer you control.
- Redirect or block plain HTTP.
- Use organisation-issued certificates.
- Restrict source addresses at the firewall to the networks that need access.

:::caution[Do not publish the Grid directly]
The Grid is a full administrative surface: it edits interfaces, reads message payloads, and manages credentials. Put it behind a reverse proxy providing TLS and whatever access controls your organisation requires, and restrict who can reach that proxy. Treat it like any other administrative console, not like a public web application.
:::

### Ports to keep private

| Surface | Exposure |
| --- | --- |
| Grid (default `8080`) | Restricted, TLS-terminated, authenticated |
| Node listeners (HTTP, LLP) | Only to the systems that send to them |
| Runtime internals | Private to the host |
| Broker and broker management | Private to your infrastructure |

Node listeners are a separate decision from the Grid. An LLP listener has to be reachable by the sending system and by nothing else — restrict it at the network layer, not by hoping nobody finds the port.

Use secure broker protocols such as `SSL` or `SASL_SSL` where your broker requires them. See [Kafka Configuration](../configurations/kafka-redpanda.md).

### Outbound connections from interfaces

Outbound HTTP calls made from a script verify the destination's certificate by default. Leave that verification on.

Where a partner API requires mutual TLS, a script can present a client certificate on the call instead of routing through a separate proxy. Put the PEM certificate and key on the Linkiir server, readable only by the Runtime account, and reference them by path. See [Client certificates (mutual TLS)](../../api/scripting-api/connectivity.md#client-certificates-mutual-tls).

---

## 3. Sessions

| Timeout | Default | Configure in |
| --- | --- | --- |
| Idle | 15 minutes | **Settings → Instance** |
| Absolute | 24 hours | **Settings → Instance** |

Background polling the Grid performs on its own does not count as activity, so an unattended tab still times out.

Sessions live in the running Grid process. Restarting it signs everyone out — worth knowing before a planned restart, and a useful lever if you need to revoke access immediately.

Shorten the idle timeout on installations reachable beyond a trusted network, and on shared workstations.

---

## 4. Secrets

Linkiir generates a master encryption key at install time and uses it to encrypt the broker and Log DB passwords it stores, so they are never written in clear.

| Platform | Key location |
| --- | --- |
| Windows | `C:\ProgramData\Linkiir\config\linkiir.env` |
| Linux | `/etc/linkiir/linkiir.env` |
| Docker | `LINKIIR_SECRET_KEY` in `.env` |

Restrict its filesystem permissions, and include it in your backups — see [Backup and Restore](../backup-restore/index.md). Losing it does not affect projects, users, or message history; it makes the stored broker and database passwords unrecoverable.

### Secrets in projects

Keep connection secrets in a project's **Variables** tab with the **Secret** flag set, and reference them by name from node configuration and scripts. Never paste a password into a Lua file: the file is committed to the project's history and travels in an export.

Secret values leave an export encrypted, and only the installation that exported them can read them back. Their names survive, so whoever imports the project elsewhere can see exactly what needs re-entering. See [Project Settings](../configurations/project-settings.md) and [Import and Export](../deployment/import-export.md).

### Per-user SSH keys

Git access is authenticated per user: every push, pull, and remote import uses the key belonging to whoever triggered it, and there is no shared project or administrative key to fall back on.

Linkiir can generate that key for a user — **Settings → Users → Edit → the key button beside SSH private key path**. What that means for your security posture:

| Aspect | Behaviour |
| --- | --- |
| Where the private key lives | In the user's own folder inside the Linkiir working directory, on the server only |
| File permissions | Restricted to the account Linkiir runs as (`0600` on Linux and macOS, an equivalent ACL on Windows). The Grid reports it if that could not be applied. |
| Passphrase | None. Nothing can type one during an unattended push; file permissions are the compensating control. |
| Exposure | The private key is never returned by the API, shown in the interface, or downloadable. Only its path is recorded on the user's profile. |
| Version history | Excluded from the instance repository, so it is never committed and never pushed to the configured backup remote |
| Who can create one | The user themselves, or a holder of **Manage users** for somebody else |

Two consequences to plan for:

- **Grid's own instance backup does not carry keys**, by design — it pushes the instance repository, which excludes them. An instance restored from that remote comes back with profiles pointing at keys that no longer exist, so regenerate each one and register the new public half. A filesystem copy of the working directory *does* include the keys, which is the reason to encrypt and restrict those copies.
- **Rotation is per user and per host.** Replacing a key stops the old public key working everywhere it is registered.

Commits carry the acting user's name and email address from their account, so the instance and project history says who made each change. Keep those fields accurate.

### Service accounts

Give Linkiir its own named accounts for the broker and the database, with the narrowest rights that work. Shared administrative credentials make an audit trail useless and widen the impact of a leak.

---

## 5. Patient data and logs

Linkiir archives message payloads deliberately, in the Log DB, so you can trace and replay messages. That is the controlled place for them. The risk is payload content leaking into places that are not controlled.

**Keep out of error text, alerts, and general service logs:** patient name, MRN, date of birth, health card number, address, phone number, and raw HL7, FHIR, CDA, or X12 payloads.

**Safe to record:** project, workflow, and node names; message and correlation IDs; error category and code; retry counts; queue positions; timestamps.

```lua
-- Right: names the field
error("PID-3 patient identifier is missing")

-- Wrong: puts an identifier in a log
error("bad MRN: " .. mrn)
```

Test samples are stored with the project and visible to anyone who can open the node. Use clearly synthetic identifiers — `TEST000001`, `TEST^PATIENT`, `19700101`. See [Error Handling and Retry](../../interface-development/error-handling.md).

The same boundary applies when you raise a support ticket: payloads belong in your Log DB, not in a support request. Linkiir Support does not accept PHI and will never ask you for it — see [PHI in Support Requests](../../support/phi-policy.md).

Set the retention your organisation's policy requires: **Log Retention Days** under **Settings → Logging** purges records past that age daily, payloads included. A fresh installation keeps everything until you set it. See [Log Retention and Purge](../configurations/log-retention-purge.md).

Restrict who can view payloads and perform replays. Note that the permission model is coarse: **View log messages** covers reading message history including payloads, and there is no separate permission for payload access — what *is* separate is **Unredact PHI**, which is what turns a masked payload (HL7 v2, FHIR, or other JSON and XML) into readable patient data and what a message must be revealed under before it can be edited for a resubmission. The masking is applied on the server, to payloads, the log list, exports and queue previews alike, and **Settings → Instance → PHI Masking** decides which fields and paths it covers. Where a stricter split than that matters, separate environments rather than relying on roles within one. See [Log Search and Message History](../logs/index.md) and [PHI Masking](../configurations/phi-masking.md).

Search reaches message content, not only the summary line. For an account without **Unredact PHI**, a message only matches on what that account is shown masked, so searching for a patient's name doesn't reveal which messages are about them; each such search is recorded as a system event. Unmasked content is still searchable by anyone holding **View log messages**, which is the same data those accounts can already open a record to read.

---

## 6. Message payload encryption

:::info[Not available]
Linkiir does not encrypt message payloads at the application level before they enter the queue. Payloads sit in the broker in the form the interface produced.

Rely on broker TLS, storage-level encryption, access control, and network isolation. Do not assume payloads in the queue are encrypted by Linkiir.
:::

---

## Audit events

Linkiir records what people do in it as **audit events**: who signed in, who started or stopped an interface, who changed access, and who searched, opened, exported, or resubmitted patient data. An auditor can follow one person's trail through the instance without wading through the platform's own health messages.

Audit events are archived in the Log DB alongside message history, and read on the **Logs** page.

### Review one user's activity

The quickest way is from the user list:

1. Open **Settings → Users**.
2. Click the **Activity** button (the pulse icon) on the user's row.

Linkiir opens the **Logs** page showing that user's audit trail for the **last 30 days**. To look further back, edit the time filter in the search box: remove `range:30d` to search all time, or replace it with `after:` and `before:` dates, or pick **Custom range…** from the suggestions.

You can also do it from the Logs page directly:

1. Open **Logs**.
2. In the search box, type `user:` and the username, for example `user:alice`, or `user:"alice smith"` for a name with spaces. The match is exact and ignores case, and it still finds people who have since been deleted.
3. Optionally narrow further in the same box, for example with `project:` or a time filter such as `range:7d` or `after:2026-10-01`. See [Searching and filtering](../logs/index.md#searching-and-filtering).

Select an event to see its details. Download selected events with **Download** for an auditor or a ticket.

### What each event records

| Field | Holds |
| --- | --- |
| Timestamp | When it happened |
| Level | `INFO` for routine actions, `WARN` for ones worth a second look, such as a break-glass sign-in or an external-user cleanup |
| Event type | What happened, for example `USER_LOGIN` or `WORKFLOW_STOP` |
| User | Who did it |
| Message | A one-line description |
| Project, workflow, node | What it was done to, where that applies |
| Source IP | The address the request came from |

User and source IP are shown in the event's details, not as table columns.

No event ever contains a password, token, secret, or SSO assertion. Events also keep patient data out: a log search records the search term under a field that is masked for anyone without **Unredact PHI**, and opening an unmasked payload records *that* it was opened, never the payload itself.

### What is tracked

**Sign-in and sessions**

| Event | Recorded when |
| --- | --- |
| `USER_LOGIN` / `USER_LOGOUT` | A user signs in or out |
| `EXTERNAL_AUTH_SUCCEEDED` / `EXTERNAL_AUTH_FAILED` | An LDAP, SAML, or OpenID Connect sign-in succeeds or fails, with the reason for a failure |
| `BREAK_GLASS_LOGIN` | A local account, such as `admin`, signs in while external authentication is active |
| `LOGIN_THROTTLED` | Sign-ins are paused after too many failures |
| `SESSION_REVOKED` | A user's sessions are ended: disabled or deleted by an administrator, removed by an external-user cleanup, or left with no matching IdP group |

**Users and access**

| Event | Recorded when |
| --- | --- |
| `USER_DISABLED` / `USER_ENABLED` | An administrator disables or re-enables an account |
| `EXTERNAL_USER_PROVISIONED` | Someone's first external sign-in creates their Linkiir account |
| `EXTERNAL_ROLE_CHANGED` | An external user's roles change because their IdP groups changed, with the roles before and after |
| `EXTERNAL_USER_CLEANUP` | An administrator removes external users with **Clean up** |
| `EXTERNAL_AUTH_SETTINGS_CHANGED` | External authentication settings are saved |
| `PROJECT_COLLABORATORS` | Collaborators are added to or removed from a project |

**Projects, workflows, and nodes**

| Event | Recorded when |
| --- | --- |
| `PROJECT_CREATE` / `PROJECT_DELETE` | A project is created, imported, or deleted |
| `PROJECT_START` / `PROJECT_STOP` | A project is started or stopped |
| `WORKFLOW_CREATE` / `WORKFLOW_DELETE` | A workflow is created or deleted |
| `WORKFLOW_START` / `WORKFLOW_STOP` / `WORKFLOW_RESTART` | A workflow is started, stopped, or restarted |
| `NODE_CREATE` / `NODE_DELETE` | A node is added or removed |
| `NODE_START` / `NODE_STOP` / `NODE_RESTART` | A node is started, stopped, or restarted |
| `NODE_CONFIG_UPDATE` | A node's configuration is changed |
| `SCRIPT_COMMIT` | Script changes are committed |

**Queues and patient data**

| Event | Recorded when |
| --- | --- |
| `QUEUE_CLEAR` | Messages waiting on a node's queue are discarded |
| `QUEUE_REPOSITION` | A node's queue position is moved, skipping or replaying messages |
| `LOG_SEARCH` | Message content is searched by someone without **Unredact PHI** |
| `LOG_PHI_UNMASKED_VIEW` | Someone with **Unredact PHI** opens a payload unmasked. Recorded once per session per project. |
| `LOG_EXPORT` | Log records are downloaded |
| `MESSAGE_RESUBMIT` | Archived messages are resubmitted |

The **Event Type** filter lists the most common of these by name. Every one of them appears when **Event Type** is left at **All Event Types**.

Events the platform raises on its own — runtime and archiver health, high availability, updates, and licence changes — are kept apart under **Type → System Events (platform)**.

### Who can see audit events

Reading them needs **View log messages**, the same permission as message history. There is no separate audit permission. Like the rest of the Logs page, a user sees events for the projects they collaborate on, plus instance-wide events such as sign-ins. Give auditors their own role holding **View log messages** and, if they need to hand records over, **Export log messages**. See [Users and Roles](../configurations/user-roles.md).

### How long audit events are kept

Audit events are purged by the same **Log Retention Days** setting as all other archived records, under **Settings → Logging → Log Retention Purge**. A fresh installation keeps everything (`0`, unlimited) until you set it.

Set **Log Retention Days** to at least the period your audit policy requires. A value shorter than that, chosen to keep message payloads small, deletes the audit trail with them. See [Log Retention and Purge](../configurations/log-retention-purge.md).

:::note
The **Activity** button shows the last 30 days to keep the view quick. That is a view, not the retention period: older events are still there, up to your **Log Retention Days**, and you reach them by widening the time filter in the search box.
:::

---

## Pre-production checklist

| Item | Done when |
| --- | --- |
| Administrator password changed | The forced change completed and `admin` is out of daily use |
| Named accounts with narrow roles | Each person has their own account |
| Grid not directly published | TLS terminated, source addresses restricted |
| Node listeners restricted | Only sending systems can reach them |
| Broker uses a secure protocol | Where your broker requires it |
| Master key backed up, permissions restricted | Included in your backup, readable only by the service account |
| Secrets in the Variables tab with **Secret** ticked, not in scripts | No secrets in any `.lua` file |
| Samples are synthetic | No real identifiers in any sample |
| Session timeouts suit your exposure | Reviewed rather than left at defaults |
| Log DB retention and access reviewed | **Log Retention Days** set from policy rather than left unlimited, access restricted |
| Audit trail reviewed | **Log Retention Days** covers your audit period, and an auditor role holding **View log messages** exists |
| External authentication tested, if used | A test user signs in and gets the expected roles, and `admin` still signs in with the local form — see [External Authentication](../external-auth/index.md) |
| SSH keys accounted for | Each key belongs to a named user who needs it, and you know they are not in the instance backup |
| External monitoring in place | Health, lag, and disk alerts exist — see [Alerting and Notifications](../notifications/index.md) |

---

## Next

- [Users and Roles](../configurations/user-roles.md)
- [External Authentication](../external-auth/index.md)
- [Log Search and Message History](../logs/index.md)
- [Backup and Restore](../backup-restore/index.md)
- [Error Handling and Retry](../../interface-development/error-handling.md)
