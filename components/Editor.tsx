import React, { useState } from 'react';
import { CVData, CVSection, CVItem, SectionType } from '../types';
import { Trash2, GripVertical, Plus, ChevronDown, ChevronUp, LayoutTemplate, Briefcase, GraduationCap, Code, Globe, User } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

interface EditorProps {
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const Editor: React.FC<EditorProps> = ({ cvData, setCVData }) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

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
    setCVData(prev => ({
      ...prev,
      sections: prev.sections.map(sec => 
        sec.id === sectionId ? { ...sec, items: sec.items.filter(i => i.id !== itemId) } : sec
      )
    }));
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
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <User size={20} className="text-primary" /> Kişisel Bilgiler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="fullName" placeholder="Ad Soyad" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          <input type="text" name="title" placeholder="Ünvan (Örn: Yazılım Müh.)" value={cvData.personalInfo.title} onChange={handlePersonalInfoChange} className="p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          <input type="email" name="email" placeholder="E-posta" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} className="p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          <input type="text" name="phone" placeholder="Telefon" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} className="p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          <input type="text" name="location" placeholder="Konum" value={cvData.personalInfo.location} onChange={handlePersonalInfoChange} className="p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          <input type="text" name="linkedin" placeholder="LinkedIn URL" value={cvData.personalInfo.linkedin || ''} onChange={handlePersonalInfoChange} className="p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          <textarea name="summary" placeholder="Kısa Özet / Hakkımda" rows={3} value={cvData.personalInfo.summary} onChange={handlePersonalInfoChange} className="md:col-span-2 p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
        </div>
      </div>

      {/* Draggable Sections */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Bölümler</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndSection}>
          <SortableContext items={cvData.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {cvData.sections.map((section) => (
                <SortableItem key={section.id} id={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* Section Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 cursor-move flex-1" onClick={() => toggleSection(section.id)}>
                      <GripVertical size={16} className="text-gray-400" />
                      <div className="text-gray-600">{getIconForSection(section.type)}</div>
                      <span className="font-semibold text-gray-700">{section.title}</span>
                    </div>
                    <button onClick={() => toggleSection(section.id)} className="text-gray-500 hover:text-primary">
                      {activeSectionId === section.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {/* Section Content (Items List) */}
                  {activeSectionId === section.id && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEndItem(section.id, e)}>
                        <SortableContext items={section.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-4">
                            {section.items.map((item) => (
                              <SortableItem key={item.id} id={item.id} className="bg-gray-50 p-4 rounded border border-gray-200 group">
                                <div className="flex justify-between items-start mb-2">
                                  <GripVertical size={14} className="text-gray-400 cursor-move" />
                                  <button onClick={() => deleteItem(section.id, item.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <input 
                                      className="w-full bg-transparent font-medium border-b border-transparent focus:border-primary outline-none placeholder-gray-400" 
                                      placeholder={section.type === SectionType.SKILLS ? "Yetenek (Örn: React)" : "Başlık (Örn: Şirket Adı)"}
                                      value={item.title} 
                                      onChange={(e) => updateItem(section.id, item.id, 'title', e.target.value)} 
                                    />
                                    {section.type !== SectionType.SKILLS && (
                                      <>
                                        <div className="grid grid-cols-2 gap-2">
                                          <input 
                                            className="w-full bg-transparent text-sm border-b border-transparent focus:border-primary outline-none placeholder-gray-400" 
                                            placeholder="Alt Başlık (Örn: Pozisyon)"
                                            value={item.subtitle || ''} 
                                            onChange={(e) => updateItem(section.id, item.id, 'subtitle', e.target.value)} 
                                          />
                                           <input 
                                            className="w-full bg-transparent text-sm border-b border-transparent focus:border-primary outline-none placeholder-gray-400 text-right" 
                                            placeholder="Tarih"
                                            value={item.date || ''} 
                                            onChange={(e) => updateItem(section.id, item.id, 'date', e.target.value)} 
                                          />
                                        </div>
                                        <textarea 
                                          className="w-full bg-transparent text-sm border border-gray-200 rounded p-2 focus:ring-1 focus:ring-primary outline-none mt-2 placeholder-gray-400 resize-y"
                                          placeholder="Açıklama..."
                                          rows={3}
                                          value={item.description || ''}
                                          onChange={(e) => updateItem(section.id, item.id, 'description', e.target.value)}
                                        />
                                      </>
                                    )}
                                </div>
                              </SortableItem>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                      <button 
                        onClick={() => addItem(section.id)}
                        className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <Plus size={16} /> Yeni Ekle
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