
import React, { useState, useRef, useEffect } from 'react';
import type { Message } from './types';
import { sendMessageToBot } from './services/geminiService';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';

const LoadingIndicator = () => (
    <div className="flex items-start gap-3 my-4 justify-start">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M12 12L4 7l8-4 8 4-8 5z" />
            </svg>
        </div>
        <div className="max-w-xl px-5 py-3 rounded-2xl shadow-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
      {
          role: 'model',
          content: "Hello! I'm your IGCSE Guide. Ask me any question about your studies, and I'll help you find the answer yourself. What's on your mind today?"
      }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (userMessage: string) => {
    setError(null);
    const newMessage: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToBot(userMessage);
      const botMessage: Message = { role: 'model', content: botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      const botMessage: Message = { role: 'model', content: "I'm having trouble connecting right now. Please try again in a moment." };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans antialiased text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
        <header className="p-4 bg-blue-600 dark:bg-blue-800 text-white shadow-md z-10">
            <h1 className="text-2xl font-bold text-center">IGCSE Learning Companion</h1>
        </header>

        <main className="flex-grow p-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
                {isLoading && <LoadingIndicator />}
                {error && <div className="text-red-500 text-center my-4">{error}</div>}
                <div ref={chatEndRef} />
            </div>
        </main> 
        
        <footer className="sticky bottom-0 z-10">
            <div className="max-w-4xl mx-auto">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
        </footer>
    </div>
  );
};

export default App;
