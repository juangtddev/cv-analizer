import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
const resendApiKey = Deno.env.get("RESEND_API_KEY");
console.log('🔧 RESEND_API_KEY configurada:', !!resendApiKey);
console.log('🌍 Environment:', Deno.env.get("DENO_DEPLOYMENT_ID") ? 'production' : 'development');
if (!resendApiKey) {
  console.error('❌ RESEND_API_KEY não encontrada nas variáveis de ambiente');
}
const resend = new Resend(resendApiKey);
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
const handler = async (req)=>{
  console.log('📧 Função de email chamada:', req.method);
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const { email, nome, confirmationUrl, type } = await req.json();
    console.log('📩 Requisição de email recebida:', {
      email: email?.substring(0, 3) + "***",
      nome: nome?.substring(0, 3) + "***",
      type,
      hasConfirmationUrl: !!confirmationUrl
    });
    // Validações básicas
    if (!email || !nome) {
      throw new Error('Email e nome são obrigatórios');
    }
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY não configurada no servidor');
    }
    // Create email content based on type
    const isSignup = type === 'signup';
    const subject = isSignup ? "✅ Confirme seu email - CVData" : "📧 Reenvio de confirmação - CVData";
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .header { 
              text-align: center; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 40px 20px; 
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              font-weight: bold;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
              font-size: 18px;
            }
            .content { 
              padding: 40px 30px; 
            }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important; 
              padding: 18px 36px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: bold;
              font-size: 16px;
              margin: 25px 0;
              text-align: center;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              transition: transform 0.2s;
            }
            .button:hover {
              transform: translateY(-2px);
            }
            .footer { 
              text-align: center; 
              color: #666; 
              font-size: 14px; 
              margin-top: 30px;
              padding: 30px 20px;
              background: #f8f9fa;
            }
            .highlight {
              background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
              border-left: 4px solid #667eea;
            }
            .url-box {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e9ecef;
              word-break: break-all;
              font-family: 'Courier New', monospace;
              font-size: 14px;
              color: #495057;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 CVData</h1>
              <p>Sua plataforma de carreira com IA</p>
            </div>
            
            <div class="content">
              <h2>Olá, ${nome}! 👋</h2>
              
              ${isSignup ? `
                <p><strong>Bem-vindo(a) ao CVData!</strong> 🎉</p>
                <p>Estamos muito felizes em tê-lo(a) conosco. Para completar seu cadastro e começar a usar todas as funcionalidades premium, você precisa confirmar seu email.</p>
                
                <div class="highlight">
                  <strong>🎁 Oferta especial:</strong> Você tem <strong>7 dias grátis</strong> para testar todas as funcionalidades premium da plataforma!
                </div>
              ` : `
                <p>Recebemos uma solicitação para reenviar seu link de confirmação de email.</p>
                <p>Se você não fez esta solicitação, pode ignorar este email com segurança.</p>
              `}
              
              <p><strong>👇 Clique no botão abaixo para confirmar seu email:</strong></p>
              
              <div style="text-align: center;">
                <a href="${confirmationUrl || '#'}" class="button">
                  ✅ Confirmar Email Agora
                </a>
              </div>
              
              <p><strong>📋 Ou copie e cole este link no seu navegador:</strong></p>
              <div class="url-box">
                ${confirmationUrl || 'Link de confirmação será fornecido em breve'}
              </div>
              
              <div class="highlight">
                <strong>📧 Não encontrou o email?</strong>
                <ul style="text-align: left; margin: 10px 0;">
                  <li>✉️ Verifique sua pasta de <strong>spam/lixo eletrônico</strong></li>
                  <li>📁 Procure nas abas do Gmail (Promoções, Social)</li>
                  <li>👤 Adicione <strong>noreply@cvdata.app</strong> aos seus contatos</li>
                  <li>⏰ Aguarde alguns minutos, às vezes pode demorar</li>
                </ul>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 14px; color: #666;">
                Este link é válido por 24 horas. Se precisar de ajuda, entre em contato conosco.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>CVData</strong> - Sua carreira, nossa IA</p>
              <p>📧 Este email foi enviado para: <strong>${email}</strong></p>
              <p style="font-size: 12px; color: #999; margin-top: 15px;">
                Você está recebendo este email porque se cadastrou no CVData.<br>
                © 2024 CVData. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
    console.log('📤 Enviando email via Resend...');
    const emailResponse = await resend.emails.send({
      from: "CVData <noreply@resend.dev>",
      to: [
        email
      ],
      subject: subject,
      html: htmlContent
    });
    console.log('📨 Resposta do Resend:', {
      success: !emailResponse.error,
      id: emailResponse.data?.id,
      error: emailResponse.error?.message
    });
    if (emailResponse.error) {
      console.error('❌ Erro da API Resend:', emailResponse.error);
      // Verificar se é erro de domínio não verificado
      if (emailResponse.error.message?.includes('verify a domain')) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Domínio não verificado no Resend. Você precisa verificar um domínio em resend.com/domains',
          details: emailResponse.error.message,
          action_required: 'domain_verification'
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      throw new Error(`Erro do Resend: ${emailResponse.error.message}`);
    }
    console.log('✅ Email enviado com sucesso!');
    return new Response(JSON.stringify({
      success: true,
      message: 'Email enviado com sucesso!',
      id: emailResponse.data?.id,
      provider: 'resend'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("💥 Erro na função send-confirmation-email:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro interno do servidor',
      details: error.stack,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
serve(handler);
