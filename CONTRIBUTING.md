# Updating the Help Center

Changes pushed to the `main` branch automatically deploy to https://help.linkiir.com within a few minutes.

## Quick workflow

```bash
# 1. Pull the latest
git pull origin main

# 2. Start the local dev server (hot-reloads on save)
npm start

# 3. Edit or create Markdown files in docs/
#    Preview at http://localhost:3000

# 4. Commit and push
git add docs/
git commit -m "docs: describe your change"
git push origin main
```

That's it. The GitHub Actions workflow builds the site and deploys it to GitHub Pages automatically.

## File structure

```
docs/
├── getting-started/       # Onboarding walkthrough
├── administration/        # Install, licensing, config, etc.
├── interface-development/ # Nodes, Lua scripting, samples
└── faq/                   # Common questions
```

Each folder has a `_category_.json` that controls the sidebar label and order. Individual pages use front-matter for their position:

```markdown
---
sidebar_position: 2
title: Page Title
---

# Page Title

Content here...
```

## Adding a new page

1. Create a `.md` file in the appropriate folder.
2. Add front-matter with `sidebar_position` and `title`.
3. The sidebar picks it up automatically — no other config changes needed.

## Adding a new section

1. Create a new folder under `docs/`.
2. Add a `_category_.json`:

```json
{
  "label": "Section Name",
  "position": 5
}
```

3. Add an `index.md` inside it as the section landing page.

## Supported Markdown features

- Standard Markdown syntax
- Admonitions: `:::note`, `:::tip`, `:::info`, `:::caution`, `:::warning`
- Mermaid diagrams inside ` ```mermaid ` code blocks
- Code blocks with syntax highlighting (lua, bash, json, powershell)

## Verifying before push

```bash
# Type-check
npm run typecheck

# Production build (catches broken links)
npm run build
```

The build fails on broken internal links, so fix any errors before pushing.
