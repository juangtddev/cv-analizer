import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Loader2,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { useAnalysisResult } from '@/hooks/useAnalysisResult';
import { parseAiOutput } from '@/utils/ai-parser';
import { AnalysisData } from '@/types/';

// Bibliotecas para PDF
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResultadoAnalise = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Ref para capturar o conteúdo do relatório
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: analysisData, isLoading, isError } = useAnalysisResult(id);

  // --- FUNÇÃO PARA GERAR PDF ---
  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    try {
      setIsDownloading(true);

      const element = contentRef.current;

      // Captura o elemento como uma imagem (canvas)
      const canvas = await html2canvas(element, {
        scale: 2, // Melhora a resolução
        useCORS: true, // Ajuda se tiver imagens externas
        logging: false,
        backgroundColor: '#f9fafb', // Garante o fundo cinza claro original
      });

      const imgData = canvas.toDataURL('image/png');

      // Configuração do PDF (A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calcula a proporção para caber na página
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0; // Começa do topo

      // Se o conteúdo for muito longo, o ideal seria quebrar páginas,
      // mas para este layout, vamos ajustar ao tamanho (fit) ou criar uma página longa.
      // Aqui usamos a estratégia de "Fit Width" que é mais comum para relatórios web.
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeightCalculated = (imgProps.height * pdfWidth) / imgProps.width;

      // Se for maior que uma página A4, ajustamos a altura do PDF
      if (pdfHeightCalculated > pdfHeight) {
        // Opcional: Criar PDF com altura customizada para não cortar nada
        const longPdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeightCalculated]);
        longPdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeightCalculated);
        longPdf.save(
          `analise-curriculo-${
            analysisData?.resumes?.file_name || 'report'
          }.pdf`,
        );
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeightCalculated);
        pdf.save(
          `analise-curriculo-${
            analysisData?.resumes?.file_name || 'report'
          }.pdf`,
        );
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Carregando inteligência...</p>
      </div>
    );
  }

  if (isError || !analysisData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <p className="text-gray-800 font-medium">
            Não foi possível carregar a análise.
          </p>
          <Button variant="link" onClick={() => navigate('/upload-curriculo')}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const report: AnalysisData = parseAiOutput(analysisData.report_json);

  const fileMeta = {
    nomeArquivo: analysisData.resumes?.file_name || 'Currículo',
    dataAnalise: analysisData.analysis_date
      ? new Date(analysisData.analysis_date).toLocaleDateString('pt-BR')
      : 'Data desconhecida',
  };

  const getScoreColor = (score: number) => {
    if (score >= 9)
      return { text: 'text-green-600', bg: 'bg-green-500', label: 'Excelente' };
    if (score >= 7)
      return { text: 'text-blue-600', bg: 'bg-blue-500', label: 'Bom' };
    if (score >= 5)
      return { text: 'text-yellow-600', bg: 'bg-yellow-500', label: 'Regular' };
    return { text: 'text-red-600', bg: 'bg-red-500', label: 'Atenção' };
  };

  const getPriorityBadge = (prioridade: string) => {
    const p = prioridade.toLowerCase();
    if (p === 'alta')
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Alta Prioridade
        </Badge>
      );
    if (p === 'média' || p === 'media')
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Média Prioridade
        </Badge>
      );
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Baixa Prioridade
      </Badge>
    );
  };

  const categoriesList = [
    { label: 'Estrutura e Formatação', data: report.categorias.estrutura },
    { label: 'Palavras-chave', data: report.categorias.palavrasChave },
    { label: 'Experiência Relevante', data: report.categorias.experiencia },
    { label: 'Clareza e Objetividade', data: report.categorias.clareza },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* ADICIONAMOS A REF NESTE CONTAINER 
          Tudo que estiver aqui dentro sairá no PDF 
      */}
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        ref={contentRef}
      >
        {/* --- HEADER --- */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Resultado da Análise
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> {fileMeta.nomeArquivo}
              </span>
              <span>• {fileMeta.dataAnalise}</span>
            </div>

            {(report.nome || report.email) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {report.nome && (
                  <Badge variant="outline" className="gap-1 font-normal">
                    <User className="h-3 w-3" /> {report.nome}
                  </Badge>
                )}
                {report.email && (
                  <Badge variant="outline" className="gap-1 font-normal">
                    <Mail className="h-3 w-3" /> {report.email}
                  </Badge>
                )}
                {report.telefone && (
                  <Badge variant="outline" className="gap-1 font-normal">
                    <Phone className="h-3 w-3" /> {report.telefone}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* IMPORTANTE: data-html2canvas-ignore="true" 
            Isso faz com que os botões NÃO apareçam no PDF gerado.
          */}
          <div className="flex gap-3" data-html2canvas-ignore="true">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isDownloading ? 'Gerando...' : 'PDF'}
            </Button>
            <Button size="sm" onClick={() => navigate('/upload-curriculo')}>
              <FileText className="mr-2 h-4 w-4" /> Nova Análise
            </Button>
          </div>
        </div>

        {/* --- SCORE CARD GERAL --- */}
        <Card className="mb-8 border-none shadow-md bg-gradient-to-r from-blue-50 via-white to-purple-50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Nota Geral
              </span>
              <div
                className={`text-6xl font-bold mb-2 ${
                  getScoreColor(report.notaGeral).text
                }`}
              >
                {report.notaGeral}
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(10)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(report.notaGeral)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              <p className="text-lg text-gray-700 max-w-2xl italic">
                "{report.resumo}"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* --- CATEGORIAS (GRID) --- */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {categoriesList.map((cat, index) => {
            const style = getScoreColor(cat.data.nota);
            return (
              <Card
                key={index}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">{cat.label}</h3>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${style.text}`}>
                        {cat.data.nota}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">/10</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full ${style.bg}`}
                      style={{
                        width: `${cat.data.nota * 10}%`,
                        transition: 'width 1s ease-in-out',
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-600">{cat.data.comentario}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* --- PONTOS FORTES E MELHORIA --- */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700 text-lg">
                <CheckCircle className="mr-2 h-5 w-5" /> Pontos Fortes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {report.pontosFortes.map((ponto, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700 text-lg">
                <AlertCircle className="mr-2 h-5 w-5" /> Pontos de Atenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {report.pontosMelhoria.map((ponto, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* --- PLANO DE AÇÃO --- */}
        <Card className="border-t-4 border-t-blue-600 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <TrendingUp className="mr-2 h-6 w-6 text-blue-600" />
              Plano de Ação Recomendado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.planoAcao.map((acao, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm border transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{acao.titulo}</h4>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        {acao.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{acao.descricao}</p>
                  </div>
                  <div className="flex-shrink-0 self-start sm:self-center">
                    {getPriorityBadge(acao.prioridade)}
                  </div>
                </div>
              ))}

              {report.planoAcao.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhuma ação específica sugerida pela IA.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- FOOTER CTA (IGNORADO NO PDF) --- */}
        <div
          className="mt-12 text-center bg-slate-900 rounded-xl p-8 shadow-lg"
          data-html2canvas-ignore="true"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Pronto para evoluir?
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Aplique as correções sugeridas no plano de ação e submeta seu
            currículo novamente.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              className="bg-white text-slate-900 hover:bg-gray-100"
              onClick={() => navigate('/upload-curriculo')}
            >
              Analisar Nova Versão
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoAnalise;
