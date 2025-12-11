import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

const translateAuthError = (message: string): string => {
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

  const { session, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('login');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
  });
  const [isErrorDialog, setIsErrorDialog] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && session) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [session, isAuthLoading, navigate, location.state]);

  const handleAuthError = (title: string, errorMessage: string) => {
    setDialogContent({ title, description: translateAuthError(errorMessage) });
    setIsErrorDialog(true);
    setDialogOpen(true);
  };

  const handleRegisterSuccess = () => {
    setDialogContent({
      title: 'Cadastro Realizado com Sucesso!',
      description:
        'Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada.',
    });
    setIsErrorDialog(false);
    setDialogOpen(true);
    setActiveTab('login');
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
              <LoginForm
                onLoginError={(msg) => handleAuthError('Erro no Login', msg)}
              />
            </TabsContent>

            <TabsContent value="register" className="pt-4">
              <RegisterForm
                onRegisterSuccess={handleRegisterSuccess}
                onRegisterError={(msg) =>
                  handleAuthError('Erro no Cadastro', msg)
                }
              />
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
