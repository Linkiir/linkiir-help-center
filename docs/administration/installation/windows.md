---
title: Install on Windows
---

# Install on Windows

## Requirements

- Windows 10, Windows 11, Windows Server 2016, 2019, or 2022, x64.
- Administrator privileges.
- 4 GB RAM minimum; 8 GB recommended with bundled Kafka.
- 2 GB free disk minimum; 4 GB with bundled Kafka.

The installer supplies the Linkiir application dependencies. A bundled-Kafka installation also includes Java and Kafka.

```

For production environments, Kafka needs to be installed on Linux servers.

```

## Interactive installation

1. Run `LinkiirSetup-1.0.0-x64.exe` as Administrator.
2. Accept the approved software terms.
3. Select the installation directory, normally `C:\Program Files\Linkiir`.
4. Choose a queue mode:
   - **Install Apache Kafka for me** for a self-contained DEV/TEST installation.
   - **Connect to my own Kafka broker** for an existing cluster.
5. For an external broker, enter the endpoint, security protocol, SASL settings, and CA certificate when applicable.
6. Run **Test Connection**.
7. Review the summary and install.

The installer waits for the broker and `GET /api/health` before presenting the completion page.

## Silent installation

Bundled Kafka:

```powershell
LinkiirSetup-1.0.0-x64.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
```

External broker:

```powershell
LinkiirSetup-1.0.0-x64.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART `
  /QueueMode=external `
  /BootstrapServers="broker1.example.com:9093,broker2.example.com:9093" `
  /SecurityProtocol=SASL_SSL `
  /SaslMechanism=SCRAM-SHA-512 `
  /Username=linkiir_svc `
  /SaslPasswordEncrypted="<encrypted-token>" `
  /CaCertificate="C:\certs\corp-ca.pem"
```

## Installed services and data

| Item | Default |
| --- | --- |
| Grid service | `LinkiirGrid` |
| Bundled queue service | `LinkiirKafka` |
| Program files | `C:\Program Files\Linkiir` |
| Mutable configuration/data | `C:\ProgramData\Linkiir` |
| Grid | `http://127.0.0.1:8080` |
| Runtime gRPC | `127.0.0.1:50051` |
| Kafka | `127.0.0.1:9092` |

The Grid supervises Runtime and Log Archiver child processes. They do not normally appear as separate Windows services.

## Verify

```powershell
Get-Service LinkiirGrid, LinkiirKafka
Get-Content "C:\ProgramData\Linkiir\logs\installer\readiness.txt"
```

`READY` means the installation completed and the services answered readiness checks.
