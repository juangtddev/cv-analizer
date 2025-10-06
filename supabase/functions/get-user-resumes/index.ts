// supabase/functions/get-user-resumes/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
serve(async (req)=>{
  const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: {
      headers: {
        Authorization: req.headers.get('Authorization')
      }
    }
  });
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({
      error: 'User not authenticated'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 401
    });
  }
  const { data, error } = await supabaseClient.from('resumes').select('*').eq('user_id', user.id) // RLS já garante isso, mas é bom explicitar
  .order('uploaded_at', {
    ascending: false
  });
  if (error) {
    console.error('Error fetching user resumes:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 200
  });
});
