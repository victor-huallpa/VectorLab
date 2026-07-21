import { generateFieldReport } from './pdf/PdfReportGenerator.js';

/**
 * Punto de entrada público de exportación a PDF. Se mantiene como
 * "servicio" (produce un efecto de salida, igual que una futura ruta
 * de API tipo GET /api/export/pdf) y con el mismo nombre de función
 * que ya usaba el resto de la app, para no romper ningún import
 * existente.
 *
 * La lógica de armado del reporte (portada, secciones, jacobiano,
 * clasificación, etc.) vive en PdfReportGenerator + pdfDrawHelpers,
 * separada de este archivo para que un futuro laboratorio (Gradiente,
 * Divergencia...) pueda construir su propio reporte reutilizando esas
 * mismas primitivas de dibujo sin duplicar código.
 *
 * @param {{
 *   canvas: HTMLCanvasElement,
 *   p: string,
 *   q: string,
 *   config: import('../models/VectorFieldConfig.js').VectorFieldConfig,
 *   analysis?: import('../domain/field-analysis/FieldAnalyzer.js').FieldAnalysisResult | null,
 *   classification?: { type:string, confidence:string, reason:string } | null,
 *   interpretation?: { summary:string, details:string[] } | null,
 * }} params
 * @returns {string} nombre del archivo PDF generado
 */
export function exportFieldToPdf({ canvas, p, q, config, analysis = null, classification = null, interpretation = null }) {
  return generateFieldReport({ canvas, p, q, config, analysis, classification, interpretation });
}
