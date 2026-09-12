import React from 'react';
import { LayoutTemplate, Sparkles, ArrowRight, Coffee, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { GithubIcon } from './GithubIcon';
import { LINKS } from '../constants/links';

interface WelcomeScreenProps {
  onStartFromScratch: () => void;
  onOpenTemplates: () => void;
  onOpenWizard: () => void;
  onGoLanding: () => void;
  savedBrandName?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartFromScratch,
  onOpenTemplates,
  onOpenWizard,
  onGoLanding,
  savedBrandName,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#070A0F] via-[#090E1A] to-[#04060A] flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-y-auto">
      
      {/* Glow decorativo de fondo */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -top-40 left-1/2 -translate-x-1/2" />

      {/* Barra superior sutil */}
      <div className="w-full max-w-3xl flex items-center justify-between z-10 shrink-0">
        <button
          type="button"
          onClick={onGoLanding}
          className="text-xs font-mono text-slate-400 hover:text-indigo-300 flex items-center gap-1.5 transition underline underline-offset-4"
        >
          <span>← Volver a la Landing de Presentación</span>
        </button>

        {savedBrandName && (
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Marca activa: {savedBrandName}</span>
          </span>
        )}
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center space-y-8 my-auto py-6">
        
        {/* Logo & Versión v1.1 */}
        <div className="space-y-3">
          <div className="flex justify-center pb-1">
            <BrandLogo size="xl" />
          </div>

          <div className="inline-flex items-center gap-2">
            <a
              href={LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition shadow-sm"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Open Source en GitHub</span>
            </a>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Media Studio{' '}
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 align-middle shadow-sm">
              v1.1
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Generador de contenido visual en 1080p nativo. Elige cómo deseas comenzar tu publicación técnica hoy:
          </p>
        </div>

        {/* Las 3 Grandes Opciones de Entrada */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left">
          
          {/* OPCIÓN 1: ASISTENTE PASO A PASO (DESTACADO) */}
          <button
            type="button"
            onClick={onOpenWizard}
            className="group relative p-5 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] hover:from-[#131D35] hover:to-[#0D1426] border-2 border-indigo-500/60 hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-indigo-500/20 sm:scale-105 z-10"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Recomendado
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
                Asistente Guiado
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Configura tu marca, fuentes, módulo y fondo paso a paso con previsualizaciones antes de entrar.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5 pt-1">
              <span>Iniciar Asistente</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          {/* OPCIÓN 2: A PARTIR DE UNA PLANTILLA */}
          <button
            type="button"
            onClick={onOpenTemplates}
            className="group relative p-5 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-indigo-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                Usar Plantilla
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elige entre más de 24 diseños probados para SaaS, cloud, arquitectura y desarrollo.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5 pt-1">
              <span>Ver Catálogo (+24)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          {/* OPCIÓN 3: EMPEZAR DE 0 */}
          <button
            type="button"
            onClick={onStartFromScratch}
            className="group relative p-5 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-emerald-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-emerald-500/10"
          >
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Lienzo en Blanco
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Entra directo al editor con el lienzo limpio, sin textos ni módulos preconfigurados.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
              <span>Empezar de 0</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

        </div>

      </div>

      {/* FOOTER OFICIAL CON CRÉDITO A ALERIC.DEV, GITHUB, ISSUES Y KO-FI */}
      <footer className="relative z-10 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80 text-xs font-mono text-slate-500 shrink-0">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5">
            <span>Creado por</span>
            <a
              href={LINKS.ALERIC}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1 transition underline underline-offset-4"
            >
              <span>Aleric.dev</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <a
            href={LINKS.GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 flex items-center gap-1.5 transition"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <a
            href={LINKS.GITHUB_ISSUES}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Proponer mejora</span>
          </a>
        </div>

        {/* Botón Ko-fi */}
        <a
          href={LINKS.KOFI}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 flex items-center gap-2 transition shadow-sm font-semibold text-xs shrink-0"
        >
          <Coffee className="w-3.5 h-3.5 text-amber-400" />
          <span>Apóyanos en Ko-fi</span>
        </a>
      </footer>

    </div>
  );
};
