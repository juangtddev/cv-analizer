import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  TrendingUp,
  Download,
  Eye,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useApiCall } from '../hooks/useApiCall'; // Ajuste o caminho conforme sua estrutura
import { getAnalysisHistory } from '../services/supabase-api'; // Ajuste o caminho

const Historico = () => {
  const navigate = useNavigate();

  const {
    data: analyses,
    loading,
    error,
    call: fetchHistory,
  } = useApiCall(getAnalysisHistory);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Helpers de Formatação e UI
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getNotaColor = (nota: number) => {
    if (nota >= 9) return 'text-green-600';
    if (nota >= 7) return 'text-blue-600';
    if (nota >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (index: number, total: number) => {
    if (index === 0) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Mais Recente
        </Badge>
      );
    }
    if (index === total - 1) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          Primeira Versão
        </Badge>
      );
    }
    return <Badge variant="secondary">Anterior</Badge>;
  };

  const calcularDiferenca = (notaAtual: number, notaAnterior: number) => {
    const diff = notaAtual - notaAnterior;
    const sinal = diff > 0 ? '+' : '';
    return `${sinal}${diff.toFixed(1)}`;
  };

  // --- CÁLCULOS ESTATÍSTICOS ---
  // Se não houver dados, zeramos tudo para evitar erros
  const totalAnalises = analyses?.length || 0;

  // Nota Atual (A mais recente, índice 0)
  const notaAtual = totalAnalises > 0 ? analyses![0].score : 0;

  // Nota Inicial (A mais antiga, último índice)
  const notaInicial =
    totalAnalises > 0 ? analyses![totalAnalises - 1].score : 0;

  // Melhoria Total
  const melhoriaTotal = notaAtual - notaInicial;

  // Dias de Progresso
  const diasProgresso =
    totalAnalises > 0
      ? Math.ceil(
          (new Date().getTime() -
            new Date(analyses![totalAnalises - 1].analysis_date).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500">Carregando seu histórico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Erro ao carregar histórico.</p>
          <Button variant="outline" className="mt-4" onClick={fetchHistory}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Histórico de Análises
            </h1>
            <p className="text-gray-600 mt-2">
              Acompanhe a evolução do seu currículo ao longo do tempo
            </p>
          </div>
          <Button onClick={() => navigate('/upload-curriculo')}>
            Nova Análise
          </Button>
        </div>

        {totalAnalises === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mb-4">
                <FileText className="h-12 w-12 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Nenhuma análise encontrada
              </h3>
              <p className="text-gray-500 mb-6">
                Faça o upload do seu primeiro currículo para ver o histórico.
              </p>
              <Button onClick={() => navigate('/upload-curriculo')}>
                Começar Agora
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Estatísticas */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {totalAnalises}
                  </div>
                  <div className="text-sm text-gray-600">Total de Análises</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {notaAtual}
                  </div>
                  <div className="text-sm text-gray-600">Nota Atual</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div
                    className={`text-2xl font-bold mb-2 ${
                      melhoriaTotal >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {melhoriaTotal > 0 ? '+' : ''}
                    {melhoriaTotal.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Melhoria Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {diasProgresso}
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
                  {/* Gráfico Simples com CSS */}
                  <div className="flex items-end space-x-2 h-40 pb-2 border-b border-gray-100">
                    {/* Precisamos reverter o array para o gráfico mostrar do antigo para o novo */}
                    {[...analyses!].reverse().map((item) => (
                      <div
                        key={item.id}
                        className="flex-1 flex flex-col items-center group relative"
                      >
                        {/* Tooltip ao passar o mouse */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                          Nota: {item.score} • {formatDate(item.analysis_date)}
                        </div>

                        <div
                          className="bg-blue-500 rounded-t w-full max-w-[40px] hover:bg-blue-600 transition-all cursor-pointer"
                          style={{ height: `${(item.score / 10) * 100}%` }}
                        ></div>
                        <div className="text-[10px] text-gray-500 mt-2 text-center truncate w-full px-1">
                          {formatDate(item.analysis_date).split('/')[0]}/
                          {formatDate(item.analysis_date).split('/')[1]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Análises */}
            <div className="space-y-6">
              {analyses?.map((analise, index) => {
                // Cálculo dinâmico da comparação com o anterior
                // O "anterior" é o index + 1, pois a lista está ordenada por data DESC
                const analiseAnterior = analyses[index + 1];
                const diferenca = analiseAnterior
                  ? calcularDiferenca(analise.score, analiseAnterior.score)
                  : null;
                const temMelhoria =
                  analiseAnterior && analise.score >= analiseAnterior.score;

                return (
                  <Card
                    key={analise.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
                    onClick={() => navigate(`/resultado-analise/${analise.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {analise.resumes?.file_name ||
                                'Currículo sem nome'}
                            </h3>
                            {getStatusBadge(index, totalAnalises)}
                          </div>

                          <p className="text-gray-500 flex items-center mt-1 text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Realizada em {formatDate(analise.analysis_date)}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          {/* Badge de comparação com a anterior */}
                          {diferenca && (
                            <div className="text-right">
                              <span
                                className={`text-sm font-bold px-2 py-1 rounded ${
                                  temMelhoria
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {diferenca} pts
                              </span>
                              <p className="text-xs text-gray-400 mt-1">
                                vs anterior
                              </p>
                            </div>
                          )}

                          <div className="text-right">
                            <div
                              className={`text-4xl font-bold ${getNotaColor(
                                analise.score,
                              )}`}
                            >
                              {analise.score}
                            </div>
                            <p className="text-xs text-gray-500 uppercase font-medium mt-1">
                              Nota Geral
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-4 border-t mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 p-0 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/resultado-analise/${analise.id}`);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes Completos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mt-8 text-center shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">
                Continue Evoluindo!
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                {melhoriaTotal > 0
                  ? `Você já melhorou ${melhoriaTotal.toFixed(
                      1,
                    )} pontos desde o início! `
                  : 'Mantenha a constância. '}
                Que tal aplicar as sugestões da última análise e subir uma nova
                versão?
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="font-semibold"
                onClick={() => navigate('/upload-curriculo')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Nova Análise
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Historico;
