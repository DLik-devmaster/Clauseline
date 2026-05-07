import { chromium } from 'playwright';

const DELAY_MS = 5000;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function searchISO(browser, code) {
  const baseCode = code.replace(/:\d{4}.*/, '').trim();

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

  // Block GDPR overlays that intercept pointer events
  await page.route('**usercentrics**', r => r.abort());
  await page.route('**cookiebot**', r => r.abort());
  await page.route('**onetrust**', r => r.abort());

  try {
    console.log(`[iso] searching ${baseCode}...`);

    await page.goto('https://www.iso.org/search.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[type="search"]').first();

    // Register response listener BEFORE triggering search
    const responsePromise = page.waitForResponse(
      r => r.url().includes('algolia.net') && r.status() === 200,
      { timeout: 15000 }
    );

    await searchInput.fill(baseCode);
    await searchInput.press('Enter');

    const response = await responsePromise;
    const json = await response.json();
    const hits = json?.results?.[0]?.hits || [];

    const match = hits.find(h =>
      (h.reference || '').toUpperCase().startsWith(baseCode.toUpperCase())
    );

    if (!match) {
      console.log(`[iso] no match for ${baseCode} (${hits.length} hits)`);
      return null;
    }

    const yearM = (match.reference || '').match(/:(\d{4})/);
    if (!yearM) {
      console.log(`[iso] matched ${match.reference} but no year found`);
      return null;
    }

    const year = yearM[1];
    const latestEdition = match.reference;
    console.log(`[iso] ${baseCode} → ${latestEdition}`);
    return { baseCode, latestEdition, year };
  } catch (err) {
    console.error(`[iso] error for ${baseCode}:`, err.message);
    return null;
  } finally {
    await context.close();
  }
}

export async function checkISOStandards(regulations) {
  const isoRegs = regulations.filter(r => r.body === 'ISO');
  if (isoRegs.length === 0) return {};

  const results = {};
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  try {
    for (const reg of isoRegs) {
      const result = await searchISO(browser, reg.code);
      if (result) results[reg.code] = result;
      await sleep(DELAY_MS);
    }
  } finally {
    await browser.close();
  }

  return results;
}
