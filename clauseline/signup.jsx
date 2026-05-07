// New user subscription flow — 5-step wizard
function SignupPage({ onComplete }) {
  const [step, setStep] = React.useState(1);
  const TOTAL = 5;

  const [plan, setPlan] = React.useState(null);
  const [account, setAccount] = React.useState({ name: "", email: "", password: "", confirm: "" });
  const [org, setOrg] = React.useState({ company: "", industry: "", size: "", role: "" });
  const [scope, setScope] = React.useState([]);
  const [errors, setErrors] = React.useState({});

  const frameworks = [
    { id: "iso13485", label: "ISO 13485", sub: "Quality management — medical devices" },
    { id: "eumdr",    label: "EU MDR 2017/745", sub: "EU medical device regulation" },
    { id: "eivdr",    label: "EU IVDR 2017/746", sub: "In vitro diagnostic devices" },
    { id: "cfr820",   label: "21 CFR Part 820", sub: "FDA Quality System Regulation" },
    { id: "iso14971", label: "ISO 14971", sub: "Risk management" },
    { id: "iec62304", label: "IEC 62304", sub: "Medical device software lifecycle" },
    { id: "iec60601", label: "IEC 60601-1", sub: "Electrical medical equipment safety" },
    { id: "ich_q10",  label: "ICH Q10", sub: "Pharmaceutical quality system" },
    { id: "ich_q11",  label: "ICH Q11", sub: "Development and manufacture of drug substances" },
    { id: "eu_gmp",   label: "EU GMP Annex 11", sub: "Computerised systems" },
  ];

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "Free",
      period: "",
      features: ["Up to 5 tracked regulations", "Weekly scan", "Email alerts", "1 seat"],
      highlight: false,
    },
    {
      id: "growth",
      name: "Growth",
      price: "$120",
      period: "/ seat / month",
      features: ["Up to 50 tracked regulations", "Daily scan", "Slack & Teams alerts", "Up to 10 seats", "AI clause synthesis", "MasterControl / SAP integrations"],
      highlight: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited regulations", "Real-time scan", "Custom integrations", "Unlimited seats", "Dedicated CSM", "SLA & audit logs"],
      highlight: false,
    },
  ];

  const industries = [
    "Medical devices", "Pharmaceuticals / Biotech", "In vitro diagnostics",
    "Software as a Medical Device", "Contract manufacturing", "Other"
  ];
  const sizes = ["1–10", "11–50", "51–200", "201–1 000", "1 000+"];
  const roles = ["Quality Manager", "Regulatory Affairs", "Software Lead", "Compliance Officer", "CTO / VP Engineering", "Other"];

  function validateAccount() {
    const e = {};
    if (!account.name.trim()) e.name = "Required";
    if (!account.email.includes("@")) e.email = "Enter a valid work email";
    if (account.password.length < 8) e.password = "At least 8 characters";
    if (account.password !== account.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateOrg() {
    const e = {};
    if (!org.company.trim()) e.company = "Required";
    if (!org.industry) e.industry = "Required";
    if (!org.size) e.size = "Required";
    if (!org.role) e.role = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 1 && !plan) { setErrors({ plan: "Select a plan to continue" }); return; }
    if (step === 2 && !validateAccount()) return;
    if (step === 3 && !validateOrg()) return;
    if (step === 4 && scope.length === 0) { setErrors({ scope: "Select at least one framework" }); return; }
    setErrors({});
    setStep(s => s + 1);
  }

  function toggleScope(id) {
    setScope(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const STEP_LABELS = ["Plan", "Account", "Organisation", "Scope", "Done"];

  return (
    <div className="signup-shell">
      {/* Header */}
      <div className="signup-header">
        <div className="brand" style={{ gap: 10, alignItems: "center", display: "flex" }}>
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
        {step < TOTAL && (
          <div className="signup-steps">
            {STEP_LABELS.slice(0, TOTAL - 1).map((label, i) => {
              const n = i + 1;
              const done = n < step;
              const active = n === step;
              return (
                <React.Fragment key={n}>
                  <div className={"signup-step " + (done ? "done" : active ? "active" : "")}>
                    <div className="step-circle">
                      {done ? <Icon name="check" size={12} stroke={2.5}/> : n}
                    </div>
                    <span>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 2 && <div className={"step-line " + (done ? "done" : "")}/>}
                </React.Fragment>
              );
            })}
          </div>
        )}
        <div style={{ width: 200 }}/>
      </div>

      {/* Body */}
      <div className="signup-body">
        <div className="signup-card">

          {/* ── Step 1: Plan ── */}
          {step === 1 && (
            <>
              <div className="signup-card-head">
                <div className="signup-eyebrow">Step 1 of 4</div>
                <h2 className="signup-title">Choose your plan</h2>
                <p className="signup-sub">You can upgrade or downgrade at any time. All plans include a 14-day free trial.</p>
              </div>
              <div className="plan-grid">
                {plans.map(p => (
                  <button
                    key={p.id}
                    className={"plan-card " + (plan === p.id ? "selected" : "") + (p.highlight ? " highlighted" : "")}
                    onClick={() => { setPlan(p.id); setErrors({}); }}
                  >
                    {p.highlight && <div className="plan-badge">Most popular</div>}
                    <div className="plan-name">{p.name}</div>
                    <div className="plan-price">
                      <span className="plan-amount">{p.price}</span>
                      {p.period && <span className="plan-period">{p.period}</span>}
                    </div>
                    <ul className="plan-features">
                      {p.features.map(f => (
                        <li key={f}>
                          <Icon name="check" size={13} stroke={2}/>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className={"plan-sel-indicator " + (plan === p.id ? "on" : "")}/>
                  </button>
                ))}
              </div>
              {errors.plan && <div className="field-error" style={{ marginTop: 8 }}>{errors.plan}</div>}
            </>
          )}

          {/* ── Step 2: Account ── */}
          {step === 2 && (
            <>
              <div className="signup-card-head">
                <div className="signup-eyebrow">Step 2 of 4</div>
                <h2 className="signup-title">Create your account</h2>
                <p className="signup-sub">Use your work email — it will be used for compliance alerts and notifications.</p>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label className="field-label">Full name</label>
                  <input
                    className={"field-input " + (errors.name ? "error" : "")}
                    placeholder="Mei Chen"
                    value={account.name}
                    onChange={e => setAccount(a => ({...a, name: e.target.value}))}
                  />
                  {errors.name && <div className="field-error">{errors.name}</div>}
                </div>
                <div className="field">
                  <label className="field-label">Work email</label>
                  <input
                    className={"field-input " + (errors.email ? "error" : "")}
                    type="email"
                    placeholder="you@company.com"
                    value={account.email}
                    onChange={e => setAccount(a => ({...a, email: e.target.value}))}
                  />
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>
                <div className="field">
                  <label className="field-label">Password</label>
                  <input
                    className={"field-input " + (errors.password ? "error" : "")}
                    type="password"
                    placeholder="Min. 8 characters"
                    value={account.password}
                    onChange={e => setAccount(a => ({...a, password: e.target.value}))}
                  />
                  {errors.password && <div className="field-error">{errors.password}</div>}
                </div>
                <div className="field">
                  <label className="field-label">Confirm password</label>
                  <input
                    className={"field-input " + (errors.confirm ? "error" : "")}
                    type="password"
                    placeholder="Repeat password"
                    value={account.confirm}
                    onChange={e => setAccount(a => ({...a, confirm: e.target.value}))}
                  />
                  {errors.confirm && <div className="field-error">{errors.confirm}</div>}
                </div>
              </div>
              <div className="field-hint" style={{ marginTop: 16 }}>
                By continuing you agree to Clauseline's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </div>
            </>
          )}

          {/* ── Step 3: Organisation ── */}
          {step === 3 && (
            <>
              <div className="signup-card-head">
                <div className="signup-eyebrow">Step 3 of 4</div>
                <h2 className="signup-title">Tell us about your organisation</h2>
                <p className="signup-sub">We use this to pre-configure relevant regulatory frameworks and set up your workspace.</p>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label className="field-label">Company name</label>
                  <input
                    className={"field-input " + (errors.company ? "error" : "")}
                    placeholder="Altus Pulmonary Inc."
                    value={org.company}
                    onChange={e => setOrg(o => ({...o, company: e.target.value}))}
                  />
                  {errors.company && <div className="field-error">{errors.company}</div>}
                </div>
                <div className="field">
                  <label className="field-label">Industry</label>
                  <select
                    className={"field-input " + (errors.industry ? "error" : "")}
                    value={org.industry}
                    onChange={e => setOrg(o => ({...o, industry: e.target.value}))}
                  >
                    <option value="">Select industry…</option>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  {errors.industry && <div className="field-error">{errors.industry}</div>}
                </div>
                <div className="field">
                  <label className="field-label">Team size</label>
                  <div className="seg-field">
                    {sizes.map(s => (
                      <button
                        key={s}
                        className={"seg-btn " + (org.size === s ? "on" : "")}
                        onClick={() => setOrg(o => ({...o, size: s}))}
                      >{s}</button>
                    ))}
                  </div>
                  {errors.size && <div className="field-error">{errors.size}</div>}
                </div>
                <div className="field">
                  <label className="field-label">Your role</label>
                  <div className="seg-field wrap">
                    {roles.map(r => (
                      <button
                        key={r}
                        className={"seg-btn " + (org.role === r ? "on" : "")}
                        onClick={() => setOrg(o => ({...o, role: r}))}
                      >{r}</button>
                    ))}
                  </div>
                  {errors.role && <div className="field-error">{errors.role}</div>}
                </div>
              </div>
            </>
          )}

          {/* ── Step 4: Scope ── */}
          {step === 4 && (
            <>
              <div className="signup-card-head">
                <div className="signup-eyebrow">Step 4 of 4</div>
                <h2 className="signup-title">Select your compliance scope</h2>
                <p className="signup-sub">Choose every regulation your organisation must track. You can add or remove frameworks later.</p>
              </div>
              <div className="framework-grid">
                {frameworks.map(f => {
                  const on = scope.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      className={"framework-card " + (on ? "selected" : "")}
                      onClick={() => { toggleScope(f.id); setErrors({}); }}
                    >
                      <div className="framework-check">
                        {on && <Icon name="check" size={11} stroke={2.5}/>}
                      </div>
                      <div>
                        <div className="framework-name">{f.label}</div>
                        <div className="framework-sub">{f.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.scope && <div className="field-error" style={{ marginTop: 8 }}>{errors.scope}</div>}
              {scope.length > 0 && (
                <div className="scope-summary">
                  <Icon name="check" size={13} stroke={2}/> {scope.length} framework{scope.length > 1 ? "s" : ""} selected
                </div>
              )}
            </>
          )}

          {/* ── Step 5: Confirmation ── */}
          {step === 5 && (
            <div className="confirm-screen">
              <div className="confirm-icon">
                <Icon name="check" size={28} stroke={2}/>
              </div>
              <h2 className="signup-title" style={{ textAlign: "center" }}>You're all set</h2>
              <p className="signup-sub" style={{ textAlign: "center" }}>
                Your Clauseline workspace has been created. Here's a summary of what we've configured.
              </p>
              <div className="confirm-summary">
                <div className="confirm-row">
                  <span className="confirm-key">Plan</span>
                  <span className="confirm-val">{plans.find(p => p.id === plan)?.name}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-key">Account</span>
                  <span className="confirm-val">{account.email}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-key">Organisation</span>
                  <span className="confirm-val">{org.company}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-key">Industry</span>
                  <span className="confirm-val">{org.industry}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-key">Frameworks</span>
                  <span className="confirm-val">
                    {scope.map(id => frameworks.find(f => f.id === id)?.label).join(", ")}
                  </span>
                </div>
              </div>
              <div className="confirm-next">
                <div className="confirm-hint">
                  <Icon name="clock" size={13}/>
                  First scan scheduled for <strong>Monday, 06:00 UTC</strong>. You'll receive an email when results are ready.
                </div>
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 16px", fontSize: 14 }} onClick={onComplete}>
                  Enter Clauseline <Icon name="arrow" size={15}/>
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < TOTAL && (
            <div className="signup-nav">
              {step > 1
                ? <button className="btn" onClick={() => { setErrors({}); setStep(s => s - 1); }}>
                    <Icon name="back" size={14}/> Back
                  </button>
                : <div/>
              }
              <button className="btn btn-primary" onClick={next}>
                {step === 4 ? "Create workspace" : "Continue"} <Icon name="arrow" size={14}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SignupPage });
