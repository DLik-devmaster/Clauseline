// Dashboard page — stats, compliance radar (novel), main table
const { useState: useStateD, useMemo: useMemoD, useEffect: useEffectD, useRef: useRefD } = React;

function Sparkline({ points = [4,5,4,6,7,6,8,9], color = "currentColor" }) {
  const w = 60, h = 16;
  const max = Math.max(...points), min = Math.min(...points);
  const d = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / (max - min || 1)) * h;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return <svg width={w} height={h} style={{display: "block"}}><path d={d} fill="none" stroke={color} strokeWidth="1.5"/></svg>;
}

function ComplianceRadar({ regs, onPick }) {
  const size = 340;
  const cx = size / 2, cy = size / 2;

  const AXES = ["QMS", "Clinical", "Software", "Biocompatibility", "IVD", "Cybersecurity", "Safety", "Regulatory"];
  const AXIS_MAP = {
    "QMS": "QMS", "Records": "QMS",
    "Clinical": "Clinical",
    "Software": "Software", "AI/ML": "Software", "Usability": "Software",
    "Biocompatibility": "Biocompatibility",
    "IVD": "IVD",
    "Security": "Cybersecurity", "InfoSec": "Cybersecurity",
    "Risk": "Safety", "Safety": "Safety", "Vigilance": "Safety",
    "Electrical Safety": "Safety", "EMC": "Safety", "Sterilization": "Safety",
    "Market Access": "Regulatory", "Classification": "Regulatory",
    "Labelling": "Regulatory", "Guidance": "Regulatory",
  };
  const getAxis = (r) => AXIS_MAP[r.category] || r.category || "Regulatory";

  const categories = AXES;
  const catAngle = (cat) => categories.indexOf(cat) / categories.length * Math.PI * 2 - Math.PI / 2;

  const points = regs.map((r, i) => {
    const base = catAngle(getAxis(r));
    const jitter = (hashStr(r.id) % 100 / 100 - 0.5) * 0.6;
    const angle = base + jitter;
    const radius = 40 + (r.gapScore / 100) * 120;
    return {
      r,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      angle, radius
    };
  });

  function hashStr(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }

  const colorFor = (r) => {
    if (r.status === "up-to-date") return "var(--ok)";
    if (r.status === "under-review") return "var(--review)";
    if (r.severity === "critical") return "var(--crit)";
    return "var(--warn)";
  };
  const sizeFor = (r) => 5 + (r.gapScore / 20);

  return (
    <div className="card radar-card">
      <div className="card-head">
        <div>
          <div className="card-title">Compliance radar</div>
          <div className="card-sub">spatial · gap severity × category</div>
        </div>
        <div className="radar-legend">
          <span className="radar-legend-item"><span className="status-dot ok"/>compliant</span>
          <span className="radar-legend-item"><span className="status-dot review"/>review</span>
          <span className="radar-legend-item"><span className="status-dot warn"/>outdated</span>
          <span className="radar-legend-item"><span className="status-dot crit"/>critical</span>
        </div>
      </div>
      <div className="radar-inner">
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxHeight: 360 }}>
          {/* rings */}
          {[40, 80, 120, 160].map(r => (
            <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeDasharray={r === 40 ? "" : "2 4"}/>
          ))}
          {/* category spokes + labels */}
          {categories.map((cat, i) => {
            const a = i / categories.length * Math.PI * 2 - Math.PI / 2;
            const x2 = cx + Math.cos(a) * 160;
            const y2 = cy + Math.sin(a) * 160;
            const lx = cx + Math.cos(a) * 176;
            const ly = cy + Math.sin(a) * 176;
            return (
              <g key={cat}>
                <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="var(--border)" strokeWidth="0.5"/>
                <text x={lx} y={ly} fontSize="9.5" fill="var(--ink-3)" textAnchor="middle"
                  dominantBaseline="middle" fontFamily="var(--font-mono)">{cat.toUpperCase()}</text>
              </g>
            );
          })}
          {/* compliant inner ring label */}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="9" fill="var(--ink-4)" fontFamily="var(--font-mono)">COMPLIANT</text>
          <text x={cx} y={cy + 7} textAnchor="middle" fontSize="9" fill="var(--ink-4)" fontFamily="var(--font-mono)">CORE</text>
          {/* points */}
          {points.map(p => (
            <g key={p.r.id} style={{ cursor: "pointer" }} onClick={() => onPick(p.r)}>
              <circle cx={p.x} cy={p.y} r={sizeFor(p.r) + 4} fill={colorFor(p.r)} opacity="0.18"/>
              <circle cx={p.x} cy={p.y} r={sizeFor(p.r)} fill={colorFor(p.r)}>
                <title>{p.r.code} · gap {p.r.gapScore}</title>
              </circle>
              {p.r.gapScore >= 50 && (
                <text x={p.x + sizeFor(p.r) + 4} y={p.y + 3} fontSize="9" fill="var(--ink-2)" fontFamily="var(--font-mono)">
                  {p.r.code}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function UpcomingCard({ alerts, onOpenAlerts }) {
  const top = alerts.slice(0, 3);
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">Active signals</div>
          <div className="card-sub">{alerts.length} open signal{alerts.length !== 1 ? "s" : ""}</div>
        </div>
        <button className="btn btn-ghost" onClick={onOpenAlerts} style={{fontSize: 12}}>
          View all <Icon name="arrow" size={13}/>
        </button>
      </div>
      <div style={{display: "flex", flexDirection: "column"}}>
        {top.map(a => (
          <div key={a.id} style={{padding: "14px 18px", borderTop: "1px solid var(--border)"}}>
            <div style={{display: "flex", gap: 10, alignItems: "center", marginBottom: 4}}>
              <span className={"chip chip-" + (a.severity === "critical" ? "crit" : a.severity === "major" ? "warn" : "review")}>
                {a.severity}
              </span>
              <span className="mono tc-3" style={{fontSize: 11}}>{a.code}</span>
              <span className="spacer"/>
              <span className="mono tc-4" style={{fontSize: 11}}>{a.when}</span>
            </div>
            <div style={{fontSize: 13, fontWeight: 500, letterSpacing: "-0.005em"}}>{a.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegTable({ regs, onOpen, onRescan }) {
  const [tab, setTab] = useStateD("all");
  const [scanning, setScanning] = useStateD(false);
  const [scanDone, setScanDone] = useStateD(false);
  const handleRescan = () => {
    if (scanning) return;
    setScanning(true);
    setScanDone(false);
    if (onRescan) onRescan();
    setTimeout(() => { setScanning(false); setScanDone(true); }, 2200);
    setTimeout(() => setScanDone(false), 5500);
  };
  const rescanLabel = scanning
    ? React.createElement(React.Fragment, null, React.createElement(Icon, {name:"sparkle",size:14}), " Scanning…")
    : scanDone
    ? React.createElement(React.Fragment, null, React.createElement(Icon, {name:"check",size:14}), " Scan complete")
    : React.createElement(React.Fragment, null, React.createElement(Icon, {name:"sparkle",size:14}), " Re-scan now");
  const tabs = [
    { id: "all", label: "All" },
    { id: "outdated", label: "Outdated" },
    { id: "under-review", label: "Under review" },
    { id: "up-to-date", label: "Up to date" }
  ];
  const counts = Object.fromEntries(tabs.map(t => [t.id, t.id === "all" ? regs.length : regs.filter(r => r.status === t.id).length]));
  const filtered = tab === "all" ? regs : regs.filter(r => r.status === tab);

  const severityChip = (r) => {
    if (r.status === "up-to-date") return <span className="chip chip-ok"><span className="status-dot ok"/>current</span>;
    if (r.status === "under-review") return <span className="chip chip-review"><span className="status-dot review"/>review</span>;
    if (r.severity === "critical") return <span className="chip chip-crit"><span className="status-dot crit"/>critical</span>;
    if (r.severity === "major") return <span className="chip chip-warn"><span className="status-dot warn"/>major</span>;
    return <span className="chip chip-warn"><span className="status-dot warn"/>minor</span>;
  };

  const gapColor = (g) => g >= 50 ? "var(--crit)" : g >= 20 ? "var(--warn)" : "var(--ok)";

  return (
    <div className="table-wrap">
      <div className="table-head">
        <div className="tabs">
          {tabs.map(t => (
            <button key={t.id} className={"tab " + (tab === t.id ? "active" : "")} onClick={() => setTab(t.id)}>
              {t.label}<span className="tab-count">{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <div style={{display: "flex", gap: 8}}>
          <button className="btn btn-ghost"><Icon name="filter" size={14}/> Filter</button>
          <button className={"btn btn-ghost" + (scanDone ? " btn-ok" : "")} onClick={handleRescan} disabled={scanning}>
            {rescanLabel}
          </button>
        </div>
      </div>
      <table className="reg-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Regulation</th>
            <th>Version</th>
            <th>Gap</th>
            <th>Last checked</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id} onClick={() => onOpen(r)}>
              <td>{severityChip(r)}</td>
              <td>
                <div style={{display: "flex", alignItems: "center", gap: 10}}>
                  <span className="reg-body-tag">{r.body}</span>
                  <span className="reg-code">{r.code}</span>
                </div>
                <div className="reg-title tc-3" style={{marginTop: 3, fontSize: 12}}>{r.title}</div>
              </td>
              <td className="ver-cell">
                {r.version}
                {r.version !== r.latestVersion && (
                  <>
                    <span className="ver-arrow">→</span>
                    <span style={{color: "var(--ink)"}}>{r.latestVersion}</span>
                  </>
                )}
              </td>
              <td>
                <div className="gap">
                  <div className="gap-track">
                    <div className="gap-fill" style={{width: r.gapScore + "%", background: gapColor(r.gapScore)}}/>
                  </div>
                  <div className="gap-val">{r.gapScore > 0 ? r.gapScore : "—"}</div>
                </div>
              </td>
              <td className="mono tc-3" style={{fontSize: 11.5}}>{r.lastChecked}</td>
              <td><Icon name="chevron" size={14}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard({ regs, alerts, onOpen, setRoute, onRescan }) {
  const outdated = regs.filter(r => r.status === "outdated").length;
  const review = regs.filter(r => r.status === "under-review").length;
  const ok = regs.filter(r => r.status === "up-to-date").length;
  const critical = regs.filter(r => r.severity === "critical").length;

  return (
    <>
      <Topbar title="Dashboard" subtitle="Compliance overview"/>
      <div className="page">
        <div className="dash-grid">
          <div className="stat">
            <div className="stat-label">Tracked</div>
            <div className="stat-value">{regs.length}</div>
            <div className="stat-delta">+2 this month</div>
            <div className="stat-spark"><Sparkline points={[6,7,7,9,10,11,12,12]} color="var(--ink-3)"/></div>
          </div>
          <div className="stat">
            <div className="stat-label">Outdated</div>
            <div className="stat-value" style={{color: "var(--crit)"}}>{outdated}</div>
            <div className="stat-delta up">+1 from last week</div>
            <div className="stat-spark"><Sparkline points={[2,2,3,3,2,3,4,4]} color="var(--crit)"/></div>
          </div>
          <div className="stat">
            <div className="stat-label">Critical gaps</div>
            <div className="stat-value" style={{color: critical > 0 ? "var(--crit)" : "var(--ok)"}}>{critical}</div>
            <div className="stat-delta">{critical > 0 ? regs.filter(r => r.severity === "critical").map(r => r.code).join(", ") : "None currently"}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Coverage</div>
            <div className="stat-value">{Math.round(ok / regs.length * 100)}<span style={{fontSize: 18, color: "var(--ink-3)"}}>%</span></div>
            <div className="stat-delta">up-to-date / tracked</div>
          </div>
        </div>

        <div className="radar-wrap">
          <ComplianceRadar regs={regs} onPick={onOpen}/>
          <UpcomingCard alerts={alerts} onOpenAlerts={() => setRoute("alerts")}/>
        </div>

        <RegTable regs={regs} onOpen={onOpen} onRescan={onRescan}/>
      </div>
    </>
  );
}

Object.assign(window, { Dashboard, Sparkline });
