// Em supabase/functions/check-subscription/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { withCors } from '../_shared/cors.ts'; // Importe o wrapper

const corsOptions = {
  allowedMethods: ['GET', 'OPTIONS'], // Permite GET para esta função
};

serve(
  withCors(async (req) => {
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL'),
        Deno.env.get('SUPABASE_ANON_KEY'),
        {
          global: {
            headers: {
              Authorization: req.headers.get('Authorization'),
            },
          },
        },
      );
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: subscriber, error } = await supabase
        .from('subscribers')
        .select('subscribed, trial_end, subscription_tier, subscription_end')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!subscriber) {
        return new Response(
          JSON.stringify({
            subscribed: false,
            in_trial: false,
            trial_end: null,
            subscription_tier: null,
            subscription_end: null,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          },
        );
      }

      const now = new Date();
      const trialEnd = subscriber.trial_end
        ? new Date(subscriber.trial_end)
        : null;
      const inTrial = trialEnd ? trialEnd > now : false;

      return new Response(
        JSON.stringify({
          subscribed: subscriber.subscribed,
          in_trial: inTrial,
          trial_end: subscriber.trial_end,
          subscription_tier: subscriber.subscription_tier,
          subscription_end: subscriber.subscription_end,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }, corsOptions),
);
