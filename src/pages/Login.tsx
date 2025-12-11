import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginSuccess = () => {
    toast({
      title: 'Login realizado com sucesso!',
      description: 'Bem-vindo de volta ao CVAnalyzer.',
    });
    navigate('/dashboard');
  };

  const handleLoginError = (errorMessage: string) => {
    toast({
      title: 'Erro no login',
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
          <p className="text-gray-600 mt-2">Entre na sua conta</p>
        </div>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onLoginError={handleLoginError}
            />
            <div className="mt-6 text-center space-y-4">
              <Link to="#" className="text-sm text-blue-600 hover:underline">
                Esqueceu sua senha?
              </Link>
              <div className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Cadastre-se aqui
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Login;
