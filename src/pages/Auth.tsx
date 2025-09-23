// Em src/pages/Auth.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { SocialButtons } from '@/components/auth/SocialButtons';

// --- NOVA FUNÇÃO "TRADUTORA" ---
const translateAuthError = (message: string): string => {
  // --- NOVA TRADUÇÃO ADICIONADA AQUI ---
  if (message.includes('social_account_exists')) {
    return 'Este e-mail já está cadastrado. Tente fazer o login ou use a opção "Esqueceu sua senha?".';
  }
  if (message.includes('Invalid login credentials')) {
    return 'E-mail ou senha inválidos. Por favor, verifique seus dados e tente novamente.';
  }
  if (message.includes('User already registered')) {
    // Esta tradução agora serve como um "backup"
    return 'Este e-mail já está cadastrado. Tente fazer o login ou use a opção "Esqueceu sua senha?".';
  }
  if (message.includes('Email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Por favor, verifique sua caixa de entrada e clique no link de confirmação.';
  }
  if (message.includes('Password should be at least 6 characters')) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  console.log(message);
  return 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.';
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signInWithPassword,
    signUpWithPassword,
    user,
    isLoading: isAuthLoading,
  } = useAuth();

  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
  });
  const [isErrorDialog, setIsErrorDialog] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerNome, setRegisterNome] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (!isAuthLoading && user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, isAuthLoading, navigate, location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalIsLoading(true);
    const { error } = await signInWithPassword(loginEmail, loginPassword);
    if (error) {
      setDialogContent({
        title: 'Erro no Login',
        description: translateAuthError(error),
      });
      setIsErrorDialog(true);
      setDialogOpen(true);
    }
    setLocalIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      setDialogContent({
        title: 'Erro no Cadastro',
        description: 'As senhas não coincidem.',
      });
      setIsErrorDialog(true);
      setDialogOpen(true);
      return;
    }

    setLocalIsLoading(true);
    const { error } = await signUpWithPassword(
      registerEmail,
      registerPassword,
      registerNome,
    );
    if (error) {
      setDialogContent({
        title: 'Erro no Cadastro',
        description: translateAuthError(error),
      });
      setIsErrorDialog(true);
      setDialogOpen(true);
    } else {
      setDialogContent({
        title: 'Cadastro Realizado com Sucesso!',
        description:
          'Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada para ativar sua conta.',
      });
      setIsErrorDialog(false);
      setDialogOpen(true);

      setRegisterNome('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setActiveTab('login');
    }
    setLocalIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">CVAnalyzer</CardTitle>
          <p className="text-muted-foreground">
            Sua plataforma de carreira com IA
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={localIsLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={localIsLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={localIsLoading}
                >
                  {localIsLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="pt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-nome">Nome completo</Label>
                  <Input
                    id="register-nome"
                    type="text"
                    value={registerNome}
                    onChange={(e) => setRegisterNome(e.target.value)}
                    required
                    disabled={localIsLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    disabled={localIsLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    disabled={localIsLoading}
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={localIsLoading}
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={localIsLoading}
                >
                  {localIsLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cadastrar
                </Button>
              </form>
            </TabsContent>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <SocialButtons />
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle
              className={isErrorDialog ? 'text-destructive' : 'text-primary'}
            >
              {dialogContent.title}
            </DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
