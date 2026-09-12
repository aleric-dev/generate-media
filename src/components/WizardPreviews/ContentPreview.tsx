import React from 'react';
import { ModuleType } from '../../types';
import { Terminal, TrendingUp, BarChart3, MessageSquare, ListOrdered, Sparkles } from 'lucide-react';

interface ContentPreviewProps {
  title: string;
  subtitle: string;
  activeModule: ModuleType;
  currentColor: string;
  titleFont: string;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  title,
  subtitle,
  activeModule,
  currentColor,
  titleFont,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner">
      <div className="w-full text-[11px] font-mono text-slate-400 mb-3 flex items-center justify-between">
        <span>Previsualización del Contenido</span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold uppercase">
          Módulo: {activeModule}
        </span>
      </div>

      <div className="w-full max-w-sm rounded-xl bg-[#070A0F] border border-slate-800 p-4 flex flex-col justify-between space-y-3 shadow-2xl relative overflow-hidden">
        {/* Título & Subtítulo */}
        <div className="space-y-1">
          <h4 className={`text-xs font-bold text-white leading-snug line-clamp-2 ${titleFont}`}>
            {title || 'Título de tu post'}
          </h4>
          <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
            {subtitle || 'Subtítulo descriptivo de soporte'}
          </p>
        </div>

        {/* Módulo Central Simulado */}
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-center">
          {activeModule === 'code' && (
            <div className="space-y-1 font-mono text-[10px]">
              <div className="flex items-center gap-1.5 pb-1 border-b border-slate-800 text-slate-400">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>system/migrate.ts</span>
              </div>
              <p className="text-emerald-400">system.migrate(&#123; from: 'Excel', to: 'CloudDB' &#125;);</p>
            </div>
          )}

          {activeModule === 'kpi' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-sm font-extrabold font-mono" style={{ color: currentColor }}>
                  99/100
                </span>
                <p className="text-[9px] text-slate-400 uppercase font-mono">RENDIMIENTO</p>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-sm font-extrabold font-mono text-emerald-400">
                  &lt; 0.4s
                </span>
                <p className="text-[9px] text-slate-400 uppercase font-mono">RESPUESTA</p>
              </div>
            </div>
          )}

          {activeModule === 'steps' && (
            <div className="space-y-1 font-mono text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[9px]">1</span>
                <span>Auditoría de Cuellos de Botella</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[9px]">2</span>
                <span>Arquitectura Cloud Escalable</span>
              </div>
            </div>
          )}

          {activeModule === 'chat' && (
            <div className="space-y-1.5 text-[10px]">
              <div className="bg-slate-800 text-slate-200 p-1.5 rounded-lg max-w-[85%]">
                Hola, ¿cuánto tarda migrar mi sistema?
              </div>
              <div
                className="text-white p-1.5 rounded-lg max-w-[85%] ml-auto"
                style={{ backgroundColor: `${currentColor}CC` }}
              >
                ¡En menos de 2 semanas con cero caídas!
              </div>
            </div>
          )}

          {activeModule === 'chart' && (
            <div className="space-y-1.5 text-[9px] font-mono">
              <div className="space-y-0.5">
                <div className="flex justify-between text-slate-400">
                  <span>Manual</span>
                  <span>28%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: '28%' }} />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between text-slate-400">
                  <span>Automatizado</span>
                  <span>98%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full" style={{ width: '98%', backgroundColor: currentColor }} />
                </div>
              </div>
            </div>
          )}

          {activeModule === 'promo' && (
            <div className="text-center space-y-1">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                OFERTA EXCLUSIVA
              </span>
              <p className="text-xs font-bold text-white">Migración Cloud con 30% OFF</p>
            </div>
          )}

          {activeModule === 'cta' && (
            <div className="text-center p-1 space-y-1">
              <p className="text-xs font-bold text-white">Migra hoy tus procesos a la nube</p>
              <button
                type="button"
                className="px-3 py-1 rounded text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: currentColor }}
              >
                Solicitar Sesión ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
