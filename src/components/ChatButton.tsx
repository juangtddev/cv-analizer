
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ChatIA from './ChatIA';

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Para usuários não logados (landing page): sempre mostra notificação
  // Para usuários logados: só mostra quando clicado
  useEffect(() => {
    if (!isLoggedIn) {
      setShowNotification(true);
    }
  }, [isLoggedIn]);

  const handleChatClick = () => {
    setIsChatOpen(true);
    if (isLoggedIn) {
      setShowNotification(false);
    }
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    if (isLoggedIn) {
      // Na área logada, só mostra notificação quando clicado novamente
      setShowNotification(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={handleChatClick}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 h-3 w-3 p-0 bg-green-500 border-2 border-white animate-pulse">
              <span className="sr-only">IA Online</span>
            </Badge>
          </div>
        </Button>
        
        {!isChatOpen && showNotification && (
          <div className={`absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs ${!isLoggedIn ? 'animate-bounce' : ''}`}>
            <div className="flex items-center space-x-2 text-sm">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-foreground">
                {!isLoggedIn ? 'Precisa de ajuda?' : 'Como posso ajudar?'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {!isLoggedIn 
                ? 'Converse com nossa IA sobre carreiras e cadastre-se!' 
                : 'Tire suas dúvidas sobre a plataforma.'}
            </p>
          </div>
        )}
      </div>

      <ChatIA 
        isOpen={isChatOpen} 
        onClose={handleChatClose}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
};

export default ChatButton;
