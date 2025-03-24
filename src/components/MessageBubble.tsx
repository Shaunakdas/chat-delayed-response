
import React from 'react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'system';
  timestamp?: string;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  sender,
  timestamp,
  className,
}) => {
  const isUser = sender === 'user';
  
  return (
    <div 
      className={cn(
        "max-w-[80%] animate-blur-in mb-4",
        isUser ? "ml-auto" : "mr-auto",
        className
      )}
    >
      <div 
        className={cn(
          "px-4 py-3 rounded-xl shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-secondary text-secondary-foreground rounded-tl-sm"
        )}
      >
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
      {timestamp && (
        <div 
          className={cn(
            "text-xs text-muted-foreground mt-1",
            isUser ? "text-right" : "text-left"
          )}
        >
          {timestamp}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
