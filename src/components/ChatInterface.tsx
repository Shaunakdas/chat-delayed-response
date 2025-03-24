
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

interface ExaSearchResult {
  text: string;
  url?: string;
  title?: string;
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

  const searchExaApi = async (query: string): Promise<string> => {
    try {
      const response = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ef7768c2-a7f3-45f2-a633-33f81d3eb775'
        },
        body: JSON.stringify({
          query: query,
          type: "neural",
          contents: {
            text: true
          }
        })
      });

      if (!response.ok) {
        console.error('API error:', response.status);
        return `I'm sorry, I couldn't find information about "${query}". Would you like to try a different question?`;
      }

      const data = await response.json();
      console.log('Exa API response:', data);
      
      if (data.results && data.results.length > 0) {
        // Format the response using the results
        const topResults = data.results.slice(0, 3);
        const formattedResults = topResults.map((result: ExaSearchResult, index: number) => 
          `Result ${index + 1}: ${result.text}`
        ).join('\n\n');
        
        return `Here's what I found about "${query}":\n\n${formattedResults}`;
      } else {
        return `I couldn't find specific information about "${query}". Would you like to try a different search?`;
      }
    } catch (error) {
      console.error('Error calling Exa API:', error);
      return `I encountered an error while searching for "${query}". Please try again later.`;
    }
  };

  const handleSendMessage = async () => {
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
    
    // Call Exa API to get a response
    const response = await searchExaApi(trimmedInput);
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
    <div className="flex flex-col h-screen w-full bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
            <p className="text-muted-foreground">
              Send a message and see our 3-step processing in action.
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
                stepDelay={2000}
              >
                {(response) => response ? null : null}
              </DelayedResponse>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-4 border-t">
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
