import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        'cancel-subscription',
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Atualiza os dados da assinatura na tela sem precisar recarregar (F5)
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
};
