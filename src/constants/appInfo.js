import packageJson from '../../package.json';

/**
 * Única fuente de verdad para nombre/versión de la app. El reporte PDF,
 * la página "Acerca de" y cualquier footer futuro deberían leer de acá
 * en vez de escribir "0.1.0" a mano en varios lugares.
 */
export const APP_NAME = 'VectorLab';
export const APP_VERSION = packageJson.version;
export const CURRENT_LAB_NAME = 'Campos Vectoriales';
