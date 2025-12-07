import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, X } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { CVData, ChatMessage, SectionType } from '../types';

interface ChatBotProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ cvData, setCVData, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Merhaba! Ben CV asistanınım. CV\'ne yeni bir deneyim eklememi ister misin, yoksa tasarımı nasıl geliştirebileceğimiz hakkında mı konuşalım?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const geminiService = useRef(new GeminiService());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const executeTool = (toolCall: any) => {
    const { name, args } = toolCall;
    
    if (name === 'update_cv') {
      const { action, sectionType, data } = args;

      if (action === 'add_item' && sectionType) {
        setCVData(prev => {
          const newSections = prev.sections.map(sec => {
            if (sec.type === sectionType) {
              return {
                ...sec,
                items: [...sec.items, { 
                  id: Date.now().toString(), 
                  title: data.title || 'Yeni Başlık',
                  subtitle: data.subtitle || '',
                  date: data.date || '',
                  description: data.description || ''
                }]
              };
            }
            return sec;
          });
          return { ...prev, sections: newSections };
        });
      } else if (action === 'update_personal') {
         setCVData(prev => ({
           ...prev,
           personalInfo: { ...prev.personalInfo, ...data }
         }));
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await geminiService.current.chatWithCVContext(history, userMsg.text, cvData);

      if (response.toolCall) {
        executeTool(response.toolCall);
      }

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response.text 
      }]);

    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: 'Bir hata oluştu. Lütfen tekrar dene.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 h-[600px]">
      {/* Header */}
      <div className="bg-primary p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles size={18} />
          <span>AI Asistan</span>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-lg rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-xs text-gray-500">Düşünüyor...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Bir şey sor veya ekle..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};