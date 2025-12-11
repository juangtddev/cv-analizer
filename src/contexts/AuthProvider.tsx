import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  const [session, setSession] = useState<Session | null>(null);
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

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message };
    }
    setSession(data.session);
    return {};
  };

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
      if (emailCheckError) throw emailCheckError;

      if (emailCheck.exists) {
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

      await queryClient.invalidateQueries({
        queryKey: ['subscription', session.user.id],
      });

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

      await queryClient.invalidateQueries({
        queryKey: ['subscription', session.user.id],
      });

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
    session,
    isLoading,
    isEmailConfirmed,
    signInWithPassword,
    signUpWithPassword,
    signInWithSocial,
    logout,
    startTrial,
    createSubscription,
    createCheckoutSession,
    openCustomerPortal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
