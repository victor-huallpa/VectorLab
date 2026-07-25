/**
 * Contenido del HelpDrawer para el laboratorio de Integrales de Línea.
 * Misma forma que vectorFieldHelpContent.js (ver docs/ARCHITECTURE.md
 * §8): HelpDrawer/HelpSection/HelpCard son genéricos y no saben nada de
 * integrales, todo el texto sale de aquí.
 */
export const LINE_INTEGRAL_HELP_CONTENT = {
  labTitle: 'Integrales de Línea',
  sections: [
    {
      id: 'que-es-integral-linea',
      title: '¿Qué es una integral de línea?',
      paragraphs: [
        'Una integral de línea acumula los valores de un campo vectorial F a lo largo de una curva C, en vez de sobre una región del plano o del espacio. Para un campo vectorial, se define como ∫_C F · dr, donde dr = r\'(t) dt y r(t) es la parametrización de la curva.',
        'Este laboratorio soporta curvas y campos en 2D (x, y) y en 3D (x, y, z): activa el interruptor "Curva en 3D" para habilitar la componente z(t) de la curva y R(x,y,z) del campo.',
      ],
    },
    {
      id: 'sintaxis',
      title: '¿Cómo se definen la curva y el campo?',
      paragraphs: [
        'La curva se parametriza como x(t), y(t) (y z(t) si es 3D) para t entre t0 y t1, reutilizando el mismo parser matemático (mathjs) del módulo de Campos Vectoriales.',
        'El campo se define como F(x,y) = P(x,y) i + Q(x,y) j en 2D, o F(x,y,z) = P i + Q j + R k en 3D. Puedes usar funciones como sin, cos, exp, sqrt y las variables correspondientes (x, y, z o t según el campo).',
      ],
    },
    {
      id: 'procedimiento',
      title: '¿Cómo se calcula el resultado?',
      paragraphs: [
        'El motor sigue los mismos pasos que se harían a mano: (1) parametriza la curva r(t); (2) calcula r\'(t), de forma simbólica cuando es posible y con diferencias finitas centradas si no; (3) sustituye r(t) en el campo para obtener F(r(t)); (4) calcula el producto punto F(r(t)) · r\'(t); (5) integra ese resultado escalar entre t0 y t1 usando la regla de Simpson compuesta.',
        'Si alguna expresión no es evaluable en todo el intervalo (por ejemplo, una división por cero), el panel de resultado muestra un mensaje de error en vez de un número, indicando qué revisar.',
      ],
    },
  ],
};
