import { connect, call } from './lib.mjs';
await connect();
const f = await call('find_objects', { artboardId: 'Familia', name: 'Janela' });
const shapes = f.parsed.objects.filter((o) => o.type === 'Shape');
const v = await call('query_property_values', { propertyKeys: Object.fromEntries(shapes.map((s) => [s.id, [13]])) });
const pv = {};
for (const s of shapes) pv[s.id] = { 13: v.parsed.values[s.id][13] + 9 };
await call('set_property_values', { propertyValues: pv });
console.log(shapes.length);
