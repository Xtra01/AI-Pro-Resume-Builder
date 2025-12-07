import React, { useState } from 'react';
import { CVData, CVSection, CVItem, SectionType } from '../types';
import { Trash2, GripVertical, Plus, ChevronDown, ChevronUp, LayoutTemplate, Briefcase, GraduationCap, Code, Globe, User, MapPin, Mail, Phone, Linkedin, Link as LinkIcon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

interface EditorProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const Editor: React.FC<EditorProps> = ({ cvData, setCVData }) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>('personal');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCVData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handleDragEndSection = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setCVData((prev) => {
        const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
        const newIndex = prev.sections.findIndex((s) => s.id === over?.id);
        return { ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) };
      });
    }
  };

  const handleDragEndItem = (sectionId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setCVData((prev) => {
        const newSections = [...prev.sections];
        const sectionIndex = newSections.findIndex(s => s.id === sectionId);
        const section = newSections[sectionIndex];
        
        const oldIndex = section.items.findIndex(i => i.id === active.id);
        const newIndex = section.items.findIndex(i => i.id === over?.id);
        
        section.items = arrayMove(section.items, oldIndex, newIndex);
        return { ...prev, sections: newSections };
      });
    }
  };

  const addItem = (sectionId: string) => {
    setCVData(prev => {
      const newSections = prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            items: [...sec.items, { id: Date.now().toString(), title: '', subtitle: '', date: '', description: '' }]
          };
        }
        return sec;
      });
      return { ...prev, sections: newSections };
    });
  };

  const updateItem = (sectionId: string, itemId: string, field: keyof CVItem, value: string) => {
    setCVData(prev => {
      const newSections = prev.sections.map(sec => {
        if (sec.id === sectionId) {
          const newItems = sec.items.map(item => {
            if (item.id === itemId) return { ...item, [field]: value };
            return item;
          });
          return { ...sec, items: newItems };
        }
        return sec;
      });
      return { ...prev, sections: newSections };
    });
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    if (window.confirm('Bu öğeyi silmek istediğinize emin misiniz?')) {
        setCVData(prev => ({
        ...prev,
        sections: prev.sections.map(sec => 
            sec.id === sectionId ? { ...sec, items: sec.items.filter(i => i.id !== itemId) } : sec
        )
        }));
    }
  };

  const toggleSection = (id: string) => {
    setActiveSectionId(activeSectionId === id ? null : id);
  };

  const getIconForSection = (type: SectionType) => {
    switch (type) {
      case SectionType.EXPERIENCE: return <Briefcase size={18} />;
      case SectionType.EDUCATION: return <GraduationCap size={18} />;
      case SectionType.SKILLS: return <Code size={18} />;
      case SectionType.LANGUAGES: return <Globe size={18} />;
      default: return <LayoutTemplate size={18} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200 overflow-y-auto custom-scrollbar">
      {/* Personal Info */}
      <div className="bg-white border-b border-gray-200">
        <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('personal')}
        >
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <User size={20} className="text-primary" /> Kişisel Bilgiler
            </h2>
             {activeSectionId === 'personal' ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </div>
        
        {activeSectionId === 'personal' && (
            <div className="p-6 pt-0 grid grid-cols-1 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Ad Soyad</label>
                            <input type="text" name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Ünvan</label>
                            <input type="text" name="title" value={cvData.personalInfo.title} onChange={handlePersonalInfoChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Hakkımda / Özet</label>
                        <textarea name="summary" rows={4} value={cvData.personalInfo.summary} onChange={handlePersonalInfoChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input type="email" name="email" placeholder="E-posta" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
                        </div>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input type="text" name="phone" placeholder="Telefon" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
                        </div>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input type="text" name="location" placeholder="Konum" value={cvData.personalInfo.location} onChange={handlePersonalInfoChange} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
                        </div>
                         <div className="relative">
                            <Linkedin size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input type="text" name="linkedin" placeholder="LinkedIn" value={cvData.personalInfo.linkedin || ''} onChange={handlePersonalInfoChange} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
                        </div>
                        <div className="relative col-span-1 md:col-span-2">
                            <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input type="text" name="website" placeholder="Web Sitesi / Portfolyo" value={cvData.personalInfo.website || ''} onChange={handlePersonalInfoChange} className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Draggable Sections */}
      <div className="p-4 bg-gray-50 flex-1">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Bölümler</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndSection}>
          <SortableContext items={cvData.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {cvData.sections.map((section) => (
                <SortableItem key={section.id} id={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                  
                  {/* Section Header */}
                  <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors border-b border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3 cursor-move flex-1" onClick={() => toggleSection(section.id)}>
                      <div className="p-1.5 bg-gray-100 rounded text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                        {getIconForSection(section.type)}
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1">
                            <GripVertical size={16} />
                         </div>
                        <button onClick={() => toggleSection(section.id)} className="text-gray-400 hover:text-primary p-1">
                        {activeSectionId === section.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                  </div>

                  {/* Section Content (Items List) */}
                  {activeSectionId === section.id && (
                    <div className="p-3 bg-gray-50/50 border-t border-gray-100 shadow-inner">
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEndItem(section.id, e)}>
                        <SortableContext items={section.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-3">
                            {section.items.map((item) => (
                              <SortableItem key={item.id} id={item.id} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm relative group/item">
                                <div className="absolute right-2 top-2 opacity-0 group-hover/item:opacity-100 transition-opacity z-10">
                                   <button onClick={() => deleteItem(section.id, item.id)} className="text-red-300 hover:text-red-500 p-1">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                
                                <div className="flex gap-3">
                                   <div className="pt-2 text-gray-300 cursor-move hover:text-gray-500">
                                      <GripVertical size={14} />
                                   </div>
                                   <div className="flex-1 space-y-2">
                                       <div className="grid grid-cols-1 gap-2">
                                            <input 
                                            className="w-full bg-transparent font-semibold text-gray-800 text-sm border-b border-transparent focus:border-primary outline-none placeholder-gray-400 transition-colors pb-1" 
                                            placeholder={section.type === SectionType.SKILLS ? "Yetenek (Örn: React)" : "Başlık (Örn: Şirket Adı)"}
                                            value={item.title} 
                                            onChange={(e) => updateItem(section.id, item.id, 'title', e.target.value)} 
                                            />
                                            {section.type !== SectionType.SKILLS && (
                                            <>
                                                <div className="grid grid-cols-2 gap-2">
                                                <input 
                                                    className="w-full bg-transparent text-xs text-gray-600 border-b border-transparent focus:border-primary outline-none placeholder-gray-400 pb-1" 
                                                    placeholder="Alt Başlık"
                                                    value={item.subtitle || ''} 
                                                    onChange={(e) => updateItem(section.id, item.id, 'subtitle', e.target.value)} 
                                                />
                                                <input 
                                                    className="w-full bg-transparent text-xs text-gray-500 border-b border-transparent focus:border-primary outline-none placeholder-gray-400 text-right pb-1" 
                                                    placeholder="Tarih"
                                                    value={item.date || ''} 
                                                    onChange={(e) => updateItem(section.id, item.id, 'date', e.target.value)} 
                                                />
                                                </div>
                                                <textarea 
                                                className="w-full bg-gray-50 text-xs text-gray-700 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none mt-1 placeholder-gray-400 resize-y"
                                                placeholder="Açıklama (Madde işaretleri için Enter kullanın)"
                                                rows={3}
                                                value={item.description || ''}
                                                onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                                                />
                                            </>
                                            )}
                                        </div>
                                   </div>
                                </div>
                              </SortableItem>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                      <button 
                        onClick={() => addItem(section.id)}
                        className="mt-3 w-full py-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Plus size={14} /> Yeni Ekle
                      </button>
                    </div>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};