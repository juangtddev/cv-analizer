import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plan } from '@/types';

const fetchPlans = async (): Promise<Plan[]> => {
  const { data, error } = await supabase.functions.invoke(
    'get-active-products',
  );
  if (error) throw new Error(error.message);
  return data.plans || [];
};

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  });
};
