
import React, { useState, useEffect } from 'react';
import TypingIndicator from './TypingIndicator';

interface DelayedResponseProps {
  message: string;
  delay?: number; 
  stepDelay?: number;
  onComplete?: () => void;
  children: (message: string | null) => React.ReactNode;
}

const stepMessages = [
  "Understanding your ask",
  "Fetching results from web",
  "Finding right products for you on flipkart"
];

const DelayedResponse: React.FC<DelayedResponseProps> = ({
  message,
  delay = 9000, // 9 seconds total delay
  stepDelay = 2000, // 2 seconds between steps
  onComplete,
  children,
}) => {
  const [response, setResponse] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!message) return;
    
    setResponse(null);
    setIsTyping(true);
    setCurrentStep(1);
    
    // Calculate the remaining time for the final step
    const finalStepDelay = delay - (stepDelay * 2);

    // First step
    const step1Timer = setTimeout(() => {
      setCurrentStep(2);
    }, stepDelay);
    
    // Second step
    const step2Timer = setTimeout(() => {
      setCurrentStep(3);
    }, stepDelay * 2);
    
    // Final step and completion
    const completionTimer = setTimeout(() => {
      setIsTyping(false);
      setResponse(message);
      if (onComplete) onComplete();
    }, delay);
    
    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(completionTimer);
    };
  }, [message, delay, stepDelay, onComplete]);

  if (isTyping) {
    return <TypingIndicator step={currentStep} message={stepMessages[currentStep - 1]} />;
  }

  return <>{children(response)}</>;
};

export default DelayedResponse;
