import React, { useState } from 'react';
import { LayoutTemplate, X, Check } from 'lucide-react';
import { defaultTemplates } from '../constants/templates';
import { PostTemplate } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PostTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Todas (24)' },
    { id: 'DESARROLLO A LA MEDIDA', label: 'Desarrollo Web (6)' },
    { id: 'LANDING PAGES / WEB SPEED', label: 'Landing Pages (6)' },
    { id: 'AUTOMATIZACIÓN & WHATSAPP', label: 'Automatización (6)' },
    { id: 'CONSULTORÍA / ESTRATEGIA', label: 'Consultoría (6)' },
  ];

  const filteredTemplates = activeCategory === 'all'
    ? defaultTemplates
    : defaultTemplates.filter(t => t.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B101B] border border-slate-800 w-full max-w-4xl max-h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Cabecera */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Catálogo de Plantillas Profesionales (+24 Diseños)</h3>
              <p className="text-xs text-slate-400">Selecciona una plantilla para rellenar automáticamente el canvas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de Filtro */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex flex-wrap gap-2 text-xs font-mono">
          {categories.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid de Plantillas */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-3.5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span
                    className="font-bold px-2 py-0.5 rounded border"
                    style={{
                      color: tpl.color,
                      borderColor: `${tpl.color}40`,
                      backgroundColor: `${tpl.color}15`,
                    }}
                  >
                    {tpl.category}
                  </span>
                  <span className="text-slate-500 uppercase">{tpl.module}</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{tpl.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{tpl.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(tpl);
                  onClose();
                }}
                className="w-full py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 border border-indigo-500/30 transition shadow-sm"
              >
                <Check className="w-3.5 h-3.5" /> Cargar Plantilla
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
