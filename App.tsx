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
    <div className="h-screen flex flex-col overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="h-16 bg-gray-900 text-white flex items-center justify-between px-6 border-b border-gray-800 shrink-0 z-10 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="text-blue-400" />
          <h1 className="font-bold text-xl tracking-tight">AI Pro Resume</h1>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Template Switcher */}
           <div className="flex bg-gray-800 rounded-lg p-1">
            <button 
              onClick={() => changeTemplate('modern')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all flex items-center gap-2 ${cvData.template === 'modern' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              <Layout size={14} /> Modern
            </button>
            <button 
              onClick={() => changeTemplate('classic')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all flex items-center gap-2 ${cvData.template === 'classic' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              <FileText size={14} /> Klasik
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-2 mr-4">
             <Palette size={16} className="text-gray-400" />
             {['#2563eb', '#0f172a', '#059669', '#b91c1c', '#7c3aed'].map(color => (
               <button
                 key={color}
                 onClick={() => changeColor(color)}
                 className={`w-6 h-6 rounded-full border-2 ${cvData.themeColor === color ? 'border-white' : 'border-transparent'}`}
                 style={{ backgroundColor: color }}
               />
             ))}
          </div>

          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isChatOpen ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            <MessageSquare size={18} />
            <span className="hidden md:inline">AI Asistan</span>
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            <Download size={18} />
            <span className="hidden md:inline">İndir (PDF)</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="w-full md:w-[450px] lg:w-[500px] bg-white h-full z-10 print:hidden shadow-xl shrink-0">
          <Editor cvData={cvData} setCVData={setCVData} />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 bg-gray-200/50 h-full overflow-hidden relative">
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