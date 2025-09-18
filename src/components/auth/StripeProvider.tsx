import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key - PRODUÇÃO
const stripePromise = loadStripe('pk_live_51S0pcxEPUk3LRBzEun06mVQ109DN4XE6P07PSTFnLoM91fIhEhn1IS08oggj4YDP3Xg6cAym6x0QPsDhJwICgwuu00AZAD8Drm');

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider = ({ children }: StripeProviderProps) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;