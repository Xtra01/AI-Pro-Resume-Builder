import React, { useState } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ChatBot } from './components/ChatBot';
import { INITIAL_DATA } from './constants';
import { CVData } from './types';
import { Download, MessageSquare, Palette, FileText, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [cvData, setCVData] = useState<CVData>(INITIAL_DATA);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const changeTemplate = (template: 'modern' | 'classic') => {
    setCVData(prev => ({ ...prev, template }));
  };

  const changeColor = (color: string) => {
    setCVData(prev => ({ ...prev, themeColor: color }));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans bg-gray-900">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 print:hidden shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white">
             <FileText size={20} strokeWidth={2.5} />
          </div>
          <h1 className="font-bold text-lg text-gray-800 tracking-tight">AI Pro Resume</h1>
        </div>
        
        <div className="flex items-center gap-3">
           {/* Template Switcher */}
           <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            <button 
              onClick={() => changeTemplate('modern')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${cvData.template === 'modern' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Layout size={14} /> Modern
            </button>
            <button 
              onClick={() => changeTemplate('classic')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${cvData.template === 'classic' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <FileText size={14} /> Klasik
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {/* Color Picker */}
          <div className="flex items-center gap-1.5">
             {['#2563eb', '#1e293b', '#059669', '#dc2626', '#7c3aed', '#000000'].map(color => (
               <button
                 key={color}
                 onClick={() => changeColor(color)}
                 className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${cvData.themeColor === color ? 'border-gray-400 ring-1 ring-offset-1 ring-gray-400' : 'border-transparent'}`}
                 style={{ backgroundColor: color }}
                 title={color}
               />
             ))}
          </div>

           <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${isChatOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MessageSquare size={18} />
            <span className="hidden md:inline">AI Asistan</span>
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow"
          >
            <Download size={16} />
            <span className="hidden md:inline">İndir</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="w-full md:w-[400px] lg:w-[480px] bg-white h-full z-10 print:hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 border-r border-gray-200">
          <Editor cvData={cvData} setCVData={setCVData} />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 bg-gray-100/50 h-full overflow-hidden relative flex flex-col">
          <Preview data={cvData} />
        </div>
      </div>

      {/* Chat Bot Overlay */}
      <ChatBot 
        cvData={cvData} 
        setCVData={setCVData} 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

export default App;