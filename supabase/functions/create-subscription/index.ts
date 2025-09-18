// Em supabase/functions/create-subscription/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.11.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Setup (Stripe, Supabase, User)
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const {
      data: { user },
    } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')!.replace('Bearer ', ''),
    );
    if (!user) throw new Error('User not authenticated');

    // --- ALTERAÇÃO 1: Recebe o priceId e o paymentMethodId do frontend ---
    const { paymentMethodId, priceId } = await req.json();
    if (!paymentMethodId) throw new Error('Payment method ID is required');
    if (!priceId) throw new Error('Price ID is required');

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Lógica para encontrar ou criar o cliente na Stripe
    const { data: customers } = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    let customerId: string;
    if (customers.length > 0) {
      customerId = customers[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.nome,
      });
      customerId = customer.id;
    }

    // Anexa o método de pagamento e o define como padrão
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // --- ALTERAÇÃO 2: Usa o priceId recebido para criar a assinatura ---
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }], // Usa o Price ID dinâmico
      trial_period_days: 7,
    });

    // Atualiza a tabela 'subscribers' no seu banco de dados
    await supabaseClient.from('subscribers').upsert(
      {
        email: user.email,
        user_id: user.id,
        stripe_customer_id: customerId,
        subscribed:
          subscription.status === 'active' ||
          subscription.status === 'trialing',
        subscription_tier: 'Premium', // Futuramente, isso também pode vir do frontend
        subscription_end: new Date(
          subscription.current_period_end * 1000,
        ).toISOString(),
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
      },
      { onConflict: 'email' },
    );

    return new Response(
      JSON.stringify({ success: true, status: subscription.status }),
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
