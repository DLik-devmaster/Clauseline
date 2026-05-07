// Upload / onboarding empty-state page
const { useState: useStateU } = React;

function catalogItemToReg(item) {
  const colonIdx = item.code.indexOf(':');
  const baseCode = colonIdx > 0 ? item.code.slice(0, colonIdx) : item.code;
  const version  = colonIdx > 0 ? item.code.slice(colonIdx + 1) : "—";
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return {
    id: "ADDED-" + item.code.replace(/[^a-zA-Z0-9]/g, '-'),
    code: baseCode,
    version,
    latestVersion: version,
    title: item.title,
    body: item.body,
    category: item.category || "General",
    status: "up-to-date",
    severity: null,
    owner: "Unassigned",
    lastChecked: today,
    publishedUpdate: "—",
    affectedDocs: 0,
    gapScore: 0,
    changes: [],
    description: item.title
  };
}

function CustomEntryForm({ onAdd }) {
  const BODIES = ["ISO","IEC","FDA","EU","MDCG","ICH","AAMI","ASTM","GOST","Other"];
  const CATS   = ["QMS","Risk","Software","Electrical Safety","Biocompatibility","Sterilization",
                  "Clinical","IVD","InfoSec","Security","AI/ML","Market Access","Labelling",
                  "Usability","EMC","Classification","Safety","Records","Vigilance","Other"];

  const [form, setForm] = useStateU({ body: "ISO", code: "", version: "", title: "", category: "QMS" });
  const [error, setError] = useStateU("");
  const [done, setDone] = useStateU(false);

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setError(""); };

  const handleAdd = () => {
    if (!form.code.trim()) { setError("Code is required"); return; }
    if (!form.title.trim()) { setError("Title is required"); return; }
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const reg = {
      id: "CUSTOM-" + Date.now(),
      code: form.code.trim(),
      version: form.version.trim() || "—",
      latestVersion: form.version.trim() || "—",
      title: form.title.trim(),
      body: form.body,
      category: form.category,
      status: "up-to-date",
      severity: null,
      owner: "—",
      lastChecked: today,
      publishedUpdate: "—",
      affectedDocs: 0,
      gapScore: 0,
      changes: [],
      description: form.title.trim()
    };
    setDone(true);
    setTimeout(() => onAdd([reg]), 600);
  };

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">Enter manually</div>
          <div className="card-sub">Add a standard or local regulation not in the catalog</div>
        </div>
      </div>
      <div style={{padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14}}>
        {error && (
          <div style={{color: "var(--crit)", fontSize: 12, fontFamily: "var(--font-mono)", padding: "6px 10px", background: "color-mix(in oklab, var(--crit) 10%, transparent)", borderRadius: 6, border: "1px solid color-mix(in oklab, var(--crit) 25%, transparent)"}}>
            {error}
          </div>
        )}
        <div style={{display: "grid", gridTemplateColumns: "110px 1fr 140px", gap: 12}}>
          <div className="field">
            <div className="field-label">Body</div>
            <select className="field-input" style={{appearance: "auto"}} value={form.body} onChange={e => set("body", e.target.value)}>
              {BODIES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="field">
            <div className="field-label">Code / Number</div>
            <input className="field-input" placeholder="e.g. ISO 10993-5 or GOST R 58904" value={form.code} onChange={e => set("code", e.target.value)}/>
          </div>
          <div className="field">
            <div className="field-label">Version / Year</div>
            <input className="field-input" placeholder="e.g. 2009" value={form.version} onChange={e => set("version", e.target.value)}/>
          </div>
        </div>
        <div className="field">
          <div className="field-label">Title</div>
          <input className="field-input" placeholder="Full title of the standard or regulation" value={form.title} onChange={e => set("title", e.target.value)}/>
        </div>
        <div className="field">
          <div className="field-label">Category</div>
          <select className="field-input" style={{appearance: "auto"}} value={form.category} onChange={e => set("category", e.target.value)}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{display: "flex", justifyContent: "flex-end", paddingTop: 4}}>
          <button className={"btn btn-primary" + (done ? " btn-ok" : "")} onClick={handleAdd} disabled={done}>
            {done
              ? <><Icon name="check" size={14}/> Added</>
              : <><Icon name="plus" size={14}/> Add to tracked</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadPage({ onImport }) {
  const [method, setMethod] = useStateU("catalog");
  const [selected, setSelected] = useStateU(new Set());
  const [drag, setDrag] = useStateU(false);
  const [catalogFilter, setCatalogFilter] = useStateU("");

  const toggle = (c) => {
    const n = new Set(selected);
    n.has(c) ? n.delete(c) : n.add(c);
    setSelected(n);
  };

  const lq = catalogFilter.toLowerCase().trim();
  const filteredCatalog = lq
    ? window.CATALOG_DATA.filter(c =>
        c.code.toLowerCase().includes(lq) ||
        c.title.toLowerCase().includes(lq) ||
        c.body.toLowerCase().includes(lq)
      )
    : window.CATALOG_DATA;

  const groups = filteredCatalog.reduce((acc, c) => {
    (acc[c.body] = acc[c.body] || []).push(c);
    return acc;
  }, {});

  const handleImport = () => {
    if (method === "catalog") {
      const newRegs = [...selected]
        .map(code => window.CATALOG_DATA.find(c => c.code === code))
        .filter(Boolean)
        .map(catalogItemToReg);
      onImport(newRegs);
    } else {
      onImport([]);
    }
  };

  const methods = [
    { id: "catalog", icon: "search",  title: "Browse catalog",   sub: "Search our curated library of " + window.CATALOG_DATA.length + "+ standards, FDA guidances and EU regulations." },
    { id: "file",    icon: "upload",  title: "Upload CSV / XLSX",sub: "Map columns for code, version, category. Works with SAP QM and MasterControl exports." },
    { id: "custom",  icon: "pen",     title: "Enter manually",   sub: "Add a standard or local regulation not in the catalog — enter code, title and category by hand." }
  ];

  return (
    <>
      <Topbar title="Catalog" subtitle="Build your regulatory scope"/>
      <div className="page">
        <div className="upload-grid">
          {methods.map(m => (
            <div key={m.id} className={"upload-card " + (method === m.id ? "active" : "")} onClick={() => setMethod(m.id)}>
              <div className="upload-icon"><Icon name={m.icon} size={18}/></div>
              <div className="upload-card-title">{m.title}</div>
              <div className="upload-card-sub">{m.sub}</div>
            </div>
          ))}
        </div>

        {method === "catalog" && (
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Catalog</div>
                <div className="card-sub">{selected.size} selected · {filteredCatalog.length}/{window.CATALOG_DATA.length} shown</div>
              </div>
              <div style={{display:"flex", gap:8, alignItems:"center"}}>
              <div className="search" style={{width: 220}}>
                <Icon name="search" size={13}/>
                <input
                  placeholder="Filter by code or title…"
                  value={catalogFilter}
                  onChange={e => setCatalogFilter(e.target.value)}
                />
                {catalogFilter && (
                  <button className="palette-clear" onClick={() => setCatalogFilter("")} style={{display:"flex",alignItems:"center"}}>
                    <Icon name="x" size={11}/>
                  </button>
                )}
              </div>
                <button className="btn btn-ghost" onClick={() => onImport([])}>Skip</button>
                <button className="btn btn-primary" onClick={handleImport} disabled={selected.size === 0}>
                  <Icon name="check" size={14}/> Import{selected.size > 0 ? ` ${selected.size} selected` : ""}
                </button>
              </div>
            </div>
            <div style={{padding: 18}}>
              <div className="catalog-list">
                {filteredCatalog.length === 0 && (
                  <div style={{padding: "24px", textAlign: "center", color: "var(--ink-3)", fontSize: 13}}>No matches for "{catalogFilter}"</div>
                )}
                {Object.entries(groups).map(([body, items]) => (
                  <React.Fragment key={body}>
                    <div style={{padding: "8px 14px", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", background: "var(--surface-2)", borderBottom: "1px solid var(--border)"}}>
                      {body}
                    </div>
                    {items.map(c => (
                      <div key={c.code} className={"catalog-row " + (selected.has(c.code) ? "selected" : "")} onClick={() => toggle(c.code)}>
                        <div className="catalog-check"><Icon name="check" size={11} stroke={2.5}/></div>
                        <span className="reg-body-tag">{c.body}</span>
                        <span className="reg-code" style={{minWidth: 180}}>{c.code}</span>
                        <span className="tc-3" style={{fontSize: 12.5}}>{c.title}</span>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {method === "file" && (
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Upload file</div>
                <div className="card-sub">CSV, XLSX · up to 50MB</div>
              </div>
              <div style={{display: "flex", gap: 8}}>
                <span className="pill">CSV</span>
                <span className="pill">XLSX</span>
                <span className="pill">SAP QM export</span>
              </div>
            </div>
            <div style={{padding: 18}}>
              <div
                className={"drop-zone " + (drag ? "drag" : "")}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); }}
              >
                <div style={{fontSize: 28, marginBottom: 8, color: "var(--ink-3)"}}><Icon name="upload" size={28}/></div>
                <div>Drop files here or <span style={{textDecoration: "underline", cursor: "pointer"}}>browse</span></div>
                <div style={{fontSize: 12, marginTop: 6, fontFamily: "var(--font-mono)"}}>max 50MB · .csv .xlsx · 3 templates available</div>
              </div>
              <div style={{marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 12.5}}>
                {[
                  { name: "Standard template.csv", sub: "code, version, category, notes" },
                  { name: "SAP QM export.xlsx",    sub: "Q-item master format" },
                  { name: "MasterControl.csv",     sub: "Doc Register mapping" }
                ].map(t => (
                  <div key={t.name} style={{border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", background: "var(--surface)"}}>
                    <div style={{display: "flex", alignItems: "center", gap: 8}}>
                      <Icon name="doc" size={14}/>
                      <span style={{fontWeight: 500, fontSize: 12.5}}>{t.name}</span>
                    </div>
                    <div className="tc-3 mono" style={{fontSize: 11, marginTop: 4}}>{t.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {method === "custom" && (
          <CustomEntryForm onAdd={onImport}/>
        )}
      </div>
    </>
  );
}

Object.assign(window, { UploadPage });
