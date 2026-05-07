import { checkIECStandards } from './scanner/sources/iec.js';

const result = await checkIECStandards([
  { body: 'IEC', code: 'IEC 62304' },
  { body: 'IEC', code: 'IEC 60601-1' },
]);

console.log('\n=== RESULT ===');
console.log(JSON.stringify(result, null, 2));
