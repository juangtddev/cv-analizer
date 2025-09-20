import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RESEND-CONFIRMATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Iniciando reenvio de confirmação");

    // Authenticate user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Token de autorização necessário");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.email) {
      throw new Error("Usuário não autenticado");
    }

    logStep("Usuário autenticado", { email: userData.user.email });

    // Get request body
    const { email } = await req.json().catch(() => ({ email: userData.user.email }));
    const userEmail = email || userData.user.email;

    logStep("Email para reenvio", { email: userEmail });

    // Call our custom email function directly
    const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        email: userEmail,
        confirmationUrl: `${req.headers.get("origin") || "https://cvanalizer.fluxdata.com.br"}/`,
      }),
    });

    const emailResult = await emailResponse.json();
    logStep("Resposta da função de email", emailResult);

    if (!emailResponse.ok) {
      throw new Error(`Erro ao enviar email: ${emailResult.error || 'Erro desconhecido'}`);
    }

    // Also try Supabase native resend as fallback
    try {
      logStep("Tentando também reenvio nativo do Supabase");
      
      const { error: resendError } = await supabaseClient.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${req.headers.get("origin") || "https://cvanalizer.fluxdata.com.br"}/`
        }
      });

      if (resendError && !resendError.message.includes('already confirmed')) {
        logStep("Aviso no reenvio nativo", { error: resendError.message });
      } else {
        logStep("Reenvio nativo bem-sucedido ou já confirmado");
      }
    } catch (fallbackError) {
      logStep("Erro no fallback (não crítico)", fallbackError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Email de confirmação reenviado com sucesso!",
      customEmailSent: emailResult.success,
      emailId: emailResult.emailId,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERRO", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});