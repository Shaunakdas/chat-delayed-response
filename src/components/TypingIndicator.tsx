
import React from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
  step: number;
  message: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className, step, message }) => {
  return (
    <div className={cn("flex flex-col space-y-2 py-3 px-4", className)}>
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
          <span className="text-xs font-semibold text-primary">{step}</span>
        </div>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <div className="flex space-x-1 ml-9">
        <div className="w-2 h-2 rounded-full bg-primary/70 animate-typing-1"></div>
        <div className="w-2 h-2 rounded-full bg-primary/70 animate-typing-2"></div>
        <div className="w-2 h-2 rounded-full bg-primary/70 animate-typing-3"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
