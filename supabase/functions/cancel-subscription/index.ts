// supabase/functions/cancel-subscription/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';
import { withCors } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsOptions = {
  allowedMethods: ['POST', 'OPTIONS'] as string[],
};

serve(
  withCors(async (req) => {
    try {
      // Tratamento de Preflight (OPTIONS)
      if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { ...corsOptions } });
      }

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          global: {
            headers: { Authorization: req.headers.get('Authorization')! },
          },
        },
      );

      // 1. Identificar o usuário logado
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (userError || !user) throw new Error('Usuário não autenticado');

      // 2. Buscar dados na tabela 'subscribers'
      // Usando exatamente os campos que você mostrou no esquema
      const { data: subscriber } = await supabaseClient
        .from('subscribers')
        .select('stripe_subscription_id, stripe_customer_id')
        .eq('user_id', user.id)
        .single();

      if (!subscriber) {
        return new Response(
          JSON.stringify({
            message: 'Registro de assinante não encontrado no banco de dados.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }

      let subscriptionId = subscriber.stripe_subscription_id;

      // 3. Lógica de Fallback (Plano B)
      // Se não tiver o ID da assinatura salvo no banco, buscamos no Stripe.
      if (!subscriptionId && subscriber.stripe_customer_id) {
        console.log(
          `Buscando assinatura no Stripe para o customer: ${subscriber.stripe_customer_id}`,
        );

        // TENTATIVA 1: Buscar por status TRIALING (Regra nova de 7 dias)
        let subscriptions = await stripe.subscriptions.list({
          customer: subscriber.stripe_customer_id,
          status: 'trialing',
          limit: 1,
        });

        // TENTATIVA 2: Se não achou em trial, busca por ACTIVE (Fluxo padrão)
        if (subscriptions.data.length === 0) {
          subscriptions = await stripe.subscriptions.list({
            customer: subscriber.stripe_customer_id,
            status: 'active',
            limit: 1,
          });
        }

        if (subscriptions.data.length > 0) {
          subscriptionId = subscriptions.data[0].id;
          console.log(`Assinatura encontrada no Stripe: ${subscriptionId}`);
        }
      }

      if (!subscriptionId) {
        return new Response(
          JSON.stringify({
            message:
              'Nenhuma assinatura (Trial ou Ativa) encontrada no Stripe para este usuário.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }

      // 4. Cancelar no Stripe (cancel_at_period_end = true)
      // Isso agenda o cancelamento para o fim do trial ou do mês
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      // 5. Atualizar o banco localmente
      // Para que a UI mostre "Cancelamento Agendado" imediatamente
      const { error: updateError } = await supabaseClient
        .from('subscribers')
        .update({ cancel_at_period_end: true })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar banco:', updateError);
        // Não paramos o fluxo aqui porque o Stripe já processou, mas logamos o erro
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Assinatura cancelada com sucesso',
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    } catch (error) {
      console.error('Erro geral:', error);
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);

      return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }, corsOptions),
);