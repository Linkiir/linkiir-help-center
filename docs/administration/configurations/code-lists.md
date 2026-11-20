---
title: Code Lists
description: Import official code systems such as LOINC, ICD-10-CM, SNOMED CT and CVX, or your own CSV list, in Settings → Code lists, so map builders can search, name and check codes.
keywords: [code lists, code systems, LOINC, ICD-10-CM, ICD-10-PCS, SNOMED CT, CPT, HCPCS, RxNorm, CVX, MVX, terminology, import, settings]
---

# Code Lists

A **code list** is a full code system kept on the Grid, such as LOINC or ICD-10-CM. Map builders use it while they build a Data Map's [code tables](../../interface-development/interfaces/data-map/code-tables.md): to search for a code, fill in its name, and check that a code exists and is still active.

Code lists are used only while building. A running node never reads them. A node carries only the codes it uses, in its own code tables.

Linkiir doesn't ship any code system, and the Grid never downloads one. You download a release from its publisher and import it here. That way you load the exact version your partners use, and you update on the publisher's schedule.

---

## Opening the tab

Go to **Settings → Code lists**. The tab needs the **Manage code lists** permission, and is hidden without it. Searching and checking codes in the Map view needs only a scripting permission, so map builders don't need this one.

The tab has two lists:

- **Common code systems**: the systems Linkiir knows how to read.
- **Custom code lists**: lists you add yourself from a CSV file.

Each row shows a status:

| Status | Means |
| --- | --- |
| **Not configured** | Nothing imported yet |
| **Reading …** | An import is reading the file. The row counts the rows read so far |
| **Waiting to confirm** | The file has been read. Select **Review** to check it and put it in use |
| *version* · *N* codes | The version in use, and how many codes it holds |
| **Last import failed** | The last file couldn't be read. Open the row to see why. The version in use, if any, is unchanged |
| **Damaged** | The stored list can't be read. Import it again |

Open a row with its arrow to see the version in use, when and by whom it was imported, the previous version, the kind of file it takes, and **Get it from**, a link to the publisher's download page.

---

## Common code systems

| Code system | Covers | File it takes | Licence |
| --- | --- | --- | --- |
| **LOINC** | Lab tests and observations | The release zip, or the CSV table from it | |
| **SNOMED CT** | Clinical terms | A release zip, or a CSV subset | Needed |
| **ICD-10-CM** | Diagnoses | The release zip, or the code text file from it | |
| **ICD-10-PCS** | Inpatient procedures | The release zip, or the code text file from it | |
| **CPT** | Procedures and services | A text or CSV file | Needed |
| **HCPCS** | Supplies, drugs and services | The release zip, or the text file from it | |
| **RxNorm** | Medications | The release zip, or the concept RRF file from it | |
| **CVX** | Vaccines | The text file | |
| **MVX** | Vaccine manufacturers | The text file | |

You don't pick a file format. Each system reads its publisher's release as it comes, and finds the file it needs inside a zip.

Codes the publisher marks as retired, terminated or not valid for submission are imported too, as not active. The Map view's search offers only active codes, and its checks flag a code that isn't active.

---

## Importing a list

1. On the system's row, select **Import**. For a list already in use, the button reads **Update**.
2. Choose the file, or drag it onto the dialog. For SNOMED CT, also pick the **Language** whose preferred terms name the concepts: **US English** or **GB English**.
3. Select **Upload and preview**. The Grid reads the whole file. This can take a while for a large release, and you can close the dialog while it reads: the row shows **Waiting to confirm** when it's done.
4. Check the preview:
   - **Codes**: how many, and how many are active;
   - **Compared with the version in use**: how many codes are added and removed;
   - **First 20 codes**, to confirm it is the file you meant;
   - for SNOMED CT, the language the names come from, and any others the file holds.
5. Check the **Version**. It is read from the file name. Correct it if it isn't the release's version. A file whose name gives none reads `uploaded`.
6. For SNOMED CT or CPT, tick **This site holds a licence for this content**, and add a **Notice** if your licence asks for one. A notice is shown with the list.
7. Select **Confirm import**.

Nothing changes until you confirm. Until then, the version in use stays in use, and a file that can't be read leaves it untouched. After an update, the previous version is kept until the next one.

### Large files

A release is usually well under 2 GB. If you choose a file larger than that, the Grid asks **Upload a large file?** before it sends it, in case it is the wrong file. Select **Upload** to go ahead.

Before it takes a file, the Grid also checks it has room for it on disk, and says how much space is needed if it doesn't.

---

## Custom code lists

Use a custom list for codes no common system covers, such as a payer's drug list, a hospital's own diagnosis codes, or a licensed subset you keep yourself.

1. Select **Add custom list**.
2. Give it a **List name**.
3. Leave **Code system URL** blank unless the codes already have an official FHIR system URL. Left blank, the Grid makes a stable one from the name, such as `urn:linkiir:codelist:payer-drug-list`. A code table finds its list by this URL, so don't change it later.
4. Choose a CSV file with a header row and these columns:

   | Column | Holds |
   | --- | --- |
   | `code` | The code |
   | `display` | Its name |
   | `status` | Optional. `inactive`, `retired`, `deprecated`, `false`, `0`, `no` or `n` mark a code as not active. Anything else, or no value, is active |

   If your headers are named differently, open **Custom CSV headers** and type the names your file uses.

5. Select **Upload and preview**, check the preview, and **Confirm import**.

```csv
code,display,status
HOSP:DX:0001,Type 2 diabetes,active
HOSP:DX:0002,Hypertension,active
HOSP:DX:0099,Old code,retired
```

To replace a custom list's codes, select **Update** on its row and import a new file.

---

## Deleting a list

Select the bin icon on the row and confirm. This removes the list and every version of it. Code tables that search or check against it lose those lookups until it is imported again. Nodes are not affected: they never read code lists.

---

## Good to know

- Code lists are shared by every project on the Grid.
- On a high availability pair, code lists are managed on the active Grid.
- Importing, updating and deleting a list are recorded as system events, naming who did it and the version.

## Next

- [Code tables in a Data Map](../../interface-development/interfaces/data-map/code-tables.md)
- [Users and Roles](user-roles.md)
