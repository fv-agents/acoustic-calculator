/* Lumenear Acoustic Calculator — Main App (3-step wizard) */
const { useState, useEffect, useMemo, useRef } = React;

const STORE_KEY = 'lumenear_calc_v2';

const DEFAULTS = {
  step: 1, pn: '', client: '', l: 8, w: 6, h: 2.8, pe: 0,
  rt: 'Meeting room', fm: 'Carpet tiles (office)', wm: 'Plasterboard + insulation',
  cm: 'Gypsum ceiling (closed)', fu: 'Normal with upholstery', ex: [], qty: {},
};

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    return s ? { ...DEFAULTS, ...s, step: Math.min(s.step || 1, 4) } : DEFAULTS;
  } catch { return DEFAULTS; }
}

function App() {
  const saved = useRef(loadState()).current;
  const [step, setStep] = useState(saved.step || 1);
  const [pn, setPn]       = useState(saved.pn);
  const [client, setClient] = useState(saved.client);
  const [l, setL] = useState(saved.l);
  const [w, setW] = useState(saved.w);
  const [h, setH] = useState(saved.h);
  const [pe, setPe]   = useState(saved.pe);
  const [rt, setRt]   = useState(saved.rt);
  const [fm, setFm]   = useState(saved.fm);
  const [wm, setWm]   = useState(saved.wm);
  const [cm, setCm]   = useState(saved.cm);
  const [fu, setFu]   = useState(saved.fu);
  const [ex, setEx]   = useState(saved.ex || []);
  const [qty, setQty] = useState(saved.qty || {});
  const [fam, setFam]       = useState('All');
  const [search, setSearch] = useState('');

  window._upgradeQty = qty;

  const [ls, setLs] = useState(String(saved.l).replace('.', ','));
  const [ws, setWs] = useState(String(saved.w).replace('.', ','));
  const [hs, setHs] = useState(String(saved.h).replace('.', ','));

  /* Sync current room type to window for RT60Meter optimal zone */
  useEffect(() => { window._currentRt = rt; }, [rt]);

  /* Autosave */
  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ step, pn, client, l, w, h, pe, rt, fm, wm, cm, fu, ex, qty })); } catch {}
  }, [step, pn, client, l, w, h, pe, rt, fm, wm, cm, fu, ex, qty]);

  /* ── Calculation engine ── */
  const calc = useMemo(() => {
    const PP = window.PRODUCTS;
    const vol = l * w * h;
    const fA = l * w, wA = 2 * (l * h) + 2 * (w * h), cA = l * w;
    const fAb  = (window.FLOOR_MATERIALS[fm]  || .02) * fA;
    const wAb  = (window.WALL_MATERIALS[wm]   || .02) * wA;
    const cAb  = (window.CEILING_MATERIALS[cm]|| .02) * cA;
    const fuAb = (window.FURNISHING[fu]        || .005) * fA;
    const exAb = ex.reduce((s, k) => s + (window.EXTRAS[k] || 0), 0) * fA;
    const pAb  = pe * window.PERSON_AEQ;
    const rAb  = fAb + wAb + cAb + fuAb + exAb + pAb;
    let lAb = 0;
    Object.entries(qty).forEach(([n, q]) => {
      const p = PP.find(x => x.n === n); if (p) lAb += q * p.eq;
    });
    const r0  = .161 * vol / Math.max(rAb, .01);
    const r1  = .161 * vol / Math.max(rAb + lAb, .01);
    const imp = r0 > 0 ? (1 - r1 / r0) * 100 : 0;
    const tgt = (window.ROOM_PRESETS[rt] || {}).t || .8;
    const aNeed = Math.max(0, .161 * vol / tgt - (rAb + lAb));
    return { vol, fA, wA, cA, rAb, lAb, r0, r1, imp, tgt, aNeed, parts: { fAb, wAb, cAb, fuAb, exAb, pAb } };
  }, [l, w, h, pe, fm, wm, cm, fu, ex, qty, rt]);

  const PP = window.PRODUCTS;
  const sp = PP.filter(x => qty[x.n] > 0).map(x => ({ ...x, q: qty[x.n] }));
  const hasProducts = sp.length > 0;
  const rating = getRating(calc.r1, calc.tgt);

  /* ── Helpers ── */
  const setPreset = (key) => {
    setRt(key);
    const p = window.ROOM_PRESETS[key];
    if (!p) return;
    if (p.fl) setFm(p.fl); if (p.wl) setWm(p.wl);
    if (p.cl) setCm(p.cl); if (p.fu) setFu(p.fu);
    if (p.ex) setEx([...p.ex]);
  };
  const toggleEx = (k) => setEx(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const setQtyFor = (name, val) => {
    const v = Math.max(0, Math.floor(Number(val) || 0));
    setQty(prev => {
      if (v <= 0) { const { [name]: _, ...rest } = prev; return rest; }
      return { ...prev, [name]: Math.min(v, 999) };
    });
  };

  const parseDim = v => parseFloat(String(v).replace(',', '.')) || 0;
  const clampDim = v => { const n = parseDim(v); return n > 0 ? Math.min(n, 100) : 1; };
  const dimField = (val, setStr, setNum) => ({
    value: val,
    onChange: e => { setStr(e.target.value); const p = parseDim(e.target.value); if (p > 0 && p <= 100) setNum(p); },
    onBlur:   e => { const v = clampDim(e.target.value); setNum(v); setStr(String(v).replace('.', ',')); },
  });

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));
  const goTo = (s) => setStep(s);

  const q = search.trim().toLowerCase();
  const filtered = PP.filter(x => (fam === 'All' || x.f === fam) && (!q || x.n.toLowerCase().includes(q)));

  const printDate = new Date().toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' });

  return (
    <div className="app-shell">

      {/* ── Header ── */}
      <div className="app-header">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src="img/lumenear-logo.png" alt="Lumenear"
            style={{ height:26, filter:'invert(1)', objectFit:'contain' }} />
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost btn-sm"
            onClick={() => { try { localStorage.removeItem(STORE_KEY); } catch {} location.reload(); }}>
            New
          </button>
          <button className="btn btn-primary btn-sm"
            disabled={step < 4 || !pn.trim()}
            style={(step < 4 || !pn.trim()) ? { opacity:.4, cursor:'default' } : {}}
            onClick={() => window.print()}>
            Download PDF
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="progress-bar">
        {[
          { n:1, label:'Space' },
          { n:2, label:'Materials' },
          { n:3, label:'Fixtures' },
          { n:4, label:'Result & Report' },
        ].map((s, i) => (
          <React.Fragment key={s.n}>
            {i > 0 && <div className="progress-connector"></div>}
            <div className={`progress-step ${step === s.n ? 'active' : ''} ${step > s.n ? 'done' : ''}`}
              onClick={() => goTo(s.n)}>
              <span className="step-num">{step > s.n ? '✓' : s.n}</span>
              {s.label}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          STEP 1 — Space & Materials
          ══════════════════════════════════════════ */}
      {step === 1 && (
        <>
        <div className="step-container">
          <div className="step-content">

            <div className="t-section-label">Room</div>
            <h1 className="t-step-title">Define your space</h1>
            <p className="t-step-subtitle">Select the room type, enter dimensions, and set the surface materials.</p>

            {/* Room type */}
            <div style={{ marginTop:24 }}>
              <div className="field-label" style={{ marginBottom:8 }}>Room type</div>
              <div className="preset-grid">
                {Object.keys(window.ROOM_PRESETS).map(k => (
                  <div key={k} className={`preset-card ${rt === k ? 'active' : ''}`}
                    onClick={() => setPreset(k)}>{k}</div>
                ))}
              </div>
            </div>

            {/* Dimensions + IsoRoom */}
            <div style={{ display:'flex', gap:20, alignItems:'flex-start', marginTop:4 }}>
              <div style={{ flex:1 }}>
                <div className="dim-grid">
                  <div className="field">
                    <label className="field-label">Length (m)</label>
                    <input className="field-input" type="text" inputMode="decimal" {...dimField(ls, setLs, setL)} />
                  </div>
                  <div className="field">
                    <label className="field-label">Width (m)</label>
                    <input className="field-input" type="text" inputMode="decimal" {...dimField(ws, setWs, setW)} />
                  </div>
                  <div className="field">
                    <label className="field-label">Height (m)</label>
                    <input className="field-input" type="text" inputMode="decimal" {...dimField(hs, setHs, setH)} />
                  </div>
                </div>
                <div className="field" style={{ marginTop:10 }}>
                  <label className="field-label">Occupancy (persons)</label>
                  <input className="field-input" type="number" min="0" max="500" value={pe}
                    style={{ maxWidth:160 }}
                    onFocus={e => e.target.select()}
                    onChange={e => setPe(Math.min(500, Math.max(0, Math.floor(Number(e.target.value) || 0))))} />
                </div>
                <div className="volume-info">
                  <span className="vol-number"><AnimatedNumber value={calc.vol} decimals={0} /> m³</span> volume
                  {' · '}<span className="vol-number"><AnimatedNumber value={calc.fA} decimals={0} /> m²</span> floor
                  {' · '}<span className="vol-number"><AnimatedNumber value={calc.wA} decimals={0} /> m²</span> walls
                  {pe > 0 && <><br />{pe} person{pe > 1 ? 's' : ''} = <span className="vol-number">{(pe * window.PERSON_AEQ).toFixed(1)} m²</span> additional absorption</>}
                </div>
              </div>
              <div style={{ flexShrink:0, marginTop:4 }}>
                <IsoRoom l={l} w={w} h={h} size={150} />
              </div>
            </div>

            <div className="step-nav">
              <div></div>
              <button className="btn btn-primary" onClick={next}>Materials &amp; Furnishing →</button>
            </div>
          </div>
        </div>
        <RT60MeterV2 rt0={calc.r0} rt1={calc.r1} target={calc.tgt} visible={true} roomType={rt} />
        </>
      )}

      {/* ══════════════════════════════════════════
          STEP 2 — Materials & Furnishing
          ══════════════════════════════════════════ */}
      {step === 2 && (
        <>
        <div className="step-container">
          <div className="step-content">

            <div className="t-section-label">Materials</div>
            <h1 className="t-step-title">Materials & Furnishing</h1>
            <p className="t-step-subtitle">Set the surface materials and existing treatments for an accurate RT60 calculation.</p>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:24 }}>
              {[
                ['Floor',      fm, setFm, window.FLOOR_MATERIALS],
                ['Walls',      wm, setWm, window.WALL_MATERIALS],
                ['Ceiling',    cm, setCm, window.CEILING_MATERIALS],
                ['Furnishing', fu, setFu, window.FURNISHING],
              ].map(([label, val, setter, dict]) => (
                <div className="field" key={label}>
                  <label className="field-label">{label}</label>
                  <select className="field-select" value={val} onChange={e => setter(e.target.value)}>
                    {Object.keys(dict).map(k => <option key={k}>{k}</option>)}
                  </select>
                  {dict[val] !== undefined && <div className="alpha-hint">α = {dict[val]}</div>}
                </div>
              ))}
            </div>

            <div style={{ marginTop:16 }}>
              <label className="field-label">Existing acoustic treatments</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, marginTop:4 }}>
                {Object.keys(window.EXTRAS).map(k => (
                  <label key={k} className="checkbox-row">
                    <input type="checkbox" checked={ex.includes(k)} onChange={() => toggleEx(k)} />
                    <span>{k}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginTop:20, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:16 }}>
              <div className="t-section-label">Room absorption (current)</div>
              <table className="summary-table">
                <tbody>
                  <tr><td className="row-label">Floor</td><td className="row-value">{calc.parts.fAb.toFixed(1)} m²</td></tr>
                  <tr><td className="row-label">Walls</td><td className="row-value">{calc.parts.wAb.toFixed(1)} m²</td></tr>
                  <tr><td className="row-label">Ceiling</td><td className="row-value">{calc.parts.cAb.toFixed(1)} m²</td></tr>
                  <tr><td className="row-label">Furnishing</td><td className="row-value">{calc.parts.fuAb.toFixed(1)} m²</td></tr>
                  {ex.length > 0 && <tr><td className="row-label">Extras</td><td className="row-value">{calc.parts.exAb.toFixed(1)} m²</td></tr>}
                  {pe > 0 && <tr><td className="row-label">Persons ({pe}×)</td><td className="row-value">{calc.parts.pAb.toFixed(1)} m²</td></tr>}
                  <tr className="row-total"><td>Total</td><td className="row-value">{calc.rAb.toFixed(1)} m² Aeq</td></tr>
                </tbody>
              </table>
            </div>

            <div className="step-nav">
              <button className="btn btn-ghost" onClick={prev}>← Back</button>
              <button className="btn btn-primary" onClick={next}>Select fixtures →</button>
            </div>
          </div>
        </div>
        <RT60MeterV2 rt0={calc.r0} rt1={calc.r1} target={calc.tgt} visible={true} roomType={rt} />
        </>
      )}

      {/* ══════════════════════════════════════════
          STEP 3 — Select Fixtures
          ══════════════════════════════════════════ */}
      {step === 3 && (
        <>
        <div className="split-layout">

          {/* Catalog */}
          <div className="split-main">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, gap:12 }}>
              <div>
                <div className="t-section-label">Step 3</div>
                <h2 style={{ fontSize:20, fontWeight:500, color:'var(--text)' }}>Add Lumenear fixtures</h2>
              </div>
              <input className="field-input" type="search" placeholder="Search products…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ maxWidth:200, fontSize:12 }} />
            </div>

            <div className="filter-tabs">
              {window.FAMILIES.map(f => (
                <button key={f} className={`filter-tab ${fam === f ? 'active' : ''}`}
                  onClick={() => setFam(f)}>{f}</button>
              ))}
            </div>

            <div className="product-grid">
              {filtered.map(p => (
                <ProductCard key={p.n} product={p} qty={qty[p.n] || 0}
                  onSetQty={v => setQtyFor(p.n, v)} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:40, color:'var(--text-sec)', fontSize:13 }}>
                No products found for "{search}"{fam !== 'All' ? ` in ${fam}` : ''}.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="split-sidebar">
            <div className="t-section-label">Live result</div>
            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              <div style={{ flex:1, textAlign:'center', background:'var(--bg)', borderRadius:'var(--radius)', padding:12 }}>
                <div style={{ fontSize:9, textTransform:'uppercase', letterSpacing:1, color:'var(--text-sec)', marginBottom:4 }}>Before</div>
                <div className="t-display" style={{ fontSize:28, color:'#94a3b8' }}>
                  <AnimatedNumber value={Math.min(calc.r0, 6)} suffix="s" />
                </div>
              </div>
              <div style={{ flex:1, textAlign:'center', background:'var(--bg)', borderRadius:'var(--radius)', padding:12 }}>
                <div style={{ fontSize:9, textTransform:'uppercase', letterSpacing:1, color:'var(--text-sec)', marginBottom:4 }}>After</div>
                <div className="t-display" style={{ fontSize:28, color:getRatingColor(calc.r1, calc.tgt) }}>
                  <AnimatedNumber value={Math.min(calc.r1, 6)} suffix="s" />
                </div>
              </div>
            </div>

            {hasProducts && calc.imp > 0.5 && (
              <div style={{ textAlign:'center', marginBottom:16, padding:'8px 12px', background:'rgba(107,143,113,.1)', borderRadius:20 }}>
                <span style={{ fontSize:18, fontWeight:700, color:'var(--ok)' }}>−{Math.round(calc.imp)}%</span>
                <span style={{ fontSize:10, color:'var(--ok)', marginLeft:6 }}>RT60 reduction</span>
              </div>
            )}

            <div className="t-section-label" style={{ marginTop:8 }}>Selected fixtures</div>
            {sp.length > 0 ? (
              <div style={{ background:'var(--bg)', borderRadius:'var(--radius)', padding:10, marginBottom:12 }}>
                {sp.map(p => (
                  <div key={p.n} style={{ padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                      <span style={{ color:'var(--text-sec)', fontSize:11, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginRight:6 }}>{p.n}</span>
                      <button onClick={() => setQtyFor(p.n, 0)}
                        style={{ background:'none', border:'none', color:'var(--text-sec)', cursor:'pointer', fontSize:14, lineHeight:1, padding:'0 2px', flexShrink:0 }}
                        title="Remove">×</button>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div className="qty-stepper">
                        <button className="qty-btn" onClick={() => setQtyFor(p.n, p.q - 1)}>−</button>
                        <input className="qty-input" type="number" value={p.q}
                          onChange={e => setQtyFor(p.n, e.target.value)}
                          onFocus={e => e.target.select()} />
                        <button className="qty-btn plus" onClick={() => setQtyFor(p.n, p.q + 1)}>+</button>
                      </div>
                      <span style={{ color:'var(--accent)', fontWeight:600, fontFamily:'var(--font-mono)', fontSize:10 }}>
                        {(p.q * p.eq).toFixed(1)} m²
                      </span>
                    </div>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8, marginTop:4, fontWeight:700, color:'var(--accent)', fontSize:12, borderTop:'2px solid var(--accent)' }}>
                  <span>Total</span>
                  <span><AnimatedNumber value={calc.lAb} suffix=" m²" /></span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'20px 12px', color:'var(--text-sec)', fontSize:12, lineHeight:1.6 }}>
                Select fixtures from the catalog using the + button.
              </div>
            )}

            {calc.aNeed > 0 ? (
              <div className="advice-box warn" style={{ fontSize:11, lineHeight:1.6 }}>
                <b style={{ color:'var(--warn)' }}>~{calc.aNeed.toFixed(1)} m²</b> more absorption needed to reach the {calc.tgt.toFixed(1)}s target.
              </div>
            ) : (
              <div className="advice-box ok" style={{ fontSize:11, lineHeight:1.6 }}>
                <span style={{ color:'var(--ok)', fontWeight:600 }}>✓ Target reached</span> — RT60 of{' '}
                <AnimatedNumber value={calc.r1} suffix="s" /> is within the {calc.tgt.toFixed(1)}s target.
              </div>
            )}

            <div className="sidebar-actions">
              <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={next}>View result →</button>
              <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', marginTop:6 }} onClick={prev}>← Back</button>
            </div>
          </div>
        </div>
        <RT60MeterV2 rt0={calc.r0} rt1={calc.r1} target={calc.tgt} visible={true} roomType={rt} />
        </>
      )}

      {/* ══════════════════════════════════════════
          STEP 4 — Result & Report
          ══════════════════════════════════════════ */}
      {step === 4 && (
        <div className="step-container">
          <div className="step-content" key="s3" style={{ maxWidth:720 }}>

            <PrintHeader projectName={pn} clientName={client} />

            <div className="t-section-label">Result</div>
            <h1 className="t-step-title">Acoustic result</h1>
            <p className="t-step-subtitle">RT60 before and after — with a recommendation.</p>

            {/* Hero numbers */}
            <div className="result-hero-v2">
              <div className="rh2-number">
                <div className="rh2-label">Before</div>
                <div className="rh2-value" style={{ color:'#94a3b8' }}>
                  <AnimatedNumber value={Math.min(calc.r0, 6)} suffix="s" />
                </div>
                <div className="rh2-unit">seconds</div>
              </div>
              <div className="rh2-arrow">→</div>
              <div className="rh2-number">
                <div className="rh2-label">After Lumenear</div>
                <div className="rh2-value" style={{ color:'var(--accent)' }}>
                  <AnimatedNumber value={Math.min(calc.r1, 6)} suffix="s" />
                </div>
                <div className="rh2-unit">seconds</div>
              </div>
              {hasProducts && calc.imp > 0.5 && (
                <div className="rh2-badge">
                  <div className="rh2-badge-pct">−{Math.round(calc.imp)}%</div>
                  <div className="rh2-badge-label">reduction</div>
                </div>
              )}
            </div>

            <MetricCards calc={calc} hasProducts={hasProducts} />
            <DecayCurve rt0={Math.min(calc.r0, 6)} rt1={Math.min(calc.r1, 6)} target={calc.tgt} />
            <ComparisonChart before={Math.min(calc.r0, 6)} after={Math.min(calc.r1, 6)} target={calc.tgt} roomType={rt} />
            <AbsorptionDonut parts={calc.parts} lumenearAb={calc.lAb} />

            {/* Recommendation */}
            <div className={`advice-box ${rating.cls}`} style={{ fontSize:14, lineHeight:1.7 }}>
              <span style={{ color:rating.color, fontWeight:600 }}>
                {rating.cls === 'ok' ? '✓' : '⚠'} {rating.text}.
              </span>{' '}
              The reverberation time {hasProducts
                ? `drops from ${Math.min(calc.r0, 6).toFixed(1)}s to ${Math.min(calc.r1, 6).toFixed(1)}s`
                : `is currently ${Math.min(calc.r0, 6).toFixed(1)}s`}.
              For {rt.toLowerCase()}, {calc.tgt.toFixed(1)}s is the recommended target
              {calc.r1 <= calc.tgt
                ? ' — your specification meets this target.'
                : `. You need approximately ${calc.aNeed.toFixed(1)} m² more absorption to reach it.`}
            </div>

            <PrintPageBreak />
            <PrintHeader projectName={pn} clientName={client} />

            {/* Room details */}
            <div style={{ marginBottom:20, marginTop:20 }}>
              <div className="t-section-label">Room details</div>
              <table className="summary-table">
                <tbody>
                  <tr><td className="row-label">Dimensions</td><td className="row-value">{l} × {w} × {h} m</td></tr>
                  <tr><td className="row-label">Volume</td><td className="row-value">{calc.vol.toFixed(0)} m³</td></tr>
                  <tr><td className="row-label">Room type / target</td><td className="row-value">{rt} — {calc.tgt.toFixed(1)}s</td></tr>
                  <tr><td className="row-label">Floor</td><td className="row-value">{fm}</td></tr>
                  <tr><td className="row-label">Walls</td><td className="row-value">{wm}</td></tr>
                  <tr><td className="row-label">Ceiling</td><td className="row-value">{cm}</td></tr>
                  {pe > 0 && <tr><td className="row-label">Occupancy</td><td className="row-value">{pe} persons</td></tr>}
                  <tr className="row-total"><td>Total room absorption</td><td className="row-value">{calc.rAb.toFixed(1)} m² Aeq</td></tr>
                </tbody>
              </table>
            </div>

            {/* Fixture table */}
            {hasProducts && (
              <div style={{ marginBottom:20 }}>
                <div className="t-section-label">Specified fixtures</div>
                <table className="summary-table">
                  <thead>
                    <tr>
                      <td style={{ color:'var(--text-sec)', fontSize:10, fontWeight:600 }}>Product</td>
                      <td className="row-value" style={{ color:'var(--text-sec)', fontSize:10, fontWeight:600 }}>Qty</td>
                      <td className="row-value" style={{ color:'var(--text-sec)', fontSize:10, fontWeight:600 }}>αw</td>
                      <td className="row-value" style={{ color:'var(--text-sec)', fontSize:10, fontWeight:600 }}>Aeq/unit</td>
                      <td className="row-value" style={{ color:'var(--text-sec)', fontSize:10, fontWeight:600 }}>Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    {sp.map(p => (
                      <tr key={p.n}>
                        <td style={{ color:'var(--text)' }}>{p.n}</td>
                        <td className="row-value">{p.q}×</td>
                        <td className="row-value">{p.aw}</td>
                        <td className="row-value">{p.eq} m²</td>
                        <td className="row-value" style={{ color:'var(--accent)', fontWeight:600 }}>{(p.q * p.eq).toFixed(1)} m²</td>
                      </tr>
                    ))}
                    <tr className="row-total">
                      <td>Total Lumenear absorption</td>
                      <td className="row-value">{sp.reduce((s, p) => s + p.q, 0)} fixtures</td>
                      <td className="row-value"></td>
                      <td className="row-value"></td>
                      <td className="row-value">{calc.lAb.toFixed(1)} m² Aeq</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <PrintFooter />

            {/* Report form — hidden in print */}
            <div className="no-print" style={{ marginTop:32, paddingTop:24, borderTop:'1px solid var(--border)' }}>
              <div className="t-section-label">Report</div>
              <h2 style={{ fontSize:20, fontWeight:300, color:'var(--text)', marginBottom:4 }}>Generate report</h2>
              <p style={{ fontSize:13, color:'var(--text-sec)', marginBottom:20 }}>
                Download a PDF you can share directly with your client.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div className="field">
                  <label className="field-label">Project name *</label>
                  <input className="field-input" value={pn} onChange={e => setPn(e.target.value)}
                    placeholder="e.g. Office renovation — Building A" />
                </div>
                <div className="field">
                  <label className="field-label">Client / organisation</label>
                  <input className="field-input" value={client} onChange={e => setClient(e.target.value)}
                    placeholder="Optional — appears on the report" />
                </div>
              </div>
            </div>

            <div className="step-nav step-nav-solid no-print">
              <button className="btn btn-ghost" onClick={prev}>← Adjust fixtures</button>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary btn-lg"
                  disabled={!pn.trim()}
                  style={!pn.trim() ? { opacity:.4, cursor:'default' } : {}}
                  onClick={() => window.print()}>
                  Download report
                </button>
                <a href="https://lumenear.com/contact" target="_blank" rel="noopener noreferrer"
                  className="btn btn-ghost btn-lg"
                  style={{ textDecoration:'none' }}>
                  Request a quote →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
