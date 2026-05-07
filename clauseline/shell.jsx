// App shell: sidebar + topbar + route switcher
const { useState, useEffect, useMemo, useRef } = React;

function Icon({ name, size = 16, stroke = 1.5 }) {
  const s = { width: size, height: size, strokeWidth: stroke, stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>,
    upload: <><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    arrow: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    back: <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
    check: <><path d="M20 6 9 17l-5-5"/></>,
    dot: <><circle cx="12" cy="12" r="3" fill="currentColor"/></>,
    doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    filter: <><path d="M3 6h18"/><path d="M6 12h12"/><path d="M10 18h4"/></>,
    chevron: <><path d="m9 6 6 6-6 6"/></>,
    chevronDown: <><path d="m6 9 6 6 6-6"/></>,
    sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    paste: <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></>,
    x:   <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    pen: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>
  };
  return <svg viewBox="0 0 24 24" {...s}>{paths[name]}</svg>;
}

function useScanStatus() {
  const [scanning, setScanning] = useState(false);
  useEffect(() => {
    const API = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
      ? '/api' : 'http://localhost:3001/api';
    const poll = () => fetch(`${API}/scan/status`).then(r => r.json()).then(d => setScanning(d.running)).catch(() => {});
    poll();
    const id = setInterval(poll, 4000);
    return () => clearInterval(id);
  }, []);
  return scanning;
}

function nextMondayLabel() {
  const d = new Date();
  const dow = d.getDay();
  d.setDate(d.getDate() + (dow === 1 ? 7 : (8 - dow) % 7 || 7));
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function weekFillPct() {
  const dow = new Date().getDay();
  return Math.round((dow === 0 ? 6 : dow - 1) / 7 * 100);
}

function Sidebar({ route, setRoute, alertCount }) {
  const scanning = useScanStatus();
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "upload", label: "Catalog", icon: "upload" },
    { id: "alerts", label: "Alerts", icon: "bell", badge: alertCount },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6z"/>
            <path d="m8 12 3 3 5-6"/>
          </svg>
        </div>
        <div>
          <div className="brand-name">Clauseline</div>
          <div className="brand-sub">Regulatory Intelligence</div>
        </div>
      </div>

      <nav className="nav">
        {items.map(it => (
          <button
            key={it.id}
            className={"nav-item " + (route === it.id ? "active" : "")}
            onClick={() => setRoute(it.id)}>
            <Icon name={it.icon}/>
            <span>{it.label}</span>
            {it.badge ? <span className="nav-badge">{it.badge}</span> : null}
          </button>
        ))}
      </nav>

      <div className="scan-card" style={{margin: "4px 0"}}>
        <div className="scan-row">
          <span className={"scan-dot" + (scanning ? " scan-dot-active" : "")}/>
          <span className="scan-label">{scanning ? "Scanning…" : "Weekly scan"}</span>
        </div>
        <div className="scan-sub">
          {scanning ? "Running now" : `Next run · ${nextMondayLabel()}`}
        </div>
        <div className="scan-bar">
          <div className={scanning ? "scan-bar-fill scan-bar-indeterminate" : "scan-bar-fill"}
            style={scanning ? {} : {width: weekFillPct() + "%"}}/>
        </div>
      </div>

      <div className="sidebar-footer">
        <button
          className={"nav-item " + (route === "settings" ? "active" : "")}
          onClick={() => setRoute("settings")}
          style={{margin: "0 -4px"}}
        >
          <Icon name="settings"/>
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

function Topbar({ title, subtitle, action }) {
  return (
    <header className="topbar">
      <div style={{display:"flex", alignItems:"center", gap:20}}>
        <div>
          <div className="crumb">Clauseline · {title}</div>
          <h1 className="page-title">{subtitle || title}</h1>
        </div>
        {action && <div style={{display:"flex", gap:8}}>{action}</div>}
        <div
          className="search search-trigger"
          role="button"
          tabIndex={0}
          onClick={() => window.__clauseline_openSearch?.()}
          onKeyDown={e => e.key === "Enter" && window.__clauseline_openSearch?.()}
        >
          <Icon name="search" size={14}/>
          <input
            placeholder="Search regulations, clauses…"
            readOnly
            style={{cursor: "pointer", pointerEvents: "none"}}
          />
          <kbd>/</kbd>
        </div>
      </div>
      <div className="topbar-right">
        <div style={{display:"flex", gap:9, alignItems:"center"}}>
          <div className="org-avatar">AP</div>
          <div>
            <div className="org-name">Altus Pulmonary</div>
            <div className="org-role">Quality · Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchPalette({ onClose, onOpen }) {
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef();
  const stateRef = React.useRef({ sel: 0, onClose, onOpen, trackedLen: 0, totalRows: 0 });

  const lq = q.toLowerCase().trim();

  const trackedResults = React.useMemo(() => {
    if (!lq) return window.REG_DATA;
    return window.REG_DATA.filter(r =>
      r.code.toLowerCase().includes(lq) ||
      r.title.toLowerCase().includes(lq) ||
      r.body.toLowerCase().includes(lq) ||
      r.category.toLowerCase().includes(lq) ||
      (r.description || "").toLowerCase().includes(lq)
    );
  }, [lq]);

  const catalogResults = React.useMemo(() => {
    if (!lq) return [];
    const trackedCodes = new Set(window.REG_DATA.map(r => r.code.toLowerCase()));
    return window.CATALOG_DATA.filter(c =>
      !trackedCodes.has(c.code.toLowerCase()) &&
      (c.code.toLowerCase().includes(lq) ||
       c.title.toLowerCase().includes(lq) ||
       (c.category || "").toLowerCase().includes(lq) ||
       c.body.toLowerCase().includes(lq))
    ).slice(0, 25);
  }, [lq]);

  const totalRows = trackedResults.length + catalogResults.length;
  stateRef.current = { sel, onClose, onOpen, trackedResults, totalRows };

  React.useEffect(() => { setSel(0); }, [lq]);

  React.useEffect(() => {
    inputRef.current?.focus();
    const handler = (e) => {
      const st = stateRef.current;
      if (e.key === "Escape") { st.onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, st.totalRows - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
      if (e.key === "Enter") {
        const s = st.sel;
        if (s < st.trackedResults.length) { st.onOpen(st.trackedResults[s]); st.onClose(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const statusChip = (r) => {
    if (r.status === "up-to-date") return <span className="chip chip-ok">current</span>;
    if (r.status === "under-review") return <span className="chip chip-review">review</span>;
    if (r.severity === "critical") return <span className="chip chip-crit">critical</span>;
    if (r.severity === "major") return <span className="chip chip-warn">major</span>;
    return <span className="chip chip-warn">minor</span>;
  };

  let rowIdx = 0;

  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div className="palette" onClick={e => e.stopPropagation()}>

        <div className="palette-search">
          <Icon name="search" size={16}/>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={`Search ${window.CATALOG_DATA.length} standards by code, title, category…`}
          />
          {q && (
            <button className="palette-clear" onClick={() => { setQ(""); inputRef.current?.focus(); }}>
              <Icon name="x" size={13}/>
            </button>
          )}
          <kbd style={{cursor: "pointer"}} onClick={onClose}>ESC</kbd>
        </div>

        <div className="palette-results">
          {lq && totalRows === 0 && (
            <div className="palette-empty">No results for "{q}"</div>
          )}

          {trackedResults.length > 0 && lq && (
            <div className="palette-section">Tracked · {trackedResults.length}</div>
          )}
          {trackedResults.map(r => {
            const idx = rowIdx++;
            return (
              <div key={r.id}
                className={"palette-row" + (sel === idx ? " palette-row-sel" : "")}
                onClick={() => { onOpen(r); onClose(); }}
                onMouseEnter={() => setSel(idx)}>
                <span className="reg-body-tag">{r.body}</span>
                <span className="palette-code">{r.code}</span>
                <span className="palette-title">{r.title}</span>
                <span className="spacer"/>
                {statusChip(r)}
              </div>
            );
          })}

          {catalogResults.length > 0 && (
            <div className="palette-section">
              Standards library{catalogResults.length === 25 ? " · top 25" : ` · ${catalogResults.length}`}
            </div>
          )}
          {catalogResults.map(c => {
            const idx = rowIdx++;
            return (
              <div key={c.code}
                className={"palette-row palette-row-catalog" + (sel === idx ? " palette-row-sel" : "")}
                onMouseEnter={() => setSel(idx)}>
                <span className="reg-body-tag">{c.body}</span>
                <span className="palette-code">{c.code}</span>
                <span className="palette-title">{c.title}</span>
                <span className="spacer"/>
                <span className="chip">not tracked</span>
              </div>
            );
          })}
        </div>

        <div className="palette-footer">
          <span><kbd>↵</kbd> open tracked</span>
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>ESC</kbd> close</span>
          <span className="spacer"/>
          {lq
            ? <span className="palette-count">{totalRows} result{totalRows !== 1 ? "s" : ""}</span>
            : <span className="palette-count">{window.REG_DATA.length} tracked · {window.CATALOG_DATA.length} in library</span>
          }
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { Icon, Sidebar, Topbar, SearchPalette });
