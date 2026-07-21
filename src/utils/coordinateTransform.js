/**
 * Construye funciones de transformación entre el dominio matemático
 * (xmin..xmax, ymin..ymax) y el espacio de píxeles del canvas.
 * Se centraliza aquí porque tanto el render como el tooltip (mouse →
 * coordenadas del mundo) necesitan la transformación inversa exacta.
 */
export function createTransform(domain, canvasWidth, canvasHeight) {
  const { xmin, xmax, ymin, ymax } = domain;
  const scaleX = canvasWidth / (xmax - xmin);
  const scaleY = canvasHeight / (ymax - ymin);

  return {
    worldToScreen(x, y) {
      return {
        sx: (x - xmin) * scaleX,
        sy: canvasHeight - (y - ymin) * scaleY, // invertido: y crece hacia arriba en el mundo
      };
    },
    screenToWorld(sx, sy) {
      return {
        x: xmin + sx / scaleX,
        y: ymin + (canvasHeight - sy) / scaleY,
      };
    },
    scaleX,
    scaleY,
  };
}
