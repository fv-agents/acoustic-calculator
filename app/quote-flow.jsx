/* Lumenear — Quote request flow (sales conversion)
 *
 * A real, working in-app conversion flow: low-friction form → validation →
 * submit → success/error. The transport is a single pluggable adapter
 * (`submitQuote`) that is STUBBED for now (mock success) so the flow converts
 * end-to-end in the UI. Wire it to the real destination (email / Supabase /
 * endpoint) later — that is the only seam that needs changing.
 *
 * Load AFTER kit-components.jsx (uses Field, Button, LiveRegion) and BEFORE
 * calculator-app.jsx.
 */
const { useState: _useStateQ } = React;

/* ── Transport adapter — THE SEAM. Replace the body to go live. ── */
async function submitQuote(payload) {
  // Assemble is done by the caller; here we only transport.
  console.info('[submitQuote] lead payload →', payload);
  await new Promise(res => setTimeout(res, 900));          // simulate round-trip
  // To exercise the error path during testing, throw new Error('...') here.
  return { ok: true, id: 'mock-' + Date.now() };
}
window.submitQuote = window.submitQuote || submitQuote;

/* ── Email validation ── */
function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}

/* ── QuoteRequest ──
 * props:
 *   context  — () => ({ project, client, room, results, products })  (called at submit)
 *   onAnnounce(message) — optional, pushes a string to the app live region
 */
function QuoteRequest({ context, onAnnounce }) {
  const [name, setName]       = _useStateQ('');
  const [email, setEmail]     = _useStateQ('');
  const [company, setCompany] = _useStateQ('');
  const [message, setMessage] = _useStateQ('');
  const [touched, setTouched] = _useStateQ(false);
  const [status, setStatus]   = _useStateQ('idle');        // idle | submitting | success | error
  const [errMsg, setErrMsg]   = _useStateQ('');

  const nameErr  = touched && !name.trim() ? 'Please enter your name.' : '';
  const emailErr = touched && !isEmail(email) ? 'Please enter a valid email address.' : '';
  const canSubmit = name.trim() && isEmail(email) && status !== 'submitting';

  const announce = msg => { onAnnounce && onAnnounce(msg); };

  const handleSubmit = async e => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim() || !isEmail(email)) {
      announce('Please correct the highlighted fields.');
      return;
    }
    const ctx = typeof context === 'function' ? context() : (context || {});
    const payload = {
      contact: { name: name.trim(), email: email.trim(), company: company.trim() },
      message: message.trim(),
      ...ctx,
      submittedAt: new Date().toISOString(),
    };
    setStatus('submitting');
    setErrMsg('');
    announce('Sending your request…');
    try {
      const res = await window.submitQuote(payload);
      if (!res || res.ok === false) throw new Error('Submission rejected');
      setStatus('success');
      announce('Request sent. We will be in touch shortly.');
    } catch (err) {
      setStatus('error');
      setErrMsg('Something went wrong sending your request. Please try again, or email info@lumenear.com.');
      announce('Sending failed. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="no-print quote-flow quote-success" role="status">
        <div className="quote-success-mark" aria-hidden="true">✓</div>
        <div>
          <div className="quote-success-title">Request sent</div>
          <div className="quote-success-text">
            Thanks{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''} — your room details and selected fixtures
            were included. We will get back to you shortly. Meanwhile you can download the report above.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="no-print quote-flow" onSubmit={handleSubmit} noValidate aria-labelledby="quote-heading">
      <div className="t-section-label">Next step</div>
      <h2 id="quote-heading" style={{ fontSize:20, fontWeight:300, color:'var(--text)', marginBottom:4 }}>
        Request a tailored quote
      </h2>
      <p style={{ fontSize:13, color:'var(--text-sec)', marginBottom:18, lineHeight:1.6 }}>
        Get a fixture proposal and pricing for this exact result. Your room and selection are sent along automatically.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Field label="Your name" required error={nameErr}>
          <input className="field-input" type="text" autoComplete="name"
            value={name} onChange={e => setName(e.target.value)}
            onBlur={() => setTouched(true)} placeholder="Jane Doe" />
        </Field>
        <Field label="Email" required error={emailErr}>
          <input className="field-input" type="email" autoComplete="email" inputMode="email"
            value={email} onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(true)} placeholder="jane@studio.com" />
        </Field>
      </div>
      <Field label="Company / studio" hint="Optional — helps us tailor the proposal.">
        <input className="field-input" type="text" autoComplete="organization"
          value={company} onChange={e => setCompany(e.target.value)} placeholder="Optional" />
      </Field>
      <Field label="Anything we should know?" hint="Optional — timeline, budget range, specific spaces.">
        <textarea className="field-input" rows={3} style={{ resize:'vertical', minHeight:64 }}
          value={message} onChange={e => setMessage(e.target.value)} placeholder="Optional" />
      </Field>

      {status === 'error' && (
        <div className="kit-field-error" role="alert" style={{ marginBottom:12 }}>{errMsg}</div>
      )}

      <Button type="submit" variant="primary" size="lg" loading={status === 'submitting'} disabled={!canSubmit}>
        Send request
      </Button>
      <p style={{ fontSize:10, color:'var(--text-sec)', marginTop:10 }}>
        We use your details only to respond to this request.
      </p>
    </form>
  );
}

Object.assign(window, { submitQuote, QuoteRequest, isEmail });
