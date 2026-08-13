---
title: DEV Deployment
---

# DEV Deployment

DEV is optimized for rapid interface development and safe testing.

## Recommended profile

- Single Linkiir Grid and Runtime.
- Bundled Kafka, or a lightweight local queue profile.
- One Log Archiver.
- SQLite Log DB.
- Synthetic or de-identified samples.
- Localhost-only listeners unless a shared development system is required.

## Controls

- Run Test and Debug must not send live queue output.
- Store credentials in DEV-specific profiles, not in scripts.
- Keep sample data out of source control when it contains PHI.
- Do not treat DEV retention or availability as production-grade.
