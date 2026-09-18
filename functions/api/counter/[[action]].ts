interface Env {
  COUNTERAPI_TOKEN?: string;
  VITE_COUNTERAPI_TOKEN?: string;
}

/**
 * Cloudflare Pages Function: Proxy serverless para CounterAPI v2
 * 
 * Recibe peticiones del frontend a /api/counter/up o /api/counter/stats,
 * agrega el encabezado oficial 'Authorization: Bearer <TOKEN>' en el Edge de Cloudflare,
 * y devuelve la respuesta al navegador sin exponer el token ni tener errores de CORS.
 */
export const onRequestGet = async (context: {
  request: Request;
  env: Env;
  params: { action?: string | string[] };
}): Promise<Response> => {
  try {
    const rawAction = context.params?.action;
    const action = Array.isArray(rawAction) ? rawAction[0] : rawAction;

    // Solo permitir las acciones oficiales de CounterAPI v2
    if (action !== 'up' && action !== 'stats') {
      return new Response(
        JSON.stringify({ code: '400', message: 'Acción no válida. Usa /up o /stats' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener token desde las variables de entorno de Cloudflare Pages
    const token = (
      context.env?.COUNTERAPI_TOKEN ||
      context.env?.VITE_COUNTERAPI_TOKEN ||
      ''
    ).trim();

    const targetUrl = `https://api.counterapi.dev/v2/aleric-dev/media-studio-generator-counter/${action}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Petición directa de servidor a servidor (sin restricciones de CORS de navegador)
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    const body = await res.text();

    return new Response(body, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': action === 'up' ? 'no-cache, no-store' : 'public, max-age=30',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        code: '500',
        message: 'Error interno en Cloudflare Pages Function',
        error: String(err),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
