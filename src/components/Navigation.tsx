
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, FileText, Briefcase, BarChart, History, MessageSquare, LogOut } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart },
    { path: '/upload-curriculo', label: 'Upload Currículo', icon: FileText },
    { path: '/cadastro-vagas', label: 'Minhas Vagas', icon: Briefcase },
    { path: '/historico', label: 'Histórico', icon: History },
    { path: '/simulador-entrevista', label: 'Simulador de Entrevista', icon: MessageSquare },
    { path: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div 
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              CVAnalyzer
            </div>
          </div>

          {/* Menu Items - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-3">
            <span className="hidden sm:block text-sm text-gray-700">
              Olá, {user?.nome}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={14} className="sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden border-t border-gray-200">
          <div className="flex overflow-x-auto py-2 space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-md text-xs font-medium transition-colors min-w-0 flex-shrink-0 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span className="mt-1 text-xs leading-tight text-center">
                    {item.label.split(' ').map((word, i) => (
                      <div key={i}>{word}</div>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
