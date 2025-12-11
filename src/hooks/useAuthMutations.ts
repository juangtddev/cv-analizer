import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLoginMutation = () => {
  const { signInWithPassword } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { error } = await signInWithPassword(
        credentials.email,
        credentials.password,
      );
      if (error) throw new Error(error);
    },
  });
};

interface RegisterCredentials {
  email: string;
  password: string;
  nome: string;
}

export const useRegisterMutation = () => {
  const { signUpWithPassword } = useAuth();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { error } = await signUpWithPassword(
        credentials.email,
        credentials.password,
        credentials.nome,
      );
      if (error) throw new Error(error);
    },
  });
};
