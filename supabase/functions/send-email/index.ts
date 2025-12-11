// Em supabase/functions/send-email/index.ts
import React from 'npm:react@18.3.1';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
// Certifique-se de que o caminho para o seu template está correto
// Se _templates estiver no mesmo nível de _shared, o caminho é './_templates/confirmation.tsx'
// Se _templates estiver dentro de send-email, o caminho é './_templates/confirmation.tsx' (já está assim)
import { ConfirmationEmail } from './_templates/confirmation.tsx';

// Importa as funções CORS do seu módulo compartilhado
import { handleCorsPreflight, createCorsHeaders } from '../_shared/cors.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Helper logging function (mantida como está, é ótima!)
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-EMAIL] ${step}${detailsStr}`);
};

Deno.serve(async (req) => {
  // Lida com requisições OPTIONS (preflight) usando a função compartilhada
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight(req);
  }

  // Gera os cabeçalhos CORS para a resposta, usando a função compartilhada
  const corsResponseHeaders = createCorsHeaders(req);

  try {
    logStep('Iniciando processamento de email');

    if (req.method !== 'POST') {
      throw new Error('Método não permitido. Use POST.');
    }

    const body = await req.json();
    logStep('Body recebido', {
      hasUser: !!body.user,
      hasEmailData: !!body.email_data,
      hasEmailDirect: !!body.email,
      hasConfirmationUrlDirect: !!body.confirmationUrl,
    });

    // Verificar se é um webhook do Supabase Auth ou uma chamada direta
    let user: {
      email?: string;
      user_metadata?: { nome?: string; [key: string]: any };
      [key: string]: any;
    } | null = null;
    let emailData: {
      token_hash?: string;
      redirect_to?: string;
      email_action_type?: string;
      [key: string]: any;
    } | null = null;

    if (body.type === 'INSERT' && body.table === 'users' && body.record) {
      // Exemplo de como você pode querer lidar com webhooks mais específicos do Supabase
      // Isso é apenas uma sugestão, ajuste conforme seus webhooks reais
      user = body.record;
      emailData = {
        email_action_type: 'signup', // Ou 'confirmation' se o webhook for para isso
        redirect_to: Deno.env.get('REDIRECT_URL_AFTER_SIGNUP') || '', // URL para redirecionar após confirmação
      };
      logStep('Processando webhook de INSERT de usuário (exemplo)');
    } else if (body.user && body.email_data) {
      // Webhook do Supabase Auth (caso padrão que você já tinha)
      user = body.user;
      emailData = body.email_data;
      logStep('Processando webhook do Supabase Auth');
    } else if (body.email && body.confirmationUrl) {
      // Chamada direta da aplicação (para confirmação)
      user = { email: body.email };
      emailData = {
        token_hash: '', // Não aplicável para este tipo de chamada
        redirect_to: body.confirmationUrl,
        email_action_type: 'signup', // Ou 'confirmation'
      };
      logStep('Processando chamada direta para confirmação');
    } else if (body.email && body.recoveryUrl) {
      // Chamada direta para recuperação de senha
      user = { email: body.email };
      emailData = {
        token_hash: '', // Não aplicável
        redirect_to: body.recoveryUrl,
        email_action_type: 'recovery',
      };
      logStep('Processando chamada direta para recuperação de senha');
    } else {
      throw new Error(
        'Dados insuficientes para processar email (webhook ou chamada direta)',
      );
    }

    if (!user?.email) {
      throw new Error('Email do usuário não encontrado na requisição');
    }

    // Tratamento para garantir que user.user_metadata seja um objeto
    if (!user.user_metadata) {
      user.user_metadata = {};
    }

    logStep('Dados do usuário extraídos', {
      email: user.email,
      actionType: emailData?.email_action_type,
    });

    // Determinar tipo de email e template
    let subject = '';
    let htmlContent = '';

    if (
      emailData?.email_action_type === 'signup' ||
      emailData?.email_action_type === 'confirmation'
    ) {
      // Email de confirmação de cadastro
      subject = '🎯 Confirme seu email - CV Analyzer';
      const confirmationUrl =
        emailData.redirect_to || body.confirmationUrl || '';
      if (!confirmationUrl) {
        throw new Error(
          'URL de confirmação não fornecida para email de signup/confirmação',
        );
      }
      logStep('Gerando template de confirmação', { confirmationUrl });
      htmlContent = await renderAsync(
        React.createElement(ConfirmationEmail, {
          confirmationUrl,
          userName:
            user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
        }),
      );
    } else if (emailData?.email_action_type === 'recovery') {
      // Email de recuperação de senha
      subject = '🔐 Recuperar senha - CV Analyzer';
      const recoveryUrl = emailData.redirect_to || body.recoveryUrl || '';
      if (!recoveryUrl) {
        throw new Error(
          'URL de recuperação de senha não fornecida para email de recuperação',
        );
      }
      logStep('Gerando template de recuperação', { recoveryUrl });
      // Você pode criar um template React para isso também, ou usar um HTML simples
      htmlContent = `
        <h1>Recuperar Senha</h1>
        <p>Olá ${
          user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário'
        },</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${recoveryUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
        <p>Se você não solicitou a redefinição de senha, por favor ignore este email.</p>
        <p>Atenciosamente,<br/>Equipe CV Analyzer</p>
      `;
    } else {
      // Email genérico ou tipo desconhecido
      subject = '📧 Notificação - CV Analyzer';
      htmlContent = `
        <h1>Notificação do CV Analyzer</h1>
        <p>Você recebeu uma notificação do CV Analyzer.</p>
        ${
          emailData?.redirect_to
            ? `<p><a href="${emailData.redirect_to}">Clique aqui para mais detalhes</a></p>`
            : ''
        }
        <p>Atenciosamente,<br/>Equipe CV Analyzer</p>
      `;
      logStep('Gerando template genérico');
    }

    logStep('Enviando email via Resend', {
      to: user.email,
      subject,
      hasHtml: !!htmlContent,
    });

    // Enviar email via Resend
    const { data, error } = await resend.emails.send({
      from: 'CV Analyzer <noreply@cvanalizer.fluxdata.com.br>', // Mantenha seu domínio verificado
      to: [user.email],
      subject,
      html: htmlContent,
    });

    if (error) {
      logStep('ERRO no envio via Resend', error);
      throw error;
    }

    logStep('Email enviado com sucesso', {
      emailId: data?.id,
      to: user.email,
    });

    return new Response(
      JSON.stringify({
        success: true,
        emailId: data?.id,
        message: 'Email enviado com sucesso',
      }),
      {
        status: 200,
        headers: {
          ...corsResponseHeaders, // Usa os cabeçalhos CORS gerados
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('ERRO GERAL no send-email', { message: errorMessage });
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsResponseHeaders, // Usa os cabeçalhos CORS gerados
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
