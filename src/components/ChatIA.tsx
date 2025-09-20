
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Message, ChatIAProps } from '../types/chat';
import { generateAIResponse } from '../utils/aiMessageGenerator';
import ChatDesktop from './chat/ChatDesktop';
import ChatMobile from './chat/ChatMobile';

const ChatIA = ({ isOpen, onClose, isLoggedIn }: ChatIAProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Se está na landing page ("/"), sempre trata como não logado para o chat
  const isInRestrictedArea = location.pathname !== '/';
  const shouldShowLoggedInFeatures = isLoggedIn && isInRestrictedArea;
  
  const getInitialMessage = (): Message => {
    if (!shouldShowLoggedInFeatures) {
      return {
        id: '1',
        content: 'Olá! Sou sua assistente de carreira com IA. Posso te ajudar com:\n\n• Informações sobre nossa plataforma\n• Dicas de carreira e currículos\n• Como funciona nossa análise de IA\n• Benefícios de se cadastrar\n\n💡 **Cadastre-se gratuitamente** para ter acesso completo a todas as funcionalidades!\n\nComo posso te ajudar hoje?',
        sender: 'ia',
        timestamp: new Date(),
        type: 'text'
      };
    } else {
      return {
        id: '1',
        content: 'Olá! Sou sua assistente de carreira com IA. Como usuário logado, posso te ajudar a:\n\n• Analisar seu currículo\n• Sugerir melhorias específicas\n• Identificar vagas mais aderentes\n• Dar dicas de carreira personalizadas\n• Orientações sobre a plataforma\n\nComo posso te ajudar hoje?',
        sender: 'ia',
        timestamp: new Date(),
        type: 'text'
      };
    }
  };

  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Atualizar mensagem inicial quando status de login ou rota muda
  useEffect(() => {
    const initialMessage = getInitialMessage();
    setMessages([initialMessage]);
  }, [isLoggedIn, location.pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage, shouldShowLoggedInFeatures);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  const commonProps = {
    messages,
    newMessage,
    setNewMessage,
    onSendMessage: handleSendMessage,
    onKeyPress: handleKeyPress,
    isTyping,
    onClose,
    messagesEndRef,
    showLoggedInFeatures: shouldShowLoggedInFeatures
  };

  return isMobile ? 
    <ChatMobile {...commonProps} /> : 
    <ChatDesktop {...commonProps} />;
};

export default ChatIA;
