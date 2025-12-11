import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RegisterForm } from '@/components/auth/RegisterForm';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegisterSuccess = () => {
    toast({
      title: 'Conta criada com sucesso!',
      description:
        'Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada.',
    });
    navigate('/login');
  };

  const handleRegisterError = (errorMessage: string) => {
    toast({
      title: 'Erro ao criar conta',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            CVAnalyzer
          </Link>
          <p className="text-gray-600 mt-2">Crie sua conta gratuita</p>
        </div>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 4. USAMOS O COMPONENTE E PASSAMOS OS CALLBACKS (as funções) PARA ELE */}
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess}
              onRegisterError={handleRegisterError}
            />
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Faça login aqui
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
