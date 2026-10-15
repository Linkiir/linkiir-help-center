---
title: SAML 2.0
---

# SAML 2.0

With SAML, people click **Sign in with SSO** on the Linkiir login page and sign in at their identity provider (IdP), with its own MFA and conditional access. They never type a password into Linkiir. The IdP sends Linkiir a signed answer naming the user and their groups, and Linkiir gives them the roles with the same names.

| | |
| --- | --- |
| Supported IdPs | **Microsoft Entra ID**, **Okta** |
| Users sign in with | The **Sign in with SSO** button |
| Roles come from | Entra **App Roles**, or Okta **groups** |
| What you configure in Linkiir | Public URL, the IdP's metadata URL, and two attribute names |

Read [External Authentication](index.md) first for how group names become roles.

---

## How the two sides fit together

Each side has to know about the other:

| Direction | Values | Who enters them |
| --- | --- | --- |
| IdP → Linkiir | **Metadata URL** (fills IdP Entity ID, Sign-on URL, and signing certificate), **Subject attribute**, **Groups attribute** | Linkiir admin, from values the IdP admin provides |
| Linkiir → IdP | **Entity ID** and **ACS URL** | IdP admin, copied from the Linkiir form |

Linkiir builds its two values from the Public URL, so you can hand them to the IdP admin before anything else is set up:

| Linkiir value | Value |
| --- | --- |
| **Entity ID** | `{Public URL}/api/auth/saml/metadata` |
| **ACS URL** | `{Public URL}/api/auth/saml/acs` |

For example, with a Public URL of `https://linkiir.example.org`, the ACS URL is `https://linkiir.example.org/api/auth/saml/acs`.

---

## Microsoft Entra ID

### What the Entra administrator provides

| Value | Where it is in Entra | Goes into Linkiir |
| --- | --- | --- |
| **App Federation Metadata Url** | Enterprise applications → your app → **Single sign-on** → section **SAML Certificates** | **Import IdP metadata** |
| **Subject attribute** | Sent by Entra by default | `http://schemas.microsoft.com/identity/claims/objectidentifier` |
| **Groups attribute** | Sent by Entra by default, once App Roles are assigned | `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` |

### Set up the Entra app

Sign in to the Azure portal as a tenant administrator and open **Microsoft Entra ID**.

1. **Create the app.** **Enterprise applications → New application → Create your own application.** Name it (for example `Linkiir`), choose **Integrate any other application you don't find in the gallery (Non-gallery)**, and click **Create**.

   :::caution
   Create it this way. An app created under **App registrations** doesn't show the metadata URL on its SAML page.
   :::

2. **Turn on SAML.** In the new app, open **Single sign-on → SAML**. Under **Basic SAML Configuration**, click **Edit** and enter:

   | Entra field | Linkiir value |
   | --- | --- |
   | **Identifier (Entity ID)** | Linkiir **Entity ID** |
   | **Reply URL (Assertion Consumer Service URL)** | Linkiir **ACS URL** |

   Leave the optional URLs blank and **Save**.

3. **Create the App Roles.** This is where the role names are defined for Entra. Go to **App registrations → your app → App roles → Create app role**. For each Linkiir role:
   - Set **Display name** and **Value** to the Linkiir role name, for example `Help-Desk`. The **Value** is what Linkiir matches.
   - Set **Allowed member types** to **Users/Groups**, then **Apply**.

4. **Assign people to roles.** **Enterprise applications → your app → Users and groups → Add user/group.** Pick the user and the role, then **Assign**. Add one assignment per role for a user with several.

5. **Require assignment** (recommended). **Enterprise applications → your app → Properties → Assignment required = Yes.** Unassigned users are then stopped at Entra before they reach Linkiir.

6. **Copy the metadata URL.** **Single sign-on →** section **SAML Certificates → App Federation Metadata Url.** Give it to the Linkiir admin.

No other Entra changes are needed. Entra already sends the user's permanent ID, name, email, and assigned App Roles.

:::caution[App Roles, not security groups]
Entra sends App Role assignments as role names. Putting a user in a security group with the same name grants nothing.
:::

---

## Okta

### What the Okta administrator provides

| Value | Where it is in Okta | Goes into Linkiir |
| --- | --- | --- |
| **Metadata URL** | Applications → your app → **Sign On** tab → **SAML 2.0** → **Metadata details** | **Import IdP metadata** |
| **Subject attribute** | An attribute statement the Okta admin adds, carrying the user's Okta ID | The attribute **name**, for example `okta_uid` |
| **Groups attribute** | A group attribute statement the Okta admin adds | The attribute **name**, for example `groups` |

### Set up the Okta app

In the Okta Admin Console:

1. **Create the app.** **Applications → Create App Integration → SAML 2.0.** Name it, for example `Linkiir`.
2. **Enter the Linkiir values.**

   | Okta field | Linkiir value |
   | --- | --- |
   | **Single sign-on URL** | Linkiir **ACS URL** |
   | **Audience URI (SP Entity ID)** | Linkiir **Entity ID** |

3. **Create the groups.** This is where the role names are defined for Okta. **Directory → Groups → Add group**, one per Linkiir role, named exactly like the role, for example `Help-Desk`. Add people to them.
4. **Send the user's ID and groups.** On the app's **Sign On** tab, under **Attribute Statements**, add:

   | Name | Value |
   | --- | --- |
   | `okta_uid` | The user's Okta ID, `user.getInternalProperty("id")` |
   | `email` | `user.email` |
   | `displayName` | The user's full name, for example `user.firstName + " " + user.lastName` |

   And a **group** attribute statement named `groups`, filtered to the Linkiir groups (for example **Matches regex** `.*`). Linkiir ignores any group that doesn't match a role.

5. **Assign the app** to the people or groups who should use Linkiir (**Assignments** tab).
6. **Copy the Metadata URL** from the **Sign On** tab and give it to the Linkiir admin, together with the two attribute names.

:::note
Okta's console layout changes from time to time. If the attribute statement fields are not where described, see Okta's guide to configuring attribute statements and group attribute statements for SAML apps. What Linkiir needs is the same: one attribute with a stable user ID, and one with the user's group names.
:::

---

## Configure Linkiir

**Settings → External Authentication → Edit**, set **Type** to **SAML 2.0**, and expand **Connection**. The form has two sections.

### Section 1: Define your identity provider to Linkiir

| Field | Enter |
| --- | --- |
| **Public URL** | The `https://` address users reach Linkiir at |
| **Import IdP metadata** | Paste the IdP's metadata URL and click **Import from URL**. The button is unavailable until a URL is typed. |
| **IdP Entity ID**, **IdP Sign-on URL**, **IdP signing certificate(s)** | Filled by the import. Leave them. They stay editable if your IdP has no metadata URL. |
| **Subject attribute** | Entra: `http://schemas.microsoft.com/identity/claims/objectidentifier`. Okta: the ID attribute's name, for example `okta_uid`. |
| **Groups attribute** | Entra: `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`. Okta: the group attribute's name, for example `groups`. |

The user's username, email, and display name are picked up automatically from the standard attribute names Entra and Okta send. There is nothing to type for them.

### Section 2: Provide Linkiir's SP info to your IdP

Shows the **Entity ID** and **ACS URL**, each with a copy button. They update as you type the Public URL. Give them to the IdP admin if you haven't already.

### Test and save

1. Click **Save**. SAML becomes the active sign-in method. Linkiir creates its own SAML certificate automatically on the first save; there is nothing to upload.
2. Click **Test connection** (Edit mode). It checks that the setup is complete and the IdP's certificate is valid. It does not sign anyone in.
3. In a private browser window, click **Sign in with SSO** and sign in as a test user.

---

## Certificates and sign-out

- **The IdP's signing certificate** arrives with the metadata import. Linkiir warns 30 days before it expires. When the IdP rolls its certificate, run **Import from URL** again and **Save**.
- **Sign-out.** With Entra, signing out of Linkiir also ends the user's Entra session, so the next sign-in asks for their password again. With an IdP that doesn't publish a single-logout URL, Linkiir signs the user out locally only.
- **Disabled users.** If a user is disabled at the IdP, their current Linkiir session lasts until it expires; their next sign-in fails.

---

## What users see

| Situation | Message |
| --- | --- |
| Not assigned to the app at the IdP | The IdP's own "not assigned" page |
| Signed in, but no matching role | *Your account is not authorized to use Linkiir. Contact your Linkiir administrator.* |
| The sign-in couldn't be completed (a mismatched URL, an expired certificate) | *Sign-in could not be completed. Please try again.* |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| No metadata URL on Entra's SAML page, or it says "OIDC-based Sign-on" | The app wasn't created as a non-gallery SAML app | Recreate it via **Create your own application → Non-gallery** |
| The IdP sign-in works, then Linkiir shows an error | Entity ID or ACS URL at the IdP doesn't match Linkiir's | Re-copy both from Linkiir's section 2 |
| Entra says the user "is not assigned to a role for the application" | No App Role assigned | Assign one under **Users and groups** |
| *Not authorized* for a user who should get in | The App Role **Value** or Okta group name doesn't match a Linkiir role, or the Groups attribute name is wrong | Check the spelling on both sides |
| Everyone fails after months of working | The IdP's signing certificate rolled or expired | **Import from URL** again and **Save** |
| Safari blocks the sign-in window | Safari's popup or cross-site tracking settings | Allow popups for the Linkiir address, or use another browser |

---

## Next

- [External Authentication overview](index.md)
- [OpenID Connect](openid.md)
- [Audit events](../security/index.md#audit-events)
