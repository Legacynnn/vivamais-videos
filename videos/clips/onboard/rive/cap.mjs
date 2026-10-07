import fs from 'node:fs';
import { connect, call } from './lib.mjs';
await connect();
const r = await call('capture_artboard', { artboardId: process.argv[2], longEdge: 512, backgroundColor: '#FAFAFE' });
const img = r.raw.content.find((x) => x.type === 'image');
if (img) fs.writeFileSync(process.argv[3], Buffer.from(img.data, 'base64')); else console.log(JSON.stringify(r.raw).slice(0, 500));
