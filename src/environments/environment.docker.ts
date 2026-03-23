/**
 * Plantilla usada en la imagen Docker: el valor __NG_API_URL__ se reemplaza en el build.
 * No importes este archivo desde la app; el Dockerfile copia el resultado a `environment.ts`.
 */
export const environment = {
  apiUrl: '__NG_API_URL__',
  CLAVE_TOKEN: 'maja_token',
};
