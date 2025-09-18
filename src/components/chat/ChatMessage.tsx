
import { Bot, User, FileText, TrendingUp } from 'lucide-react';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'analysis': return <FileText className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'suggestion': return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return <Bot className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white ml-2 sm:ml-4'
            : 'bg-gray-100 text-gray-900 mr-2 sm:mr-4'
        }`}
      >
        <div className="flex items-start space-x-1 sm:space-x-2">
          {message.sender === 'ia' && (
            <div className="flex-shrink-0 mt-0.5 sm:mt-1">
              {getMessageIcon(message.type)}
            </div>
          )}
          {message.sender === 'user' && (
            <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-1" />
          )}
          <div className="flex-1 min-w-0">
            <div className="whitespace-pre-wrap text-xs sm:text-sm break-words">
              {message.content}
            </div>
            <div className="text-xs mt-1 sm:mt-2 opacity-70">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
