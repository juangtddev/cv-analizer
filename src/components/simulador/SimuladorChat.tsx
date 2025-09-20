
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Bot, User, Star, Clock } from 'lucide-react';

interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  descricao: string;
  requisitosObrigatorios: string;
  requisitosDesejaveis: string;
}

interface Pergunta {
  id: number;
  texto: string;
  timestamp: Date;
}

interface Resposta {
  perguntaId: number;
  texto: string;
  nota: number;
  feedback: string;
  timestamp: Date;
}

interface SimuladorChatProps {
  vaga: Vaga;
  onFinalizarSimulacao: (resultado: any) => void;
  onVoltar: () => void;
}

const SimuladorChat = ({ vaga, onFinalizarSimulacao, onVoltar }: SimuladorChatProps) => {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostaAtual, setRespostaAtual] = useState('');
  const [aguardandoResposta, setAguardandoResposta] = useState(false);
  const [simulacaoIniciada, setSimulacaoIniciada] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const perguntasSimulacao = [
    `Conte-me sobre sua experiência com ${vaga.requisitosObrigatorios.split(',')[0]} e como ela se relaciona com esta vaga.`,
    `Descreva um projeto desafiador que você trabalhou e como superou as dificuldades.`,
    `Como você se mantém atualizado com as tecnologias mencionadas nos requisitos desta vaga?`,
    `Fale sobre uma situação onde você teve que trabalhar em equipe para resolver um problema complexo.`,
    `Quais são seus objetivos profissionais e como esta vaga se alinha com eles?`
  ];

  useEffect(() => {
    if (!simulacaoIniciada) {
      iniciarSimulacao();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [perguntas, respostas]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const iniciarSimulacao = () => {
    const primeiraPergunta: Pergunta = {
      id: 1,
      texto: `Olá! Vamos começar a simulação de entrevista para a vaga de ${vaga.titulo} na ${vaga.empresa}. ${perguntasSimulacao[0]}`,
      timestamp: new Date()
    };
    
    setPerguntas([primeiraPergunta]);
    setSimulacaoIniciada(true);
    setAguardandoResposta(true);
  };

  const enviarResposta = () => {
    if (!respostaAtual.trim()) return;

    const novaResposta: Resposta = {
      perguntaId: perguntas[perguntaAtual].id,
      texto: respostaAtual,
      nota: gerarNota(respostaAtual),
      feedback: gerarFeedback(respostaAtual),
      timestamp: new Date()
    };

    setRespostas(prev => [...prev, novaResposta]);
    setRespostaAtual('');
    setAguardandoResposta(false);

    // Próxima pergunta após um delay
    setTimeout(() => {
      proximaPergunta();
    }, 2000);
  };

  const proximaPergunta = () => {
    if (perguntaAtual + 1 < perguntasSimulacao.length) {
      const proximaPerg: Pergunta = {
        id: perguntaAtual + 2,
        texto: perguntasSimulacao[perguntaAtual + 1],
        timestamp: new Date()
      };
      
      setPerguntas(prev => [...prev, proximaPerg]);
      setPerguntaAtual(prev => prev + 1);
      setAguardandoResposta(true);
    } else {
      finalizarSimulacao();
    }
  };

  const gerarNota = (resposta: string): number => {
    // Lógica simples para gerar nota baseada no tamanho e palavras-chave
    let nota = 5;
    
    if (resposta.length > 100) nota += 1;
    if (resposta.length > 200) nota += 1;
    if (resposta.toLowerCase().includes('experiência')) nota += 0.5;
    if (resposta.toLowerCase().includes('projeto')) nota += 0.5;
    if (resposta.toLowerCase().includes('equipe')) nota += 0.5;
    if (resposta.toLowerCase().includes('desafio')) nota += 0.5;
    
    return Math.min(Math.round(nota * 10) / 10, 10);
  };

  const gerarFeedback = (resposta: string): string => {
    const feedbacks = [
      "Boa resposta! Tente adicionar mais exemplos específicos.",
      "Resposta clara e objetiva. Muito bem!",
      "Interessante perspectiva. Poderia detalhar mais a solução?",
      "Excelente uso de exemplos práticos!",
      "Resposta um pouco genérica. Traga mais detalhes específicos."
    ];
    
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const finalizarSimulacao = () => {
    const notaGeral = respostas.reduce((acc, resp) => acc + resp.nota, 0) / respostas.length;
    
    const resultado = {
      notaGeral: Math.round(notaGeral * 10) / 10,
      criterios: {
        clareza: Math.round((notaGeral * 0.9) * 10) / 10,
        aderencia: Math.round((notaGeral * 1.1) * 10) / 10,
        exemplificacao: Math.round((notaGeral * 0.8) * 10) / 10,
        comunicacao: Math.round((notaGeral * 1.0) * 10) / 10
      },
      sugestoes: [
        "Prepare mais exemplos específicos de projetos",
        "Pratique respostas mais estruturadas",
        "Demonstre conhecimento técnico com exemplos práticos"
      ],
      respostas: respostas.map((resp, index) => ({
        pergunta: perguntas[index]?.texto || '',
        resposta: resp.texto,
        nota: resp.nota,
        feedback: resp.feedback
      }))
    };

    onFinalizarSimulacao(resultado);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarResposta();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onVoltar}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{vaga.titulo}</h1>
              <p className="text-gray-600">{vaga.empresa}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              Pergunta {perguntaAtual + 1} de {perguntasSimulacao.length}
            </Badge>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Em andamento</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Principal */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="mr-2 h-5 w-5 text-blue-600" />
                Simulação de Entrevista
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {perguntas.map((pergunta, index) => (
                    <div key={pergunta.id}>
                      {/* Pergunta da IA */}
                      <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 rounded-lg p-3 mr-4 max-w-[80%]">
                          <div className="flex items-start space-x-2">
                            <Bot className="h-4 w-4 mt-1 text-blue-600" />
                            <div>
                              <div className="text-sm">{pergunta.texto}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {pergunta.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resposta do usuário */}
                      {respostas[index] && (
                        <div className="flex justify-end mb-4">
                          <div className="bg-blue-600 text-white rounded-lg p-3 ml-4 max-w-[80%]">
                            <div className="flex items-start space-x-2">
                              <User className="h-4 w-4 mt-1" />
                              <div>
                                <div className="text-sm">{respostas[index].texto}</div>
                                <div className="text-xs text-blue-100 mt-1">
                                  {respostas[index].timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Feedback */}
                      {respostas[index] && (
                        <div className="flex justify-start mb-4">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mr-4 max-w-[80%]">
                            <div className="flex items-start space-x-2">
                              <Star className="h-4 w-4 mt-1 text-green-600" />
                              <div>
                                <div className="text-sm font-medium text-green-800">
                                  Nota: {respostas[index].nota}/10
                                </div>
                                <div className="text-sm text-green-700">
                                  {respostas[index].feedback}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input de resposta */}
              {aguardandoResposta && (
                <div className="border-t p-4">
                  <div className="flex space-x-4">
                    <Textarea
                      value={respostaAtual}
                      onChange={(e) => setRespostaAtual(e.target.value)}
                      placeholder="Digite sua resposta aqui..."
                      onKeyPress={handleKeyPress}
                      rows={3}
                      className="flex-1"
                    />
                    <Button 
                      onClick={enviarResposta}
                      disabled={!respostaAtual.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Pressione Enter para enviar ou Shift+Enter para nova linha
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Progresso */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Perguntas respondidas:</span>
                  <span className="font-medium">{respostas.length}/{perguntasSimulacao.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${(respostas.length / perguntasSimulacao.length) * 100}%`}}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use exemplos específicos de projetos reais</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Seja claro e objetivo em suas respostas</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Demonstre conhecimento técnico quando relevante</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Mostre como você resolve problemas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Vaga */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vaga</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Requisitos Principais:</p>
                  <p className="text-gray-600">{vaga.requisitosObrigatorios}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Requisitos Desejáveis:</p>
                  <p className="text-gray-600">{vaga.requisitosDesejaveis}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimuladorChat;
