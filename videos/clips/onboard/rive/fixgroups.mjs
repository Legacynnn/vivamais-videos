import { connect, call } from './lib.mjs';
await connect();
const want = { Doc: [540, 570], Seal: [150, 190], Farmacia: [836, 318], Empresa: [244, 860] };
const f = await call('find_objects', { artboardId: 'Docs', type: 'node' });
const pv = {};
for (const o of f.parsed.objects) if (want[o.name]) pv[o.id] = { 13: want[o.name][0], 14: want[o.name][1] };
console.log(JSON.stringify((await call('set_property_values', { propertyValues: pv })).parsed));
