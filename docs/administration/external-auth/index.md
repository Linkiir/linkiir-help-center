---
title: External Authentication
---

# External Authentication

External authentication lets people sign in to Linkiir with the account they already have in your organisation's identity provider (IdP), instead of a separate Linkiir password. The IdP checks who they are; their IdP groups decide which Linkiir roles they get.

Configure it in **Settings → External Authentication**. Changing it needs the **Manage external authentication** permission.

---

## What is supported

| Type | Identity providers | Users sign in with |
| --- | --- | --- |
| [LDAP](ldap.md) | Microsoft **Windows Active Directory**, over **LDAPS** (port 636) or **LDAP with StartTLS** (port 389) | Their Windows username and password, on the normal Linkiir login form |
| [SAML 2.0](saml.md) | **Microsoft Entra ID**, **Okta** | The **Sign in with SSO** button |
| [OpenID Connect](openid.md) | **Microsoft Entra ID** (v2.0 endpoint), **Okta** | The **Sign in with SSO** button |

- **One type is active at a time.** Choosing a type in the **Type** dropdown replaces the previous one as the sign-in method. Each type keeps its own saved settings, so switching back loses nothing.
- **Local Linkiir accounts always keep working.** The username/password form stays on the login page for every type, so the built-in `admin` account can always sign in, even if the IdP is down. See [Break-glass access](#break-glass-access).
- **Unencrypted LDAP is not supported.** The connection to Active Directory is always encrypted.

:::note[Google is not supported]
Google sign-in does not send any group or role information, so a Google user could never be given a Linkiir role. Use LDAP, SAML, or OpenID Connect with one of the providers above.
:::

---

## Before you start

1. **Create the Linkiir roles first.** In **Settings → Roles**, create a role for each kind of access you want to hand out, for example `Help-Desk`, `Interface-Dev`, and `Grid-Admin`. See [Users and Roles](../configurations/user-roles.md).
2. **Decide the group names with your IdP administrator.** Each IdP group (or App Role) that should grant a Linkiir role must be named **exactly** like that role. See [How IdP groups become Linkiir roles](#how-idp-groups-become-linkiir-roles).
3. **Make Linkiir reachable over HTTPS.** Every type needs an `https://` **Public URL**: the address your users type to reach Linkiir. SAML and OpenID Connect build the URLs you register at the IdP from it.
4. **Keep a local administrator.** Make sure at least one local account, such as `admin`, can still sign in.

---

## How IdP groups become Linkiir roles

This is the rule that matters most, and it is the same for every type.

1. **Names must match exactly.** A user gets a Linkiir role when one of their IdP groups (or App Roles) has **the same name** as that role. Upper and lower case don't matter; everything else does. There is no prefix, no partial match, and no mapping table.
2. **A user in several matching groups gets all of those roles.**
3. **No match, no access.** A user with no matching group is refused with *"Your account is not authorized to use Linkiir"*, and no account is created.
4. **Roles are reset at every sign-in.** Linkiir replaces the user's roles with whatever their IdP groups say each time they sign in. Remove someone from a group in the IdP and they lose that Linkiir role at their next sign-in. If an existing user no longer has *any* matching group, Linkiir clears their roles, ends their sessions, and refuses the sign-in.
5. **The IdP is the only place to change an external user's roles.** In **Settings → Users**, an external user is marked **External** and their name, email, and roles are read-only. You cannot give them an extra role inside Linkiir; it would be overwritten at their next sign-in anyway.
6. **The built-in `admin` role is never granted from an IdP.** A group named `admin` is ignored.

### Where each IdP defines the name

This is where most setup problems come from: the name has to be set in the right place.

| IdP | Where the group or role name is defined | Name it like the Linkiir role |
| --- | --- | --- |
| Windows Active Directory (LDAP) | A **security group** inside the **Group OU** you give Linkiir (*Active Directory Users and Computers*) | The group name (its `cn`) |
| Microsoft Entra ID (SAML and OpenID Connect) | An **App Role** on the app: **App registrations → your app → App roles** | The App Role **Value** (not the display name) |
| Okta (SAML and OpenID Connect) | An Okta **group**: **Directory → Groups**, sent to Linkiir by the app's groups claim | The group name |

:::caution[Entra security groups do not grant roles]
For Entra ID, only **App Role** assignments reach Linkiir as role names. Adding a user to an Entra security group with the same name does nothing. Assign the user an App Role under **Enterprise applications → your app → Users and groups**.
:::

---

## What users see

| Type | Login page |
| --- | --- |
| LDAP | The normal username and password form. Users type their Windows username, for example `alice`, `alice@corp.example.org`, or `CORP\alice`. |
| SAML 2.0 and OpenID Connect | A **Sign in with SSO** button. Users sign in at the IdP's own page, with its MFA and conditional access, and never type their password into Linkiir. |

The optional **Login hint** field on the External Authentication tab shows a short line of text on the login page, for example *Use your hospital account*.

The first time someone signs in, Linkiir creates their account automatically. In **Settings → Users** they appear with an **External** badge. An administrator can still add them to projects as a collaborator, or delete the local record. Deleting is harmless: the next sign-in creates it again.

---

## Break-glass access

The built-in `admin` account, and any other local account, signs in with the normal username and password form whatever type is active. Linkiir never asks the IdP about a local account, so a local administrator can always get in to fix a broken configuration.

Every local sign-in made while external authentication is active is recorded as a **Break-glass Sign-in** audit event. See [Audit events](../security/index.md#audit-events).

---

## Cleaning up users who have left

People removed from the IdP are not deleted from Linkiir automatically. The **Cleanup rules** section of the External Authentication tab decides who is flagged:

| Rule | Flags |
| --- | --- |
| **Removed in directory** | Users Active Directory no longer lists, or has disabled. LDAP only. |
| **Inactive days** | Users who haven't signed in for this many days. Minimum 30, default 90. |
| **Daily report** | Sends a daily warning listing users who match a rule. Nothing is deleted automatically. |

To remove them, open **Settings → Users → Clean up**. It lists the matching users, their projects, and any SSH keys to revoke, and deletes only after you confirm.

With LDAP, Linkiir also checks signed-in users against Active Directory every 15 minutes and signs out anyone who has been disabled or removed. SAML and OpenID Connect users keep their current session until it expires; their next sign-in fails.

---

## Test the configuration

Every type has a **Test connection** button at the bottom of its **Connection** panel. It appears only while you are editing. It checks that Linkiir can reach the IdP and that the settings are complete. It does not sign anyone in.

After saving, open a private browser window and sign in as a test user. That is the real end-to-end check.

---

## Common problems

| Symptom | Likely cause |
| --- | --- |
| *"Your account is not authorized to use Linkiir"* | None of the user's IdP groups or App Roles matches a Linkiir role name. Check the spelling, and where the name is defined (see the table above). |
| A user lost a role after signing in again | The group was removed in the IdP. Roles are reset from the IdP at every sign-in. |
| You gave an external user a role in Linkiir and it disappeared | External users' roles come only from the IdP. Change the group membership there instead. |
| No **Sign in with SSO** button | SAML or OpenID Connect is not the active type. Edit, choose the type, and **Save**. |
| No **Test connection** button | You are not in edit mode. Click **Edit**. |
| Locked out after a bad change | Sign in as `admin` with the username and password form. |

Each type's page has its own troubleshooting table.

---

## Next

- [LDAP (Windows Active Directory)](ldap.md)
- [SAML 2.0](saml.md)
- [OpenID Connect](openid.md)
- [Audit events](../security/index.md#audit-events)
