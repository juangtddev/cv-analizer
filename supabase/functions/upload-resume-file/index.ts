// supabase/functions/upload-resume-file/index.ts
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
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method Not Allowed'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 405
    });
  }
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file) {
    return new Response(JSON.stringify({
      error: 'No file uploaded'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
  const filePath = `${user.id}/${file.name}`;
  const { data, error } = await supabaseClient.storage.from('resumes').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type
  });
  if (error) {
    console.error('Error uploading file to storage:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
  const { data: publicUrlData } = supabaseClient.storage.from('resumes').getPublicUrl(filePath);
  return new Response(JSON.stringify({
    message: 'File uploaded successfully',
    path: data.path,
    full_path: publicUrlData.publicUrl
  }), {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 201
  });
});
