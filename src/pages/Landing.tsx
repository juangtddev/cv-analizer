
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, Brain, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Análise Inteligente',
      description: 'IA avançada analisa seu currículo e fornece insights detalhados para melhorar suas chances de contratação.'
    },
    {
      icon: TrendingUp,
      title: 'Acompanhamento de Progresso',
      description: 'Monitore a evolução do seu currículo ao longo do tempo com métricas e gráficos detalhados.'
    },
    {
      icon: FileText,
      title: 'Múltiplos Formatos',
      description: 'Suporte para PDF, Word e integração com LinkedIn para análise completa do seu perfil.'
    },
    {
      icon: Users,
      title: 'Comparação com Vagas',
      description: 'Compare seu currículo com vagas específicas e receba sugestões personalizadas.'
    }
  ];

  const benefits = [
    'Análise detalhada por IA especializada',
    'Sugestões específicas de melhoria',
    'Comparação com requisitos de vagas',
    'Histórico completo de análises',
    'Relatórios em PDF profissionais',
    'Dashboard com métricas de progresso'
  ];

  return (
    <>
      <SEO 
        title="CVAnalyzer - Análise Inteligente de Currículos com IA"
        description="Transforme seu currículo com nossa plataforma de análise inteligente. Receba feedback detalhado, sugestões personalizadas e simule entrevistas para maximizar suas oportunidades profissionais."
        keywords="análise currículo, otimização cv, inteligência artificial, simulador entrevista, feedback currículo, melhorar cv, análise cv online, currículo profissional"
        canonicalUrl="/"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CVAnalyzer
            </div>
            <div className="space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/register')}>
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Potencialize seu
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Currículo </span>
            com IA
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Receba análises detalhadas, sugestões personalizadas e acompanhe sua evolução profissional 
            com nossa plataforma inteligente de otimização de currículos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" onClick={() => navigate('/register')}>
              Analisar Meu Currículo Grátis
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Ver Demonstração
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Por que escolher o CVAnalyzer?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Nossa plataforma utiliza inteligência artificial avançada para fornecer 
                insights precisos e actionáveis sobre seu currículo.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Análise Completa</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Estrutura e Formatação</span>
                    <span className="font-semibold text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Palavras-chave</span>
                    <span className="font-semibold text-yellow-600">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Experiência Relevante</span>
                    <span className="font-semibold text-blue-600">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Aderência à Vaga</span>
                    <span className="font-semibold text-purple-600">82%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para revolucionar seu currículo?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de profissionais que já otimizaram seus currículos com nossa IA.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-3"
            onClick={() => navigate('/register')}
          >
            Começar Análise Gratuita
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            CVAnalyzer
          </div>
          <p className="text-gray-400">
            © 2024 CVAnalyzer. Todos os direitos reservados.
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Landing;
