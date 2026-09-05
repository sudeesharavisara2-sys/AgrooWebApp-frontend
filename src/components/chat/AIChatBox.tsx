import React, { useState, useRef, useEffect } from 'react';
import { aiChatApi } from '../../api/aiChat';

interface DisplayMessage {
  sender: 'user' | 'ai';
  message: string;
  source?: string;
}

export const AIChatBox: React.FC = () => {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      sender: 'ai',
      message: '🌾 Hello! Welcome to Agroo AI Assistant!\n\nI am here to help you with organic farming, pest control, market prices, and machinery rental.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', message: userMsg }]);
    setLoading(true);

    try {
      const data = await aiChatApi.sendMessage({
        message: userMsg,
        sessionId: sessionId
      });

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages(prev => [
        ...prev,
        { sender: 'ai', message: data.reply, source: data.source }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', message: "I'm sorry, I encountered an error communicating with the server. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white px-6 py-4 rounded-t-xl font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span>Agroo AI Assistant</span>
        </div>
        <span className="text-xs bg-green-500/80 px-2.5 py-1 rounded-full border border-green-400">
          Online
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-green-600 text-white rounded-br-none shadow-sm'
                  : 'bg-white text-gray-800 border border-gray-200/80 shadow-sm rounded-bl-none'
              }`}
            >
              {msg.message}
              {msg.source && (
                <div className="mt-1 text-[10px] text-gray-400 text-right uppercase tracking-wider font-medium">
                  via {msg.source}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none text-sm shadow-sm animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2 rounded-b-xl">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about crops, fertilizers, market prices..."
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm transition"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition shadow-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
};