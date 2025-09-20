
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, X, Loader2 } from 'lucide-react';
import { Message } from '../../types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatDesktopProps {
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

const ChatDesktop = ({
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  onKeyPress,
  isTyping,
  onClose,
  messagesEndRef,
  showLoggedInFeatures = false
}: ChatDesktopProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-5xl h-[90vh] sm:h-[600px] flex flex-col mx-2 sm:mx-4">
        <CardHeader className="border-b p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              <span className="truncate">Assistente IA de Carreira</span>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                Online
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-2 sm:p-3 mr-2 sm:mr-4">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span className="text-xs sm:text-sm text-gray-600">IA está digitando...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={onSendMessage}
            onKeyPress={onKeyPress}
            isTyping={isTyping}
            showLoggedInFeatures={showLoggedInFeatures}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatDesktop;
