// supabase/functions/create-resume/index.ts
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
  // Extrair o user_id do token de autenticação
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
  const { file_url, file_name, content_text, is_primary } = await req.json();
  if (!file_url || !file_name) {
    return new Response(JSON.stringify({
      error: 'Missing file_url or file_name'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
  const { data, error } = await supabaseClient.from('resumes').insert({
    user_id: user.id,
    file_url,
    file_name,
    content_text,
    is_primary
  }).select() // Retorna os dados do currículo inserido
  .single();
  if (error) {
    console.error('Error inserting resume:', error);
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
