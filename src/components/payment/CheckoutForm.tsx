import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CheckoutFormProps {
  selectedPlanId: string | null;
}

const cardElementOptions = {
  style: {
    base: {
      color: '#000',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

export function CheckoutForm({ selectedPlanId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user, createSubscription } = useAuth();

  const [name, setName] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.nome || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!selectedPlanId) {
      toast.error('Por favor, selecione um plano para continuar.');
      setIsLoading(false);
      return;
    }

    if (!stripe || !elements || !createSubscription) {
      console.error('Stripe.js ou a função de assinatura não carregou.');
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (cardElement == null) {
      console.error('CardElement não encontrado.');
      setIsLoading(false);
      return;
    }

    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: { name, email },
    });

    if (pmError) {
      setErrorMessage(
        pmError.message ?? 'Ocorreu um erro ao validar seu cartão.',
      );
      setIsLoading(false);
      return;
    }

    // --- ALTERAÇÃO FINAL AQUI ---
    // Agora passamos o paymentMethod.id E o selectedPlanId para a função do contexto
    const { error: subError } = await createSubscription(
      paymentMethod.id,
      selectedPlanId,
    );

    if (subError) {
      setErrorMessage(subError); // Ajustado para pegar a mensagem de erro
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2 text-left">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome como aparece no cartão"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2 text-left">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          disabled={isLoading}
        />
      </div>
      <div className="text-left space-y-2">
        <Label htmlFor="card">Dados do cartão</Label>
        <div
          className={`p-2 border rounded-md ${
            isLoading ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          <CardElement
            id="card"
            options={{ ...cardElementOptions, disabled: isLoading }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </form>
  );
}
