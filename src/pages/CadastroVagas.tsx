
import { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Briefcase, MapPin, Edit, Trash2 } from 'lucide-react';

interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  descricao: string;
  requisitosObrigatorios: string;
  requisitosDesejaveis: string;
  localidade: string;
  dataCadastro: string;
}

const CadastroVagas = () => {
  const [vagas, setVagas] = useState<Vaga[]>([
    {
      id: 1,
      titulo: 'Desenvolvedor React Senior',
      empresa: 'Tech Solutions',
      descricao: 'Desenvolvimento de aplicações web modernas...',
      requisitosObrigatorios: 'React, TypeScript, 5+ anos experiência',
      requisitosDesejaveis: 'Next.js, Node.js, AWS',
      localidade: 'São Paulo, SP - Híbrido',
      dataCadastro: '15/01/2024'
    },
    {
      id: 2,
      titulo: 'UX/UI Designer',
      empresa: 'Design Studio',
      descricao: 'Criação de interfaces intuitivas e experiências...',
      requisitosObrigatorios: 'Figma, Adobe XD, Portfolio',
      requisitosDesejaveis: 'Prototipagem, Design System',
      localidade: 'Remote',
      dataCadastro: '12/01/2024'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    empresa: '',
    descricao: '',
    requisitosObrigatorios: '',
    requisitosDesejaveis: '',
    localidade: ''
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVaga) {
      // Editar vaga existente
      setVagas(prev => prev.map(vaga => 
        vaga.id === editingVaga.id 
          ? { ...vaga, ...formData }
          : vaga
      ));
      toast({
        title: "Vaga atualizada!",
        description: "As informações da vaga foram atualizadas com sucesso.",
      });
    } else {
      // Criar nova vaga
      const novaVaga: Vaga = {
        id: Date.now(),
        ...formData,
        dataCadastro: new Date().toLocaleDateString('pt-BR')
      };
      setVagas(prev => [...prev, novaVaga]);
      toast({
        title: "Vaga cadastrada!",
        description: "Nova vaga foi adicionada com sucesso.",
      });
    }

    // Reset form
    setFormData({
      titulo: '',
      empresa: '',
      descricao: '',
      requisitosObrigatorios: '',
      requisitosDesejaveis: '',
      localidade: ''
    });
    setShowForm(false);
    setEditingVaga(null);
  };

  const handleEdit = (vaga: Vaga) => {
    setEditingVaga(vaga);
    setFormData({
      titulo: vaga.titulo,
      empresa: vaga.empresa,
      descricao: vaga.descricao,
      requisitosObrigatorios: vaga.requisitosObrigatorios,
      requisitosDesejaveis: vaga.requisitosDesejaveis,
      localidade: vaga.localidade
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setVagas(prev => prev.filter(vaga => vaga.id !== id));
    toast({
      title: "Vaga removida",
      description: "A vaga foi removida da sua lista.",
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVaga(null);
    setFormData({
      titulo: '',
      empresa: '',
      descricao: '',
      requisitosObrigatorios: '',
      requisitosDesejaveis: '',
      localidade: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Vagas</h1>
            <p className="text-gray-600 mt-2">Gerencie as vagas de seu interesse</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Vaga
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <Card className="mb-8 border-2 border-blue-200">
            <CardHeader>
              <CardTitle>
                {editingVaga ? 'Editar Vaga' : 'Cadastrar Nova Vaga'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Vaga *
                    </label>
                    <Input
                      value={formData.titulo}
                      onChange={(e) => handleInputChange('titulo', e.target.value)}
                      placeholder="Ex: Desenvolvedor Frontend"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empresa *
                    </label>
                    <Input
                      value={formData.empresa}
                      onChange={(e) => handleInputChange('empresa', e.target.value)}
                      placeholder="Nome da empresa"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Vaga *
                  </label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    placeholder="Descreva as principais responsabilidades e atividades..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requisitos Obrigatórios *
                  </label>
                  <Textarea
                    value={formData.requisitosObrigatorios}
                    onChange={(e) => handleInputChange('requisitosObrigatorios', e.target.value)}
                    placeholder="Liste os requisitos essenciais separados por vírgula..."
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requisitos Desejáveis
                  </label>
                  <Textarea
                    value={formData.requisitosDesejaveis}
                    onChange={(e) => handleInputChange('requisitosDesejaveis', e.target.value)}
                    placeholder="Liste os requisitos desejáveis separados por vírgula..."
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localidade
                  </label>
                  <Input
                    value={formData.localidade}
                    onChange={(e) => handleInputChange('localidade', e.target.value)}
                    placeholder="Ex: São Paulo, SP - Presencial"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="submit">
                    {editingVaga ? 'Atualizar Vaga' : 'Cadastrar Vaga'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Vagas List */}
        <div className="space-y-6">
          {vagas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma vaga cadastrada
                </h3>
                <p className="text-gray-500 mb-4">
                  Cadastre vagas de seu interesse para comparar com seu currículo
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeira Vaga
                </Button>
              </CardContent>
            </Card>
          ) : (
            vagas.map((vaga) => (
              <Card key={vaga.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {vaga.titulo}
                      </h3>
                      <p className="text-blue-600 font-medium">{vaga.empresa}</p>
                      {vaga.localidade && (
                        <p className="text-gray-500 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {vaga.localidade}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(vaga)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(vaga.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

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
                      {vaga.requisitosDesejaveis && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Requisitos Desejáveis:</h4>
                          <p className="text-gray-700 text-sm">{vaga.requisitosDesejaveis}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-sm text-gray-500">
                        Cadastrada em {vaga.dataCadastro}
                      </span>
                      <Button variant="outline" size="sm">
                        Comparar com Currículo
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

export default CadastroVagas;
