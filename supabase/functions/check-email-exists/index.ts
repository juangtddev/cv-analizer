// Em supabase/functions/check-email-exists/index.ts
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { withCors } from '../_shared/cors.ts'; // Importe o wrapper

// Defina as opções CORS para esta função, se forem diferentes do padrão.
// Para POST, podemos adicionar POST à lista padrão.
const corsOptions = {
  allowedMethods: ['POST', 'OPTIONS'],
};

serve(
  withCors(async (req) => {
    try {
      const { email } = await req.json();
      if (!email) {
        throw new Error('O e-mail é obrigatório.');
      }

      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL'),
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      );

      const { data, error } = await supabaseAdmin.rpc('check_if_email_exists', {
        email_to_check: email,
      });

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({ exists: data }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Erro na função check-email-exists:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }, corsOptions), // Passe as opções CORS aqui
);
