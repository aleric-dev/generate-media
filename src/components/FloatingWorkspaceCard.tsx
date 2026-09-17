import React, { useState } from 'react';
import { Minus, Plus, ArrowUpDown, ArrowLeftRight, ChevronDown, ChevronUp } from 'lucide-react';
import { aspectRatios } from '../constants/templates';
import { AspectRatioKey } from '../types';

interface FloatingWorkspaceCardProps {
  aspectRatio: AspectRatioKey;
  onAspectRatioChange: (ratio: AspectRatioKey) => void;
  zoomMode: 'fit-height' | 'fit-width' | '100%' | 'manual';
  zoomLevel: number;
  onZoomChange: (modeOrValue: 'fit-height' | 'fit-width' | 1.0 | number) => void;
}

export const FloatingWorkspaceCard: React.FC<FloatingWorkspaceCardProps> = ({
  aspectRatio,
  onAspectRatioChange,
  zoomMode,
  zoomLevel,
  onZoomChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pct = Math.round(zoomLevel * 100);

  const ratios: { id: AspectRatioKey; label: string }[] = [
    { id: '4:5', label: '4:5' },
    { id: '1:1', label: '1:1' },
    { id: '9:16', label: '9:16' },
    { id: '16:9', label: '16:9' },
  ];

  return (
    <div
      className={`absolute top-6 right-6 sm:top-8 sm:right-8 z-30 flex flex-col gap-2 p-2 bg-slate-900/90 hover:bg-slate-900/95 border border-slate-800/90 rounded-2xl backdrop-blur-xl shadow-2xl select-none transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-[250px]' : 'w-[190px]'
      }`}
    >
      {/* FILA 1: Tamaños de aspecto (Visible solo cuando está expandido) */}
      {isExpanded && (
        <div className="grid grid-cols-4 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-mono w-full animate-in fade-in slide-in-from-top-1 duration-200">
          {ratios.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAspectRatioChange(item.id)}
              title={`Formato ${item.label} (${aspectRatios[item.id].px})`}
              className={`py-1.5 rounded-lg transition text-[11px] font-bold text-center ${
                aspectRatio === item.id
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* FILA 2: Controles de Zoom Manual (SIEMPRE VISIBLE) + Botón de Comprimir/Expandir */}
      <div className="flex items-center justify-between gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-mono w-full">
        <button
          type="button"
          onClick={() => onZoomChange(zoomLevel - 0.1)}
          title="Alejar (-10%)"
          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition shrink-0"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onZoomChange(zoomMode === 'fit-height' ? 'fit-width' : 'fit-height')}
          title="Ajustar al lienzo"
          className="flex-1 py-1 px-1 rounded-lg text-indigo-300 font-bold hover:text-white text-xs transition text-center truncate"
        >
          {pct}%
        </button>

        <button
          type="button"
          onClick={() => onZoomChange(zoomLevel + 0.1)}
          title="Acercar (+10%)"
          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Botón Squircle para comprimir / expandir */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Comprimir panel de zoom' : 'Expandir opciones de ratio y vista'}
          className="w-7 h-7 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 flex items-center justify-center transition border border-slate-800/80 shrink-0"
        >
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* FILA 3: Alto, Ancho y 100% (Visible solo cuando está expandido) */}
      {isExpanded && (
        <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-mono w-full animate-in fade-in slide-in-from-top-1 duration-200">
          <button
            type="button"
            onClick={() => onZoomChange('fit-height')}
            title="Ajustar al alto de la pantalla"
            className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              zoomMode === 'fit-height'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>Alto</span>
          </button>

          <button
            type="button"
            onClick={() => onZoomChange('fit-width')}
            title="Ajustar al ancho de la pantalla"
            className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              zoomMode === 'fit-width'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>Ancho</span>
          </button>

          <button
            type="button"
            onClick={() => onZoomChange(1.0)}
            title="Zoom 100% (escala real)"
            className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition text-center ${
              zoomMode === '100%'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            100%
          </button>
        </div>
      )}
    </div>
  );
};
