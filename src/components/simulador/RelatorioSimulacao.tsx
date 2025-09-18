
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Star, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
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

interface RelatorioSimulacaoProps {
  vaga: Vaga;
  resultado: SimulationResult;
  onVoltar: () => void;
}

const RelatorioSimulacao = ({ vaga, resultado, onVoltar }: RelatorioSimulacaoProps) => {
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const getNotaColor = (nota: number) => {
    if (nota >= 8.5) return 'text-green-600';
    if (nota >= 7) return 'text-blue-600';
    if (nota >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNotaColorBg = (nota: number) => {
    if (nota >= 8.5) return 'bg-green-100';
    if (nota >= 7) return 'bg-blue-100';
    if (nota >= 5) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const downloadPDF = async () => {
    setDownloadingPDF(true);
    // Simula download
    setTimeout(() => {
      setDownloadingPDF(false);
      // Aqui seria implementada a lógica real de geração de PDF
      console.log('Relatório PDF baixado');
    }, 2000);
  };

  const criteriosData = [
    { nome: 'Clareza', valor: resultado.criterios.clareza, descricao: 'Capacidade de se expressar de forma clara e compreensível' },
    { nome: 'Aderência à Vaga', valor: resultado.criterios.aderencia, descricao: 'Alinhamento das respostas com os requisitos da vaga' },
    { nome: 'Exemplificação', valor: resultado.criterios.exemplificacao, descricao: 'Uso de exemplos práticos e específicos' },
    { nome: 'Comunicação', valor: resultado.criterios.comunicacao, descricao: 'Habilidade de comunicação e estruturação das ideias' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onVoltar}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatório da Simulação</h1>
              <p className="text-gray-600 mt-1">
                {vaga.titulo} • {vaga.empresa} • {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <Button onClick={downloadPDF} disabled={downloadingPDF}>
            <Download className="mr-2 h-4 w-4" />
            {downloadingPDF ? 'Gerando PDF...' : 'Baixar Relatório PDF'}
          </Button>
        </div>
      </div>

      {/* Nota Geral */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className={`text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2`}>
                {resultado.notaGeral}
              </div>
              <div className="text-2xl font-semibold text-gray-700 mb-2">Nota Geral da Simulação</div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-6 w-6 ${i < Math.floor(resultado.notaGeral / 2) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <Badge className={`text-lg px-4 py-2 ${getNotaColorBg(resultado.notaGeral)} ${getNotaColor(resultado.notaGeral)}`}>
                {resultado.notaGeral >= 8.5 ? 'Excelente' : 
                 resultado.notaGeral >= 7 ? 'Bom' : 
                 resultado.notaGeral >= 5 ? 'Regular' : 'Precisa melhorar'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critérios Detalhados */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Análise por Critério
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {criteriosData.map((criterio, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{criterio.nome}</h3>
                    <p className="text-sm text-gray-600 mt-1">{criterio.descricao}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getNotaColor(criterio.valor)}`}>
                      {criterio.valor}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                    style={{width: `${criterio.valor * 10}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Respostas Detalhadas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Respostas e Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {resultado.respostas.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-400 pl-6 py-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Pergunta {index + 1}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${getNotaColor(item.nota)}`}>
                      {item.nota}
                    </span>
                    <span className="text-gray-500">/10</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-800 mb-2">Pergunta:</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{item.pergunta}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-800 mb-2">Sua Resposta:</p>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{item.resposta}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-800 mb-2">Feedback:</p>
                    <div className="flex items-start space-x-3 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-green-800">{item.feedback}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sugestões de Melhoria */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Sugestões de Melhoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resultado.sugestoes.map((sugestao, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-orange-800">{sugestao}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Continue praticando para melhorar!
        </h2>
        <p className="text-blue-100 mb-6">
          Pratique mais simulações com diferentes vagas para aperfeiçoar suas habilidades de entrevista.
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="secondary" onClick={onVoltar}>
            Nova Simulação
          </Button>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
            Ver Histórico
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RelatorioSimulacao;
