
import { GoogleGenAI } from '@google/genai';
import React, { useState, useRef, useEffect } from 'react';

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI companion. How can I help you today?", sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        if (!process.env.API_KEY) {
            throw new Error("API key not configured");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: `You are a friendly and supportive chatbot for a mental wellness app. Keep your responses concise and helpful. User says: "${currentInput}"`,
            config: {
                maxOutputTokens: 100,
            }
        });
        
        let botResponse = '';
        let firstChunk = true;
        for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
                botResponse += chunkText;
                if (firstChunk) {
                    // When the first chunk arrives, add a new bot message to the state
                    setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
                    firstChunk = false;
                } else {
                    // For subsequent chunks, update the last message
                    setMessages(prev => {
                        const lastMessage = prev[prev.length - 1];
                        const updatedLastMessage = { ...lastMessage, text: botResponse };
                        return [...prev.slice(0, -1), updatedLastMessage];
                    });
                }
            }
        }

    } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessage = { text: "Sorry, I'm having a little trouble right now. Please try again later.", sender: 'bot' };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex flex-col h-[360px]">
      <h2 className="text-xl font-semibold mb-2 text-blue-300 text-center">AI Companion</h2>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-xs xl:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-purple-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex justify-start">
                 <div className="px-4 py-2 rounded-2xl bg-gray-700 rounded-bl-none">
                     <div className="flex items-center space-x-1">
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                     </div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="flex-grow bg-gray-800 border border-gray-600 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
        />
        <button onClick={handleSend} disabled={isLoading} className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
