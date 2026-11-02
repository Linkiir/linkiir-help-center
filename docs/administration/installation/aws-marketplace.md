---
title: Install from AWS Marketplace
---

# Install from AWS Marketplace

The Linkiir (BYOL) AMI is a preinstalled Ubuntu image that includes Linkiir Grid, bundled Kafka, and SQLite for temporary Log Archiver storage. Deploy it into your own AWS account, then configure a production database separately.

AWS infrastructure charges apply separately. This is a Bring Your Own License (BYOL) product, so a valid Linkiir license is required for full use. See [Licensing](../licensing/index.md) for activation.

## Requirements

- An AWS account with permission to subscribe to Marketplace products and launch EC2 instances.
- An x86_64 instance type with at least 8 GB RAM as a starting point with bundled Kafka. Validate capacity against your workload.
- A root EBS volume of at least 100 GiB, preferably gp3.
- An EC2 key pair for SSH access.
- A VPC and subnet. Prefer private networking or access through your organization's VPN.

## Launch the AMI

1. Open the Linkiir (BYOL) product in AWS Marketplace, subscribe, and continue to configuration and launch.
2. Choose an AWS Region and an instance type that meets the requirements above.
3. Select your VPC and subnet.
4. Set the root EBS volume to at least **100 GiB**. After launch, verify that the filesystem uses the expanded volume. Plan extra capacity for Kafka data and archived logs.
5. Select your EC2 key pair and a security group that follows [Network access](#network-access).
6. Launch the instance and wait for the EC2 status checks to pass.

## Network access

| TCP port | Purpose | Allowed source |
| --- | --- | --- |
| 22 | SSH, including the first-login tunnel | Your administrator's public IP as `/32`, or an approved VPN or bastion network |
| 8080 | Linkiir dashboard, when direct remote access is configured | Authorized client or VPN networks only |
| 8081 | Optional Runtime HTTP source listener | Approved integration clients only, and only when a workflow requires it |

Never open Kafka or database ports to the internet.

A security-group rule alone does not make a localhost listener reachable. The service bind address, host firewall, routing, and any reverse proxy must also allow the connection. Port 8081 is separate from the Grid dashboard. See [HTTP Server Settings](../configurations/http-server.md).

## Connect to the instance

The Ubuntu OS account is `ubuntu`. Connect with the EC2 private key selected at launch. The Linkiir web credentials are not Linux credentials.

```bash
ssh -i /path/to/key.pem ubuntu@EC2_HOST
```

Replace `EC2_HOST` with the reachable IP address or DNS name of the instance. Use `sudo` for OS administration.

If SSH fails, check the key pair, the security-group source, routing, and the instance address. For a private instance, connect through your VPN or bastion.

## First login

Fresh installations bind to `127.0.0.1`. For initial setup, keep dashboard access private and forward the dashboard port through SSH from your computer:

```bash
ssh -i /path/to/key.pem -L 8080:127.0.0.1:8080 ubuntu@EC2_HOST
```

Keep the tunnel open and browse to `http://localhost:8080/` on your computer. If local port 8080 is busy, use `-L 18080:127.0.0.1:8080` and browse to `http://localhost:18080/`.

Sign in for the first time with the bootstrap web username `admin` and password `password`. During this initial login, Linkiir requires you to change the `admin` account password before you can use the dashboard or other product features.

1. Enter `admin` and `password` on the login page.
2. When **Choose a new password** appears, enter **New password** and **Confirm new password**.
3. Click **Set new password** to complete the required change and access the dashboard.

The bootstrap password no longer works after this change. Create named accounts for daily use afterward. See [Create Grid User Accounts](../../getting-started/first-login.md) for the full procedure and password rules.

:::caution[Secure initial access]
Never expose an installation that still uses bootstrap credentials. Complete the password change over the private connection before enabling remote dashboard access.
:::

## Enable remote dashboard access

After first-login setup, configure the Grid bind address and HTTPS or a TLS reverse proxy as described in [Security](../security/index.md).

Use `http://EC2_HOST:8080/` only over a trusted private network. For production, use your HTTPS URL.

## Configure production log storage

SQLite is temporary, single-machine storage intended for development. Before production traffic:

1. Provision PostgreSQL or Microsoft SQL Server, for example on Amazon RDS, in a network reachable from the Linkiir instance.
2. Allow database access only from the Linkiir security group, and use a dedicated database user.
3. Open **Settings → Logs**, select the database type, and enter the connection settings.
4. Test connectivity, restart the Log Archiver instances, and verify that new events are archived.
5. Configure backups, encryption, retention, and monitoring.

The AMI does not provision or configure RDS automatically. See [Log Archive Database](../configurations/log-archive-database.md) for the full procedure and [Database Drivers](../configurations/database-drivers.md) for driver requirements.

## Verify

- The dashboard is reachable through your chosen access method and first-login setup is complete.
- Linkiir and the bundled broker are running. See [Install on Linux](linux.md#verify).
- The intended Linkiir license is activated.
- A test workflow runs and its messages reach the configured log archive.
- Free disk space, backups, and retention policies are confirmed before production use.
