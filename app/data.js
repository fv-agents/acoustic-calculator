/* Lumenear Acoustic Calculator — Data
   Products: Lumenear 2026 catalogue, EN-ISO 354 (Peutz A 3432-1-RA)
   Materials: speech-average α (500–2000 Hz), Sengpiel/Harris tables + ISO 354 sources
   Presets: indicative, based on DIN 18041 / ISO 3382-3 */

window.PRODUCTS = [
  {n:"Nova light 1200",f:"Nova",cat:"Technical",mt:"Pendant",aw:.45,a:2.15,eq:1.26,d:1200,dim:"Ø1200 × 125 mm",note:"Radial design; diffusion by shape"},
  {n:"Nova light 1800",f:"Nova",cat:"Technical",mt:"Pendant",aw:.45,a:3.95,eq:2.82,d:1800,dim:"Ø1800 × 165 mm",note:"Radial design"},
  {n:"Nova light 2800",f:"Nova",cat:"Technical",mt:"Pendant",aw:.45,a:14.4,eq:6.83,d:2800,dim:"Ø2800 × 270 mm",note:"Radial design"},
  {n:"Nova acoustic 1200",f:"Nova",cat:"Technical",mt:"Pendant",aw:.45,a:2.15,eq:1.26,d:1200,dim:"Ø1200 × 125 mm",note:"Acoustic only; radial design"},
  {n:"Nova acoustic 1800",f:"Nova",cat:"Technical",mt:"Pendant",aw:.45,a:3.95,eq:2.82,d:1800,dim:"Ø1800 × 165 mm",note:"Acoustic only"},
  {n:"Nova acoustic 2800",f:"Nova",cat:"Technical",mt:"Pendant",aw:.45,a:14.4,eq:6.83,d:2800,dim:"Ø2800 × 270 mm",note:"Acoustic only"},
  {n:"Flora 800",f:"Flora",cat:"Technical",mt:"Pendant",aw:.45,a:1.66,eq:.73,d:800,note:"Pendant design; single layer PET Felt",hidden:true},
  {n:"Flora 1200",f:"Flora",cat:"Technical",mt:"Pendant",aw:.45,a:3.88,eq:1.71,d:1200,note:"Pendant design; single layer PET Felt",hidden:true},
  {n:"Flora 1800",f:"Flora",cat:"Technical",mt:"Pendant",aw:.45,a:10.34,eq:4.57,d:1800,note:"Pendant design; single layer PET Felt",hidden:true},
  {n:"Flora oval",f:"Flora",cat:"Technical",mt:"Pendant",aw:.45,a:2.37,eq:1.04,d:null,note:"Oval pendant design; single layer PET Felt",hidden:true},
  {n:"Toad 750",f:"Toad",cat:"Technical",mt:"Pendant",aw:.45,a:1.98,eq:.98,d:750,dim:"Ø750 × 220 mm",note:"Mushroom design; internal slats"},
  {n:"Toad 1000",f:"Toad",cat:"Technical",mt:"Pendant",aw:.45,a:3.27,eq:1.73,d:1000,dim:"Ø1000 × 245 mm",note:"Mushroom design"},
  {n:"Toad 1500",f:"Toad",cat:"Technical",mt:"Pendant",aw:.45,a:8.84,eq:3.9,d:1500,dim:"Ø1500 × 355 mm",note:"Mushroom design"},
  {n:"Toad Oval 1750",f:"Toad",cat:"Technical",mt:"Pendant",aw:.45,a:3.58,eq:1.58,d:null,dim:"1750 × 575 × 220 mm",note:"Oval shape"},
  {n:"Float downlight 800",f:"Float",cat:"Technical",mt:"Pendant",aw:.55,a:.5,eq:.74,d:800,dim:"Ø800 × 75 mm",note:"Double PET + air cavity"},
  {n:"Float downlight 1200",f:"Float",cat:"Technical",mt:"Pendant",aw:.55,a:1.13,eq:1.58,d:1200,dim:"Ø1200 × 75 mm",note:"Double PET + air cavity"},
  {n:"Float ringlight 800",f:"Float",cat:"Technical",mt:"Pendant",aw:.55,a:.5,eq:.74,d:800,dim:"Ø800 × 75 mm",note:"Double PET; LED ring"},
  {n:"Float ringlight 1200",f:"Float",cat:"Technical",mt:"Pendant",aw:.55,a:1.13,eq:1.58,d:1200,dim:"Ø1200 × 75 mm",note:"Double PET; LED ring"},
  {n:"Float Oval downlight 1200",f:"Float",cat:"Technical",mt:"Pendant",aw:.55,a:.93,eq:.83,d:null,dim:"1200 × 600 × 75 mm",note:"Oval"},
  {n:"Float Oval downlight 2000",f:"Float",cat:"Technical",mt:"Pendant",aw:.55,a:1.78,eq:1.76,d:null,dim:"2000 × 800 × 75 mm",note:"Oval"},
  {n:"Float Rect downlight 1200×1200",f:"Float",cat:"Technical",mt:"Pendant",aw:.55,a:1.44,eq:1.58,d:null,dim:"1200 × 1200 × 75 mm",note:"Rectangle"},
  {n:"Float Rect light 1200×2400",f:"Float",cat:"Technical",mt:"Pendant",aw:.55,a:2.88,eq:3.07,d:null,dim:"1200 × 2400 × 75 mm",note:"Rectangle"},
  {n:"Float Rect light 600×2400",f:"Float",cat:"Technical",mt:"Pendant",aw:.55,a:1.44,eq:1.62,d:null,dim:"600 × 2400 × 75 mm",note:"Rectangle"},
  {n:"Float acoustic round 800",f:"Float",cat:"Technical",mt:"Pendant",aw:.9,a:.5,eq:.74,d:790,dim:"Ø800 × 75 mm",note:"PET sandwich + acoustic wool; highest Float absorption"},
  {n:"Float acoustic round 1200",f:"Float",cat:"Technical",mt:"Pendant",aw:.9,a:1.13,eq:1.58,d:1180,dim:"Ø1200 × 75 mm",note:"PET sandwich + wool"},
  {n:"Float acoustic Oval 1200",f:"Float",cat:"Technical",mt:"Pendant",aw:.9,a:.93,eq:.83,d:null,dim:"1200 × 600 × 75 mm",note:"Oval + wool"},
  {n:"Float acoustic Oval 2000",f:"Float",cat:"Technical",mt:"Pendant",aw:.9,a:1.78,eq:1.76,d:null,dim:"2000 × 800 × 75 mm",note:"Oval + wool"},
  {n:"Float acoustic Rect 1200×1200",f:"Float",cat:"Technical",mt:"Pendant",aw:.9,a:1.44,eq:1.58,d:null,dim:"1200 × 1200 × 75 mm",note:"Rectangle + wool"},
  {n:"Float acoustic Rect 1200×2400",f:"Float",cat:"Technical",mt:"Pendant",aw:.9,a:2.88,eq:3.07,d:null,dim:"1200 × 2400 × 75 mm",note:"Rectangle + wool"},
  {n:"Float acoustic Rect 600×2400",f:"Float",cat:"Technical",mt:"Pendant",aw:.9,a:1.44,eq:1.62,d:null,dim:"600 × 2400 × 75 mm",note:"Rectangle + wool"},
  {n:"Blaze 550",f:"Blaze",cat:"Technical",mt:"Pendant",aw:.45,a:1.41,eq:.68,d:550,dim:"Ø350 × 350 mm",note:"Waffle design; internal slats"},
  {n:"Blaze 800",f:"Blaze",cat:"Technical",mt:"Pendant",aw:.45,a:3.32,eq:1.61,d:800,dim:"Ø800 × 525 mm",note:"Internal slats"},
  {n:"Blaze 1200",f:"Blaze",cat:"Technical",mt:"Pendant",aw:.45,a:7.91,eq:3.83,d:1200,dim:"Ø1200 × 750 mm",note:"Internal slats"},
  {n:"Halo light 700",f:"Halo",cat:"Technical",mt:"Pendant",aw:.45,a:1.64,eq:.76,d:700,dim:"Ø700 × 250 mm",note:"Open waffle; ring-shaped"},
  {n:"Halo light 1000",f:"Halo",cat:"Technical",mt:"Pendant",aw:.45,a:3.3,eq:1.55,d:1000,dim:"Ø1000 × 300 mm",note:"Open waffle; ring-shaped"},
  {n:"Halo light 1400",f:"Halo",cat:"Technical",mt:"Pendant",aw:.45,a:6.28,eq:3.05,d:1400,dim:"Ø1400 × 400 mm",note:"Open waffle; ring-shaped"},
  {n:"Halo acoustic 700",f:"Halo",cat:"Technical",mt:"Pendant",aw:.45,a:1.64,eq:.76,d:700,dim:"Ø700 × 250 mm",note:"Acoustic only; waffle"},
  {n:"Halo acoustic 1000",f:"Halo",cat:"Technical",mt:"Pendant",aw:.45,a:3.3,eq:1.55,d:1000,dim:"Ø1000 × 300 mm",note:"Acoustic only"},
  {n:"Halo acoustic 1400",f:"Halo",cat:"Technical",mt:"Pendant",aw:.45,a:6.28,eq:3.05,d:1400,dim:"Ø1400 × 400 mm",note:"Acoustic only"},
  {n:"Line light 1290",f:"Line",cat:"Technical",mt:"Pendant",aw:1,a:.36,eq:.53,d:null,dim:"1290 × 200–400 mm",note:"Sandwich; near-complete absorption"},
  {n:"Line light 2520",f:"Line",cat:"Technical",mt:"Pendant",aw:1,a:.75,eq:1.11,d:null,dim:"2520 × 200–400 mm",note:"Sandwich; near-complete absorption"},
  {n:"Line acoustic 1290",f:"Line",cat:"Technical",mt:"Pendant",aw:1,a:.36,eq:.53,d:null,dim:"1290 × 200–400 mm",note:"Acoustic only; sandwich"},
  {n:"Line acoustic 2520",f:"Line",cat:"Technical",mt:"Pendant",aw:1,a:.75,eq:1.11,d:null,dim:"2520 × 200–400 mm",note:"Acoustic only"},
  {n:"Breeze 800",f:"Breeze",cat:"Technical",mt:"Pendant",aw:.45,a:1.75,eq:.96,d:800,dim:"Ø800 × 300 mm",note:"Lamella design; diffusion"},
  {n:"Breeze 1000",f:"Breeze",cat:"Technical",mt:"Pendant",aw:.45,a:3.45,eq:1.89,d:1000,dim:"Ø1000 × 390 mm",note:"Lamella design"},
  {n:"Orbit 800",f:"Orbit",cat:"Technical",mt:"Pendant",aw:.45,a:1.07,eq:.59,d:800,dim:"Ø800 × 260 mm",note:"Curved blinds design"},
  {n:"Orbit 1200",f:"Orbit",cat:"Technical",mt:"Pendant",aw:.45,a:2.35,eq:1.29,d:1200,dim:"Ø1200 × 350 mm",note:"Curved blinds"},
  {n:"Column light 1600",f:"Column",cat:"Technical",mt:"Pendant",aw:.45,a:1.57,eq:.75,d:200,dim:"1600 × Ø200 mm",note:"Cylindrical; cluster recommended"},
  {n:"Column light 2000",f:"Column",cat:"Technical",mt:"Pendant",aw:.45,a:1.86,eq:.91,d:200,dim:"2000 × Ø200 mm",note:"Cylindrical"},
  {n:"Column Wall light 1600",f:"Column",cat:"Technical",mt:"Wall",aw:.45,a:1.57,eq:.67,d:200,dim:"1600 × Ø200 mm",note:"Wall mounted; radial"},
  {n:"Column acoustic 1600",f:"Column",cat:"Technical",mt:"Pendant",aw:.45,a:1.57,eq:.75,d:200,dim:"1600 × Ø200 mm",note:"Acoustic only; cylindrical"},
  {n:"Column acoustic 2000",f:"Column",cat:"Technical",mt:"Pendant",aw:.45,a:1.86,eq:.91,d:200,dim:"2000 × Ø200 mm",note:"Acoustic only"},
  {n:"Wing light",f:"Wing",cat:"Technical",mt:"Pendant",aw:.45,a:1.37,eq:.75,d:null,dim:"1800 × 310 × 250 mm",note:"Tilted design for diffusion"},
  {n:"Cloud light round 1200",f:"Cloud",cat:"Technical",mt:"Pendant",aw:.45,a:2.54,eq:1.39,d:1200,dim:"Ø1190 × 200 mm",note:"Ceiling island; cubical structure"},
  {n:"Cloud light oval 2400×1200",f:"Cloud",cat:"Technical",mt:"Pendant",aw:.45,a:4.94,eq:2.71,d:null,dim:"2400 × 1200 × 200 mm",note:"Oval ceiling island"},
  {n:"Cloud light round XL 2400",f:"Cloud",cat:"Technical",mt:"Pendant",aw:.45,a:10.85,eq:5.95,d:2400,note:"XL ceiling island"},
  {n:"Cloud acoustic round 1200",f:"Cloud",cat:"Technical",mt:"Pendant",aw:.45,a:2.54,eq:1.39,d:1200,dim:"Ø1190 × 200 mm",note:"Acoustic only; ceiling island"},
  {n:"Cloud acoustic oval 2400×1200",f:"Cloud",cat:"Technical",mt:"Pendant",aw:.45,a:4.94,eq:2.71,d:null,dim:"2400 × 1200 × 200 mm",note:"Acoustic only; oval"},
  {n:"Cloud acoustic round XL 2400",f:"Cloud",cat:"Technical",mt:"Pendant",aw:.45,a:10.85,eq:5.95,d:2400,note:"Acoustic only; XL"},
  {n:"Cone 750",f:"Cone",cat:"Technical",mt:"Pendant",aw:.65,a:.46,eq:.58,d:750,dim:"Ø750 × 255 mm",note:"Double PET + air; conical"},
  {n:"Cone 1000",f:"Cone",cat:"Technical",mt:"Pendant",aw:.65,a:.81,eq:1.01,d:980,dim:"Ø1000 × 320 mm",note:"Conical"},
  {n:"Sliced 800",f:"Sliced",cat:"Technical",mt:"Pendant",aw:.45,a:.85,eq:.47,d:800,note:"Bent PET shell; rounded"},
  {n:"Bold acoustic 1200×1200",f:"Bold",cat:"Technical",mt:"Ceiling baffle",aw:1,a:2.88,eq:2.85,d:null,dim:"1200 × 1200 × 170 mm",note:"Ceiling baffle; doubles active surface"},
  {n:"Twist low",f:"Twist",cat:"Decorative",mt:"Pendant",aw:.45,a:.42,eq:.19,d:300,dim:"Ø300 × 240 mm",note:"Twisted form; cluster for more effect"},
  {n:"Twist mid",f:"Twist",cat:"Decorative",mt:"Pendant",aw:.45,a:.42,eq:.19,d:255,dim:"Ø255 × 315 mm",note:"Twisted form; mid"},
  {n:"Twist high",f:"Twist",cat:"Decorative",mt:"Pendant",aw:.45,a:.42,eq:.19,d:215,dim:"Ø215 × 360 mm",note:"Twisted form; high"},
  {n:"Twist XL low",f:"Twist",cat:"Decorative",mt:"Pendant",aw:.45,a:1.2,eq:.53,d:450,dim:"Ø450 × 363 mm",note:"XL twisted form"},
  {n:"Twist XL mid",f:"Twist",cat:"Decorative",mt:"Pendant",aw:.45,a:1.2,eq:.53,d:400,dim:"Ø400 × 482 mm",note:"XL; mid"},
  {n:"Twist XL high",f:"Twist",cat:"Decorative",mt:"Pendant",aw:.45,a:1.2,eq:.53,d:350,dim:"Ø350 × 570 mm",note:"XL; high"},
  {n:"Twist Floor light",f:"Twist",cat:"Decorative",mt:"Floor standing",aw:.45,a:5.54,eq:2.72,d:450,dim:"450 × 1710 mm",note:"Floor standing; bass absorber"},
  {n:"Macaron light pendant 450",f:"Macaron",cat:"Decorative",mt:"Pendant",aw:.85,a:.38,eq:.38,d:450,dim:"Ø450 × 145 mm",note:"Multi-layer PET + air; high absorption"},
  {n:"Macaron light pendant 600",f:"Macaron",cat:"Decorative",mt:"Pendant",aw:.85,a:.68,eq:.69,d:600,dim:"Ø600 × 186 mm",note:"High absorption"},
  {n:"Macaron light pendant 800",f:"Macaron",cat:"Decorative",mt:"Pendant",aw:.85,a:1.21,eq:1.22,d:800,dim:"Ø800 × 200 mm",note:"High absorption"},
  {n:"Macaron acoustic pendant 450",f:"Macaron",cat:"Decorative",mt:"Pendant",aw:.85,a:.38,eq:.38,d:450,dim:"Ø450 × 145 mm",note:"Acoustic only; multi-layer + wool"},
  {n:"Macaron acoustic pendant 600",f:"Macaron",cat:"Decorative",mt:"Pendant",aw:.85,a:.68,eq:.69,d:600,dim:"Ø600 × 186 mm",note:"Acoustic only"},
  {n:"Macaron acoustic pendant 800",f:"Macaron",cat:"Decorative",mt:"Pendant",aw:.85,a:1.21,eq:1.22,d:800,dim:"Ø800 × 200 mm",note:"Acoustic only"},
  {n:"Macaron light wall 450",f:"Macaron",cat:"Decorative",mt:"Wall",aw:.6,a:.16,eq:.14,d:450,note:"Wall mounted; reduced absorption"},
  {n:"Macaron light wall 600",f:"Macaron",cat:"Decorative",mt:"Wall",aw:.6,a:.28,eq:.25,d:600,note:"Wall mounted"},
  {n:"Macaron light wall 800",f:"Macaron",cat:"Decorative",mt:"Wall",aw:.6,a:.5,eq:.45,d:800,note:"Wall mounted"},
  {n:"Macaron acoustic wall 450",f:"Macaron",cat:"Decorative",mt:"Wall",aw:.6,a:.16,eq:.14,d:450,note:"Acoustic only; wall"},
  {n:"Macaron acoustic wall 600",f:"Macaron",cat:"Decorative",mt:"Wall",aw:.6,a:.28,eq:.25,d:600,note:"Acoustic only; wall"},
  {n:"Macaron acoustic wall 800",f:"Macaron",cat:"Decorative",mt:"Wall",aw:.6,a:.5,eq:.45,d:800,note:"Acoustic only; wall"},
  {n:"Blooom standard",f:"Blooom",cat:"Decorative",mt:"Pendant",aw:.45,a:1.2,eq:.66,d:660,dim:"Ø660 × 375 mm",note:"Biophilic petal design"},
  {n:"Edge acoustic",f:"Edge",cat:"Decorative",mt:"Pendant",aw:.85,a:.64,eq:.65,d:104,note:"From waste material; high absorption"},
  {n:"Edge XL acoustic",f:"Edge",cat:"Decorative",mt:"Pendant",aw:.85,a:1.44,eq:1.45,d:140,dim:"Ø140 × 540 mm",note:"From waste material; XL"},
  {n:"JoJo 600",f:"JoJo",cat:"Decorative",mt:"Pendant",aw:1,a:.29,eq:.32,d:600,dim:"Ø600 × 75 mm",note:"24mm sandwich; 100% absorption"},
  {n:"JoJo 800",f:"JoJo",cat:"Decorative",mt:"Pendant",aw:1,a:.5,eq:.55,d:800,dim:"Ø800 × 75 mm",note:"24mm sandwich; 100% absorption"},
  {n:"Drop standard",f:"Drop",cat:"Decorative",mt:"Pendant",aw:.45,a:.88,eq:.48,d:450,dim:"Ø450 × 450 mm",note:"Two-tone lamella; from waste"},
  {n:"Cage oval",f:"Cage",cat:"Decorative",mt:"Pendant",aw:.45,a:1.09,eq:.6,d:null,dim:"1500 × 600 × 400 mm",note:"Open cage structure"},
  {n:"Podge standard",f:"Podge",cat:"Decorative",mt:"Pendant",aw:.45,a:.87,eq:.48,d:730,dim:"Ø730 × 300 mm",note:"Rounded shape with lamellae"},
  {n:"Spott standard",f:"Spott",cat:"Decorative",mt:"Pendant",aw:.45,a:.48,eq:.26,d:470,dim:"Ø470 × 470 mm",note:"PET slats; cluster for effect"},
  {n:"Spott XL",f:"Spott",cat:"Decorative",mt:"Pendant",aw:.45,a:1.14,eq:.63,d:740,dim:"Ø740 × 820 mm",note:"XL PET slats"},
  {n:"Pyknic floor",f:"Pyknic",cat:"Decorative",mt:"Floor standing",aw:.45,a:5.67,eq:2.78,d:725,dim:"Ø725 × 1700 mm",note:"Floor standing; bass absorber"},
];

window.FAMILIES = ["All", ...[...new Set(window.PRODUCTS.filter(p => !p.hidden).map(p => p.f))]];

window.EQ_BOUNDS = (() => {
  const vals = window.PRODUCTS.filter(p => !p.hidden).map(p => p.eq);
  return [Math.min(...vals), Math.max(...vals)];
})();

/* Best-known size, straight from the catalogued dimension — never the
 * shipping-carton size (RRP "Parcel Size" includes packaging, not the
 * fixture itself, so it's deliberately not used here).
 * - product.dim: full W×L(×H) or Ø×H confirmed against in-zee.nl's own
 *   product pages (2026-07-21) — always wins when present.
 * - Round fixtures without a confirmed dim: product.d is the diameter
 *   only → "Ø1200 mm" (no confirmed height yet).
 * - Rectangular/oval fixtures: product.d is null, but W×L is spelled out
 *   in the name (e.g. "Float Rect light 1200×2400") → recovered here.
 * - Single-number ovals (e.g. "Toad Oval 1750"): shown as-is, no Ø prefix
 *   since it's one axis of an oval, not a true diameter. */
window.getProductDimension = function (p) {
  if (p.dim) return p.dim;
  if (p.d) return `Ø${p.d} mm`;
  const rect = p.n.match(/(\d+)\s*×\s*(\d+)/);
  if (rect) return `${rect[1]} × ${rect[2]} mm`;
  const single = p.n.match(/(\d{3,4})(?!.*\d)/);
  if (single) return `${single[1]} mm`;
  return null;
};

window.FLOOR_MATERIALS = {
  "Unknown / not sure": .02,
  "Hard floor (concrete / tiles / poured)": .02,
  "Linoleum / vinyl / PVC": .04,
  "Parquet / laminate": .06,
  "Wooden floor on joists": .08,
  "Carpet tiles (office)": .15,
  "Fixed carpet (on concrete)": .37,
  "Deep pile carpet + underlay": .66,
};

window.WALL_MATERIALS = {
  "Unknown / not sure": .02,
  "Concrete / calcium silicate": .02,
  "Brickwork (exposed)": .04,
  "Tiles / natural stone": .01,
  "Plaster": .04,
  "Plasterboard (standard)": .05,
  "Plasterboard + insulation": .07,
  "Wood panels (solid)": .08,
  "Mostly glass (>50%)": .04,
  "Glass partition wall": .03,
  "Wood slat wall (direct mount)": .3,
  "Wood slat wall (on battens + insulation)": .62,
  "Soft wall covering": .3,
  "PET felt panels (direct mount)": .36,
  "Acoustic panels with cavity/absorber": .9,
};

window.CEILING_MATERIALS = {
  "Unknown / not sure": .02,
  "Concrete ceiling": .02,
  "Gypsum ceiling (closed)": .05,
  "Wooden ceiling": .08,
  "Wood slat ceiling on felt": .6,
  "Acoustic spray plaster": .7,
  "Metal ceiling (closed)": .06,
  "Metal ceiling (perforated)": .48,
  "Open ceiling (services exposed)": .06,
  "System ceiling (old / thin)": .42,
  "System ceiling (standard)": .65,
  "System ceiling (high absorption)": .92,
};

window.FURNISHING = {
  "Empty / shell": .005,
  "Sparse, hard furniture": .02,
  "Normal, mostly hard": .05,
  "Normal with upholstery": .08,
  "Dense / heavily upholstered (lounge)": .12,
};

window.EXTRAS = {
  "Plants / decoration": .01,
  "Curtains (light)": .02,
  "Curtains (heavy)": .05,
  "Acoustic desk screens": .06,
  "Room dividers": .08,
};

window.PERSON_AEQ = .46;

/* Presets start from a realistic but acoustically POOR baseline (hard,
 * untreated surfaces, no existing treatments) so there is clear, visible
 * headroom to improve — different per room. Extras are never pre-selected.
 * "Other" is the exception: a neutral, average room for unlisted cases. */
window.ROOM_PRESETS = {
  "Office":            { fl:"Parquet / laminate", wl:"Plaster", cl:"Gypsum ceiling (closed)", fu:"Normal, mostly hard", ex:[], t:.8 },
  "Open office":       { fl:"Carpet tiles (office)", wl:"Plaster", cl:"Gypsum ceiling (closed)", fu:"Normal, mostly hard", ex:[], t:.6 },
  "Meeting room":      { fl:"Carpet tiles (office)", wl:"Plasterboard (standard)", cl:"Gypsum ceiling (closed)", fu:"Normal, mostly hard", ex:[], t:.6 },
  "Classroom":         { fl:"Linoleum / vinyl / PVC", wl:"Plasterboard (standard)", cl:"Gypsum ceiling (closed)", fu:"Normal, mostly hard", ex:[], t:.6 },
  "Restaurant / café": { fl:"Hard floor (concrete / tiles / poured)", wl:"Plaster", cl:"Open ceiling (services exposed)", fu:"Normal, mostly hard", ex:[], t:1 },
  "Lobby / reception": { fl:"Hard floor (concrete / tiles / poured)", wl:"Mostly glass (>50%)", cl:"Concrete ceiling", fu:"Normal, mostly hard", ex:[], t:1 },
  "Public space":      { fl:"Hard floor (concrete / tiles / poured)", wl:"Mostly glass (>50%)", cl:"Concrete ceiling", fu:"Sparse, hard furniture", ex:[], t:1.2 },
  "Other":             { fl:"Carpet tiles (office)", wl:"Plasterboard (standard)", cl:"Gypsum ceiling (closed)", fu:"Normal with upholstery", ex:[], t:.8 },
};

window.RT60_NORMS = {
  "Open office":      { optimal:[0.4,0.6], acceptable:0.8 },
  "Office":           { optimal:[0.5,0.8], acceptable:1.0 },
  "Public space":     { optimal:[1.0,1.5], acceptable:1.8 },
  "Other":            { optimal:[0.5,0.8], acceptable:1.0 },
  "Cell office":      { optimal:[0.4,0.6], acceptable:0.8 },
  "Call center":      { optimal:[0.3,0.5], acceptable:0.6 },
  "Meeting room":     { optimal:[0.4,0.6], acceptable:0.7 },
  "Restaurant / café":{ optimal:[0.6,0.9], acceptable:1.2 },
  "Canteen":          { optimal:[0.6,0.9], acceptable:1.2 },
  "Lobby / reception":{ optimal:[0.8,1.2], acceptable:1.6 },
  "Classroom":        { optimal:[0.4,0.6], acceptable:0.8 },
  "Childcare":        { optimal:[0.4,0.6], acceptable:0.8 },
  "Healthcare":       { optimal:[0.6,0.8], acceptable:1.0 },
  "Retail / shop":    { optimal:[0.6,1.0], acceptable:1.4 },
  "(custom)":         { optimal:[0.5,0.8], acceptable:1.2 },
};
