import React from 'react';
import { PatternType, PatternVignette, LightType } from '../../types';
import { Sparkles, Sun, Moon } from 'lucide-react';

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

  // Cálculo de RGB para iluminación dinámica
  const cleanColor = (currentColor || '#4F46E5').replace('#', '');
  const bigint = parseInt(cleanColor, 16) || 0x4f46e5;
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;
  const rgb = `${red}, ${green}, ${blue}`;

  const lightA1 = isDark ? '0.50' : '0.24';
  const lightA2 = isDark ? '0.28' : '0.12';

  // Gradientes reales según el tipo de luz seleccionado
  let glowBg = 'none';
  if (lightType === 'spotlight') {
    glowBg = `
      radial-gradient(circle at 100% 0%, rgba(${rgb}, ${lightA1}) 0%, transparent 60%),
      radial-gradient(circle at 0% 100%, rgba(${rgb}, ${lightA2}) 0%, transparent 55%)
    `;
  } else if (lightType === 'aurora') {
    glowBg = `
      radial-gradient(ellipse at 50% 0%, rgba(${rgb}, ${lightA1}) 0%, rgba(6, 182, 212, ${isDark ? '0.25' : '0.15'}) 45%, transparent 75%)
    `;
  } else if (lightType === 'dual-beams') {
    glowBg = `
      linear-gradient(135deg, rgba(${rgb}, ${lightA1}) 0%, transparent 48%),
      linear-gradient(315deg, rgba(${rgb}, ${lightA2}) 0%, transparent 48%)
    `;
  } else if (lightType === 'glow') {
    glowBg = `
      radial-gradient(circle at 50% 25%, rgba(${rgb}, ${lightA1}) 0%, rgba(${rgb}, 0.04) 50%, transparent 80%)
    `;
  }

  const getLightLabel = () => {
    switch (lightType) {
      case 'glow': return 'Glow Suave';
      case 'spotlight': return 'Spotlight Esquina';
      case 'aurora': return 'Aurora Boreal';
      case 'dual-beams': return 'Haces Dobles';
      default: return 'Sin Luz';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner">
      <div className="w-full text-[11px] font-mono text-slate-400 mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Atmósfera & Fondo</span>
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${
          isDark ? 'bg-slate-900 text-indigo-300 border border-slate-800' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
        }`}>
          {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          {isDark ? 'Modo Oscuro' : 'Modo Claro'}
        </span>
      </div>

      {/* Mini Mockup Canvas Ultra HQ con soporte impecable en Modo Claro y Oscuro */}
      <div
        className={`w-full max-w-sm h-56 rounded-xl border p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#070A0F] border-slate-800 text-white'
            : 'bg-[#F8FAFC] border-slate-200/90 text-slate-900'
        }`}
      >
        {/* 1. Capa de Patrón Tecnológico usando las clases -light o dark y máscara de viñeta */}
        {bgPattern !== 'none' && (
          <div
            className={`absolute inset-0 pointer-events-none transition-all ${
              isDark ? `pattern-${bgPattern}` : `pattern-${bgPattern}-light`
            } vignette-${patternVignette || 'none'}`}
            style={{ opacity: patternOpacity / 100 }}
          />
        )}

        {/* 2. Capa de Iluminación Ambiental Procedimental */}
        {lightType !== 'none' && glowBg !== 'none' && (
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300 overflow-hidden"
            style={{ background: glowBg }}
          />
        )}

        {/* 3. Indicadores Superiores */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shadow-xs transition-colors ${
              isDark
                ? 'bg-slate-900/80 text-slate-200 border-slate-700/80'
                : 'bg-white/90 text-slate-800 border-slate-200 shadow-sm'
            }`}
          >
            Trama: {bgPattern}
          </span>
          <span
            className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border shadow-xs"
            style={{
              backgroundColor: `${currentColor}15`,
              borderColor: `${currentColor}40`,
              color: currentColor
            }}
          >
            {getLightLabel()}
          </span>
        </div>

        {/* 4. Tarjeta Central Demostrativa de Contraste */}
        <div className="relative z-10 text-center my-auto">
          <div
            className={`p-3.5 rounded-xl border backdrop-blur-md max-w-[240px] mx-auto shadow-lg transition-all ${
              isDark
                ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 shadow-black/40'
                : 'bg-white/90 border-slate-200 text-slate-800 shadow-slate-300/40'
            }`}
          >
            <p className="text-xs font-bold tracking-tight">Atmósfera & Profundidad</p>
            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Contraste garantizado en fondo {isDark ? 'oscuro' : 'claro'}
            </p>
          </div>
        </div>

        {/* 5. Pie informativo */}
        <div className={`relative z-10 flex items-center justify-between text-[10px] font-mono ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span>Opacidad: {patternOpacity}%</span>
          <span>Viñeta: {patternVignette}</span>
        </div>
      </div>
    </div>
  );
};
