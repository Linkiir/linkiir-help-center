# Linkiir Help Center

Customer-facing documentation for the Linkiir integration platform, built with [Docusaurus](https://docusaurus.io/).

## Local Development

```bash
npm install
npm start
```

This starts a local dev server at http://localhost:3000/ with hot reload.

## Build

```bash
npm run build
```

Static output is written to the `build/` directory.

## Deployment

The site deploys automatically to GitHub Pages on push to `main` via the workflow in `.github/workflows/deploy.yml`.

## Contributing

Documentation source lives in `docs/`. Pages are plain Markdown with Docusaurus admonitions and Mermaid diagram support.
