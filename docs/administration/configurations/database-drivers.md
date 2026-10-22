---
title: Database Drivers
---

# Database Drivers

Linkiir doesn't ship database client drivers. Each database it connects to needs that database's driver installed on the machine that runs Linkiir, and Linkiir looks for them when it connects.

This applies to everything that opens a database connection:

- the [Log Archive Database](log-archive-database.md);
- **Import** and **Export to database…** in the [Schema Editor](../../interface-development/schema-editor.md);
- the **Database** destination node;
- `linkiir.store.open` in a script. See [Database](../../api/scripting-api/database.md).

## What each database needs

| Database | Driver | Notes |
| --- | --- | --- |
| **SQL Server** | Microsoft **ODBC Driver 18 for SQL Server**, plus an ODBC driver manager | Any 18.x release. Driver 17 and earlier aren't used. |
| **PostgreSQL** | **psqlODBC**, the Unicode driver, plus an ODBC driver manager | Registered as `PostgreSQL Unicode`, or `PostgreSQL Unicode(x64)` on 64-bit Windows. |
| **Oracle** | Oracle **Instant Client** | Set its library under **Settings → Database**. |
| **SQLite** | Built in | Nothing to install. |

**The ODBC driver manager** is built into Windows. On Linux and macOS, install **unixODBC**.

## SQL Server: ODBC Driver 18 only

Linkiir connects to SQL Server only through **ODBC Driver 18 for SQL Server**. Every 18.x release registers under that same name, so any 18.x works. Driver 17 can be installed alongside 18 without either affecting the other, but Linkiir won't use it.

Driver 18 is required because:

- its default is to encrypt the connection, and it supports **Strict (TDS 8.0)** encryption, which Driver 17 doesn't;
- the Log Archiver, the Schema Editor and the Database node all build the same connection, so a connection that works in one works in the others.

### Supported SQL Server versions

Microsoft supports Driver 18 with **SQL Server 2017 and later**, Azure SQL Database and Azure SQL Managed Instance. SQL Server 2016 and earlier aren't on Microsoft's support list for Driver 18. A connection may still work, but it isn't supported.

### Supported operating systems

Microsoft publishes which operating systems each 18.x release supports. An older system that the newest release no longer supports can usually install an earlier 18.x release, which works the same with Linkiir. For example, Debian 11 and Ubuntu 20.04 are supported up to release 18.6.

- **Linux:** recent releases of Debian, Ubuntu, Red Hat Enterprise Linux, Oracle Linux, SUSE Linux Enterprise Server and Alpine, on x64 and Arm64.
- **Windows:** Windows Server 2016 and later, and Windows 11. Windows 10 isn't on Microsoft's list for Driver 18. Releases 18.6 and earlier also need the Microsoft Visual C++ Redistributable.

Check Microsoft's [system requirements](https://learn.microsoft.com/sql/connect/odbc/linux-mac/system-requirements) for the release you plan to install.

## Install the drivers

### Windows

1. Install [Microsoft ODBC Driver 18 for SQL Server](https://learn.microsoft.com/sql/connect/odbc/download-odbc-driver-for-sql-server).
2. For PostgreSQL, install the 64-bit [psqlODBC](https://odbc.postgresql.org) driver.
3. Check that they're listed in **ODBC Data Sources (64-bit)** on the **Drivers** tab.

### Linux

1. Install unixODBC from the distribution: `unixodbc` on Debian and Ubuntu, `unixODBC` on Red Hat and Oracle Linux.
2. Install Driver 18 from Microsoft's package repository, following Microsoft's [Linux instructions](https://learn.microsoft.com/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server). The package is `msodbcsql18`, and installing it means accepting Microsoft's license.
3. For PostgreSQL, install the distribution's psqlODBC package: `odbc-postgresql` on Debian and Ubuntu, `postgresql-odbc` on Red Hat.
4. Check the registered drivers:

```bash
odbcinst -q -d
```

The list must include `[ODBC Driver 18 for SQL Server]`, and `[PostgreSQL Unicode]` if you use PostgreSQL.

### Point Linkiir at a library it can't find

Linkiir searches the usual install locations for the ODBC driver manager, the PostgreSQL and MySQL client libraries, and Oracle Instant Client. If a library is somewhere else, give its absolute path under **Settings → Database**, in the **Database Drivers** card. For example, the ODBC driver manager is `/usr/lib/x86_64-linux-gnu/libodbc.so.2` on Debian and Ubuntu. Oracle Instant Client is only ever loaded from the path set here.

A new path applies to connections opened after it's saved. Restart the Runtime so running nodes pick it up.

## When a driver is missing

Connecting fails with a message that names what's missing:

| Message begins | Meaning | Fix |
| --- | --- | --- |
| `No ODBC driver manager was found on this machine.` | Linkiir couldn't load the ODBC driver manager. | Install unixODBC, or set its library under **Settings → Database**. |
| `The ODBC driver "ODBC Driver 18 for SQL Server" is not installed on this machine, or can't be loaded.` | The driver manager has no driver registered under that name, or found it but couldn't load it. | Install Driver 18. If it's installed, check `odbcinst -q -d` on Linux, or the **Drivers** tab on Windows. |
| `The ODBC driver "PostgreSQL Unicode" is not installed…` | The same, for PostgreSQL. | Install psqlODBC. |

The driver manager's own message follows in brackets, for example `[unixODBC][Driver Manager]Can't open lib 'ODBC Driver 18 for SQL Server' : file not found`. On Linux this often means the driver is registered in `odbcinst.ini` but its library file has been removed.

You'll see the message in the dialog you were using (**Test connection**, **List tables**, **Import**) or, for a running Database node, in its error event on the **Logs** page.
