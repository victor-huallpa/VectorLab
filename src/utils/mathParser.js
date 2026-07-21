import { compile } from 'mathjs';

/**
 * Envoltorio delgado sobre math.js. Compilar una expresión es costoso;
 * se cachea por string para que el canvas pueda re-evaluar miles de
 * puntos por frame sin recompilar la fórmula en cada llamada.
 */
const compileCache = new Map();

function getCompiled(expression) {
  if (!compileCache.has(expression)) {
    compileCache.set(expression, compile(expression));
  }
  return compileCache.get(expression);
}

/**
 * Evalúa una expresión matemática en (x, y). Devuelve NaN si la
 * expresión es inválida en ese punto, en vez de lanzar, para que el
 * render pueda simplemente omitir ese vector.
 */
export function evaluateAt(expression, x, y) {
  try {
    const node = getCompiled(expression);
    const result = node.evaluate({ x, y });
    return typeof result === 'number' && Number.isFinite(result) ? result : NaN;
  } catch {
    return NaN;
  }
}

/**
 * Valida que una expresión sea sintácticamente correcta y evaluable
 * en un punto de prueba. Se usa en los inputs del formulario para dar
 * feedback inmediato sin esperar a renderizar toda la grilla.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateExpression(expression) {
  if (!expression || !expression.trim()) {
    return { valid: false, error: 'La expresión no puede estar vacía.' };
  }
  try {
    compileCache.delete(expression); // forzar recompilación para detectar errores reales
    const node = getCompiled(expression);
    const result = node.evaluate({ x: 1, y: 1 });
    if (typeof result !== 'number' || Number.isNaN(result)) {
      return { valid: false, error: 'La expresión no produce un número real.' };
    }
    return { valid: true };
  } catch (err) {
    return { valid: false, error: 'Sintaxis inválida. Usa x, y y funciones como sin, cos, exp.' };
  }
}

export function clearMathCache() {
  compileCache.clear();
}
