import { supabase } from '@/integrations/supabase/client';
import { AppUser, SubscriptionInfo } from '@/types';

// Função para buscar o PERFIL do usuário
export const fetchUserProfile = async (
  userId: string,
): Promise<AppUser | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);

  if (!data) return null;

  return {
    id: data.id,
    email: data.email || '',
    nome: data.nome || '',
  };
};

// Função para buscar a ASSINATURA do usuário
export const fetchSubscriptionInfo = async (): Promise<SubscriptionInfo> => {
  const { data, error } = await supabase.functions.invoke('check-subscription');

  if (error) throw new Error(error.message);

  return (
    data || {
      subscribed: false,
      subscription_tier: null,
      subscription_end: null,
      trial_end: null,
      in_trial: false,
    }
  );
};
