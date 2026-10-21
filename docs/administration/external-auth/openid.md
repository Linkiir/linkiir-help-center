---
title: OpenID Connect
---

# OpenID Connect

With OpenID Connect (OIDC), people click **Sign in with SSO** on the Linkiir login page and sign in at their identity provider (IdP), with its own MFA and conditional access. They never type a password into Linkiir. Linkiir uses the **Authorization Code flow with PKCE**, verifies the signed ID token the IdP returns, and gives the user the Linkiir roles that match their IdP roles or groups.

| | |
| --- | --- |
| Supported IdPs | **Microsoft Entra ID** (v2.0 endpoint), **Okta** (org or custom authorization server) |
| Users sign in with | The **Sign in with SSO** button |
| Roles come from | Entra **App Roles** (the `roles` claim), or Okta **groups** (the `groups` claim) |
| What you configure in Linkiir | Public URL, **Issuer**, **Client ID**, **Client secret**. Nothing else. |

Read [External Authentication](index.md) first for how group names become roles.

---

## How the two sides fit together

| Direction | Values | Who enters them |
| --- | --- | --- |
| IdP → Linkiir | **Issuer**, **Client ID**, **Client secret** | Linkiir admin, from values the IdP admin provides |
| Linkiir → IdP | **Redirect URI** and **Sign-out redirect URI** | IdP admin, copied from the Linkiir form |

Linkiir builds its two URLs from the Public URL. They are the same for every IdP; only the name of the field you paste them into changes:

| Linkiir value | Value | Entra field | Okta field |
| --- | --- | --- | --- |
| **Redirect URI** | `{Public URL}/api/auth/oidc/callback` | Authentication → Web → **Redirect URIs** | **Sign-in redirect URIs** |
| **Sign-out redirect URI** | `{Public URL}/login` | Authentication → **Front-channel logout URL**, and also add it to **Redirect URIs** | **Sign-out redirect URIs** |

For example, with a Public URL of `https://linkiir.example.org`, the Redirect URI is `https://linkiir.example.org/api/auth/oidc/callback`. It must match character for character.

### What you don't configure

There are no claim, scope, or sign-out settings. Linkiir reads everything else from the IdP's discovery document and the standard OIDC claims:

- **User ID:** `sub`, the IdP's permanent identifier for the user.
- **Username:** `preferred_username`, then `email`, then `sub`.
- **Email and display name:** `email` and `name`.
- **Roles:** the `roles` and `groups` claims, merged. Values that don't match a Linkiir role are ignored.
- **Scopes:** `openid profile email`, plus `groups` when the IdP advertises it (Okta's org authorization server does).
- **Sign-out:** signing out of Linkiir also ends the IdP session when the IdP supports it (Entra and Okta do).

---

## Microsoft Entra ID

### What the Entra administrator provides

| Value | Where it is in Entra | Goes into Linkiir |
| --- | --- | --- |
| **Directory (tenant) ID** | App registrations → your app → **Overview** | Used to build the **Issuer**: `https://login.microsoftonline.com/<tenant-id>/v2.0` |
| **Application (client) ID** | App registrations → your app → **Overview** | **Client ID** |
| **Client secret value** | App registrations → your app → **Certificates & secrets → Client secrets** | **Client secret** |

#### The Issuer must end in `/v2.0` and use the tenant ID

Linkiir checks that every ID token's issuer matches the configured **Issuer** exactly. Two common mistakes make every sign-in fail:

| Issuer entered | Result |
| --- | --- |
| `https://login.microsoftonline.com/<tenant-id>/v2.0` | Correct |
| `https://login.microsoftonline.com/<tenant-id>` (no `/v2.0`) | Wrong. That is Entra's older v1.0 endpoint, which signs tokens with a different issuer (`https://sts.windows.net/<tenant-id>/`). |
| `https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0` (domain instead of ID) | Wrong. Entra always signs tokens with the tenant-ID form. |

Use the **Directory (tenant) ID** GUID from the app's Overview page. To confirm the exact value, open **Overview → Endpoints** and copy the **OpenID Connect metadata document** URL: the Issuer is that URL without `/.well-known/openid-configuration`. **Test connection** also catches both mistakes and names the value to use.

Multi-tenant authorities (`common`, `organizations`, `consumers`) are refused: they would let users from any Microsoft tenant sign in.

### Set up the Entra app

Sign in to the Azure portal as a tenant administrator and open **Microsoft Entra ID**.

1. **Register the app.** **App registrations → New registration.** Name it (for example `Linkiir`), choose **Accounts in this organizational directory only**, set **Redirect URI** to platform **Web** with Linkiir's **Redirect URI**, and click **Register**.
2. **Add the sign-out URL.** **Authentication**: set **Front-channel logout URL** to Linkiir's **Sign-out redirect URI**, and add the same URL under **Web → Redirect URIs**. **Save**.
3. **Create a client secret.** **Certificates & secrets → Client secrets → New client secret.** Copy the **Value** straight away: Entra shows it only once. Note its expiry date, and replace it in Linkiir before it expires.
4. **Create the App Roles.** This is where the role names are defined for Entra. **App roles → Create app role.** For each Linkiir role:
   - Set **Display name** and **Value** to the Linkiir role name, for example `Help-Desk`. The **Value** is what Linkiir matches.
   - Set **Allowed member types** to **Users/Groups**, then **Apply**.
5. **Assign people to roles.** **Enterprise applications → your app → Users and groups → Add user/group.** Pick the user and the role, then **Assign**. Add one assignment per role for a user with several.
6. **Require assignment** (recommended). **Enterprise applications → your app → Properties → Assignment required = Yes.**
7. **Grant admin consent.** **App registrations → your app → API permissions.** Make sure the Microsoft Graph **delegated** permissions `openid`, `profile`, `email`, and `User.Read` are listed (add them with **+ Add a permission → Microsoft Graph → Delegated permissions** if not), then click **Grant admin consent for \<tenant\>**. The permissions show a green **Granted** status.

:::info[Why admin consent]
Many tenants don't let users consent to apps themselves. Without admin consent, the first user to sign in sees **Need admin approval** and can't continue. Consent is separate from role assignment: assignment decides *who* may use the app, consent lets the app read the user's basic profile. Linkiir only needs these basic sign-in permissions; it doesn't call Microsoft Graph.

A Global Administrator can also grant it from the **Need admin approval** page itself: click **Sign in with that account** and accept the consent dialog.
:::

:::caution[App Roles, not security groups]
Entra sends App Role assignments in the `roles` claim. Putting a user in a security group with the same name grants nothing.
:::

---

## Okta

### What the Okta administrator provides

| Value | Where it is in Okta | Goes into Linkiir |
| --- | --- | --- |
| **Issuer** | Your Okta org URL, `https://<org>.okta.com`. For a custom authorization server: **Security → API → Authorization Servers →** its **Issuer URI**, for example `https://<org>.okta.com/oauth2/default`. | **Issuer** |
| **Client ID** | Applications → your app → **General → Client Credentials** | **Client ID** |
| **Client secret** | Applications → your app → **General → Client Credentials** | **Client secret** |

### Set up the Okta app

In the Okta Admin Console:

1. **Create the app.** **Applications → Create App Integration → OIDC - OpenID Connect → Web Application.**
2. **Enter the Linkiir URLs.**

   | Okta field | Linkiir value |
   | --- | --- |
   | **Sign-in redirect URIs** | Linkiir **Redirect URI** |
   | **Sign-out redirect URIs** | Linkiir **Sign-out redirect URI** |

   Keep **Authorization Code** as the grant type. Under **Assignments**, choose who may use the app.
3. **Create the groups.** This is where the role names are defined for Okta. **Directory → Groups → Add group**, one per Linkiir role, named exactly like the role, for example `Help-Desk`. Add people to them, and assign the groups to the app.
4. **Send the groups in the ID token.** On the app's **Sign On** tab, add a groups claim named `groups`, filtered to the Linkiir groups (for example **Matches regex** `.*`). Linkiir ignores any group that doesn't match a role.
5. **Copy the Client ID and Client secret** from the **General** tab, and give them to the Linkiir admin with the Issuer.

:::note[Okta authorization servers]
- **Org authorization server** (`https://<org>.okta.com`): the groups claim set on the app's **Sign On** tab is enough. Linkiir requests the `groups` scope automatically.
- **Custom authorization server** (`https://<org>.okta.com/oauth2/<name>`): add the groups claim on the authorization server instead (**Security → API → Authorization Servers → Claims**), included in the **ID Token**, **Always**. Custom authorization servers need Okta's API Access Management feature in production orgs.

Okta's console layout changes from time to time. If the groups claim isn't where described, see Okta's guide to adding a groups claim. What Linkiir needs is a `groups` claim in the ID token holding the user's group names.
:::

---

## Configure Linkiir

**Settings → External Authentication → Edit**, set **Type** to **OpenID Connect**, and expand **Connection**.

| Field | Enter |
| --- | --- |
| **Public URL** | The `https://` address users reach Linkiir at |
| **Issuer** | Entra: `https://login.microsoftonline.com/<tenant-id>/v2.0`. Okta: `https://<org>.okta.com`, or the custom authorization server's Issuer URI. |
| **Client ID** | The application (client) ID |
| **Client secret** | The client secret. Stored encrypted and shown as `********` afterwards; leave the mask untouched to keep the stored secret. |

Below the fields, **Redirect URI** and **Sign-out redirect URI** are shown with copy buttons. Register them at the IdP as described above.

### Test and save

1. Click **Test connection** at the bottom of the Connection panel. It fetches the IdP's discovery document over HTTPS, confirms the issuer matches, and lists the endpoints it found. It does not check the client secret or sign anyone in.
2. Click **Save**. OpenID Connect becomes the active sign-in method.
3. In a private browser window, click **Sign in with SSO** and sign in as a test user. This checks the client secret, the redirect URI, and the roles.

---

## What users see

| Situation | Message |
| --- | --- |
| Not assigned to the app at the IdP | The IdP's own "not assigned" page |
| Entra needs consent | Entra's **Need admin approval** page. See step 7 above. |
| Signed in, but no matching role | *Your account is not authorized to use Linkiir. Contact your Linkiir administrator.* |
| The sign-in couldn't be completed (a wrong secret, a mismatched redirect URI) | *Sign-in could not be completed. Please try again.* |
| Linkiir can't reach the IdP | *External sign-in is temporarily unavailable. Contact your administrator.* Local accounts still sign in. |

If a user is disabled at the IdP, their current Linkiir session lasts until it expires; their next sign-in fails.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| **Test connection** says the provider identifies itself differently | The Issuer is the domain form, or is missing `/v2.0` | Enter the exact value the message names |
| Entra error `AADSTS50011` (redirect URI mismatch) | The Redirect URI at Entra doesn't match Linkiir's | Re-copy it from Linkiir, character for character |
| Entra shows **Need admin approval** | Admin consent hasn't been granted | Grant admin consent (Entra step 7) |
| Entra says the user "is not assigned to a role for the application" | No App Role assigned | Assign one under **Users and groups** |
| IdP sign-in works, then *Sign-in could not be completed* | Wrong or expired client secret | Create a new secret at the IdP and paste it into Linkiir |
| *Not authorized* for a user who should get in | No role or group matches a Linkiir role name, or Okta isn't sending the `groups` claim | Check the App Role **Value** or Okta group name, and the Okta groups claim |
| Everyone fails after a long time working | The client secret expired | Create a new secret and update Linkiir |

---

## Next

- [External Authentication overview](index.md)
- [SAML 2.0](saml.md)
- [Audit events](../security/index.md#audit-events)
