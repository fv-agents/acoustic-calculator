/* Lumenear Acoustic Calculator — UPGRADE: Result Visualizations + RT60 Meter V2
   Drop this file into the project and load AFTER ui-components.jsx.
   Exports: AbsorptionDonut, MetricCards, ComparisonChart, RT60MeterV2 */

/* ═══════════════════════════════════════════════
   ABSORPTION DONUT — SVG donut chart + legend
   ═══════════════════════════════════════════════ */
function AbsorptionDonut({ parts, lumenearAb }) {
  const raw = [
    { label: 'Floor', value: parts.fAb, color: '#5d7e6f' },
    { label: 'Walls', value: parts.wAb, color: '#7e6f5d' },
    { label: 'Ceiling', value: parts.cAb, color: '#5d6f7e' },
    { label: 'Furnishing', value: parts.fuAb, color: '#6f7e5d' },
    { label: 'Extras', value: parts.exAb, color: '#7e5d6f' },
    { label: 'Persons', value: parts.pAb, color: '#6b7b8b' },
    { label: 'Lumenear', value: lumenearAb, color: '#C8B89A' },
  ];
  const segments = raw.filter(s => s.value > 0.01);
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total < 0.01) return null;

  const r = 62, sw = 22;
  const C = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="donut-wrap">
      <div className="t-section-label" style={{ marginBottom: 10 }}>Absorption breakdown</div>
      <div className="donut-layout">
        <svg viewBox="0 0 180 180" className="donut-svg">
          {segments.map((seg, i) => {
            const pct = seg.value / total;
            const dashLen = Math.max(pct * C - 1.5, 0); // 1.5px gap between segments
            const gap = C - dashLen;
            const el = (
              <circle key={i} cx="90" cy="90" r={r}
                fill="none" stroke={seg.color} strokeWidth={sw}
                strokeDasharray={`${dashLen} ${gap}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 90 90)"
                style={{ transition: 'all .6s cubic-bezier(.4,0,.2,1)' }} />
            );
            offset += pct * C;
            return el;
          })}
          <text x="90" y="82" textAnchor="middle" fontSize="26" fontWeight="400"
            fill="#C8B89A" fontFamily="'DM Serif Display', serif">{total.toFixed(1)}</text>
          <text x="90" y="100" textAnchor="middle" fontSize="9" fill="#8A8480"
            fontFamily="'Inter', sans-serif" letterSpacing="1" style={{ textTransform: 'uppercase' }}>m² Aeq total</text>
        </svg>

        <div className="donut-legend">
          {segments.map((seg, i) => {
            const pct = ((seg.value / total) * 100).toFixed(0);
            const isLumenear = seg.label === 'Lumenear';
            return (
              <div key={i} className={`legend-row ${isLumenear ? 'legend-highlight' : ''}`}>
                <span className="legend-dot" style={{ background: seg.color }}></span>
                <span className="legend-name">{seg.label}</span>
                <span className="legend-val">{seg.value.toFixed(1)} m²</span>
                <span className="legend-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   METRIC CARDS — 4 key metrics in a row
   ═══════════════════════════════════════════════ */
function MetricCards({ calc, hasProducts }) {
  const totalAb = calc.rAb + calc.lAb;
  const neededForTarget = 0.161 * calc.vol / Math.max(calc.tgt, 0.1);
  const coverage = neededForTarget > 0 ? (totalAb / neededForTarget) * 100 : 0;
  const coverageColor = coverage >= 100 ? 'var(--ok)' : coverage >= 80 ? 'var(--warn)' : 'var(--alert)';

  const cards = [
    {
      value: hasProducts && calc.imp > 0.5 ? `−${Math.round(calc.imp)}%` : '—',
      label: 'RT60 reduction',
      color: hasProducts && calc.imp > 0.5 ? 'var(--ok)' : 'var(--text-sec)',
    },
    {
      value: calc.lAb.toFixed(1),
      unit: 'm²',
      label: 'Lumenear absorption',
      color: 'var(--accent)',
    },
    {
      value: String(Object.values(window._upgradeQty || {}).reduce((s, v) => s + v, 0) || (hasProducts ? '—' : '0')),
      label: 'Fixtures specified',
      color: 'var(--text)',
    },
    {
      value: coverage > 0 ? `${Math.round(coverage)}%` : '—',
      label: 'Target coverage',
      color: coverageColor,
    },
  ];

  return (
    <div className="metric-cards">
      {cards.map((c, i) => (
        <div key={i} className="metric-card">
          <div className="metric-value" style={{ color: c.color }}>
            {c.value}{c.unit && <span className="metric-unit">{c.unit}</span>}
          </div>
          <div className="metric-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════
   COMPARISON CHART — upgraded horizontal bars
   ═══════════════════════════════════════════════ */
function ComparisonChart({ before, after, target, roomType }) {
  const max = Math.max(before, after, target, 0.5) * 1.25;
  const norm = window.RT60_NORMS && window.RT60_NORMS[roomType];
  const optLow = norm ? norm.optimal[0] : Math.max(target - 0.2, 0.2);
  const optHigh = norm ? norm.optimal[1] : target;
  const zonePctL = (optLow / max) * 100;
  const zonePctR = (optHigh / max) * 100;

  const bars = [
    { label: 'Without Lumenear', value: before, color: '#4a4a4a', textColor: '#94a3b8' },
    { label: 'With Lumenear', value: after, color: getRatingColor(after, target), textColor: getRatingColor(after, target) },
  ];

  // Scale ticks
  const ticks = [];
  const step = max <= 2 ? 0.5 : 1;
  for (let v = 0; v <= max; v += step) ticks.push(v);

  return (
    <div className="comp-chart-wrap">
      <div className="t-section-label" style={{ marginBottom: 10 }}>RT60 comparison</div>
      <div className="comp-chart">
        {/* Green zone overlay */}
        <div className="comp-zone" style={{ left: `calc(130px + ${zonePctL}% * (100% - 130px - 60px) / 100)`, width: `calc((${zonePctR - zonePctL}%) * (100% - 130px - 60px) / 100)` }}></div>

        {bars.map((b, i) => (
          <div key={i} className="comp-row">
            <div className="comp-label">{b.label}</div>
            <div className="comp-track">
              <div className="comp-bar" style={{
                width: `${(b.value / max) * 100}%`,
                background: b.color,
                transition: 'width .6s cubic-bezier(.4,0,.2,1)',
              }}></div>
              {/* Zone indicator inside track */}
              <div className="comp-zone-bg" style={{
                left: `${zonePctL}%`,
                width: `${zonePctR - zonePctL}%`,
              }}></div>
            </div>
            <div className="comp-value" style={{ color: b.textColor }}>
              {b.value.toFixed(1)}s
            </div>
          </div>
        ))}

        {/* Target line */}
        <div className="comp-row comp-target-row">
          <div className="comp-label" style={{ color: 'var(--ok)' }}>Target</div>
          <div className="comp-track">
            <div className="comp-target-line" style={{ left: `${(target / max) * 100}%` }}></div>
            <div className="comp-zone-bg" style={{
              left: `${zonePctL}%`,
              width: `${zonePctR - zonePctL}%`,
            }}></div>
          </div>
          <div className="comp-value" style={{ color: 'var(--ok)' }}>{target.toFixed(1)}s</div>
        </div>

        {/* Scale */}
        <div className="comp-row comp-scale-row">
          <div className="comp-label"></div>
          <div className="comp-track comp-scale-track">
            {ticks.map(v => (
              <span key={v} className="comp-tick" style={{ left: `${(v / max) * 100}%` }}>{v.toFixed(1)}</span>
            ))}
          </div>
          <div className="comp-value"></div>
        </div>
      </div>

      <div className="comp-zone-legend">
        <span className="comp-zone-dot"></span>
        Optimal range: {optLow.toFixed(1)}–{optHigh.toFixed(1)}s
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   RT60 METER V2 — bigger, sound waves, dynamic
   ═══════════════════════════════════════════════ */
function RT60MeterV2({ rt0, rt1, target, visible = true, roomType }) {
  const max = 3.0;
  const pctBefore = Math.min((rt0 / max) * 100, 100);
  const pctAfter = Math.min((rt1 / max) * 100, 100);
  const pctTarget = Math.min((target / max) * 100, 100);

  const norm = window.RT60_NORMS && window.RT60_NORMS[roomType];
  const optLow = norm ? norm.optimal[0] : Math.max(target - 0.2, 0.2);
  const optHigh = norm ? norm.optimal[1] : target;
  const accLim = norm ? norm.acceptable : target * 1.5;
  const greenStart = (optLow / max) * 100;
  const greenEnd = (optHigh / max) * 100;
  const orangeEnd = Math.min((accLim / max) * 100, 100);

  const reduction = rt0 > 0.01 ? Math.round((1 - rt1 / rt0) * 100) : 0;

  // Wave speed: longer RT60 = slower waves (sound lingers)
  const waveDur = Math.max(0.8, Math.min(rt1 * 1.0, 2.5));

  return (
    <div className={`rt60-meter-v2 ${visible ? '' : 'meter-hidden'}`}>
      {/* Sound wave icon */}
      <div className="meter-v2-wave">
        <svg viewBox="0 0 36 36" width="36" height="36">
          <circle cx="18" cy="18" r="2.5" fill="#C8B89A" />
          <circle cx="18" cy="18" r="4" fill="none" stroke="#C8B89A" strokeWidth="1.2"
            opacity="0" style={{ animation: `meterWave ${waveDur}s ease-out infinite` }} />
          <circle cx="18" cy="18" r="4" fill="none" stroke="#C8B89A" strokeWidth="1"
            opacity="0" style={{ animation: `meterWave ${waveDur}s ease-out ${waveDur * 0.33}s infinite` }} />
          <circle cx="18" cy="18" r="4" fill="none" stroke="#C8B89A" strokeWidth=".8"
            opacity="0" style={{ animation: `meterWave ${waveDur}s ease-out ${waveDur * 0.66}s infinite` }} />
        </svg>
      </div>

      {/* Values */}
      <div className="meter-v2-data">
        <div className="meter-v2-vals">
          <span className="mv2-item">
            <span className="mv2-label">Before</span>
            <b className="mv2-num" style={{ color: '#94a3b8' }}>{rt0.toFixed(1)}s</b>
          </span>
          <span className="mv2-arrow">→</span>
          <span className="mv2-item">
            <span className="mv2-label">After</span>
            <b className="mv2-num" style={{ color: '#C8B89A' }}>{rt1.toFixed(1)}s</b>
          </span>
          <span className="mv2-item">
            <span className="mv2-label">Target</span>
            <b className="mv2-num" style={{ color: '#6B8F71' }}>{target.toFixed(1)}s</b>
          </span>
          {reduction > 0 && (
            <span className="mv2-badge">−{reduction}%</span>
          )}
        </div>

        {/* Track */}
        <div className="meter-v2-track">
          {/* Zone backgrounds */}
          <div className="mv2-zone mv2-green" style={{ left: `${greenStart}%`, width: `${greenEnd - greenStart}%` }}></div>
          <div className="mv2-zone mv2-orange" style={{ left: `${greenEnd}%`, width: `${orangeEnd - greenEnd}%` }}></div>
          <div className="mv2-zone mv2-red" style={{ left: `${orangeEnd}%`, right: '0' }}></div>

          {/* Target tick */}
          <div className="mv2-target-tick" style={{ left: `${pctTarget}%` }}></div>

          {/* Before marker */}
          <div className="mv2-marker mv2-marker-before" style={{ left: `${pctBefore}%` }}>
            <span className="mv2-marker-label">{rt0.toFixed(1)}</span>
          </div>

          {/* After marker */}
          <div className="mv2-marker mv2-marker-after" style={{ left: `${pctAfter}%` }}>
            <span className="mv2-marker-label">{rt1.toFixed(1)}</span>
          </div>
        </div>

        {/* Scale */}
        <div className="meter-v2-scale">
          {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map(v => (
            <span key={v}>{v.toFixed(1)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ── Export everything ── */
Object.assign(window, {
  AbsorptionDonut, MetricCards, ComparisonChart, RT60MeterV2,
});
