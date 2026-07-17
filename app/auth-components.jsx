/* Lumenear — Auth gate: login / forgot password / request access / set new password
 * Replaces the temporary Basic Auth Edge Function (2026-07-17) with a branded login
 * screen on Supabase Auth. Load AFTER kit-components.jsx and auth.js, BEFORE calculator-app.jsx.
 */
const { useState: _useStateA, useEffect: _useEffectA } = React;

function parseHashParams() {
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
  const params = new URLSearchParams(hash);
  return Object.fromEntries(params.entries());
}

/* ── Request access — Netlify Forms (same pattern as quote-flow.jsx) ── */
async function submitAccessRequest(payload) {
  const body = new URLSearchParams({
    'form-name': 'access-request',
    name: payload.name || '', email: payload.email || '',
    company: payload.company || '', message: payload.message || '',
  });
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error('Form submission failed (' + res.status + ')');
}

function AuthShell({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <img src="img/lumenear-logo.png" alt="Lumenear" className="auth-logo" />
        {children}
      </div>
    </div>
  );
}

function LoginForm({ onSuccess, onForgot, onRequest }) {
  const [email, setEmail]       = _useStateA('');
  const [password, setPassword] = _useStateA('');
  const [remember, setRemember] = _useStateA(true);
  const [touched, setTouched]   = _useStateA(false);
  const [status, setStatus]     = _useStateA('idle'); // idle | submitting | error
  const [errMsg, setErrMsg]     = _useStateA('');

  const emailErr = touched && !isEmail(email) ? 'Please enter a valid email address.' : '';
  const passErr  = touched && !password ? 'Please enter your password.' : '';
  const canSubmit = isEmail(email) && password && status !== 'submitting';

  const handleSubmit = async e => {
    e.preventDefault();
    setTouched(true);
    if (!isEmail(email) || !password) return;
    setStatus('submitting'); setErrMsg('');
    try {
      const session = await window.LumenearAuth.signIn(email.trim(), password, remember);
      window.LumenearAuth.logCalculatorLogin(email.trim());
      onSuccess(session);
    } catch (err) {
      setStatus('error');
      setErrMsg(/invalid/i.test(err.message || '') ? 'Incorrect email or password.' : (err.message || 'Login failed.'));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <h1 className="auth-title">Log in</h1>
      <p className="auth-sub">Access to the Lumenear acoustic calculator.</p>

      <Field label="Email address" required error={emailErr}>
        <input className="field-input" type="email" autoComplete="email" inputMode="email"
          value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(true)}
          placeholder="name@company.com" autoFocus />
      </Field>
      <Field label="Password" required error={passErr}>
        <input className="field-input" type="password" autoComplete="current-password"
          value={password} onChange={e => setPassword(e.target.value)} onBlur={() => setTouched(true)}
          placeholder="••••••••" />
      </Field>

      <label className="auth-remember">
        <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
        Remember me on this device
      </label>

      {status === 'error' && <div className="kit-field-error" role="alert">{errMsg}</div>}

      <Button type="submit" variant="primary" size="lg" loading={status === 'submitting'} disabled={!canSubmit} className="auth-submit">
        Log in
      </Button>

      <div className="auth-links">
        <button type="button" className="auth-link" onClick={onForgot}>Forgot password?</button>
        <button type="button" className="auth-link" onClick={onRequest}>Request access</button>
      </div>
    </form>
  );
}

function ForgotPasswordForm({ onBack }) {
  const [email, setEmail]     = _useStateA('');
  const [touched, setTouched] = _useStateA(false);
  const [status, setStatus]   = _useStateA('idle'); // idle | submitting | sent | error
  const [errMsg, setErrMsg]   = _useStateA('');

  const emailErr = touched && !isEmail(email) ? 'Please enter a valid email address.' : '';

  const handleSubmit = async e => {
    e.preventDefault();
    setTouched(true);
    if (!isEmail(email)) return;
    setStatus('submitting'); setErrMsg('');
    try {
      await window.LumenearAuth.requestPasswordReset(email.trim());
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrMsg(err.message || 'Sending failed. Please try again later.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="auth-form">
        <h1 className="auth-title">Check your email</h1>
        <p className="auth-sub">If an account exists for <b>{email.trim()}</b>, you'll receive a link to set a new password.</p>
        <Button variant="ghost" size="lg" className="auth-submit" onClick={onBack}>Back to login</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <h1 className="auth-title">Forgot password</h1>
      <p className="auth-sub">Enter your email address and we'll send you a link to set a new password.</p>

      <Field label="Email address" required error={emailErr}>
        <input className="field-input" type="email" autoComplete="email" inputMode="email"
          value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(true)}
          placeholder="name@company.com" autoFocus />
      </Field>

      {status === 'error' && <div className="kit-field-error" role="alert">{errMsg}</div>}

      <Button type="submit" variant="primary" size="lg" loading={status === 'submitting'} disabled={!isEmail(email)} className="auth-submit">
        Send reset link
      </Button>
      <div className="auth-links">
        <button type="button" className="auth-link" onClick={onBack}>Back to login</button>
      </div>
    </form>
  );
}

function RequestAccessForm({ onBack }) {
  const [name, setName]       = _useStateA('');
  const [email, setEmail]     = _useStateA('');
  const [company, setCompany] = _useStateA('');
  const [message, setMessage] = _useStateA('');
  const [touched, setTouched] = _useStateA(false);
  const [status, setStatus]   = _useStateA('idle');
  const [errMsg, setErrMsg]   = _useStateA('');

  const nameErr  = touched && !name.trim() ? 'Please enter your name.' : '';
  const emailErr = touched && !isEmail(email) ? 'Please enter a valid email address.' : '';
  const canSubmit = name.trim() && isEmail(email) && status !== 'submitting';

  const handleSubmit = async e => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim() || !isEmail(email)) return;
    setStatus('submitting'); setErrMsg('');
    try {
      await submitAccessRequest({ name: name.trim(), email: email.trim(), company: company.trim(), message: message.trim() });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrMsg('Something went wrong sending your request. Please try again, or email info@lumenear.com.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="auth-form">
        <h1 className="auth-title">Request sent</h1>
        <p className="auth-sub">Thanks{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''} — we'll be in touch once you have access.</p>
        <Button variant="ghost" size="lg" className="auth-submit" onClick={onBack}>Back to login</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <h1 className="auth-title">Request access</h1>
      <p className="auth-sub">No login yet? Request access and we'll get in touch personally.</p>

      <Field label="Name" required error={nameErr}>
        <input className="field-input" type="text" autoComplete="name"
          value={name} onChange={e => setName(e.target.value)} onBlur={() => setTouched(true)}
          placeholder="Jane Doe" autoFocus />
      </Field>
      <Field label="Email address" required error={emailErr}>
        <input className="field-input" type="email" autoComplete="email" inputMode="email"
          value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTouched(true)}
          placeholder="name@company.com" />
      </Field>
      <Field label="Company" hint="Optional">
        <input className="field-input" type="text" autoComplete="organization"
          value={company} onChange={e => setCompany(e.target.value)} placeholder="Optional" />
      </Field>
      <Field label="Anything we should know?" hint="Optional">
        <textarea className="field-input" rows={3} style={{ resize: 'vertical', minHeight: 64 }}
          value={message} onChange={e => setMessage(e.target.value)} placeholder="Optional" />
      </Field>

      {status === 'error' && <div className="kit-field-error" role="alert">{errMsg}</div>}

      <Button type="submit" variant="primary" size="lg" loading={status === 'submitting'} disabled={!canSubmit} className="auth-submit">
        Send request
      </Button>
      <div className="auth-links">
        <button type="button" className="auth-link" onClick={onBack}>Back to login</button>
      </div>
    </form>
  );
}

function SetNewPasswordForm({ accessToken, onDone }) {
  const [password, setPassword] = _useStateA('');
  const [confirm, setConfirm]   = _useStateA('');
  const [touched, setTouched]   = _useStateA(false);
  const [status, setStatus]     = _useStateA('idle');
  const [errMsg, setErrMsg]     = _useStateA('');

  const passErr    = touched && password.length < 8 ? 'At least 8 characters.' : '';
  const confirmErr = touched && confirm !== password ? "Passwords don't match." : '';
  const canSubmit  = password.length >= 8 && confirm === password && status !== 'submitting';

  const handleSubmit = async e => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    setStatus('submitting'); setErrMsg('');
    try {
      await window.LumenearAuth.updatePassword(accessToken, password);
      setStatus('done');
      window.history.replaceState(null, '', window.location.pathname);
      setTimeout(onDone, 1600);
    } catch (err) {
      setStatus('error');
      setErrMsg(err.message || 'Failed to set password.');
    }
  };

  if (status === 'done') {
    return (
      <div className="auth-form">
        <h1 className="auth-title">Password set</h1>
        <p className="auth-sub">Redirecting you to the login page…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <h1 className="auth-title">New password</h1>
      <p className="auth-sub">Choose a new password for your account.</p>

      <Field label="New password" required error={passErr}>
        <input className="field-input" type="password" autoComplete="new-password"
          value={password} onChange={e => setPassword(e.target.value)} onBlur={() => setTouched(true)}
          placeholder="At least 8 characters" autoFocus />
      </Field>
      <Field label="Confirm password" required error={confirmErr}>
        <input className="field-input" type="password" autoComplete="new-password"
          value={confirm} onChange={e => setConfirm(e.target.value)} onBlur={() => setTouched(true)}
          placeholder="Repeat password" />
      </Field>

      {status === 'error' && <div className="kit-field-error" role="alert">{errMsg}</div>}

      <Button type="submit" variant="primary" size="lg" loading={status === 'submitting'} disabled={!canSubmit} className="auth-submit">
        Set password
      </Button>
    </form>
  );
}

function AuthGate({ children }) {
  const [phase, setPhase] = _useStateA('checking'); // checking | login | forgot | request | reset | authed
  const [recoveryToken, setRecoveryToken] = _useStateA(null);

  _useEffectA(() => {
    const hashParams = parseHashParams();
    if (hashParams.type === 'recovery' && hashParams.access_token) {
      setRecoveryToken(hashParams.access_token);
      setPhase('reset');
      return;
    }
    (async () => {
      const session = await window.LumenearAuth.getValidSession();
      setPhase(session ? 'authed' : 'login');
    })();
  }, []);

  if (phase === 'checking') {
    return (
      <div className="auth-shell">
        <Spinner size={28} label="Loading" />
      </div>
    );
  }

  if (phase === 'authed') return children;

  return (
    <AuthShell>
      {phase === 'login' && (
        <LoginForm
          onSuccess={() => setPhase('authed')}
          onForgot={() => setPhase('forgot')}
          onRequest={() => setPhase('request')}
        />
      )}
      {phase === 'forgot' && <ForgotPasswordForm onBack={() => setPhase('login')} />}
      {phase === 'request' && <RequestAccessForm onBack={() => setPhase('login')} />}
      {phase === 'reset' && (
        <SetNewPasswordForm accessToken={recoveryToken} onDone={() => setPhase('login')} />
      )}
    </AuthShell>
  );
}

window.AuthGate = AuthGate;
