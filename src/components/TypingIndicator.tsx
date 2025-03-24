
import React from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-1 py-3 px-4", className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-primary/70 animate-typing-1"></div>
        <div className="w-2 h-2 rounded-full bg-primary/70 animate-typing-2"></div>
        <div className="w-2 h-2 rounded-full bg-primary/70 animate-typing-3"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
