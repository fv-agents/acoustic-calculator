/* Lumenear — Reusable UI Kit
 *
 * Production-ready, accessible primitives for the calculator app.
 * Stack: React 18 globals + Babel JSX (vendored). No build step.
 * Convention: components register on `window` at the bottom, like ui-components.jsx.
 *
 * Design tokens come from styles.css (:root). Component styles live in kit-styles.css.
 * Every interactive primitive ships with: keyboard support, ARIA wiring,
 * loading states, edge-case guards, and reduced-motion respect.
 */
const { useState, useRef, useEffect, useId, useCallback } = React;

/* ── useReducedMotion — single source of truth for motion preference ── */
function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const get = () => typeof window.matchMedia === 'function' && window.matchMedia(query).matches;
  const [reduced, setReduced] = useState(get);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(query);
    const onChange = e => setReduced(e.matches);
    // Safari <14 only supports addListener
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return reduced;
}

/* ── VisuallyHidden — content for assistive tech only ── */
function VisuallyHidden({ as: Tag = 'span', children, ...rest }) {
  return <Tag className="kit-sr-only" {...rest}>{children}</Tag>;
}

/* ── Spinner — accessible busy indicator ──
 * label is announced (role=status). Pass label="" inside an already-labelled
 * busy region (e.g. a Button) to avoid double announcements.
 */
function Spinner({ size = 18, label = 'Loading', className = '' }) {
  return (
    <span
      className={`kit-spinner ${className}`}
      style={{ width: size, height: size }}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <circle className="kit-spinner-track" cx="12" cy="12" r="9" strokeWidth="2.5" />
        <path className="kit-spinner-head" d="M12 3a9 9 0 0 1 9 9" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {label ? <VisuallyHidden>{label}</VisuallyHidden> : null}
    </span>
  );
}

/* ── Skeleton — loading placeholder ──
 * Decorative by default (aria-hidden). Wrap groups in a region with
 * aria-busy="true" so SR users know content is loading.
 */
function Skeleton({ width = '100%', height = 14, radius = 'var(--radius-sm)', count = 1, className = '' }) {
  const items = Array.from({ length: Math.max(1, count) });
  return (
    <span className={`kit-skeleton-group ${className}`} aria-hidden="true">
      {items.map((_, i) => (
        <span
          key={i}
          className="kit-skeleton"
          style={{
            width,
            height: typeof height === 'number' ? `${height}px` : height,
            borderRadius: radius,
          }}
        />
      ))}
    </span>
  );
}

/* ── Button — variants, sizes, loading, icons ──
 * variant: 'primary' | 'ghost'   size: 'sm' | 'md' | 'lg'
 * When loading: shows a spinner, sets aria-busy, blocks clicks, preserves width.
 */
function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  iconLeft = null,
  iconRight = null,
  className = '',
  children,
  onClick,
  ...rest
}) {
  const sizeCls = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantCls = variant === 'ghost' ? 'btn-ghost' : 'btn-primary';
  const isDisabled = disabled || loading;

  const handleClick = e => {
    if (isDisabled) { e.preventDefault(); return; }
    onClick && onClick(e);
  };

  return (
    <button
      type={type}
      className={`btn ${variantCls} ${sizeCls} kit-btn ${loading ? 'is-loading' : ''} ${className}`}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {loading && <Spinner size={14} label="" className="kit-btn-spinner" />}
      <span className="kit-btn-content">
        {iconLeft && <span className="kit-btn-icon" aria-hidden="true">{iconLeft}</span>}
        {children}
        {iconRight && <span className="kit-btn-icon" aria-hidden="true">{iconRight}</span>}
      </span>
    </button>
  );
}

/* ── NumberStepper — accessible numeric control ──
 * Native-feeling spinbutton: type, arrow-step, clamp, blur-normalise.
 * Handles empty/NaN input gracefully (treats as min on blur).
 * value/onChange are controlled. label is required for a11y.
 */
function NumberStepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  label,
  suffix = '',
  id: idProp,
  size = 'md',
  disabled = false,
}) {
  const autoId = useId();
  const id = idProp || autoId;
  const [raw, setRaw] = useState(String(value));

  // Keep the visible field in sync when value changes from outside.
  useEffect(() => { setRaw(String(value)); }, [value]);

  const clamp = n => Math.min(max, Math.max(min, n));

  const commit = n => {
    const next = clamp(Number.isFinite(n) ? n : min);
    onChange(next);
    setRaw(String(next));
  };

  const handleChange = e => {
    const v = e.target.value;
    setRaw(v);                              // allow transient empty/partial input
    if (v === '' || v === '-') return;
    const n = Number(v);
    if (Number.isFinite(n)) onChange(clamp(n));
  };

  const handleBlur = () => commit(Number(raw));

  const handleKeyDown = e => {
    if (e.key === 'ArrowUp')      { e.preventDefault(); commit(clamp(Number(raw || value) + step)); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); commit(clamp(Number(raw || value) - step)); }
  };

  const atMin = value <= min;
  const atMax = value >= max;
  const sizeCls = size === 'sm' ? 'kit-stepper-sm' : '';

  return (
    <div className={`kit-stepper ${sizeCls} ${disabled ? 'is-disabled' : ''}`}>
      <button
        type="button"
        className="kit-stepper-btn"
        onClick={() => commit(clamp(value - step))}
        disabled={disabled || atMin}
        aria-label={`Decrease ${label}`}
        tabIndex={-1}
      >−</button>
      <input
        id={id}
        className="kit-stepper-input"
        type="number"
        inputMode="numeric"
        role="spinbutton"
        value={raw}
        min={min}
        max={Number.isFinite(max) ? max : undefined}
        step={step}
        disabled={disabled}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-valuetext={suffix ? `${value} ${suffix}` : undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={e => e.target.select()}
      />
      <button
        type="button"
        className="kit-stepper-btn plus"
        onClick={() => commit(clamp(value + step))}
        disabled={disabled || atMax}
        aria-label={`Increase ${label}`}
        tabIndex={-1}
      >+</button>
    </div>
  );
}

/* ── Field — labelled control wrapper ──
 * Wires label, hint and error to the child input via aria-describedby /
 * aria-invalid. Pass a single input/select as children; it is cloned with
 * the right id + ARIA. Falls back gracefully if children is not an element.
 */
function Field({ label, hint, error, required = false, id: idProp, children }) {
  const autoId = useId();
  const id = idProp || autoId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;

  const child = React.isValidElement(children)
    ? React.cloneElement(children, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required || undefined,
      })
    : children;

  return (
    <div className={`field kit-field ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}{required && <span className="kit-required" aria-hidden="true"> *</span>}
        </label>
      )}
      {child}
      {hint && !error && <div id={hintId} className="kit-field-hint">{hint}</div>}
      {error && <div id={errId} className="kit-field-error" role="alert">{error}</div>}
    </div>
  );
}

/* ── Meter — semantic gauge (role=meter) ──
 * Generalises the RT60 bar: a value within [min,max], an optional optimal
 * band, and screen-reader text. valueText overrides the default announcement.
 */
function Meter({
  value,
  min = 0,
  max = 100,
  optimal = null,          // [low, high] in the same unit as value
  markers = [],            // [{ value, color, label }]
  label,
  valueText,
  format = v => v,
  className = '',
}) {
  const span = max - min || 1;
  const pct = v => Math.min(100, Math.max(0, ((v - min) / span) * 100));
  const optLow = optimal ? pct(optimal[0]) : null;
  const optHigh = optimal ? pct(optimal[1]) : null;

  return (
    <div className={`kit-meter ${className}`}>
      {label && <div className="kit-meter-label">{label}</div>}
      <div
        className="kit-meter-track"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={valueText || `${format(value)}`}
        aria-label={label}
      >
        {optimal && (
          <div
            className="kit-meter-zone"
            style={{ left: `${optLow}%`, width: `${optHigh - optLow}%` }}
            aria-hidden="true"
          />
        )}
        {markers.map((m, i) => (
          <div
            key={i}
            className="kit-meter-marker"
            style={{ left: `${pct(m.value)}%`, background: m.color || 'var(--accent)' }}
            title={m.label}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

/* ── LiveRegion — polite/assertive announcements ──
 * Mount once near the app root; update `message` to announce. Always rendered
 * (never conditionally) so SRs pick up changes reliably.
 */
function LiveRegion({ message = '', assertive = false }) {
  return (
    <div
      className="kit-sr-only"
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {message}
    </div>
  );
}

/* ── EmptyState — edge case / zero-data UI ── */
function EmptyState({ icon = null, title, description, action = null, className = '' }) {
  return (
    <div className={`kit-empty ${className}`} role="status">
      {icon && <div className="kit-empty-icon" aria-hidden="true">{icon}</div>}
      {title && <div className="kit-empty-title">{title}</div>}
      {description && <div className="kit-empty-desc">{description}</div>}
      {action && <div className="kit-empty-action">{action}</div>}
    </div>
  );
}

/* ── Export to window (matches ui-components.jsx convention) ── */
Object.assign(window, {
  useReducedMotion, VisuallyHidden, Spinner, Skeleton, Button,
  NumberStepper, Field, Meter, LiveRegion, EmptyState,
});
