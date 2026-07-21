import { evaluateAt } from './mathParser.js';

/**
 * Sistema de partículas que siguen el flujo del campo vectorial.
 * Deliberadamente desacoplado de React y del canvas: solo conoce
 * coordenadas del "mundo" (el dominio matemático), nunca píxeles.
 * El componente de render es quien traduce a coordenadas de pantalla.
 */
export class ParticleSystem {
  /**
   * @param {number} count
   * @param {import('../models/VectorFieldConfig.js').Domain} domain
   */
  constructor(count, domain) {
    this.domain = domain;
    this.particles = Array.from({ length: count }, () => this.#spawn());
  }

  #spawn() {
    const { xmin, xmax, ymin, ymax } = this.domain;
    return {
      x: xmin + Math.random() * (xmax - xmin),
      y: ymin + Math.random() * (ymax - ymin),
      age: Math.random() * 3,
      life: 2 + Math.random() * 3,
    };
  }

  setDomain(domain) {
    this.domain = domain;
  }

  setCount(count) {
    const current = this.particles.length;
    if (count > current) {
      this.particles.push(...Array.from({ length: count - current }, () => this.#spawn()));
    } else if (count < current) {
      this.particles.length = count;
    }
  }

  /**
   * Avanza la simulación. Las partículas que salen del dominio o
   * terminan su ciclo de vida se reinician en una posición aleatoria,
   * para que el flujo se sienta continuo en vez de "vaciarse".
   * @param {string} p
   * @param {string} q
   * @param {number} dt
   * @param {number} speedFactor
   */
  step(p, q, dt, speedFactor = 1) {
    const { xmin, xmax, ymin, ymax } = this.domain;
    const spanX = xmax - xmin;

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const vx = evaluateAt(p, particle.x, particle.y);
      const vy = evaluateAt(q, particle.x, particle.y);

      if (Number.isNaN(vx) || Number.isNaN(vy)) {
        this.particles[i] = this.#spawn();
        continue;
      }

      // Normalizamos el paso por el tamaño del dominio para que la
      // velocidad visual sea consistente sin importar la escala matemática.
      const normalization = (spanX || 1) * 0.06;
      particle.x += vx * dt * speedFactor * normalization;
      particle.y += vy * dt * speedFactor * normalization;
      particle.age += dt;

      const outOfBounds =
        particle.x < xmin || particle.x > xmax || particle.y < ymin || particle.y > ymax;

      if (outOfBounds || particle.age > particle.life) {
        this.particles[i] = this.#spawn();
      }
    }
  }
}
