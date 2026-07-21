import { useEffect, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue.js';
import { validateExpression } from '../utils/mathParser.js';
import { analyzeField, classifyField, interpretField } from '../domain/field-analysis/index.js';

/**
 * @typedef {Object} FieldAnalysisState
 * @property {import('../domain/field-analysis/FieldAnalyzer.js').FieldAnalysisResult|null} analysis
 * @property {{type:string, confidence:string, reason:string}|null} classification
 * @property {{summary:string, details:string[]}|null} interpretation
 * @property {'idle'|'analyzing'|'ready'|'error'} status
 */

/**
 * useFieldAnalysis: se suscribe a p, q y config.domain con el mismo
 * debounce que usa useVectorFieldGrid, así que el módulo "Análisis del
 * Campo" se actualiza automáticamente en cuanto cambia el campo — sin
 * botón "Analizar" y sin recalcular más seguido de lo necesario.
 *
 * Deliberadamente separado de useVectorFieldGrid: la grilla de dibujo y
 * el análisis matemático son responsabilidades distintas y un futuro
 * laboratorio (Gradiente, Divergencia...) podría necesitar uno sin el
 * otro.
 *
 * @param {string} p
 * @param {string} q
 * @param {{domain: {xmin:number,xmax:number,ymin:number,ymax:number}}} config
 * @returns {FieldAnalysisState}
 */
export function useFieldAnalysis(p, q, config) {
  const debouncedP = useDebouncedValue(p, 250);
  const debouncedQ = useDebouncedValue(q, 250);
  const debouncedDomain = useDebouncedValue(config.domain, 250);

  const [state, setState] = useState({
    analysis: null,
    classification: null,
    interpretation: null,
    status: 'idle',
  });

  useEffect(() => {
    const pValid = validateExpression(debouncedP).valid;
    const qValid = validateExpression(debouncedQ).valid;

    if (!pValid || !qValid) {
      // Las expresiones inválidas ya se muestran como error en el
      // formulario/canvas; el módulo de análisis simplemente no calcula
      // nada hasta que vuelvan a ser válidas.
      setState({ analysis: null, classification: null, interpretation: null, status: 'idle' });
      return;
    }

    try {
      setState((prev) => ({ ...prev, status: 'analyzing' }));
      const analysis = analyzeField({ p: debouncedP, q: debouncedQ, domain: debouncedDomain });
      const classification = classifyField({ p: debouncedP, q: debouncedQ, analysis });
      const interpretation = interpretField({ classification, analysis });
      setState({ analysis, classification, interpretation, status: 'ready' });
    } catch {
      setState({ analysis: null, classification: null, interpretation: null, status: 'error' });
    }
  }, [debouncedP, debouncedQ, debouncedDomain]);

  return state;
}
