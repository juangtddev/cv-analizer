import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Outlet /> {/* Irá renderizar o conteúdo da página atual aqui */}
    </div>
  );
};

export default MainLayout;
