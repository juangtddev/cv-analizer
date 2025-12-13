// --- Interfaces ---

export interface AppUser {
  linkedin: string;
  portfolio: string;
  localizacao: string;
  bio: string;
  telefone: string;
  id: string;
  email: string;
  nome: string;
}

// Crie a nova interface completa para o perfil
export interface UserProfile {
  id: string; // uuid
  nome: string; // text
  email: string; // text
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
  avatar_url?: string | null; // text null
}

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  trial_end: string | null;
  in_trial: boolean;
  // Adicione esta linha:
  cancel_at_period_end?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: {
    id: string;
    amount: number | null;
    currency: string;
    interval: string | undefined;
  };
}



export type PriorityLevel = 'Alta' | 'Média' | 'Baixa';

export interface CategoryAnalysis {
  nota: number;
  comentario: string;
}

export interface ActionItem {
  titulo: string;
  descricao: string;
  prioridade: PriorityLevel;
  tipo: string;
}

// ESTE É O MODELO OFICIAL
export interface AnalysisData {
  // Metadados Pessoais
  nome?: string;
  telefone?: string;
  email?: string;

  // Análise Principal
  notaGeral: number;
  resumo: string;

  // Detalhamento
  categorias: {
    estrutura: CategoryAnalysis;
    palavrasChave: CategoryAnalysis;
    experiencia: CategoryAnalysis;
    clareza: CategoryAnalysis;
  };

  // Listas
  pontosFortes: string[];
  pontosMelhoria: string[];
  planoAcao: ActionItem[];
}