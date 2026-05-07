// Seed DB with all current MDCG documents from EC guidance page
import axios from 'axios';
import * as cheerio from 'cheerio';

const MDCG_URL = 'https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en';
const API = 'http://localhost:3001/api';

function parseCodeAndRev(cellText) {
  // Take the first MDCG code in the cell (skip appendices)
  const codeMatch = cellText.match(/MDCG\s+\d{4}-\d+(?:-\d+)?/i);
  if (!codeMatch) return null;

  const code = codeMatch[0].replace(/\s+/, ' ').trim();
  const revMatch = cellText.match(/rev\.?\s*(\d+)/i);
  const rev = revMatch ? `Rev.${revMatch[1]}` : null;

  return { code, rev };
}

function parseDate(dateText) {
  const yearMatch = dateText.match(/\b(20\d{2})\b/);
  return yearMatch ? yearMatch[1] : null;
}

console.log('Fetching EC MDCG guidance page...');
const res = await axios.get(MDCG_URL, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Clauseline/1.0)' },
  timeout: 15000
});

const $ = cheerio.load(res.data);
const docs = [];
const seen = new Set();

$('tr').each((_, tr) => {
  const cells = $(tr).find('td');
  if (cells.length < 2) return;

  const col0 = $(cells[0]).text().replace(/\s+/g, ' ').trim();
  const col1 = $(cells[1]).text().replace(/\s+/g, ' ').trim();
  const col2 = cells.length > 2 ? $(cells[2]).text().replace(/\s+/g, ' ').trim() : '';

  const parsed = parseCodeAndRev(col0);
  if (!parsed) return;

  const { code, rev } = parsed;
  if (seen.has(code)) return; // deduplicate
  seen.add(code);

  const version = rev ? `${code} ${rev}` : code;
  const year = parseDate(col2);
  const title = col1.split(/[A-Z]{2,}\.?\s*$/, 1)[0].trim() || col1; // strip trailing appendix labels

  docs.push({ code, version, title: title.slice(0, 300), year });
});

console.log(`Parsed ${docs.length} unique MDCG documents\n`);

let inserted = 0;
let skipped = 0;

for (const doc of docs) {
  const id = 'mdcg-' + doc.code.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const body = {
    id,
    code: doc.code,
    version: doc.version,
    latest_version: doc.version,
    title: doc.title || doc.code,
    body: 'MDCG',
    category: 'Guidance',
    status: 'up-to-date',
    severity: null,
    gap_score: 0,
    changes: [],
  };

  try {
    await fetch(`${API}/regulations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log(`  ✓ ${doc.code} ${doc.version}`);
    inserted++;
  } catch (err) {
    console.error(`  ✗ ${doc.code}: ${err.message}`);
    skipped++;
  }
}

console.log(`\nDone: ${inserted} inserted, ${skipped} failed`);
