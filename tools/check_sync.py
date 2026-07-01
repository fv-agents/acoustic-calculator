#!/usr/bin/env python3
"""
check_sync.py — verifies that product data in app/data.js matches values
calculated from the source CSV (data/lumenear_2026_acoustic_data.csv).

Usage:
  python tools/check_sync.py              # check app/data.js
  python tools/check_sync.py --emit       # print updated window.PRODUCTS JS block

Exit 0 = in sync, exit 1 = drift detected.
Pure Python (no pandas) — runs everywhere including CI.
"""

import argparse
import csv
import math
import re
import sys
from pathlib import Path

ROOT     = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "data" / "lumenear_2026_acoustic_data.csv"
JS_PATH  = ROOT / "app" / "data.js"

# Peutz V5 override for Float acoustic variants (EN-ISO 354, report A 3432-1-RA)
PEUTZ_V5 = {"a_500Hz": 0.99, "a_1000Hz": 0.99, "a_2000Hz": 0.97}


def fnum(v):
    if v is None or str(v).strip() == "":
        return None
    return float(str(v).replace(",", "."))


def normalize_name(name):
    """Normalize a product name for CSV↔JS comparison.
    CSV uses 'Rectangle' and 'x' for dimensions; data.js uses 'Rect' and '×'.
    """
    name = name.replace("Rectangle", "Rect")
    name = re.sub(r'(\d+)[×x](\d+)', r'\1x\2', name)
    return name


def calc_area(fam, var, d):
    """Calculate acoustic surface area from CSV columns (same logic as original build script)."""
    a = None
    if fam == "Float" and d is not None:
        a = 2 * math.pi * (d / 2000) ** 2
    elif fam == "Float" and "Oval" in var:
        a = 2 * math.pi * 0.5 * 1.0 if "2000" in var else 2 * math.pi * 0.4 * 0.6
    elif fam == "Float" and "Rectangle" in var:
        if "1200x2400" in var:
            a = 2 * 1.2 * 2.4
        elif "600x2400" in var:
            a = 2 * 0.6 * 2.4
        elif "1200x1200" in var:
            a = 2 * 1.2 * 1.2
    elif fam == "Line":
        a = 2 * 0.15 * 1.29 if "1290" in var else 2 * 0.15 * 2.52
    elif fam == "Bold" and "1200x1200" in var:
        a = 2 * 1.2 * 1.2
    elif fam == "Cone" and d is not None:
        r_m = d / 2000
        a = math.pi * r_m * math.sqrt(r_m ** 2 + 0.35 ** 2)
    elif fam == "Macaron" and "pendant" in var and d is not None:
        a = 0.6 * 4 * math.pi * (d / 2000) ** 2
    elif fam == "Macaron" and "wall" in var and d is not None:
        a = math.pi * (d / 2000) ** 2
    elif fam == "Edge":
        a = 2 * 0.6 * 1.2 if "XL" in var else 2 * 0.4 * 0.8
    return round(a, 2) if a else None


def expected_products():
    """Compute expected (normalized_name, fam, aw, area, aeq) from CSV."""
    out = []
    with open(CSV_PATH, encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f, delimiter=";"):
            fam  = row["Product_Family"]
            var  = row["Product_Variant"]
            name = normalize_name(f"{fam} {var}")
            d    = fnum(row["Diameter_mm"])
            area = fnum(row["Acoustic_Surface_m2"])
            if area is None:
                area = calc_area(fam, var, d)
            if area is None:
                print(f"ERROR: cannot determine area for '{fam} {var}'")
                sys.exit(1)

            alphas = {k: fnum(row[k]) for k in ("a_500Hz", "a_1000Hz", "a_2000Hz")}
            if fam == "Float" and "acoustic" in var.lower():
                alphas.update(PEUTZ_V5)
            speech = round(sum(alphas.values()) / 3, 2)

            mounting = row["Mounting_Type"] or ""
            diff = 1.12 if re.search(r"pendant|hang|free", mounting, re.I) else 1.00

            # Measured/scaled Aeq overrides real ISO 354 object test data (Merford
            # lab report, 2026-05-12) or a family-specific extrapolation from it.
            # Bypasses the material-model formula so diffraction isn't double-applied
            # on top of an already-measured object value.
            override = fnum(row["Equivalent_Absorption_Aeq_m2"])
            aeq = override if override is not None else round(area * speech * diff, 2)
            aw   = fnum(row["aw_ISO11654"])
            out.append((name, fam, aw, round(area, 2), aeq))
    return out


def parse_data_js(js_path):
    """Parse window.PRODUCTS from app/data.js.
    Returns dict: normalized_name → (aw, area, aeq).
    """
    text = Path(js_path).read_text(encoding="utf-8")
    m = re.search(r"window\.PRODUCTS\s*=\s*\[(.*?)\];", text, re.S)
    if not m:
        print(f"ERROR: window.PRODUCTS not found in {js_path}")
        sys.exit(1)
    out = {}
    pat = re.compile(r'\{n:"([^"]+)",f:"([^"]+)",[^}]*?aw:([\d.]+),a:([\d.]+),eq:([\d.]+)')
    for n, _f, aw, a, eq in pat.findall(m.group(1)):
        out[normalize_name(n)] = (float(aw), float(a), float(eq))
    return out


def js_num(v):
    """Compact JS number notation: 0.45 → .45, 2.00 → 2."""
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return s[1:] if s.startswith("0.") else s


def emit_js(products):
    """Print a window.PRODUCTS block with CSV-calculated values (for reference)."""
    print("window.PRODUCTS = [")
    for n, f, aw, a, eq in products:
        print(f'  {{n:"{n}",f:"{f}",aw:{js_num(aw)},a:{js_num(a)},eq:{js_num(eq)}}},')
    print("];")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--js",   default=str(JS_PATH),
                    help="Path to app/data.js (default: app/data.js)")
    ap.add_argument("--emit", action="store_true",
                    help="Print window.PRODUCTS JS block and exit")
    args = ap.parse_args()

    products = expected_products()
    if args.emit:
        emit_js(products)
        return

    exp = {n: (aw, a, eq) for n, _f, aw, a, eq in products}
    got = parse_data_js(args.js)

    errors = []
    for name in sorted(set(exp) | set(got)):
        if name not in got:
            errors.append(f"MISSING in data.js: {name}")
            continue
        if name not in exp:
            errors.append(f"UNKNOWN product in data.js (not in CSV): {name}")
            continue
        e_aw, e_a, e_eq = exp[name]
        g_aw, g_a, g_eq = got[name]
        if abs(e_eq - g_eq) > 0.005:
            errors.append(f"Aeq mismatch {name}: expected {e_eq}, got {g_eq}")
        if abs(e_a - g_a) > 0.005:
            errors.append(f"Area mismatch {name}: expected {e_a}, got {g_a}")
        if e_aw is not None and abs(e_aw - g_aw) > 0.005:
            errors.append(f"aw mismatch {name}: expected {e_aw}, got {g_aw}")

    print(f"Products in CSV: {len(exp)} | in data.js: {len(got)}")
    if errors:
        print(f"\n{len(errors)} MISMATCH(ES) FOUND:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    print("OK: data.js is fully in sync with the CSV calculation.")


if __name__ == "__main__":
    main()
