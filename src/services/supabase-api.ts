// src/services/supabase-api.ts
import { Json } from '@/integrations/supabase/types';
import { supabase } from '../integrations/supabase/client';
import { parseAiOutput } from '@/utils/ai-parser';

interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: string;
  error?: string;
  message: string;
  hint?: string;
}

// Helper para criar um erro com a interface ApiError
function createApiError(message: string, originalError?: unknown): ApiError {
  const error = new Error(message) as ApiError;
  // Se quiser, pode adicionar o erro original para debug
  // if (originalError) (error as any).original = originalError;
  return error;
}

export async function uploadResumeFile(
  file: File,
): Promise<{ full_path: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  // Não precisamos mais do hack de 'Content-Type: undefined as any'
  // porque 'authenticatedFetch' já lida com FormData
  const { data, error } = await supabase.functions.invoke(
    'upload-resume-file',
    {
      body: formData,
    },
  );
  if (error) throw error;
  return data;
}

export async function createResumeMetadata({
  file_url,
  file_name,
}: {
  file_url: string;
  file_name: string;
}): Promise<{ id: string }> {
  const { data, error } = await supabase.functions.invoke('create-resume', {
    body: { file_url, file_name },
  });

  if (error) throw error;
  return data;
}

// Definição de tipo para um currículo
export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  // Adicione outros campos que sua tabela 'resumes' possa ter
  // Ex: status_analise?: 'pendente' | 'processando' | 'concluido' | 'erro';
}

export async function getUserResumes(): Promise<Resume[]> {
  const { data, error } = await supabase.functions.invoke('get-user-resumes');

  if (error) throw error;
  // A sua Edge Function retorna um objeto { resumes: [...] }, então pegamos 'data.resumes'.
  return data.resumes || [];
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove o prefixo "data:application/pdf;base64," para enviar só o código
      const base64Content = result.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Em src/services/supabase-api.ts

export const requestAiAnalysis = async (file: File, resumeId: string) => {
  // 1. Prepara o arquivo
  const base64File = await fileToBase64(file);

  // 2. Monta o corpo da requisição
  // Mantemos a estrutura que funcionou: message vazia para não confundir o N8N
  const body = {
    curriculo: base64File,
    codigoia: resumeId,
    message: '',
  };

  const AI_API_URL =
    'https://n8n.1boaideia.com.br/webhook/da1fea52-3693-4274-82f0-0bd75d33f3d5';

  // 3. Faz a chamada
  const response = await fetch(AI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // 4. Verifica erros HTTP
  if (!response.ok) {
    // Tenta pegar uma mensagem de erro se o JSON estiver disponível, senão usa o status
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.message || `Erro na API da IA (${response.status})`;
    throw new Error(errorMessage);
  }

  // 5. Retorna o JSON direto (sem conversão intermediária de texto)
  return response.json();
};

interface SaveAnalysisPayload {
  resumeId: string;
  analysisJson: Json;
  score?: number;
}

export const saveAnalysisResult = async ({
  resumeId,
  analysisJson,
  score,
}: SaveAnalysisPayload) => {
  const structuredData = parseAiOutput(analysisJson);

  const { data, error } = await supabase
    .from('analyses')
    .insert({
      resume_id: resumeId,
      report_json: structuredData as unknown as Json, // Salvamos o JSON Bonito!
      score: structuredData.notaGeral,
      status: 'completed',
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar a análise:', error);
    throw new Error(
      'Não foi possível salvar o resultado da análise no banco de dados.',
    );
  }

  return data;
};

export const fetchUserResumeCount = async (): Promise<number> => {
  const { data, error } = await supabase.rpc('get_user_resume_count');
  if (error) {
    console.error('Erro ao buscar a contagem de currículos:', error);
    throw new Error(
      'Não foi possível verificar a quantidade de currículos enviados.',
    );
  }

  return data;
};

// Adicione ao final de src/services/supabase-api.ts

// Tipo para a listagem do dashboard
export interface DashboardAnalysis {
  id: string;
  score: number;
  analysis_date: string;
  status: string;
  resumes: {
    file_name: string;
  } | null;
}

export const getRecentAnalyses = async (): Promise<DashboardAnalysis[]> => {
  // Buscamos as análises e "juntamos" com a tabela resumes para pegar o nome do arquivo
  const { data, error } = await supabase
    .from('analyses')
    .select(
      `
      id,
      score,
      analysis_date,
      status,
      resumes (
        file_name
      )
    `,
    )
    .order('analysis_date', { ascending: false })
    .limit(5); // Pegamos apenas as 5 últimas para o dashboard

  if (error) {
    console.error('Erro ao buscar análises:', error);
    throw new Error('Não foi possível carregar o histórico recente.');
  }

  // O Supabase retorna resumes como um array ou objeto dependendo da relação,
  // aqui forçamos a tipagem para garantir que o frontend receba o esperado.
  return data as unknown as DashboardAnalysis[];
};

export const getAnalysisHistory = async () => {
  const { data, error } = await supabase
    .from('analyses')
    .select('*, resumes(file_name)')
    .order('analysis_date', { ascending: false }); // Do mais recente para o mais antigo

  if (error) throw error;
  return data;
};