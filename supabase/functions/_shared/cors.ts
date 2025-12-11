type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';

interface CorsOptions {
  allowedOrigins?: string[]; // Lista de origens permitidas (ex: ['http://localhost:3000', 'https://seusite.com'])
  allowedMethods?: HttpMethod[]; // Métodos permitidos (ex: ['GET', 'POST', 'OPTIONS'])
  allowedHeaders?: string[]; // Cabeçalhos permitidos (ex: ['authorization', 'x-client-info', 'apikey', 'content-type'])
  maxAge?: number; // Cache do preflight em segundos (padrão: 86400 = 24 horas)
}

const DEFAULT_ALLOWED_METHODS: HttpMethod[] = ['GET', 'POST', 'OPTIONS'];
const DEFAULT_ALLOWED_HEADERS: string[] = [
  'authorization',
  'x-client-info',
  'apikey',
  'content-type',
  'x-supabase-api-version', // Adicionei este cabeçalho comum do Supabase
];
const DEFAULT_MAX_AGE = 86400; // 24 horas

/**
 * Cria os cabeçalhos CORS para uma resposta.
 * @param req A requisição original para extrair a origem.
 * @param options Opções de configuração CORS.
 * @returns Um objeto de cabeçalhos CORS.
 */
export function createCorsHeaders(
  req: Request,
  options?: CorsOptions,
): HeadersInit {
  const origin = req.headers.get('Origin');
  const allowedOrigins = options?.allowedOrigins || ['*']; // Padrão: permitir todas as origens

  let accessControlAllowOrigin = '*';

  if (origin && allowedOrigins.includes('*')) {
    accessControlAllowOrigin = origin; // Se permite tudo, usa a origem da requisição
  } else if (origin && allowedOrigins.includes(origin)) {
    accessControlAllowOrigin = origin; // Se a origem está na lista, usa-a
  } else if (allowedOrigins.length === 1 && allowedOrigins[0] === '*') {
    accessControlAllowOrigin = '*'; // Caso base, *
  } else {
    // Caso a origem não seja permitida e não seja um wildcard global
    // Você pode querer retornar um erro aqui ou um valor padrão seguro
    // Por enquanto, vamos manter o '*' para não quebrar o que já funciona.
    // Em um ambiente de produção, você pode querer ser mais restritivo.
    accessControlAllowOrigin = origin || allowedOrigins[0] || '*';
  }

  const headers: HeadersInit = {
    'Access-Control-Allow-Origin': accessControlAllowOrigin,
    'Access-Control-Allow-Methods': (
      options?.allowedMethods || DEFAULT_ALLOWED_METHODS
    ).join(', '),
    'Access-Control-Allow-Headers': (
      options?.allowedHeaders || DEFAULT_ALLOWED_HEADERS
    ).join(', '),
    'Access-Control-Max-Age': String(options?.maxAge || DEFAULT_MAX_AGE),
  };

  return headers;
}

/**
 * Lida com requisições OPTIONS (preflight).
 * @param req A requisição original.
 * @param options Opções de configuração CORS.
 * @returns Uma Response para a requisição OPTIONS.
 */
export function handleCorsPreflight(
  req: Request,
  options?: CorsOptions,
): Response {
  const headers = createCorsHeaders(req, options);
  return new Response(null, { headers, status: 204 }); // 204 No Content para preflight
}

/**
 * Wrapper para Edge Functions que gerencia CORS automaticamente.
 * @param handler A função principal da sua Edge Function.
 * @param options Opções de configuração CORS para a função específica.
 * @returns Um handler que pode ser usado com Deno.serve ou serve.
 */
export function withCors(
  handler: (req: Request) => Promise<Response>,
  options?: CorsOptions,
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    if (req.method === 'OPTIONS') {
      return handleCorsPreflight(req, options);
    }

    try {
      const response = await handler(req);
      const corsHeaders = createCorsHeaders(req, options);

      // Mescla os cabeçalhos CORS com os cabeçalhos existentes da resposta.
      // O 'Content-Type' geralmente é definido pelo handler, então o mantemos se já existir.
      const newHeaders = {
        ...corsHeaders,
        ...Object.fromEntries(response.headers.entries()),
      };

      // Se o Content-Type foi definido no handler, ele prevalece.
      // Caso contrário, adiciona o Content-Type padrão para JSON se a função retorna JSON.
      if (
        !newHeaders['Content-Type'] &&
        req.headers.get('Accept')?.includes('application/json')
      ) {
        newHeaders['Content-Type'] = 'application/json';
      }

      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    } catch (error) {
      console.error('Unhandled error in withCors wrapper:', error);
      const corsHeaders = createCorsHeaders(req, options);
      return new Response(
        JSON.stringify({ error: error.message || 'Internal Server Error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }
  };
}
