
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Link as LinkIcon, Check, Loader2 } from 'lucide-react';

const UploadCurriculo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Formato não suportado",
          description: "Apenas arquivos PDF, DOC e DOCX são aceitos.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      setUploadStep(2);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo para análise.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulação de análise - substituir por API real
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Análise concluída!",
        description: "Seu currículo foi analisado com sucesso.",
      });
      navigate('/resultado-analise/1');
    }, 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload de Currículo</h1>
          <p className="text-gray-600 mt-2">Envie seu currículo para análise detalhada por IA</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${uploadStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className="text-white text-sm font-medium">1</span>
              </div>
              <span className="ml-2 font-medium">Upload</span>
            </div>
            <div className={`w-16 h-1 ${uploadStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${uploadStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className="text-white text-sm font-medium">2</span>
              </div>
              <span className="ml-2 font-medium">Informações</span>
            </div>
            <div className={`w-16 h-1 ${uploadStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${uploadStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className="text-white text-sm font-medium">3</span>
              </div>
              <span className="ml-2 font-medium">Análise</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Enviar Arquivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {selectedFile ? selectedFile.name : 'Clique para selecionar arquivo'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedFile 
                      ? `${formatFileSize(selectedFile.size)} • ${selectedFile.type}`
                      : 'PDF, DOC, DOCX (máx. 5MB)'
                    }
                  </p>
                </div>
                
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile && (
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-800">Arquivo carregado com sucesso!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="mr-2 h-5 w-5" />
                LinkedIn (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do seu perfil LinkedIn
                  </label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/seu-perfil"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Dica:</strong> Adicionar seu LinkedIn pode enriquecer a análise 
                    com informações adicionais sobre suas conexões e recomendações.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Iniciar Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nossa IA analisará:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Estrutura e formatação
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Palavras-chave relevantes
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Experiências e habilidades
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Aderência às vagas
                    </li>
                  </ul>
                </div>
              </div>

              <Button 
                onClick={handleAnalyze}
                size="lg"
                className="w-full"
                disabled={!selectedFile || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando... (isso pode levar alguns minutos)
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Analisar Currículo
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Nossa IA está processando seu currículo. Você receberá uma notificação quando a análise estiver pronta.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadCurriculo;
