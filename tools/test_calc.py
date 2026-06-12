#!/usr/bin/env python3
"""
test_calc.py — Unit tests for the Sabine calculation engine.
Mirrors the logic in app/calculator-app.jsx so formula regressions
in the JS are caught by auditing these tests against the JS source.

Run:  python tools/test_calc.py
Exit: 0 = all pass, 1 = failures.
"""

import math
import sys

PASS, FAIL = 0, 0

def check(name, got, expected, tol=0.005):
    global PASS, FAIL
    if abs(got - expected) <= tol:
        PASS += 1
    else:
        FAIL += 1
        print(f"FAIL  {name}: expected {expected}, got {got:.4f}")


def sabine(vol, total_absorption):
    """RT60 = 0.161 * V / A  (same as calculator-app.jsx:66)"""
    return 0.161 * vol / max(total_absorption, 0.01)


def room_absorption(l, w, h, alpha_floor, alpha_wall, alpha_ceil,
                    alpha_furn_factor, alpha_extra_factor, persons):
    """Mirror of calculator-app.jsx useMemo calc block."""
    fA  = l * w
    wA  = 2 * (l * h) + 2 * (w * h)
    cA  = l * w
    fAb  = alpha_floor * fA
    wAb  = alpha_wall  * wA
    cAb  = alpha_ceil  * cA
    fuAb = alpha_furn_factor  * fA
    exAb = alpha_extra_factor * fA
    pAb  = persons * 0.46
    return fAb + wAb + cAb + fuAb + exAb + pAb


# ── Sabine formula ──────────────────────────────────────────
check("Sabine 100m³ 10m²", sabine(100, 10), 1.61, tol=0.001)
check("Sabine 200m³ 20m²", sabine(200, 20), 1.61, tol=0.001)
check("Sabine 50m³ 5m²",   sabine(50, 5),   1.61, tol=0.001)

# ── Zero-absorption guard (A=0 → uses 0.01) ─────────────────
rt_zero = sabine(100, 0)
check("Zero absorption guard finite", 1 if math.isfinite(rt_zero) else 0, 1, tol=0)

# ── Room absorption components ──────────────────────────────
# Standard meeting room: 8×6×2.8m, carpet 0.15, plasterboard+ins 0.07,
# gypsum ceiling 0.05, furnishing factor 0.08, no extras, 0 persons
rAb = room_absorption(8, 6, 2.8, 0.15, 0.07, 0.05, 0.08, 0.0, 0)
check("Meeting room rAb", rAb,
      (0.15 * 48) + (0.07 * (2*8*2.8 + 2*6*2.8)) + (0.05 * 48) + (0.08 * 48),
      tol=0.01)

# ── Persons absorption ──────────────────────────────────────
rAb_10p = room_absorption(8, 6, 2.8, 0.15, 0.07, 0.05, 0.08, 0.0, 10)
check("10 persons add 4.6 m²", rAb_10p - rAb, 4.6, tol=0.001)

# ── Lumenear product contribution ──────────────────────────
# Float acoustic round 1200: eq=2.40, pendant → correct Aeq already in data.js
# 3 units → 7.20 m²
lAb = 3 * 2.40
check("3× Float acoustic round 1200 Aeq", lAb, 7.20, tol=0.001)

# ── RT60 improvement ────────────────────────────────────────
r0  = sabine(100, 5)    # before: 100m³, 5m² absorption → 3.22s
r1  = sabine(100, 10)   # after:  100m³, 10m² absorption → 1.61s
imp = (1 - r1 / r0) * 100
check("50% improvement when absorption doubles", imp, 50.0, tol=0.01)

# ── aNeed calculation ───────────────────────────────────────
# Need: 0.161 * vol / target - current_total
vol   = 8 * 6 * 2.8
tgt   = 0.6
rAb_c = room_absorption(8, 6, 2.8, 0.15, 0.07, 0.05, 0.08, 0.0, 0)
aNeed = max(0, 0.161 * vol / tgt - rAb_c)
check("aNeed positive for under-absorbed room", 1 if aNeed > 0 else 0, 1, tol=0)
check("aNeed zero when target exceeded", max(0, 0.161 * vol / 10.0 - rAb_c), 0, tol=0.001)

# ── Volume calculation ──────────────────────────────────────
check("Volume 8×6×2.8", 8 * 6 * 2.8, 134.4, tol=0.001)

# ── Result ──────────────────────────────────────────────────
total = PASS + FAIL
print(f"\n{PASS}/{total} tests passed.")
if FAIL:
    sys.exit(1)
