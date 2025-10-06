// supabase/functions/create-analysis/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
serve(async (req)=>{
  const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: {
      headers: {
        Authorization: req.headers.get('Authorization')
      }
    }
  });
  // Extrair o user_id do token de autenticação (necessário para verificar RLS indiretamente)
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({
      error: 'User not authenticated'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 401
    });
  }
  const { resume_id, score, report_json, status } = await req.json();
  if (!resume_id || !report_json) {
    return new Response(JSON.stringify({
      error: 'Missing resume_id or report_json'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
  // O RLS da tabela 'analyses' já verifica se o resume_id pertence ao usuário.
  // Não precisamos fazer uma consulta extra aqui, o insert irá falhar se não for o caso.
  const { data, error } = await supabaseClient.from('analyses').insert({
    resume_id,
    score,
    report_json,
    status: status || 'completed' // Default para 'completed' se não for especificado
  }).select().single();
  if (error) {
    console.error('Error inserting analysis:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 201
  });
});
