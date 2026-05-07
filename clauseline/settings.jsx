// Settings page
function SettingsPage() {
  const [tab, setTab] = React.useState("scanning");
  const [toggles, setToggles] = React.useState({
    weeklyDigest: true,
    criticalInstant: true,
    majorInstant: false,
    minorInstant: false,
    slack: true,
    teams: false,
    aiSummary: true,
    emailDigest: true
  });
  const t = (k) => setToggles(v => ({...v, [k]: !v[k]}));
  const Toggle = ({k}) => <div className={"toggle " + (toggles[k] ? "on" : "")} onClick={() => t(k)}/>;

  const sections = [
    { id: "scanning", label: "Scanning" },
    { id: "sources", label: "Sources" },
    { id: "notifications", label: "Notifications" },
    { id: "integrations", label: "Integrations" },
    { id: "team", label: "Team & roles" },
    { id: "billing", label: "Billing" }
  ];

  return (
    <>
      <Topbar title="Settings" subtitle="Workspace preferences"/>
      <div className="page" style={{maxWidth: 960}}>
        <div className="settings-grid">
          <div className="settings-nav">
            {sections.map(s => (
              <a key={s.id} className={tab === s.id ? "active" : ""} onClick={() => setTab(s.id)}>{s.label}</a>
            ))}
          </div>

          <div>
            {tab === "scanning" && (
              <>
                <div className="settings-section">
                  <h3>Review cadence</h3>
                  <p className="sub">How often should we re-check your tracked regulations against their publishing bodies?</p>
                  <div className="row">
                    <div>
                      <div className="row-label">Weekly digest</div>
                      <div className="row-sub">Runs every Monday at 06:00 UTC · last ran Apr 13, 2026</div>
                    </div>
                    <Toggle k="weeklyDigest"/>
                  </div>
                  <div className="row">
                    <div>
                      <div className="row-label">Instant alert on critical gaps</div>
                      <div className="row-sub">Notify within 15 minutes of detection</div>
                    </div>
                    <Toggle k="criticalInstant"/>
                  </div>
                  <div className="row">
                    <div>
                      <div className="row-label">Instant alert on major gaps</div>
                      <div className="row-sub">Major = non-breaking but substantive change</div>
                    </div>
                    <Toggle k="majorInstant"/>
                  </div>
                  <div className="row">
                    <div>
                      <div className="row-label">Instant alert on minor gaps</div>
                      <div className="row-sub">Editorial amendments, clarifications</div>
                    </div>
                    <Toggle k="minorInstant"/>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>Gap assessment depth</h3>
                  <p className="sub">Controls how much the auto-review compares your controlled docs against the latest published text.</p>
                  <div className="row">
                    <div>
                      <div className="row-label">AI clause-level synthesis</div>
                      <div className="row-sub">Summarize clause diffs and propose affected sections in your SOPs</div>
                    </div>
                    <Toggle k="aiSummary"/>
                  </div>
                </div>
              </>
            )}

            {tab === "sources" && (
              <div className="settings-section">
                <h3>Data sources</h3>
                <p className="sub">Where Clauseline pulls regulation text from during the weekly scan.</p>
                {[
                  { src: "iso.org", status: "connected", scope: "ISO standards (webstore)" },
                  { src: "webstore.iec.ch", status: "connected", scope: "IEC standards" },
                  { src: "accessdata.fda.gov", status: "connected", scope: "21 CFR · FDA guidances" },
                  { src: "eur-lex.europa.eu", status: "connected", scope: "EU regulations" },
                  { src: "pmda.go.jp", status: "not configured", scope: "Japan PMDA guidances" }
                ].map(s => (
                  <div key={s.src} className="row">
                    <div>
                      <div className="row-label mono">{s.src}</div>
                      <div className="row-sub">{s.scope}</div>
                    </div>
                    <span className={"chip " + (s.status === "connected" ? "chip-ok" : "")}>{s.status}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "notifications" && (
              <div className="settings-section">
                <h3>Notifications</h3>
                <p className="sub">Where should alerts land?</p>
                <div className="row">
                  <div><div className="row-label">Email digest</div><div className="row-sub">chen.m@altuspulm.com + 3 others</div></div>
                  <Toggle k="emailDigest"/>
                </div>
                <div className="row">
                  <div><div className="row-label">Slack</div><div className="row-sub">#quality-regulatory · added Mar 2, 2026</div></div>
                  <Toggle k="slack"/>
                </div>
                <div className="row">
                  <div><div className="row-label">Microsoft Teams</div><div className="row-sub">not connected</div></div>
                  <Toggle k="teams"/>
                </div>
              </div>
            )}

            {tab === "integrations" && (
              <div className="settings-section">
                <h3>Integrations</h3>
                <p className="sub">Link your document register to propagate gaps into review tasks.</p>
                {[
                  { name: "MasterControl", status: "connected", sub: "Bi-directional sync · 247 docs" },
                  { name: "SAP QM", status: "read-only", sub: "Q-item master pulled nightly" },
                  { name: "Greenlight Guru", status: "not connected", sub: "OAuth · requires admin" },
                  { name: "SharePoint", status: "connected", sub: "Controlled docs library" }
                ].map(i => (
                  <div key={i.name} className="row">
                    <div><div className="row-label">{i.name}</div><div className="row-sub">{i.sub}</div></div>
                    <span className={"chip " + (i.status === "connected" ? "chip-ok" : i.status === "read-only" ? "chip-review" : "")}>{i.status}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "team" && (
              <div className="settings-section">
                <h3>Team & roles</h3>
                <p className="sub">Who can view, edit, and acknowledge gaps.</p>
                {[
                  { n: "Mei Chen", r: "Admin · QA Manager", e: "chen.m@altuspulm.com" },
                  { n: "Rafi Okafor", r: "Editor · SW Lead", e: "okafor.r@altuspulm.com" },
                  { n: "Sara Patel", r: "Editor · RA", e: "patel.s@altuspulm.com" },
                  { n: "Luca Rossi", r: "Viewer · EU Ops", e: "rossi.l@altuspulm.com" },
                  { n: "Jamie Brooks", r: "Editor · InfoSec", e: "brooks.j@altuspulm.com" }
                ].map(p => (
                  <div key={p.e} className="row">
                    <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                      <div className="avatar-sm" style={{width: 28, height: 28, fontSize: 11}}>{p.n.split(" ").map(x => x[0]).join("")}</div>
                      <div>
                        <div className="row-label">{p.n}</div>
                        <div className="row-sub mono">{p.e}</div>
                      </div>
                    </div>
                    <span className="pill">{p.r}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "billing" && (
              <div className="settings-section">
                <h3>Billing</h3>
                <p className="sub">Growth plan · billed annually</p>
                <div className="row">
                  <div><div className="row-label">Seats</div><div className="row-sub">5 of 10 in use</div></div>
                  <span className="mono tc-3" style={{fontSize: 12}}>$120 / seat / month</span>
                </div>
                <div className="row">
                  <div><div className="row-label">Tracked regulations</div><div className="row-sub">12 of 50 included</div></div>
                  <span className="mono tc-3" style={{fontSize: 12}}>overage $8 / reg</span>
                </div>
                <div className="row">
                  <div><div className="row-label">Next invoice</div><div className="row-sub">May 01, 2026</div></div>
                  <span className="mono" style={{fontSize: 12}}>$7,200.00</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { SettingsPage });
