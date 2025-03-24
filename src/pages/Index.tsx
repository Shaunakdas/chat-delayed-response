
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background to-background/50">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Elegant Chat Interface</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Experience a minimalist chat with a 9-second delayed response. Send a message and watch as the system responds after a thoughtful pause.
          </p>
        </div>
        
        <div className="h-[600px] w-full">
          <ChatInterface />
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in">
          <p>Designed with precision and simplicity in mind.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
