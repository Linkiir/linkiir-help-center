---
title: Project Documents
description: Upload specs, guides and mapping workbooks to a project's AI Knowledge tab so the assistant can search them, and read what each row and retrieval label tells you.
keywords: [AI documents, document indexing, implementation guide, mapping sheet, scanned PDF, full-text search, reindex, document limits]
sidebar_position: 2
---

# Project Documents

**Project settings → AI Knowledge → Documents** is where you put the reference material for one project. Once a document is indexed, the assistant can search it and quote it back to you with a page or a row behind the claim.

Any collaborator on the project can add, download, reindex or delete a document. No AI permission is needed.

Documents are read, never obeyed. If you want a rule complied with, write a [Skill](project-skills.md) instead.

## What to upload

The material your team already has open in another window while it works:

- A vendor's HL7 v2 or FHIR implementation guide
- An X12 837 companion guide
- A customer's source-to-target mapping workbook
- An OpenAPI or JSON Schema spec
- The interface's own written requirements

## Accepted types

| Kind | Extensions |
| --- | --- |
| **Documents** | `.pdf` `.docx` |
| **Spreadsheets and data** | `.xlsx` `.csv` |
| **Text** | `.txt` `.md` |
| **Message and structured formats** | `.hl7` `.xml` `.json` `.yaml` `.yml` |

Refused, with the reason shown: executables, archives, password-protected PDF and XLSX files, and anything there is no extractor for. The check reads the file's content as well as its extension, so renaming a `.zip` to `.txt` changes nothing.

## Add documents

1. Open the project's settings popup and go to the **AI Knowledge** tab.
2. Click **Add documents**, or drag files straight onto the list.
3. Select as many files as you like at once. Each file reports its own result, so one refusal does not stop the rest.
4. Watch the rows appear. A document is searchable once its row shows **Indexed**.

Uploading something the project already holds is recognised. The toast tells you it was already indexed, the identical content is reused, and it does not count again against the document limit.

## How each type is read

This is what makes a document useful — the assistant can only cite as precisely as the file was indexed.

| Type | How it is indexed |
| --- | --- |
| **PDF** | Page by page, so an answer can name a page. **A scanned PDF with no text layer is stored but not searchable**, and the row says so — upload a text-based version |
| **Word (`.docx`)** | By paragraph, with heading styles becoming the document's outline |
| **Excel (`.xlsx`) / CSV** | As sheet, header and row — this is the best case for a mapping workbook |
| **HL7, XML** | Structure-aware, so a segment or element stays addressable |
| **JSON, YAML** | By path, so a field in an OpenAPI spec stays addressable |
| **Text, Markdown** | Directly, with Markdown headings becoming the outline |

## Reading the list

Each row shows the filename, then one of two things:

| Row state | What it means |
| --- | --- |
| A page or sheet count, an **Indexed** badge, and a retrieval label | The document is searchable |
| A warning with a reason | It is stored but not searchable. The reason names the problem — a scanned PDF, an unreadable file |

Under that, who uploaded it and when. The footer totals the documents, their pages, and how many of them are indexed.

The retrieval label tells you how the assistant will reach into that document:

| Label | Meaning |
| --- | --- |
| **Full-text search** | The normal one. Passages are found by the words in your question |
| **Attached whole** | Small enough to be handed over in full |
| **Hybrid search** | Full-text search combined with a second signal |
| **Outline & section** | Only the outline and whole sections are reachable, not individual passages |

## Per-row actions

The `⋯` menu on a row:

| Action | What it does |
| --- | --- |
| **Download** | Gets the original file back, exactly as uploaded |
| **Reindex** | Extracts and indexes the document again. Use it after a row reports a problem you have since fixed |
| **Delete** | Removes the source, the extracted text, the outline, and the index entries |

## Limits

Defaults, which an administrator can change in **Settings → AI → Policy** — see [AI Policy and Limits](../setup/policy-and-limits.md#project-documents).

| Limit | Default |
| --- | --- |
| Documents per project | 25 |
| Size of one document | 25 MB |

:::caution[Keep the set focused]
A very large document set moves to **Outline & section** retrieval, where ordinary content search stops returning passages and the assistant can only see headings and whole sections. A few well-chosen documents answer better than everything you have. Upload the guide for the interface you are building, not the vendor's entire library.
:::

## How the assistant uses them

**The assistant searches documents only when the conversation has a project in scope.** Check the project scope selector in the composer footer — see [Modes and Project Scope](../using-the-assistant/modes-and-scope.md).

Adding a document does not push it into the prompt. The assistant searches when the question calls for it, and what it read appears in the answer's **steps of evidence** list. So the way to use a document is to ask a question it answers, then expand the evidence to see which page or row was used.

Documents live inside the project and are **never committed to git**. They do not travel to a remote or into another user's clone. They are deleted with the project, and retention never ages them out.

## Worked example: an implementation guide

A vendor's HL7 v2 or FHIR specification PDF.

1. Open the project's **AI Knowledge** tab and click **Add documents**. Pick the guide.
2. Wait for the row to show a page count and **Indexed**, with **Full-text search** beside it.
3. Open the assistant with that project in scope, and ask a question the guide answers:

   ```text
   What does the spec say about OBX-5 repetition for this message type?
   ```

4. Expand **steps of evidence** in the answer. You should see the guide named, with the page the answer came from. Click through and read the page yourself.

A text-based PDF is required. If the file is a scan — pages that are images of text — the row will say it is not searchable, and no amount of asking will help. Get the text-based version from the vendor, or the exported PDF rather than the printed-and-scanned one.

## Worked example: a mapping sheet

An `.xlsx` or `.csv` workbook of source-to-target fields. This is the highest-value document you can add, because a spreadsheet is indexed as **sheet, header and row** — so a question about one field finds that field's row, instead of a vague paragraph near it.

Shape it so a row is a complete answer on its own:

| Column | Holds |
| --- | --- |
| **Source path** | `PID-5.1`, `patient.name.family` |
| **Target path** | Where it lands downstream |
| **Transformation rule** | Trim, pad, reformat a date, split a name |
| **Code set** | The value set that governs it |
| **Notes** | What to do when it is empty or invalid |

- One row per field. A row that covers "the whole PID segment" cannot be retrieved usefully.
- A header row on every sheet. The headers are what make a row readable once it is retrieved on its own.
- One sheet per interface, named for the interface. Then an answer can tell you which interface it read.

Upload it, confirm **Indexed**, then ask:

```text
Using the mapping sheet, what does PID-5.1 map to, and what happens when it is empty?
```

The answer should name the sheet and the row, and repeat your own transformation rule back to you — including the empty-value handling from the **Notes** column. If it does not, the row is probably missing that note.

:::caution[No real patient data in a workbook]
A mapping sheet describes fields; it does not need example patients. Where you want a sample value, use an obviously fake one — `MRN000001`, `Doe^Jane`. Documents are visible to everyone who can open the project.
:::

## Verify it worked

- The row shows a page or sheet count, an **Indexed** badge, and **Full-text search**.
- The footer count of indexed documents went up by one.
- With the project in scope, a question the document answers gets an answer whose **steps of evidence** names that document.
- **Download** on the `⋯` menu returns the file you uploaded.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| The upload is refused for size | The file is over the per-document cap, 25 MB by default | Split it, or ask an administrator to raise **Max document size** in **Settings → AI → Policy** |
| The upload is refused for count | The project is at its document limit, 25 by default | Delete a document you no longer rely on, or ask an administrator to raise **Documents per project** |
| A PDF row says it is not searchable | It is a scan with no text layer, so there is no text to index | Upload a text-based PDF. Reindexing the scan will not change the outcome |
| The assistant does not use the document | The conversation has no project in scope, or the row is not **Indexed** | Set the project in the composer's scope selector, and check the row's badge |
| A password-protected PDF or XLSX is refused | Protected files cannot be opened for extraction | Remove the protection, then upload again |
| An archive or an executable is refused | Those types are blocked, by content as well as extension | Upload the document itself, not a `.zip` of it |
| The assistant seems to ignore a large document set | The set has moved to **Outline & section** retrieval, so passage search returns nothing | Delete what the project does not need. A focused set searches properly |
| A document uploaded twice appears once | The identical content was recognised and reused | Nothing to fix — this is intended, and it did not count against the limit |

## Next

- [Project Skills](project-skills.md)
- [Modes and Project Scope](../using-the-assistant/modes-and-scope.md)
- [Attachments, Skills and Context](../using-the-assistant/attachments-and-context.md)
- [AI Policy and Limits](../setup/policy-and-limits.md)
- [Troubleshooting](../troubleshooting.md)
