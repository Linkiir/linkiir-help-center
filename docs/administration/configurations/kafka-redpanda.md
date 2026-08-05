---
title: Kafka and Redpanda Configuration
---

# Kafka and Redpanda Configuration

Linkiir communicates with Apache Kafka and Redpanda through the Kafka protocol.

## Which broker should be used?

| Scenario | Recommendation |
| --- | --- |
| Local DEV | Bundled Redpanda or Kafka. |
| Shared TEST | Bundled broker for simplicity, or external cluster for production-like validation. |
| PROD | External organization-managed Kafka or Redpanda cluster. |
| Windows host | Bundled Kafka is supported; production brokers are preferably Linux-hosted. |
| Low-JVM footprint in Linux/macOS DEV | Bundled Redpanda. |

## Connection settings

Typical settings include:

- Bootstrap servers.
- Security protocol: `PLAINTEXT`, `SSL`, `SASL_PLAINTEXT`, or `SASL_SSL`.
- SASL mechanism and service account.
- CA certificate path.
- Topic retention and partition count.
- Replication factor and minimum in-sync replicas.

## Linkiir manages its own topics

You do not create, name, or size topics. Linkiir provisions what a workflow needs when you deploy it, and its own components discover them automatically.

What this means for broker administration:

| Do | Do not |
| --- | --- |
| Grant the Linkiir service account permission to create topics, read, write, and commit consumer-group offsets | Create Linkiir topics by hand ahead of time |
| Set cluster-wide retention and storage policy | Rename or delete Linkiir topics directly on the broker |
| Monitor consumer lag and disk usage | Change partition counts on Linkiir topics outside Linkiir |

Editing Linkiir topics directly on the broker is the most common cause of an installation that looks healthy but silently stops recording message history.

## Service account permissions

The Linkiir service account needs, on Linkiir's own topics:

- Create topics
- Produce and consume
- Describe topics and consumer groups
- Commit consumer-group offsets

Use a dedicated account for Linkiir rather than a shared administrative one. It keeps the audit trail meaningful and limits the blast radius of a leaked credential.

## Retention matters for message history

Linkiir copies messages into the Log DB in the background. If the broker discards records before that copy completes, those records never reach the Log DB and cannot be recovered.

| Guidance | Reason |
| --- | --- |
| Keep retention comfortably longer than your worst expected outage | Gives the copy time to catch up after downtime |
| Alert on consumer lag well before it approaches the retention window | Lag approaching retention is the warning sign of permanent history gaps |
| Do not shorten retention to reclaim disk without checking lag first | Shortening retention under lag discards history immediately |

A day of retention is a reasonable local default. For production, size it against how long you could plausibly be down over a weekend or a holiday.

## Best practices

- Use TLS and SASL in line with your security policy.
- Give Linkiir a dedicated service account.
- Keep retention longer than your worst expected outage.
- Monitor consumer lag and broker storage together.
- Test connectivity before changing a live installation.
- Let running workflows drain before switching clusters; in-flight messages are not migrated.
