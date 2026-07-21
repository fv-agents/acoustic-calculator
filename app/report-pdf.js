/* Lumenear Acoustic Calculator — Native vector PDF report generator.
   Draws the report entirely with jsPDF (no screenshot / no window.print()),
   so "Download report" produces a real, searchable .pdf file.
   Exports: window.generateReportPDF(data) */

(function () {
  const PAGE_W = 595.28, PAGE_H = 841.89; // A4, pt
  const MARGIN = 42;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const HEADER_BOTTOM = MARGIN + 54; // fixed height regardless of how many meta lines render
  const TOP_Y = HEADER_BOTTOM + 24; // page 1 — below the logo header
  const CONTINUATION_TOP = MARGIN + 14; // page 2+ — no repeated header
  const FOOTER_TOP = PAGE_H - MARGIN - 34;
  const BOTTOM_LIMIT = FOOTER_TOP - 6;

  const COLOR = {
    text: [26, 26, 26],
    textSec: [90, 88, 86],
    border: [216, 214, 211],
    trackBg: [236, 235, 232],
    accent: [200, 184, 154],
    accentDim: [139, 123, 99],
    ok: [74, 112, 80],
    warn: [138, 101, 16],
    alert: [138, 69, 40],
    before: [148, 163, 184],
  };

  const PALETTE = [
    [93, 126, 111], [126, 111, 93], [93, 111, 126],
    [111, 126, 93], [126, 93, 111], [107, 123, 139],
    COLOR.accent,
  ];

  function setFill(doc, c) { doc.setFillColor(c[0], c[1], c[2]); }
  function setDraw(doc, c) { doc.setDrawColor(c[0], c[1], c[2]); }
  function setText(doc, c) { doc.setTextColor(c[0], c[1], c[2]); }

  function sanitizeFilename(s) {
    return s.replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim();
  }

  function loadImage(src) {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  // Fixture photos live on lumenear.com, which sends no CORS headers — a
  // direct <img> load taints the canvas jsPDF needs to read pixels from.
  // Route those (and only those; the logo is same-origin) through our own
  // Netlify function, which re-serves the image with an open CORS header.
  function proxiedUrl(url) {
    return `/.netlify/functions/image-proxy?url=${encodeURIComponent(url)}`;
  }

  // Cross-origin images (fixture photos) throw at addImage() time if the
  // host doesn't send CORS headers, even though they loaded fine as an
  // <img>. Never let a missing/blocked photo break the whole PDF.
  function safeAddImage(doc, img, ...args) {
    if (!img) return false;
    try { doc.addImage(img, ...args); return true; }
    catch (e) { return false; }
  }

  /* ── Header (page 1 only) / Footer ── */
  function drawHeader(doc, data, logoImg) {
    // Left: project + client + date, then the tagline
    let leftY = MARGIN + 9;
    if (data.projectName) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setText(doc, COLOR.text);
      doc.text(`Project: ${data.projectName}`, MARGIN, leftY);
      leftY += 12;
    }
    if (data.client) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); setText(doc, COLOR.textSec);
      doc.text(data.client, MARGIN, leftY);
      leftY += 11;
    }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); setText(doc, COLOR.textSec);
    doc.text(data.dateStr, MARGIN, leftY);
    leftY += 13;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); setText(doc, COLOR.accentDim);
    doc.text('ACOUSTIC REPORT', MARGIN, leftY, { charSpace: 1.2 });

    // Right: logo only (bigger)
    if (logoImg) {
      const logoH = 30;
      const logoW = logoH * (logoImg.naturalWidth / logoImg.naturalHeight);
      safeAddImage(doc, logoImg, 'PNG', PAGE_W - MARGIN - logoW, MARGIN - 2, logoW, logoH);
    } else {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(18); setText(doc, COLOR.text);
      doc.text('LUMENEAR', PAGE_W - MARGIN, MARGIN + 14, { align: 'right' });
    }

    setDraw(doc, COLOR.text); doc.setLineWidth(1.1);
    doc.line(MARGIN, HEADER_BOTTOM, PAGE_W - MARGIN, HEADER_BOTTOM);
  }

  function drawFooter(doc, pageNum, totalPages, isLastPage) {
    setDraw(doc, COLOR.border); doc.setLineWidth(0.6);
    doc.line(MARGIN, FOOTER_TOP, PAGE_W - MARGIN, FOOTER_TOP);

    if (isLastPage) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); setText(doc, COLOR.textSec);
      doc.text('lumenear.com  ·  info@lumenear.com  ·  In-Zee BV  ·  VAT NL8652.93.909.B01', PAGE_W / 2, FOOTER_TOP + 13, { align: 'center' });
      doc.setFontSize(6.6);
      const legal = doc.splitTextToSize(
        'Indicative calculation, not a guaranteed result — Sabine formula, target bands per DIN 18041, absorption coefficients per ISO 11654 / EN-ISO 354. ' +
        'Lumenear accepts no liability for deviations between this estimate and the measured result. ' +
        'Lumenear absorption assumes ideal placement of the fixtures per Lumenear guidance (near the sound source).',
        CONTENT_W - 40
      );
      doc.text(legal, PAGE_W / 2, FOOTER_TOP + 22, { align: 'center' });
    }

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setText(doc, COLOR.textSec);
    doc.text(`${pageNum} / ${totalPages}`, PAGE_W - MARGIN, FOOTER_TOP + 13, { align: 'right' });
  }

  function ensureSpace(doc, cur, data, needed) {
    if (cur.y + needed > BOTTOM_LIMIT) {
      doc.addPage();
      setFill(doc, [255, 255, 255]); doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
      cur.y = CONTINUATION_TOP;
    }
  }

  function sectionTitle(doc, cur, data, text, minFollow) {
    // Reserve room for the title plus a minimum slice of the content that
    // follows it, so a heading never ends up stranded alone at page-bottom.
    ensureSpace(doc, cur, data, 24 + (minFollow || 0));
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); setText(doc, COLOR.accentDim);
    doc.text(text.toUpperCase(), MARGIN, cur.y, { charSpace: 0.6 });
    cur.y += 16;
  }

  /* ── Summary ── */
  function drawSummary(doc, cur, data) {
    sectionTitle(doc, cur, data, 'Summary', 40);
    const parts = [
      `${data.roomType} of ${data.volume.toFixed(0)} m³ (${data.l} × ${data.w} × ${data.h} m).`,
      data.fixturesCount > 0
        ? `Reverberation time drops from ${data.rt0.toFixed(1)}s to ${data.rt1.toFixed(1)}s with ${data.fixturesCount} Lumenear fixture${data.fixturesCount === 1 ? '' : 's'} specified.`
        : `Reverberation time is currently ${data.rt0.toFixed(1)}s — no Lumenear fixtures specified yet.`,
      `Target for ${data.roomType.toLowerCase()} is ${data.target.toFixed(1)}s.`,
      data.rt1 <= data.target
        ? `Rating: ${data.ratingText} — the specification meets this target.`
        : `Rating: ${data.ratingText} — adding ~${data.aNeed.toFixed(1)} m² more absorption would reach the target.`,
    ];
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); setText(doc, COLOR.text);
    const wrapped = doc.splitTextToSize(parts.join('  '), CONTENT_W);
    ensureSpace(doc, cur, data, wrapped.length * 14 + 6);
    doc.text(wrapped, MARGIN, cur.y, { lineHeightFactor: 1.4 });
    cur.y += wrapped.length * 14 + 18;
  }

  /* ── Hero numbers + KPI tiles ── */
  function drawResultsHero(doc, cur, data) {
    sectionTitle(doc, cur, data, 'Result', 60);
    ensureSpace(doc, cur, data, 56);

    const colW = CONTENT_W / 3;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setText(doc, COLOR.textSec);
    doc.text('BEFORE', MARGIN + colW * 0.5, cur.y, { align: 'center' });
    doc.text('AFTER LUMENEAR', MARGIN + colW * 1.5, cur.y, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(30);
    setText(doc, COLOR.before);
    doc.text(`${data.rt0.toFixed(1)}s`, MARGIN + colW * 0.5, cur.y + 27, { align: 'center' });
    setText(doc, COLOR.accentDim);
    doc.text(`${data.rt1.toFixed(1)}s`, MARGIN + colW * 1.5, cur.y + 27, { align: 'center' });
    if (data.fixturesCount > 0 && data.reductionPct > 0.5) {
      setText(doc, COLOR.ok); doc.setFontSize(22);
      doc.text(`-${Math.round(data.reductionPct)}%`, MARGIN + colW * 2.5, cur.y + 20, { align: 'center' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
      doc.text('REDUCTION', MARGIN + colW * 2.5, cur.y + 32, { align: 'center' });
    }
    cur.y += 46;

    const coverageColor = data.coveragePct >= 100 ? COLOR.ok : data.coveragePct >= 80 ? COLOR.warn : COLOR.alert;
    const tiles = [
      { value: (data.fixturesCount > 0 && data.reductionPct > 0.5) ? `-${Math.round(data.reductionPct)}%` : '—', label: 'RT60 reduction', color: (data.fixturesCount > 0 && data.reductionPct > 0.5) ? COLOR.ok : COLOR.textSec },
      { value: `${data.lumenearAb.toFixed(1)} m²`, label: 'Lumenear absorption', color: COLOR.accentDim },
      { value: String(data.fixturesCount), label: 'Fixtures specified', color: COLOR.text },
      { value: data.coveragePct > 0 ? `${Math.round(data.coveragePct)}%` : '—', label: 'Target coverage', color: coverageColor },
    ];
    const gap = 10, tileW = (CONTENT_W - gap * 3) / 4, tileH = 44;
    ensureSpace(doc, cur, data, tileH + 16);
    tiles.forEach((t, i) => {
      const tx = MARGIN + i * (tileW + gap);
      setDraw(doc, COLOR.border); doc.setLineWidth(0.7);
      doc.roundedRect(tx, cur.y, tileW, tileH, 3, 3, 'S');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(15); setText(doc, t.color);
      doc.text(t.value, tx + tileW / 2, cur.y + 22, { align: 'center' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(6.6); setText(doc, COLOR.textSec);
      doc.text(t.label.toUpperCase(), tx + tileW / 2, cur.y + 34, { align: 'center', charSpace: 0.2 });
    });
    cur.y += tileH + 20;
  }

  /* ── RT60 comparison bar chart ── */
  function drawComparisonBar(doc, x, y, w, data) {
    const max = Math.max(data.rt0, data.rt1, data.target, 0.5) * 1.25;
    const labelW = 96, valueW = 46, barH = 13, rowGap = 11;
    const trackX = x + labelW, trackW = w - labelW - valueW;
    const scale = v => trackX + (v / max) * trackW;

    const rows = [
      { label: 'Without Lumenear', value: data.rt0, color: COLOR.before },
      { label: 'With Lumenear', value: data.rt1, color: data.rt1 <= data.optHigh ? COLOR.ok : data.rt1 <= data.optHigh * 1.33 ? COLOR.warn : COLOR.alert },
    ];

    // optimal zone band across both rows
    const zoneX1 = scale(data.optLow), zoneX2 = scale(data.optHigh);
    setFill(doc, [222, 231, 223]);
    doc.rect(zoneX1, y - 2, Math.max(zoneX2 - zoneX1, 1), (barH + rowGap) * rows.length - rowGap + 4, 'F');

    rows.forEach((r, i) => {
      const ry = y + i * (barH + rowGap);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); setText(doc, COLOR.textSec);
      doc.text(r.label, x, ry + barH / 2 + 3);
      setFill(doc, COLOR.trackBg);
      doc.rect(trackX, ry, trackW, barH, 'F');
      setFill(doc, r.color);
      doc.rect(trackX, ry, Math.max((scale(r.value) - trackX), 2), barH, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); setText(doc, r.color);
      doc.text(`${r.value.toFixed(1)}s`, trackX + trackW + 8, ry + barH / 2 + 3);
    });

    // target line
    const targetX = scale(data.target);
    const rowsBottom = y + rows.length * (barH + rowGap) - rowGap;
    setDraw(doc, COLOR.ok); doc.setLineWidth(1.3);
    doc.line(targetX, y - 4, targetX, rowsBottom + 4);

    // scale ticks
    const scaleY = rowsBottom + 16;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); setText(doc, COLOR.textSec);
    const step = max <= 2 ? 0.5 : 1;
    for (let v = 0; v <= max; v += step) {
      doc.text(v.toFixed(1), scale(v), scaleY, { align: 'center' });
    }
    doc.setFontSize(8);
    const legendY = scaleY + 14;
    doc.text(`Target: ${data.target.toFixed(1)}s`, x, legendY);
    doc.text(`Optimal range: ${data.optLow.toFixed(1)}–${data.optHigh.toFixed(1)}s`, x + 90, legendY);
  }

  /* ── Absorption donut ── */
  function drawDonut(doc, cx, cy, r, strokeW, segments) {
    const total = segments.reduce((s, x) => s + x.value, 0);
    if (total <= 0.01) return;
    const steps = 240;
    let cum = 0;
    const bounds = segments.map(s => (cum += s.value / total));
    doc.setLineWidth(strokeW);
    for (let i = 0; i < steps; i++) {
      const t0 = i / steps, t1 = (i + 1) / steps, mid = (t0 + t1) / 2;
      let idx = bounds.findIndex(b => mid < b);
      if (idx === -1) idx = segments.length - 1;
      setDraw(doc, segments[idx].color);
      const a0 = -Math.PI / 2 + t0 * 2 * Math.PI;
      const a1 = -Math.PI / 2 + t1 * 2 * Math.PI;
      doc.line(cx + r * Math.cos(a0), cy + r * Math.sin(a0), cx + r * Math.cos(a1), cy + r * Math.sin(a1));
    }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(19); setText(doc, COLOR.accentDim);
    doc.text(total.toFixed(1), cx, cy - 2, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.6); setText(doc, COLOR.textSec);
    doc.text('M² AEQ TOTAL', cx, cy + 9, { align: 'center', charSpace: 0.3 });
  }

  function drawAbsorptionSection(doc, x, y, w, data) {
    const raw = [
      { label: 'Floor', value: data.parts.fAb, color: PALETTE[0] },
      { label: 'Walls', value: data.parts.wAb, color: PALETTE[1] },
      { label: 'Ceiling', value: data.parts.cAb, color: PALETTE[2] },
      { label: 'Furnishing', value: data.parts.fuAb, color: PALETTE[3] },
      { label: 'Extras', value: data.parts.exAb, color: PALETTE[4] },
      { label: 'Persons', value: data.parts.pAb, color: PALETTE[5] },
      { label: 'Lumenear', value: data.lumenearAb, color: COLOR.accent },
    ].filter(s => s.value > 0.01);
    if (!raw.length) return 0;
    const total = raw.reduce((s, x) => s + x.value, 0);

    const r = 46, cx = x + r + 6, cy = y + r;
    drawDonut(doc, cx, cy, r, 17, raw);

    let ly = y + 4;
    const legendX = x + r * 2 + 30;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    raw.forEach(s => {
      const pct = Math.round((s.value / total) * 100);
      setFill(doc, s.color); doc.rect(legendX, ly - 7, 8, 8, 'F');
      setText(doc, COLOR.text);
      doc.text(s.label, legendX + 14, ly);
      doc.setFont('helvetica', 'bold');
      doc.text(`${s.value.toFixed(1)} m²`, legendX + 200, ly, { align: 'right' });
      doc.setFont('helvetica', 'normal'); setText(doc, COLOR.textSec);
      doc.text(`${pct}%`, legendX + 230, ly, { align: 'right' });
      ly += 17;
    });
    return r * 2 + 10;
  }

  /* ── Generic key/value table ── */
  function drawKeyValueTable(doc, cur, data, rows) {
    const rowH = 20;
    ensureSpace(doc, cur, data, rows.length * rowH + 10);
    rows.forEach((row, i) => {
      const ry = cur.y + i * rowH;
      // Divider sits 8pt below the previous row's baseline and 12pt above
      // this row's text — enough clearance so the line never cuts through
      // either row's ascenders.
      const dividerY = ry - rowH + 8;
      if (row.total) {
        setDraw(doc, COLOR.text); doc.setLineWidth(1);
        doc.line(MARGIN, dividerY, PAGE_W - MARGIN, dividerY);
      } else if (i > 0) {
        setDraw(doc, COLOR.border); doc.setLineWidth(0.5);
        doc.line(MARGIN, dividerY, PAGE_W - MARGIN, dividerY);
      }
      doc.setFont('helvetica', row.total ? 'bold' : 'normal'); doc.setFontSize(9.5);
      setText(doc, row.total ? COLOR.text : COLOR.textSec);
      doc.text(row.label, MARGIN, ry);
      setText(doc, row.total ? COLOR.accentDim : COLOR.text);
      doc.text(row.value, PAGE_W - MARGIN, ry, { align: 'right' });
    });
    cur.y += rows.length * rowH + 16;
  }

  /* ── Fixtures table + share bar ── */
  function drawFixturesTable(doc, cur, data) {
    if (!data.fixtures.length) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); setText(doc, COLOR.textSec);
      ensureSpace(doc, cur, data, 20);
      doc.text('No Lumenear fixtures specified for this room yet.', MARGIN, cur.y);
      cur.y += 24;
      return;
    }

    const cols = [
      { key: 'name', label: 'Product', x: MARGIN, align: 'left' },
      { key: 'qty', label: 'Qty', x: PAGE_W - MARGIN - 220, align: 'right' },
      { key: 'aw', label: 'aw', x: PAGE_W - MARGIN - 160, align: 'right' },
      { key: 'eqEach', label: 'Aeq/unit', x: PAGE_W - MARGIN - 90, align: 'right' },
      { key: 'eqTotal', label: 'Total', x: PAGE_W - MARGIN, align: 'right' },
    ];
    const rowH = 18;
    // Reserve room for the header row + at least one data row, so the
    // header never ends up alone at the bottom of a page.
    ensureSpace(doc, cur, data, 26 + rowH);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); setText(doc, COLOR.textSec);
    cols.forEach(c => doc.text(c.label.toUpperCase(), c.x, cur.y, { align: c.align }));
    cur.y += 8;
    setDraw(doc, COLOR.text); doc.setLineWidth(0.8);
    doc.line(MARGIN, cur.y, PAGE_W - MARGIN, cur.y);
    cur.y += 14;

    data.fixtures.forEach((f, i) => {
      // Reserve room for the totals row too when drawing the last fixture,
      // so that row never ends up stranded alone on the next page.
      const isLast = i === data.fixtures.length - 1;
      ensureSpace(doc, cur, data, isLast ? rowH + 30 : rowH);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); setText(doc, COLOR.text);
      doc.text(f.name, MARGIN, cur.y);
      setText(doc, COLOR.textSec);
      doc.text(`${f.qty}×`, PAGE_W - MARGIN - 220, cur.y, { align: 'right' });
      doc.text(String(f.aw), PAGE_W - MARGIN - 160, cur.y, { align: 'right' });
      doc.text(`${f.eqEach.toFixed(2)} m²`, PAGE_W - MARGIN - 90, cur.y, { align: 'right' });
      doc.setFont('helvetica', 'bold'); setText(doc, COLOR.accentDim);
      doc.text(`${f.eqTotal.toFixed(1)} m²`, PAGE_W - MARGIN, cur.y, { align: 'right' });
      cur.y += rowH;
    });

    ensureSpace(doc, cur, data, rowH + 6);
    setDraw(doc, COLOR.text); doc.setLineWidth(0.8);
    doc.line(MARGIN, cur.y - 12, PAGE_W - MARGIN, cur.y - 12);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); setText(doc, COLOR.text);
    doc.text('Total Lumenear absorption', MARGIN, cur.y);
    setText(doc, COLOR.accentDim);
    doc.text(`${data.lumenearAb.toFixed(1)} m² Aeq`, PAGE_W - MARGIN, cur.y, { align: 'right' });
    cur.y += rowH + 12;

    // Share-of-total bar
    if (data.fixtures.length > 1 && data.lumenearAb > 0.01) {
      ensureSpace(doc, cur, data, 34);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); setText(doc, COLOR.textSec);
      doc.text('SHARE OF LUMENEAR ABSORPTION', MARGIN, cur.y);
      cur.y += 8;
      const barH = 16;
      let bx = MARGIN;
      data.fixtures.forEach((f, i) => {
        const segW = (f.eqTotal / data.lumenearAb) * CONTENT_W;
        setFill(doc, PALETTE[i % PALETTE.length]);
        doc.rect(bx, cur.y, Math.max(segW, 0.5), barH, 'F');
        bx += segW;
      });
      cur.y += barH + 16;
    }
  }

  /* ── Fixture photo grid — 3 cards per row, photo + key specs ── */
  function drawFixtureGrid(doc, cur, data) {
    if (!data.fixtures.length) return;
    sectionTitle(doc, cur, data, 'Product details', 190);

    const cols = 3, gap = 14;
    const cardW = (CONTENT_W - gap * (cols - 1)) / cols;
    const imgBoxH = 82, cardH = 178;

    const rowsCount = Math.ceil(data.fixtures.length / cols);
    for (let row = 0; row < rowsCount; row++) {
      ensureSpace(doc, cur, data, cardH + 10);
      for (let c = 0; c < cols; c++) {
        const idx = row * cols + c;
        if (idx >= data.fixtures.length) break;
        const f = data.fixtures[idx];
        const cx = MARGIN + c * (cardW + gap);
        const cy = cur.y;

        setDraw(doc, COLOR.border); doc.setLineWidth(0.7);
        doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'S');

        if (f._img) {
          const iw = f._img.naturalWidth, ih = f._img.naturalHeight;
          const boxW = cardW - 16, boxH = imgBoxH;
          const scale = Math.min(boxW / iw, boxH / ih);
          const dw = iw * scale, dh = ih * scale;
          safeAddImage(doc, f._img, 'PNG', cx + (cardW - dw) / 2, cy + 8 + (boxH - dh) / 2, dw, dh);
        }

        // Quantity badge — top-right corner, drawn after the photo so it
        // always stays on top and stays legible.
        const badgeW = 30, badgeH = 17;
        setFill(doc, COLOR.accent);
        doc.roundedRect(cx + cardW - badgeW - 7, cy + 7, badgeW, badgeH, 8, 8, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); setText(doc, COLOR.text);
        doc.text(`× ${f.qty}`, cx + cardW - badgeW / 2 - 7, cy + 7 + badgeH / 2 + 3.2, { align: 'center' });

        let ty = cy + imgBoxH + 24;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); setText(doc, COLOR.text);
        const nameLines = doc.splitTextToSize(f.name, cardW - 14).slice(0, 2);
        doc.text(nameLines, cx + cardW / 2, ty, { align: 'center' });
        ty += nameLines.length * 11 + 6;

        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.8); setText(doc, COLOR.textSec);
        const specLine = f.watt != null && f.lm != null ? `${f.watt} W · ${f.lm} lm` : `aw ${f.aw}`;
        doc.text(specLine, cx + cardW / 2, ty, { align: 'center' });
        ty += 11;

        doc.text([f.dimension, `${f.eqEach.toFixed(2)} m² Aeq each`].filter(Boolean).join('  ·  '),
          cx + cardW / 2, ty, { align: 'center' });
      }
      cur.y += cardH + 12;
    }
  }

  /* ── Main entry point ── */
  async function generateReportPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const cur = { y: TOP_Y };
    const [logoImg, fixtureImgs] = await Promise.all([
      loadImage('img/lumenear-logo.png'),
      Promise.all(data.fixtures.map(f => (f.img ? loadImage(proxiedUrl(f.img)) : Promise.resolve(null)))),
    ]);
    data.fixtures.forEach((f, i) => { f._img = fixtureImgs[i]; });

    drawHeader(doc, data, logoImg);
    drawSummary(doc, cur, data);
    drawResultsHero(doc, cur, data);

    sectionTitle(doc, cur, data, 'Acoustic result detail', 90);
    drawComparisonBar(doc, MARGIN, cur.y, CONTENT_W, data);
    cur.y += 90;

    ensureSpace(doc, cur, data, 130);
    const donutH = drawAbsorptionSection(doc, MARGIN, cur.y, CONTENT_W, data) || 0;
    cur.y += donutH > 0 ? donutH + 16 : 0;

    sectionTitle(doc, cur, data, 'Room overview (space & materials)', 60);
    drawKeyValueTable(doc, cur, data, [
      { label: 'Room type / target', value: `${data.roomType} — ${data.target.toFixed(1)}s` },
      { label: 'Dimensions', value: `${data.l} × ${data.w} × ${data.h} m` },
      { label: 'Volume', value: `${data.volume.toFixed(0)} m³` },
      { label: 'Floor', value: data.floorMaterial },
      { label: 'Walls', value: data.wallMaterial },
      { label: 'Ceiling', value: data.ceilingMaterial },
      ...(data.occupancy > 0 ? [{ label: 'Occupancy', value: `${data.occupancy} persons` }] : []),
      ...(data.extras.length ? [{ label: 'Existing treatments', value: data.extras.join(', ') }] : []),
      { label: 'Total room absorption', value: `${data.roomAb.toFixed(1)} m² Aeq`, total: true },
    ]);

    sectionTitle(doc, cur, data, 'Fixtures specified', 44);
    drawFixturesTable(doc, cur, data);
    drawFixtureGrid(doc, cur, data);

    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      drawFooter(doc, p, totalPages, p === totalPages);
    }

    const label = data.projectName || data.roomType;
    doc.save(`Lumenear - ${sanitizeFilename(label)} - acoustic report.pdf`);
  }

  Object.assign(window, { generateReportPDF });
})();
