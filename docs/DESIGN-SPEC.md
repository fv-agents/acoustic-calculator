# Lumenear Acoustic Calculator — Design Specification

*For use in Claude Code and future design iterations*
*Version 1.0 — June 2026*

---

## 1. Product Overview

The Lumenear Acoustic Calculator is a client-side web application that calculates the RT60 reverberation time (Sabine formula) of a room, and shows what acoustic improvement Lumenear fixtures provide. Output: a downloadable branded PDF advisory report.

**Three roles simultaneously:**
1. **Self-service tool** — a non-acoustic user completes the flow in < 5 minutes
2. **Sales instrument** — the PDF report is professional enough to send unedited to a client
3. **Brand ambassador** — confirms Lumenear as premium European acoustic lighting label

**Stack:** HTML + vanilla JavaScript (React via CDN) + Chart.js + jsPDF. Fully client-side, hosted on Netlify. No backend.

---

## 2. UX Architecture — A/B Hybrid Wizard

The flow is a **3-step linear wizard** with a hybrid layout:

| Step | Title | Layout | Description |
|------|-------|--------|-------------|
| 1 | Space & Materials | **Full-page centered** (max 760px, scrollable) | Room type presets, L×W×H dimensions, occupancy, isometric room preview. Then: surface materials per face (floor/walls/ceiling), furnishing, extra treatments, absorption summary table. RT60 meter as sticky footer |
| 2 | Add Lumenear fixtures | **Split-panel** (catalog left, results sidebar right 320px) | Filterable product grid, quantity steppers. Sidebar shows live RT60 before/after, selected products, absorption needed. RT60 meter in footer |
| 3 | Result & Report | **Full-page centered** (max 680px, scrollable) | Big animated RT60 numbers, horizontal bar chart, text recommendation, product summary table. Then: report section with project name + client fields, PDF download button, quote CTA |

### Navigation
- **Progress bar** always visible at top — clickable steps with numbered circles
- Steps can be navigated freely (no forced linear progression)
- "Next step →" / "← Back" buttons at bottom of each step
- Active step: accent-colored number, raised background
- Completed steps: green checkmark

### Signature Element: RT60 Meter
A sticky footer bar visible during steps 2–3. Shows a horizontal 0.0s–3.0s scale with:
- Green zone marking the optimal range for the selected room type
- Gray marker for "before" RT60
- Accent (sand) marker for "after" RT60
- Markers animate smoothly (300ms ease) when values change
- Numeric values shown in the meter header

---

## 3. Visual System

### Philosophy
Dark, architectural, precise. The target audience works daily in dark UI environments (Revit, AutoCAD, Figma dark mode). The tool must feel immediately familiar to them. Light is Lumenear's core product — the accent is warm sand, the only warm element in an otherwise neutral, disciplined interface.

**No** consumer-SaaS look. **No** bright colors. **No** excessive animations. Every design choice must answer: *does this fit a tool that an architect takes seriously?*

### Color Palette

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--bg` | Background | `#141414` | Page background |
| `--surface` | Surface | `#1E1E1E` | Cards, panels, inputs |
| `--raised` | Raised | `#252525` | Hover states, selected items |
| `--border` | Border | `#2E2E2E` | Dividers, input borders |
| `--border-hover` | Border hover | `#3a3a3a` | Hover state on borders |
| `--text` | Primary text | `#F0EDEA` | Headings, primary labels (off-white, warm) |
| `--text-sec` | Secondary text | `#8A8480` | Subtitles, labels, hints (warm gray) |
| `--accent` | Warm sand | `#C8B89A` | CTA buttons, active step, highlights, RT60 "after" |
| `--accent-dim` | Sand dimmed | `#7A6E60` | Hover on accent elements, accent borders |
| `--ok` | Sage green | `#6B8F71` | RT60 within optimal range |
| `--warn` | Amber | `#C8891A` | RT60 acceptable but improvable |
| `--alert` | Terracotta | `#B85C38` | RT60 outside norm, action needed |

**Additional colors used:**
- Header background: `#0C0C0C`
- "Before" RT60 values: `#94a3b8` (slate/cool gray — distinct from warm palette)
- Button primary hover: `#d4c4a6`

### Depth Model
**No box-shadows.** Depth is communicated exclusively through border + background-color differences:
- `--bg` → `--surface` → `--raised` (three levels)
- Borders at `--border`, brightening to `--border-hover` on hover

### Typography

| Role | Font | Size | Weight | Color | Notes |
|------|------|------|--------|-------|-------|
| RT60 display numbers | DM Serif Display | 72px (result), 28px (sidebar) | 400 | `--accent` or status color | Only for big RT60 values — nowhere else |
| Step title | Inter | 28px | 300 | `--text` | Light weight for elegance |
| Section label | Inter | 11px | 600 | `--text-sec` | UPPERCASE, letter-spacing: 1.5px |
| Body / instruction | Inter | 15px | 400 | `--text` | Step subtitles |
| Field labels | Inter | 11px | 500 | `--text-sec` | Above inputs |
| Data values / αw | DM Mono | 12-13px | 400-500 | `--text-sec` or `--accent` | Monospace for numeric alignment |
| Buttons | Inter | 12px (normal), 14px (large) | 600 | Varies | |

**Font loading:** Google Fonts via `@import`:
```
DM Serif Display (400)
Inter (300, 400, 500, 600, 700)
DM Mono (400, 500)
```

### Spacing & Layout

- **Base grid:** 8px
- **Max content width:** 760px (steps 1, 2), 640px (step 4), 520px (step 5)
- **Step content padding:** 40px top/bottom, 32px left/right
- **Split layout (step 3):** Sidebar = 320px fixed; main = fluid
- **Card border-radius:** 6px (`--radius`) — small, not playful
- **Input border-radius:** 4px (`--radius-sm`)
- **Header height:** 54px
- **Progress bar height:** ~50px (14px padding + content)
- **RT60 meter height:** ~56px

### Component Specifications

#### Buttons
- **Primary:** `--accent` bg, `#111` text, 4px radius, 8px 20px padding
- **Ghost:** transparent bg, `--text-sec` text, 1px `--border` border
- **Small variant:** 6px 14px padding, 11px font
- **Large variant:** 12px 32px padding, 14px font
- **Focus visible:** 2px solid `--accent`, 2px offset

#### Inputs
- Background: `--surface`
- Border: 1px solid `--border`
- Focus: border-color `--accent` + 2px box-shadow rgba(200,184,154,.12)
- Placeholder: `--text-sec` at 60% opacity
- Number inputs: no spinners (webkit + moz hidden)

#### Preset Cards (Room Type)
- Grid: 4 columns, 8px gap
- Default: `--surface` bg, `--border` border, `--text-sec` text
- Active: `--accent` border, `--accent` text, rgba(200,184,154,.06) bg
- Hover: `--raised` bg, `--border-hover` border, `--text` color

#### Product Cards
- Grid: 2 columns, 10px gap
- Layout: 52px thumbnail left + info + qty stepper right
- Thumbnail: `--raised` bg, 4px radius, family name centered
- Selected state: `--accent` border, rgba(200,184,154,.04) bg
- Specs row: αw + area + Aeq (accent color, mono font, 600 weight)
- Quantity stepper: −/input/+ inline, 28px×26px buttons, mono input

#### Filter Tabs
- Pill shape: 16px radius, 5px 12px padding, 11px font
- Default: transparent bg, `--border` border, `--text-sec`
- Active: `--accent` bg, `#111` text, `--accent` border
- Hover: `--accent-dim` border, `--accent` text

#### Advice Boxes
- 6px radius, 16px 20px padding
- OK: rgba(107,143,113,.08) bg, rgba(107,143,113,.25) border
- Warning: rgba(200,137,26,.08) bg, rgba(200,137,26,.25) border
- Bad: rgba(184,92,56,.08) bg, rgba(184,92,56,.25) border

#### Summary Tables
- Full width, collapse borders
- Cell padding: 8px 10px
- Row borders: 1px solid `--border`
- Label column: `--text-sec`, 50% width
- Value column: right-aligned, mono font
- Total row: 700 weight, `--accent` color, 2px top border `--accent`

---

## 4. Micro-interactions & Animation

**Principle:** One orchestrated element (the RT60 meter), everything else is quiet.

| Element | Behavior | Timing |
|---------|----------|--------|
| **Number transitions** | Animated counter (counts up/down with easing) | 400ms, cubic ease-out |
| **Number bump** | Scale to 1.06 then back on value change | 400ms |
| **RT60 meter markers** | Smooth position transition | 500ms, cubic-bezier(.4,0,.2,1) |
| **Bar chart bars** | Width transition on value change | 500ms, cubic-bezier(.4,0,.2,1) |
| **Product card hover** | bg `--surface` → `--raised`, border lightens | 150ms ease |
| **Product card select** | Border to `--accent`, subtle bg tint | 150ms ease |
| **Button hover** | Background shift | 150ms ease |
| **Input focus** | Border to `--accent` + glow shadow | 150ms ease |
| **RT60 meter show/hide** | Opacity + translateY | 300ms ease |

**`@media (prefers-reduced-motion: reduce)`** — all animations and transitions set to 0ms.

**Anti-patterns (never do):**
- No scroll-triggered reveals
- No parallax
- No loading skeletons
- No confetti or decorative animations
- No scale on card hover
- No shadows anywhere

---

## 5. Calculation Engine

### Sabine Formula
```
RT60 = 0.161 × V / A
```
Where:
- V = room volume (L × W × H) in m³
- A = total equivalent absorption area in m² Sabine

### Absorption Sources
```
A_total = A_floor + A_walls + A_ceiling + A_furnishing + A_extras + A_persons + A_lumenear
```

Each surface absorption:
```
A_surface = α × S
```
Where α = speech-average absorption coefficient (500–2000 Hz), S = surface area (m²).

Person absorption: **0.46 m² Sabine** per seated person (classical table value).

Lumenear product absorption: uses **Aeq** (equivalent absorption area per fixture), which already includes the +12% pendant edge diffraction bonus. These values come from lab tests per EN-ISO 354.

### RT60 Rating Scale

| Ratio (RT60 / target) | Rating | Color |
|------------------------|--------|-------|
| ≤ 1.0 | Excellent | `--ok` |
| ≤ 1.15 | Good | `--ok` |
| ≤ 1.3 | Fair | `--warn` |
| ≤ 1.6 | Poor | `--warn` |
| > 1.6 | Needs improvement | `--alert` |

### Norm Targets per Room Type

| Room type | Target RT60 | Optimal range | Acceptable limit |
|-----------|-------------|---------------|------------------|
| Open office | 0.6s | 0.4–0.6s | < 0.8s |
| Cell office | 0.6s | 0.4–0.6s | < 0.8s |
| Call center | 0.5s | 0.3–0.5s | < 0.6s |
| Meeting room | 0.6s | 0.4–0.6s | < 0.7s |
| Restaurant / café | 1.0s | 0.6–0.9s | < 1.2s |
| Canteen | 0.9s | 0.6–0.9s | < 1.2s |
| Lobby / reception | 1.0s | 0.8–1.2s | < 1.6s |
| Classroom | 0.6s | 0.4–0.6s | < 0.8s |
| Childcare | 0.6s | 0.4–0.6s | < 0.8s |
| Healthcare | 0.8s | 0.6–0.8s | < 1.0s |
| Retail / shop | 1.0s | 0.6–1.0s | < 1.4s |

Sources: ISO 3382-3, NEN-EN ISO 3382-2, DIN 18041 guidelines.

---

## 6. Data Model

### Products (89 items)
Each product has:
```js
{
  n: "Float acoustic Rect 1200×2400",  // Display name
  f: "Float",                           // Product family
  cat: "Technical",                     // Category: Technical or Decorative
  mt: "Pendant",                        // Mounting: Pendant, Wall, Floor standing, Ceiling baffle
  aw: 0.9,                             // Weighted absorption coefficient (ISO 11654)
  a: 5.76,                             // Acoustic surface area (m²)
  eq: 6.32,                            // Equivalent absorption Aeq (m²) — incl. diffraction for pendants
  d: null,                             // Diameter in mm (null if non-circular)
  note: "Rectangle + wool"             // Construction note
}
```

**Product families:** Nova, Toad, Float, Blaze, Halo, Line, Breeze, Orbit, Column, Wing, Cloud, Cone, Sliced, Bold, Twist, Macaron, Blooom, Edge, JoJo, Drop, Cage, Podge, Spott, Pyknic

**αw range:** 0.45 (single-layer PET felt) to 1.00 (sandwich/baffle constructions)

### Materials
Five categories, each a dictionary of `{ "Material name": α_coefficient }`:

| Category | # Options | α range | Used for |
|----------|-----------|---------|----------|
| Floor | 8 | 0.02–0.66 | Floor surface |
| Wall | 15 | 0.01–0.90 | All 4 walls (same material) |
| Ceiling | 12 | 0.02–0.92 | Ceiling surface |
| Furnishing | 5 | 0.005–0.12 | Applied to floor area |
| Extras | 5 | 0.01–0.08 | Applied to floor area (multiple selectable) |

### Room Presets (12)
Each preset auto-fills: floor material, wall material, ceiling material, furnishing, extra treatments, and RT60 target.

---

## 7. Copy Guidelines

**Tone:** Technically confident, not salesy. Write as if you're a fellow advisor guiding someone through a calculation.

### Step Copy

| Step | Heading | Subtitle |
|------|---------|----------|
| 1 | "Define your space" | "Enter the room dimensions and select the space type." |
| 2 | "Current materials" | "Select the surface finishes in the room as it stands today." |
| 3 | "Add Lumenear fixtures" | "Select the products and quantities you're specifying." |
| 4 | "Acoustic result" | "RT60 before and after — with a recommendation." |
| 5 | "Generate report" | "Download a PDF you can share directly with your client." |

### Dynamic Recommendation Text
Generated from calculation results:
```
"✓ Excellent. The reverberation time drops from 1.8s to 0.9s. 
For meeting room, 0.6s is the recommended target — your specification meets this target."
```

### Button Labels
- Use active verbs: "Next step →", not "Continue"
- "Download report", not "Submit"
- "Add fixture", not "Select product"
- "← Back" for reverse navigation
- "Request a quote →" for CTA

---

## 8. State Management

### localStorage Persistence
Key: `lumenear_calc_v2`

Saved on every state change:
```js
{ step, pn, client, l, w, h, pe, rt, fm, wm, cm, fu, ex, qty }
```

Restored on page load with fallback to defaults:
```js
{
  step: 1, pn: '', client: '', l: 8, w: 6, h: 2.8, pe: 0,
  rt: 'Meeting room', fm: 'Carpet tiles (office)',
  wm: 'Plasterboard + insulation', cm: 'Gypsum ceiling (closed)',
  fu: 'Normal with upholstery', ex: [], qty: {}
}
```

### "New" Action
Clears localStorage key and reloads the page.

---

## 9. File Structure

```
Calculator.html          — Entry point (loads all scripts)
styles.css               — Complete dark theme (CSS custom properties)
data.js                  — Product data, material data, presets, norms (plain JS, window globals)
ui-components.jsx        — Shared components: AnimatedNumber, IsoRoom, RT60Meter, ProductCard, SimpleBarChart, rating helpers
calculator-app.jsx       — Main App component: wizard state, calculation engine, all 5 step renders
```

### Load Order
```html
<link rel="stylesheet" href="styles.css">
<script src="react.js"></script>
<script src="react-dom.js"></script>
<script src="babel.js"></script>
<script src="data.js"></script>                         <!-- plain JS, sets window globals -->
<script type="text/babel" src="ui-components.jsx"></script>  <!-- exports to window -->
<script type="text/babel" src="calculator-app.jsx"></script> <!-- reads from window, renders App -->
```

---

## 10. What's Not Yet Built (v2 Scope)

| Feature | Priority | Notes |
|---------|----------|-------|
| PDF report (jsPDF) | High | Branded header dark/#141414, body on white for print. See original app for reference implementation |
| Chart.js integration | Medium | Replace SimpleBarChart with Chart.js horizontal bars + annotation plugin for norm zone |
| Save/load project (.json) | Medium | Export/import project state as JSON file |
| Mobile responsive | Medium | Below 1024px: stack split layout, reduce preset grid to 2 cols |
| Product images | Low | Placeholder thumbnails currently show family name |
| NL language support | Deferred to v2 | All copy currently in English |
| Multi-scenario comparison | Deferred to v2 | Architecture supports it (clean state model) |

---

## 11. Disclaimer

All RT60 calculations are indicative, based on the Sabine formula with speech-averaged α values (500–2000 Hz). Aeq values per fixture are from independent lab tests (EN-ISO 354, Peutz A 3432-1-RA). Pendant products include edge diffraction effect. This tool does not replace on-site acoustic assessment. Norm targets are indicative per room type and do not constitute formal DIN 18041 compliance testing.

---

*Lumenear / In-Zee BV — lumenear.com — info@lumenear.com*
