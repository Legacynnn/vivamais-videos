import QRCode from 'qrcode';
import { writeFile } from 'node:fs/promises';

function field(id, value) {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

function crc16(value) {
  let crc = 0xffff;
  for (const char of value) {
    crc ^= char.charCodeAt(0) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

const merchant = field('00', 'BR.GOV.BCB.PIX') + field('01', '123e4567-e89b-12d3-a456-426614174000');
const additional = field('05', 'PLANTAO');
const base =
  field('00', '01') +
  field('26', merchant) +
  field('52', '0000') +
  field('53', '986') +
  field('54', '39.90') +
  field('58', 'BR') +
  field('59', 'VIVA MAIS') +
  field('60', 'SAO LUIS') +
  field('62', additional) +
  '6304';
const payload = `${base}${crc16(base)}`;
const png = await QRCode.toBuffer(payload, {
  type: 'png',
  width: 620,
  margin: 4,
  color: { dark: '#17151E', light: '#FFFFFF' },
  errorCorrectionLevel: 'M',
});
await writeFile(new URL('../assets/screens/pix-qr.png', import.meta.url), png);
