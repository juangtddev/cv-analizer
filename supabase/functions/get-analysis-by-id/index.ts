// supabase/functions/get-analysis-by-id/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { withCors } from '../_shared/cors.ts'; // Importe o wrapper

const corsOptions = {
  allowedMethods: ['GET', 'OPTIONS'],
};

serve(
  withCors(async (req) => {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization')!,
          },
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const analysisId = url.searchParams.get('id');
    if (!analysisId) {
      return new Response(JSON.stringify({ error: 'Missing analysis ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: analysis, error } = await supabaseClient
      .from('analyses')
      .select(`*, resumes (user_id)`)
      .eq('id', analysisId)
      .single();

    if (error) {
      console.error('Error fetching analysis:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (analysis.resumes?.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access to analysis' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const { resumes, ...analysisData } = analysis;
    return new Response(JSON.stringify(analysisData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }, corsOptions),
);
