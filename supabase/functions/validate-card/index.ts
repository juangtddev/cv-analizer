import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.11.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from '../_shared/cors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-CARD] ${step}${detailsStr}`);
};

serve(async (req) => {
  console.log('🚀 VALIDATE-CARD FUNCTION STARTED - ', new Date().toISOString());
  console.log('🔍 Request method:', req.method);
  console.log('🔍 Request URL:', req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request handled');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Iniciando validação de cartão - VERSÃO DEBUG');
    console.log('🔑 Verificando variáveis de ambiente...');

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    console.log('🔑 Stripe Key presente:', !!stripeKey);
    console.log('🔑 Supabase URL presente:', !!supabaseUrl);
    console.log('🔑 Supabase Anon Key presente:', !!supabaseAnonKey);

    if (!stripeKey) {
      console.error('❌ STRIPE_SECRET_KEY não configurada');
      throw new Error('STRIPE_SECRET_KEY não configurada');
    }

    if (!supabaseUrl) {
      console.error('❌ SUPABASE_URL não configurada');
      throw new Error('SUPABASE_URL não configurada');
    }

    if (!supabaseAnonKey) {
      console.error('❌ SUPABASE_ANON_KEY não configurada');
      throw new Error('SUPABASE_ANON_KEY não configurada');
    }

    console.log('✅ Todas as variáveis de ambiente estão configuradas');

    // Create Supabase client for authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Token de autorização necessário');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      throw new Error('Usuário não autenticado');
    }

    logStep('Usuário autenticado', { email: userData.user.email });

    const { paymentMethodId } = await req.json();
    if (!paymentMethodId) {
      throw new Error('Payment Method ID é obrigatório');
    }

    logStep('Payment Method recebido', { paymentMethodId });

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Verificar se o cliente já existe no Stripe
    const customers = await stripe.customers.list({
      email: userData.user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep('Cliente existente encontrado', { customerId });
    } else {
      // Criar novo cliente
      const customer = await stripe.customers.create({
        email: userData.user.email,
      });
      customerId = customer.id;
      logStep('Novo cliente criado', { customerId });
    }

    // Anexar o método de pagamento ao cliente
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    logStep('Payment Method anexado ao cliente');

    let paymentIntentId;
    let chargeId;

    try {
      // 1. Criar cobrança de R$ 1,00 para validação
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 100, // R$ 1,00 em centavos
        currency: 'brl',
        customer: customerId,
        payment_method: paymentMethodId,
        confirm: true,
        description: 'Validação de cartão - será estornado automaticamente',
        return_url: `${req.headers.get('origin') || 'http://localhost:3000'}/`,
      });

      paymentIntentId = paymentIntent.id;
      logStep('Cobrança de validação criada', {
        paymentIntentId,
        status: paymentIntent.status,
      });

      if (paymentIntent.status === 'succeeded') {
        // 2. Buscar a charge para fazer o estorno
        const charges = await stripe.charges.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });

        if (charges.data.length > 0) {
          chargeId = charges.data[0].id;
          logStep('Charge encontrada para estorno', { chargeId });

          // 3. Fazer o estorno automático
          const refund = await stripe.refunds.create({
            charge: chargeId,
            amount: 100, // Estornar os R$ 1,00 completos
            reason: 'requested_by_customer',
            metadata: {
              type: 'card_validation_refund',
              customer_email: userData.user.email,
            },
          });

          logStep('Estorno processado com sucesso', {
            refundId: refund.id,
            status: refund.status,
          });

          return new Response(
            JSON.stringify({
              success: true,
              message:
                'Cartão validado com sucesso! O valor de R$ 1,00 foi estornado automaticamente.',
              validation: {
                card_valid: true,
                has_limit: true,
                payment_intent_id: paymentIntentId,
                charge_id: chargeId,
                refund_id: refund.id,
                refund_status: refund.status,
              },
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            },
          );
        } else {
          throw new Error('Charge não encontrada para o payment intent');
        }
      } else if (paymentIntent.status === 'requires_action') {
        logStep('Cartão requer autenticação 3D Secure');

        return new Response(
          JSON.stringify({
            success: false,
            requires_action: true,
            client_secret: paymentIntent.client_secret,
            message: 'Cartão requer autenticação adicional (3D Secure)',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        );
      } else {
        logStep('Falha na validação do cartão', {
          status: paymentIntent.status,
        });

        return new Response(
          JSON.stringify({
            success: false,
            message:
              'Falha na validação do cartão. Verifique os dados e tente novamente.',
            validation: {
              card_valid: false,
              has_limit: false,
              status: paymentIntent.status,
            },
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        );
      }
    } catch (paymentError: any) {
      logStep('Erro durante validação', { error: paymentError.message });

      // Analisar o tipo de erro do Stripe
      let errorMessage = 'Erro na validação do cartão';
      let cardValid = false;

      if (paymentError.code === 'card_declined') {
        if (paymentError.decline_code === 'insufficient_funds') {
          errorMessage = 'Cartão sem limite suficiente';
        } else if (paymentError.decline_code === 'expired_card') {
          errorMessage = 'Cartão expirado';
        } else if (paymentError.decline_code === 'invalid_cvc') {
          errorMessage = 'Código de segurança inválido';
        } else {
          errorMessage = 'Cartão recusado';
        }
      } else if (paymentError.code === 'invalid_number') {
        errorMessage = 'Número do cartão inválido';
      } else if (
        paymentError.code === 'invalid_expiry_month' ||
        paymentError.code === 'invalid_expiry_year'
      ) {
        errorMessage = 'Data de validade inválida';
      }

      return new Response(
        JSON.stringify({
          success: false,
          message: errorMessage,
          validation: {
            card_valid: cardValid,
            has_limit: false,
            error_code: paymentError.code,
            decline_code: paymentError.decline_code,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERRO GERAL', { message: errorMessage });

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
