import { jsPDF } from 'jspdf';
import { APP_NAME, APP_VERSION } from '../../constants/appInfo.js';
import {
  drawLogo,
  drawHeaderBar,
  drawFooter,
  drawSectionTitle,
  drawKeyValueGrid,
  drawParagraph,
  drawBulletList,
  COLOR,
} from './pdfDrawHelpers.js';

const PAGE_MARGIN = 16;
const LAB_NAME = 'Integrales de Línea';

/**
 * LineIntegralReportGenerator: mismo rol que PdfReportGenerator.js pero
 * para el laboratorio de Integrales de Línea. No reimplementa ningún
 * primitivo de dibujo: reutiliza exactamente drawLogo/drawHeaderBar/
 * drawFooter/drawSectionTitle/drawKeyValueGrid/drawParagraph/
 * drawBulletList de pdfDrawHelpers.js, la misma capa que ya usa el
 * reporte de Campos Vectoriales. Solo cambia la composición de
 * secciones, porque el contenido (curva, campo, procedimiento paso a
 * paso, tabla de muestras) es propio de este módulo.
 *
 * @param {{
 *   canvas: HTMLCanvasElement|null,
 *   field: {p:string, q:string, r?:string},
 *   curve: {x:string, y:string, z?:string, t0:number, t1:number},
 *   config: import('../../models/LineIntegralConfig.js').LineIntegralConfig,
 *   result: import('../../domain/line-integral/LineIntegralInterpreter.js').ReturnType|null,
 *   status: 'idle'|'loading'|'success'|'error',
 * }} params
 * @returns {string} nombre del archivo generado
 */
export function generateLineIntegralReport({ canvas, field, curve, config, result, status }) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const now = new Date();
  const isSuccess = status === 'success' && result?.status === 'success';

  drawCoverPage(pdf, { pageWidth, pageHeight, now });

  pdf.addPage();
  drawDataPage(pdf, { pageWidth, canvas, field, curve, config });

  pdf.addPage();
  drawProcedurePage(pdf, { pageWidth, result, isSuccess });

  pdf.addPage();
  drawConclusionsPage(pdf, { pageWidth, field, curve, config, result, isSuccess });

  stampFooters(pdf, { pageWidth, pageHeight });

  const fileName = `vector-lab-integral-linea-${Date.now()}.pdf`;
  pdf.save(fileName);
  return fileName;
}

function drawCoverPage(pdf, { pageWidth, pageHeight, now }) {
  pdf.setFillColor(...COLOR.void);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  drawDecorativeCurve(pdf, { pageWidth, pageHeight });

  drawLogo(pdf, pageWidth / 2 - 22, 70, { scale: 1.8 });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(...COLOR.ink);
  pdf.text('Reporte Técnico de Integral de Línea', pageWidth / 2, 92, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(...COLOR.accent);
  pdf.text(LAB_NAME, pageWidth / 2, 100, { align: 'center' });

  const infoY = 130;
  const infoRows = [
    ['Fecha', new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(now)],
    ['Hora', new Intl.DateTimeFormat('es-PE', { timeStyle: 'medium' }).format(now)],
    ['Versión del sistema', `${APP_NAME} v${APP_VERSION}`],
    ['Laboratorio', LAB_NAME],
  ];
  pdf.setFontSize(10);
  infoRows.forEach(([label, value], index) => {
    const y = infoY + index * 8;
    pdf.setTextColor(...COLOR.inkMuted);
    pdf.text(label, pageWidth / 2 - 40, y);
    pdf.setTextColor(...COLOR.ink);
    pdf.text(value, pageWidth / 2 + 10, y);
  });

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8.5);
  pdf.setTextColor(...COLOR.inkMuted);
  pdf.text(
    'Este documento sirve como evidencia académica del trabajo realizado en el laboratorio virtual.',
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  );
}

/** Decoración de portada: una curva punteada estilizada, en el mismo espíritu que la grilla de flechas del reporte de Campos Vectoriales. */
function drawDecorativeCurve(pdf, { pageWidth, pageHeight }) {
  pdf.setDrawColor(...COLOR.accent);
  pdf.setLineWidth(0.35);
  const marginTop = 165;
  const bottom = pageHeight - 20;
  const amplitude = 14;
  const steps = 60;

  let prevX = null;
  let prevY = null;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * pageWidth;
    const y = marginTop + (bottom - marginTop) * t + Math.sin(t * Math.PI * 3) * amplitude;
    if (i % 2 === 0) {
      if (prevX !== null) pdf.line(prevX, prevY, x, y);
    }
    prevX = x;
    prevY = y;
  }
}

function drawDataPage(pdf, { pageWidth, canvas, field, curve, config }) {
  drawHeaderBar(pdf, { pageWidth, title: 'Datos ingresados', subtitle: 'Curva, campo vectorial y configuración utilizada' });

  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  let cursorY = 46;

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY, text: 'Campo vectorial F' });
  cursorY = drawKeyValueGrid(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    rows: config.is3D
      ? [['P(x, y, z)', field.p], ['Q(x, y, z)', field.q], ['R(x, y, z)', field.r]]
      : [['P(x, y)', field.p], ['Q(x, y)', field.q]],
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 4, text: 'Curva paramétrica C' });
  cursorY = drawKeyValueGrid(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    rows: config.is3D
      ? [['x(t)', curve.x], ['y(t)', curve.y], ['z(t)', curve.z], ['Intervalo', `t ∈ [${curve.t0}, ${curve.t1}]`]]
      : [['x(t)', curve.x], ['y(t)', curve.y], ['Intervalo', `t ∈ [${curve.t0}, ${curve.t1}]`]],
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 4, text: 'Configuración utilizada' });
  cursorY = drawKeyValueGrid(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    rows: [
      ['Dimensión', config.is3D ? '3D (x, y, z)' : '2D (x, y)'],
      ['Subdivisiones (Simpson)', config.samples],
      ['Campo de fondo', config.showField ? 'Visible' : 'Oculto'],
      ['Orientación de la curva', config.showOrientation ? 'Visible' : 'Oculta'],
    ],
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 2, text: 'Trayectoria y campo generados' });
  cursorY += 4;

  if (canvas) {
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = contentWidth;
    const imgHeight = Math.min((canvas.height / canvas.width) * imgWidth, 120);
    pdf.setDrawColor(...COLOR.grayLine);
    pdf.rect(PAGE_MARGIN - 0.5, cursorY - 0.5, imgWidth + 1, imgHeight + 1);
    pdf.addImage(imgData, 'PNG', PAGE_MARGIN, cursorY, imgWidth, imgHeight);
  }
}

function drawProcedurePage(pdf, { pageWidth, result, isSuccess }) {
  drawHeaderBar(pdf, { pageWidth, title: 'Procedimiento y fórmulas', subtitle: 'Generado automáticamente por el motor de cálculo' });

  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  let cursorY = 46;

  if (!isSuccess) {
    cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY, text: 'Procedimiento no disponible' });
    const messages = result?.errors ? Object.values(result.errors) : [];
    drawParagraph(pdf, {
      x: PAGE_MARGIN,
      y: cursorY + 4,
      width: contentWidth,
      text:
        messages.length > 0
          ? `No fue posible calcular la integral en el momento de exportar: ${messages.join(' ')}`
          : 'No fue posible calcular la integral en el momento de exportar. Verifica el campo, la curva y el intervalo.',
    });
    return;
  }

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY, text: 'Definición aplicada' });
  cursorY = drawParagraph(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    text: "∫_C F · dr = ∫[t0 → t1] F(r(t)) · r'(t) dt, calculada numéricamente con la regla de Simpson compuesta sobre el integrando escalar g(t) = F(r(t)) · r'(t).",
    fontSize: 9.5,
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 4, text: 'Procedimiento paso a paso' });
  cursorY += 4;
  for (const step of result.steps) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(...COLOR.black);
    pdf.text(step.title, PAGE_MARGIN, cursorY);
    cursorY += 4.6;
    cursorY = drawParagraph(pdf, {
      x: PAGE_MARGIN,
      y: cursorY,
      width: contentWidth,
      text: step.lines.join('   |   '),
      fontSize: 8.7,
      color: COLOR.inkMuted,
      lineHeight: 4.2,
    });
    cursorY += 1.5;

    if (cursorY > 250) {
      pdf.addPage();
      drawHeaderBar(pdf, { pageWidth, title: 'Procedimiento y fórmulas (continuación)' });
      cursorY = 46;
    }
  }

  if (result.samplesTable?.length) {
    cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 2, text: 'Evaluación en puntos de muestra' });
    cursorY = drawSamplesTable(pdf, { x: PAGE_MARGIN, y: cursorY + 4, width: contentWidth, rows: result.samplesTable });
  }
}

/** Tabla simple de puntos de muestra (t, r(t), r'(t), F(r(t)), producto punto), sin depender de plugins de jsPDF. */
function drawSamplesTable(pdf, { x, y, width, rows }) {
  const headers = ['t', 'r(t)', "r'(t)", 'F(r(t))', "F · r'"];
  const colWidths = [width * 0.1, width * 0.26, width * 0.26, width * 0.26, width * 0.12];
  let cursorY = y;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.2);
  pdf.setTextColor(...COLOR.black);
  let colX = x;
  headers.forEach((h, i) => {
    pdf.text(h, colX, cursorY);
    colX += colWidths[i];
  });
  cursorY += 2;
  pdf.setDrawColor(...COLOR.grayLine);
  pdf.line(x, cursorY, x + width, cursorY);
  cursorY += 4.5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(...COLOR.inkMuted);
  for (const row of rows) {
    colX = x;
    const values = [row.t, row.rt, row.rPrime, row.F, row.dot];
    values.forEach((v, i) => {
      pdf.text(String(v), colX, cursorY);
      colX += colWidths[i];
    });
    cursorY += 4.5;
  }
  return cursorY + 2;
}

function drawConclusionsPage(pdf, { pageWidth, field, curve, config, result, isSuccess }) {
  drawHeaderBar(pdf, { pageWidth, title: 'Resultado y conclusiones', subtitle: 'Interpretación del valor obtenido' });

  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  let cursorY = 46;

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY, text: 'Resultado final' });
  cursorY = drawKeyValueGrid(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    rows: [['∫_C F · dr ≈', isSuccess ? formatValue(result.value) : 'No disponible']],
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 4, text: 'Conclusiones' });
  cursorY = drawBulletList(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    items: buildConclusions({ field, curve, config, result, isSuccess }),
    fontSize: 9.2,
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 6, text: 'Explicación teórica' });
  drawParagraph(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    text:
      'La integral de línea de un campo vectorial mide el trabajo acumulado que ese campo realiza sobre una partícula que recorre la curva C en el sentido de su parametrización. Un valor positivo indica que, en promedio, el campo empuja a favor del recorrido; un valor negativo indica que lo frena; un valor cercano a cero indica que el efecto neto a lo largo de la curva se cancela.',
    fontSize: 9,
  });
}

/**
 * Genera las conclusiones en lenguaje natural a partir del resultado
 * numérico, sin repetir el procedimiento (eso ya está en la página
 * anterior). Vive en el generador de reporte porque es una síntesis de
 * presentación, no una regla de cómputo del dominio matemático.
 */
function buildConclusions({ field, curve, config, result, isSuccess }) {
  if (!isSuccess) {
    return ['No se pudo calcular un resultado válido con las entradas actuales; revisa el campo, la curva y el intervalo antes de sacar conclusiones.'];
  }

  const { value } = result;
  const items = [];
  const dimLabel = config.is3D ? 'tridimensional (x, y, z)' : 'bidimensional (x, y)';
  items.push(`El cálculo se realizó sobre una curva y un campo ${dimLabel}, con ${Math.max(10, Math.round(config.samples))} subdivisiones de la regla de Simpson.`);

  if (Math.abs(value) < 1e-6) {
    items.push('El resultado es prácticamente cero: el trabajo que realiza el campo a favor del recorrido se compensa con el trabajo que realiza en contra, en distintos tramos de la curva.');
  } else if (value > 0) {
    items.push(`El resultado es positivo (≈ ${formatValue(value)}), lo que indica que el campo F realiza trabajo neto a favor del sentido de recorrido de la curva de (${curve.t0}) a (${curve.t1}).`);
  } else {
    items.push(`El resultado es negativo (≈ ${formatValue(value)}), lo que indica que el campo F se opone, en promedio, al sentido de recorrido de la curva.`);
  }

  items.push('El valor depende tanto de la forma de la curva como de su orientación: recorrerla en sentido contrario (intercambiando t0 y t1) invierte el signo del resultado.');
  items.push(`Expresiones utilizadas — campo: F = (${field.p}, ${field.q}${config.is3D ? `, ${field.r}` : ''}); curva: r(t) = (${curve.x}, ${curve.y}${config.is3D ? `, ${curve.z}` : ''}).`);

  return items;
}

function formatValue(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return Number(value.toFixed(6)).toString();
}

function stampFooters(pdf, { pageWidth, pageHeight }) {
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    drawFooter(pdf, { pageWidth, pageHeight, pageNumber: i, totalPages });
  }
}
