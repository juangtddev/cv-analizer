// Em supabase/functions/start-trial/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
// Importa as funções CORS do seu módulo compartilhado
import { handleCorsPreflight, createCorsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Lida com requisições OPTIONS (preflight) usando a função compartilhada
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight(req);
  }

  // Gera os cabeçalhos CORS para a resposta, usando a função compartilhada
  const corsResponseHeaders = createCorsHeaders(req);

  try {
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!, // Adicionei '!' para indicar que não será nulo
      Deno.env.get('SUPABASE_ANON_KEY')!, // Adicionei '!'
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization')!, // Adicionei '!'
          },
        },
      },
    );

    const {
      data: { user },
    } = await userClient.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!, // Adicionei '!'
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // Adicionei '!'
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
      // PGRST116 = row not found, o que é ok, mas outros erros devem ser lançados
      throw selectError;
    }

    // 2. Prepara os dados do assinante
    const subscriberData = {
      user_id: user.id,
      email: user.email,
      trial_end: trialEndDate.toISOString(),
      subscribed: false, // Inicia como não assinado, apenas em período de trial
      // Opcional: Você pode querer adicionar um campo 'subscription_tier' aqui, como 'trial'
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
        message: `Trial iniciado com sucesso para ${
          user.email
        }. O trial termina em ${trialEndDate.toLocaleDateString()}.`,
      }),
      {
        headers: {
          ...corsResponseHeaders, // Usa os cabeçalhos CORS gerados
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Erro na função start-trial:', errorMessage);
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsResponseHeaders, // Usa os cabeçalhos CORS gerados
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
