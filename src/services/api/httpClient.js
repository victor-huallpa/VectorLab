/**
 * Cliente HTTP simulado.
 *
 * Ningún componente ni store debe usar setTimeout o localStorage
 * directamente: todo pasa por aquí. El día que exista una API real,
 * este es el ÚNICO archivo que debe cambiar (ej. reemplazar por fetch
 * o axios) — services/*.js seguirán exponiendo la misma interfaz de
 * Promises hacia el resto de la app.
 */

const DEFAULT_LATENCY_MS = 220;

/**
 * Simula una petición HTTP exitosa que resuelve con `data` tras una
 * latencia artificial. Pensado para reemplazarse por un GET/POST real.
 * @template T
 * @param {T} data
 * @param {{ latency?: number }} [options]
 * @returns {Promise<T>}
 */
export function simulateRequest(data, options = {}) {
  const latency = options.latency ?? DEFAULT_LATENCY_MS;
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), latency);
  });
}

/**
 * Simula una petición que puede fallar, para que la UI (loading /
 * error states) se construya igual que si hablara con un backend real.
 * @template T
 * @param {() => T} producer  Función que produce los datos si la simulación "tiene éxito"
 * @param {{ latency?: number, failureRate?: number, errorMessage?: string }} [options]
 * @returns {Promise<T>}
 */
export function simulateRequestWithFailure(producer, options = {}) {
  const { latency = DEFAULT_LATENCY_MS, failureRate = 0, errorMessage = 'Error simulado de red' } = options;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failureRate) {
        reject(new Error(errorMessage));
      } else {
        resolve(producer());
      }
    }, latency);
  });
}
