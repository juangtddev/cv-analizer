
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, Download, Eye, Calendar } from 'lucide-react';

const Historico = () => {
  const navigate = useNavigate();

  const historico = [
    {
      id: 1,
      titulo: 'Currículo - Desenvolvedor Frontend',
      arquivo: 'curriculo-joao-frontend-v3.pdf',
      dataAnalise: '15/01/2024',
      notaGeral: 8.4,
      melhorias: [
        { categoria: 'Estrutura', notaAnterior: 8.8, notaAtual: 9.2 },
        { categoria: 'Palavras-chave', notaAnterior: 7.2, notaAtual: 7.8 },
        { categoria: 'Experiência', notaAnterior: 8.5, notaAtual: 8.9 }
      ],
      status: 'recente'
    },
    {
      id: 2,
      titulo: 'Currículo - Desenvolvedor Frontend',
      arquivo: 'curriculo-joao-frontend-v2.pdf',
      dataAnalise: '08/01/2024',
      notaGeral: 7.9,
      melhorias: [
        { categoria: 'Estrutura', notaAnterior: 8.2, notaAtual: 8.8 },
        { categoria: 'Palavras-chave', notaAnterior: 6.8, notaAtual: 7.2 },
        { categoria: 'Experiência', notaAnterior: 8.1, notaAtual: 8.5 }
      ],
      status: 'anterior'
    },
    {
      id: 3,
      titulo: 'Currículo - Desenvolvedor Frontend',
      arquivo: 'curriculo-joao-frontend-v1.pdf',
      dataAnalise: '28/12/2023',
      notaGeral: 7.2,
      melhorias: [],
      status: 'primeira'
    },
    {
      id: 4,
      titulo: 'Currículo - Designer UX/UI',
      arquivo: 'curriculo-joao-designer.pdf',
      dataAnalise: '20/12/2023',
      notaGeral: 7.8,
      melhorias: [],
      status: 'anterior'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recente':
        return <Badge className="bg-green-100 text-green-800">Mais Recente</Badge>;
      case 'primeira':
        return <Badge className="bg-blue-100 text-blue-800">Primeira Análise</Badge>;
      default:
        return null;
    }
  };

  const getNotaColor = (nota: number) => {
    if (nota >= 8.5) return 'text-green-600';
    if (nota >= 7.5) return 'text-blue-600';
    if (nota >= 6.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calcularMelhoria = (notaAnterior: number, notaAtual: number) => {
    const diferenca = notaAtual - notaAnterior;
    return diferenca > 0 ? `+${diferenca.toFixed(1)}` : diferenca.toFixed(1);
  };

  const getMelhoriaColor = (diferenca: string) => {
    if (diferenca.startsWith('+')) return 'text-green-600';
    if (diferenca.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  // Calcular estatísticas
  const notaInicial = historico[historico.length - 1]?.notaGeral || 0;
  const notaAtual = historico[0]?.notaGeral || 0;
  const melhoriaTotal = notaAtual - notaInicial;
  const totalAnalises = historico.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Histórico de Análises</h1>
          <p className="text-gray-600 mt-2">Acompanhe a evolução do seu currículo ao longo do tempo</p>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{totalAnalises}</div>
              <div className="text-sm text-gray-600">Total de Análises</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">{notaAtual}</div>
              <div className="text-sm text-gray-600">Nota Atual</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className={`text-2xl font-bold mb-2 ${melhoriaTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {melhoriaTotal >= 0 ? '+' : ''}{melhoriaTotal.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Melhoria Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {Math.ceil((new Date().getTime() - new Date(historico[historico.length - 1]?.dataAnalise.split('/').reverse().join('-')).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-600">Dias de Progresso</div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Evolução */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Evolução das Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simulação de gráfico simples */}
              <div className="flex items-end space-x-2 h-32">
                {historico.slice().reverse().map((item, index) => (
                  <div key={item.id} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t w-full"
                      style={{ height: `${(item.notaGeral / 10) * 100}%` }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      <div className="font-semibold">{item.notaGeral}</div>
                      <div>{item.dataAnalise.split('/')[0]}/{item.dataAnalise.split('/')[1]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Análises */}
        <div className="space-y-6">
          {historico.map((analise, index) => (
            <Card key={analise.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{analise.titulo}</h3>
                      {getStatusBadge(analise.status)}
                    </div>
                    <p className="text-gray-600 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {analise.arquivo}
                    </p>
                    <p className="text-gray-500 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {analise.dataAnalise}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold mb-2 ${getNotaColor(analise.notaGeral)}`}>
                      {analise.notaGeral}
                    </div>
                    {index > 0 && (
                      <div className={`text-sm font-medium ${getMelhoriaColor(calcularMelhoria(historico[index].notaGeral, analise.notaGeral))}`}>
                        {calcularMelhoria(historico[index].notaGeral, analise.notaGeral)} vs anterior
                      </div>
                    )}
                  </div>
                </div>

                {/* Melhorias por categoria */}
                {analise.melhorias.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Evolução por Categoria:</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {analise.melhorias.map((melhoria, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            {melhoria.categoria}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {melhoria.notaAnterior} → {melhoria.notaAtual}
                            </span>
                            <span className={`text-xs font-medium ${getMelhoriaColor(calcularMelhoria(melhoria.notaAnterior, melhoria.notaAtual))}`}>
                              {calcularMelhoria(melhoria.notaAnterior, melhoria.notaAtual)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/resultado-analise/${analise.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        {historico.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mt-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Continue Evoluindo!
            </h2>
            <p className="text-blue-100 mb-6">
              Você já melhorou {melhoriaTotal.toFixed(1)} pontos! Que tal analisar uma versão atualizada do seu currículo?
            </p>
            <Button 
              variant="secondary"
              onClick={() => navigate('/upload-curriculo')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Nova Análise
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historico;
