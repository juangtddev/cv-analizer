import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Chave pública do Stripe - PRODUÇÃO
const stripePromise = loadStripe('pk_live_51S0pcxEPUk3LRBzEun06mVQ109DN4XE6P07PSTFnLoM91fIhEhn1IS08oggj4YDP3Xg6cAym6x0QPsDhJwICgwuu00AZAD8Drm');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
};

interface ValidationResult {
  success: boolean;
  message: string;
  validation?: {
    card_valid: boolean;
    has_limit: boolean;
    payment_intent_id?: string;
    charge_id?: string;
    refund_id?: string;
    refund_status?: string;
    status?: string;
    error_code?: string;
    decline_code?: string;
  };
  requires_action?: boolean;
  client_secret?: string;
}

const CardValidationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { session } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidation = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe não carregado ainda');
      return;
    }

    if (!session) {
      toast.error('Você precisa estar logado');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Elemento do cartão não encontrado');
      return;
    }

    setIsValidating(true);
    setResult(null);

    try {
      console.log('🔄 Iniciando validação de cartão...');
      console.log('📧 Email do usuário:', session.user?.email);
      
      // Criar Payment Method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        console.error('❌ Erro ao criar Payment Method:', paymentMethodError);
        toast.error(`Erro no cartão: ${paymentMethodError.message}`);
        setResult({
          success: false,
          message: `Erro no cartão: ${paymentMethodError.message}`
        });
        return;
      }

      console.log('✅ Payment Method criado:', paymentMethod.id);

      // Chamar a função de validação
      console.log('🔄 Chamando função validate-card...');
      const { data, error } = await supabase.functions.invoke('validate-card', {
        body: { paymentMethodId: paymentMethod.id },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('📋 Resposta da função:', { data, error });

      if (error) {
        console.error('❌ Erro na função:', error);
        toast.error('Erro na validação do cartão');
        setResult({
          success: false,
          message: error.message || 'Erro na validação'
        });
        return;
      }

      console.log('📋 Resultado da validação:', data);
      setResult(data);

      if (data.success) {
        toast.success('Cartão validado com sucesso! Valor estornado automaticamente.');
      } else if (data.requires_action) {
        toast.info('Cartão requer autenticação adicional (3D Secure)');
      } else {
        toast.error(data.message || 'Falha na validação do cartão');
      }

    } catch (error: any) {
      console.error('💥 Erro geral:', error);
      toast.error('Erro inesperado na validação');
      setResult({
        success: false,
        message: 'Erro inesperado na validação'
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Validação de Cartão
        </CardTitle>
        <CardDescription>
          Verificamos se seu cartão é válido com uma cobrança de R$ 1,00 que é estornada automaticamente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleValidation} className="space-y-4">
          <div className="p-3 border border-border rounded-md bg-background">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>

          <Button 
            type="submit" 
            disabled={!stripe || isValidating} 
            className="w-full"
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validando cartão...
              </>
            ) : (
              'Validar Cartão (R$ 1,00 - Estorno Automático)'
            )}
          </Button>
        </form>

        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription>
                  <div className="font-medium mb-1">{result.message}</div>
                  
                  {result.validation && (
                    <div className="text-sm space-y-1 mt-2">
                      <div className="flex justify-between">
                        <span>Cartão Válido:</span>
                        <span className={result.validation.card_valid ? 'text-green-600' : 'text-red-600'}>
                          {result.validation.card_valid ? 'Sim' : 'Não'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tem Limite:</span>
                        <span className={result.validation.has_limit ? 'text-green-600' : 'text-red-600'}>
                          {result.validation.has_limit ? 'Sim' : 'Não'}
                        </span>
                      </div>
                      
                      {result.validation.refund_id && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="text-xs text-muted-foreground">
                            <div>Estorno ID: {result.validation.refund_id}</div>
                            <div>Status: {result.validation.refund_status}</div>
                          </div>
                        </div>
                      )}

                      {result.validation.error_code && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="text-xs text-muted-foreground">
                            <div>Código de Erro: {result.validation.error_code}</div>
                            {result.validation.decline_code && (
                              <div>Motivo: {result.validation.decline_code}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground border-t border-border pt-3">
          <div className="space-y-1">
            <div>• Cobrança de R$ 1,00 para verificar limite</div>
            <div>• Valor estornado automaticamente após validação</div>
            <div>• Processo seguro via Stripe</div>
            <div>• Não há custos para você</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CardValidation = () => {
  return (
    <Elements stripe={stripePromise}>
      <CardValidationForm />
    </Elements>
  );
};

export default CardValidation;