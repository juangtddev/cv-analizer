// Em src/pages/PaymentPage.tsx

'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Terminal, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { CheckoutForm } from '@/components/payment/CheckoutForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: {
    id: string;
    amount: number | null;
    currency: string;
    interval: string | undefined;
  };
}

export default function PaymentPage() {
  const { subscriptionInfo, isLoading: isAuthLoading, startTrial } = useAuth();
  const navigate = useNavigate();
  const [isTrialLoading, setIsTrialLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const { data, error } = await supabase.functions.invoke(
          'get-active-products',
        );
        if (error) throw error;
        const fetchedPlans: Plan[] = data.plans || [];
        setPlans(fetchedPlans);
        if (fetchedPlans.length > 0) {
          setSelectedPlan(fetchedPlans[0].price.id);
        }
      } catch (error) {
        console.error('Erro ao buscar planos:', error);
        toast.error('Não foi possível carregar os planos de assinatura.');
      } finally {
        setIsLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  // --- ADICIONADO: useEffect para redirecionamento pós-assinatura ---
  useEffect(() => {
    // Se, em qualquer momento, o status do usuário mudar para 'assinado'
    // enquanto ele estiver nesta página, redirecione-o para o dashboard.
    if (subscriptionInfo.subscribed) {
      navigate('/dashboard', { replace: true });
    }
  }, [subscriptionInfo.subscribed, navigate]); // Roda sempre que 'subscribed' mudar

  const calculateDaysRemaining = () => {
    if (!subscriptionInfo.trial_end) return 0;
    const trialEndDate = new Date(subscriptionInfo.trial_end);
    const now = new Date();
    const diffInMillis = trialEndDate.getTime() - now.getTime();
    if (diffInMillis <= 0) return 0;
    return Math.ceil(diffInMillis / (1000 * 60 * 60 * 24));
  };

  const trialHasExpired =
    subscriptionInfo.trial_end &&
    new Date(subscriptionInfo.trial_end) < new Date();
  const daysRemaining = calculateDaysRemaining();

  const handleStartTrial = async () => {
    setIsTrialLoading(true);
    const result = await startTrial();
    if (result && result.error) {
      toast.error('Erro ao iniciar o período de teste.', {
        description: result.error,
      });
      setIsTrialLoading(false);
    } else {
      toast.success('Período de teste iniciado! Redirecionando...');
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSkipForNow = () => {
    navigate('/dashboard');
  };

  const formatPrice = (amount: number | null, currency: string) => {
    if (amount === null) return 'Preço indisponível';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="hidden lg:flex flex-col items-center justify-center p-10 text-center border-r bg-muted/50">
          <div className="mx-auto w-[400px] space-y-4">
            <div className="flex-shrink-0">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ">
                CVAnalyzer
              </div>
            </div>
            <h2 className="text-3xl font-bold">
              Acelere sua Carreira com Análises de IA
            </h2>
            <p className="text-muted-foreground">
              Junte-se a milhares de profissionais que já estão otimizando seus
              currículos e se preparando para entrevistas com nossa plataforma.
            </p>
            <div className="flex flex-col items-center text-sm text-muted-foreground text-left">
              <p className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />{' '}
                Análises de currículo ilimitadas
              </p>
              <p className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />{' '}
                Simulador de entrevistas com IA
              </p>
              <p className="flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />{' '}
                Histórico completo de análises
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <CardHeader className="text-center p-0 mb-6">
              <CardTitle className="text-2xl"></CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6 text-center">
              {subscriptionInfo.in_trial && daysRemaining > 0 && (
                <Alert className="">
                  <AlertTitle>
                    Seu acesso gratuito termina em{' '}
                    <strong>
                      {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
                    </strong>
                    .
                  </AlertTitle>
                </Alert>
              )}

              <div className="space-y-4 text-left">
                <Label className="font-semibold">Selecione o seu plano:</Label>
                {isLoadingPlans ? (
                  <div className="flex items-center justify-center h-24 border rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedPlan || ''}
                    onValueChange={setSelectedPlan}
                  >
                    {plans.map((plan) => (
                      <Label
                        key={plan.price.id}
                        htmlFor={plan.price.id}
                        className={`flex items-center space-x-4 rounded-md border p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                          selectedPlan === plan.price.id
                            ? 'border-purple-600 ring-2 ring-purple-300' // Estilo melhorado
                            : ''
                        }`}
                      >
                        <RadioGroupItem
                          value={plan.price.id}
                          id={plan.price.id}
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">{plan.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatPrice(
                              plan.price.amount,
                              plan.price.currency,
                            )}{' '}
                            /{' '}
                            {plan.price.interval === 'month'
                              ? 'mês'
                              : plan.price.interval}
                          </span>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                )}
              </div>

              <div className=" flex flex-col gap-2">
                {/* --- A CORREÇÃO ESTÁ AQUI --- */}
                <CheckoutForm selectedPlanId={selectedPlan} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-6 p-0 my-5">
              <Button type="submit" form="payment-form" className="w-full">
                {trialHasExpired
                  ? 'Assinar para Continuar'
                  : 'Assinar o Premium'}
              </Button>
              {subscriptionInfo.in_trial && !trialHasExpired && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSkipForNow}
                >
                  Pular por enquanto
                </Button>
              )}
              {!subscriptionInfo.in_trial &&
                !trialHasExpired &&
                !subscriptionInfo.subscribed && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleStartTrial}
                    disabled={isTrialLoading}
                  >
                    {isTrialLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Pular e Iniciar Teste Gratuito de 14 dias
                  </Button>
                )}
            </CardFooter>
          </div>
        </div>
      </div>
    </div>
  );
}
