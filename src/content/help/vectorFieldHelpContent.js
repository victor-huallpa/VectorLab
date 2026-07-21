/**
 * @typedef {Object} HelpSectionData
 * @property {string} id
 * @property {string} title
 * @property {string[]} paragraphs
 * @property {{ term: string, detail: string }[]} [items]
 */

/**
 * Contenido del HelpDrawer para el laboratorio de Campos Vectoriales.
 * HelpDrawer/HelpSection/HelpCard son componentes genéricos y no saben
 * nada de cálculo vectorial: todo lo que dicen sale de este archivo, así
 * que un futuro laboratorio (Gradiente, Divergencia...) solo necesita
 * escribir su propio `xHelpContent.js` con esta misma forma.
 */
export const VECTOR_FIELD_HELP_CONTENT = {
  labTitle: 'Campos Vectoriales',
  sections: [
    {
      id: 'que-es-campo',
      title: '¿Qué es un campo vectorial?',
      paragraphs: [
        'Un campo vectorial asigna un vector — una flecha con dirección y magnitud — a cada punto del plano. En VectorLab, ese vector se calcula como F(x, y) = P(x, y) i + Q(x, y) j.',
        'P(x,y) controla cuánto se mueve la flecha en el eje horizontal (x) y Q(x,y) cuánto se mueve en el eje vertical (y). Juntas definen tanto la dirección como el tamaño de cada vector.',
      ],
    },
    {
      id: 'sintaxis',
      title: '¿Cómo escribir funciones?',
      paragraphs: [
        'Las expresiones se escriben usando notación matemática estándar. El laboratorio evalúa P y Q en cada punto de la grilla para dibujar las flechas.',
      ],
      items: [
        { term: 'Variables permitidas', detail: 'x, y' },
        { term: 'Operadores permitidos', detail: '+, -, *, /, ^ (potencia)' },
        { term: 'Funciones soportadas', detail: 'sin, cos, tan, exp, sqrt, log, abs' },
        { term: 'Constantes disponibles', detail: 'pi, e' },
      ],
    },
    {
      id: 'grafica',
      title: 'Cómo interpretar la gráfica',
      paragraphs: [
        'Cada flecha representa el vector F(x, y) en ese punto: su dirección indica hacia dónde "empuja" el campo y su longitud indica qué tan intenso es.',
        'Cuando el coloreado por magnitud está activo, las flechas más cortas y frías (teal) tienen menor intensidad, y las más largas y cálidas (ámbar/coral) tienen mayor intensidad.',
        'Las partículas animadas muestran cómo se movería un objeto arrastrado por el campo, siguiendo las flechas en tiempo real.',
      ],
    },
    {
      id: 'magnitud',
      title: 'Qué representa la magnitud',
      paragraphs: [
        'La magnitud es el tamaño del vector F(x, y), calculada como la raíz cuadrada de P² + Q². Indica qué tan "fuerte" es el campo en ese punto, sin importar la dirección.',
      ],
    },
    {
      id: 'divergencia-rotacional',
      title: 'Qué representan la divergencia y el rotacional',
      paragraphs: [
        'La divergencia mide si el campo "se expande" o "se contrae" en un punto: positiva indica que el flujo sale de ese punto (como una fuente), negativa que converge hacia él (como un sumidero).',
        'El rotacional mide cuánto "gira" el campo alrededor de un punto: distinto de cero indica presencia de rotación, y su signo indica el sentido (antihorario si es positivo, horario si es negativo).',
      ],
    },
    {
      id: 'dominio',
      title: 'Dominio',
      paragraphs: [
        'El dominio define la región del plano que se dibuja: [xmin, xmax] en el eje horizontal y [ymin, ymax] en el eje vertical.',
        'Un dominio muy grande (más de 200 unidades por eje) reduce el detalle visual, así que el laboratorio limita ese tamaño automáticamente.',
      ],
    },
    {
      id: 'visualizacion',
      title: 'Visualización',
      paragraphs: [
        'La densidad controla cuántas flechas se dibujan por eje. La escala agranda o reduce visualmente las flechas sin cambiar los valores del campo.',
        'Colorear por magnitud tiñe cada flecha según su intensidad (teal = baja, ámbar/coral = alta). La simulación de partículas anima puntos que siguen el campo en tiempo real.',
      ],
    },
    {
      id: 'analisis',
      title: 'Análisis',
      paragraphs: [
        'Las tarjetas de análisis, propiedades e interpretación se recalculan automáticamente cada vez que cambian P(x,y), Q(x,y) o el dominio — no requieren ninguna acción tuya.',
        'La clasificación (fuente, sumidero, rotación, punto silla, ondulatorio, uniforme o personalizado) se basa en el comportamiento matemático real del campo, no en una lista fija de nombres conocidos.',
      ],
    },
    {
      id: 'ejemplos',
      title: 'Ejemplos para explorar',
      paragraphs: ['Prueba estos campos desde el selector "Campos de ejemplo" y observa cómo cambian el análisis y la interpretación automáticamente.'],
      examples: [
        { p: 'x', q: 'y', description: 'Fuente radial: las flechas se alejan del origen en todas direcciones.' },
        { p: '-x', q: '-y', description: 'Sumidero: las flechas convergen hacia el origen.' },
        { p: '-y', q: 'x', description: 'Rotación pura: las flechas giran alrededor del origen en sentido antihorario.' },
        { p: 'x', q: '-y', description: 'Punto silla: atrae en una dirección y repele en la otra.' },
        { p: 'sin(y)', q: 'cos(x)', description: 'Campo ondulatorio: el patrón se repite periódicamente en el plano.' },
      ],
    },
  ],
  /**
   * Ayuda contextual corta (un párrafo, no una sección completa) para
   * los iconos "?" junto a cada bloque del formulario.
   */
  contextualHints: {
    funciones: '¿Qué representan P(x,y) y Q(x,y)? Toca aquí para ver la sintaxis permitida y ejemplos.',
    dominio: 'Define la región del plano que se dibuja. Un dominio muy grande reduce el detalle visual.',
    visualizacion: 'Ajusta cuántas flechas se dibujan, su tamaño y si se colorean según su magnitud.',
    analisis: 'Estas propiedades se calculan automáticamente a partir de P(x,y) y Q(x,y): no requieren ninguna acción tuya.',
  },
};
