import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { ConfirmationEmail } from './_templates/confirmation.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-EMAIL] ${step}${detailsStr}`);
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Iniciando processamento de email");

    if (req.method !== 'POST') {
      throw new Error('Método não permitido. Use POST.');
    }

    const body = await req.json();
    logStep("Body recebido", { hasUser: !!body.user, hasEmailData: !!body.email_data });

    // Verificar se é um webhook do Supabase Auth ou uma chamada direta
    let user, emailData;
    
    if (body.user && body.email_data) {
      // Webhook do Supabase Auth
      user = body.user;
      emailData = body.email_data;
      logStep("Processando webhook do Supabase Auth");
    } else if (body.email && body.confirmationUrl) {
      // Chamada direta da aplicação
      user = { email: body.email };
      emailData = { 
        token_hash: '', 
        redirect_to: body.confirmationUrl,
        email_action_type: 'signup' 
      };
      logStep("Processando chamada direta");
    } else {
      throw new Error('Dados insuficientes para processar email');
    }

    if (!user?.email) {
      throw new Error('Email do usuário não encontrado');
    }

    logStep("Dados do usuário", { 
      email: user.email,
      actionType: emailData.email_action_type 
    });

    // Determinar tipo de email e template
    let subject = '';
    let htmlContent = '';
    
    if (emailData.email_action_type === 'signup' || emailData.email_action_type === 'confirmation') {
      // Email de confirmação de cadastro
      subject = '🎯 Confirme seu email - CV Analyzer';
      
      const confirmationUrl = emailData.redirect_to || body.confirmationUrl || '';
      
      logStep("Gerando template de confirmação", { confirmationUrl });
      
      htmlContent = await renderAsync(
        React.createElement(ConfirmationEmail, {
          confirmationUrl,
          userName: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
        })
      );
      
    } else if (emailData.email_action_type === 'recovery') {
      // Email de recuperação de senha
      subject = '🔐 Recuperar senha - CV Analyzer';
      htmlContent = `
        <h1>Recuperar Senha</h1>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${emailData.redirect_to || ''}">Redefinir Senha</a>
      `;
    } else {
      // Email genérico
      subject = '📧 CV Analyzer';
      htmlContent = `
        <h1>CV Analyzer</h1>
        <p>Você recebeu este email do CV Analyzer.</p>
        ${emailData.redirect_to ? `<a href="${emailData.redirect_to}">Clique aqui</a>` : ''}
      `;
    }

    logStep("Enviando email via Resend", { 
      to: user.email, 
      subject,
      hasHtml: !!htmlContent 
    });

    // Enviar email via Resend
    const { data, error } = await resend.emails.send({
      from: 'CV Analyzer <noreply@cvanalizer.fluxdata.com.br>',
      to: [user.email],
      subject,
      html: htmlContent,
    });

    if (error) {
      logStep("ERRO no envio via Resend", error);
      throw error;
    }

    logStep("Email enviado com sucesso", { 
      emailId: data?.id,
      to: user.email 
    });

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: data?.id,
      message: 'Email enviado com sucesso'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERRO GERAL", { message: errorMessage });
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
})