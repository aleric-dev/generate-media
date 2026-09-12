import React, { useState } from 'react';
import { ChevronDown, LucideIcon, SlidersHorizontal } from 'lucide-react';

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: LucideIcon;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  advancedContent?: React.ReactNode;
  defaultShowAdvanced?: boolean;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  icon: Icon,
  badge,
  isOpen,
  onToggle,
  children,
  advancedContent,
  defaultShowAdvanced = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(defaultShowAdvanced);

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden transition-all duration-200">
      {/* Cabecera del Acordeón */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-full px-3.5 py-3 flex items-center justify-between text-left transition select-none ${
          isOpen ? 'bg-slate-900/80 border-b border-slate-800/80' : 'hover:bg-slate-900/60'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg transition ${
            isOpen ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800/80 text-slate-400'
          }`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white tracking-tight truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 truncate max-w-[120px]">
              {badge}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Contenido Desplegable */}
      {isOpen && (
        <div className="p-3.5 space-y-3.5 bg-slate-950/40">
          {children}

          {/* Opciones Avanzadas Colapsables */}
          {advancedContent && (
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full py-1.5 px-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-[11px] font-mono flex items-center justify-between transition border border-slate-800/60"
              >
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
                  <span>Ajustes avanzados y espaciados</span>
                </div>
                <span className="text-indigo-400 text-xs font-bold">
                  {showAdvanced ? 'Ocultar ▲' : 'Ver opciones ▼'}
                </span>
              </button>

              {showAdvanced && (
                <div className="mt-3 p-3 bg-slate-900/30 rounded-xl border border-slate-800/80 space-y-3">
                  {advancedContent}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
