import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import SEO from '@/components/SEO';

const AssinaturaCancelada = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Assinatura Cancelada - CVData"
        description="Sua assinatura foi cancelada. Você ainda pode se inscrever a qualquer momento."
      />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Assinatura Cancelada
            </CardTitle>
            <CardDescription>
              Não se preocupe! Você pode tentar novamente a qualquer momento.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">
                🎁 Oferta Especial Ainda Ativa!
              </h3>
              <p className="text-sm text-blue-600">
                Seus <strong>7 dias grátis</strong> ainda estão disponíveis quando você se inscrever.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Você perdeu:</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                  <span>Análises ilimitadas de currículo</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                  <span>Matching inteligente com vagas</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                  <span>Simulador de entrevistas completo</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                  <span>Relatórios detalhados personalizados</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Tentar Novamente (7 dias grátis)
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Dúvidas?</strong> Entre em contato conosco pelo chat da plataforma.
                Estamos aqui para ajudar!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AssinaturaCancelada;