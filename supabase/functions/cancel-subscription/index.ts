// supabase/functions/cancel-subscription/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error('Usuário não autenticado');

    // BUSCAR NA TABELA CORRETA: 'subscribers'
    const { data: subscriber } = await supabaseClient
      .from('subscribers')
      .select('stripe_subscription_id, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!subscriber) {
      return new Response(
        JSON.stringify({ message: 'Assinatura não encontrada' }),
        { status: 400 },
      );
    }

    let subscriptionId = subscriber.stripe_subscription_id;

    // Fallback: Se não tiver o ID da assinatura salvo, busca no Stripe pelo Customer ID
    if (!subscriptionId && subscriber.stripe_customer_id) {
      const subscriptions = await stripe.subscriptions.list({
        customer: subscriber.stripe_customer_id,
        status: 'active',
        limit: 1,
      });
      if (subscriptions.data.length > 0) {
        subscriptionId = subscriptions.data[0].id;
      }
    }

    if (!subscriptionId) {
      return new Response(
        JSON.stringify({
          message: 'Nenhuma assinatura ativa encontrada no Stripe',
        }),
        { status: 400 },
      );
    }

    // Cancelar no Stripe
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Atualiza o banco localmente para refletir na hora na UI
    await supabaseClient
      .from('subscribers')
      .update({ cancel_at_period_end: true })
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Assinatura cancelada com sucesso',
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
