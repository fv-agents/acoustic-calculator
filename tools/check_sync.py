#!/usr/bin/env python3
"""
check_sync.py — verifieert dat de PP-productarray in de web-app exact overeenkomt
met de waarden berekend uit de bron-CSV (zelfde logica als build_lumenear_calculator_v4.py).

Gebruik:
  python tools/check_sync.py                          # checkt app/index.html
  python tools/check_sync.py --html pad/naar/file.html

Exit 0 = in sync, exit 1 = afwijkingen gevonden.
Pure Python (geen pandas) zodat het overal draait, ook in CI.
"""

import argparse
import csv
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "excel" / "lumenear_2026_acoustic_data.csv"

# Peutz V5 override voor Float "acoustic" varianten (EN-ISO 354, rapport A 3432-1-RA)
PEUTZ_V5 = {"a_500Hz": 0.99, "a_1000Hz": 0.99, "a_2000Hz": 0.97}


def fnum(v):
    if v is None or str(v).strip() == "":
        return None
    return float(str(v).replace(",", "."))


def calc_area(fam, var, d):
    """Zelfde logica als calc_area in build_lumenear_calculator_v4.py."""
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
    """Bereken per product de verwachte {naam: (aw, area, aeq)} uit de CSV."""
    out = {}
    with open(CSV_PATH, encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f, delimiter=";"):
            fam = row["Product_Family"]
            var = row["Product_Variant"]
            name = f"{fam} {var}"
            d = fnum(row["Diameter_mm"])
            area = fnum(row["Acoustic_Surface_m2"])
            if area is None:
                area = calc_area(fam, var, d)
            if area is None:
                print(f"FOUT: geen oppervlak bepaalbaar voor '{name}'")
                sys.exit(1)

            alphas = {k: fnum(row[k]) for k in ("a_500Hz", "a_1000Hz", "a_2000Hz")}
            if fam == "Float" and "acoustic" in var.lower():
                alphas.update(PEUTZ_V5)
            # Zelfde afrondingsvolgorde als het build-script: eerst speech avg op 2 dec.
            speech = round(sum(alphas.values()) / 3, 2)

            mounting = row["Mounting_Type"] or ""
            diff = 1.12 if re.search(r"pendant|hang|free", mounting, re.I) else 1.00
            aeq = round(area * speech * diff, 2)
            aw = fnum(row["aw_ISO11654"])
            out[name] = (aw, round(area, 2), aeq)
    return out


def parse_pp(html_path):
    """Parse de const PP=[...] array uit de web-app."""
    text = Path(html_path).read_text(encoding="utf-8")
    m = re.search(r"const PP\s*=\s*\[(.*?)\];", text, re.S)
    if not m:
        print(f"FOUT: geen 'const PP=[...]' gevonden in {html_path}")
        sys.exit(1)
    out = {}
    pat = re.compile(
        r'\{n:"([^"]+)",f:"[^"]+",aw:([\d.]+),a:([\d.]+),eq:([\d.]+)\}'
    )
    for n, aw, a, eq in pat.findall(m.group(1)):
        out[n] = (float(aw), float(a), float(eq))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--html", default=str(ROOT / "app" / "index.html"))
    args = ap.parse_args()

    exp = expected_products()
    got = parse_pp(args.html)

    errors = []
    for name in sorted(set(exp) | set(got)):
        if name not in got:
            errors.append(f"ONTBREEKT in web-app: {name}")
            continue
        if name not in exp:
            errors.append(f"ONBEKEND product in web-app (niet in CSV): {name}")
            continue
        e_aw, e_a, e_eq = exp[name]
        g_aw, g_a, g_eq = got[name]
        if abs(e_eq - g_eq) > 0.005:
            errors.append(f"Aeq afwijking {name}: verwacht {e_eq}, web heeft {g_eq}")
        if abs(e_a - g_a) > 0.005:
            errors.append(f"Oppervlak afwijking {name}: verwacht {e_a}, web heeft {g_a}")
        if e_aw is not None and abs(e_aw - g_aw) > 0.005:
            errors.append(f"aw afwijking {name}: verwacht {e_aw}, web heeft {g_aw}")

    print(f"Producten in CSV: {len(exp)} | in web-app: {len(got)}")
    if errors:
        print(f"\n{len(errors)} AFWIJKING(EN):")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    print("OK: web-app productdata is volledig in sync met de CSV-berekening.")


if __name__ == "__main__":
    main()
