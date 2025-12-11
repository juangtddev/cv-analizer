// supabase/functions/create-analysis/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { withCors } from '../_shared/cors.ts'; // Importe o wrapper

const corsOptions = {
  allowedMethods: ['POST', 'OPTIONS'],
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
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }, // Content-Type será mesclado pelo wrapper
      );
    }

    const { resume_id, score, report_json, status } = await req.json();
    if (!resume_id || !report_json) {
      return new Response(
        JSON.stringify({ error: 'Missing resume_id or report_json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const { data, error } = await supabaseClient
      .from('analyses')
      .insert({
        resume_id,
        score,
        report_json,
        status: status || 'completed',
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting analysis:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }, corsOptions),
);
