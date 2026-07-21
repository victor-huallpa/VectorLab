import { FIELD_TYPES } from './fieldTypes.constants.js';

/**
 * FieldInterpreter: la única capa que produce texto orientado al
 * estudiante a partir de números. No decide clasificación (eso es
 * FieldClassifier) ni calcula nada (eso es FieldAnalyzer); solo traduce.
 *
 * @param {{ classification: { type:string }, analysis: import('./FieldAnalyzer.js').FieldAnalysisResult }} params
 * @returns {{ summary: string, details: string[] }}
 */
export function interpretField({ classification, analysis }) {
  const summary = summaryByType(classification.type, analysis);
  const details = detailPhrases(analysis);
  return { summary, details };
}

function summaryByType(type, analysis) {
  switch (type) {
    case FIELD_TYPES.UNIFORM:
      return 'El flujo es aproximadamente uniforme: todas las flechas apuntan en una dirección similar y con magnitud parecida.';
    case FIELD_TYPES.RADIAL_SOURCE:
      return 'Las partículas se alejan del origen: el campo presenta una distribución radial hacia afuera (fuente).';
    case FIELD_TYPES.SINK:
      return 'Las partículas convergen hacia el centro: el comportamiento observado corresponde a un sumidero.';
    case FIELD_TYPES.PURE_ROTATION:
      return `El flujo gira alrededor del origen en sentido ${rotationSense(analysis)}, sin acercarse ni alejarse de él.`;
    case FIELD_TYPES.SADDLE:
      return 'El campo presenta un punto silla: las flechas se acercan por una dirección y se alejan por otra distinta.';
    case FIELD_TYPES.WAVE:
      return 'El campo presenta un comportamiento periódico: la dirección e intensidad de las flechas se repite en patrones a lo largo del plano.';
    default:
      return 'El campo no encaja claramente en un patrón típico de esta lista; presenta un comportamiento propio.';
  }
}

function rotationSense(analysis) {
  if (analysis.curlAtOrigin === null) return 'indeterminado';
  return analysis.curlAtOrigin > 0 ? 'antihorario' : 'horario';
}

/**
 * Frases cortas adicionales, derivadas de los números del analizador,
 * pensadas para acompañar el resumen principal en la tarjeta de
 * interpretación (no reemplazan al resumen, lo complementan).
 */
function detailPhrases(analysis) {
  const phrases = [];

  if (analysis.magnitude) {
    phrases.push(
      `La magnitud del campo varía entre ${formatNumber(analysis.magnitude.min)} y ${formatNumber(analysis.magnitude.max)}, con un promedio de ${formatNumber(analysis.magnitude.avg)}.`
    );
  }

  if (analysis.predominantDirection?.label) {
    phrases.push(`En promedio, las flechas apuntan hacia el ${analysis.predominantDirection.label}.`);
  }

  if (analysis.flowType && analysis.flowType !== 'no determinable') {
    phrases.push(`El flujo global se clasifica numéricamente como "${analysis.flowType}".`);
  }

  if (analysis.originBehavior) {
    phrases.push(analysis.originBehavior);
  }

  return phrases;
}

function formatNumber(value) {
  if (value === null || Number.isNaN(value)) return 'N/D';
  return value.toFixed(2);
}
