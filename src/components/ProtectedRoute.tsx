import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, subscriptionInfo } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // REGRA FINAL: Libera o acesso se o usuário for assinante OU estiver em trial.
  // Bloqueia apenas se não for nenhum dos dois (novo usuário ou trial expirado).
  if (!subscriptionInfo.subscribed && !subscriptionInfo.in_trial) {
    return <Navigate to="/payment" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
