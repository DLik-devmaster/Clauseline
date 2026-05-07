import axios from 'axios';

// FDA Federal Register API — free, no auth required
const FR_API = 'https://www.federalregister.gov/api/v1/documents.json';

export async function fetchFDAUpdates() {
  console.log('[fda] fetching recent medical device rules...');
  try {
    const res = await axios.get(FR_API, {
      params: {
        conditions: {
          agencies: ['food-and-drug-administration'],
          topics: ['medical-devices'],
          type: ['Rule', 'Proposed Rule', 'Notice'],
          publication_date: { gte: new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10) }
        },
        fields: ['title', 'document_number', 'publication_date', 'type', 'abstract'],
        per_page: 20,
        order: 'newest'
      },
      timeout: 15000
    });

    const docs = res.data.results || [];
    console.log(`[fda] ${docs.length} recent documents found`);
    return docs;
  } catch (err) {
    console.error('[fda] error:', err.message);
    return [];
  }
}
