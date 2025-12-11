import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadResumeFile,
  createResumeMetadata,
  requestAiAnalysis,
  saveAnalysisResult,
} from '@/services/supabase-api';

interface CreateMetadataPayload {
  file_url: string;
  file_name: string;
}

// No arquivo hooks/useAnalyzeResumeMutation.ts

export const useAnalyzeResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const uploadedFile = await uploadResumeFile(file);

      const newResume = await createResumeMetadata({
        file_url: uploadedFile.full_path,
        file_name: uploadedFile.filename,
      });

      const analysisResult = await requestAiAnalysis(file, newResume.id);

      // MUDANÇA 1: Capture o resultado em uma variável
      const savedAnalysis = await saveAnalysisResult({
        resumeId: newResume.id,
        analysisJson: analysisResult,
      });

      // MUDANÇA 2: Retorne a análise salva, não o currículo
      return savedAnalysis;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userResumes'] });
      // Se tiver queryKey de histórico, invalide também
      queryClient.invalidateQueries({ queryKey: ['analysis-history'] });
    },
  });
};
