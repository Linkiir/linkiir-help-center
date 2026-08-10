---
title: Notification Settings
---

# Notification Settings

The Notification Settings page is where you configure how Linkiir delivers alerts. It lives at **Settings → Notifications** and contains two main sections: **Alert Settings** (the configuration card) and **Notification Rules** (the rules list below it).

---

## Alert Settings card

The card is **read-only by default**. Press **Edit** to make changes, then **Save** to persist them. Press **Cancel** to discard unsaved changes.

The engine status badge in the card header shows the notification engine's health:
- **Engine running** (green) — alerts are being evaluated every 10 seconds
- **Engine degraded** (amber) — the engine cannot reach the message broker; alerts may be delayed
- **Engine stopped** (red) — no alerts will be sent; restart the Grid to recover

---

## Grid Timezone

A searchable dropdown of IANA timezone names (e.g. `America/New_York`, `Europe/London`). Used for evaluating rule schedules — a rule set to 08:00–18:00 uses this timezone.

Pre-filled from the server's detected timezone on first save. Type to filter the list.

---

## Global kill switch

A single toggle that **suppresses all alert delivery** across every rule and every channel. Use it during planned maintenance windows to silence alerts without disabling individual rules.

When the kill switch is on, the engine still evaluates events and updates firing state — it just doesn't deliver. Turning it off resumes delivery immediately.

---

## Email channel

Toggle this ON to enable SMTP email delivery.

When enabled, click the collapsible header (shows a summary like `SMTP: 127.0.0.1:1025, None`) to expand the configuration fields:

| Field | Description |
| --- | --- |
| SMTP Server | Hostname or IP of your mail relay. |
| Port | SMTP port (587 for STARTTLS, 465 for SSL, 25 for plain). |
| Encryption | `None`, `STARTTLS`, or `SSL`. |
| Verify TLS certificates | Reject connections with invalid certificates. Disable for self-signed internal relays. |
| Authentication | `None`, `Plain`, or `Login`. When not None, Username and Password fields appear. |
| Username | SMTP login username. |
| Password | Stored encrypted on disk — never displayed. Shows "Configured" or "Not configured". |
| Sender Email | The "From" address on outgoing alert emails. |
| Sender Name | Display name shown alongside the sender address. |
| Recipients | Comma-separated email addresses. **All alert rules deliver to these addresses.** |

### Send Test Email

The **Send Test Email** button (visible in edit mode, next to the Recipients field) sends a test message to the listed recipients using the **saved** SMTP settings.

- You must **Save** before testing — the test reads from disk, not the draft
- On success, a green confirmation appears
- On failure, a red error message appears with a **Show SMTP Log** toggle that reveals step-by-step connection diagnostics:

```
✓ Config loaded — server=127.0.0.1, port=1025, encryption=None, auth=none
→ Connecting to 127.0.0.1:1025 (no encryption)…
✓ Connected (no encryption)
— No authentication required
→ Sending to 1 recipient(s): ops@example.com…
✓ Message accepted by server
✓ Connection closed cleanly
```

Use the SMTP Log to diagnose whether the failure is network (connection refused), TLS (upgrade failed), authentication (credentials rejected), or delivery (server refused the message).

---

## Alert Node channel

Toggle this ON to deliver alerts as JSON to a designated Transform Custom node. This lets you write custom forwarding logic (Slack, Teams, PagerDuty, webhooks, databases, etc.).

When enabled, click the collapsible header to expand:

| Field | Description |
| --- | --- |
| Project | The project containing the Alert Node. |
| Workflow | The workflow containing the Alert Node. |
| Node | Only Transform Custom nodes appear. This node will receive alert payloads. |

**Selecting a node here IS the designation.** Saving writes `alert_receiver` into the node's config and creates the `__alert__` Kafka topic immediately.

### Send Test Alert

Press **Send Test Alert** (visible in edit mode) to produce a sample alert payload to the `__alert__` topic. If the node is running, it receives the payload in its `main(Data)` function immediately. If not running, Kafka retains it until the node starts.

### Writing an Alert Node script

The designated node receives alerts as JSON strings:

```lua
function main(Data)
    local alert = linkiir.json.parse(Data)

    -- alert.rule_name    — name of the rule that fired
    -- alert.trigger      — "error" or "inactivity"
    -- alert.source       — node that produced the event
    -- alert.message      — event body or summary
    -- alert.timestamp    — ISO-8601 timestamp
    -- alert.event_count  — number of events in this alert

    -- Example: forward to a webhook
    linkiir.link.web.post{
        url = "https://hooks.slack.com/services/...",
        headers = { ["Content-Type"] = "application/json" },
        body = linkiir.json.serialize({
            text = string.format("[%s] %s — %s",
                alert.rule_name, alert.message, alert.source)
        })
    }
end
```

:::tip
The Alert Node does not need to be running for alert delivery to succeed. Kafka retention queues messages until the node starts consuming. This means you can stop, update, and restart the node without losing alerts.
:::

---

## Saving and collapsible sections

Both channel sections collapse after configuration to keep the page clean:
- When collapsed, a summary line shows the key config (e.g. `SMTP: mail.example.com:587, STARTTLS`)
- Click the header to expand and view or edit the full settings
- When you first enable a channel (nothing configured yet), it auto-expands so you can fill in the fields

---

## What happens after saving

1. Settings are written to `notifications.json` in the working directory
2. The notification engine reloads on its next tick (within seconds, no restart needed)
3. A git commit is created in the instance repository (change is tracked)
4. If an Alert Node was designated, the `__alert__` topic is created and a deploy notice appears

---

## Common workflows

### First-time setup

1. Edit → Enable Email channel → Configure SMTP → Enter recipients → Save
2. Send Test Email → verify it arrives
3. Create a rule (see [Notification Rules](./index.md#2-create-notification-rules))
4. Verify with a real event

### Adding Alert Node after email is working

1. Create a Transform Custom node in a dedicated "Alert" workflow
2. Write the forwarding script, commit it
3. Edit Alert Settings → Enable Alert Node channel → Select the node → Save
4. Start the Alert Node's workflow
5. Send Test Alert → check the node's output
6. Update existing rules' "Deliver via" to include Alert Node

### Maintenance window

1. Edit → Toggle kill switch ON → Save
2. Perform maintenance
3. Edit → Toggle kill switch OFF → Save
4. Alerts resume immediately (no lost state — firing state is preserved)

---

## Next

- [Alerting and Notifications overview](./index.md)
- [Logging API](../../api/scripting-api/logging.md)
- [Troubleshooting](../troubleshooting/index.md)
