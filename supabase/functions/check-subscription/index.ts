// Em supabase/functions/check-subscription/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Usamos o cliente padrão pois esta é uma operação de leitura segura
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // 1. Apenas LÊ o registro do assinante no nosso banco
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('subscribed, trial_end, subscription_tier, subscription_end')
      .eq('user_id', user.id)
      .single();

    // Ignora o erro "linha não encontrada", pois é um caso válido para um novo usuário
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!subscriber) {
      // Se o usuário não tem registro, ele não tem trial nem assinatura. Retorna o estado padrão.
      return new Response(
        JSON.stringify({
          subscribed: false,
          in_trial: false,
          trial_end: null,
          subscription_tier: null,
          subscription_end: null,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    // 2. Calcula se o usuário está em trial com base na data do nosso banco
    const now = new Date();
    const trialEnd = subscriber.trial_end
      ? new Date(subscriber.trial_end)
      : null;
    const inTrial = trialEnd ? trialEnd > now : false;

    // 3. Retorna o objeto completo que o frontend espera, baseado nos dados do NOSSO banco
    return new Response(
      JSON.stringify({
        subscribed: subscriber.subscribed,
        in_trial: inTrial, // Retorna o valor calculado
        trial_end: subscriber.trial_end,
        subscription_tier: subscriber.subscription_tier,
        subscription_end: subscriber.subscription_end,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
