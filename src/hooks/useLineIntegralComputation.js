import { useEffect, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue.js';
import { fetchLineIntegralResult } from '../services/lineIntegralService.js';

/**
 * Hook del módulo "Integrales de Línea", análogo a useFieldAnalysis.js:
 * observa field/curve/samples/is3D, aplica debounce y llama al servicio,
 * que a su vez invoca el motor real (domain/line-integral/).
 *
 * Expone el mismo ciclo de estados que useFieldAnalysis
 * ('idle' | 'loading' | 'success' | 'error'). En 'error', `result.errors`
 * trae los mensajes por campo (p, q, r, x, y, z, interval, computation)
 * para que la UI los muestre igual que FieldForm hace con
 * validateExpression.
 *
 * @param {{p: string, q: string, r?: string}} field
 * @param {{x: string, y: string, z?: string, t0: number, t1: number}} curve
 * @param {number} samples
 * @param {boolean} [is3D=false]
 */
export function useLineIntegralComputation(field, curve, samples, is3D = false) {
  const debouncedField = useDebouncedValue(field, 250);
  const debouncedCurve = useDebouncedValue(curve, 250);
  const debouncedIs3D = useDebouncedValue(is3D, 250);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetchLineIntegralResult({ field: debouncedField, curve: debouncedCurve, samples, is3D: debouncedIs3D })
      .then((data) => {
        if (cancelled) return;
        setResult(data);
        setStatus(data.status === 'success' ? 'success' : 'error');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedField, debouncedCurve, samples, debouncedIs3D]);

  return { result, status };
}
