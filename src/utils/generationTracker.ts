/**
 * Servicio de métricas serverless con CounterAPI v2.
 * Registra cada generación de imagen sin base de datos ni servidor propio.
 */

/**
 * Endpoints del servicio serverless.
 * En desarrollo: Atendidos por el proxy de Vite en vite.config.ts.
 * En producción: Atendidos por Cloudflare Pages Functions en functions/api/counter/[[action]].ts.
 * 
 * Ambos entornos inyectan el encabezado oficial:
 * Authorization: Bearer <TOKEN>
 * garantizando cero errores de CORS y protección total del token privado.
 */
const API_BASE = '/api/counter';
const COUNTERAPI_UP_URL = `${API_BASE}/up`;
const COUNTERAPI_STATS_URL = `${API_BASE}/stats`;

/**
 * Incrementa el contador global en CounterAPI v2 cada vez que se genera una imagen.
 */
export const trackImageGeneration = async (): Promise<void> => {
  try {
    const res = await fetch(COUNTERAPI_UP_URL, {
      method: 'GET',
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.warn(
        `[CounterAPI] ⚠️ Error del servidor al registrar generación: HTTP ${res.status} - ${res.statusText}`
      );
      return;
    }

    const data = await res.json().catch(() => null);
    console.log('[CounterAPI] ✅ Generación registrada con éxito en CounterAPI:', data);
  } catch (err) {
    console.warn('[CounterAPI] ⚠️ Error de red al conectar con CounterAPI:', err);
  }
};

/**
 * Consulta las estadísticas acumuladas del contador en CounterAPI v2.
 * Retorna el número total de generaciones o null si falla.
 */
export const fetchGlobalGenerationCount = async (): Promise<number | null> => {
  try {
    const res = await fetch(COUNTERAPI_STATS_URL, {
      method: 'GET',
    });

    if (!res.ok) {
      console.warn(
        `[CounterAPI] ⚠️ Fallo al consultar estadísticas de CounterAPI: HTTP ${res.status} - ${res.statusText}`
      );
      return null;
    }

    const data: { data: { up_count: number } } = await res.json();
    const count =
      data?.data?.up_count

    if (typeof count === 'number') {
      console.log(`[CounterAPI] 📊 Total acumulado en CounterAPI: ${count} generaciones.`);
      return count;
    }

    console.warn('[CounterAPI] ⚠️ La respuesta de stats no contiene un número válido:', data);
    return null;
  } catch (err) {
    console.warn('[CounterAPI] ⚠️ Error de conexión al consultar estadísticas de CounterAPI:', err);
    return null;
  }
};


