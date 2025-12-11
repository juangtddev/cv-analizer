// Em supabase/functions/create-resume/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.5';
import { handleCorsPreflight, createCorsHeaders } from '../_shared/cors.ts'; // Assumindo que você tem um cors.ts compartilhado

serve(async (req) => {
  // Lida com a requisição preflight (OPTIONS) para o CORS
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight(req, { allowedMethods: ['POST', 'OPTIONS'] });
  }

  const corsResponseHeaders = createCorsHeaders(req, {
    allowedMethods: ['POST'],
  });

  try {
    // --- MUDANÇA PRINCIPAL AQUI ---
    // 1. Crie um cliente ADMIN com a chave de serviço.
    const supabaseAdminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Usando a chave mestra!
    );

    // 2. Pegue o token de autenticação do cabeçalho da requisição.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Cabeçalho de autorização ausente.');
    }
    const jwt = authHeader.replace('Bearer ', '');

    // 3. Use o cliente ADMIN para validar o token do usuário.
    const {
      data: { user },
      error: userError,
    } = await supabaseAdminClient.auth.getUser(jwt);

    if (userError || !user) {
      console.error('Erro de autenticação do usuário:', userError);
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado.' }),
        {
          headers: {
            ...corsResponseHeaders,
            'Content-Type': 'application/json',
          },
          status: 401,
        },
      );
    }
    // Se chegamos aqui, o usuário é válido.
    const userId = user.id;

    const { file_url, file_name } = await req.json();

    if (!file_url || !file_name) {
      return new Response(
        JSON.stringify({ error: 'URL do arquivo ou nome não fornecidos.' }),
        {
          headers: {
            ...corsResponseHeaders,
            'Content-Type': 'application/json',
          },
          status: 400,
        },
      );
    }

    // 4. Use o mesmo cliente ADMIN para fazer a inserção no banco de dados.
    // Como ele tem a 'service_role_key', ele tem permissão para escrever na tabela 'resumes',
    // mesmo que haja políticas de segurança (RLS) ativadas.
    const { data: newResume, error: dbError } = await supabaseAdminClient
      .from('resumes')
      .insert({
        user_id: userId,
        file_url: file_url,
        file_name: file_name,
      })
      .select('id')
      .single();

    if (dbError) {
      throw dbError;
    }

    return new Response(JSON.stringify({ id: newResume.id }), {
      headers: { ...corsResponseHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error("Erro na Edge Function 'create-resume':", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsResponseHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
