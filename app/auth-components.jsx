/* Lumenear — Password gate: one shared password, no accounts.
 * Load AFTER kit-components.jsx and auth.js, BEFORE calculator-app.jsx. */
const { useState: _useStateA } = React;

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

function PasswordGateForm({ onSuccess }) {
  const [password, setPassword] = _useStateA('');
  const [touched, setTouched]   = _useStateA(false);
  const [errMsg, setErrMsg]     = _useStateA('');

  const passErr = touched && !password ? 'Please enter the password.' : '';

  const handleSubmit = e => {
    e.preventDefault();
    setTouched(true);
    if (!password) return;
    if (window.LumenearAuth.checkGatePassword(password)) {
      onSuccess();
    } else {
      setErrMsg('Incorrect password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <h1 className="auth-title">Enter password</h1>
      <p className="auth-sub">This calculator is only accessible with a password.</p>

      <Field label="Password" required error={passErr}>
        <input className="field-input" type="password" autoComplete="off"
          value={password}
          onChange={e => { setPassword(e.target.value); setErrMsg(''); }}
          onBlur={() => setTouched(true)}
          placeholder="••••••••" autoFocus />
      </Field>

      {errMsg && <div className="kit-field-error" role="alert">{errMsg}</div>}

      <Button type="submit" variant="primary" size="lg" className="auth-submit">
        Continue
      </Button>
    </form>
  );
}

function AuthGate({ children }) {
  const [unlocked, setUnlocked] = _useStateA(() => window.LumenearAuth.isGateUnlocked());

  if (unlocked) return children;

  return (
    <AuthShell>
      <PasswordGateForm onSuccess={() => setUnlocked(true)} />
    </AuthShell>
  );
}

window.AuthGate = AuthGate;
