
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, TrendingUp, AlertCircle, CheckCircle, Star } from 'lucide-react';

const ResultadoAnalise = () => {
  const navigate = useNavigate();

  const analise = {
    notaGeral: 8.4,
    dataAnalise: '15/01/2024',
    nomeArquivo: 'curriculo-joao-silva.pdf',
    categorias: [
      {
        nome: 'Estrutura e Formatação',
        nota: 9.2,
        status: 'excellent',
        feedback: 'Currículo bem estruturado e visualmente atrativo. Formatação consistente e profissional.'
      },
      {
        nome: 'Palavras-chave',
        nota: 7.8,
        status: 'good',
        feedback: 'Bom uso de palavras-chave relevantes, mas pode ser otimizado para tecnologias específicas.'
      },
      {
        nome: 'Experiência Relevante',
        nota: 8.9,
        status: 'excellent',
        feedback: 'Experiências bem descritas e alinhadas com objetivos profissionais.'
      },
      {
        nome: 'Clareza e Objetividade',
        nota: 7.5,
        status: 'good',
        feedback: 'Informações claras, mas algumas seções podem ser mais concisas.'
      }
    ],
    sugestoes: [
      {
        tipo: 'melhoria',
        titulo: 'Adicionar Certificações',
        descricao: 'Inclua certificações relevantes como AWS, Google Cloud ou Microsoft Azure para fortalecer seu perfil técnico.',
        prioridade: 'alta'
      },
      {
        tipo: 'otimizacao',
        titulo: 'Palavras-chave Específicas',
        descricao: 'Adicione mais termos técnicos específicos como "React Hooks", "TypeScript", "CI/CD" para melhor compatibilidade com ATS.',
        prioridade: 'média'
      },
      {
        tipo: 'formatacao',
        titulo: 'Seção de Projetos',
        descricao: 'Considere criar uma seção dedicada aos projetos mais relevantes com links para GitHub ou demos.',
        prioridade: 'média'
      },
      {
        tipo: 'conteudo',
        titulo: 'Quantificar Resultados',
        descricao: 'Adicione métricas e números quando possível: "Aumentou performance em 40%", "Gerenciou equipe de 5 pessoas".',
        prioridade: 'alta'
      }
    ],
    pontosFortes: [
      'Experiência sólida em desenvolvimento frontend',
      'Boa progressão de carreira demonstrada',
      'Formação acadêmica relevante',
      'Habilidades técnicas atualizadas'
    ],
    pontosMelhoria: [
      'Falta de certificações técnicas',
      'Poucos projetos pessoais mencionados',
      'Ausência de métricas de impacto',
      'Seção de idiomas incompleta'
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotaColor = (nota: number) => {
    if (nota >= 9) return 'text-green-600';
    if (nota >= 7) return 'text-blue-600';
    if (nota >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resultado da Análise</h1>
              <p className="text-gray-600 mt-2">
                Arquivo: {analise.nomeArquivo} • Analisado em {analise.dataAnalise}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Baixar Relatório PDF
              </Button>
              <Button onClick={() => navigate('/upload-curriculo')}>
                <FileText className="mr-2 h-4 w-4" />
                Nova Análise
              </Button>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {analise.notaGeral}
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-2">Nota Geral</div>
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-6 w-6 ${i < Math.floor(analise.notaGeral / 2) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 mt-2">Seu currículo está acima da média!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Scores */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Análise por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {analise.categorias.map((categoria, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{categoria.nome}</h3>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getNotaColor(categoria.nota)}`}>
                        {categoria.nota}
                      </div>
                      <Badge className={getStatusColor(categoria.status)}>
                        {categoria.status === 'excellent' ? 'Excelente' : 'Bom'}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                      style={{width: `${categoria.nota * 10}%`}}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{categoria.feedback}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Pontos Fortes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                Pontos Fortes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analise.pontosFortes.map((ponto, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{ponto}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pontos de Melhoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <AlertCircle className="mr-2 h-5 w-5" />
                Pontos de Melhoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analise.pontosMelhoria.map((ponto, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{ponto}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sugestões Detalhadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Sugestões de Melhoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analise.sugestoes.map((sugestao, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{sugestao.titulo}</h3>
                    <Badge className={getPriorityColor(sugestao.prioridade)}>
                      Prioridade {sugestao.prioridade}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-2">{sugestao.descricao}</p>
                  <span className="text-sm text-blue-600 capitalize">{sugestao.tipo}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Pronto para implementar as melhorias?
          </h2>
          <p className="text-blue-100 mb-6">
            Faça os ajustes sugeridos e analise seu currículo novamente para ver a evolução!
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={() => navigate('/upload-curriculo')}>
              Analisar Currículo Atualizado
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Comparar com Vagas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoAnalise;
