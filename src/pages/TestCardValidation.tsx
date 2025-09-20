import SEO from '@/components/SEO';
import CardValidation from '@/components/auth/CardValidation';

const TestCardValidation = () => {
  return (
    <>
      <SEO 
        title="Validação de Cartão - Produção"
        description="Valide seu cartão de crédito com cobrança de R$ 1,00 e estorno automático - Sistema em Produção"
        keywords="validação, cartão, stripe, pagamento, produção"
      />
      
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Validação de Cartão 🚀</h1>
            <p className="text-muted-foreground">
              <strong>Sistema em Produção</strong> - Valide seu cartão com cobrança de R$ 1,00 e estorno automático
            </p>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              ✅ Modo Produção Ativo
            </div>
          </div>
          
          <div className="flex justify-center">
            <CardValidation />
          </div>
          
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Como funciona a validação em produção:</h2>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">1</div>
                <div>
                  <div className="font-medium text-foreground">Inserção dos dados do cartão real</div>
                  <div>Digite os dados do seu cartão de crédito real no formulário seguro do Stripe</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">2</div>
                <div>
                  <div className="font-medium text-foreground">Cobrança real de validação</div>
                  <div>Fazemos uma cobrança real de R$ 1,00 para verificar se o cartão é válido e tem limite disponível</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">3</div>
                <div>
                  <div className="font-medium text-foreground">Estorno automático imediato</div>
                  <div>Se a cobrança for bem-sucedida, fazemos o estorno automático do valor R$ 1,00 imediatamente</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">4</div>
                <div>
                  <div className="font-medium text-foreground">Resultado da validação</div>
                  <div>Você recebe o resultado: cartão válido/inválido, tem limite/sem limite - transação visível no Stripe</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">🚀 Modo de Produção Ativo:</h3>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• O processo é totalmente seguro e criptografado</li>
                <li>• Não armazenamos dados do cartão</li>
                <li>• O estorno é processado instantaneamente</li>
                <li>• Pode aparecer como "pendente" no seu cartão por algumas horas</li>
                <li>• <strong>Use seu cartão real</strong> - sistema em produção</li>
                <li>• As transações aparecerão no seu dashboard do Stripe</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestCardValidation;