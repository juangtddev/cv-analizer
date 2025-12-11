import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
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
  const { createSubscription } = useAuth();
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.nome || '');
      setEmail(userProfile.email || '');
    }
  }, [userProfile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!stripe || !elements || !selectedPlanId) {
      toast.error('Erro ao carregar Stripe ou Planos');
      setIsSubmitting(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Erro nos dados do cartão!');
      setIsSubmitting(false);
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
      setIsSubmitting(false);
      return;
    }

    const { error: subError } = await createSubscription(
      paymentMethod.id,
      selectedPlanId,
    );

    if (subError) {
      setErrorMessage(subError);
    }

    setIsSubmitting(false);
  };

  if (isProfileLoading) return <div>Carregando seus dados.</div>;

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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>
      <div className="text-left space-y-2">
        <Label htmlFor="card">Dados do cartão</Label>
        <div
          className={`p-2 border rounded-md ${
            isSubmitting ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          <CardElement
            id="card"
            options={{ ...cardElementOptions, disabled: isSubmitting }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </form>
  );
}
