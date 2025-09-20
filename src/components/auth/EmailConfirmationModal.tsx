import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onConfirmationComplete: () => void;
}

const EmailConfirmationModal = ({ isOpen, onClose, userEmail, onConfirmationComplete }: EmailConfirmationModalProps) => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isCheckingConfirmation, setIsCheckingConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Verificar periodicamente se o email foi confirmado
      const checkInterval = setInterval(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email_confirmed_at) {
          clearInterval(checkInterval);
          onConfirmationComplete();
        }
      }, 3000); // Verifica a cada 3 segundos

      return () => clearInterval(checkInterval);
    }
  }, [isOpen, onConfirmationComplete]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      console.log('📧 Enviando email via Supabase nativo...');
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (!resendError) {
        setResendMessage('✅ Email reenviado com sucesso! Verifique sua caixa de entrada e pasta de spam. Pode levar alguns minutos para chegar.');
      } else if (resendError.message.includes('already confirmed')) {
        setResendMessage('✅ Este email já foi confirmado. Você pode fechar esta janela.');
      } else if (resendError.message.includes('rate limit')) {
        setResendMessage('⏰ Aguarde alguns minutos antes de tentar novamente.');
      } else {
        console.error('❌ Erro ao reenviar email:', resendError);
        setResendMessage('❌ Não foi possível enviar o email. Verifique as configurações ou tente novamente em alguns minutos.');
      }
    } catch (error) {
      console.error('💥 Erro geral no reenvio:', error);
      setResendMessage('❌ Erro inesperado. Tente novamente em alguns minutos.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckConfirmation = async () => {
    setIsCheckingConfirmation(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        onConfirmationComplete();
      } else {
        setResendMessage('Email ainda não foi confirmado. Verifique sua caixa de entrada e spam.');
      }
    } catch (error) {
      setResendMessage('Erro ao verificar confirmação.');
    } finally {
      setIsCheckingConfirmation(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Confirme seu email para continuar
          </DialogTitle>
          <DialogDescription className="text-base">
            Enviamos um link de confirmação para:
            <br />
            <strong className="text-primary">{userEmail}</strong>
            <br />
            <span className="text-sm text-muted-foreground mt-2 block">
              Você precisa confirmar seu email para acessar a plataforma
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {resendMessage && (
            <Alert variant={resendMessage.includes('sucesso') ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{resendMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleCheckConfirmation}
              disabled={isCheckingConfirmation}
              className="w-full"
            >
              {isCheckingConfirmation && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Já confirmei meu email
            </Button>

            <Button 
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              📧 Reenviar email de confirmação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailConfirmationModal;