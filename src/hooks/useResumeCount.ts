import { useQuery } from '@tanstack/react-query';
import { fetchUserResumeCount } from '@/services/supabase-api';
import { useAuth } from '@/hooks/useAuth';

export const useResumeCount = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['resumeCount', session?.user.id],
    queryFn: fetchUserResumeCount,
    enabled: !!session,
  });
};
