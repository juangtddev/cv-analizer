import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChatButton from './components/ChatButton';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import UploadCurriculo from './pages/UploadCurriculo';
import CadastroVagas from './pages/CadastroVagas';
import ResultadoAnalise from './pages/ResultadoAnalise';
import Historico from './pages/Historico';
import Perfil from './pages/Perfil';
import SimuladorEntrevista from './pages/SimuladorEntrevista';
import TestDebug from './pages/TestDebug';
import TestCardValidation from './pages/TestCardValidation';
import AssinaturaSucesso from './pages/AssinaturaSucesso';
import AssinaturaCancelada from './pages/AssinaturaCancelada';
import CallbackHandler from './components/auth/CallbackHandler';
import PaymentPage from './pages/PaymentPage';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Elements stripe={stripePromise}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route path="/auth/callback" element={<CallbackHandler />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/upload-curriculo"
                element={
                  <ProtectedRoute>
                    <UploadCurriculo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cadastro-vagas"
                element={
                  <ProtectedRoute>
                    <CadastroVagas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resultado-analise/:id"
                element={
                  <ProtectedRoute>
                    <ResultadoAnalise />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/historico"
                element={
                  <ProtectedRoute>
                    <Historico />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/simulador-entrevista"
                element={
                  <ProtectedRoute>
                    <SimuladorEntrevista />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                }
              />
              <Route path="/test-debug" element={<TestDebug />} />
              <Route
                path="/validacao-cartao"
                element={
                  <ProtectedRoute>
                    <TestCardValidation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test-card-validation"
                element={
                  <ProtectedRoute>
                    <TestCardValidation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assinatura-sucesso"
                element={<AssinaturaSucesso />}
              />
              <Route
                path="/assinatura-cancelada"
                element={<AssinaturaCancelada />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Elements>
          <ChatButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
