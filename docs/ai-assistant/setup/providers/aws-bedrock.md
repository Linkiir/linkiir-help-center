---
title: AWS Bedrock Provider
sidebar_label: AWS Bedrock
description: Configure AWS Bedrock as an AI model provider in Linkiir — region, IAM role or access key, and the exact Bedrock model ids to permit.
keywords: [AWS Bedrock, IAM role, access key, SigV4, Converse, model access, Claude, Amazon Nova, AI provider]
sidebar_position: 2
---

# AWS Bedrock Provider

Reaches Claude, GPT-OSS, Amazon Nova, MiniMax and other models through an AWS account.

| | |
| --- | --- |
| **Type** | `AWS Bedrock` |
| **API shape** | `converse` |
| **Web search** | Not available on this shape — the **Web** column shows `—` |
| **Sign-in methods** | **AWS IAM role (platform identity)** (the default), **AWS access key**, **API key** |

The shared field reference lives on [AI Model Providers](index.md). This page covers what is specific to Bedrock.

## Before you start

From AWS:

- **An AWS account with Bedrock model access granted for each model you intend to use.** Model access is managed in the Bedrock console under **Model access**; an account that is not enabled for a model produces **Not enabled for account** on Test connection, and that is an AWS-side action, not something a Linkiir setting can fix. See [Amazon's model access documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html). *(Content was rephrased for compliance with licensing restrictions.)*
- **A region** where those models are available, for example `us-east-1`.
- **The exact model id** for each model, copied from the Bedrock console.
- **One credential**, matching the sign-in method you plan to use:

| Sign-in method | What you need |
| --- | --- |
| **AWS IAM role (platform identity)** | A role the Linkiir host may assume, and its ARN. Leaving the ARN blank inherits the host's own identity |
| **AWS access key** | An IAM access key pair — the access key id (`AKIA…`) and its secret access key |
| **API key** | A Bedrock API key, sent as a bearer token |

The IAM policy behind whichever identity you use **must allow invoking each model** (`Converse` / `InvokeModel`). A valid credential with a policy that is too narrow reports **Not allowed** rather than a credential error.

:::caution[Platform identity is not a guaranteed default]
**AWS IAM role (platform identity)** stores no secret and resolves an identity at request time. Confirm with **Test connection** that the principal reported is the one you meant — a blank Role ARN inherits the host identity, which may not be the one you had in mind. If it fails to resolve, use **AWS access key** or **API key** instead and raise the role problem with AWS.
:::

## Set it up

1. Open **Settings → AI → Setup** and add a provider.
2. Set **Name** to something recognisable, for example `bedrock-prod`. It must be unique on this instance.
3. Set **Type** to **AWS Bedrock**. The card then states that the provider is addressed using the **Converse** protocol, and that this protocol cannot carry web search.
4. Set **Region** to the region your models are enabled in.
5. Leave **Endpoint** alone unless you reach Bedrock over VPC/PrivateLink — it is derived from the region. The disclosure link reads **Use a VPC (PrivateLink) endpoint**.
6. Choose a **Sign-in method** and fill what it asks for:

   | Method | Fill in |
   | --- | --- |
   | AWS IAM role (platform identity) | **Role ARN (optional)** — blank inherits the host identity |
   | AWS access key | **Access key ID** and **Secret access key** |
   | API key | **Secret** (the Bedrock API key) |

7. Under **Permitted models**, type each **Model id** and click **Add model**. Set a **Display name** if the raw id is unfriendly, leave **On** on, and set **Cost** relative to your other models.
8. **Save**.
9. Click **Test connection** and read the principal line and the per-model rows.

:::info[Model ids are typed verbatim, and Bedrock's ids have a regional prefix]
Nothing is fetched from AWS — the id you type is the id sent. Bedrock's cross-region inference profile ids carry a regional prefix (for example a `us.` prefix, as in `us.anthropic.claude-opus-5`), and Bedrock refuses the bare model id for those models. Copy the exact id from the Bedrock console; a wrong id reports **Unknown model**.
:::

:::note[The access key method signs requests]
**AWS access key** signs each request with SigV4, so it needs **both** halves: the access key id and the secret access key. The access key id is an identifier, not a secret, which is why it has its own readable field.
:::

## Configuration reference

| Field | Default | Purpose |
| --- | --- | --- |
| **Name** | *(empty)* | Unique on this instance. Keys the stored credential |
| **Type** | — | `AWS Bedrock` |
| **API shape** | `converse` | Derived from the Type. Override only if you know the account is addressed differently |
| **Region** | *(empty)* | The AWS region, for example `us-east-1` |
| **Endpoint (optional)** | *(empty)* | Not needed. Set only for a VPC/PrivateLink endpoint |
| **Sign-in method** | `AWS IAM role (platform identity)` | IAM role, AWS access key, or API key |
| **Role ARN (optional)** | *(empty)* | IAM role method only. Blank inherits the host identity |
| **Access key ID** | *(empty)* | Access key method only. The non-secret half, `AKIA…` |
| **Secret access key** | *(empty)* | Access key method only. Stored encrypted, never shown again |
| **Secret** | *(empty)* | API key method only. The Bedrock API key |
| **Model id** | *(empty)* | Bedrock's own id, used verbatim. Usually carries a regional prefix |
| **Display name** | Falls back to the id | What the chat picker shows |
| **On** | On | Whether this instance may use the model |
| **Cost** | `1.0` | Your relative rating. Auto compares these |
| **Auto** | Follows **On** | Whether Auto may pick the model |
| **Web** | `—` | Unavailable on `converse` |

## Verify it worked

- **Test connection** shows **OK** for every enabled model, each row carrying the model's reply, its latency and its token counts.
- The principal line names the identity you intended. On the IAM role method with a blank ARN it will say the identity was inherited — check that this is what you wanted.
- The models appear in the chat picker under the AWS Bedrock badge.

## If it didn't work

| Stage | Cause | Fix |
| --- | --- | --- |
| **Incomplete** | A required field is empty — commonly a missing **Access key ID**, which is half the credential | Fill the field the card flags |
| **No credential** | No secret is stored for a method that needs one | Enter the secret, then save again |
| **Bad credential** | The key pair or API key is wrong, or has been rotated | Re-copy both halves from AWS |
| **Not allowed** | The IAM policy does not permit `Converse` / `InvokeModel` for this model | Widen the policy to allow invoking each model you enabled |
| **Not enabled for account** | The AWS account has no model access for this model | Grant model access in the Bedrock console. This is an AWS action, not a settings change |
| **Rate limited** | The account's Bedrock throughput for the model is exhausted | Retry, or raise the quota in AWS |
| **Unknown model** | The model id is wrong — very often the regional prefix is missing | Re-copy the exact inference profile id from the Bedrock console |
| **Unreachable** | The request did not reach AWS | Check network egress from the Linkiir host, and TLS trust if you use a PrivateLink endpoint |
| **Failed** | Another error | Read the detail on the row |

## Next

- [AI Model Providers](index.md)
- [Azure OpenAI](azure-openai.md)
- [Policy and Limits](../policy-and-limits.md)
