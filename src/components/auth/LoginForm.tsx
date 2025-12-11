import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from '@/hooks/useAuthMutations';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onLoginError?: (errorMessage: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onLoginError,
}) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending: isLoading } = useLoginMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData, {
      onSuccess: () => {
        onLoginSuccess?.();
      },
      onError: (error) => {
        onLoginError?.(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="email"
            name="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Sua senha"
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10 pr-10"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
};
