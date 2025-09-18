import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.11.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (_req) => {
  if (_req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // 1. Busca todos os produtos que estão marcados como "ativos" no seu painel da Stripe.
    //    O 'expand' é uma otimização crucial: ele nos diz para incluir o objeto de preço
    //    padrão de cada produto na mesma chamada, evitando múltiplas requisições.
    const { data: products } = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // 2. Filtra e formata os dados em um formato limpo para o frontend consumir.
    //    Isso garante que apenas produtos com um preço definido sejam enviados.
    const activePlans = products
      .map((product) => {
        const price = product.default_price as Stripe.Price;
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
      .filter((plan) => plan !== null); // Remove qualquer produto que não tenha um preço padrão

    return new Response(JSON.stringify({ plans: activePlans }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
