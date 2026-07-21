/**
 * Catálogo cerrado de clasificaciones que FieldClassifier puede emitir.
 *
 * Es la única fuente de verdad para "qué tipos de campo existen". Tanto
 * FieldClassifier como FieldInterpreter y fieldEducationalContent importan
 * estas claves en lugar de escribir strings sueltos, así que agregar un
 * tipo nuevo en el futuro (ej. "espiral") es un cambio en un solo lugar.
 */
export const FIELD_TYPES = Object.freeze({
  UNIFORM: 'uniforme',
  RADIAL_SOURCE: 'fuente_radial',
  SINK: 'sumidero',
  PURE_ROTATION: 'rotacion_pura',
  SADDLE: 'punto_silla',
  WAVE: 'ondulatorio',
  CUSTOM: 'personalizado',
});

/** Etiquetas legibles para UI y PDF. */
export const FIELD_TYPE_LABELS = Object.freeze({
  [FIELD_TYPES.UNIFORM]: 'Campo uniforme',
  [FIELD_TYPES.RADIAL_SOURCE]: 'Fuente radial',
  [FIELD_TYPES.SINK]: 'Sumidero',
  [FIELD_TYPES.PURE_ROTATION]: 'Rotación pura',
  [FIELD_TYPES.SADDLE]: 'Punto silla',
  [FIELD_TYPES.WAVE]: 'Campo ondulatorio',
  [FIELD_TYPES.CUSTOM]: 'Campo personalizado',
});

/** Lista ordenada, útil para recorrer el catálogo en UI (ej. tarjetas de ayuda). */
export const FIELD_TYPE_LIST = Object.values(FIELD_TYPES);
