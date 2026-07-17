/* Lumenear Acoustic Calculator — Supabase Auth client (plain REST, geen SDK)
   Publieke anon/publishable key — veilig om hier te staan, alle rechten lopen via
   Supabase RLS-policies. Dit is een APART, geïsoleerd Supabase-project
   (lumenear-calculator-auth) — bevat uitsluitend calculator-logins, geen enkele
   AIF-data. Zie decisions.md 2026-07-17 (3). */

window.SUPABASE_URL = 'https://yclomlaxufhnfsqwougx.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_FwIKHltiOyi3lF4iiOvgCg_tDF8TPdt';

const AUTH_STORE_KEY = 'lumenear_auth_session';

function authFetch(path, opts) {
  opts = opts || {};
  return fetch(window.SUPABASE_URL + '/auth/v1' + path, Object.assign({}, opts, {
    headers: Object.assign({
      'Content-Type': 'application/json',
      apikey: window.SUPABASE_ANON_KEY,
    }, opts.headers || {}),
  }));
}

function saveSession(session, remember) {
  const store = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  try { other.removeItem(AUTH_STORE_KEY); } catch {}
  store.setItem(AUTH_STORE_KEY, JSON.stringify(Object.assign({}, session, { savedAt: Date.now() })));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORE_KEY) || sessionStorage.getItem(AUTH_STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearSession() {
  try { localStorage.removeItem(AUTH_STORE_KEY); } catch {}
  try { sessionStorage.removeItem(AUTH_STORE_KEY); } catch {}
}

async function signIn(email, password, remember) {
  const res = await authFetch('/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Login mislukt.');
  saveSession(data, remember);
  return data;
}

async function refreshSession(session) {
  const res = await authFetch('/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Sessie verlopen.');
  const remember = !!localStorage.getItem(AUTH_STORE_KEY);
  saveSession(data, remember);
  return data;
}

async function getValidSession() {
  const session = loadSession();
  if (!session || !session.access_token) return null;
  const expiresAtMs = (session.expires_at || 0) * 1000;
  if (Date.now() < expiresAtMs - 60000) return session;
  try {
    return await refreshSession(session);
  } catch {
    clearSession();
    return null;
  }
}

async function requestPasswordReset(email) {
  const res = await authFetch('/recover', {
    method: 'POST',
    body: JSON.stringify({
      email,
      options: { redirectTo: window.location.origin + window.location.pathname },
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error_description || data.msg || 'Versturen mislukt.');
  }
}

async function updatePassword(accessToken, newPassword) {
  const res = await authFetch('/user', {
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + accessToken },
    body: JSON.stringify({ password: newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Wachtwoord instellen mislukt.');
  return data;
}

async function signOut(session) {
  session = session || loadSession();
  if (session && session.access_token) {
    try {
      await authFetch('/logout', { method: 'POST', headers: { Authorization: 'Bearer ' + session.access_token } });
    } catch {}
  }
  clearSession();
}

function logCalculatorLogin(email) {
  // Best-effort, fire-and-forget — zelfde logtabel als de vorige Basic Auth-gate.
  fetch(window.SUPABASE_URL + '/rest/v1/calculator_access_log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: window.SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + window.SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ username: email, user_agent: navigator.userAgent }),
  }).catch(() => {});
}

window.LumenearAuth = {
  signIn, signOut, getValidSession, requestPasswordReset, updatePassword, logCalculatorLogin, clearSession,
};
