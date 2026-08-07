// Layers a "Linkiir" (Lua) code sample onto every operation in web_api.json,
// via the OpenAPI `x-codeSamples` vendor extension that docusaurus-plugin-openapi-docs
// reads to add extra tabs to the generated "code examples" panel.
//
// web_api.json itself is left untouched — it's the source of truth exported
// from the server, and would just get overwritten next time someone drops in
// a fresh copy. This writes an augmented copy that `gen-api-docs` reads instead.
// Re-run via `npm run gen-api-docs` whenever web_api.json changes.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'web_api.json');
const OUT = path.join(__dirname, '..', '.generated', 'web_api.json');

const VERB_TO_METHOD = {get: 'get', post: 'post', put: 'put', delete: 'delete', patch: 'patch'};

function pascalCase(name) {
  return name.replace(/(^[a-z]|_[a-z])/g, (m) => m.replace('_', '').toUpperCase());
}

// Splits a templated path like "/api/project_collaborators/{guid}/{name}" into
// Lua string-concatenation pieces: literal segments plus PascalCase variables
// for each {param}.
function buildUrlExpr(routePath) {
  const segments = routePath.split(/(\{[^}]+\})/g).filter((s) => s !== '');
  const pieces = [];
  let literal = 'http://127.0.0.1:8080';
  for (const segment of segments) {
    const m = segment.match(/^\{([^}]+)\}$/);
    if (m) {
      pieces.push(`"${literal}"`);
      literal = '';
      pieces.push(pascalCase(m[1]));
    } else {
      literal += segment;
    }
  }
  if (literal) pieces.push(`"${literal}"`);
  return pieces.join(' .. ');
}

function buildLuaSample(routePath, verb, op) {
  const method = VERB_TO_METHOD[verb];
  const params = op.parameters || [];
  const queryParams = params.filter((p) => p.in === 'query');

  const lines = [];
  lines.push(`local resp, err = linkiir.link.web.${method}{`);
  lines.push(`   url = ${buildUrlExpr(routePath)},`);
  if (queryParams.length) {
    const entries = queryParams.map((p) => `${p.name} = ${pascalCase(p.name)}`);
    lines.push(`   params = { ${entries.join(', ')} },`);
  }
  if (op.requestBody) {
    lines.push('   body = linkiir.json.serialize{ --[[ see Request Body below ]] },');
  }
  lines.push('   -- SessionCookie: see "Authentication" on the Introduction page.');
  lines.push('   headers = { ["Cookie"] = SessionCookie },');
  lines.push('}');
  lines.push('if not resp then');
  lines.push('   error(err.message)');
  lines.push('end');
  lines.push('print(resp.code, resp.body)');
  return lines.join('\n');
}

const INTRO_DESCRIPTION = `The Linkiir Web API is the HTTP API the Linkiir server itself exposes — the
same API the web UI uses to manage projects, workflows, nodes, libraries, and
server settings.

## Base URL

There's no fixed public base URL: Linkiir is self-hosted, so requests go to
your own server. The examples on this page use \`http://127.0.0.1:8080\`, a
grid running locally.

## Authentication

Every endpoint requires an authenticated session. Log in once via
\`POST /api/login\` to get a session cookie, then send that cookie on every
request after that — there's no separate API token.

\`\`\`lua
-- 1. Log in to the local grid, capture the session cookie.
local loginResp, err = linkiir.link.web.post{
   url  = "http://127.0.0.1:8080/api/login",
   headers = { ["Content-Type"] = "application/json" },
   body = '{"username":"' .. Username .. '","password":"' .. Password .. '"}',
}
if not loginResp then
   error("login request failed: " .. err.message)
end
if loginResp.code ~= 200 then
   error("login rejected, status " .. loginResp.code .. ": " .. loginResp.body)
end

local setCookie = loginResp.headers["Set-Cookie"]
if not setCookie then
   error("login succeeded but no Set-Cookie header was returned")
end
local sessionCookie = setCookie:match("^[^;]+")  -- "lk=<token>"

-- 2. Reuse the cookie to call an authenticated grid API.
local resp, err2 = linkiir.link.web.get{
   url = "http://127.0.0.1:8080/api/get_projects",
   headers = { ["Cookie"] = sessionCookie },
}
if not resp then
   error(err2.message)
end
print(resp.code, resp.body)
\`\`\`

Every endpoint page below shows a **LINKIIR** code sample built the same way —
each one assumes a \`SessionCookie\` local already holds a cookie obtained as
shown above.

## Related

- [Scripting API](../scripting-api/index.md) — the \`linkiir.*\` calls used above, and
  everything else available inside a node script.
`;

const spec = JSON.parse(fs.readFileSync(SRC, 'utf8'));
spec.info = {...spec.info, description: INTRO_DESCRIPTION};

let count = 0;
for (const [routePath, methods] of Object.entries(spec.paths)) {
  for (const [verb, op] of Object.entries(methods)) {
    if (!VERB_TO_METHOD[verb] || !op || typeof op !== 'object') continue;
    op['x-codeSamples'] = [
      {lang: 'Linkiir', label: 'Linkiir', source: buildLuaSample(routePath, verb, op)},
    ];
    count += 1;
  }
}

fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, JSON.stringify(spec, null, 2));
console.log(`Wrote ${OUT} (${count} operations annotated with a Linkiir code sample)`);
