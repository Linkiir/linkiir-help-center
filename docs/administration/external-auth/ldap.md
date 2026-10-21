---
title: LDAP (Windows Active Directory)
---

# LDAP (Windows Active Directory)

With LDAP, people sign in to Linkiir with their normal **Windows username and password**. Linkiir checks the password with Active Directory, then gives them the Linkiir roles that match their **AD group** names.

| | |
| --- | --- |
| Supported directory | Microsoft Windows Active Directory |
| Connection | **LDAPS** (`ldaps://`, port 636), or **LDAP with StartTLS** (`ldap://`, port 389). Always encrypted; plain LDAP is refused. |
| Users sign in with | The normal Linkiir login form: `alice`, `alice@corp.example.org`, or `CORP\alice` all work |
| Roles come from | Security groups in one **Group OU** you choose |
| Network | Linkiir connects to the domain controller. Active Directory never connects to Linkiir. |

Read [External Authentication](index.md) first for how group names become roles.

---

## 1. What the Active Directory administrator provides

Hand this list to the customer's Windows/AD administrator. Each value maps to one Linkiir field.

| Value | What it is | Example | Where to find it in Windows |
| --- | --- | --- | --- |
| **Domain controller host and port** | The DC's fully qualified name exactly as it appears on its certificate, plus the port | `dc01.corp.example.org:636` | PowerShell: `Get-ADDomainController -Discover \| Select HostName` |
| **Directory name** | The AD domain | `corp.example.org` | PowerShell: `(Get-ADDomain).DNSRoot` |
| **Service account DN** | The full distinguished name of a read-only service account Linkiir uses to look users up | `CN=svc-linkiir,OU=Service Accounts,DC=corp,DC=example,DC=org` | ADUC → the user → **Properties → Attribute Editor → distinguishedName**, or `Get-ADUser svc-linkiir` |
| **Service account password** | That account's password | — | Your password vault |
| **User search base** | The DN of the OU that holds the people who will use Linkiir. Sub-OUs are included. | `OU=Staff,DC=corp,DC=example,DC=org` | ADUC → right-click the OU → **Properties → Attribute Editor → distinguishedName** |
| **Group search base** | The DN of a dedicated OU holding the Linkiir role groups. Only groups in this OU count. | `OU=Linkiir,DC=corp,DC=example,DC=org` | As above, for the group OU |
| **CA certificate (PEM)** | The certificate of the authority that signed the DC's LDAPS certificate | `-----BEGIN CERTIFICATE-----…` | `certlm.msc` → **Trusted Root Certification Authorities** → your CA → **All Tasks → Export → Base-64 encoded X.509 (.CER)** |

:::tip[ADUC tip]
In *Active Directory Users and Computers*, turn on **View → Advanced Features** to see the **Attribute Editor** tab that shows a distinguished name.
:::

### Notes for the AD administrator

- **The service account needs no special rights.** An ordinary domain user can already read users and groups. Linkiir never writes to Active Directory. Set **Password never expires**, or plan to update Linkiir when it rotates.
- **LDAPS must work on the DC.** A domain with an enterprise CA (AD Certificate Services) usually has this already. Use the DC's **hostname**, not its IP address, because Linkiir checks that the certificate matches the name.
- **The CA certificate is public and safe to share.** It is distributed to every domain-joined machine. If the Linkiir server already trusts your CA, for example because it is domain-joined, you can leave the field blank.
- **Open the firewall** from the Linkiir server to each DC on TCP **636** (or **389** for StartTLS).
- **Keep the AD lockout threshold above 5.** Linkiir pauses a username after 5 failed passwords in 15 minutes, so an attacker is stopped before AD locks the real user out.

---

## 2. Create the groups that become Linkiir roles

This is where the role names are defined for LDAP.

1. In ADUC, inside the **Group OU** (the *Group search base* above), create one **security group** per Linkiir role.
2. Name each group **exactly** like the Linkiir role, for example `Help-Desk`, `Interface-Dev`, `Grid-Admin`. Case doesn't matter.
3. Add users to the groups. A user in several groups gets all of those roles.

:::caution[Only groups in the Group OU count]
A group with a matching name somewhere else in Active Directory is ignored. If a user signs in and gets *"Your account is not authorized to use Linkiir"*, check that their group lives in the Group OU and that its name matches a role in **Settings → Roles**.
:::

Group membership is read again at every sign-in. Add or remove someone in AD and the change takes effect the next time they sign in. Users with no matching group are refused. See [How IdP groups become Linkiir roles](index.md#how-idp-groups-become-linkiir-roles).

---

## 3. Configure Linkiir

**Settings → External Authentication → Edit**, set **Type** to **LDAP / Active Directory**, and expand **Connection**.

| Field | Enter |
| --- | --- |
| **Server host** | Pick **ldaps://** from the dropdown and enter `host:port`, for example `dc01.corp.example.org:636`. Pick **ldap://** only for StartTLS on port 389. |
| **CA certificate (PEM)** | Shown when **ldaps://** is selected. Paste the whole PEM block, including the `BEGIN`/`END` lines, or leave blank if the server already trusts the CA. |
| **Directory name** | The AD domain, for example `corp.example.org` |
| **Service account DN** | The service account's distinguished name |
| **Service account password** | Its password. Stored encrypted and shown as `********` afterwards. |
| **User search base** | The User OU's DN |
| **Group search base** | The Group OU's DN |
| **Advanced: user search filter** | Leave closed. The standard Active Directory filter is applied automatically and always excludes disabled accounts. |

### Public URL

LDAP needs an `https://` **Public URL** saved before it can be turned on, but the LDAP form doesn't show the field. If it isn't set yet:

1. While editing, switch **Type** to **SAML 2.0** and fill **Public URL** with the address users reach Linkiir at.
2. Switch **Type** back to **LDAP / Active Directory**. The Public URL is kept.
3. Fill the LDAP fields and **Save**.

### Test and save

1. Click **Test connection** at the bottom of the Connection panel. It checks the encrypted connection, the certificate, the service-account sign-in, and both search bases. It does not sign anyone in.
2. Click **Save**. LDAP becomes the active sign-in method.
3. In a private browser window, sign in as a real AD user.

---

## What users see

| Situation | Message |
| --- | --- |
| Wrong password, unknown user, locked or disabled account | *Invalid username or password*. Deliberately vague. |
| Windows password expired or must be reset | *Your Windows password must be changed* |
| No matching group in the Group OU | *Your account is not authorized to use Linkiir* |
| Too many failed attempts | *Too many sign-in attempts*. Wait 15 minutes. |

Users disabled or removed in AD are signed out of Linkiir within 15 minutes, and cannot sign in again.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Everyone gets *Invalid username or password* | Linkiir can't reach or trust the DC, or the service account is wrong | Run **Test connection**. A TLS error points to the CA certificate; a bind error points to the service-account DN or password. |
| Test says *cadata should be an ASCII string* | The pasted certificate picked up Windows line endings | Re-paste it from the exported `.pem`/`.cer` file |
| Certificate or hostname error | The **Server host** is an IP address, or doesn't match the DC's certificate | Use the DC's fully qualified name |
| *Not authorized* for a user who should get in | Their group isn't in the Group OU, or its name doesn't match a Linkiir role | Check the group's location and spelling |
| Can't save: Public URL required | The Public URL isn't set | See [Public URL](#public-url) |

---

## Next

- [External Authentication overview](index.md)
- [Users and Roles](../configurations/user-roles.md)
- [Audit events](../security/index.md#audit-events)
