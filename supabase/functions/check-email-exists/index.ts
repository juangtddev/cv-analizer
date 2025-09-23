// Em supabase/functions/check-email-exists/index.ts

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      throw new Error('O e-mail é obrigatório.');
    }

    // Usamos o cliente admin para ter permissão de chamar a função SECURITY DEFINER
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // --- A CHAMADA FINAL E CORRETA ---
    // Chamando nossa função customizada via RPC (Remote Procedure Call)
    const { data, error } = await supabaseAdmin.rpc('check_if_email_exists', {
      email_to_check: email,
    });

    if (error) {
      throw error;
    }

    // O 'data' aqui será 'true' ou 'false'
    return new Response(JSON.stringify({ exists: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Erro na função check-email-exists:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
