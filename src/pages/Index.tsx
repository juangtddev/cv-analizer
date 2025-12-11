import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './Landing';

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return <Landing />;
};

export default Index;
