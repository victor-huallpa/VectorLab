import { CHART_COLORS } from '../../constants/theme.js';

/** Convierte un hex '#RRGGBB' a [r,g,b] para las APIs de color de jsPDF. */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const COLOR = {
  void: hexToRgb(CHART_COLORS.background),
  ink: hexToRgb(CHART_COLORS.ink),
  inkMuted: hexToRgb(CHART_COLORS.inkMuted),
  accent: hexToRgb(CHART_COLORS.accent),
  ember: hexToRgb(CHART_COLORS.ember),
  black: [17, 20, 26],
  grayLine: [210, 214, 222],
};

/**
 * Dibuja la marca "VectorLab": un pequeño isotipo geométrico (un
 * vector saliendo de un nodo) más el wordmark. Se dibuja con
 * primitivas de jsPDF en vez de una imagen para no depender de ningún
 * archivo binario dentro del proyecto.
 */
export function drawLogo(pdf, x, y, { scale = 1, dark = false } = {}) {
  const markColor = dark ? COLOR.void : COLOR.accent;
  const textColor = dark ? COLOR.void : COLOR.ink;

  pdf.setDrawColor(...markColor);
  pdf.setFillColor(...markColor);
  pdf.circle(x + 2 * scale, y, 1.4 * scale, 'F');
  pdf.setLineWidth(0.8 * scale);
  pdf.line(x + 2 * scale, y, x + 7 * scale, y - 4 * scale);
  pdf.triangle(
    x + 7 * scale, y - 4 * scale,
    x + 5.4 * scale, y - 3.4 * scale,
    x + 6.4 * scale, y - 5.4 * scale,
    'F'
  );

  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13 * scale);
  pdf.text('VectorLab', x + 10 * scale, y + 1.2 * scale);
}

/** Barra de encabezado oscura consistente en todas las páginas del reporte. */
export function drawHeaderBar(pdf, { pageWidth, title, subtitle }) {
  pdf.setFillColor(...COLOR.void);
  pdf.rect(0, 0, pageWidth, 34, 'F');
  drawLogo(pdf, 16, 14);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(...COLOR.inkMuted);
  pdf.text(title, 16, 24);
  if (subtitle) {
    pdf.setFontSize(8);
    pdf.text(subtitle, 16, 29);
  }
}

/** Pie de página consistente: aviso de generación automática + numeración. */
export function drawFooter(pdf, { pageWidth, pageHeight, pageNumber, totalPages }) {
  const y = pageHeight - 10;
  pdf.setDrawColor(...COLOR.grayLine);
  pdf.setLineWidth(0.2);
  pdf.line(16, y - 4, pageWidth - 16, y - 4);
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(7.5);
  pdf.setTextColor(...COLOR.inkMuted);
  pdf.text('Este reporte fue generado automáticamente por VectorLab.', 16, y);
  pdf.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 16, y, { align: 'right' });
}

/** Título de sección con una pequeña barra de acento a la izquierda. */
export function drawSectionTitle(pdf, { x, y, text }) {
  pdf.setFillColor(...COLOR.accent);
  pdf.rect(x, y - 3.6, 1.2, 4.6, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11.5);
  pdf.setTextColor(...COLOR.black);
  pdf.text(text, x + 4, y);
  return y + 6;
}

/**
 * Renderiza una lista de pares clave/valor en dos columnas, devolviendo
 * el cursor Y siguiente. Se usa para "Configuración utilizada" y
 * "Propiedades matemáticas calculadas".
 */
export function drawKeyValueGrid(pdf, { x, y, width, rows, columns = 2 }) {
  const colWidth = width / columns;
  let cursorY = y;
  let col = 0;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);

  for (const [label, value] of rows) {
    const cellX = x + col * colWidth;
    pdf.setTextColor(...COLOR.inkMuted);
    pdf.text(`${label}:`, cellX, cursorY);
    pdf.setTextColor(...COLOR.black);
    pdf.text(String(value), cellX, cursorY + 4.4);

    col += 1;
    if (col >= columns) {
      col = 0;
      cursorY += 11;
    }
  }
  if (col !== 0) cursorY += 11;
  return cursorY + 2;
}

/** Párrafo con salto de línea automático, devuelve el cursor Y siguiente. */
export function drawParagraph(pdf, { x, y, width, text, fontSize = 9.5, color = COLOR.black, lineHeight = 4.6 }) {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(fontSize);
  pdf.setTextColor(...color);
  const lines = pdf.splitTextToSize(text, width);
  pdf.text(lines, x, y);
  return y + lines.length * lineHeight;
}

/** Lista con viñetas, devuelve el cursor Y siguiente. */
export function drawBulletList(pdf, { x, y, width, items, fontSize = 9.5 }) {
  let cursorY = y;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(fontSize);
  pdf.setTextColor(...COLOR.black);
  for (const item of items) {
    const lines = pdf.splitTextToSize(`•  ${item}`, width);
    pdf.text(lines, x, cursorY);
    cursorY += lines.length * 4.6;
  }
  return cursorY;
}

export { COLOR };
