
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Briefcase, TrendingUp, Clock, Upload, Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Currículos Analisados',
      value: '3',
      change: '+1 este mês',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Vagas Cadastradas',
      value: '5',
      change: '+2 esta semana',
      icon: Briefcase,
      color: 'text-green-600'
    },
    {
      title: 'Nota Média',
      value: '8.4',
      change: '+0.8 melhoria',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Última Análise',
      value: '2 dias',
      change: 'atrás',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const recentAnalyses = [
    {
      id: 1,
      titulo: 'Currículo - Desenvolvedor Frontend',
      data: '15/01/2024',
      nota: 8.5,
      status: 'Concluída'
    },
    {
      id: 2,
      titulo: 'Currículo - Designer UX/UI',
      data: '12/01/2024',
      nota: 7.8,
      status: 'Concluída'
    },
    {
      id: 3,
      titulo: 'Currículo - Gerente de Projetos',
      data: '08/01/2024',
      nota: 8.9,
      status: 'Concluída'
    }
  ];

  const recentJobs = [
    {
      titulo: 'Desenvolvedor React Senior',
      empresa: 'Tech Solutions',
      compatibilidade: 92
    },
    {
      titulo: 'Frontend Developer',
      empresa: 'StartupX',
      compatibilidade: 88
    },
    {
      titulo: 'UX/UI Designer',
      empresa: 'Design Co.',
      compatibilidade: 76
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Acompanhe seu progresso e métricas do currículo</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                size="lg"
                onClick={() => navigate('/upload-curriculo')}
              >
                <Upload className="mr-3 h-5 w-5" />
                Analisar Novo Currículo
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="lg"
                onClick={() => navigate('/cadastro-vagas')}
              >
                <Plus className="mr-3 h-5 w-5" />
                Cadastrar Nova Vaga
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução da Nota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Janeiro 2024</span>
                  <span className="font-semibold">8.4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '84%'}}></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Dezembro 2023</span>
                  <span className="text-green-600">+0.8 melhoria</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Análises Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{analysis.titulo}</p>
                      <p className="text-sm text-gray-500">{analysis.data}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{analysis.nota}</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {analysis.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compatibilidade com Vagas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.map((job, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{job.titulo}</p>
                        <p className="text-sm text-gray-500">{job.empresa}</p>
                      </div>
                      <span className="text-lg font-bold text-purple-600">{job.compatibilidade}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                        style={{width: `${job.compatibilidade}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
