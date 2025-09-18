// Em src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Interfaces
interface AppUser {
  id: string;
  email: string;
  nome: string;
}

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  trial_end: string | null;
  in_trial: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  subscriptionInfo: SubscriptionInfo;
  isEmailConfirmed: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    email: string,
    password: string,
    nome: string,
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  checkSubscription: () => Promise<void>;
  createCheckoutSession: () => Promise<{ url?: string; error?: string }>;
  createSubscription: (
    paymentMethodId: string,
    priceId: string,
  ) => Promise<{ success?: boolean; error?: any }>;
  openCustomerPortal: () => Promise<{ url?: string; error?: string }>;
  isLoading: boolean;
  startTrial: () => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função Helper com Timeout
const invokeWithTimeout = (
  functionName: string,
  options?: any,
  timeout = 10000,
) => {
  return Promise.race([
    supabase.functions.invoke(functionName, options),
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `A chamada da função '${functionName}' excedeu o tempo limite.`,
            ),
          ),
        timeout,
      ),
    ),
  ]);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    trial_end: null,
    in_trial: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // Ativa o loading apenas se houver uma mudança real de usuário ou na carga inicial
      if (currentSession?.user?.id !== session?.user?.id || isLoading) {
        setIsLoading(true);
      }

      try {
        setSession(currentSession);
        setIsEmailConfirmed(!!currentSession?.user?.email_confirmed_at);

        if (currentSession?.user) {
          const [profileResponse, subscriptionResponse] = await Promise.all([
            supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single(),
            invokeWithTimeout('check-subscription'),
          ]);

          // @ts-ignore
          if (profileResponse.error) throw profileResponse.error;
          // @ts-ignore
          if (subscriptionResponse.error) throw subscriptionResponse.error;

          // @ts-ignore
          const profile = profileResponse.data;
          setUser(
            profile
              ? {
                  id: currentSession.user.id,
                  email: currentSession.user.email || '',
                  nome: profile.nome || '',
                }
              : null,
          );

          // @ts-ignore
          const subData = subscriptionResponse.data;
          setSubscriptionInfo({
            subscribed: subData.subscribed || false,
            subscription_tier: subData.subscription_tier,
            subscription_end: subData.subscription_end,
            trial_end: subData.trial_end,
            in_trial: subData.in_trial || false,
          });
        } else {
          // Se não há sessão (logout), limpa os dados
          setUser(null);
          setSubscriptionInfo({
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
            trial_end: null,
            in_trial: false,
          });
        }
      } catch (error) {
        console.error(
          'Falha na revalidação em segundo plano, mantendo estado atual:',
          error,
        );
        // CORREÇÃO CRÍTICA: Não deslogamos mais o usuário por uma falha de rede.
        // A aplicação continuará com os dados que já tinha.
      } finally {
        // Garante que o loading sempre termine.
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [session]); // Adicionado `session` como dependência para re-executar quando a sessão mudar

  // Suas Funções de Negócio
  const checkSubscriptionStatus = async () => {
    /* ... implementação existente ... */
  };
  const login = async (email: string, password: string) => {
    /* ... implementação existente ... */
  };
  const register = async (email: string, password: string, nome: string) => {
    /* ... implementação existente ... */
  };
  const logout = async () => {
    /* ... implementação existente ... */
  };
  const checkSubscription = async () => {
    /* ... implementação existente ... */
  };
  const createCheckoutSession = async () => {
    /* ... implementação existente ... */
  };

  const createSubscription = async (
    paymentMethodId: string,
    priceId: string,
  ) => {
    if (!session)
      return { error: 'Você precisa estar logado para fazer uma assinatura' };
    setIsLoading(true);
    try {
      const { data, error } = await invokeWithTimeout('create-subscription', {
        body: { paymentMethodId, priceId },
      });
      // @ts-ignore
      if (error) throw new Error(error.message);
      await checkSubscriptionStatus(); // Re-busca o status após a ação
      toast.success('Assinatura criada com sucesso!');
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao criar a assinatura:', error);
      toast.error('Erro ao criar a assinatura.', {
        description: error.message,
      });
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const startTrial = async () => {
    if (!session)
      return { error: 'Você precisa estar logado para iniciar um teste.' };
    setIsLoading(true);
    try {
      const { error } = await invokeWithTimeout('start-trial');
      // @ts-ignore
      if (error) throw new Error(error.message);
      await checkSubscriptionStatus(); // Re-busca o status após a ação
      return {};
    } catch (error: any) {
      console.error('Erro ao iniciar o trial:', error);
      return { error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    /* ... implementação existente ... */
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        subscriptionInfo,
        isEmailConfirmed,
        login,
        register,
        logout,
        checkSubscription,
        createCheckoutSession,
        createSubscription,
        openCustomerPortal,
        isLoading,
        startTrial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
