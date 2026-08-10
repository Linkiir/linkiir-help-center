// Renders linkiir_scripting_api.json into docs/api/scripting-api/: one page per
// module (plus an index page), mirroring how gen-web-api-spec.js + gen-api-docs
// split the Web API into one page per tag. Purely mechanical — no hand-editing
// of the output; change the JSON or this script, then re-run
// `npm run gen-scripting-api-docs`.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'linkiir_scripting_api.json');
const OUT_DIR = path.join(__dirname, '..', 'docs', 'api', 'scripting-api');

const SHOW_NOT_AVAILABLE = false;

function mdxEscape(s) {
  if (s == null) return s;
  return s.replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/</g, '\\<').replace(/>/g, '\\>');
}

// Object-literal-like snippets (contain `{` or `<`) read better as inline code
// than backslash-escaped; plain prose just gets escaped.
function smartText(s) {
  if (s == null) return s;
  if ((s.includes('{') || s.includes('<')) && !s.includes('`')) return `\`${s}\``;
  return mdxEscape(s);
}

function escCell(s) {
  return mdxEscape((s || '').replace(/\|/g, '\\|').replace(/\n/g, ' '));
}

function slugify(title) {
  return title
    .replace(/\([^)]*\)/g, '')
    .replace(/&/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function renderItem(it, level) {
  const hh = '#'.repeat(level);
  const lines = [`${hh} \`${it.name}\``, ''];
  const kind = it.kind;
  const of = it.of;
  let tag = kind ? `*${kind}*` : '';
  if (of) tag = `*${kind} of \`${of}\`*`;
  if (tag) lines.push(tag, '');
  if (it.signature) lines.push('```lua', it.signature, '```', '');
  if (it.summary) lines.push(mdxEscape(it.summary), '');
  if (it.description && it.description !== it.summary) lines.push(mdxEscape(it.description), '');
  if (it.usage) lines.push('**Usage**', '', '```lua', it.usage, '```', '');

  if (it.params && it.params.length) {
    lines.push('**Parameters**', '', '| Name | Type | Required | Description |', '| --- | --- | --- | --- |');
    for (const p of it.params) {
      const pdesc = smartText(p.description || '') || '';
      lines.push(`| \`${p.name || ''}\` | ${escCell(p.type || '')} | ${p.required ? 'Yes' : 'No'} | ${pdesc.replace(/\|/g, '\\|')} |`);
    }
    lines.push('');
  }

  if (it.returns && it.returns.length) {
    lines.push('**Returns**', '');
    for (const r of it.returns) {
      const desc = smartText(r.description || '');
      lines.push(r.name ? `- \`${r.name}\` — ${desc}` : `- ${desc}`);
    }
    lines.push('');
  }

  if (it.errors) {
    lines.push('**Errors**', '');
    if (it.errors.description) lines.push(mdxEscape(it.errors.description), '');
    if (it.errors.codes && it.errors.codes.length) {
      lines.push('Codes: ' + it.errors.codes.map((c) => `\`${c}\``).join(', '), '');
    }
  }

  if (it.examples && it.examples.length) {
    lines.push('**Example**', '');
    for (const ex of it.examples) {
      lines.push(`\`\`\`${ex.language || 'lua'}`, ex.code || '', '```', '');
    }
  }

  return lines.join('\n');
}

// Module page body: H1 title (frontmatter handles the doc <title>), `module.name`
// code span, description, then items — grouped under a "<Of> methods" H2 for any
// items with an `of` (e.g. Node, Socket), otherwise rendered directly as H2s.
function renderModulePage(m) {
  const lines = ['---', `title: ${m.title}`, '---', '', `# ${m.title}`, '', `\`${m.name}\``, ''];
  if (m.description) lines.push(mdxEscape(m.description), '');
  lines.push('---', '');

  const plainItems = m.items.filter((it) => !it.of);
  const grouped = new Map();
  for (const it of m.items) {
    if (it.of) {
      if (!grouped.has(it.of)) grouped.set(it.of, []);
      grouped.get(it.of).push(it);
    }
  }

  for (const it of plainItems) {
    lines.push(renderItem(it, 2), '');
  }
  for (const [of, items] of grouped) {
    lines.push(`## ${of} methods`, '');
    for (const it of items) {
      lines.push(renderItem(it, 3), '');
    }
  }

  return lines.join('\n');
}

function renderIndexPage(data, modules) {
  const lines = ['---', 'title: Linkiir Scripting API', '---', '', '# Linkiir Scripting API', ''];
  if (data.description) lines.push(mdxEscape(data.description), '');
  lines.push('## Modules', '', '| Module | Use it for |', '| --- | --- |');
  for (const {module: m, slug} of modules) {
    const firstSentence = (m.description || '').split(/(?<=\.)\s/)[0] || '';
    lines.push(`| [${m.title}](${slug}.md) (\`${m.name}\`) | ${mdxEscape(firstSentence)} |`);
  }
  lines.push('', '---', '');

  // Hidden for now — nothing currently listed here is worth calling out; flip
  // this back on (and refill the table) when there's a real entry again.
  if (SHOW_NOT_AVAILABLE) {
    lines.push(`## Not available

Do not write scripts against these.

| Call | Instead |
| --- | --- |
| \`linkiir.flow.ack\` | Use Source LLP **Acknowledgment Mode**, with a custom ACK script if needed |

---
`);
  }

  lines.push(`## Next

- [Testing and Debugging Lua](../../interface-development/lua-programming/testing-debugging.md)
- [Sample Code](../../interface-development/sample-code/index.md)
- [Error Handling and Retry](../../interface-development/error-handling.md)
`);

  return lines.join('\n');
}

const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));

fs.rmSync(OUT_DIR, {recursive: true, force: true});
fs.mkdirSync(OUT_DIR, {recursive: true});

const modules = data.modules.map((m) => ({module: m, slug: slugify(m.title)}));

for (const {module: m, slug} of modules) {
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), renderModulePage(m));
}
fs.writeFileSync(path.join(OUT_DIR, 'index.md'), renderIndexPage(data, modules));

console.log(`Wrote ${OUT_DIR}/ (index.md + ${modules.length} module pages)`);
