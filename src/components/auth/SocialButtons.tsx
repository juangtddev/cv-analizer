// src/components/auth/SocialButtons.tsx

import { Button } from '@/components/ui/button'; // Ajuste o caminho se necessário
import { supabase } from '@/integrations/supabase/client'; // 1. Importe o cliente Supabase
import { Chrome, Linkedin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function SocialButtons() {
  const { signInWithSocial } = useAuth();
  const handleOAuthLogin = (provider: 'google' | 'linkedin_oidc') => {
    signInWithSocial(provider);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Button
        className="w-full"
        variant="outline"
        onClick={() => handleOAuthLogin('google')} // 4. Chame a função no clique
      >
        <Chrome className="mr-2 h-4 w-4" />
        Entrar com Google
      </Button>
      <Button
        className="w-full"
        variant="outline"
        onClick={() => handleOAuthLogin('linkedin_oidc')} // 4. Chame a função no clique
      >
        <Linkedin className="mr-2 h-4 w-4" />
        Entrar com LinkedIn
      </Button>
    </div>
  );
}
