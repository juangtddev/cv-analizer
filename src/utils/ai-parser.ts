import { AnalysisData } from '@/types/';

// Valores padrão para evitar telas brancas (Crash)
const FALLBACK_DATA: AnalysisData = {
  notaGeral: 0,
  resumo: 'Análise não disponível.',
  categorias: {
    estrutura: { nota: 0, comentario: 'N/A' },
    palavrasChave: { nota: 0, comentario: 'N/A' },
    experiencia: { nota: 0, comentario: 'N/A' },
    clareza: { nota: 0, comentario: 'N/A' },
  },
  pontosFortes: [],
  pontosMelhoria: [],
  planoAcao: [],
};

export const parseAiOutput = (rawData: unknown): AnalysisData => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = rawData;

  // 1. Saneamento Básico (Desembrulhar Arrays ou Strings)
  try {
    // Se vier como string JSON (comum em webhooks), faz o parse
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.warn('Falha ao parsear string JSON');
      }
    }

    // Se vier dentro de um array (comum no Supabase/N8N)
    if (Array.isArray(data)) {
      data = data[0];
    }

    // Se vier dentro de uma propriedade 'output' (legado ou wrapper da IA)
    if (data && typeof data === 'object' && 'output' in data) {
      // Se o output for string, tenta parsear, senão usa direto
      try {
        data =
          typeof data.output === 'string'
            ? JSON.parse(data.output)
            : data.output;
      } catch (e) {
        console.warn('Falha ao parsear data.output:', e);
      }
    }
  } catch (error) {
    console.error('Erro na sanitização dos dados:', error);
    return FALLBACK_DATA;
  }

  // 2. Validação e Preenchimento de Lacunas (Safety)
  // Se o objeto não tiver a estrutura mínima, retornamos o fallback
  if (!data || typeof data !== 'object') {
    return FALLBACK_DATA;
  }

  // Montamos o objeto final garantindo que nada seja undefined/null
  return {
    // Metadados (Opcionais)
    nome: data.nome || undefined,
    email: data.email || undefined,
    telefone: data.telefone || undefined,

    // Garantia de Tipos (Numbers e Strings)
    notaGeral: Number(data.notaGeral) || 0,
    resumo: data.resumo || 'Sem resumo.',

    // Garantia de Estrutura de Categorias
    categorias: {
      estrutura:
        data.categorias?.estrutura || FALLBACK_DATA.categorias.estrutura,
      palavrasChave:
        data.categorias?.palavrasChave ||
        FALLBACK_DATA.categorias.palavrasChave,
      experiencia:
        data.categorias?.experiencia || FALLBACK_DATA.categorias.experiencia,
      clareza: data.categorias?.clareza || FALLBACK_DATA.categorias.clareza,
    },

    // Garantia de Arrays (Evita o erro .map is not a function)
    pontosFortes: Array.isArray(data.pontosFortes) ? data.pontosFortes : [],
    pontosMelhoria: Array.isArray(data.pontosMelhoria)
      ? data.pontosMelhoria
      : [],
    planoAcao: Array.isArray(data.planoAcao) ? data.planoAcao : [],
  };
};
