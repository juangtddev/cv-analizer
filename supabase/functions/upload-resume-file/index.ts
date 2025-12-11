// Em supabase/functions/upload-resume-file/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.5';
import { handleCorsPreflight, createCorsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight(req, { allowedMethods: ['POST', 'OPTIONS'] });
  }

  const corsResponseHeaders = createCorsHeaders(req, {
    allowedMethods: ['POST'],
  });

  try {
    // --- MUDANÇA PRINCIPAL AQUI ---
    // 1. Crie um cliente ADMIN com a chave de serviço (a chave mestra).
    // Este cliente tem privilégios para verificar a identidade de outros usuários.
    const supabaseAdminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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
    // Se chegamos aqui, o usuário é válido. 'user.id' contém o ID.
    const userId = user.id;

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Nenhum arquivo enviado.' }),
        {
          headers: {
            ...corsResponseHeaders,
            'Content-Type': 'application/json',
          },
          status: 400,
        },
      );
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${crypto.randomUUID()}.${fileExtension}`;

    // 4. Use o mesmo cliente ADMIN para fazer o upload para o Storage.
    // Como ele tem a 'service_role_key', ele tem permissão para escrever no bucket.
    const { data, error: uploadError } = await supabaseAdminClient.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    return new Response(
      JSON.stringify({ full_path: data.path, filename: file.name }), // Use data.path em vez de data.fullPath
      {
        headers: { ...corsResponseHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Erro na Edge Function 'upload-resume-file':", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsResponseHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
