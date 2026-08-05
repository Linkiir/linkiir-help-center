---
title: Crash Report Collection
---

# Crash Report Collection

A crash report should provide enough technical context to reproduce or diagnose the failure without unnecessarily exposing PHI or secrets.

## Include

- Linkiir version and package type.
- Operating system and architecture.
- Environment and deployment profile.
- Exact UTC timestamp and timezone.
- Affected project, workflow, and node IDs.
- Runtime, Grid, and Archiver logs around the incident.
- Health output before and after restart.
- Process exit code or signal.
- Stack trace, core dump, or Windows crash dump when available.
- Memory, disk, and CPU state.
- Recent configuration or upgrade changes.
- Synthetic reproduction payload where possible.

## Exclude or redact

- Master encryption key.
- Plaintext passwords, tokens, and private keys.
- Full PHI payloads unless an approved secure support channel and authorization exist.
- Unrelated customer data.

## Suggested bundle layout

```text
crash-report-<timestamp>/
  summary.md
  health-before.json
  health-after.json
  runtime/
  grid/
  archiver/
  os-events/
  dump/
  reproduction/
```

The planned crash-report feature should automate collection and redaction, but operators must still review the bundle before transmission.
