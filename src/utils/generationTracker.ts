/**
 * Servicio de métricas serverless con CounterAPI v2.
 * Registra cada generación de imagen sin base de datos ni servidor propio.
 */

// Endpoint oficial configurado para el equipo de Aleric Dev
const COUNTERAPI_UP_URL = 'https://api.counterapi.dev/v2/aleric-dev/media-studio-generator-counter/up';
const COUNTERAPI_STATS_URL = 'https://api.counterapi.dev/v2/aleric-dev/media-studio-generator-counter/stats';

// Token de autenticación privado (leído desde .env o Cloudflare Pages)
const API_KEY = (import.meta.env.VITE_COUNTERAPI_TOKEN as string | undefined)?.trim();

/**
 * Incrementa el contador global en CounterAPI v2 cada vez que se genera una imagen.
 * Llamada asíncrona con logs informativos para depuración en desarrollo.
 */
export const trackImageGeneration = async (): Promise<void> => {
  if (!API_KEY) {
    console.warn(
      '[CounterAPI] ⚠️ No se ha configurado VITE_COUNTERAPI_TOKEN en el archivo .env. La generación no se registrará en CounterAPI.'
    );
    return;
  }

  try {
    const res = await fetch(COUNTERAPI_UP_URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      console.warn(
        `[CounterAPI] ❌ Error de autenticación (${res.status}): El token VITE_COUNTERAPI_TOKEN no es válido o no tiene permisos para este contador.`
      );
      return;
    }

    if (res.status === 404) {
      console.warn(
        `[CounterAPI] ⚠️ Error 404: El namespace o contador no fue encontrado en la URL: ${COUNTERAPI_UP_URL}`
      );
      return;
    }

    if (!res.ok) {
      console.warn(
        `[CounterAPI] ⚠️ Error del servidor al registrar generación: HTTP ${res.status} - ${res.statusText}`
      );
      return;
    }

    const data = await res.json().catch(() => null);
    console.log('[CounterAPI] ✅ Generación registrada con éxito en CounterAPI:', data);
  } catch (err) {
    console.warn(
      '[CounterAPI] ⚠️ Error de red o bloqueo CORS al conectar con CounterAPI:',
      err
    );
  }
};

/**
 * Consulta las estadísticas acumuladas del contador en CounterAPI v2.
 * Retorna el número total de generaciones o null si falla.
 */
export const fetchGlobalGenerationCount = async (): Promise<number | null> => {
  if (!API_KEY) {
    console.warn(
      '[CounterAPI] ⚠️ No se pueden consultar estadísticas globales porque falta VITE_COUNTERAPI_TOKEN en .env.'
    );
    return null;
  }

  try {
    const res = await fetch(COUNTERAPI_STATS_URL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      console.warn(
        `[CounterAPI] ❌ Error de autenticación (${res.status}) al consultar stats: Token inválido o expirado.`
      );
      return null;
    }

    if (res.status === 404) {
      console.warn(
        `[CounterAPI] ⚠️ Error 404 al consultar stats: URL no encontrada: ${COUNTERAPI_STATS_URL}`
      );
      return null;
    }

    if (!res.ok) {
      console.warn(
        `[CounterAPI] ⚠️ Fallo al consultar estadísticas de CounterAPI: HTTP ${res.status} - ${res.statusText}`
      );
      return null;
    }

    const data = await res.json();
    const count = data?.total ?? data?.count ?? data?.up ?? (typeof data === 'number' ? data : null);

    if (typeof count === 'number') {
      console.log(`[CounterAPI] 📊 Total acumulado en CounterAPI: ${count} generaciones.`);
      return count;
    }

    console.warn('[CounterAPI] ⚠️ La respuesta de stats no contiene un número válido:', data);
    return null;
  } catch (err) {
    console.warn(
      '[CounterAPI] ⚠️ Error de conexión al consultar estadísticas de CounterAPI:',
      err
    );
    return null;
  }
};
