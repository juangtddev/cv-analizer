import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const userClient = createClient(
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
    } = await userClient.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const TRIAL_PERIOD_DAYS = 7;
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + TRIAL_PERIOD_DAYS);

    // --- LÓGICA DE UPSERT MANUAL ---

    // 1. Tenta encontrar um registro existente para este usuário
    const { data: existingSubscriber, error: selectError } = await supabaseAdmin
      .from('subscribers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = row not found, o que é ok
      throw selectError;
    }

    // 2. Prepara os dados
    const subscriberData = {
      user_id: user.id,
      email: user.email,
      trial_end: trialEndDate.toISOString(),
      subscribed: false,
    };

    // 3. Se um registro existe, faz UPDATE. Se não, faz INSERT.
    if (existingSubscriber) {
      // UPDATE
      const { error: updateError } = await supabaseAdmin
        .from('subscribers')
        .update(subscriberData)
        .eq('user_id', user.id);
      if (updateError) throw updateError;
    } else {
      // INSERT
      const { error: insertError } = await supabaseAdmin
        .from('subscribers')
        .insert(subscriberData);
      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({
        message: `Trial iniciado com sucesso para ${user.email}.`,
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
