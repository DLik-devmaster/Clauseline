import { chromium } from 'playwright';

const DELAY_MS = 3000;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function parseHits(searchJson, baseCode) {
  const hits = searchJson?.primary?.hits?.hits || [];
  const matching = hits
    .map(h => h._source)
    .filter(src => (src.reference || '').toUpperCase().startsWith(baseCode.toUpperCase()))
    .filter(src => src.publication_date && src.status !== 'WITHDRAWN');

  if (matching.length === 0) return null;

  matching.sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));
  const best = matching[0];
  const year = best.publication_date.slice(0, 4);
  const latestEdition = best.reference.replace(/\s+(CSV|ISH|CMV|RLV|SER)\s*$/i, '').trim();
  return { latestEdition, year };
}

export async function checkIECStandards(regulations) {
  const iecRegs = regulations.filter(r => r.body === 'IEC');
  if (iecRegs.length === 0) return {};

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
  });

  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    window.chrome = { runtime: {} };
  });
  await page.route('**usercentrics**', r => r.abort());
  await page.route('**cookiebot**', r => r.abort());
  await page.route('**onetrust**', r => r.abort());

  const results = {};

  try {
    // Load homepage once
    console.log('[iec] loading webstore...');
    await page.goto('https://webstore.iec.ch', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[type="search"]').first();

    for (const reg of iecRegs) {
      const baseCode = reg.code.replace(/:\d{4}.*/, '').trim();
      console.log(`[iec] searching ${baseCode}...`);

      try {
        const responsePromise = page.waitForResponse(
          r => r.url().includes('webstore-search-api.iec.ch/api/search') && r.status() === 200,
          { timeout: 15000 }
        );

        await searchInput.fill(baseCode);
        await searchInput.press('Enter');

        const apiResponse = await responsePromise;
        const searchJson = await apiResponse.json();
        const parsed = parseHits(searchJson, baseCode);

        if (!parsed) {
          console.log(`[iec] no match for ${baseCode}`);
        } else {
          console.log(`[iec] ${baseCode} → ${parsed.latestEdition} (${parsed.year})`);
          results[reg.code] = { baseCode, ...parsed };
        }

        // Navigate back to homepage for next search
        await page.goto('https://webstore.iec.ch', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(1500);
      } catch (err) {
        console.error(`[iec] error for ${baseCode}:`, err.message);
        // Try to recover — go back to homepage
        try {
          await page.goto('https://webstore.iec.ch', { waitUntil: 'domcontentloaded', timeout: 15000 });
          await page.waitForTimeout(1500);
        } catch { /* give up on recovery */ }
      }

      await sleep(DELAY_MS);
    }
  } finally {
    await browser.close();
  }

  return results;
}
