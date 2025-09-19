// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Interfaces (sem alterações)
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
    priceId: string, // Adicionado novo parâmetro
  ) => Promise<{ success?: boolean; error?: string }>;
  openCustomerPortal: () => Promise<{ url?: string; error?: string }>;
  isLoading: boolean;
  startTrial: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // States (sem alterações)
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

  // --- INÍCIO DA LÓGICA REATORADA ---
  useEffect(() => {
    // Este listener agora centraliza toda a lógica de carregamento de dados.
    // Ele é acionado na carga inicial da página e em qualquer evento de login/logout.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      setSession(session);
      setIsEmailConfirmed(!!session?.user?.email_confirmed_at);

      // Se houver uma sessão, busca o perfil e a assinatura
      if (session?.user) {
        try {
          // Busca os dois dados em paralelo para mais eficiência
          const [profileResponse, subscriptionResponse] = await Promise.all([
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single(),
            supabase.functions.invoke('check-subscription'),
          ]);

          // Processa o resultado do perfil
          const profile = profileResponse.data;
          setUser(
            profile
              ? {
                  id: session.user.id,
                  email: session.user.email || '',
                  nome: profile.nome || '',
                }
              : null,
          );

          // Processa o resultado da assinatura
          const subData = subscriptionResponse.data;
          if (subData) {
            console.log('✅ Status da assinatura carregado:', subData);
            setSubscriptionInfo({
              subscribed: subData.subscribed || false,
              subscription_tier: subData.subscription_tier,
              subscription_end: subData.subscription_end,
              trial_end: subData.trial_end,
              in_trial: subData.in_trial || false,
            });
          }
        } catch (error) {
          console.error(
            'Erro ao buscar dados do usuário ou assinatura:',
            error,
          );
          setUser(null);
          setSubscriptionInfo({
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
            trial_end: null,
            in_trial: false,
          });
        }
      } else {
        // Se não há sessão (logout), limpa todos os dados
        setUser(null);
        setSubscriptionInfo({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          trial_end: null,
          in_trial: false,
        });
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  // --- FIM DA LÓGICA REATORADA ---

  // Suas funções de negócio (sem alterações)
  const checkSubscriptionStatus = async () => {
    // Esta função interna agora pode ser usada para uma verificação manual se necessário
    if (!session) return;
    try {
      const { data, error } = await supabase.functions.invoke(
        'check-subscription',
      );
      if (error) throw error;
      if (data) {
        setSubscriptionInfo({
          subscribed: data.subscribed || false,
          subscription_tier: data.subscription_tier,
          subscription_end: data.subscription_end,
          trial_end: data.trial_end,
          in_trial: data.in_trial || false,
        });
      }
    } catch (error) {
      console.error('Erro na verificação manual da assinatura:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return {};
  };

  const register = async (email: string, password: string, nome: string) => {
    const redirectUrl =
      window.location.hostname === 'localhost'
        ? `${window.location.origin}/`
        : 'https://cvanalizer.fluxdata.com.br/';
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { nome: nome },
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
  };

  const checkSubscription = async () => {
    await checkSubscriptionStatus();
  };

  const createCheckoutSession = async () => {
    if (!session)
      return { error: 'Você precisa estar logado para fazer uma assinatura' };
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-checkout',
      );
      if (error) return { error: error.message };
      return { url: data.url };
    } catch (error) {
      return { error: 'Erro ao criar sessão de pagamento' };
    }
  };

  const createSubscription = async (
    paymentMethodId: string,
    priceId: string,
  ) => {
    if (!session) {
      return { error: 'Você precisa estar logado para fazer uma assinatura' };
    }

    setIsLoading(true);
    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'create-subscription',
        {
          body: { paymentMethodId, priceId }, // Enviando o priceId para o backend
        },
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      await checkSubscriptionStatus();

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
    if (!session) {
      return { error: 'Você precisa estar logado para iniciar um teste.' };
    }

    // 1. AVISA A APLICAÇÃO QUE ESTAMOS CARREGANDO DADOS IMPORTANTES
    setIsLoading(true);

    try {
      const { error: functionError } = await supabase.functions.invoke(
        'start-trial',
      );
      if (functionError) throw new Error(functionError.message);

      // 2. ATUALIZA O ESTADO LOCAL COM OS NOVOS DADOS DO BANCO
      await checkSubscriptionStatus(); // Esta função já existe no seu arquivo

      toast.success('Período de teste iniciado! Redirecionando...');
      return {}; // Sucesso
    } catch (error: any) {
      console.error('Erro ao iniciar o trial:', error);
      toast.error('Erro ao iniciar o período de teste.', {
        description: error.message,
      });
      return { error: error.message };
    } finally {
      // 3. AVISA QUE O CARREGAMENTO TERMINOU, INDEPENDENTE DE SUCESSO OU FALHA
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!session)
      return { error: 'Você precisa estar logado para acessar o portal' };
    try {
      const { data, error } = await supabase.functions.invoke(
        'customer-portal',
      );
      if (error) return { error: error.message };
      return { url: data.url };
    } catch (error) {
      return { error: 'Erro ao abrir portal do cliente' };
    }
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
