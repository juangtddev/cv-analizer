
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ia';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'suggestion';
}

export interface ChatIAProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}
