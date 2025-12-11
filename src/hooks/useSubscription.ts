import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { fetchSubscriptionInfo } from '@/services/user-api';

export const useSubscription = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['subscription', userId],
    queryFn: fetchSubscriptionInfo,
    enabled: !!userId,
  });
};
