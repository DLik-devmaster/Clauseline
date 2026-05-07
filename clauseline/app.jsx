// Tweaks panel + persistent defaults
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHue": 85,
  "theme": "light",
  "density": "comfortable"
}/*EDITMODE-END*/;

// Set to true to preview signup flow from scratch
const FORCE_SIGNUP = false;

// When served from Express (localhost:3001) use relative path; otherwise full URL
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? '/api'
  : 'http://localhost:3001/api';

function dbRowToReg(row) {
  return {
    id: row.id,
    code: row.code,
    version: row.version,
    latestVersion: row.latest_version || row.version,
    title: row.title,
    body: row.body,
    category: row.category || 'General',
    status: row.status,
    severity: row.severity || null,
    lastChecked: row.last_checked
      ? new Date(row.last_checked).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—',
    publishedUpdate: row.published_update || '—',
    gapScore: row.gap_score || 0,
    changes: row.changes || [],
    description: row.title,
    affectedDocs: 0,
  };
}

function dbAlertToFrontend(row) {
  const d = new Date(row.created_at);
  const diffDays = Math.floor((Date.now() - d) / 86400000);
  const when = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays}d ago`;
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return {
    id: row.id,
    regId: row.reg_id,
    code: row.code,
    severity: row.severity,
    type: row.type,
    title: row.title,
    body: row.body,
    when,
    date,
    acknowledged: row.acknowledged,
  };
}

function TweaksPanel({ state, setState, onClose }) {
  const setKey = (k, v) => {
    const next = {...state, [k]: v};
    setState(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  return (
    <div className="tweaks">
      <div className="tweaks-head">
        <h4>Tweaks</h4>
        <button className="btn-ghost" onClick={onClose} style={{padding: 2}}><Icon name="x" size={14}/></button>
      </div>
      <div className="tweak-row">
        <span className="tweak-key">Theme</span>
        <div className="seg">
          <button className={state.theme === "light" ? "on" : ""} onClick={() => setKey("theme", "light")}>LIGHT</button>
          <button className={state.theme === "dark" ? "on" : ""} onClick={() => setKey("theme", "dark")}>DARK</button>
        </div>
      </div>
      <div className="tweak-row">
        <span className="tweak-key">Density</span>
        <div className="seg">
          <button className={state.density === "compact" ? "on" : ""} onClick={() => setKey("density", "compact")}>COMPACT</button>
          <button className={state.density === "comfortable" ? "on" : ""} onClick={() => setKey("density", "comfortable")}>COMFY</button>
        </div>
      </div>
      <div className="tweak-row">
        <span className="tweak-key">Accent hue</span>
        <div className="hue-bar" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          setKey("accentHue", Math.round(x * 360));
        }}>
          <div className="hue-indicator" style={{left: `${(state.accentHue / 360) * 100}%`}}/>
        </div>
      </div>
      <div style={{fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)", marginTop: 6, textAlign: "center"}}>
        hue {state.accentHue}° · theme {state.theme}
      </div>
    </div>
  );
}

// ─── App root ───
function App() {
  const [regs, setRegs] = React.useState([]);
  const [alerts, setAlerts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [route, setRoute] = React.useState(() => FORCE_SIGNUP ? "signup" : "dashboard");
  const [currentReg, setCurrentReg] = React.useState(null);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [showEmpty, setShowEmpty] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const [regsRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE}/regulations`),
        fetch(`${API_BASE}/alerts`),
      ]);
      const regsData = await regsRes.json();
      const alertsData = await alertsRes.json();
      const mapped = regsData.map(dbRowToReg);
      setRegs(mapped);
      window.REG_DATA = mapped;
      setAlerts(alertsData.map(dbAlertToFrontend));
      setShowEmpty(mapped.length === 0);
    } catch (err) {
      console.error('[app] failed to load from API:', err.message);
      // Fall back to window globals if API is unavailable
      const fallback = window.REG_DATA || [];
      setRegs(fallback);
      setAlerts(window.ALERTS_DATA || []);
      setShowEmpty(fallback.length === 0);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadData(); }, [loadData]);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
    document.documentElement.style.setProperty("--accent-h", tweaks.accentHue);
    document.documentElement.style.setProperty("--density", tweaks.density === "compact" ? 0.7 : 1);
  }, [tweaks]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setTweaksOpen(true);
      if (d.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const openReg = (r) => { setCurrentReg(r); setRoute("detail"); };
  const openRegById = (id) => {
    const r = regs.find(x => x.id === id);
    if (r) openReg(r);
  };

  React.useEffect(() => { window.REG_DATA = regs; }, [regs]);

  React.useEffect(() => {
    window.__clauseline_openSearch = () => setSearchOpen(true);
    return () => { delete window.__clauseline_openSearch; };
  }, []);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const rescanRegs = async (sources = ['mdcg', 'fda']) => {
    try {
      await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources }),
      });
      // Poll until scan is done, then reload
      const poll = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/scan/status`);
          const { running } = await res.json();
          if (!running) { clearInterval(poll); await loadData(); }
        } catch { clearInterval(poll); }
      }, 2000);
    } catch (err) {
      console.error('[app] scan trigger failed:', err.message);
    }
  };

  const addRegs = async (newRegs) => {
    for (const reg of newRegs) {
      try {
        await fetch(`${API_BASE}/regulations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: reg.id,
            code: reg.code,
            version: reg.version,
            latest_version: reg.latestVersion || reg.version,
            title: reg.title,
            body: reg.body,
            category: reg.category || 'General',
            status: reg.status || 'up-to-date',
            severity: reg.severity || null,
            gap_score: reg.gapScore || 0,
            changes: reg.changes || [],
          }),
        });
      } catch (err) {
        console.error('[app] POST regulation failed:', err.message);
      }
    }
    await loadData();
    setRoute("dashboard");
  };

  if (route === "signup") {
    return <SignupPage onComplete={() => setRoute("dashboard")}/>;
  }

  if (loading) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:12,color:"var(--ink-3)",fontFamily:"var(--font-mono)",fontSize:12}}>
        <div className="status-dot" style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)",animation:"pulse 1.2s ease-in-out infinite"}}/>
        Connecting to server…
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar route={route === "detail" ? "dashboard" : route} setRoute={setRoute} alertCount={alerts.filter(a => a.severity === "critical").length}/>
      <main className="main" data-screen-label={route}>
        {route === "dashboard" && !showEmpty && <Dashboard regs={regs} alerts={alerts} onOpen={openReg} setRoute={setRoute} onRescan={rescanRegs}/>}
        {route === "dashboard" && showEmpty && (
          <>
            <Topbar title="Dashboard"/>
            <div className="page empty">
              <div className="empty-inner">
                <div style={{width: 56, height: 56, borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)", display: "grid", placeItems: "center", margin: "0 auto"}}>
                  <Icon name="dashboard" size={24}/>
                </div>
                <h2>No regulations tracked yet</h2>
                <p>Add the standards and regulations your organization is subject to. Clauseline will watch them and notify you the moment anything changes.</p>
                <button className="btn btn-primary" onClick={() => setRoute("upload")}><Icon name="plus" size={14}/> Open Catalog</button>
              </div>
            </div>
          </>
        )}
        {route === "upload" && <UploadPage onImport={addRegs}/>}
        {route === "alerts" && <AlertsPage alerts={alerts} onOpenReg={openRegById}/>}
        {route === "settings" && <SettingsPage/>}
        {route === "detail" && <DetailPage reg={currentReg} onBack={() => setRoute("dashboard")}/>}
      </main>
      {tweaksOpen && <TweaksPanel state={tweaks} setState={setTweaks} onClose={() => setTweaksOpen(false)}/>}
      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} onOpen={openReg}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
