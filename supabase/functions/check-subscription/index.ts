// Em supabase/functions/check-subscription/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { withCors } from '../_shared/cors.ts';

const corsOptions = {
  allowedMethods: ['GET', 'OPTIONS'] as string[],
};

serve(
  withCors(async (req) => {
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        {
          global: {
            headers: {
              Authorization: req.headers.get('Authorization')!,
            },
          },
        },
      );
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // MUDANÇA 1: Adicione 'cancel_at_period_end' na lista de seleção
      const { data: subscriber, error } = await supabase
        .from('subscribers')
        .select(
          'subscribed, trial_end, subscription_tier, subscription_end, cancel_at_period_end',
        )
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
            cancel_at_period_end: false, // MUDANÇA 2: Valor padrão
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
          // MUDANÇA 3: Retorna o valor real do banco
          cancel_at_period_end: subscriber.cancel_at_period_end,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : JSON.stringify(error);
      return new Response(JSON.stringify({ error: message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }, corsOptions),
);