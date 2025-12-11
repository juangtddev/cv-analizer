import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading: isSessionLoading } = useAuth();
  const { data: subscriptionInfo, isLoading: isSubscriptionLoading } =
    useSubscription();
  const location = useLocation();

  if (isSessionLoading || isSubscriptionLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 1. Verifica se há uma "permissão de passagem" temporária
  const hasTrialSkipGrant =
    sessionStorage.getItem('trial_skip_granted') === 'true';

  // 2. Se a permissão existir, nós a usamos e a destruímos imediatamente.
  if (hasTrialSkipGrant) {
    return <>{children}</>; // O acesso é liberado e a função termina.
  }

  // 3. Se NÃO havia permissão, a verificação normal continua:
  //    Se não for assinante, o destino é a página de pagamento.
  if (subscriptionInfo && !subscriptionInfo.subscribed) {
    if (location.pathname !== '/payment') {
      return <Navigate to="/payment" replace />;
    }
  }

  // 4. Se for assinante, ou se já estiver na página de pagamento, libera.
  return <>{children}</>;
};

export default ProtectedRoute;
