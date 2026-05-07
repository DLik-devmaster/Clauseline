// Alerts page — timeline feed
function AlertsPage({ alerts, onOpenReg }) {
  const [filter, setFilter] = React.useState("all");
  const active = alerts.filter(a => !a.acknowledged);
  const filtered = filter === "all" ? active : active.filter(a => a.severity === filter);

  const tabs = [
    { id: "all", label: "All" },
    { id: "critical", label: "Critical" },
    { id: "major", label: "Major" },
    { id: "minor", label: "Minor" }
  ];

  return (
    <>
      <Topbar title="Alerts" subtitle="Regulatory signals feed"
        action={
          <>
            <button className="btn btn-ghost">Mark all read</button>
            <button className="btn"><Icon name="settings" size={14}/> Preferences</button>
          </>
        }
      />
      <div className="page" style={{maxWidth: 880}}>
        <div className="table-head" style={{border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", background: "var(--surface)", marginBottom: 24}}>
          <div className="tabs">
            {tabs.map(t => (
              <button key={t.id} className={"tab " + (filter === t.id ? "active" : "")} onClick={() => setFilter(t.id)}>
                {t.label}
                <span className="tab-count">{t.id === "all" ? active.length : active.filter(a => a.severity === t.id).length}</span>
              </button>
            ))}
          </div>
          <div className="mono tc-3" style={{fontSize: 12}}>Live feed · updates automatically</div>
        </div>

        <div className="alerts-timeline">
          {filtered.map(a => (
            <div key={a.id} className={"alert-node " + a.severity}>
              <div className="alert-card">
                <div className="alert-meta">
                  <span className={"chip chip-" + (a.severity === "critical" ? "crit" : a.severity === "major" ? "warn" : "review")}>
                    {a.severity}
                  </span>
                  <span className="reg-body-tag">{a.code}</span>
                  <span className="pill">{a.type.replace("-", " ")}</span>
                  <span className="spacer"/>
                  <span>{a.when} · {a.date}</span>
                </div>
                <div className="alert-title">{a.title}</div>
                <div className="alert-body">{a.body}</div>
                <div className="alert-actions">
                  <button className="btn" onClick={() => onOpenReg(a.regId)}>View regulation <Icon name="arrow" size={12}/></button>
                  <button className="btn btn-ghost">Acknowledge</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { AlertsPage });
