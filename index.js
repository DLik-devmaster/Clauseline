import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { initDb } from './db.js';
import pool from './db.js';
import { runScan } from './scanner/index.js';

const app = express();
const PORT = process.env.PORT || 3001;
const __dir = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// Serve frontend static files
const staticDir = join(__dir, 'clauseline');
if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
  console.log('[server] static files →', staticDir);
}

// ── Regulations ───────────────────────────────────────────────

app.get('/api/regulations', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM regulations ORDER BY severity DESC NULLS LAST, code`
    );
    res.json(rows);
  } catch (err) {
    console.error('[api] GET /regulations:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/regulations', async (req, res) => {
  const { id, code, version, latest_version, title, body, category, status, severity, gap_score, changes } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO regulations (id, code, version, latest_version, title, body, category, status, severity, gap_score, changes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO UPDATE SET
         version=EXCLUDED.version, latest_version=EXCLUDED.latest_version,
         title=EXCLUDED.title, status=EXCLUDED.status,
         severity=EXCLUDED.severity, gap_score=EXCLUDED.gap_score,
         changes=EXCLUDED.changes, last_checked=NOW()
       RETURNING *`,
      [id, code, version, latest_version || version, title, body, category || null,
       status || 'up-to-date', severity || null, gap_score || 0, JSON.stringify(changes || [])]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[api] POST /regulations:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/regulations/:id/changes/:idx/status', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const idx = parseInt(req.params.idx);
  if (!['open', 'in-progress', 'closed'].includes(status))
    return res.status(400).json({ error: 'invalid status' });
  try {
    const { rows } = await pool.query(`SELECT changes FROM regulations WHERE id=$1`, [id]);
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    const changes = rows[0].changes || [];
    if (idx < 0 || idx >= changes.length)
      return res.status(400).json({ error: 'index out of range' });
    changes[idx] = { ...changes[idx], status };
    await pool.query(`UPDATE regulations SET changes=$1 WHERE id=$2`, [JSON.stringify(changes), id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/regulations/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM regulations WHERE id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Alerts ────────────────────────────────────────────────────

app.get('/api/alerts', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM alerts ORDER BY created_at DESC LIMIT 100`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Dev: simulate a scan finding a newer version ─────────────
app.post('/api/dev/simulate-update', async (req, res) => {
  const { reg_id, latest_version, severity = 'minor' } = req.body;
  try {
    const { rows } = await pool.query(`SELECT * FROM regulations WHERE id=$1`, [reg_id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Regulation not found' });
    const reg = rows[0];

    await pool.query(
      `UPDATE regulations SET latest_version=$1, status='outdated', severity=$2, last_checked=NOW() WHERE id=$3`,
      [latest_version, severity, reg_id]
    );
    // Remove stale alerts for this reg before inserting fresh one
    await pool.query(`DELETE FROM alerts WHERE reg_id=$1 AND type='new-version'`, [reg_id]);
    await pool.query(
      `INSERT INTO alerts (reg_id, code, severity, type, title, body)
       VALUES ($1,$2,$3,'new-version',$4,$5)`,
      [
        reg_id,
        reg.code,
        severity,
        `${reg.code} updated — ${latest_version}`,
        `A new edition of ${reg.code} has been published (${latest_version}). Your tracked version is ${reg.version}. Review and assess impact on your QMS.`
      ]
    );
    res.json({ ok: true, reg_id, latest_version });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/alerts/:id/acknowledge', async (req, res) => {
  try {
    await pool.query(`UPDATE alerts SET acknowledged=TRUE WHERE id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/alerts/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM alerts WHERE id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Scan ──────────────────────────────────────────────────────

let scanRunning = false;

app.post('/api/scan', async (req, res) => {
  if (scanRunning) {
    return res.status(409).json({ error: 'Scan already in progress' });
  }
  const sources = req.body.sources || ['mdcg', 'fda'];
  res.json({ ok: true, message: `Scan started for: ${sources.join(', ')}` });

  scanRunning = true;
  try {
    await runScan(sources);
  } finally {
    scanRunning = false;
  }
});

app.get('/api/scan/status', (_req, res) => {
  res.json({ running: scanRunning });
});

// ── Health ────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ── Startup ───────────────────────────────────────────────────

async function start() {
  await initDb();

  // Weekly scan: every Monday at 08:00
  cron.schedule('0 8 * * 1', () => {
    console.log('[cron] weekly scan triggered');
    if (!scanRunning) {
      scanRunning = true;
      runScan(['mdcg', 'fda']).finally(() => { scanRunning = false; });
    }
  });

  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
    // Keep-alive: ping self every 14 min to prevent Render free tier sleep
    if (process.env.NODE_ENV === 'production') {
      const selfUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
      setInterval(() => {
        fetch(`${selfUrl}/api/health`).catch(() => {});
      }, 14 * 60 * 1000);
      console.log('[keep-alive] pinging', selfUrl, 'every 14 min');
    }
  });
}

start().catch(err => {
  console.error('[server] startup failed:', err);
  process.exit(1);
});
