import { jsPDF } from 'jspdf';
import { formatDate } from '../../utils/formatters.js';
import { APP_NAME, APP_VERSION, CURRENT_LAB_NAME } from '../../constants/appInfo.js';
import { FIELD_TYPE_LABELS } from '../../domain/field-analysis/index.js';
import { getEducationalContent } from '../../content/educational/fieldEducationalContent.js';
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

/**
 * PdfReportGenerator: convierte el estado actual del laboratorio en un
 * reporte técnico de 3 páginas apto como evidencia académica.
 *
 * Reemplaza al PDF simple original, pero mantiene la misma idea de
 * "servicio con efecto de salida" (descarga un archivo) que ya tenía
 * exportService.js — por eso exportFieldToPdf() sigue siendo la única
 * función pública que el resto de la app importa; esta clase es un
 * detalle de implementación interno.
 *
 * @param {{
 *   canvas: HTMLCanvasElement,
 *   p: string,
 *   q: string,
 *   config: import('../../models/VectorFieldConfig.js').VectorFieldConfig,
 *   analysis: import('../../domain/field-analysis/FieldAnalyzer.js').FieldAnalysisResult | null,
 *   classification: { type:string, confidence:string, reason:string } | null,
 *   interpretation: { summary:string, details:string[] } | null,
 * }} params
 * @returns {string} nombre del archivo generado
 */
export function generateFieldReport({ canvas, p, q, config, analysis, classification, interpretation }) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const now = new Date();

  drawCoverPage(pdf, { pageWidth, pageHeight, now });

  pdf.addPage();
  drawTechnicalPage(pdf, { pageWidth, canvas, p, q, config });

  pdf.addPage();
  drawAnalysisPage(pdf, { pageWidth, analysis, classification, interpretation });

  stampFooters(pdf, { pageWidth, pageHeight });

  const fileName = `vector-lab-reporte-${Date.now()}.pdf`;
  pdf.save(fileName);
  return fileName;
}

function drawCoverPage(pdf, { pageWidth, pageHeight, now }) {
  pdf.setFillColor(...COLOR.void);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Patrón decorativo: una pequeña grilla de flechas, en el mismo
  // espíritu visual que el propio canvas del laboratorio.
  drawDecorativeVectorGrid(pdf, { pageWidth, pageHeight });

  drawLogo(pdf, pageWidth / 2 - 22, 70, { scale: 1.8 });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(...COLOR.ink);
  pdf.text('Reporte Técnico de Campo Vectorial', pageWidth / 2, 92, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(...COLOR.accent);
  pdf.text(CURRENT_LAB_NAME, pageWidth / 2, 100, { align: 'center' });

  const infoY = 130;
  const infoRows = [
    ['Fecha', new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(now)],
    ['Hora', new Intl.DateTimeFormat('es-PE', { timeStyle: 'medium' }).format(now)],
    ['Versión del sistema', `${APP_NAME} v${APP_VERSION}`],
    ['Laboratorio', CURRENT_LAB_NAME],
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

function drawDecorativeVectorGrid(pdf, { pageWidth, pageHeight }) {
  pdf.setDrawColor(...COLOR.accent);
  pdf.setLineWidth(0.25);
  const rows = 6;
  const cols = 8;
  const marginTop = 165;
  const spacingX = pageWidth / (cols + 1);
  const spacingY = (pageHeight - marginTop - 20) / rows;

  for (let i = 1; i <= cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * spacingX;
      const y = marginTop + j * spacingY;
      const angle = (i * 0.6 + j * 0.9) % (Math.PI * 2);
      const length = 4.5;
      const dx = Math.cos(angle) * length;
      const dy = Math.sin(angle) * length;
      pdf.line(x, y, x + dx, y + dy);
    }
  }
}

function drawTechnicalPage(pdf, { pageWidth, canvas, p, q, config }) {
  drawHeaderBar(pdf, { pageWidth, title: 'Reporte técnico', subtitle: 'Datos y configuración del campo vectorial' });

  let cursorY = 46;
  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY, text: 'Funciones ingresadas' });
  cursorY = drawKeyValueGrid(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: pageWidth - PAGE_MARGIN * 2,
    rows: [
      ['P(x, y)', p],
      ['Q(x, y)', q],
    ],
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 4, text: 'Configuración utilizada' });
  cursorY = drawKeyValueGrid(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: pageWidth - PAGE_MARGIN * 2,
    rows: [
      ['Dominio en x', `[${config.domain.xmin}, ${config.domain.xmax}]`],
      ['Dominio en y', `[${config.domain.ymin}, ${config.domain.ymax}]`],
      ['Densidad de vectores', config.density],
      ['Escala de flechas', `${config.scale}×`],
      ['Coloreado por magnitud', config.colorByMagnitude ? 'Sí' : 'No'],
      ['Simulación de partículas', config.showParticles ? 'Activa' : 'Inactiva'],
    ],
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 2, text: 'Visualización del campo generado' });
  cursorY += 4;

  if (canvas) {
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - PAGE_MARGIN * 2;
    const imgHeight = Math.min((canvas.height / canvas.width) * imgWidth, 130);
    pdf.setDrawColor(...COLOR.grayLine);
    pdf.rect(PAGE_MARGIN - 0.5, cursorY - 0.5, imgWidth + 1, imgHeight + 1);
    pdf.addImage(imgData, 'PNG', PAGE_MARGIN, cursorY, imgWidth, imgHeight);
  }
}

function drawAnalysisPage(pdf, { pageWidth, analysis, classification, interpretation }) {
  drawHeaderBar(pdf, { pageWidth, title: 'Análisis matemático y educativo', subtitle: 'Generado automáticamente por el motor de análisis' });

  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  let cursorY = 46;

  if (!analysis || !classification || !interpretation) {
    cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY, text: 'Análisis no disponible' });
    drawParagraph(pdf, {
      x: PAGE_MARGIN,
      y: cursorY + 4,
      width: contentWidth,
      text: 'No fue posible calcular el análisis matemático para la función ingresada en el momento de exportar. Verifica que P(x, y) y Q(x, y) sean expresiones válidas e intenta nuevamente.',
    });
    return;
  }

  const content = getEducationalContent(classification.type);

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY, text: 'Clasificación detectada' });
  cursorY = drawKeyValueGrid(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    rows: [
      ['Tipo de campo', FIELD_TYPE_LABELS[classification.type]],
      ['Confianza', classification.confidence],
    ],
  });
  cursorY = drawParagraph(pdf, { x: PAGE_MARGIN, y: cursorY, width: contentWidth, text: classification.reason, fontSize: 9, color: COLOR.inkMuted });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 6, text: 'Propiedades matemáticas calculadas' });
  cursorY = drawKeyValueGrid(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    columns: 3,
    rows: [
      ['Divergencia (prom.)', formatOrNA(analysis.divergenceAvg)],
      ['Divergencia (origen)', formatOrNA(analysis.divergenceAtOrigin)],
      ['Rotacional (prom.)', formatOrNA(analysis.curlAvg)],
      ['Rotacional (origen)', formatOrNA(analysis.curlAtOrigin)],
      ['Magnitud mín.', formatOrNA(analysis.magnitude?.min)],
      ['Magnitud máx.', formatOrNA(analysis.magnitude?.max)],
      ['Magnitud prom.', formatOrNA(analysis.magnitude?.avg)],
      ['Dirección predominante', analysis.predominantDirection?.label ?? 'No determinable'],
      ['Tipo de flujo', analysis.flowType ?? 'No determinable'],
    ],
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 2, text: 'Interpretación del comportamiento' });
  cursorY = drawParagraph(pdf, { x: PAGE_MARGIN, y: cursorY + 4, width: contentWidth, text: interpretation.summary });
  if (interpretation.details.length) {
    cursorY = drawBulletList(pdf, { x: PAGE_MARGIN, y: cursorY + 2, width: contentWidth, items: interpretation.details, fontSize: 9 });
  }

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 6, text: 'Explicación educativa' });
  cursorY = drawParagraph(pdf, { x: PAGE_MARGIN, y: cursorY + 4, width: contentWidth, text: content.explicacion });
  cursorY = drawParagraph(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 2,
    width: contentWidth,
    text: `Nivel de dificultad: ${content.nivelDificultad}  ·  Conceptos relacionados: ${content.conceptosRelacionados.join(', ')}.`,
    fontSize: 8.5,
    color: COLOR.inkMuted,
  });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 6, text: 'Aplicaciones del campo' });
  cursorY = drawBulletList(pdf, { x: PAGE_MARGIN, y: cursorY + 4, width: contentWidth, items: content.aplicaciones, fontSize: 9 });

  cursorY = drawSectionTitle(pdf, { x: PAGE_MARGIN, y: cursorY + 6, text: 'Observaciones' });
  drawParagraph(pdf, {
    x: PAGE_MARGIN,
    y: cursorY + 4,
    width: contentWidth,
    text: buildObservations(classification),
    fontSize: 9,
    color: COLOR.inkMuted,
  });
}

function buildObservations(classification) {
  if (classification.confidence === 'baja') {
    return 'La clasificación automática tiene confianza baja: el campo no se ajusta con claridad a un único patrón conocido. Se recomienda revisar la visualización manualmente antes de sacar conclusiones definitivas.';
  }
  return 'La clasificación y las propiedades matemáticas fueron calculadas numéricamente sobre el dominio configurado. Cambiar el dominio o la resolución de muestreo puede afinar la precisión de estos valores.';
}

function formatOrNA(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/D';
  return value.toFixed(3);
}

function stampFooters(pdf, { pageWidth, pageHeight }) {
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    drawFooter(pdf, { pageWidth, pageHeight, pageNumber: i, totalPages });
  }
}
