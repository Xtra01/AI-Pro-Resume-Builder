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
    <div className="w-full h-full bg-white text-gray-800 flex flex-col md:flex-row shadow-2xl overflow-hidden print:shadow-none min-h-[1123px]">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 p-8 text-white" style={{ backgroundColor: themeColor }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold leading-tight mb-2 break-words">{personalInfo.fullName}</h1>
          <p className="text-white/80 text-lg">{personalInfo.title}</p>
        </div>

        <div className="space-y-4 mb-8 text-sm text-white/90">
          {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={14} /> {personalInfo.location}</div>}
          {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} /> {personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} /> {personalInfo.phone}</div>}
          {personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin size={14} /> {personalInfo.linkedin}</div>}
          {personalInfo.website && <div className="flex items-center gap-2"><Globe size={14} /> {personalInfo.website}</div>}
        </div>

        {/* Skills in Sidebar for Modern */}
        {sections.filter(s => s.type === SectionType.SKILLS || s.type === SectionType.LANGUAGES).map(section => (
          <div key={section.id} className="mb-8">
            <h3 className="text-lg font-bold border-b border-white/30 pb-1 mb-4 uppercase tracking-wide">{section.title}</h3>
            <div className="flex flex-wrap gap-2">
              {section.items.map(item => (
                <span key={item.id} className="bg-white/20 px-2 py-1 rounded text-sm">{item.title}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 p-8 bg-white">
        {personalInfo.summary && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 border-b-2 pb-2 mb-4" style={{ borderColor: themeColor }}>Hakkımda</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{personalInfo.summary}</p>
          </div>
        )}

        {sections.filter(s => s.type !== SectionType.SKILLS && s.type !== SectionType.LANGUAGES).map(section => (
          <div key={section.id} className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 border-b-2 pb-2 mb-4 uppercase tracking-wider" style={{ borderColor: themeColor }}>{section.title}</h3>
            <div className="space-y-6">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    {item.date && <span className="text-xs font-semibold text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded">{item.date}</span>}
                  </div>
                  {item.subtitle && <p className="text-sm font-semibold text-gray-600 mb-2">{item.subtitle}</p>}
                  {item.description && (
                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
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
    <div className="w-full h-full bg-white text-gray-800 p-10 max-w-[21cm] mx-auto shadow-2xl print:shadow-none min-h-[29.7cm]">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2 uppercase tracking-wide">{personalInfo.fullName}</h1>
        <p className="text-xl text-gray-600 font-serif italic mb-4">{personalInfo.title}</p>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed text-center italic">{personalInfo.summary}</p>
        </div>
      )}

      {sections.map(section => (
        <div key={section.id} className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4 uppercase flex items-center gap-2">
            {section.title}
          </h3>
          
          {section.type === SectionType.SKILLS ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2">
               {section.items.map(item => (
                 <div key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                   {item.title}
                 </div>
               ))}
             </div>
          ) : (
            <div className="space-y-4">
              {section.items.map(item => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                    <span className="text-sm text-gray-600 font-medium italic">{item.date}</span>
                  </div>
                  {item.subtitle && <p className="text-md text-gray-700 font-semibold mb-1">{item.subtitle}</p>}
                  {item.description && (
                    <div className="text-sm text-gray-600 leading-relaxed pl-2 border-l-2 border-gray-200 ml-1">
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
    <div className="h-full overflow-auto bg-gray-500/10 p-4 md:p-8 flex justify-center items-start print:p-0 print:bg-white print:block">
      <div className="w-[21cm] bg-white print:w-full print:h-full transform scale-[0.5] md:scale-[0.6] lg:scale-[0.8] xl:scale-100 origin-top transition-transform duration-300">
        {template === 'classic' ? <ClassicTemplate /> : <ModernTemplate />}
      </div>
    </div>
  );
};