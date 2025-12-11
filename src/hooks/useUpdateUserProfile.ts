import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types';

const updateUserProfile = async ({
  userId,
  updates,
}: {
  userId: string;
  updates: Partial<UserProfile>;
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: (updates: Partial<UserProfile>) =>
      updateUserProfile({ userId: userId!, updates }),
    onSuccess: (updateProfileData) =>
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] }),
  });
};
