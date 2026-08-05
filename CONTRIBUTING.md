# Contributing

Changes pushed to `main` deploy automatically to https://help.linkiir.com.

## Local development

```bash
npm install
npm start
```

Edit Markdown files in `docs/` and preview at http://localhost:3000.

## Adding content

- Create a `.md` file in the appropriate `docs/` subfolder.
- Add front-matter with `sidebar_position` and `title`.
- The sidebar picks it up automatically.

For a new section, add a folder with a `_category_.json` and an `index.md`.

## Supported Markdown features

- Admonitions: `:::note`, `:::tip`, `:::info`, `:::caution`, `:::warning`
- Mermaid diagrams inside ` ```mermaid ` code blocks
- Syntax-highlighted code blocks

## Verifying before push

```bash
npm run typecheck
npm run build
```

The build fails on broken links — fix any errors before pushing.

## Search

Full-text search is powered by Algolia and updates automatically after each deploy.
