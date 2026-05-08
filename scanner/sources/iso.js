// ISO scanner — direct Algolia API (no Playwright)
// Credentials from iso.org/search.html (algolia.settings block)
const ALGOLIA_APP_ID = 'JCL49WV5AR';
const ALGOLIA_API_KEY = 'MzcxYjJlODU3ZmEwYmRhZTc0NTZlODNlZmUwYzVjNDRiZDEzMzRjMjYwNTAwODU3YmIzNjEwZmNjNDFlOTBjYXJlc3RyaWN0SW5kaWNlcz1QUk9EX2lzb29yZ19lbiUyQ1BST0RfaXNvb3JnX2VuX2F1dG9jb21wbGV0ZQ==';
const ALGOLIA_INDEX  = 'PROD_isoorg_en';
const ALGOLIA_URL    = `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX}/query`;

const DELAY_MS = 1500;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function searchISO(code) {
  const baseCode = code.replace(/:\d{4}.*/, '').trim();

  const res = await fetch(ALGOLIA_URL, {
    method: 'POST',
    headers: {
      'X-Algolia-Application-Id': ALGOLIA_APP_ID,
      'X-Algolia-API-Key': ALGOLIA_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: baseCode, hitsPerPage: 15 }),
  });

  if (!res.ok) {
    console.error(`[iso] Algolia ${res.status} for ${baseCode}`);
    return null;
  }

  const json = await res.json();
  const hits = json.hits || [];

  const match = hits.find(h =>
    (h.reference || '').toUpperCase().startsWith(baseCode.toUpperCase())
  );

  if (!match) {
    console.log(`[iso] no match for ${baseCode} (${hits.length} hits)`);
    return null;
  }

  const yearM = (match.reference || '').match(/:(\d{4})/);
  if (!yearM) {
    console.log(`[iso] matched ${match.reference} but no year`);
    return null;
  }

  const latestEdition = match.reference;
  const year = yearM[1];
  console.log(`[iso] ${baseCode} → ${latestEdition}`);
  return { baseCode, latestEdition, year };
}

export async function checkISOStandards(regulations) {
  const isoRegs = regulations.filter(r => r.body === 'ISO');
  if (isoRegs.length === 0) return {};

  const results = {};
  for (const reg of isoRegs) {
    try {
      const result = await searchISO(reg.code);
      if (result) results[reg.code] = result;
    } catch (err) {
      console.error(`[iso] error for ${reg.code}:`, err.message);
    }
    await sleep(DELAY_MS);
  }
  return results;
}
