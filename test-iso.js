import { checkISOStandards } from './scanner/sources/iso.js';

const result = await checkISOStandards([
  { body: 'ISO', code: 'ISO 14155' },
  { body: 'ISO', code: 'ISO 13485' },
]);

console.log('\n=== RESULT ===');
console.log(JSON.stringify(result, null, 2));
