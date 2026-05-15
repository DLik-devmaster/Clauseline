import axios from 'axios';
import * as cheerio from 'cheerio';

function extractYears(text) {
  return [...text.matchAll(/\b(20\d{2})\b/g)]
    .map(m => parseInt(m[1]))
    .filter(y => y >= 2000 && y <= new Date().getFullYear() + 1);
}

function maxYearStr(years) {
  return years.length ? String(Math.max(...years)) : null;
}

async function fetchSourceUrl(url) {
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Clauseline/1.0)' },
      timeout: 12000,
      maxRedirects: 3,
    });
    const $ = cheerio.load(res.data);
    $('script, style, nav, footer').remove();

    // Prioritise title/headings — most likely to contain the definitive version
    const priority = [
      $('title').text(),
      $('h1').first().text(),
      $('meta[name="description"]').attr('content') || '',
      $('h2').first().text(),
    ].join(' ');

    const body = $('body').text().slice(0, 4000);
    return { priority, body };
  } catch (err) {
    console.warn(`[custom] source_url fetch failed (${url}): ${err.message}`);
    return null;
  }
}

// Uses serper.dev (2500 free queries on signup, no CX needed)
async function searchGoogle(query) {
  const key = process.env.SERPER_API_KEY;
  if (!key) return null;

  try {
    const res = await axios.post('https://google.serper.dev/search', { q: query, num: 5 }, {
      headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
      timeout: 10000,
    });
    const items = [...(res.data.organic || []), ...(res.data.knowledgeGraph ? [res.data.knowledgeGraph] : [])];
    const text = items.map(i => `${i.title || ''} ${i.snippet || ''}`).join(' ');
    const years = extractYears(text);
    return maxYearStr(years);
  } catch (err) {
    console.warn(`[custom] Serper query "${query}" failed: ${err.message}`);
    return null;
  }
}

export async function checkCustomStandards(regs) {
  const results = {};

  for (const reg of regs) {
    let foundYear = null;

    // Primary: parse source URL
    if (reg.source_url) {
      const page = await fetchSourceUrl(reg.source_url);
      if (page) {
        const priorityYears = extractYears(page.priority);
        const bodyYears     = extractYears(page.body);
        const year = maxYearStr([...priorityYears, ...bodyYears]);
        if (year) {
          console.log(`[custom] ${reg.code} source_url → year ${year}`);
          foundYear = year;
        }
      }
    }

    // Secondary: Google CSE — "<code> <title> current version"
    const query = `"${reg.code}" "${reg.title}" current version OR latest edition`;
    const googleYear = await searchGoogle(query);
    if (googleYear) {
      console.log(`[custom] ${reg.code} Google → year ${googleYear}`);
      if (!foundYear || parseInt(googleYear) > parseInt(foundYear)) {
        foundYear = googleYear;
      }
    }

    if (foundYear) {
      results[reg.id] = { year: foundYear };
    }
  }

  return results;
}
