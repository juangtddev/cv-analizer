import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const CallbackHandler = () => {
  const { subscriptionInfo, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Espera até que o AuthContext termine de carregar as informações do usuário
    if (!isLoading) {
      // REGRA DE NEGÓCIO PRINCIPAL:
      // Se o usuário já for assinante, vai direto para o dashboard.
      // Todos os outros (novos, em trial, trial expirado) são enviados para a página de pagamento.
      if (subscriptionInfo.subscribed) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/payment', { replace: true });
      }
    }
  }, [isLoading, subscriptionInfo.subscribed, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2">Autenticando...</p>
    </div>
  );
};

export default CallbackHandler;
