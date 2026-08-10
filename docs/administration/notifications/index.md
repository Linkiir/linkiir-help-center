---
title: Alerting and Notifications
---

# Alerting and Notifications

Linkiir has a built-in notification engine that monitors workflow events and sends alerts through two channels: **Email** (SMTP) and **Alert Node** (a Transform Custom node that can forward alerts to Slack, Teams, webhooks, or any custom destination).

---

## How it works

The notification engine runs as a background thread inside the Grid. It consumes event records from all workflows in real time, matches them against your rules, and delivers alerts when conditions are met.

- **Event alerts** — triggered when a node emits an error, warning, info, or debug log entry
- **Inactivity alerts** — triggered when a source node receives no messages for a configured period

The engine starts automatically when at least one rule is enabled. No separate process to manage.

---

## Setting up alerts

### 1. Configure Alert Settings

Go to **Settings → Notifications → Alert Settings** and press **Edit**.

**Email channel:**
- Toggle Email channel ON
- Fill in SMTP connection details (server, port, encryption, authentication)
- Enter recipients (comma-separated) — all rules deliver to these addresses
- Press **Send Test Email** to verify the connection
- Press **Save**

**Alert Node channel:**
- Toggle Alert Node channel ON
- Select a Project, Workflow, and Transform Custom node
- Press **Send Test Alert** to verify the channel
- Press **Save**

**Grid Timezone:** Used for schedule evaluation. Search and select from the dropdown.

**Global kill switch:** Suppresses all alert delivery. Useful during maintenance windows.

:::tip
The engine status badge in the Alert Settings header shows whether the notification engine is running. If it shows stopped or degraded, check the Grid logs.
:::

### 2. Create notification rules

Go to **Notification Rules** → **Add Rule**.

| Field | Description |
| --- | --- |
| Rule Name | Optional. Auto-generated from scope and trigger if left blank. |
| Scope | System (all projects), or narrow to a specific project, workflow, or node. |
| Alert when | **Event** (matches log entries) or **Inactivity** (silence detection). |
| Levels | For Event rules: which log levels to match (ERROR, WARN, INFO, DEBUG). |
| Filter by content | Optional. Only alert when the event body contains this exact text. |
| Minimum interval between alerts | Cool-down period (5–1440 minutes). The first alert sends immediately; repeated events are suppressed until the interval elapses, then a summary is sent. Prevents alert floods from recurring errors. |
| Deliver via | Which channels this rule uses: Email, Alert Node, or Both. |
| Schedule | Always, or a time window (e.g. 08:00–18:00 in the Grid timezone). |
| Enabled | Toggle the rule on or off without deleting it. |

**Advanced options:**
- **Include alert detail** — includes event content in the alert. May contain sensitive information depending on the log detail level.
- **Filter by content** — only events containing this exact text will trigger an alert.

### 3. Verify with a test

The fastest way to confirm end-to-end delivery:

1. Create a Source Custom node with this script:
   ```lua
   local linkiir = require("linkiir")
   function main()
       linkiir.log.error("test alert: synthetic failure")
   end
   ```
2. Commit and start the node
3. Watch for the alert in your inbox or the Alert Node's output

---

## Alert Node scripting

The Alert Node receives a JSON payload in its `main(Data)` function. Parse it to forward alerts:

```lua
function main(Data)
    local alert = linkiir.json.parse(Data)

    -- Forward to Slack
    linkiir.link.web.post{
        url = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
        headers = { ["Content-Type"] = "application/json" },
        body = linkiir.json.encode({
            text = string.format("[%s] %s", alert.rule_name or "Alert", alert.message or "")
        })
    }
end
```

The payload includes: `rule_name`, `trigger`, `source`, `message`, `timestamp`, `event_count`.

:::note
The Alert Node does not need to be running for alerts to work. Kafka retains the messages until the node starts consuming.
:::

---

## Cool-down and suppression

When a rule matches an event, it fires immediately. After that:

- Repeated events from the same source are **suppressed** for the configured interval (no alert flood)
- After the interval, a **summary** is sent with the count of accumulated events
- A **daily reminder** is sent every 24 hours while the condition persists
- Suppression clears only when the notification state file is reset (with the Grid stopped)

This prevents scenarios like a failing database connection generating thousands of identical alerts.

---

## Alerting from scripts (manual)

Any Custom node can also send alerts directly using the scripting API. This is useful for data-level rejections that need custom logic:

```lua
local ok, err = linkiir.link.mail.send{
    server  = "smtp://mail.example.com:587",
    from    = "linkiir-alerts@example.com",
    to      = { "ops@example.com" },
    header  = { Subject = "ADT Inbound: message rejected" },
    body    = "A message arrived without a PID-3 patient identifier.",
    use_ssl = "try",
}
```

:::caution
Script-based alerts only work while the node is running. Use the built-in notification engine for detecting node failures, inactivity, and platform issues.
:::

---

## Monitoring from outside

For infrastructure-level monitoring, point your existing tools at the Grid's health endpoint:

```bash
curl -s http://your-linkiir-host:8080/api/health
```

Returns `healthy`, `degraded`, or `unhealthy` with per-component checks (queue, runtime, archiver).

---

## Practices

- **Keep patient data out of alerts.** Use interface names, error categories, and timestamps — never payload content.
- **Route to a team, not a person.** Use distribution lists or on-call tools.
- **Test your alerts.** Use the Send Test Email / Send Test Alert buttons before going live.
- **Set realistic intervals.** A 5-minute cool-down is appropriate for critical interfaces; 60 minutes for non-urgent ones.

---

## Next

- [Linkiir Scripting API](../../api/scripting-api/index.md)
- [Logging API](../../api/scripting-api/logging.md)
- [Error Handling and Retry](../../interface-development/error-handling.md)
- [Troubleshooting](../troubleshooting/index.md)
