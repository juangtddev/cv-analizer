// Em supabase/functions/test-email/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Importa as funções CORS do seu módulo compartilhado
import { handleCorsPreflight, createCorsHeaders } from '../_shared/cors.ts';

const handler = async (req) => {
  console.log('🧪 Função de teste de email chamada:', req.method);

  // Lida com requisições OPTIONS (preflight) usando a função compartilhada
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight(req);
  }

  // Gera os cabeçalhos CORS para a resposta, usando a função compartilhada
  const corsResponseHeaders = createCorsHeaders(req);

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Validação para garantir que as variáveis de ambiente existam
    if (!supabaseUrl) throw new Error('SUPABASE_URL not set');
    if (!supabaseKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Teste direto da função de email
    const testEmail = 'financeiro@1boaideia.com.br';
    const testNome = 'Teste Usuário'; // 'nome' não é usado por send-confirmation-email, mas mantido por consistência se for útil em 'send-email'
    const confirmationUrl = 'https://cvanalizer.fluxdata.com.br/'; // URL de redirecionamento para o email de confirmação

    console.log('📧 Testando invocação de send-email para:', testEmail);
    // Invoca a função 'send-email' (que agora é a função unificada de envio de emails)
    // O corpo deve ser compatível com o que 'send-email' espera para uma "chamada direta da aplicação"
    const { data, error } = await supabase.functions.invoke('send-email', {
      // Alterado para 'send-email'
      body: {
        email: testEmail,
        confirmationUrl: confirmationUrl, // Passa a URL para o template
        // 'email_action_type' pode ser 'signup' ou 'confirmation'
        // 'send-email' vai usar isso para decidir qual template renderizar
        email_action_type: 'signup',
      },
      // Headers são importantes para a função invocada também
      headers: {
        'Content-Type': 'application/json',
        // Se a função 'send-email' precisar de autenticação, adicione aqui
        // 'Authorization': `Bearer ${token}`
      },
    });

    console.log('📊 Resultado do teste:', {
      data,
      error,
    });

    return new Response(
      JSON.stringify({
        success: !error,
        email_tested: testEmail,
        data: data,
        error: error?.message || null,
        timestamp: new Date().toISOString(),
        resend_api_key_exists: !!Deno.env.get('RESEND_API_KEY'), // Verifica se a chave do Resend existe
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsResponseHeaders, // Usa os cabeçalhos CORS gerados
        },
      },
    );
  } catch (error) {
    console.error('💥 Erro no teste de email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack, // Inclui o stack trace para depuração
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsResponseHeaders, // Usa os cabeçalhos CORS gerados
        },
      },
    );
  }
};

serve(handler);
