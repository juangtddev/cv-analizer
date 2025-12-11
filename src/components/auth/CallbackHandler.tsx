import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2 } from 'lucide-react';

const CallbackHandler = () => {
  const { session, isLoading: isSessionLoading } = useAuth();

  const { data: subscriptionInfo, isLoading: isSubscriptionLoading } =
    useSubscription();

  const navigate = useNavigate();
  const isDoneLoading = !isSessionLoading && !isSubscriptionLoading;
  useEffect(() => {
    if (isDoneLoading) {
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }
      if (subscriptionInfo?.subscribed) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/payment', { replace: true });
      }
    }
  }, [isDoneLoading, session, subscriptionInfo, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2">Autenticando...</p>
    </div>
  );
};

export default CallbackHandler;
