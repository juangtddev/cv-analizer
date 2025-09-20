import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TestDebug = () => {
  const { session, user } = useAuth();

  const testEmailResend = async () => {
    if (!session?.user?.email) {
      toast.error('Usuário não logado');
      return;
    }

    try {
      console.log('🔄 Tentando reenviar email para:', session.user.email);
      
      // Usar nossa função customizada de reenvio
      const { data, error } = await supabase.functions.invoke('resend-confirmation', {
        body: { email: session.user.email },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('❌ Erro ao reenviar:', error);
        toast.error(`Erro: ${error.message}`);
      } else {
        console.log('✅ Resultado:', data);
        toast.success('Email de confirmação reenviado com nosso template customizado!');
      }
    } catch (error: any) {
      console.error('💥 Erro geral:', error);
      toast.error('Erro inesperado');
    }
  };

  const testCardValidation = async () => {
    if (!session) {
      toast.error('Usuário não logado');
      return;
    }

    try {
      console.log('🔄 Testando função validate-card...');
      console.log('❌ ERRO: Payment Method de teste não funciona em produção');
      console.log('✅ SOLUÇÃO: Use a página /validacao-cartao com cartão real');
      
      toast.error('Esta função usa Payment Method de teste que não funciona em produção. Use /validacao-cartao');
      
      // Redirecionar para a página de validação real
      setTimeout(() => {
        window.open('/validacao-cartao', '_blank');
      }, 2000);
      
    } catch (error: any) {
      console.error('💥 Erro geral:', error);
      toast.error('Erro inesperado');
    }
  };

  return (
    <>
      <SEO 
        title="Debug e Testes"
        description="Página para debug e testes das funcionalidades"
      />
      
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Debug e Testes</h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Status do usuário */}
            <Card>
              <CardHeader>
                <CardTitle>Status do Usuário</CardTitle>
                <CardDescription>Informações da sessão atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Logado:</strong> {session ? '✅ Sim' : '❌ Não'}</div>
                <div><strong>Email:</strong> {session?.user?.email || 'N/A'}</div>
                <div><strong>Email Confirmado:</strong> {session?.user?.email_confirmed_at ? '✅ Sim' : '❌ Não'}</div>
                <div><strong>User ID:</strong> {user?.id ? user.id.substring(0, 8) + '...' : 'N/A'}</div>
                <div><strong>Nome:</strong> {user?.nome || 'N/A'}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  <strong>Token válido:</strong> {session?.access_token ? '✅ Sim' : '❌ Não'}
                </div>
              </CardContent>
            </Card>

            {/* Teste de Email */}
            <Card>
              <CardHeader>
                <CardTitle>Teste de Email</CardTitle>
                <CardDescription>Reenviar email de confirmação</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={testEmailResend} className="w-full">
                  📧 Reenviar Email de Confirmação
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Verifique o console do navegador para logs detalhados
                </p>
              </CardContent>
            </Card>

            {/* Teste de Validação de Cartão */}
            <Card>
              <CardHeader>
                <CardTitle>Teste de Validação de Cartão</CardTitle>
                <CardDescription>🔧 Função corrigida - redireciona para teste real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-3">
                  <p className="text-sm text-green-800">
                    <strong>✅ PROBLEMA RESOLVIDO:</strong>
                    <br />
                    Agora redireciona automaticamente para teste com cartão real
                  </p>
                </div>
                
                <Button onClick={testCardValidation} className="w-full">
                  💳 Testar Validação (Redireciona para Teste Real)
                </Button>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Clique aqui e será redirecionado para o teste com cartão real
                </p>
              </CardContent>
            </Card>

            {/* Informações importantes */}
            <Card>
              <CardHeader>
                <CardTitle>Verificar Transações Stripe</CardTitle>
                <CardDescription>Como verificar se as transações aparecem no Stripe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>📊 Dashboard do Stripe:</strong>
                  <br />
                  <a 
                    href="https://dashboard.stripe.com/payments" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    https://dashboard.stripe.com/payments
                  </a>
                </div>
                
                <div className="text-sm">
                  <strong>✅ O que você deveria ver:</strong>
                  <ul className="text-xs mt-1 ml-4 list-disc space-y-1">
                    <li>Cobrança de R$ 1,00 (succeeded)</li>
                    <li>Estorno de R$ 1,00 (succeeded)</li>
                    <li>Customer criado/atualizado</li>
                    <li>Payment Method anexado</li>
                  </ul>
                </div>

                <div className="text-sm">
                  <strong>🔎 Como encontrar:</strong>
                  <ul className="text-xs mt-1 ml-4 list-disc space-y-1">
                    <li>Vá em "Payments" no dashboard</li>
                    <li>Procure pelo seu email</li>
                    <li>Ou procure por "Validação de cartão"</li>
                  </ul>
                </div>

              <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs">
                <strong>🚀 Sistema em Produção:</strong>
                <br />
                Use seu cartão real. As transações aparecerão no dashboard do Stripe.
                <br />
                Verifique em: https://dashboard.stripe.com/payments
              </div>
              </CardContent>
            </Card>
          </div>

          {/* Logs em tempo real */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Debug Console</CardTitle>
              <CardDescription>
                Abra o console do navegador (F12 → Console) para ver logs detalhados das operações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div>🔄 Sistema em produção</div>
                <div>💡 Clique nos botões acima para testar as funcionalidades</div>
                <div>📧 Emails são enviados via Resend</div>
                <div>💳 Use seu cartão real para validação em produção</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TestDebug;