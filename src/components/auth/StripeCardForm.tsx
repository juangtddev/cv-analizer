import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle } from 'lucide-react';

interface StripeCardFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const StripeCardForm = ({ onSuccess, onError, isLoading, disabled }: StripeCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [paymentMethodCreated, setPaymentMethodCreated] = useState(false);

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : '');
    setCardComplete(event.complete);
    
    // Reset payment method when card changes
    if (paymentMethodCreated && !event.complete) {
      setPaymentMethodCreated(false);
    }
  };

  // Criar payment method automaticamente quando cartão estiver completo
  useEffect(() => {
    if (cardComplete && !paymentMethodCreated && !isValidating && stripe && elements) {
      createPaymentMethod();
    }
  }, [cardComplete, paymentMethodCreated, isValidating, stripe, elements]);

  const createPaymentMethod = async () => {
    if (!stripe || !elements) {
      onError('Stripe não foi carregado corretamente');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Elemento do cartão não encontrado');
      return;
    }

    setIsValidating(true);
    setCardError('');

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        onError(error.message || 'Erro ao processar cartão');
        setPaymentMethodCreated(false);
      } else if (paymentMethod) {
        setPaymentMethodCreated(true);
        onSuccess(paymentMethod.id);
      }
    } catch (error) {
      onError('Erro inesperado ao validar cartão');
      setPaymentMethodCreated(false);
    } finally {
      setIsValidating(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        backgroundColor: 'transparent',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
        iconColor: 'hsl(var(--primary))',
      },
      invalid: {
        color: 'hsl(var(--destructive))',
        iconColor: 'hsl(var(--destructive))',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Dados do Cartão de Crédito
          {paymentMethodCreated && (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
        </Label>
        <div className={`p-3 border rounded-md bg-background transition-colors ${
          paymentMethodCreated ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 
          cardError ? 'border-red-500' : ''
        }`}>
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
          {isValidating && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Validando cartão...
            </div>
          )}
          {paymentMethodCreated && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <CheckCircle className="h-3 w-3" />
              Cartão validado com sucesso
            </div>
          )}
        </div>
        {cardError && (
          <Alert variant="destructive">
            <AlertDescription>{cardError}</AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-green-700 dark:text-green-300 font-medium">
            Período de teste grátis por 7 dias
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Seu cartão será cobrado apenas após o período de teste
        </p>
      </div>
    </div>
  );
};

export default StripeCardForm;