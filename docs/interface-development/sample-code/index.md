---
title: Sample Code
---

# Sample Code

Complete interfaces you can build and run. Each one lists every node, its field values, and its script.

| Sample | Shows |
| --- | --- |
| [Demo: HTTP Source to File](http-source-demo.md) | Receiving an HTTP request, transforming JSON, writing a file |
| [Demo: HL7 LLP to Scripting to LLP](hl7-llp-scripting-llp.md) | Receiving HL7 v2 over MLLP, mapping an ADT, forwarding with ACK handling |

## Before you run either one

- Build them in DEV, never against a production endpoint.
- Use synthetic data. `TEST000001`, `TEST^PATIENT`, `19700101` — never real patient data.
- Replace ports, hostnames, directories, and schema names with values for your environment.
- Run Test each script before starting a node. It catches compile and mapping errors in one click.

Both samples use the native `linkiir.*` API. If you are migrating scripts from a legacy integration engine, the equivalent legacy names and how to enable them are in [Linkiir Scripting API](../lua-programming/linkiir-api.md).
