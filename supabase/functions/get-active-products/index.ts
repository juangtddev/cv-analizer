// /get-active-products/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.11.0';
import { withCors } from '../_shared/cors.ts'; // Importe o wrapper

const corsOptions = {
  allowedMethods: ['GET', 'OPTIONS'],
};

serve(
  withCors(async (_req) => {
    try {
      const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
      const stripe = new Stripe(stripeKey, {
        apiVersion: '2023-10-16',
      });

      const { data: products } = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
      });

      const activePlans = products
        .map((product) => {
          const price = product.default_price as Stripe.Price; // Cast para Stripe.Price para acesso seguro
          if (!price) return null;
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: {
              id: price.id,
              amount: price.unit_amount,
              currency: price.currency,
              interval: price.recurring?.interval,
            },
          };
        })
        .filter((plan) => plan !== null);

      return new Response(JSON.stringify({ plans: activePlans }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }, corsOptions),
);
