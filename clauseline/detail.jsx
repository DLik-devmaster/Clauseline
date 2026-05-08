// Regulation detail page — version spine, gap assessment, change log
function DetailPage({ reg, onBack, onStatusChange, onAssessmentUpdate }) {
  if (!reg) return null;

  const severity = reg.severity;
  const statusChip = reg.status === "up-to-date"
    ? <span className="chip chip-ok"><span className="status-dot ok"/>current</span>
    : reg.status === "under-review"
    ? <span className="chip chip-review"><span className="status-dot review"/>under review</span>
    : <span className={"chip chip-" + (severity === "critical" ? "crit" : "warn")}>
        <span className={"status-dot " + (severity === "critical" ? "crit" : "warn")}/>{severity} gap
      </span>;

  const upToDate = reg.version === reg.latestVersion;
  const impactColor = { high: "var(--crit)", medium: "var(--warn)", low: "var(--ink-3)" };
  const deadlineDays = { high: 14, medium: 30, low: 90 };
  const deadlineLabel = (impact) => {
    const d = new Date();
    d.setDate(d.getDate() + (deadlineDays[impact] || 30));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Local state for changes (can be replaced by fresh assessment)
  const [changes, setChanges] = React.useState(reg.changes || []);
  const [gapScore, setGapScore] = React.useState(reg.gapScore || 0);

  // Per-item status — persisted to DB
  const STATUS_CYCLE = ["open", "in-progress", "closed"];
  const STATUS_STYLE = { "open": "chip", "in-progress": "chip chip-review", "closed": "chip chip-ok" };
  const [itemStatus, setItemStatus] = React.useState(() =>
    Object.fromEntries((reg.changes || []).map((c, i) => [i, c.status || "open"]))
  );
  const cycleStatus = (i) => {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(itemStatus[i]) + 1) % STATUS_CYCLE.length];
    setItemStatus(prev => ({ ...prev, [i]: next }));
    fetch(`/api/regulations/${reg.id}/changes/${i}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    }).catch(() => {});
    onStatusChange?.(reg.id, i, next);
  };

  const closedCount     = Object.values(itemStatus).filter(s => s === "closed").length;
  const inProgressCount = Object.values(itemStatus).filter(s => s === "in-progress").length;
  const openCount       = changes.length - closedCount - inProgressCount;
  const progressPct     = changes.length > 0 ? Math.round(closedCount / changes.length * 100) : 0;

  const typeCount = {};
  changes.forEach(c => { typeCount[c.type] = (typeCount[c.type] || 0) + 1; });

  // Re-run assessment
  const [rerunning, setRerunning] = React.useState(false);
  const [rerunDone, setRerunDone] = React.useState(false);
  const [rerunError, setRerunError] = React.useState(null);

  const handleRerun = async () => {
    setRerunning(true); setRerunDone(false); setRerunError(null);
    try {
      const res = await fetch(`/api/regulations/${reg.id}/assess`, { method: 'POST' });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || `HTTP ${res.status}`);
      }
      const { changes: newChanges, gap_score: newScore } = await res.json();
      setChanges(newChanges);
      setGapScore(newScore);
      setItemStatus(Object.fromEntries(newChanges.map((c, i) => [i, c.status || "open"])));
      onAssessmentUpdate?.(reg.id, newChanges, newScore);
      setRerunDone(true);
      setTimeout(() => setRerunDone(false), 4000);
    } catch (err) {
      setRerunError(err.message);
      setTimeout(() => setRerunError(null), 6000);
    } finally {
      setRerunning(false);
    }
  };

  const rerunLabel = rerunning
    ? React.createElement(React.Fragment, null, React.createElement(Icon, {name:"sparkle",size:13}), " Generating…")
    : rerunDone
    ? React.createElement(React.Fragment, null, React.createElement(Icon, {name:"check",size:13}), " Done")
    : React.createElement(React.Fragment, null, React.createElement(Icon, {name:"sparkle",size:13}), " Re-run assessment");

  return (
    <>
      <Topbar title="Regulations" subtitle=" "
        action={<button className="btn"><Icon name="doc" size={14}/> Export report</button>}
      />
      <div className="page">
        <button className="btn btn-ghost" onClick={onBack} style={{marginBottom: 4, paddingLeft: 0}}>
          <Icon name="back" size={14}/> Back to dashboard
        </button>

        {/* Header */}
        <div className="detail-head">
          <div>
            <div style={{display: "flex", gap: 10, alignItems: "center"}}>
              <span className="reg-body-tag">{reg.body}</span>
              <span className="reg-code" style={{fontSize: 14}}>{reg.code}</span>
              {statusChip}
              <span className="pill">{reg.category}</span>
            </div>
            <h2 className="detail-title" style={{margin: "12px 0 0"}}>{reg.title}</h2>
            <p style={{color: "var(--ink-3)", fontSize: 13.5, margin: "8px 0 0", maxWidth: 640}}>{reg.description}</p>
            <div className="detail-meta-row">
              <span><Icon name="clock" size={11} stroke={2}/> Last checked {reg.lastChecked}</span>
              <span>Latest update {reg.publishedUpdate}</span>
            </div>
          </div>
          {gapScore > 0 && (
            <div style={{textAlign: "right", flexShrink: 0}}>
              <div className="stat-label" style={{marginBottom: 4}}>GAP SCORE</div>
              <div style={{fontSize: 44, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: gapScore >= 50 ? "var(--crit)" : "var(--warn)"}}>{gapScore}</div>
              <div className="mono tc-3" style={{fontSize: 11, marginTop: 4}}>of 100</div>
            </div>
          )}
        </div>

        {/* Version spine */}
        <div className="card" style={{marginBottom: 20}}>
          <div className="card-head">
            <div>
              <div className="card-title">Version status</div>
              <div className="card-sub">controlled version vs. latest published</div>
            </div>
            <span className="mono tc-3" style={{fontSize: 11.5}}>
              <Icon name="clock" size={11} stroke={2}/> checked {reg.lastChecked}
            </span>
          </div>
          <div className="spine">
            <div className="spine-node current">
              <span className="spine-dot"/>
              <div className="spine-ver">{reg.version !== "—" ? reg.version : reg.code}</div>
              <div className="spine-tag mono tc-3">Controlled</div>
              <div style={{position:"absolute",bottom:-22,left:18,fontSize:10,fontFamily:"var(--font-mono)",color:"var(--accent-fg)",background:"var(--accent)",padding:"2px 6px",borderRadius:4}}>YOUR VERSION</div>
            </div>
            {!upToDate && (
              <div className="spine-node latest">
                <span className="spine-dot"/>
                <div className="spine-ver">{reg.latestVersion}</div>
                <div className="spine-tag mono tc-3">{reg.publishedUpdate !== "—" ? reg.publishedUpdate : "Published"}</div>
                <div style={{position:"absolute",bottom:-22,left:18,fontSize:10,fontFamily:"var(--font-mono)",color:"white",background:"var(--crit)",padding:"2px 6px",borderRadius:4}}>LATEST</div>
              </div>
            )}
            {upToDate && (
              <div className="spine-node" style={{opacity:0.5}}>
                <span className="spine-dot"/>
                <div className="spine-ver" style={{color:"var(--ok)"}}>up to date</div>
                <div className="spine-tag mono tc-3">No gap</div>
              </div>
            )}
          </div>
          <div style={{height:32}}/>
        </div>

        <div className="detail-grid">
          <div>
            {/* Gap assessment */}
            <div className="table-wrap" style={{marginBottom: 20}}>
              <div className="table-head">
                <div>
                  <div className="card-title">Gap assessment · {changes.length} item{changes.length !== 1 ? "s" : ""}</div>
                  <div className="card-sub">
                    {changes.length === 0
                      ? "no gaps detected"
                      : <span style={{display:"flex",gap:14}}>
                          <span style={{color:"var(--ink-3)"}}>●<span style={{marginLeft:4}}>{openCount} open</span></span>
                          {inProgressCount > 0 && <span style={{color:"var(--review)"}}>●<span style={{marginLeft:4}}>{inProgressCount} in progress</span></span>}
                          <span style={{color:"var(--ok)"}}>✓<span style={{marginLeft:4}}>{closedCount} closed</span></span>
                        </span>
                    }
                  </div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {rerunError && (
                    <span style={{fontSize:11,color:"var(--crit)",fontFamily:"var(--font-mono)"}}>
                      {rerunError.slice(0, 60)}
                    </span>
                  )}
                  {changes.length > 0 && (
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:80,height:4,borderRadius:99,background:"var(--surface-3)",overflow:"hidden"}}>
                        <div style={{height:"100%",width:progressPct+"%",background:"var(--ok)",borderRadius:99,transition:"width .3s"}}/>
                      </div>
                      <span className="mono tc-3" style={{fontSize:11}}>{progressPct}%</span>
                    </div>
                  )}
                  <button className={"btn btn-ghost"+(rerunDone?" btn-ok":"")} style={{fontSize:12}} onClick={handleRerun} disabled={rerunning}>
                    {rerunLabel}
                  </button>
                </div>
              </div>

              {rerunning && (
                <div style={{padding:"20px 18px",display:"flex",alignItems:"center",gap:10,color:"var(--ink-3)",fontSize:12.5}}>
                  <div className="scan-dot scan-dot-active" style={{width:8,height:8,borderRadius:"50%",flexShrink:0}}/>
                  Asking Claude AI to analyse {reg.code} {reg.version} → {reg.latestVersion}…
                </div>
              )}

              {!rerunning && changes.length === 0 && (
                <div style={{padding:40,textAlign:"center",color:"var(--ink-3)"}}>
                  <Icon name="check" size={22}/>
                  <div style={{marginTop:8,fontSize:13.5,color:"var(--ink)"}}>No gap detected</div>
                  <div style={{fontSize:12.5}}>Your controlled version matches the latest published revision.</div>
                </div>
              )}

              {!rerunning && changes.map((c, i) => (
                <div key={i} style={{
                  padding:"14px 18px",
                  borderBottom: i < changes.length - 1 ? "1px solid var(--border)" : "none",
                  background: itemStatus[i] === "closed" ? "color-mix(in oklab, var(--ok) 5%, transparent)" : "transparent",
                  transition:"background .2s"
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontFamily:"var(--font-mono)",fontSize:11.5,color:"var(--ink-3)",minWidth:42}}>§ {c.clause}</span>
                    <span className={"change-type " + c.type}>{c.type}</span>
                    <span style={{fontWeight:500,fontSize:13,flex:1}}>{c.label}</span>
                    <span style={{fontFamily:"var(--font-mono)",fontSize:10.5,color:impactColor[c.impact],flexShrink:0}}>{c.impact}</span>
                    <span className="mono tc-3" style={{fontSize:10.5,flexShrink:0}}>{deadlineLabel(c.impact)}</span>
                    <button
                      className={STATUS_STYLE[itemStatus[i]]}
                      onClick={() => cycleStatus(i)}
                      style={{cursor:"pointer",flexShrink:0,fontSize:10.5,padding:"2px 8px"}}
                      title="Click to advance status"
                    >
                      {itemStatus[i]}
                    </button>
                  </div>
                  {c.action && (
                    <div style={{display:"flex",gap:8,alignItems:"flex-start",paddingLeft:50}}>
                      <Icon name="arrow" size={11} stroke={2}/>
                      <span style={{fontSize:12,color:"var(--ink-2)",lineHeight:1.5}}>{c.action}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Source */}
            {changes.length > 0 && (
              <div className="card" style={{marginBottom:20}}>
                <div className="card-head"><div className="card-title">Assessment source</div></div>
                <div style={{padding:"10px 18px 14px",display:"flex",flexDirection:"column",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12.5}}>
                    <Icon name="sparkle" size={13}/>
                    <span style={{flex:1}}>Generated by Claude AI · {reg.body} {reg.code}</span>
                    <span className="chip">AI-generated</span>
                  </div>
                  <div style={{fontSize:11.5,color:"var(--ink-3)",fontFamily:"var(--font-mono)",paddingLeft:21}}>
                    Verify against official {reg.body} source before closing any gaps
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="card">
              <div className="card-head"><div className="card-title">Metadata</div></div>
              <div style={{padding:"8px 18px 14px"}}>
                <div className="facts">
                  <div className="fact-row"><span className="fact-key">controlled</span><span className="fact-val">{reg.version !== "—" ? reg.version : reg.code}</span></div>
                  <div className="fact-row"><span className="fact-key">latest</span><span className="fact-val" style={{color:reg.version!==reg.latestVersion?"var(--crit)":"inherit"}}>{reg.latestVersion}</span></div>
                  <div className="fact-row"><span className="fact-key">body</span><span className="fact-val">{reg.body}</span></div>
                  <div className="fact-row"><span className="fact-key">category</span><span className="fact-val">{reg.category}</span></div>
                  <div className="fact-row"><span className="fact-key">last checked</span><span className="fact-val">{reg.lastChecked}</span></div>
                </div>
              </div>
            </div>

            {changes.length > 0 && (
              <div className="card">
                <div className="card-head"><div className="card-title">Impact summary</div></div>
                <div style={{padding:"12px 18px 16px",display:"flex",flexDirection:"column",gap:10}}>
                  {[{key:"added",label:"New requirements",color:"var(--ok)"},{key:"modified",label:"Modified",color:"var(--warn)"},{key:"removed",label:"Withdrawn",color:"var(--crit)"}]
                    .filter(t => typeCount[t.key])
                    .map(t => (
                      <div key={t.key} style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{width:8,height:8,borderRadius:2,background:t.color,flexShrink:0}}/>
                        <span style={{fontSize:12.5,flex:1}}>{t.label}</span>
                        <span style={{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:500}}>{typeCount[t.key]}</span>
                      </div>
                    ))}
                  <div style={{borderTop:"1px dashed var(--border)",paddingTop:10,display:"flex",justifyContent:"space-between",fontSize:12}}>
                    <span className="tc-3">Estimated effort</span>
                    <span className="mono" style={{fontWeight:500}}>
                      {changes.filter(c=>c.impact==="high").length*5 + changes.filter(c=>c.impact==="medium").length*2 + changes.filter(c=>c.impact==="low").length} hrs
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-head"><div className="card-title">Deadlines</div></div>
              <div style={{padding:"8px 18px 14px"}}>
                <div className="facts">
                  <div className="fact-row"><span className="fact-key mono" style={{color:"var(--crit)"}}>high</span><span className="fact-val">14 days</span></div>
                  <div className="fact-row"><span className="fact-key mono" style={{color:"var(--warn)"}}>medium</span><span className="fact-val">30 days</span></div>
                  <div className="fact-row"><span className="fact-key mono" style={{color:"var(--ink-3)"}}>low</span><span className="fact-val">90 days</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { DetailPage });
