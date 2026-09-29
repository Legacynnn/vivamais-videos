import { connect, call } from './lib.mjs';
await connect();
const f = await call('find_objects', { artboardId: process.argv[2], type: 'path' });
const pv = {};
for (const o of f.parsed.objects.filter((o) => o.type === 'PointsPath')) pv[o.id] = { 32: false };
console.log(JSON.stringify((await call('set_property_values', { propertyValues: pv })).parsed).slice(0, 300));
