// IEC scanner — direct webstore-search-api (no Playwright)
const IEC_API = 'https://webstore-search-api.iec.ch/api/search';

const DELAY_MS = 1500;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function parseHits(json, baseCode) {
  const hits = json?.primary?.hits?.hits || [];
  const matching = hits
    .map(h => h._source)
    .filter(s => (s.reference || '').toUpperCase().startsWith(baseCode.toUpperCase()))
    .filter(s => s.publication_date && s.status !== 'WITHDRAWN');

  if (matching.length === 0) return null;

  matching.sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));
  const best = matching[0];
  const year = best.publication_date.slice(0, 4);
  const latestEdition = best.reference.replace(/\s+(CSV|ISH|CMV|RLV|SER)\s*$/i, '').trim();
  return { latestEdition, year };
}

async function searchIEC(code) {
  const baseCode = code.replace(/:\d{4}.*/, '').trim();

  const res = await fetch(IEC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0',
      'Referer': 'https://webstore.iec.ch/',
      'Origin': 'https://webstore.iec.ch',
    },
    body: JSON.stringify({ query: baseCode }),
  });

  if (!res.ok) {
    console.error(`[iec] API ${res.status} for ${baseCode}`);
    return null;
  }

  const json = await res.json();
  const parsed = parseHits(json, baseCode);

  if (!parsed) {
    console.log(`[iec] no match for ${baseCode}`);
    return null;
  }

  console.log(`[iec] ${baseCode} → ${parsed.latestEdition} (${parsed.year})`);
  return { baseCode, ...parsed };
}

export async function checkIECStandards(regulations) {
  const iecRegs = regulations.filter(r => r.body === 'IEC');
  if (iecRegs.length === 0) return {};

  const results = {};
  for (const reg of iecRegs) {
    try {
      const result = await searchIEC(reg.code);
      if (result) results[reg.code] = result;
    } catch (err) {
      console.error(`[iec] error for ${reg.code}:`, err.message);
    }
    await sleep(DELAY_MS);
  }
  return results;
}
