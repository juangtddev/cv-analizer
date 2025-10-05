// supabase/functions/get-analysis-by-id/index.ts
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
  // O ID da análise virá como parâmetro da URL ou do corpo da requisição
  // Para GET, é mais comum vir da URL. Vamos assumir um query parameter para simplicidade.
  const url = new URL(req.url);
  const analysisId = url.searchParams.get('id');
  if (!analysisId) {
    return new Response(JSON.stringify({
      error: 'Missing analysis ID'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
  // Busca a análise e o currículo associado (para verificar user_id)
  // Nota: o RLS da tabela 'analyses' já deveria impedir que um usuário acesse análises que não são suas.
  const { data: analysis, error } = await supabaseClient.from('analyses').select(`
      *,
      resumes (user_id)
    `).eq('id', analysisId).single();
  if (error) {
    console.error('Error fetching analysis:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
  // Verifica explicitamente se o user_id do currículo associado corresponde ao user logado
  // Isso é uma camada extra de segurança, mas RLS deveria cuidar disso.
  if (analysis.resumes?.user_id !== user.id) {
    return new Response(JSON.stringify({
      error: 'Unauthorized access to analysis'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 403
    });
  }
  // Remove o user_id do resume_id da resposta, já que não é necessário para o frontend
  const { resumes, ...analysisData } = analysis;
  return new Response(JSON.stringify(analysisData), {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 200
  });
});
