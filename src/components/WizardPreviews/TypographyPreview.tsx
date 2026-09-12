import React from 'react';

interface TypographyPreviewProps {
  currentColor: string;
  titleFont: string;
  subtitleFont: string;
  sampleTitle?: string;
  sampleSubtitle?: string;
}

export const TypographyPreview: React.FC<TypographyPreviewProps> = ({
  currentColor,
  titleFont,
  subtitleFont,
  sampleTitle = '¿Tu empresa ya superó a Excel? 3 señales de que necesitas un panel propio',
  sampleSubtitle = 'Centraliza pedidos, inventarios y permisos en una plataforma web de alto rendimiento sin errores de fórmula.',
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner">
      <div className="w-full text-[11px] font-mono text-slate-400 mb-3 flex items-center justify-between">
        <span>Previsualización Tipográfica</span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold">Estilo & Contraste</span>
      </div>

      <div className="w-full max-w-sm rounded-xl bg-[#070A0F] border border-slate-800 p-5 flex flex-col justify-center space-y-3.5 shadow-2xl relative overflow-hidden">
        {/* Glow de color seleccionado */}
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: currentColor }}
        />

        {/* Badges de muestra */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-sm"
            style={{
              backgroundColor: `${currentColor}20`,
              color: currentColor,
              borderColor: `${currentColor}40`,
            }}
          >
            ⚡ SOLUCIÓN DIRECTA
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            PostgreSQL • Next.js
          </span>
        </div>

        {/* Título con fuente seleccionada */}
        <h3 className={`text-base font-extrabold text-white leading-snug ${titleFont}`}>
          {sampleTitle}
        </h3>

        {/* Subtítulo con fuente seleccionada */}
        <p className={`text-xs text-slate-300 leading-relaxed ${subtitleFont}`}>
          {sampleSubtitle}
        </p>

        {/* Mini indicador de fuentes seleccionadas */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Título: <strong className="text-white">{titleFont.replace('font-', '')}</strong></span>
          <span>Subtítulo: <strong className="text-white">{subtitleFont.replace('font-', '')}</strong></span>
        </div>
      </div>
    </div>
  );
};
