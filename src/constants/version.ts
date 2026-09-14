import pkg from '../../package.json';

/**
 * Versión de la aplicación sincronizada dinámicamente con package.json
 */
export const APP_VERSION = `v${pkg.version}`;
