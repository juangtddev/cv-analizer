// Em supabase/functions/create-subscription/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.11.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { withCors } from '../_shared/cors.ts'; // Importe o wrapper (ajuste o caminho se necessário)

const corsOptions = {
  allowedMethods: ['POST', 'OPTIONS'],
};

serve(
  withCors(async (req) => {
    try {
      const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL'),
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      );
      const {
        data: { user },
      } = await supabaseClient.auth.getUser(
        req.headers.get('Authorization').replace('Bearer ', ''),
      );
      if (!user) throw new Error('User not authenticated');

      const { paymentMethodId, priceId } = await req.json();
      if (!paymentMethodId) throw new Error('Payment method ID is required');
      if (!priceId) throw new Error('Price ID is required');

      const stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16',
      });

      const { data: customers } = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });
      let customerId;
      if (customers.length > 0) {
        customerId = customers[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.user_metadata?.nome,
        });
        customerId = customer.id;
      }

      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        trial_period_days: 7,
      });

      await supabaseClient.from('subscribers').upsert(
        {
          email: user.email,
          user_id: user.id,
          stripe_customer_id: customerId,
          subscribed:
            subscription.status === 'active' ||
            subscription.status === 'trialing',
          subscription_tier: 'Premium',
          subscription_end: new Date(
            subscription.current_period_end * 1000,
          ).toISOString(),
          trial_end: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
        },
        {
          onConflict: 'email',
        },
      );

      return new Response(
        JSON.stringify({
          success: true,
          status: subscription.status,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }
  }, corsOptions),
);
