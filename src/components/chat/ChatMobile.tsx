
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, X, Loader2 } from 'lucide-react';
import { Message } from '../../types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatMobileProps {
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
  onClose: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  showLoggedInFeatures?: boolean;
}

const ChatMobile = ({
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  onKeyPress,
  isTyping,
  onClose,
  messagesEndRef,
  showLoggedInFeatures = false
}: ChatMobileProps) => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header móvel melhorado */}
      <div className="flex items-center justify-between p-3 border-b bg-background shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <Bot className="h-5 w-5 text-blue-600 shrink-0" />
          <span className="font-semibold text-sm truncate">Assistente IA</span>
          <Badge variant="secondary" className="text-xs shrink-0">
            Online
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Área de mensagens otimizada */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-3">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <Bot className="h-3 w-3" />
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs text-gray-600">IA está digitando...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Área de input melhorada */}
      <div className="shrink-0">
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={onSendMessage}
          onKeyPress={onKeyPress}
          isTyping={isTyping}
          isMobile={true}
          showLoggedInFeatures={showLoggedInFeatures}
        />
      </div>
    </div>
  );
};

export default ChatMobile;
