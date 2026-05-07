// Regulation detail page — version spine, clause map (novel), change log
function DetailPage({ reg, onBack }) {
  if (!reg) return null;

  const severity = reg.severity;
  const statusChip = reg.status === "up-to-date"
    ? <span className="chip chip-ok"><span className="status-dot ok"/>current</span>
    : reg.status === "under-review"
    ? <span className="chip chip-review"><span className="status-dot review"/>under review</span>
    : <span className={"chip chip-" + (severity === "critical" ? "crit" : "warn")}>
        <span className={"status-dot " + (severity === "critical" ? "crit" : "warn")}/>{severity} gap
      </span>;

  // impact summary helpers
  const typeCount = {};
  reg.changes.forEach(c => { typeCount[c.type] = (typeCount[c.type] || 0) + 1; });
  const bySect = {};
  reg.changes.forEach(c => {
    const sect = c.clause.split('.')[0];
    if (!bySect[sect]) bySect[sect] = [];
    bySect[sect].push(c);
  });
  const impactLevels = ["high", "medium", "low"];
  const impactColor = { high: "var(--crit)", medium: "var(--warn)", low: "var(--ink-3)" };

  const upToDate = reg.version === reg.latestVersion;
  const [rerunning, setRerunning] = React.useState(false);
  const [rerunDone, setRerunDone] = React.useState(false);
  const handleRerun = () => {
    setRerunning(true);
    setRerunDone(false);
    setTimeout(() => {
      setRerunning(false);
      setRerunDone(true);
    }, 2200);
    setTimeout(() => setRerunDone(false), 5500);
  };
  const rerunLabel = rerunning
    ? React.createElement(React.Fragment, null, React.createElement(Icon, {name:"sparkle",size:13}), " Running…")
    : rerunDone
    ? React.createElement(React.Fragment, null, React.createElement(Icon, {name:"check",size:13}), " Done")
    : React.createElement(React.Fragment, null, React.createElement(Icon, {name:"sparkle",size:13}), " Re-run");

  return (
    <>
      <Topbar title="Regulations" subtitle=" "
        action={
          <>
            <button className="btn"><Icon name="doc" size={14}/> Export report</button>
            <button className="btn btn-primary"><Icon name="check" size={14}/> Acknowledge</button>
          </>
        }
      />
      <div className="page">
        <button className="btn btn-ghost" onClick={onBack} style={{marginBottom: 4, paddingLeft: 0}}>
          <Icon name="back" size={14}/> Back to dashboard
        </button>

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
          {reg.gapScore > 0 && (
            <div style={{textAlign: "right"}}>
              <div className="stat-label" style={{marginBottom: 4}}>GAP SCORE</div>
              <div style={{fontSize: 44, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: reg.gapScore >= 50 ? "var(--crit)" : "var(--warn)"}}>{reg.gapScore}</div>
              <div className="mono tc-3" style={{fontSize: 11, marginTop: 4}}>of 100</div>
            </div>
          )}
        </div>

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
              <div className="spine-ver">{reg.version}</div>
              <div className="spine-tag mono tc-3">Controlled</div>
              <div style={{position: "absolute", bottom: -22, left: 18, fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--accent-fg)", background: "var(--accent)", padding: "2px 6px", borderRadius: 4}}>YOUR VERSION</div>
            </div>
            {!upToDate && (
              <div className="spine-node latest">
                <span className="spine-dot"/>
                <div className="spine-ver">{reg.latestVersion}</div>
                <div className="spine-tag mono tc-3">
                  {reg.publishedUpdate !== "—" ? reg.publishedUpdate : "Published"}
                </div>
                <div style={{position: "absolute", bottom: -22, left: 18, fontSize: 10, fontFamily: "var(--font-mono)", color: "white", background: "var(--crit)", padding: "2px 6px", borderRadius: 4}}>LATEST</div>
              </div>
            )}
            {upToDate && (
              <div className="spine-node" style={{opacity: 0.5}}>
                <span className="spine-dot"/>
                <div className="spine-ver" style={{color: "var(--ok)"}}>up to date</div>
                <div className="spine-tag mono tc-3">No gap</div>
              </div>
            )}
          </div>
          <div style={{height: 32}}/>
        </div>

        <div className="detail-grid">
          <div>
            <div className="card" style={{marginBottom: 20}}>
              <div className="card-head">
                <div>
                  <div className="card-title">Impact breakdown</div>
                  <div className="card-sub">
                    {reg.changes.length === 0
                      ? "no gaps detected"
                      : `${reg.changes.length} change${reg.changes.length !== 1 ? "s" : ""} · by clause section`}
                  </div>
                </div>
                {reg.changes.length > 0 && (
                  <div style={{display: "flex", gap: 14}}>
                    {impactLevels.map(lvl => {
                      const n = reg.changes.filter(c => c.impact === lvl).length;
                      if (!n) return null;
                      return (
                        <div key={lvl} style={{textAlign: "center"}}>
                          <div style={{fontSize: 22, fontWeight: 600, color: impactColor[lvl], lineHeight: 1}}>{n}</div>
                          <div style={{fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--ink-3)", marginTop: 2, textTransform: "uppercase"}}>{lvl}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div style={{padding: "12px 18px 18px"}}>
                {reg.changes.length === 0 ? (
                  <div style={{textAlign: "center", padding: "28px 0", color: "var(--ink-3)", fontSize: 13}}>
                    <Icon name="check" size={20}/>
                    <div style={{marginTop: 6}}>All clauses up to date</div>
                  </div>
                ) : (
                  <>
                    <div style={{marginBottom: 18}}>
                      <div style={{height: 8, borderRadius: 4, display: "flex", overflow: "hidden", gap: 2}}>
                        {[{key:"added",color:"var(--ok)"},{key:"modified",color:"var(--warn)"},{key:"removed",color:"var(--crit)"}]
                          .filter(t => typeCount[t.key])
                          .map(t => (
                            <div key={t.key} style={{flex: typeCount[t.key], background: t.color, borderRadius: 4, minWidth: 4}}/>
                          ))}
                      </div>
                      <div style={{display: "flex", gap: 16, marginTop: 7}}>
                        {[{key:"added",color:"var(--ok)"},{key:"modified",color:"var(--warn)"},{key:"removed",color:"var(--crit)"}]
                          .filter(t => typeCount[t.key])
                          .map(t => (
                            <span key={t.key} style={{fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4}}>
                              <span style={{width: 8, height: 8, borderRadius: 2, background: t.color, display: "inline-block", flexShrink: 0}}/>
                              {typeCount[t.key]} {t.key}
                            </span>
                          ))}
                      </div>
                    </div>

                    {Object.entries(bySect).map(([sect, items]) => {
                      const topImpact = items.some(i => i.impact === "high") ? "high" : items.some(i => i.impact === "medium") ? "medium" : "low";
                      return (
                        <div key={sect} style={{display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border)"}}>
                          <span style={{width: 8, height: 8, borderRadius: "50%", background: impactColor[topImpact], flexShrink: 0, marginTop: 4}}/>
                          <span style={{fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", minWidth: 38, paddingTop: 1}}>§ {sect}</span>
                          <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 4}}>
                            {items.map((item, j) => (
                              <div key={j} style={{display: "flex", alignItems: "center", gap: 7, fontSize: 12.5}}>
                                <span className={"change-type " + item.type}>{item.type}</span>
                                <span style={{color: "var(--ink-2)"}}>{item.label}</span>
                              </div>
                            ))}
                          </div>
                          <span style={{fontFamily: "var(--font-mono)", fontSize: 10.5, color: impactColor[topImpact], flexShrink: 0, paddingTop: 2}}>{topImpact}</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            <div className="table-wrap">
              <div className="table-head">
                <div>
                  <div className="card-title">Gap assessment · {reg.changes.length} change{reg.changes.length !== 1 ? "s" : ""}</div>
                  <div className="card-sub">synthesized from ISO, IEC, FDA public sources</div>
                </div>
                <button className={"btn btn-ghost" + (rerunDone ? " btn-ok" : "")} style={{fontSize: 12}} onClick={handleRerun} disabled={rerunning}>
                  {rerunLabel}
                </button>
              </div>
              {reg.changes.length === 0 ? (
                <div style={{padding: 40, textAlign: "center", color: "var(--ink-3)"}}>
                  <Icon name="check" size={22}/>
                  <div style={{marginTop: 8, fontSize: 13.5, color: "var(--ink)"}}>No gap detected</div>
                  <div style={{fontSize: 12.5}}>Your controlled version matches the latest published revision.</div>
                </div>
              ) : reg.changes.map((c, i) => (
                <div key={i} className="change-row">
                  <div className="change-clause">§ {c.clause}</div>
                  <div><span className={"change-type " + c.type}>{c.type}</span></div>
                  <div>
                    <div style={{fontWeight: 500, fontSize: 13}}>{c.label}</div>
                    <div className="tc-3" style={{fontSize: 12, marginTop: 2}}>Impact: <span className="mono">{c.impact}</span> · {c.impact === "high" ? "review within 14 days" : c.impact === "medium" ? "review within 30 days" : "monitor"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display: "flex", flexDirection: "column", gap: 16}}>
            <div className="card">
              <div className="card-head"><div className="card-title">Metadata</div></div>
              <div style={{padding: "8px 18px 14px"}}>
                <div className="facts">
                  <div className="fact-row"><span className="fact-key">controlled</span><span className="fact-val">{reg.version}</span></div>
                  <div className="fact-row"><span className="fact-key">latest</span><span className="fact-val" style={{color: reg.version !== reg.latestVersion ? "var(--crit)" : "inherit"}}>{reg.latestVersion}</span></div>
                  <div className="fact-row"><span className="fact-key">body</span><span className="fact-val">{reg.body}</span></div>
                  <div className="fact-row"><span className="fact-key">category</span><span className="fact-val">{reg.category}</span></div>
                  <div className="fact-row"><span className="fact-key">last checked</span><span className="fact-val">{reg.lastChecked}</span></div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head"><div className="card-title">Sources</div></div>
              <div style={{padding: 14, display: "flex", flexDirection: "column", gap: 8}}>
                {[
                  { src: "iso.org/standard", date: "Apr 02" },
                  { src: "accessdata.fda.gov", date: "Mar 26" },
                  { src: "webstore.iec.ch", date: "Feb 11" }
                ].map(s => (
                  <div key={s.src} style={{display: "flex", alignItems: "center", gap: 8, fontSize: 12}}>
                    <Icon name="link" size={12}/>
                    <span className="mono" style={{flex: 1}}>{s.src}</span>
                    <span className="mono tc-3" style={{fontSize: 11}}>{s.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { DetailPage });
