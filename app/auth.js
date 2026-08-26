/* Lumenear Acoustic Calculator — shared-password gate.
   Client-side only check against one shared password, no accounts, no backend.
   This is an obscurity gate for casual visitors, not a real security boundary —
   the password is visible in this file's source. Replaces the per-user Supabase
   Auth login (removed 2026-08-26); real access control moves to a WordPress
   login page on lumenear.com that embeds this calculator (see decisions.md). */

window.LUMENEAR_GATE_PASSWORD = 'Acoustics26!';

const GATE_STORE_KEY = 'lumenear_calc_unlocked';

function checkGatePassword(password) {
  const ok = password === window.LUMENEAR_GATE_PASSWORD;
  if (ok) {
    try { localStorage.setItem(GATE_STORE_KEY, '1'); } catch {}
  }
  return ok;
}

function isGateUnlocked() {
  try { return localStorage.getItem(GATE_STORE_KEY) === '1'; } catch { return false; }
}

function lockGate() {
  try { localStorage.removeItem(GATE_STORE_KEY); } catch {}
}

window.LumenearAuth = { checkGatePassword, isGateUnlocked, lockGate };
