
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from './MessageBubble';
import DelayedResponse from './DelayedResponse';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [expectedResponse, setExpectedResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (question: string): string => {
    // Generate a response based on the user's question
    // This could be more sophisticated in a real application
    const responses = [
      `I understand your question about "${question}". Here's what I think...`,
      `Thanks for asking about "${question}". Let me explain...`,
      `Regarding "${question}", the answer is quite interesting...`,
      `"${question}" is an excellent question. Here's my perspective...`,
      `I've analyzed "${question}" and can offer this insight...`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!input.trim() || isProcessing) return;
    
    const trimmedInput = input.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      sender: 'user',
      timestamp: currentTime,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    // Generate the response but don't show it yet
    const response = generateResponse(trimmedInput);
    setExpectedResponse(response);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResponseComplete = () => {
    if (expectedResponse) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const systemMessage: Message = {
        id: Date.now().toString(),
        content: expectedResponse,
        sender: 'system',
        timestamp: currentTime,
      };
      
      setMessages(prev => [...prev, systemMessage]);
      setExpectedResponse(null);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto overflow-hidden rounded-2xl bg-background shadow-lg border animate-scale-in">
      <div className="flex items-center justify-center p-4 border-b glass-effect">
        <h2 className="text-lg font-medium">Chat with Delayed Response</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
            <p className="text-muted-foreground">
              Send a message and receive a response after 9 seconds.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
            
            {expectedResponse && (
              <DelayedResponse 
                message={expectedResponse} 
                onComplete={handleResponseComplete}
              >
                {(response) => response ? null : null}
              </DelayedResponse>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-4 border-t glass-effect">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={!input.trim() || isProcessing}
            className={cn(
              "transition-all duration-300",
              !input.trim() || isProcessing ? "opacity-70" : "opacity-100"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
