import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
const handler = async (req)=>{
  console.log('🧪 Função de teste de email chamada:', req.method);
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Teste direto da função de email
    const testEmail = "financeiro@1boaideia.com.br";
    const testNome = "Teste Usuário";
    console.log('📧 Testando envio para:', testEmail);
    const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
      body: {
        email: testEmail,
        nome: testNome,
        type: 'signup',
        confirmationUrl: 'https://cvanalizer.fluxdata.com.br/'
      }
    });
    console.log('📊 Resultado do teste:', {
      data,
      error
    });
    return new Response(JSON.stringify({
      success: !error,
      email_tested: testEmail,
      data: data,
      error: error?.message || null,
      timestamp: new Date().toISOString(),
      resend_api_key_exists: !!Deno.env.get("RESEND_API_KEY")
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("💥 Erro no teste de email:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
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
