import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  CheckCircle2,
  Loader2,
  Lock,
  ShieldCheck,
  CalendarClock,
  CreditCard,
} from 'lucide-react';
import { CheckoutForm } from '@/components/payment/CheckoutForm';
import { useSubscription } from '@/hooks/useSubscription';
import { usePlans } from '@/hooks/usePlans';

export default function PaymentPage() {
  const { data: subscriptionInfo, isLoading: isSubscriptionLoading } =
    useSubscription();
  const { data: plans, isLoading: isLoadingPlans } = usePlans();

  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Seleciona o primeiro plano automaticamente
  useEffect(() => {
    if (plans && plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0].price.id);
    }
  }, [plans, selectedPlan]);

  // Se já assinou, manda pro dashboard
  useEffect(() => {
    if (subscriptionInfo?.subscribed) {
      navigate('/dashboard', { replace: true });
    }
  }, [subscriptionInfo, navigate]);

  const formatPrice = (amount: number | null, currency: string) => {
    if (!amount) return 'Preço indisponível';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  // Calcula a data de cobrança futura (Hoje + 7 dias)
  const getBillingDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('pt-BR');
  };

  if (isSubscriptionLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-2xl border bg-white shadow-xl">
        
        {/* Lado Esquerdo - Marketing e Benefícios */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-slate-900 text-white relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-2">
              <ShieldCheck className="text-green-400" />
              CVAnalyzer Premium
            </div>
            
            <h2 className="text-4xl font-extrabold leading-tight mb-6">
              Experimente 7 dias totalmente grátis.
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Descubra por que candidatos que usam nossa IA conseguem 3x mais entrevistas. Sem compromisso.
            </p>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <CheckCircle2 className="mr-3 h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium">Análises ilimitadas de currículo</span>
              </div>
              <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <CheckCircle2 className="mr-3 h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium">Otimização para vagas específicas (ATS)</span>
              </div>
              <div className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <CheckCircle2 className="mr-3 h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium">Acesso a todos os modelos premium</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500 mt-12">
            <p>Seus dados estão protegidos com criptografia SSL de 256 bits.</p>
          </div>
        </div>

        {/* Lado Direito - Checkout e Cartão */}
        <div className="flex flex-col justify-center p-6 sm:p-12 bg-white">
          <div className="w-full max-w-md mx-auto">
            <CardHeader className="text-left p-0 mb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Comece seu teste grátis</CardTitle>
              <CardDescription>
                Nenhuma cobrança será feita hoje. Cancele a qualquer momento.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
              
              {/* Seleção de Plano */}
              <div className="space-y-3">
                <Label className="font-semibold text-gray-700">Escolha o ciclo de cobrança:</Label>
                {isLoadingPlans ? (
                  <div className="flex items-center justify-center h-24 border rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedPlan || ''}
                    onValueChange={setSelectedPlan}
                    className="grid gap-3"
                  >
                    {plans?.map((plan) => (
                      <Label
                        key={plan.price.id}
                        htmlFor={plan.price.id}
                        className={`flex items-center justify-between space-x-4 rounded-xl border p-4 cursor-pointer transition-all ${
                          selectedPlan === plan.price.id
                            ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                            : 'hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={plan.price.id} id={plan.price.id} />
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{plan.name}</span>
                            <span className="text-sm text-gray-500">
                               7 dias grátis, depois {formatPrice(plan.price.amount, plan.price.currency)}
                            </span>
                          </div>
                        </div>
                        {plan.price.interval === 'year' && (
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                            Melhor Valor
                          </span>
                        )}
                      </Label>
                    ))}
                  </RadioGroup>
                )}
              </div>

              {/* Aviso de Teste Grátis (Regra de Negócio Nova) */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CalendarClock className="h-5 w-5 text-green-700 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-800 text-sm">Resumo do seu teste:</h4>
                    <ul className="mt-2 text-sm text-green-700 space-y-1">
                      <li className="flex justify-between">
                        <span>Hoje:</span>
                        <span className="font-bold">R$ 0,00 (Totalmente Grátis)</span>
                      </li>
                      <li className="flex justify-between">
                        <span>1ª Cobrança ({getBillingDate()}):</span>
                        <span>Valor do plano escolhido</span>
                      </li>
                    </ul>
                    <p className="text-xs text-green-600 mt-2">
                      Vamos te enviar um e-mail 2 dias antes do teste acabar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulário Stripe */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <Label className="font-semibold text-gray-700">Dados do Cartão</Label>
                </div>
                
                {/* O CheckoutForm deve conter apenas o Elemento do Stripe */}
                <CheckoutForm selectedPlanId={selectedPlan} />
              </div>

            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-6 p-0 mt-6">
              {/* Botão Principal de Conversão */}
              <Button 
                type="submit" 
                form="payment-form" 
                className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg transition-all"
              >
                Iniciar Teste Grátis de 7 Dias
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock className="h-3 w-3" />
                Pagamento seguro processado pelo Stripe
              </div>
            </CardFooter>
          </div>
        </div>
      </div>
    </div>
  );
}