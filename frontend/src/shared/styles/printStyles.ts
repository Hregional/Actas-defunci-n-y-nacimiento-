/**
 * CSS de impresión para Nacimiento y Defunción.
 *
 * TAMAÑO NATIVO: Hoja Oficio (8.5" × 14")
 *
 * ADAPTACIÓN A CARTA (8.5" × 11"):
 *   Cuando el usuario imprime en carta, la media query
 *   @media print and (max-height: 11.2in) reduce todo al 78.6%
 *   (11/14 ≈ 0.786) para que el contenido quepa sin cortar.
 *   Esto es automático — el usuario no necesita ajustar nada.
 *
 * ESCALA DEL USUARIO: Bloqueada. El CSS impone transform directamente.
 */

const BASE_CSS = `

/* ══════════════════════════════════════════════════════════
   RESET Y BASE
══════════════════════════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box !important; }

html, body {
  margin: 0 !important;
  padding: 0 !important;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 8pt;
  line-height: 1.3;
  color: #000;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ══════════════════════════════════════════════════════════
   CONTENEDOR PRINCIPAL
   En pantalla: 7in de ancho con padding para simular márgenes.
   Al imprimir: ocupa 100% y el @page maneja los márgenes reales.
══════════════════════════════════════════════════════════ */
.form-container {
  width: 7in;
  max-width: 7in;
  margin: 0 auto;
  padding: 12mm 14mm;   /* márgenes visibles en el preview de pantalla */
  background: white;
}

@media print {
  .form-container {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important; /* @page margins toman el control */
  }
}

/* ══════════════════════════════════════════════════════════
   ADAPTACIÓN AUTOMÁTICA A CARTA
   Si el papel físico mide ≤11in de alto (carta), escalar a 78.6%.
   Se usa transform en <body> para que escale TODO el contenido.
══════════════════════════════════════════════════════════ */
@media print and (max-height: 11.2in) {
  html {
    /* Escalar el HTML completo preserva proporciones exactas */
    transform: scale(0.786) !important;
    transform-origin: top left !important;
    /* Compensar el encogimiento para que el contenido ocupe la hoja */
    width: calc(100% / 0.786) !important;
    height: calc(100% / 0.786) !important;
  }
}

/* ══════════════════════════════════════════════════════════
   LÍMITE DE 2 PÁGINAS
   Si el contenido excede las 2 páginas de oficio, escalar
   para que quepa. Aplica solo en impresión.
══════════════════════════════════════════════════════════ */
@media print {
  html, body {
    max-height: 28in; /* 2 páginas oficio × 14in */
  }
}

/* ══════════════════════════════════════════════════════════
   HEADER DEL FORMULARIO
══════════════════════════════════════════════════════════ */
.form-header {
  border: 1.5px solid #1a1a1a;
  background: #f0f4fb;
  padding: 7px 12px;
  margin: 0 0 5mm 0;
}

@media print {
  .form-header {
    background: #ebebeb !important;
    border: 1px solid #333 !important;
    margin: 0 0 4mm 0 !important;
    padding: 5px 8px !important;
  }
}

.form-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.form-header-top img {
  height: 36px;
  width: auto;
  object-fit: contain;
}

.form-header-center {
  text-align: center;
  flex: 1;
  padding: 0 10px;
}

.form-header-center h1 {
  font-size: 12pt;
  font-weight: 900;
  margin: 0;
  color: #002060;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

@media print { .form-header-center h1 { color: #000 !important; font-size: 11pt !important; } }

.form-header-center h2 {
  font-size: 9.5pt;
  font-weight: 700;
  margin: 3px 0 0 0;
  color: #003087;
  letter-spacing: 0.3px;
}

@media print { .form-header-center h2 { color: #222 !important; font-size: 9pt !important; } }

/* ══════════════════════════════════════════════════════════
   BARRA DE SECCIÓN
══════════════════════════════════════════════════════════ */
.sec-bar {
  background: #dce4f2;
  color: #001a4d;
  border-left: 4px solid #002060;
  font-size: 7.5pt;
  font-weight: 800;
  letter-spacing: 0.07em;
  padding: 4px 8px;
  margin: 5mm 0 3.5mm 0;
  text-transform: uppercase;
}

@media print {
  .sec-bar {
    background: #e4e4e4 !important;
    color: #000 !important;
    border-left: 4px solid #333 !important;
    margin: 4mm 0 2.5mm 0 !important;
    padding: 3px 6px !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* ══════════════════════════════════════════════════════════
   AVISO ESPECIAL
══════════════════════════════════════════════════════════ */
.aviso {
  background: #eef2fa;
  color: #002060;
  border: 1px solid #7a9cc6;
  text-align: center;
  font-weight: 700;
  font-size: 7pt;
  padding: 3px 8px;
  margin: 2mm 0;
}

@media print {
  .aviso {
    background: #f0f0f0 !important;
    color: #000 !important;
    border: 1px solid #666 !important;
  }
}

/* ══════════════════════════════════════════════════════════
   FILAS Y CAMPOS
══════════════════════════════════════════════════════════ */
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0 0 4mm 0;
  width: 100%;
}

/* Proporciones de columnas */
.f         { flex: 1; min-width: 80px; }
.f-full    { flex: 0 0 100%; }
.f-half    { flex: 0 0 calc(50%   - 2px); }
.f-third   { flex: 0 0 calc(33.33% - 2.67px); }
.f-quarter { flex: 0 0 calc(25%   - 3px); }
.f-fifth   { flex: 0 0 calc(20%   - 3.2px); }
.f-sixth   { flex: 0 0 calc(16.66% - 3.33px); }

.f-lbl {
  font-size: 5.5pt;
  color: #444;
  font-weight: 600;
  display: block;
  margin-bottom: 2px;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.f-val {
  border-bottom: 1px solid #000;
  min-height: 15px;
  font-size: 8.5pt;
  padding: 1px 0 2px 0;
  font-weight: 600;
  word-break: break-word;
  color: #000;
  line-height: 1.3;
}

/* ══════════════════════════════════════════════════════════
   CAUSA DE DEFUNCIÓN
══════════════════════════════════════════════════════════ */
.causa-box  { border: 1.5px solid #000; padding: 5px; margin: 2.5mm 0; }
.causa-lbl  { font-size: 6pt; color: #000; font-weight: 700; font-style: italic; margin-bottom: 3px; line-height: 1.2; }
.causa-row  { display: flex; gap: 4px; align-items: flex-end; margin-bottom: 3px; }
.causa-key  { font-size: 7.5pt; font-weight: 900; width: 18px; flex-shrink: 0; }
.causa-val  { flex: 3; border-bottom: 1px solid #000; min-height: 13px; font-size: 8pt; font-weight: 600; padding-bottom: 1px; }
.causa-int  { flex: 1; text-align: center; }
.causa-int-lbl { font-size: 5pt; color: #000; font-weight: 600; margin-bottom: 1px; }
.causa-int-val { border-bottom: 1px solid #000; min-height: 13px; font-size: 7.5pt; font-weight: 600; padding-bottom: 1px; }
.causa-note { font-size: 5.5pt; color: #555; margin-top: 3mm; font-style: italic; }
.causa-sep  { border-top: 1px dashed #666; padding-top: 3mm; margin-top: 2mm; }

/* ══════════════════════════════════════════════════════════
   BLOQUE DE CIERRE LEGAL (Sello + Texto)
══════════════════════════════════════════════════════════ */
.close-blk {
  border: 1.5px solid #333;
  padding: 7mm 8mm;
  margin: 4mm 0 2mm 0;
  display: flex;
  gap: 10mm;
  align-items: stretch;
  min-height: 35mm;   /* más alto para que el sello sea usable */
  page-break-inside: avoid;
  break-inside: avoid;
}

.sello-box, .timbre-box {
  border: 1.5px solid #555;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-shrink: 0;
  font-size: 7.5pt;
  font-weight: 700;
  line-height: 1.4;
  background: #f5f5f5;
  color: #333;
}

/* Sello principal — cuadrado generoso */
.sello-box  { width: 38mm; min-height: 30mm; }
/* Timbre fiscal — cuadrado algo más pequeño */
.timbre-box { width: 30mm; min-height: 28mm; }

@media print {
  .sello-box, .timbre-box {
    border: 1.5px solid #555 !important;
    background: #f8f8f8 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

.legal-txt {
  font-size: 7.5pt;
  flex: 1;
  line-height: 1.7;
}

/* ══════════════════════════════════════════════════════════
   SALTO DE PÁGINA
   Solo para forzar el reverso en documentos de 2 caras.
   El contenido del frente fluye libremente — si desborda
   la página 1 continúa en la página 2 antes de las huellas.
══════════════════════════════════════════════════════════ */
.page-break {
  page-break-before: always;
  break-before: page;
}

@media screen {
  .page-break {
    display: block;
    margin: 24px 0 16px 0;
    border-top: 2px dashed #aaa;
    padding-top: 16px;
  }
}

/* ══════════════════════════════════════════════════════════
   NOTAS AL PIE Y CONTINUACIÓN
══════════════════════════════════════════════════════════ */
.nota-pie {
  font-size: 6.5pt;
  color: #333;
  margin: 3mm 0 1mm 0;
  font-style: italic;
  line-height: 1.4;
  page-break-inside: avoid;
  break-inside: avoid;
  page-break-before: avoid;
  break-before: avoid;
}

.continua {
  font-size: 6.5pt;
  text-align: right;
  margin: 2mm 0 0 0;
  font-style: italic;
  color: #555;
  font-weight: 600;
}

/* ══════════════════════════════════════════════════════════
   REVERSO — HUELLAS PLANTARES (solo nacimiento)
   Layout: 3 columnas iguales
     Col 1 (ancha): Huella plantar pie derecho
     Col 2: Huella dedo pulgar recién nacido
     Col 3: Huella dedo pulgar madre
══════════════════════════════════════════════════════════ */
.huellas-wrap {
  display: flex;
  gap: 10mm;
  margin: 6mm 0 8mm 0;
  align-items: flex-start;
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Columna izquierda — huella plantar grande */
.fp-plantar-col {
  flex: 3;         /* ocupa ~55% del ancho */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fp-plantar-lbl {
  font-size: 7pt;
  text-align: center;
  margin-bottom: 3mm;
  font-weight: 700;
  color: #002060;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

@media print { .fp-plantar-lbl { color: #000 !important; } }

.fp-plantar {
  border: 1.5px solid #555;
  height: 55mm;     /* bien alto para que quepa un pie */
  width: 100%;      /* ocupa todo el ancho de su columna */
  max-width: 90mm;
  background: #fafafa;
}

@media print { .fp-plantar { border: 1.5px solid #555 !important; background: #f8f8f8 !important; } }

/* Columna derecha — dos huellas de dedo apiladas */
.fp-small-col {
  flex: 2;          /* ocupa ~45% del ancho */
  display: flex;
  flex-direction: column;
  gap: 7mm;
}

.fp-small-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fp-small-lbl {
  font-size: 6.5pt;
  text-align: center;
  margin-bottom: 2mm;
  font-weight: 700;
  color: #002060;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

@media print { .fp-small-lbl { color: #000 !important; } }

.fp-small {
  border: 1.5px solid #555;
  height: 28mm;     /* cuadrado generoso para huella de pulgar */
  width: 28mm;
  background: #fafafa;
}

@media print { .fp-small { border: 1.5px solid #555 !important; background: #f8f8f8 !important; } }

/* ══════════════════════════════════════════════════════════
   REVERSO — INSTRUCCIONES
══════════════════════════════════════════════════════════ */
.rev-wrap        { margin-top: 5mm; border-top: 1.5px solid #000; padding-top: 4mm; }
.rev-title       { font-size: 8.5pt; font-weight: 900; text-align: center; margin-bottom: 4mm; letter-spacing: 0.05em; text-transform: uppercase; }
.rev-section     { margin-bottom: 3.5mm; }
.rev-sec-title   { font-size: 7pt; font-weight: 800; margin-bottom: 1.5mm; color: #000; text-transform: uppercase; }
.rev-body        { font-size: 6pt; line-height: 1.45; text-align: justify; color: #000; }
.rev-item        { margin-bottom: 1.5mm; }

/* ══════════════════════════════════════════════════════════
   IMPRESIÓN GLOBAL — bloqueo de transformaciones del usuario
══════════════════════════════════════════════════════════ */
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    font-size: 8pt !important;
  }

  .form-container {
    width: 100% !important;
    max-width: none !important;
  }
}
`

/* ════════════════════════════════════════════════════════════
   EXPORTACIONES
   Ambas actas usan oficio (8.5"×14") como tamaño nativo.
   El fallback a carta está en el BASE_CSS (@media max-height).
════════════════════════════════════════════════════════════ */

const PAGE_OFICIO = `
@page {
  size: 8.5in 14in;
  margin: 0.6in 0.7in 0.6in 0.7in;
}
`

/** CSS para acta de NACIMIENTO — hoja oficio nativa, adapta a carta */
export const PRINT_CSS_NACIMIENTO = PAGE_OFICIO + BASE_CSS

/** CSS para acta de DEFUNCIÓN — hoja oficio nativa, adapta a carta */
export const PRINT_CSS_DEFUNCION = PAGE_OFICIO + BASE_CSS

/** Alias de compatibilidad */
export const PRINT_CSS = PRINT_CSS_DEFUNCION
