// Em src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
// A importação do 'toast' foi mantida pois outras funções podem usá-lo no futuro.
import { toast } from 'sonner';

// --- Interfaces ---
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
  isLoading: boolean;
  isEmailConfirmed: boolean;
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ error?: string }>;
  signUpWithPassword: (
    email: string,
    password: string,
    nome: string,
  ) => Promise<{ error?: string }>;
  signInWithSocial: (provider: 'google' | 'linkedin_oidc') => Promise<void>;
  logout: () => Promise<void>;
  startTrial: () => Promise<{ error?: string }>;
  createSubscription: (
    paymentMethodId: string,
    priceId: string,
  ) => Promise<{ success?: boolean; error?: string }>;
  checkSubscription: () => Promise<void>;
  createCheckoutSession: () => Promise<{ url?: string; error?: string }>;
  openCustomerPortal: () => Promise<{ url?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    trial_end: null,
    in_trial: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsEmailConfirmed(!!session?.user?.email_confirmed_at);
      setIsLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsEmailConfirmed(!!session?.user?.email_confirmed_at);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        setIsLoading(true);
        try {
          const [profileResponse, subscriptionResponse] = await Promise.all([
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single(),
            supabase.functions.invoke('check-subscription'),
          ]);
          if (
            profileResponse.error &&
            profileResponse.error.code !== 'PGRST116'
          )
            throw profileResponse.error;
          if (subscriptionResponse.error) throw subscriptionResponse.error;
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
          const subData = subscriptionResponse.data;
          setSubscriptionInfo(
            subData || {
              subscribed: false,
              in_trial: false,
              trial_end: null,
              subscription_tier: null,
              subscription_end: null,
            },
          );
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUser(null);
          setSubscriptionInfo({
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
            trial_end: null,
            in_trial: false,
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setSubscriptionInfo({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          trial_end: null,
          in_trial: false,
        });
      }
    };
    fetchUserData();
  }, [session]);

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      // A notificação de erro foi removida daqui
      return { error: error.message };
    }
    setSession(data.session);
    return {};
  };

  // --- FUNÇÃO signUpWithPassword ATUALIZADA ---
  const signUpWithPassword = async (
    email: string,
    password: string,
    nome: string,
  ) => {
    try {
      const { data: emailCheck, error: emailCheckError } =
        await supabase.functions.invoke('check-email-exists', {
          body: { email },
        });
      console.log(emailCheck);
      console.log(emailCheckError);
      if (emailCheckError) throw emailCheckError;

      if (emailCheck.exists) {
        // Retorna um "código de erro" customizado que podemos traduzir no frontend
        return { error: 'social_account_exists' };
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: nome } },
      });

      if (signUpError) {
        return { error: signUpError.message };
      }

      return {};
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  };

  const signInWithSocial = async (provider: 'google' | 'linkedin_oidc') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
    if (error)
      toast.error('Erro no login social', { description: error.message });
  };

  const logout = async () => {
    sessionStorage.removeItem('trial_skip_granted');
    await supabase.auth.signOut();
  };

  const checkSubscription = async () => {
    if (!session) return;
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async () => {
    if (!session) return { error: 'Você precisa estar logado' };
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-checkout',
      );
      if (error) throw new Error(getErrorMessage(error));
      return { url: data.url };
    } catch (error: unknown) {
      return { error: getErrorMessage(error) };
    }
  };

  const createSubscription = async (
    paymentMethodId: string,
    priceId: string,
  ) => {
    if (!session) return { error: 'Você precisa estar logado' };
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('create-subscription', {
        body: { paymentMethodId, priceId },
      });
      if (error) throw new Error(getErrorMessage(error));
      await checkSubscription();
      toast.success('Assinatura criada com sucesso!');
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error('Erro ao criar a assinatura.', { description: errorMessage });
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const startTrial = async () => {
    if (!session) return { error: 'Você precisa estar logado' };
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('start-trial');
      if (error) throw new Error(getErrorMessage(error));
      await checkSubscription();
      return {};
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error('Erro ao iniciar o período de teste.', {
        description: errorMessage,
      });
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!session) return { error: 'Você precisa estar logado' };
    try {
      const { data, error } = await supabase.functions.invoke(
        'customer-portal',
      );
      if (error) throw new Error(getErrorMessage(error));
      return { url: data.url };
    } catch (error: unknown) {
      return { error: getErrorMessage(error) };
    }
  };

  const value = {
    user,
    session,
    subscriptionInfo,
    isLoading,
    isEmailConfirmed,
    signInWithPassword,
    signUpWithPassword,
    signInWithSocial,
    logout,
    startTrial,
    createSubscription,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
