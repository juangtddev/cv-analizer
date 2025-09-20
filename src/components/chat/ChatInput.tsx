
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, FileText, Briefcase, TrendingUp } from 'lucide-react';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
  isMobile?: boolean;
  showLoggedInFeatures?: boolean;
}

const ChatInput = ({ 
  newMessage, 
  setNewMessage, 
  onSendMessage, 
  onKeyPress, 
  isTyping,
  isMobile = false,
  showLoggedInFeatures = false
}: ChatInputProps) => {
  return (
    <div className="border-t p-3 sm:p-4 bg-background">
      {/* Quick suggestion buttons responsivos - apenas para usuários logados */}
      {showLoggedInFeatures && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNewMessage('analisar meu currículo')}
            disabled={isTyping}
            className="text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3"
          >
            <FileText className="h-3 w-3 mr-1" />
            {isMobile ? 'Currículo' : 'Analisar Currículo'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNewMessage('vagas compatíveis para mim')}
            disabled={isTyping}
            className="text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3"
          >
            <Briefcase className="h-3 w-3 mr-1" />
            {isMobile ? 'Vagas' : 'Vagas Compatíveis'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNewMessage('como melhorar meu perfil')}
            disabled={isTyping}
            className="text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-3"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            {isMobile ? 'Dicas' : 'Dicas de Melhoria'}
          </Button>
        </div>
      )}

      {/* Message input responsivo */}
      <div className="flex space-x-2">
        <Textarea
          placeholder={
            showLoggedInFeatures 
              ? (isMobile ? "Digite sua pergunta..." : "Digite sua pergunta sobre carreira, currículo, vagas...")
              : (isMobile ? "Pergunte como funciona..." : "Pergunte 'como funciona', 'cadastrar', 'preços'...")
          }
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={onKeyPress}
          className={`flex-1 resize-none ${isMobile ? 'min-h-[45px] max-h-[90px] text-sm' : 'min-h-[50px] max-h-[100px]'}`}
          disabled={isTyping}
        />
        <Button
          onClick={onSendMessage}
          disabled={!newMessage.trim() || isTyping}
          size={isMobile ? "sm" : "default"}
          className="self-end h-[45px] sm:h-[50px] px-3 sm:px-4"
        >
          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
