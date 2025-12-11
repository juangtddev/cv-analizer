import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.5';
import { withCors } from '../_shared/cors.ts';

const corsOptions = {
  allowedMethods: ['POST', 'GET', 'OPTIONS'], // Garante que POST também seja aceito
};

serve(
  withCors(async (req) => {
    // 1. MUDANÇA CRUCIAL: Usamos a Service Role Key para ter acesso total ao banco
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    // Criamos o cliente ADMIN
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    try {
      // 2. Extraímos o token do cabeçalho para validar quem é o usuário
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        throw new Error('Missing Authorization header');
      }

      // Limpamos o prefixo "Bearer " se existir
      const token = authHeader.replace('Bearer ', '');

      // 3. Validamos o usuário manualmente usando o cliente Admin
      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.getUser(token);

      if (userError || !user) {
        console.error('Erro de autenticação:', userError);
        return new Response(
          JSON.stringify({
            error: 'Usuário não autenticado ou token inválido.',
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }

      // 4. Buscamos os dados usando o cliente Admin (Bypassing RLS)
      // A segurança está garantida porque filtramos explicitamente pelo user.id
      const { data: resumes, error: dbError } = await supabaseAdmin
        .from('resumes')
        .select('*')
        .eq('user_id', user.id) // FILTRO OBRIGATÓRIO: Apenas dados deste usuário
        .order('created_at', { ascending: false });

      if (dbError) {
        console.error('Erro ao buscar currículos do usuário:', dbError);
        return new Response(JSON.stringify({ error: dbError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ resumes }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Erro crítico na Edge Function 'get-user-resumes':", error);
      return new Response(
        JSON.stringify({ error: error.message || 'Erro interno.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }, corsOptions),
);
