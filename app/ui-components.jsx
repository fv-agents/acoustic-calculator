/* Lumenear — Shared UI Components */
const { useState, useEffect, useRef } = React;

/* ── Animated number that counts up/down ── */
function AnimatedNumber({ value, decimals = 1, suffix = '', prefix = '', className = '' }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(null);
  const prevRef = useRef(value);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;
    if (Math.abs(prev - value) < 0.001) return;
    const start = prev;
    const diff = value - prev;
    const duration = 400;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(start + diff * ease);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    if (ref.current) {
      ref.current.classList.remove('bump');
      void ref.current.offsetWidth;
      ref.current.classList.add('bump');
    }
  }, [value]);

  const formatted = display.toFixed(decimals).replace('.', ',');
  return (
    <span ref={ref} className={`animated-value ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

/* ── Isometric Room Preview ── */
function IsoRoom({ l, w, h, size = 140 }) {
  const mx = Math.max(l, w, h, 1);
  const s = Math.min(size * .35 / mx, size * .08);
  const cx = size / 2, cy = size * .55;
  const cos30 = Math.cos(Math.PI / 6), sin30 = 0.5;
  const proj = (px, py, pz) => [cx + (px - py) * cos30 * s, cy - (px + py) * sin30 * s - pz * s];

  const pts = {
    fbl: proj(0,0,0), fbr: proj(l,0,0), ftr: proj(l,w,0), ftl: proj(0,w,0),
    cbl: proj(0,0,h), cbr: proj(l,0,h), ctr: proj(l,w,h), ctl: proj(0,w,h)
  };
  const poly = arr => arr.map(p => p.join(',')).join(' ');
  const fmt = v => v.toFixed(v % 1 ? 1 : 0);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      <polygon points={poly([pts.fbl, pts.fbr, pts.ftr, pts.ftl])} fill="rgba(200,184,154,.06)" stroke="var(--accent)" strokeWidth="1" opacity=".6" />
      <polygon points={poly([pts.ftl, pts.ftr, pts.ctr, pts.ctl])} fill="rgba(200,184,154,.04)" stroke="var(--accent)" strokeWidth="1" opacity=".4" />
      <polygon points={poly([pts.ftr, pts.fbr, pts.cbr, pts.ctr])} fill="rgba(200,184,154,.08)" stroke="var(--accent)" strokeWidth="1" opacity=".5" />
      <polyline points={poly([pts.ctl, pts.ctr, pts.cbr])} fill="none" stroke="var(--accent)" strokeWidth=".5" opacity=".2" strokeDasharray="3,2" />
      <text x={(pts.fbl[0] + pts.fbr[0]) / 2} y={pts.fbl[1] + 14} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--accent)" fontFamily="var(--font-mono)">{fmt(l)}m</text>
      <text x={(pts.fbr[0] + pts.ftr[0]) / 2 + 8} y={(pts.fbr[1] + pts.ftr[1]) / 2 + 4} textAnchor="start" fontSize="10" fontWeight="600" fill="var(--accent)" fontFamily="var(--font-mono)">{fmt(w)}m</text>
      <text x={pts.fbr[0] + 6} y={(pts.fbr[1] + pts.cbr[1]) / 2 + 3} textAnchor="start" fontSize="10" fontWeight="600" fill="var(--accent)" fontFamily="var(--font-mono)">{fmt(h)}m</text>
    </svg>
  );
}

/* ── RT60 Meter (sticky footer) ── */
function RT60Meter({ rt0, rt1, target, visible = true }) {
  const max = 3.0;
  const pctBefore = Math.min((rt0 / max) * 100, 100);
  const pctAfter  = Math.min((rt1 / max) * 100, 100);
  const norm = window.RT60_NORMS[window._currentRt] || {};
  const optLow  = norm.optimal ? (norm.optimal[0] / max) * 100 : 0;
  const optHigh = norm.optimal ? (norm.optimal[1] / max) * 100 : (target / max) * 100;

  return (
    <div className={`rt60-meter ${visible ? '' : 'hidden'}`}>
      <div className="meter-header">
        <span className="meter-label">Live RT60</span>
        <div className="meter-values">
          <span style={{ color: 'var(--text-sec)' }}>Before: <b style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)' }}><AnimatedNumber value={rt0} suffix="s" /></b></span>
          <span style={{ color: 'var(--text-sec)' }}>After: <b style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}><AnimatedNumber value={rt1} suffix="s" /></b></span>
          <span style={{ color: 'var(--text-sec)' }}>Target: <b style={{ color: 'var(--ok)', fontFamily: 'var(--font-mono)' }}>{target.toFixed(1)}s</b></span>
        </div>
      </div>
      <div className="meter-track">
        <div className="meter-zone" style={{ left: `${optLow}%`, width: `${optHigh - optLow}%` }}></div>
        <div className="meter-marker" style={{ left: `${pctBefore}%`, background: '#94a3b8' }}></div>
        <div className="meter-marker" style={{ left: `${pctAfter}%`, background: 'var(--accent)' }}></div>
      </div>
      <div className="meter-scale">
        {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map(v => (
          <span key={v}>{v.toFixed(1)}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ product, qty, onSetQty }) {
  const isSelected = qty > 0;
  return (
    <div className={`product-card ${isSelected ? 'selected' : ''}`}>
      <div className="product-thumb">
        <img
          src={`img/${product.f}.jpg`}
          alt={product.f}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
      <div className="product-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
          <div className="product-name" title={product.n}>{product.n}</div>
          <span className="product-family">{product.f}</span>
        </div>
        <div className="product-specs">
          <span title="Weighted absorption coefficient (ISO 11654)">αw {product.aw}</span>
          <span title="Acoustic surface area">{product.a} m²</span>
          <span className="product-aeq" title="Equivalent absorption area per fixture (EN-ISO 354)">Aeq {product.eq} m²</span>
        </div>
        <div className="qty-stepper">
          <button className="qty-btn" onClick={() => onSetQty(Math.max(0, qty - 1))}>−</button>
          <input className="qty-input" type="number" min="0" value={qty}
            onFocus={e => e.target.select()}
            onChange={e => onSetQty(Math.max(0, Math.floor(Number(e.target.value) || 0)))} />
          <button className="qty-btn plus" onClick={() => onSetQty(qty + 1)}>+</button>
        </div>
      </div>
    </div>
  );
}

/* ── Bar Chart ── */
function SimpleBarChart({ before, after, target }) {
  const max = Math.max(before, after, target, 0.5) * 1.2;
  const bars = [
    { label: 'Without Lumenear', value: before, color: '#4a4a4a', textColor: '#94a3b8' },
    { label: 'With Lumenear',    value: after,  color: getRatingColor(after, target), textColor: getRatingColor(after, target) },
    { label: 'Target',           value: target, color: 'var(--warn)', textColor: 'var(--warn)', dimBar: true },
  ];

  return (
    <div style={{ padding: '16px 0' }}>
      {bars.map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 130, fontSize: 11, color: 'var(--text-sec)', textAlign: 'right', flexShrink: 0 }}>{b.label}</div>
          <div className="bar-track" style={{ flex: 1, position: 'relative', height: 28, background: 'var(--surface)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              width: `${(b.value / max) * 100}%`, height: '100%', background: b.color,
              borderRadius: 4, transition: 'width .5s cubic-bezier(.4,0,.2,1)', minWidth: 2,
              opacity: b.dimBar ? 0.3 : 1
            }}></div>
          </div>
          <div style={{ width: 50, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: b.textColor, flexShrink: 0 }}>
            <AnimatedNumber value={b.value} suffix="s" />
          </div>
        </div>
      ))}
      <div style={{ marginLeft: 142, display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--ok)' }}>
        <div style={{ width: 12, height: 4, background: 'var(--ok)', borderRadius: 2, opacity: .4 }}></div>
        Optimal range: {(target - 0.2 > 0 ? target - 0.2 : 0).toFixed(1)}–{target.toFixed(1)}s
      </div>
    </div>
  );
}

/* ── Rating helpers ── */
function getRating(rt, target) {
  const r = rt / target;
  if (r <= 1)    return { text: 'Excellent', color: 'var(--ok)',    cls: 'ok' };
  if (r <= 1.15) return { text: 'Good',      color: 'var(--ok)',    cls: 'ok' };
  if (r <= 1.3)  return { text: 'Fair',      color: 'var(--warn)',  cls: 'warn' };
  if (r <= 1.6)  return { text: 'Poor',      color: 'var(--warn)',  cls: 'warn' };
  return { text: 'Needs improvement', color: 'var(--alert)', cls: 'bad' };
}
function getRatingColor(rt, target) {
  const r = rt / target;
  if (r <= 1.15) return 'var(--ok)';
  if (r <= 1.5)  return 'var(--warn)';
  return 'var(--alert)';
}

/* ── Export to window ── */
Object.assign(window, {
  AnimatedNumber, IsoRoom, RT60Meter, ProductCard,
  SimpleBarChart, getRating, getRatingColor,
});
