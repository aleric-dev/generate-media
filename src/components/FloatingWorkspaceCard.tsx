import React, { useState } from 'react';
import { Minus, Plus, ArrowUpDown, ArrowLeftRight, ChevronDown, ChevronUp } from 'lucide-react';
import { aspectRatios } from '../constants/templates';
import { AspectRatioKey } from '../types';

export const MIN_ZOOM = 0.30;
export const MAX_ZOOM = 2.00;

interface FloatingWorkspaceCardProps {
  aspectRatio: AspectRatioKey;
  onAspectRatioChange: (ratio: AspectRatioKey) => void;
  zoomMode: 'fit-height' | 'fit-width' | '100%' | 'manual';
  zoomLevel: number;
  onZoomChange: (modeOrValue: 'fit-height' | 'fit-width' | 1.0 | number) => void;
  className?: string;
}

export const FloatingWorkspaceCard: React.FC<FloatingWorkspaceCardProps> = ({
  aspectRatio,
  onAspectRatioChange,
  zoomMode,
  zoomLevel,
  onZoomChange,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pct = Math.round(zoomLevel * 100);
  const isMin = zoomLevel <= MIN_ZOOM + 0.005;
  const isMax = zoomLevel >= MAX_ZOOM - 0.005;

  const ratios: { id: AspectRatioKey; label: string }[] = [
    { id: '4:5', label: '4:5' },
    { id: '1:1', label: '1:1' },
    { id: '9:16', label: '9:16' },
    { id: '16:9', label: '16:9' },
  ];

  const handleMinus = () => {
    const next = Math.max(MIN_ZOOM, Number((zoomLevel - 0.1).toFixed(2)));
    onZoomChange(next);
  };

  const handlePlus = () => {
    const next = Math.min(MAX_ZOOM, Number((zoomLevel + 0.1).toFixed(2)));
    onZoomChange(next);
  };

  return (
    <div
      className={`flex flex-col-reverse gap-2 p-1.5 bg-slate-900/90 hover:bg-slate-900/95 border border-slate-800/90 rounded-2xl backdrop-blur-xl shadow-2xl select-none transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-[260px]' : 'w-[195px]'
      } ${className || 'absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-30'}`}
    >
      {/* BARRA PRINCIPAL: Controles de Zoom Manual (SIEMPRE VISIBLE EN EL FONDO DEL DOCK) */}
      <div className="flex items-center justify-between gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-mono w-full">
        <button
          type="button"
          onClick={handleMinus}
          disabled={isMin}
          title={isMin ? `Zoom mínimo alcanzado (${Math.round(MIN_ZOOM * 100)}%)` : "Alejar (-10%)"}
          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-35 disabled:hover:bg-slate-900 disabled:cursor-not-allowed text-slate-300 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onZoomChange(zoomMode === 'fit-height' ? 'fit-width' : 'fit-height')}
          title="Ajustar al lienzo"
          className="flex-1 py-1 px-1 rounded-lg text-indigo-300 font-bold hover:text-white text-xs transition text-center truncate cursor-pointer"
        >
          {pct}%
        </button>

        <button
          type="button"
          onClick={handlePlus}
          disabled={isMax}
          title={isMax ? `Zoom máximo alcanzado (${Math.round(MAX_ZOOM * 100)}%)` : "Acercar (+10%)"}
          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-35 disabled:hover:bg-slate-900 disabled:cursor-not-allowed text-slate-300 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Botón Squircle para expandir hacia arriba */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Comprimir panel' : 'Expandir opciones de ratio y vista'}
          className="w-7 h-7 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 flex items-center justify-center transition border border-slate-800/80 shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* FILA SUPERIOR 1 (Al expandir): Formatos de Aspect Ratio */}
      {isExpanded && (
        <div className="grid grid-cols-4 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-mono w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
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

      {/* FILA SUPERIOR 2 (Al expandir): Alto, Ancho y 100% */}
      {isExpanded && (
        <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-mono w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
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
