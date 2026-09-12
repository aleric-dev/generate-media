import React from 'react';
import { PatternType, PatternVignette, LightType } from '../../types';

interface BackgroundPreviewProps {
  canvasMode: 'dark' | 'light';
  bgPattern: PatternType;
  patternOpacity: number;
  patternVignette: PatternVignette;
  lightType: LightType;
  currentColor: string;
}

export const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({
  canvasMode,
  bgPattern,
  patternOpacity,
  patternVignette,
  lightType,
  currentColor,
}) => {
  const isDark = canvasMode === 'dark';

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner">
      <div className="w-full text-[11px] font-mono text-slate-400 mb-3 flex items-center justify-between">
        <span>Previsualización de Atmósfera</span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold">
          {isDark ? 'Modo Oscuro' : 'Modo Claro'}
        </span>
      </div>

      <div
        className={`w-full max-w-sm h-56 rounded-xl border p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-colors duration-300 ${
          isDark
            ? 'bg-[#070A0F] border-slate-800 text-white'
            : 'bg-slate-50 border-slate-300 text-slate-900'
        }`}
      >
        {/* Capa de Patrón Tecnológico */}
        {bgPattern !== 'none' && (
          <div
            className={`absolute inset-0 pattern-${bgPattern} pointer-events-none transition-opacity`}
            style={{ opacity: patternOpacity / 100 }}
          />
        )}

        {/* Capa de Viñeta */}
        {patternVignette !== 'none' && (
          <div
            className={`absolute inset-0 pointer-events-none ${
              patternVignette === 'vignette'
                ? 'bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]'
                : patternVignette === 'gradient-top'
                ? 'bg-gradient-to-b from-black/80 via-transparent to-transparent'
                : patternVignette === 'gradient-bottom'
                ? 'bg-gradient-to-t from-black/80 via-transparent to-transparent'
                : 'bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.8)_0%,transparent_70%)]'
            }`}
          />
        )}

        {/* Capa de Iluminación Ambiental */}
        {lightType !== 'none' && (
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-all"
            style={{
              backgroundColor: currentColor,
              opacity: isDark ? 0.35 : 0.2,
            }}
          />
        )}

        {/* Simulación de Contenido Frontal */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              isDark ? 'bg-slate-900/80 text-white border-slate-700' : 'bg-white/80 text-slate-900 border-slate-300'
            }`}
          >
            Trama: {bgPattern}
          </span>
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: `${currentColor}30`, color: currentColor }}
          >
            Luz: {lightType}
          </span>
        </div>

        <div className="relative z-10 text-center my-auto">
          <div
            className={`p-3 rounded-lg border backdrop-blur-sm max-w-[220px] mx-auto shadow-md ${
              isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-200' : 'bg-white/70 border-slate-200 text-slate-800'
            }`}
          >
            <p className="text-xs font-bold">Atmósfera & Profundidad</p>
            <p className="text-[10px] opacity-70">Previsualización de contraste del fondo</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono opacity-60">
          <span>Opacidad: {patternOpacity}%</span>
          <span>Viñeta: {patternVignette}</span>
        </div>
      </div>
    </div>
  );
};
