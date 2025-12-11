import React, { useState } from 'react';
import { useRegisterMutation } from '@/hooks/useAuthMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  onRegisterError?: (errorMessage: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onRegisterError,
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: register, isPending: isLoading } = useRegisterMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword)
      return onRegisterError?.('As senhas não coincidem.');

    register(
      {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          onRegisterSuccess?.();
        },
        onError: (error) => {
          onRegisterError?.(error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome Completo</label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            name="nome"
            placeholder="Seu nome completo"
            value={formData.nome}
            onChange={handleInputChange}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>
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
            placeholder="Crie uma senha"
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
      <div className="space-y-2">
        <label className="text-sm font-medium">Confirmar Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirme sua senha"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Criando conta...' : 'Criar Conta'}
      </Button>
    </form>
  );
};
