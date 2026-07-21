import { useEffect, useState } from 'react';
import { fetchVectorField } from '../services/vectorFieldService.js';
import { validateExpression } from '../utils/mathParser.js';
import { validateDomain } from '../utils/validators.js';
import { useDebouncedValue } from './useDebouncedValue.js';

/**
 * Orquesta la validación y el cálculo del campo vectorial a través del
 * servicio (nunca evalúa expresiones directamente). Devuelve el estado
 * de carga tal como lo haría un hook que consume una API real.
 */
export function useVectorFieldGrid(p, q, config) {
  const debouncedP = useDebouncedValue(p, 250);
  const debouncedQ = useDebouncedValue(q, 250);
  const debouncedConfig = useDebouncedValue(config, 250);

  const [vectors, setVectors] = useState([]);
  const [status, setStatus] = useState('idle');
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    const pCheck = validateExpression(debouncedP);
    const qCheck = validateExpression(debouncedQ);
    const domainCheck = validateDomain(debouncedConfig.domain);

    if (!pCheck.valid) {
      setValidationError(`P(x,y): ${pCheck.error}`);
      return;
    }
    if (!qCheck.valid) {
      setValidationError(`Q(x,y): ${qCheck.error}`);
      return;
    }
    if (!domainCheck.valid) {
      setValidationError(domainCheck.error);
      return;
    }
    setValidationError(null);

    let cancelled = false;
    setStatus('loading');
    fetchVectorField({
      p: debouncedP,
      q: debouncedQ,
      domain: debouncedConfig.domain,
      density: debouncedConfig.density,
    }).then((result) => {
      if (cancelled) return;
      setVectors(result);
      setStatus('success');
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedP, debouncedQ, debouncedConfig]);

  return { vectors, status, validationError };
}
