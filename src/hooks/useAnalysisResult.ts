import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchAnalysis = async (analysisId: string) => {
  const { data, error } = await supabase
    .from('analyses')
    .select('*, resumes(file_name, uploaded_at)')
    .eq('id', analysisId) // <--- MUDAR AQUI: De 'resume_id' para 'id'
    .single(); // Como o ID é único, não precisa de order ou limit

  if (error) throw error;
  return data;
};

export const useAnalysisResult = (resumeId: string | undefined) => {
  return useQuery({
    queryKey: ['analysis', resumeId],
    queryFn: () => fetchAnalysis(resumeId!),
    enabled: !!resumeId,
  });
};
