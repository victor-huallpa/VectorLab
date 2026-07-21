import { FIELD_TYPES } from '../../domain/field-analysis/fieldTypes.constants.js';

/**
 * @typedef {Object} FieldEducationalEntry
 * @property {string} nombre
 * @property {string} descripcion
 * @property {string} explicacion
 * @property {string[]} propiedades
 * @property {string[]} aplicaciones
 * @property {{p:string, q:string}[]} ejemplos
 * @property {'básico'|'intermedio'|'avanzado'} nivelDificultad
 * @property {string[]} conceptosRelacionados
 */

/**
 * Fuente única de contenido educativo por tipo de campo. Componentes
 * como AnalysisCard o HelpDrawer solo LEEN de aquí; ningún texto
 * educativo se escribe directamente dentro de un .jsx.
 * @type {Record<string, FieldEducationalEntry>}
 */
export const FIELD_EDUCATIONAL_CONTENT = {
  [FIELD_TYPES.UNIFORM]: {
    nombre: 'Campo uniforme',
    descripcion: 'Un campo donde todos los vectores tienen la misma dirección y magnitud, sin importar el punto del plano.',
    explicacion:
      'Si P y Q son constantes (o casi), cada punto del plano recibe el mismo vector. Es el caso más simple de campo vectorial: no hay expansión, contracción ni rotación, solo traslación uniforme.',
    propiedades: [
      'Divergencia igual a 0 en todo el dominio',
      'Rotacional igual a 0 en todo el dominio',
      'Magnitud prácticamente constante',
    ],
    aplicaciones: [
      'Campo gravitatorio aproximado cerca de la superficie terrestre',
      'Viento constante en un área pequeña',
      'Campo eléctrico entre placas paralelas de un capacitor',
    ],
    ejemplos: [{ p: '1', q: '0' }, { p: '0', q: '1' }, { p: '2', q: '1' }],
    nivelDificultad: 'básico',
    conceptosRelacionados: ['Vectores constantes', 'Traslación', 'Campos conservativos triviales'],
  },

  [FIELD_TYPES.RADIAL_SOURCE]: {
    nombre: 'Fuente radial',
    descripcion: 'Un campo donde todos los vectores apuntan hacia afuera desde un punto central.',
    explicacion:
      'Cuando P=x y Q=y (o proporciones similares), cada vector apunta en la misma dirección que su posición respecto al origen, alejándose de él. La divergencia es positiva en todo el plano.',
    propiedades: [
      'Divergencia positiva',
      'Rotacional aproximadamente 0',
      'Magnitud crece con la distancia al origen',
    ],
    aplicaciones: [
      'Campo eléctrico de una carga puntual positiva',
      'Expansión de un gas desde un punto de emisión',
      'Ondas expansivas en simulaciones físicas',
    ],
    ejemplos: [{ p: 'x', q: 'y' }, { p: '2*x', q: '2*y' }],
    nivelDificultad: 'básico',
    conceptosRelacionados: ['Divergencia', 'Campos radiales', 'Ley de Gauss'],
  },

  [FIELD_TYPES.SINK]: {
    nombre: 'Sumidero',
    descripcion: 'Un campo donde todos los vectores apuntan hacia un punto central, como si algo fuera absorbido.',
    explicacion:
      'Es el caso opuesto a la fuente radial: con P=-x y Q=-y, cada vector apunta hacia el origen. La divergencia es negativa en todo el plano, indicando que el flujo "desaparece" en el centro.',
    propiedades: [
      'Divergencia negativa',
      'Rotacional aproximadamente 0',
      'Magnitud crece a medida que uno se aleja del origen, pero la dirección siempre apunta hacia adentro',
    ],
    aplicaciones: [
      'Campo eléctrico de una carga puntual negativa',
      'Drenaje de un fluido hacia un desagüe',
      'Puntos de equilibrio estable en sistemas dinámicos',
    ],
    ejemplos: [{ p: '-x', q: '-y' }, { p: '-2*x', q: '-2*y' }],
    nivelDificultad: 'básico',
    conceptosRelacionados: ['Divergencia negativa', 'Estabilidad', 'Puntos de equilibrio'],
  },

  [FIELD_TYPES.PURE_ROTATION]: {
    nombre: 'Rotación pura',
    descripcion: 'Un campo donde los vectores giran alrededor de un punto central sin acercarse ni alejarse de él.',
    explicacion:
      'Con P=-y y Q=x, cada vector es perpendicular a la línea que lo une con el origen, generando un giro perfecto. La divergencia es 0 (no hay expansión) y el rotacional es distinto de 0 (sí hay giro).',
    propiedades: [
      'Divergencia igual a 0',
      'Rotacional distinto de 0 y constante en signo',
      'Las trayectorias de las partículas son circulares',
    ],
    aplicaciones: [
      'Modelo simplificado de un vórtice o remolino',
      'Campo magnético alrededor de un cable con corriente',
      'Movimiento circular en mecánica de fluidos',
    ],
    ejemplos: [{ p: '-y', q: 'x' }, { p: 'y', q: '-x' }],
    nivelDificultad: 'intermedio',
    conceptosRelacionados: ['Rotacional', 'Movimiento circular', 'Vórtices'],
  },

  [FIELD_TYPES.SADDLE]: {
    nombre: 'Punto silla',
    descripcion: 'Un campo donde el flujo se acerca al origen por una dirección y se aleja por otra distinta.',
    explicacion:
      'Con P=x y Q=-y, el eje x actúa como dirección de "escape" (los vectores se alejan) mientras el eje y actúa como dirección de "atracción" (los vectores se acercan). El origen es un equilibrio inestable: es atractivo en una dirección y repulsivo en otra.',
    propiedades: [
      'El determinante del jacobiano en el origen es negativo',
      'Combina comportamiento de atracción y repulsión según la dirección',
      'Es un punto de equilibrio inestable',
    ],
    aplicaciones: [
      'Puntos de bifurcación en sistemas dinámicos',
      'Superficies de energía potencial en física (collados)',
      'Análisis de estabilidad en ecuaciones diferenciales',
    ],
    ejemplos: [{ p: 'x', q: '-y' }, { p: '-x', q: 'y' }],
    nivelDificultad: 'avanzado',
    conceptosRelacionados: ['Jacobiano', 'Equilibrio inestable', 'Sistemas dinámicos'],
  },

  [FIELD_TYPES.WAVE]: {
    nombre: 'Campo ondulatorio',
    descripcion: 'Un campo cuya dirección e intensidad se repiten en patrones a lo largo del plano, como una onda.',
    explicacion:
      'Cuando P y Q incluyen funciones periódicas como seno o coseno, el campo no tiene un único comportamiento (no es solo fuente, sumidero o rotación), sino que ese comportamiento se repite espacialmente formando ondas visibles en la visualización.',
    propiedades: [
      'Depende de funciones trigonométricas (sin, cos, tan)',
      'Divergencia y rotacional cambian de signo varias veces en el dominio',
      'El patrón visual se repite con cierta periodicidad',
    ],
    aplicaciones: [
      'Modelos de ondas electromagnéticas simplificadas',
      'Patrones de viento u oleaje en meteorología',
      'Interferencia de ondas en física',
    ],
    ejemplos: [{ p: 'sin(y)', q: 'cos(x)' }, { p: 'cos(x)', q: 'sin(y)' }],
    nivelDificultad: 'avanzado',
    conceptosRelacionados: ['Funciones periódicas', 'Ondas', 'Interferencia'],
  },

  [FIELD_TYPES.CUSTOM]: {
    nombre: 'Campo personalizado',
    descripcion: 'Un campo que no coincide claramente con ninguno de los patrones típicos reconocidos por el laboratorio.',
    explicacion:
      'Esto no significa que el campo esté mal definido: simplemente combina características de varios comportamientos, o tiene una forma que aún no está en el catálogo de reconocimiento automático. Vale la pena observar la visualización y la tarjeta de propiedades para entenderlo mejor.',
    propiedades: [
      'Sus propiedades matemáticas (divergencia, rotacional, magnitud) siguen calculándose normalmente',
      'No se ajusta con claridad a un único patrón conocido',
    ],
    aplicaciones: [
      'Campos definidos por el propio estudiante para experimentar',
      'Combinaciones de comportamientos típicos',
    ],
    ejemplos: [{ p: 'x*y', q: 'x-y' }],
    nivelDificultad: 'intermedio',
    conceptosRelacionados: ['Exploración libre', 'Análisis numérico'],
  },
};

/** @returns {FieldEducationalEntry} */
export function getEducationalContent(fieldType) {
  return FIELD_EDUCATIONAL_CONTENT[fieldType] ?? FIELD_EDUCATIONAL_CONTENT[FIELD_TYPES.CUSTOM];
}
