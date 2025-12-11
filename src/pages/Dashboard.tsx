import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Briefcase,
  TrendingUp,
  Clock,
  Upload,
  Plus,
  Loader2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApiCall } from '../hooks/useApiCall';
import { getRecentAnalyses } from '../services/supabase-api';

const Dashboard = () => {
  const navigate = useNavigate();

  // Agora buscamos as Análises, não apenas os currículos
  const {
    data: analyses,
    loading: isLoading,
    call: fetchData,
  } = useApiCall(getRecentAnalyses);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helpers visuais
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-50';
    if (score >= 7) return 'text-blue-600 bg-blue-50';
    if (score >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Cálculo de estatísticas reais
  const totalAnalises = analyses ? analyses.length : 0;

  const mediaNotas =
    analyses && analyses.length > 0
      ? (
          analyses.reduce((acc, curr) => acc + (curr.score || 0), 0) /
          analyses.length
        ).toFixed(1)
      : '-';

  // CORREÇÃO 1: Alterado de created_at para analysis_date
  const ultimaAnalise =
    analyses && analyses.length > 0
      ? new Date(analyses[0].analysis_date).toLocaleDateString('pt-BR')
      : '-';

  const stats = [
    {
      title: 'Análises Realizadas',
      value: totalAnalises.toString(),
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Vagas Cadastradas',
      value: '0', // Futuro
      icon: Briefcase,
      color: 'text-green-600',
    },
    {
      title: 'Nota Média',
      value: mediaNotas,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Última Atividade',
      value: ultimaAnalise,
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header com Saudação */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Olá, Candidato!</h1>
          <p className="text-gray-600 mt-1">
            Aqui está o resumo da sua evolução profissional.
          </p>
        </div>
        <Button
          onClick={() => navigate('/upload-curriculo')}
          className="shadow-md"
        >
          <Upload className="mr-2 h-4 w-4" />
          Nova Análise
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="border-none shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full bg-opacity-10 ${stat.color.replace(
                      'text-',
                      'bg-',
                    )}`}
                  >
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Coluna Principal: Histórico Recente */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-gray-800">
                Análises Recentes
              </CardTitle>
              {totalAnalises > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600"
                  onClick={() => navigate('/historico')}
                >
                  Ver todas
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                  <p className="text-gray-500">Carregando seus dados...</p>
                </div>
              ) : totalAnalises > 0 ? (
                <div className="space-y-4">
                  {analyses?.map((item) => (
                    <Link
                      to={`/resultado-analise/${item.id}`}
                      key={item.id}
                      className="group block bg-white border rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${getScoreColor(
                              item.score,
                            )}`}
                          >
                            <span className="text-sm font-bold">
                              {item.score}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-700">
                              {item.resumes?.file_name || 'Currículo sem nome'}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                              <Clock className="h-3 w-3" />
                              {/* CORREÇÃO 2: Alterado de created_at para analysis_date */}
                              {formatDate(item.analysis_date)}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* EMPTY STATE AMIGÁVEL */
                <div className="text-center py-10 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                    <Sparkles className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Vamos começar sua jornada?
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Ainda não temos análises registradas. Envie seu currículo
                    agora para receber feedback instantâneo da IA.
                  </p>
                  <Button
                    onClick={() => navigate('/upload-curriculo')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Fazer Primeira Análise
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral: Ações e Dicas */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-400" />
                Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">
                Aumente suas chances alinhando seu CV com vagas reais do
                mercado.
              </p>
              <Button
                variant="secondary"
                className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0"
                onClick={() => navigate('/cadastro-vagas')}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Cadastrar uma Vaga
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Ver Relatórios de Evolução
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
