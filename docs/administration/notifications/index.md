---
title: Alerting and Notifications
---

# Alerting and Notifications

:::info There is no built-in notification feature
Linkiir does not ship error alerting, inactivity alerting, or an SMTP notification configuration. There is no Notifications settings page, and nothing in the platform will email you when an interface fails.

Do not plan an operational model around a built-in alerting feature. This page covers what you can build with what does ship, and what to monitor from outside.
:::

You have two practical routes: alert from inside a workflow using the scripting API, or monitor Linkiir from your existing monitoring system. Most sites want both.

---

## Alerting from a workflow

Any Custom node can send email directly. This is the fastest way to get an alert out of an interface, and it works today.

```lua
local function alert(subject, detail)
   local ok, err = linkiir.link.mail.send{
      server  = "smtp://mail.example.com:587",
      from    = "linkiir-alerts@example.com",
      to      = { "integration-oncall@example.com" },
      header  = {
         Subject = subject,
         From    = "linkiir-alerts@example.com",
      },
      body    = detail,
      use_ssl = "try",
   }
   if not ok then
      print("alert delivery failed: " .. err.message)
   end
end

function main(Data)
   local Msg, MsgType = linkiir.data.extract{ schema = "adt.json", data = Data, type = "hl7" }

   local mrn = Msg.PID[3][1][1]:value()
   if mrn == nil or mrn == "" then
      alert(
         "ADT Inbound: message rejected",
         "A message arrived without a PID-3 patient identifier and was rejected."
      )
      error("PID-3 patient identifier is missing")
   end

   linkiir.flow.push{ data = Msg:text() }
end
```

Three things about this pattern:

**Send to a distribution list or a ticketing address, not to individuals.** Otherwise the alert stops working when someone changes team.

**Never put payload content in the alert.** Name the field and the interface; do not include the value. Alert email is not a controlled store, and an MRN in a subject line is a disclosure. See [Error Handling and Retry](../../interface-development/error-handling.md).

**Rate-limit it yourself.** A malformed feed can send one alert per message. Guard the call — alert on the first failure in a window, or only when a counter crosses a threshold — or your first bad batch will send thousands of emails and get the address blocked.

### Reaching Slack, Teams, PagerDuty, or a webhook

The same idea with an HTTP call instead of email:

```lua
local resp, err = linkiir.link.web.post{
   url     = WebhookUrl,
   body    = '{"text":"ADT Inbound rejected a message: PID-3 missing"}',
   headers = { ["Content-Type"] = "application/json" },
   timeout = 10,
}
if not resp then
   print("alert delivery failed: " .. err.message)
end
```

Keep the webhook URL in the project's **Credentials** tab, flagged **Secret**, rather than in the script. See [Project Settings](../configurations/project-settings.md).

:::caution Alerting from inside a node has a blind spot
A script can only alert while it is running. It cannot tell you that its own node stopped, that the Runtime died, or that a feed has gone quiet — the three things you most want to know. That is what external monitoring is for.
:::

---

## Monitoring Linkiir from outside

Point your existing monitoring at the platform. This is what catches the failures a script cannot report.

### Platform health

`GET /api/health` needs no authentication, always returns HTTP 200, and reports the verdict in the body:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime_seconds": 34512.4,
  "checks": {
    "queue":    { "status": "ok",   "detail": "1 broker(s)" },
    "runtime":  { "status": "ok",   "detail": "pid=4821" },
    "archiver": { "status": "ok",   "detail": "1/1 running" }
  }
}
```

| `status` | Alert on it? |
| --- | --- |
| `healthy` | No |
| `degraded` | Warn. Something is warming up or one component is not running. Normal for the first minute after a start. |
| `unhealthy` | Yes. A dependency is unreachable — usually the broker. |

Each sub-check carries its own `status` of `ok`, `warn`, or `fail`, and a `detail` string naming the reason. Alert on the sub-check details rather than the overall verdict alone, so you know which component to look at.

A `degraded` that persists is worth alerting on. A `degraded` for thirty seconds after a restart is not.

:::note This endpoint is unauthenticated
It reports component status and a version number, no message data. If the Studio is reachable beyond your network, restrict the path at your reverse proxy rather than assuming it is private.
:::

### What to monitor, and why

| Signal | Where from | Catches |
| --- | --- | --- |
| `/api/health` overall status | HTTP check | Platform down, broker unreachable |
| `checks.runtime` | Same response | Runtime not running, so nothing processes |
| `checks.archiver` | Same response | Message history not being recorded |
| Consumer lag against broker retention | Your broker's own monitoring | The one signal that prevents permanent loss of message history |
| Log DB disk and size | Database monitoring | Archiving stops when the disk fills |
| Studio process/service state | OS service check | The service died rather than degraded |
| Workflow state | Studio, or your own check | A feed stopped and nobody noticed |

**The lag alert matters most.** Message history is copied from the broker to the Log DB. If the Archiver falls behind for longer than the broker's retention window, the broker discards those records first and that history is gone permanently. Alert on lag well before it approaches retention — see [Message History Is Not Being Recorded](../troubleshooting/log-archiver-connectivity.md).

### Detecting a quiet feed

Nothing in the platform will tell you a feed has gone quiet. Silence looks identical to a working interface with nothing to do.

Two ways to cover it:

**From the Log DB.** If you use PostgreSQL or MS SQL, query it from your monitoring system for the most recent record per interface and alert when it is older than that interface's expected interval. This is the more reliable route, because it observes what actually arrived.

**From a Custom source node.** A node on a timer that reads a heartbeat table or file and raises an alert when a feed is overdue. Simpler to build inside Linkiir, but it stops working when Linkiir stops — which is exactly when you need it.

Whichever you choose, set expectations per interface. A busy ADT feed silent for five minutes is a problem; a nightly batch silent at midday is not. Account for overnight and weekend patterns or you will train people to ignore the alerts.

---

## A minimum viable setup

If you are going live and need something in place:

1. **HTTP check on `/api/health`** every minute. Alert on `unhealthy`, and on `degraded` sustained past a few minutes.
2. **Service check** on the Linkiir service or container, so a dead process is distinguishable from a degraded one.
3. **Broker consumer lag alert**, thresholded well below your retention window.
4. **Disk and size alerts** on the Log DB and the log directory.
5. **Inactivity check per critical interface**, from the Log DB, with per-interface expectations.
6. **Email or webhook alerts from scripts** for data-level rejections that a human needs to act on.

Items 1 to 5 come from your monitoring system. Only item 6 is built inside Linkiir.

---

## Practices

**Keep patient data out of every alert.** Interface name, node name, error category, correlation ID, counts, timestamps. Never a name, MRN, date of birth, or payload fragment. Alert channels are rarely access-controlled and are often archived somewhere you did not choose.

**Alert on the condition, not on every occurrence.** One notification per failing message turns a bad batch into an outage of its own.

**Send a recovery notice.** An alert with no "resolved" leaves people checking manually.

**Route to a rota, not a person.** Use a group address, a ticket queue, or your on-call tool.

**Rehearse it in TEST.** Stop the Runtime. Block a destination. Fill the Log DB disk. Confirm the alert actually arrives and names the right thing. An alerting setup that has never fired is an assumption. See [Tips and Best Practices](../../faq/tips-best-practices.md).

---

## Next

- [Troubleshooting](../troubleshooting/index.md)
- [Error Handling and Retry](../../interface-development/error-handling.md)
- [Linkiir Scripting API](../../api/scripting-api.md)
