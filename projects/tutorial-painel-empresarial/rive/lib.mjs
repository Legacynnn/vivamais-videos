const URL = 'http://127.0.0.1:9791/mcp';
const H = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
let sid, id = 10;
async function rpc(body) {
  const r = await fetch(URL, { method: 'POST', headers: sid ? { ...H, 'mcp-session-id': sid } : H, body: JSON.stringify(body) });
  const t = await r.text();
  if (!sid) sid = r.headers.get('mcp-session-id');
  const line = t.split('\n').find((l) => l.startsWith('data:'));
  return t.trim() ? JSON.parse(line ? line.slice(5) : t) : null;
}
export async function connect() {
  await rpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'cli', version: '1' } } });
  await rpc({ jsonrpc: '2.0', method: 'notifications/initialized' });
}
export async function call(name, args = {}) {
  const j = await rpc({ jsonrpc: '2.0', id: id++, method: 'tools/call', params: { name, arguments: args } });
  if (j.error) throw new Error(`${name}: ${JSON.stringify(j.error)}`);
  const res = j.result;
  const text = res.content?.map((c) => c.text ?? `[${c.type} ${c.mimeType}]`).join('\n');
  if (res.isError) throw new Error(`${name}: ${text}`);
  let parsed; try { parsed = JSON.parse(res.content[0].text); } catch { parsed = text; }
  return { parsed, raw: res };
}
export async function exportRiv(dest) {
  const { parsed } = await call('export_file', { format: 'riv', destination: dest, inline_base64: true });
  const fs = await import('node:fs');
  const out = `${dest}/${parsed.filename}`;
  fs.writeFileSync(out, Buffer.from(parsed.data, 'base64'));
  return out;
}
