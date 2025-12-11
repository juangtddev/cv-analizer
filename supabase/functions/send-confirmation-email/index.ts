// Em supabase/functions/send-confirmation-email/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { handleCorsPreflight, createCorsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight(req);
  }

  const corsHeaders = createCorsHeaders(req);

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: Deno.env.get('REDIRECT_URL'), // Certifique-se de que esta variável de ambiente está configurada
      },
    );

    if (error) {
      console.error('Error inviting user:', error);
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ message: 'Confirmation email sent', user: data.user }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('send-confirmation-email error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
