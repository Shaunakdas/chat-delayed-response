
import React, { useState, useEffect } from 'react';
import TypingIndicator from './TypingIndicator';

interface DelayedResponseProps {
  message: string;
  delay?: number;
  onComplete?: () => void;
  children: (message: string | null) => React.ReactNode;
}

const DelayedResponse: React.FC<DelayedResponseProps> = ({
  message,
  delay = 9000, // 9 seconds default
  onComplete,
  children,
}) => {
  const [response, setResponse] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!message) return;
    
    setResponse(null);
    setIsTyping(true);
    
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
      setResponse(message);
      if (onComplete) onComplete();
    }, delay);
    
    return () => clearTimeout(typingTimer);
  }, [message, delay, onComplete]);

  if (isTyping) {
    return <TypingIndicator />;
  }

  return <>{children(response)}</>;
};

export default DelayedResponse;
