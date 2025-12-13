import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUpdateUserProfile } from '@/hooks/useUpdateUserProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { useCancelSubscription } from '@/hooks/useCancelSubscription'; // <--- NOVO HOOK
import { UserProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Link as LinkIcon,
  MapPin,
  Settings,
  Save,
  Loader2,
  Crown,
  Sparkles,
  AlertTriangle,
  CalendarOff,
} from 'lucide-react';

// Componentes de Alerta (Certifique-se de ter instalado ou ajuste para o seu Dialog)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Perfil = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const { mutateAsync: updateUser, isPending: isUpdating } =
    useUpdateUserProfile();
  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscription();
  const { mutate: cancelSubscription, isPending: isCanceling } =
    useCancelSubscription(); // <--- USO DO HOOK

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: userProfile?.nome || '',
    email: userProfile?.email || '',
    telefone: '',
    linkedin: '',
    portfolio: '',
    localizacao: '',
    bio: '',
    preferenciasAnalise: 'tecnologia',
    notificacoes: true,
  });

  const isPremium = subscription?.subscribed;
  // Verifica se o cancelamento já foi agendado
  const isCanceled = subscription?.cancel_at_period_end; 

  useEffect(() => {
    if (userProfile) {
      setFormData({
        nome: userProfile.nome,
        email: userProfile.email,
        telefone: userProfile.telefone || '',
        linkedin: userProfile.linkedin || '',
        portfolio: userProfile.portfolio || '',
        localizacao: userProfile.localizacao || '',
        bio: userProfile.bio || '',
        preferenciasAnalise: 'tecnologia',
        notificacoes: true,
      });
    }
  }, [userProfile]);

  const handleInputChange = (
    field: keyof UserProfile | string,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUser(formData as unknown as UserProfile);
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleCancelSubscription = () => {
    cancelSubscription(undefined, {
      onSuccess: () => {
        toast({
          title: 'Assinatura cancelada',
          description: 'Sua assinatura não será renovada ao final do período.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Erro ao cancelar',
          description:
            'Não foi possível cancelar a assinatura. Tente novamente.',
          variant: 'destructive',
        });
      },
    });
  };

  if (isLoadingProfile || isLoadingSubscription) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    { label: 'Currículos Analisados', value: '8' },
    { label: 'Vagas Cadastradas', value: '12' },
    { label: 'Nota Média Atual', value: '8.4' },
    { label: 'Melhoria Total', value: '+1.2' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... Header e Stats mantidos iguais ... */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={isEditing ? 'bg-green-600 hover:bg-green-700' : ''}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Editar Perfil
              </>
            )}
          </Button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informações Pessoais - Mantido igual */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <Input
                      value={formData.nome}
                      onChange={(e) =>
                        handleInputChange('nome', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        value={formData.email}
                        disabled={true}
                        className="pl-10 bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        value={formData.telefone}
                        onChange={(e) =>
                          handleInputChange('telefone', e.target.value)
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localização
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        value={formData.localizacao}
                        onChange={(e) =>
                          handleInputChange('localizacao', e.target.value)
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio Profissional
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="mr-2 h-5 w-5" />
                  Links Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) =>
                      handleInputChange('linkedin', e.target.value)
                    }
                    disabled={!isEditing}
                    type="url"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio/Site Pessoal
                  </label>
                  <Input
                    value={formData.portfolio}
                    onChange={(e) =>
                      handleInputChange('portfolio', e.target.value)
                    }
                    disabled={!isEditing}
                    type="url"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Análise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foco Principal
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.preferenciasAnalise}
                    onChange={(e) =>
                      handleInputChange('preferenciasAnalise', e.target.value)
                    }
                    disabled={!isEditing}
                  >
                    <option value="tecnologia">Tecnologia</option>
                    <option value="design">Design</option>
                    <option value="gestao">Gestão</option>
                    <option value="vendas">Vendas</option>
                    <option value="marketing">Marketing</option>
                    <option value="geral">Geral</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="notificacoes"
                    checked={formData.notificacoes}
                    onChange={(e) =>
                      handleInputChange('notificacoes', e.target.checked)
                    }
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label
                    htmlFor="notificacoes"
                    className="text-sm text-gray-700"
                  >
                    Receber notificações por e-mail
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* --- CARD DE PLANO ATUALIZADO --- */}
            <Card
              className={`border-2 ${
                isPremium
                  ? 'border-yellow-400 bg-yellow-50/30'
                  : 'border-gray-200'
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown
                    className={`h-5 w-5 ${
                      isPremium
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-400'
                    }`}
                  />
                  Plano Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold mb-2 ${
                      isPremium ? 'text-yellow-600' : 'text-blue-600'
                    }`}
                  >
                    {isPremium ? 'Premium' : 'Gratuito'}
                  </div>

                  {isPremium ? (
                    <div className="space-y-4">
                      {isCanceled ? (
                        <div className="bg-orange-100 text-orange-800 p-3 rounded-md text-sm">
                          <p className="flex items-center justify-center gap-2 font-semibold">
                            <CalendarOff className="h-4 w-4" /> Cancelamento
                            Agendado
                          </p>
                          <p className="mt-1">
                            Seu acesso termina no fim do período atual.
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600 mb-4">
                            Você tem acesso ilimitado. Sua assinatura renova
                            automaticamente.
                          </p>

                          {/* MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Cancelar Assinatura
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Tem certeza que deseja cancelar?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Ao cancelar, você perderá acesso aos recursos
                                  Premium ao final do seu período de cobrança
                                  atual (ou teste grátis).
                                  <br />
                                  <br />
                                  Seus dados e históricos serão mantidos, mas
                                  você não poderá fazer novas análises
                                  detalhadas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Manter Assinatura
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleCancelSubscription}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  disabled={isCanceling}
                                >
                                  {isCanceling ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Cancelando...
                                    </>
                                  ) : (
                                    'Sim, quero cancelar'
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        Você tem acesso a análises básicas. Faça upgrade para
                        desbloquear todo o potencial.
                      </p>
                      <Button
                        onClick={() => navigate('/payment')}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-md"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upgrade para Premium
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Alterar Senha
                </Button>
                <Button variant="destructive" className="w-full">
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {isEditing && (
          /* ... aviso de edição ... */
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Modo de edição ativado:</strong> Faça suas alterações e
              clique em "Salvar Alterações" para confirmar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;