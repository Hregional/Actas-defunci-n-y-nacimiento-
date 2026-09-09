/**
 * CSS compartido para los previews de impresión.
 * - Formato hoja legal (oficio)
 * - Color negro (excepto logos que van a color)
 * - Frente en página 1, reverso en página 2
 * - Mismo formato para Nacimiento y Defunción
 */
export const PRINT_CSS = `
  @page {
    size: legal portrait;
    margin: 6mm 8mm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 7.5pt;
    color: #000;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── Header del formulario ─────────────────────────────── */
  .form-header {
    border: 1.5px solid #000;
    padding: 4px 6px;
    margin-bottom: 4px;
  }
  .form-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
  }
  .form-header-top img { height: 34px; }
  .form-header-center { text-align: center; flex: 1; padding: 0 8px; }
  .form-header-center h1 { font-size: 11pt; font-weight: 800; }
  .form-header-center h2 { font-size: 9pt; font-weight: 700; }
  .form-header-center .sub { font-size: 7pt; font-style: italic; }
  .form-header-rev { font-size: 5.5pt; text-align: right; }
  .form-header-nota {
    font-size: 6pt;
    color: #333;
    text-align: center;
    margin-top: 2px;
    font-style: italic;
  }

  /* ── Barra de sección ──────────────────────────────────── */
  .sec-bar {
    background: #000;
    color: #fff;
    font-size: 7pt;
    font-weight: 800;
    letter-spacing: 0.05em;
    padding: 3px 6px;
    margin: 5px 0 3px;
    font-family: Arial, Helvetica, sans-serif;
  }

  /* ── Aviso especial ────────────────────────────────────── */
  .aviso {
    background: #000;
    color: #fff;
    text-align: center;
    font-weight: 700;
    font-size: 6.5pt;
    padding: 2px 4px;
    margin: 3px 0;
  }

  /* ── Fila de campos ────────────────────────────────────── */
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 3px;
  }

  /* ── Campo individual ──────────────────────────────────── */
  .f          { flex: 1; min-width: 50px; }
  .f-full     { flex: 0 0 100%; }
  .f-half     { flex: 0 0 calc(50% - 2px); }
  .f-third    { flex: 0 0 calc(33.33% - 3px); }
  .f-quarter  { flex: 0 0 calc(25% - 3px); }
  .f-fifth    { flex: 0 0 calc(20% - 4px); }

  .f-lbl {
    font-size: 6pt;
    color: #000;
    font-weight: 600;
    display: block;
    margin-bottom: 1px;
    line-height: 1.2;
    font-family: Arial, Helvetica, sans-serif;
  }
  .f-val {
    border-bottom: 1.5px solid #000;
    min-height: 14px;
    font-size: 7.5pt;
    padding-bottom: 1px;
    font-weight: 700;
    font-family: Arial, Helvetica, sans-serif;
    word-break: break-word;
    color: #000;
  }

  /* ── Causa de defunción ────────────────────────────────── */
  .causa-box {
    border: 1px solid #000;
    padding: 3px;
    margin-bottom: 3px;
  }
  .causa-lbl { font-size: 6pt; color: #000; font-weight: 600; font-style: italic; margin-bottom: 2px; font-family: Arial, Helvetica, sans-serif; }
  .causa-row { display: flex; gap: 6px; align-items: flex-end; margin-bottom: 3px; }
  .causa-key { font-size: 7.5pt; font-weight: 800; width: 16px; flex-shrink: 0; font-family: Arial, Helvetica, sans-serif; }
  .causa-val { flex: 3; border-bottom: 1.5px solid #000; min-height: 13px; font-size: 7.5pt; font-weight: 700; font-family: Arial, Helvetica, sans-serif; }
  .causa-int { flex: 1; text-align: center; }
  .causa-int-lbl { font-size: 5.5pt; color: #000; font-weight: 600; font-family: Arial, Helvetica, sans-serif; }
  .causa-int-val { border-bottom: 1.5px solid #000; min-height: 13px; font-size: 7.5pt; font-weight: 700; font-family: Arial, Helvetica, sans-serif; }
  .causa-note { font-size: 5pt; color: #555; margin-top: 3px; font-style: italic; }
  .causa-sep  { border-top: 1px dashed #000; padding-top: 3px; margin-top: 3px; }

  /* ── Bloque de cierre legal ────────────────────────────── */
  .close-blk {
    border: 1px solid #000;
    padding: 4px;
    margin-top: 5px;
    display: flex;
    gap: 6px;
  }
  .sello-box {
    border: 1px solid #000;
    width: 90px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-shrink: 0;
    font-size: 5.5pt;
  }
  .timbre-box {
    border: 1px solid #000;
    width: 70px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-shrink: 0;
    font-size: 5.5pt;
  }
  .legal-txt {
    font-size: 6pt;
    flex: 1;
    line-height: 1.6;
  }

  /* ── Salto de página (frente → reverso) ────────────────── */
  .page-break {
    page-break-before: always;
    break-before: page;
  }

  /* ── Nota al pie ───────────────────────────────────────── */
  .nota-pie {
    font-size: 6pt;
    color: #555;
    font-style: italic;
    text-align: center;
    margin-top: 4px;
  }
  .continua {
    font-size: 6pt;
    text-align: right;
    margin-top: 2px;
  }

  /* ── Reverso Nacimiento: huellas ───────────────────────── */
  .huellas-wrap {
    display: flex;
    gap: 8px;
    margin-top: 6px;
  }
  .fp-plantar-lbl  { font-size: 6pt; text-align: center; margin-bottom: 3px; }
  .fp-plantar      { border: 1px solid #000; height: 100px; }
  .fp-small-col    { display: flex; flex-direction: column; gap: 6px; }
  .fp-small-lbl    { font-size: 5.5pt; text-align: center; margin-bottom: 2px; }
  .fp-small        { border: 1px solid #000; height: 45px; }

  /* ── Reverso Nacimiento / Defunción: instrucciones ─────── */
  .rev-wrap { margin-top: 6px; border-top: 1.5px solid #000; padding-top: 5px; }
  .rev-title {
    font-size: 8pt;
    font-weight: 800;
    text-align: center;
    margin-bottom: 5px;
    text-transform: uppercase;
  }
  .rev-section { margin-bottom: 5px; }
  .rev-sec-title {
    font-size: 7pt;
    font-weight: 800;
    margin-bottom: 2px;
    font-family: Arial, Helvetica, sans-serif;
    color: #000;
  }
  .rev-body {
    font-size: 6.5pt;
    line-height: 1.6;
    text-align: justify;
    color: #000;
    font-family: Arial, Helvetica, sans-serif;
  }
  .rev-item { margin-bottom: 2px; }
  .rev-example {
    border: 1px solid #000;
    padding: 3px;
    margin: 3px 0;
    font-size: 6pt;
  }
  .rev-ex-title { font-weight: 700; margin-bottom: 2px; font-size: 6pt; }
  .rev-ex-row   { display: flex; gap: 4px; align-items: flex-end; margin-bottom: 2px; }
  .rev-ex-key   { width: 14px; font-weight: 700; font-size: 6pt; }
  .rev-ex-val   { flex: 3; border-bottom: 1px solid #000; min-height: 11px; font-size: 6pt; font-family: 'Courier New', monospace; }
  .rev-ex-int   { flex: 1; border-bottom: 1px solid #000; min-height: 11px; font-size: 6pt; text-align: center; font-family: 'Courier New', monospace; }

  /* Ocultar en pantalla (solo para impresión) */
  @media screen {
    .page-break { display: none; }
  }
`
