// Simple DWI to HTML generator for PDF printing
// Uses browser print-to-PDF since puppeteer requires a browser binary

export function generateDwiHtml(dwi) {
  const stappen = dwi.stappen || (dwi.secties ? dwi.secties.flatMap(s => s.stappen) : [])

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <title>${dwi.id} — ${dwi.titel}</title>
  <style>
    @page { size: A4; margin: 2.5cm 2.5cm 2.5cm 3cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Calibri, 'Segoe UI', sans-serif; color: #333; font-size: 11pt; line-height: 1.5; }

    .header { background: #005A9C; color: white; padding: 20px 24px; margin: -2.5cm -2.5cm 24px -3cm;
      padding-left: 3cm; padding-right: 2.5cm; padding-top: 2.5cm; }
    .header h1 { font-size: 22pt; margin-bottom: 4px; }
    .header .subtitle { font-size: 11pt; opacity: 0.85; }
    .header .id { font-size: 10pt; font-family: monospace; background: rgba(255,255,255,0.15);
      padding: 2px 8px; border-radius: 4px; display: inline-block; margin-top: 8px; }

    .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px;
      border: 1px solid #ddd; border-radius: 8px; padding: 12px; background: #f8f9fa; }
    .meta-item label { display: block; font-size: 8pt; color: #595959; text-transform: uppercase; }
    .meta-item span { font-weight: 600; font-size: 10pt; }

    .section { margin-bottom: 20px; break-inside: avoid; }
    .section-title { font-size: 14pt; font-weight: 700; color: #005A9C; border-bottom: 2px solid #D5E8F0;
      padding-bottom: 6px; margin-bottom: 12px; }

    .badge-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
    .badge { background: #D5E8F0; color: #004678; padding: 3px 10px; border-radius: 12px;
      font-size: 9pt; font-weight: 600; }
    .badge-orange { background: #FFF3E0; color: #E8750A; }

    .stap { margin-bottom: 16px; break-inside: avoid; border-left: 3px solid #005A9C; padding-left: 12px; }
    .stap-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .stap-nummer { background: #005A9C; color: white; width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12pt; flex-shrink: 0; }
    .stap-titel { font-size: 12pt; font-weight: 700; }
    .stap-beschrijving { font-size: 10pt; color: #444; margin-bottom: 6px; }

    .substappen { list-style: none; padding: 0; margin: 6px 0 6px 36px; }
    .substappen li { font-size: 9pt; padding: 2px 0; }
    .substappen li::before { content: counter(sub, lower-alpha) ") "; counter-increment: sub;
      font-weight: 600; color: #005A9C; }
    .substappen { counter-reset: sub; }

    .waarschuwing { background: #FFF3E0; border-left: 3px solid #E8750A; padding: 8px 12px;
      margin: 6px 0; border-radius: 0 6px 6px 0; font-size: 9pt; }
    .waarschuwing::before { content: "⚠ WAARSCHUWING: "; font-weight: 700; color: #E8750A; }
    .tip { background: #E8F5E9; border-left: 3px solid #00A651; padding: 8px 12px;
      margin: 6px 0; border-radius: 0 6px 6px 0; font-size: 9pt; }
    .tip::before { content: "💡 TIP: "; font-weight: 700; color: #00A651; }

    table { width: 100%; border-collapse: collapse; font-size: 9pt; margin-top: 8px; }
    th { background: #005A9C; color: white; padding: 8px; text-align: left; font-weight: 600; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) td { background: #f8f9fa; }

    .important { background: #FFF3E0; border: 1px solid #E8750A; border-radius: 8px; padding: 12px;
      margin-bottom: 16px; }
    .important-title { font-weight: 700; color: #E8750A; margin-bottom: 6px; font-size: 11pt; }
    .important li { font-size: 10pt; margin-left: 16px; margin-bottom: 4px; }

    .footer { margin-top: 24px; padding-top: 12px; border-top: 2px solid #D5E8F0;
      font-size: 8pt; color: #999; text-align: center; }

    @media print {
      .header { break-after: avoid; }
      .stap { break-inside: avoid; }
    }
  </style>
</head>
<body>

<div class="header">
  <h1>${escHtml(dwi.titel)}</h1>
  <div class="subtitle">${escHtml(dwi.machine || '')}</div>
  <span class="id">${escHtml(dwi.id)}</span>
</div>

<div class="meta-grid">
  <div class="meta-item"><label>Auteur</label><span>${escHtml(dwi.auteur)}</span></div>
  <div class="meta-item"><label>Versie</label><span>v${escHtml(dwi.versie || '1.0')}</span></div>
  <div class="meta-item"><label>Datum</label><span>${escHtml(dwi.datum || '')}</span></div>
  <div class="meta-item"><label>Goedgekeurd</label><span>${escHtml(dwi.goedgekeurd || '-')}</span></div>
</div>

${dwi.opmerkingenImportant?.length ? `
<div class="important">
  <div class="important-title">⚠ Belangrijke opmerkingen</div>
  <ul>${dwi.opmerkingenImportant.map(o => `<li>${escHtml(o)}</li>`).join('')}</ul>
</div>` : ''}

<div class="section">
  <div class="section-title">Veiligheid & Gereedschap</div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
    <div>
      <strong style="font-size: 10pt; color: #E8750A;">PBM (Veiligheid)</strong>
      <div class="badge-row" style="margin-top: 6px;">
        ${(dwi.pbm || []).map(p => `<span class="badge badge-orange">${escHtml(p)}</span>`).join('')}
      </div>
    </div>
    <div>
      <strong style="font-size: 10pt; color: #005A9C;">Gereedschap</strong>
      <div class="badge-row" style="margin-top: 6px;">
        ${(dwi.gereedschap || []).map(g => `<span class="badge">${escHtml(g)}</span>`).join('')}
      </div>
    </div>
  </div>
</div>

${dwi.secties?.length ? dwi.secties.map(sectie => `
<div class="section">
  <div class="section-title">${sectie.nummer}. ${escHtml(sectie.titel)}</div>
  ${sectie.stappen.map(stapHtml).join('')}
</div>`).join('') : ''}

${!dwi.secties?.length && stappen.length ? `
<div class="section">
  <div class="section-title">Werkstappen</div>
  ${stappen.map(stapHtml).join('')}
</div>` : ''}

${dwi.kpis?.length ? `
<div class="section">
  <div class="section-title">Kwaliteitsindicatoren (KPI)</div>
  <ul style="margin-left: 16px;">${dwi.kpis.map(k => `<li style="font-size: 10pt; margin-bottom: 4px;">${escHtml(k)}</li>`).join('')}</ul>
</div>` : ''}

${dwi.afwijkingen?.length ? `
<div class="section">
  <div class="section-title">Afwijkingen & Storingen</div>
  <table>
    <thead><tr><th>Afwijking</th><th>Oorzaak</th><th>Actie</th></tr></thead>
    <tbody>${dwi.afwijkingen.map(a => `<tr><td style="color: #c00; font-weight: 600;">${escHtml(a.afwijking)}</td><td>${escHtml(a.oorzaak)}</td><td style="font-weight: 600;">${escHtml(a.actie)}</td></tr>`).join('')}</tbody>
  </table>
</div>` : ''}

<div class="footer">
  Timmermans Hardglas B.V. — Handelsstraat 55-57 | 7772 TS Hardenberg | ${dwi.id} v${dwi.versie || '1.0'}
  <br>Dit document is gegenereerd vanuit het DWI-platform. Volgende review: ${dwi.volgendeReview || '-'}
</div>

</body>
</html>`
}

function stapHtml(stap) {
  return `
<div class="stap">
  <div class="stap-header">
    <div class="stap-nummer">${stap.nummer}</div>
    <div class="stap-titel">${escHtml(stap.titel)}</div>
  </div>
  <div class="stap-beschrijving">${escHtml(stap.beschrijving)}</div>
  ${stap.substappen?.length ? `<ul class="substappen">${stap.substappen.map(s => `<li>${escHtml(s)}</li>`).join('')}</ul>` : ''}
  ${stap.waarschuwing ? `<div class="waarschuwing">${escHtml(stap.waarschuwing)}</div>` : ''}
  ${stap.tip ? `<div class="tip">${escHtml(stap.tip)}</div>` : ''}
</div>`
}

function escHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // Bold markdown
}
