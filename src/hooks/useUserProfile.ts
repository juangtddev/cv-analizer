import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfile } from '@/services/user-api';

export const useUserProfile = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  });
};
