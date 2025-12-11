import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CallbackHandler from './components/auth/CallbackHandler';

const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UploadCurriculo = lazy(() => import('./pages/UploadCurriculo'));
const CadastroVagas = lazy(() => import('./pages/CadastroVagas'));
const ResultadoAnalise = lazy(() => import('./pages/ResultadoAnalise'));
const Historico = lazy(() => import('./pages/Historico'));
const Perfil = lazy(() => import('./pages/Perfil'));
const SimuladorEntrevista = lazy(() => import('./pages/SimuladorEntrevista'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));

const NotFound = lazy(() => import('./pages/NotFound'));

export const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center font-bold text-xl">
          Carregando...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/auth/callback" element={<CallbackHandler />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Todas as suas páginas protegidas vão aqui como filhas */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload-curriculo" element={<UploadCurriculo />} />
          <Route path="/cadastro-vagas" element={<CadastroVagas />} />
          <Route path="/resultado-analise/:id" element={<ResultadoAnalise />} />
          <Route path="/historico" element={<Historico />} />
          <Route
            path="/simulador-entrevista"
            element={<SimuladorEntrevista />}
          />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
