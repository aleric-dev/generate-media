import React from 'react';
import { LayoutTemplate, Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStartFromScratch: () => void;
  onOpenTemplates: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartFromScratch,
  onOpenTemplates
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#070A0F] via-[#090E1A] to-[#04060A] flex flex-col items-center justify-center p-4 sm:p-8 select-none">
      
      {/* Glow decorativo de fondo */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -top-40 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        
        {/* Logo & Versión */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 font-mono font-bold text-white text-2xl shadow-xl shadow-indigo-500/30">
            A
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Aleric Post Studio Pro{' '}
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 align-middle">
              v0.3
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Generador de contenido visual de alta precisión técnica para redes sociales. Diseña posts 1080p nativos en segundos.
          </p>
        </div>

        {/* Las 2 Grandes Opciones de Entrada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          
          {/* OPCIÓN 1: EMPEZAR DE 0 */}
          <button
            type="button"
            onClick={onStartFromScratch}
            className="group relative p-6 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-emerald-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-emerald-500/10"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Empezar de 0
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inicia con el lienzo completamente limpio y vacío, sin textos de relleno ni módulo predefinido.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 pt-2">
              <span>Lienzo en Blanco</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          {/* OPCIÓN 2: A PARTIR DE UNA PLANTILLA */}
          <button
            type="button"
            onClick={onOpenTemplates}
            className="group relative p-6 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-indigo-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                A partir de una Plantilla
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elige entre más de 24 diseños probados para SaaS, automatización, cloud y desarrollo web.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5 pt-2">
              <span>Explorar Catálogo (+24)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

        </div>

        {/* Footer sutil */}
        <div className="text-center text-[11px] font-mono text-slate-600">
          Aleric.dev — Suite de Creación Gráfica Profesional
        </div>

      </div>
    </div>
  );
};
