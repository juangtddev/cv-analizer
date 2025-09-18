import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import SEO from '@/components/SEO';

const AssinaturaSucesso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 15 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <SEO 
        title="Assinatura Confirmada - CV Analyzer"
        description="Sua assinatura foi confirmada com sucesso! Aproveite todos os recursos premium."
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Assinatura Confirmada!
            </CardTitle>
            <CardDescription className="text-center">
              Parabéns! Sua assinatura foi processada com sucesso.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <span className="font-semibold text-yellow-700">🎉 Premium Ativo</span>
              </div>
              <p className="text-sm text-yellow-600">
                Sua assinatura premium está ativa e funcionando!
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">O que você pode fazer agora:</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Análises ilimitadas de currículo</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Matching inteligente com vagas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Simulador de entrevistas completo</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Relatórios detalhados e insights</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full"
              >
                Começar a Usar Premium
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/perfil')}
                className="w-full"
              >
                Gerenciar Assinatura
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Redirecionando automaticamente em 15 segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AssinaturaSucesso;