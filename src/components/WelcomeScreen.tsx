import React from 'react';
import { LayoutTemplate, Sparkles, ArrowRight, Coffee, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { GithubIcon } from './GithubIcon';
import { LINKS } from '../constants/links';

interface WelcomeScreenProps {
  onStartFromScratch: () => void;
  onOpenTemplates: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartFromScratch,
  onOpenTemplates
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#070A0F] via-[#090E1A] to-[#04060A] flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-y-auto">
      
      {/* Glow decorativo de fondo */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -top-40 left-1/2 -translate-x-1/2" />

      {/* Espaciador superior */}
      <div className="w-full shrink-0" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8 my-auto">
        
        {/* Logo & Versión Rebrandeada a Media Studio v1.0 */}
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
              v1.0
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Generador de contenido visual de alta fidelidad para redes sociales. Diseña y exporta posts en 1080p nativo en segundos.
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
