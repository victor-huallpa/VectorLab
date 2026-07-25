import { compile, derivative as mathDerivative } from 'mathjs';

/**
 * Envoltorio delgado sobre math.js. Compilar una expresión es costoso;
 * se cachea por string para que el canvas pueda re-evaluar miles de
 * puntos por frame sin recompilar la fórmula en cada llamada.
 */
const compileCache = new Map();
// Derivadas simbólicas (mathjs `derivative`), cacheadas por "variable::expresión"
// porque el motor de integrales de línea las necesita para r'(t) y las vuelve
// a evaluar en decenas de puntos de muestreo por cada render.
const derivativeCache = new Map();

function getCompiled(expression) {
  if (!compileCache.has(expression)) {
    compileCache.set(expression, compile(expression));
  }
  return compileCache.get(expression);
}

function getDerivativeNode(expression, variable) {
  const key = `${variable}::${expression}`;
  if (!derivativeCache.has(key)) {
    try {
      derivativeCache.set(key, mathDerivative(expression, variable));
    } catch {
      // No toda expresión es derivable simbólicamente por mathjs (p. ej.
      // funciones a trozos). null indica "usar diferencias finitas".
      derivativeCache.set(key, null);
    }
  }
  return derivativeCache.get(key);
}

/**
 * Evalúa una expresión matemática en un scope arbitrario de variables
 * (p. ej. {x, y}, {x, y, z} o {t}). Devuelve NaN si la expresión es
 * inválida en ese punto, en vez de lanzar, para que el render/cómputo
 * pueda simplemente omitir ese punto.
 */
export function evaluateScope(expression, scope) {
  try {
    const node = getCompiled(expression);
    const result = node.evaluate(scope);
    return typeof result === 'number' && Number.isFinite(result) ? result : NaN;
  } catch {
    return NaN;
  }
}

/**
 * Evalúa una expresión matemática en (x, y). Devuelve NaN si la
 * expresión es inválida en ese punto, en vez de lanzar, para que el
 * render pueda simplemente omitir ese vector.
 */
export function evaluateAt(expression, x, y) {
  return evaluateScope(expression, { x, y });
}

/**
 * Valida que una expresión sea sintácticamente correcta y evaluable en
 * un punto de prueba (scope de variables configurable: {x,y} por
 * defecto para campos 2D, {t} para curvas paramétricas, {x,y,z} para
 * campos 3D). Se usa en los inputs del formulario para dar feedback
 * inmediato sin esperar a renderizar/calcular nada más.
 * @param {string} expression
 * @param {Object.<string, number>} [testScope]
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateExpression(expression, testScope = { x: 1, y: 1 }) {
  if (!expression || !expression.trim()) {
    return { valid: false, error: 'La expresión no puede estar vacía.' };
  }
  try {
    compileCache.delete(expression); // forzar recompilación para detectar errores reales
    const node = getCompiled(expression);
    const result = node.evaluate(testScope);
    if (typeof result !== 'number' || Number.isNaN(result)) {
      return { valid: false, error: 'La expresión no produce un número real.' };
    }
    return { valid: true };
  } catch {
    const vars = Object.keys(testScope).join(', ');
    return { valid: false, error: `Sintaxis inválida. Usa ${vars} y funciones como sin, cos, exp.` };
  }
}

/**
 * Derivada simbólica de `expression` respecto a `variable`, como string
 * (ej. "2 * t"). Devuelve null si mathjs no puede derivarla
 * analíticamente (en ese caso, evaluateDerivativeAt recurre a
 * diferencias finitas de forma transparente).
 */
export function symbolicDerivative(expression, variable) {
  const node = getDerivativeNode(expression, variable);
  return node ? node.toString() : null;
}

const H = 1e-5;

/**
 * Diferencia centrada genérica: d(expression)/d(variable) evaluada en
 * scope[variable]. Es el fallback cuando no existe derivada simbólica,
 * y sigue la misma idea que domain/field-analysis/vectorCalculus.js
 * (partialX/partialY) pero para una variable arbitraria.
 */
export function numericDerivativeAt(expression, variable, scope) {
  const plus = { ...scope, [variable]: scope[variable] + H };
  const minus = { ...scope, [variable]: scope[variable] - H };
  const a = evaluateScope(expression, plus);
  const b = evaluateScope(expression, minus);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return (a - b) / (2 * H);
}

/**
 * Evalúa la derivada de `expression` respecto a `variable` en `scope`,
 * usando la forma simbólica cuando es posible (más precisa) y cayendo a
 * diferencias finitas si mathjs no puede derivarla o si la derivada
 * simbólica no es evaluable en ese punto puntual.
 */
export function evaluateDerivativeAt(expression, variable, scope) {
  const node = getDerivativeNode(expression, variable);
  if (node) {
    try {
      const result = node.evaluate(scope);
      if (typeof result === 'number' && Number.isFinite(result)) return result;
    } catch {
      // cae al fallback numérico
    }
  }
  return numericDerivativeAt(expression, variable, scope);
}

export function clearMathCache() {
  compileCache.clear();
  derivativeCache.clear();
}
