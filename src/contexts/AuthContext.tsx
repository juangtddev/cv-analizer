import { createContext } from 'react';
import { Session } from '@supabase/supabase-js';

// A interface que define o "contrato" do contexto
export interface AuthContextType {
  session: Session | null;
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
  createCheckoutSession: () => Promise<{ url?: string; error?: string }>;
  openCustomerPortal: () => Promise<{ url?: string; error?: string }>;
}

// O objeto do contexto em si
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
