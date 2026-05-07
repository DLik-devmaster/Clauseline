// Debug: inspect EC MDCG page structure
import axios from 'axios';
import * as cheerio from 'cheerio';

const MDCG_URL = 'https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en';

const res = await axios.get(MDCG_URL, {
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Clauseline/1.0)' },
  timeout: 15000
});

const $ = cheerio.load(res.data);

// Find rows that contain MDCG codes
const rows = [];
$('tr').each((_, tr) => {
  const cells = $(tr).find('td');
  if (cells.length === 0) return;
  const allText = $(tr).text().replace(/\s+/g, ' ').trim();
  if (!/MDCG\s+\d{4}-\d+/i.test(allText)) return;

  const cellTexts = [];
  cells.each((_, td) => cellTexts.push($(td).text().replace(/\s+/g, ' ').trim()));
  rows.push(cellTexts);
});

console.log(`Found ${rows.length} rows with MDCG codes\n`);
rows.slice(0, 10).forEach((cells, i) => {
  console.log(`Row ${i}: [${cells.map((c, j) => `${j}:"${c.slice(0,60)}"`).join(' | ')}]`);
});
