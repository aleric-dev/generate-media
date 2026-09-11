import React from 'react';
import { ArrowLeft, Minus, Plus, ArrowUpDown, ArrowLeftRight } from 'lucide-react';
import { aspectRatios } from '../constants/templates';
import { AspectRatioKey } from '../types';

interface TopNavbarProps {
  aspectRatio: AspectRatioKey;
  onAspectRatioChange: (ratio: AspectRatioKey) => void;
  zoomMode: 'fit-height' | 'fit-width' | '100%' | 'manual';
  zoomLevel: number;
  onZoomChange: (modeOrValue: 'fit-height' | 'fit-width' | 1.0 | number) => void;
  onGoHome: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  aspectRatio,
  onAspectRatioChange,
  zoomMode,
  zoomLevel,
  onZoomChange,
  onGoHome
}) => {
  const currentConfig = aspectRatios[aspectRatio] || aspectRatios['4:5'];
  const pct = Math.round(zoomLevel * 100);

  let modeLabel = '';
  if (zoomMode === 'fit-height') modeLabel = ' (Alto)';
  else if (zoomMode === 'fit-width') modeLabel = ' (Ancho)';
  else if (zoomMode === '100%') modeLabel = ' (100%)';

  const ratios: { id: AspectRatioKey; label: string }[] = [
    { id: '4:5', label: '4:5' },
    { id: '1:1', label: '1:1' },
    { id: '9:16', label: '9:16' },
    { id: '16:9', label: '16:9' },
  ];

  return (
    <header className="w-full flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl mb-3 backdrop-blur-md z-20 select-none shrink-0">
      
      {/* Botón Volver a Inicio y Ratios de Aspecto */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onGoHome}
          title="Volver a la pantalla de bienvenida y catálogo"
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
          <span>Inicio</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800" />

        {/* Selector rápido de Formato de Aspecto */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
          {ratios.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAspectRatioChange(item.id)}
              className={`px-2 py-1 rounded-md transition ${
                aspectRatio === item.id
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <span className="text-indigo-400 text-xs font-mono font-semibold bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 hidden md:inline">
          {currentConfig.px}
        </span>
      </div>

      {/* Barra de Zoom Interactiva */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => onZoomChange(zoomLevel - 0.1)}
            title="Alejar (-10%)"
            className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange('fit-height')}
            title="Ajustar al alto de la pantalla"
            className="px-2 py-0.5 rounded-lg text-indigo-300 font-bold hover:text-white transition"
          >
            {pct}%{modeLabel}
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(zoomLevel + 0.1)}
            title="Acercar (+10%)"
            className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-slate-700">|</span>

        {/* 3 Botones Toggles: Alto, Ancho, 100% */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 shadow-inner select-none">
          <button
            type="button"
            onClick={() => onZoomChange('fit-height')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
              zoomMode === 'fit-height'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Alto</span>
          </button>
          <button
            type="button"
            onClick={() => onZoomChange('fit-width')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 ${
              zoomMode === 'fit-width'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Ancho</span>
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(1.0)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
              zoomMode === '100%'
                ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            100%
          </button>
        </div>
      </div>

    </header>
  );
};
