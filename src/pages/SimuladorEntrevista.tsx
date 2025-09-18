
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, AlertTriangle, Play, Star, FileText, Download } from 'lucide-react';
import SimuladorChat from '../components/simulador/SimuladorChat';
import RelatorioSimulacao from '../components/simulador/RelatorioSimulacao';

interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  descricao: string;
  requisitosObrigatorios: string;
  requisitosDesejaveis: string;
}

interface SimulationResult {
  notaGeral: number;
  criterios: {
    clareza: number;
    aderencia: number;
    exemplificacao: number;
    comunicacao: number;
  };
  sugestoes: string[];
  respostas: Array<{
    pergunta: string;
    resposta: string;
    nota: number;
    feedback: string;
  }>;
}

const SimuladorEntrevista = () => {
  const [notaCurriculo] = useState(8.4); // Simula nota do currículo
  const [vagas] = useState<Vaga[]>([
    {
      id: 1,
      titulo: 'Desenvolvedor React Senior',
      empresa: 'Tech Solutions',
      descricao: 'Desenvolvimento de aplicações web modernas...',
      requisitosObrigatorios: 'React, TypeScript, 5+ anos experiência',
      requisitosDesejaveis: 'Next.js, Node.js, AWS'
    },
    {
      id: 2,
      titulo: 'UX/UI Designer',
      empresa: 'Design Studio',
      descricao: 'Criação de interfaces intuitivas...',
      requisitosObrigatorios: 'Figma, Adobe XD, Portfolio',
      requisitosDesejaveis: 'Prototipagem, Design System'
    }
  ]);

  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);
  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false);
  const [simulacaoFinalizada, setSimulacaoFinalizada] = useState(false);
  const [resultadoSimulacao, setResultadoSimulacao] = useState<SimulationResult | null>(null);

  const { toast } = useToast();

  const podeAcessarSimulador = notaCurriculo >= 8.0;

  const iniciarSimulacao = (vaga: Vaga) => {
    setVagaSelecionada(vaga);
    setSimulacaoAtiva(true);
    setSimulacaoFinalizada(false);
    toast({
      title: "Simulação iniciada!",
      description: `Preparando entrevista para ${vaga.titulo}`,
    });
  };

  const finalizarSimulacao = (resultado: SimulationResult) => {
    setResultadoSimulacao(resultado);
    setSimulacaoAtiva(false);
    setSimulacaoFinalizada(true);
    toast({
      title: "Simulação concluída!",
      description: `Nota geral: ${resultado.notaGeral}/10`,
    });
  };

  const voltarParaSelecao = () => {
    setVagaSelecionada(null);
    setSimulacaoAtiva(false);
    setSimulacaoFinalizada(false);
    setResultadoSimulacao(null);
  };

  if (simulacaoAtiva && vagaSelecionada) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <SimuladorChat 
          vaga={vagaSelecionada}
          onFinalizarSimulacao={finalizarSimulacao}
          onVoltar={voltarParaSelecao}
        />
      </div>
    );
  }

  if (simulacaoFinalizada && resultadoSimulacao && vagaSelecionada) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <RelatorioSimulacao 
          vaga={vagaSelecionada}
          resultado={resultadoSimulacao}
          onVoltar={voltarParaSelecao}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="mr-3 h-8 w-8 text-blue-600" />
            Simulador de Entrevista
          </h1>
          <p className="text-gray-600 mt-2">Pratique entrevistas baseadas nas suas vagas cadastradas</p>
        </div>

        {/* Status do Currículo */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span className="text-lg font-semibold">Nota do Currículo:</span>
                  <span className="text-2xl font-bold text-blue-600">{notaCurriculo}</span>
                </div>
                {podeAcessarSimulador ? (
                  <Badge className="bg-green-100 text-green-800">
                    Apto para simulação
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    Nota insuficiente
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Ver Última Análise
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerta se nota insuficiente */}
        {!podeAcessarSimulador && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Seu currículo precisa ter nota mínima de 8.0 para acessar o simulador. 
              Atualize seu currículo e refaça a análise.
            </AlertDescription>
          </Alert>
        )}

        {/* Lista de Vagas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Escolha uma vaga para simular</h2>
          
          {vagas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma vaga cadastrada
                </h3>
                <p className="text-gray-500 mb-4">
                  Você precisa cadastrar vagas primeiro para usar o simulador
                </p>
                <Button onClick={() => window.location.href = '/cadastro-vagas'}>
                  Cadastrar Vagas
                </Button>
              </CardContent>
            </Card>
          ) : (
            vagas.map((vaga) => (
              <Card key={vaga.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {vaga.titulo}
                      </h3>
                      <p className="text-blue-600 font-medium mb-3">{vaga.empresa}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Descrição:</h4>
                          <p className="text-gray-700 text-sm">{vaga.descricao}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Requisitos Obrigatórios:</h4>
                            <p className="text-gray-700 text-sm">{vaga.requisitosObrigatorios}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Requisitos Desejáveis:</h4>
                            <p className="text-gray-700 text-sm">{vaga.requisitosDesejaveis}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <Button 
                        onClick={() => iniciarSimulacao(vaga)}
                        disabled={!podeAcessarSimulador}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Iniciar Simulação
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SimuladorEntrevista;
