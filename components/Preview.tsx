import React from 'react';
import { CVData, SectionType } from '../types';
import { MapPin, Mail, Phone, Globe, Linkedin } from 'lucide-react';

interface PreviewProps {
  data: CVData;
}

export const Preview: React.FC<PreviewProps> = ({ data }) => {
  const { personalInfo, sections, themeColor, template } = data;

  // --- MODERN TEMPLATE ---
  const ModernTemplate = () => (
    <div className="cv-page w-[210mm] min-h-[297mm] bg-white text-gray-800 flex shadow-2xl overflow-hidden print:shadow-none relative">
      {/* Sidebar */}
      <div className="w-[70mm] shrink-0 p-6 text-white flex flex-col h-auto min-h-full print:bg-opacity-100 print:print-color-adjust-exact" style={{ backgroundColor: themeColor, WebkitPrintColorAdjust: 'exact' }}>
        <div className="mb-8 break-words">
          <h1 className="text-2xl font-bold leading-tight mb-2 uppercase tracking-wide">{personalInfo.fullName}</h1>
          <p className="text-white/90 text-sm font-medium">{personalInfo.title}</p>
        </div>

        <div className="space-y-3 mb-10 text-xs text-white/90">
          {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={12} className="shrink-0" /> <span className="break-all">{personalInfo.location}</span></div>}
          {personalInfo.email && <div className="flex items-center gap-2"><Mail size={12} className="shrink-0" /> <span className="break-all">{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={12} className="shrink-0" /> <span>{personalInfo.phone}</span></div>}
          {personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} className="shrink-0" /> <span className="break-all">{personalInfo.linkedin.replace('https://', '')}</span></div>}
          {personalInfo.website && <div className="flex items-center gap-2"><Globe size={12} className="shrink-0" /> <span className="break-all">{personalInfo.website}</span></div>}
        </div>

        {/* Skills & Languages in Sidebar */}
        {sections.filter(s => s.type === SectionType.SKILLS || s.type === SectionType.LANGUAGES).map(section => (
          <div key={section.id} className="mb-8">
            <h3 className="text-sm font-bold border-b border-white/40 pb-1 mb-3 uppercase tracking-wider">{section.title}</h3>
            <div className="flex flex-wrap gap-2">
              {section.items.map(item => (
                <span key={item.id} className="bg-white/20 px-2 py-1 rounded text-[11px] leading-tight backdrop-blur-sm">{item.title}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        {personalInfo.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 pb-1 mb-3 uppercase tracking-wide" style={{ borderColor: themeColor }}>Hakkımda</h3>
            <p className="text-gray-600 leading-relaxed text-sm text-justify">{personalInfo.summary}</p>
          </div>
        )}

        {sections.filter(s => s.type !== SectionType.SKILLS && s.type !== SectionType.LANGUAGES).map(section => (
          <div key={section.id} className="mb-6 break-inside-avoid">
            <h3 className="text-lg font-bold text-gray-800 border-b-2 pb-1 mb-4 uppercase tracking-wide" style={{ borderColor: themeColor }}>{section.title}</h3>
            <div className="space-y-5">
              {section.items.map(item => (
                <div key={item.id} className="relative pl-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-gray-900 text-[15px]">{item.title}</h4>
                    {item.date && <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">{item.date}</span>}
                  </div>
                  {item.subtitle && <p className="text-sm font-semibold text-gray-600 mb-1.5">{item.subtitle}</p>}
                  {item.description && (
                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                      {item.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- CLASSIC TEMPLATE ---
  const ClassicTemplate = () => (
    <div className="cv-page w-[210mm] min-h-[297mm] bg-white text-gray-800 p-[2.5cm] shadow-2xl print:shadow-none print:p-[2cm]">
      {/* Header */}
      <div className="text-center border-b-[3px] double border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-serif font-black text-gray-900 mb-2 uppercase tracking-wide">{personalInfo.fullName}</h1>
        <p className="text-lg text-gray-600 font-serif italic mb-4">{personalInfo.title}</p>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• LinkedIn</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 mb-3 pb-1">Özet</h3>
          <p className="text-gray-700 leading-relaxed text-justify text-sm serif">{personalInfo.summary}</p>
        </div>
      )}

      {sections.map(section => (
        <div key={section.id} className="mb-8 break-inside-avoid">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-300 mb-4 pb-1">
            {section.title}
          </h3>
          
          {section.type === SectionType.SKILLS ? (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
               {section.items.map(item => (
                 <div key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                   <div className="w-1.5 h-1.5 bg-gray-800 rounded-full shrink-0"></div>
                   {item.title}
                 </div>
               ))}
             </div>
          ) : (
            <div className="space-y-5">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-800 text-[15px]">{item.title}</h4>
                    <span className="text-sm text-gray-600 font-serif italic">{item.date}</span>
                  </div>
                  {item.subtitle && <p className="text-sm text-gray-700 font-medium mb-1">{item.subtitle}</p>}
                  {item.description && (
                    <div className="text-sm text-gray-600 leading-relaxed mt-1 whitespace-pre-line text-justify pl-1">
                      {item.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full overflow-auto bg-gray-700 p-8 flex justify-center items-start print:p-0 print:bg-white print:block custom-scrollbar">
      <div className="origin-top transition-transform duration-300 ease-in-out scale-[0.6] md:scale-[0.65] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-[0.95] print:scale-100">
        {template === 'classic' ? <ClassicTemplate /> : <ModernTemplate />}
      </div>
    </div>
  );
};