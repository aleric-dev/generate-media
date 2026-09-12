import React from 'react';
import { Sparkles, LayoutTemplate, ArrowRight, CheckCircle2, Terminal, TrendingUp, Download, ShieldCheck, Zap, ExternalLink, Coffee } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { GithubIcon } from './GithubIcon';
import { LINKS } from '../constants/links';

interface LandingScreenProps {
  onStartWizard: () => void;
  onOpenTemplates: () => void;
  onGoWelcome: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartWizard,
  onOpenTemplates,
  onGoWelcome,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#050811] text-slate-100 flex flex-col justify-between select-none overflow-y-auto">
      
      {/* Glows decorativos de fondo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* NAVBAR */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" showText={true} />
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            v1.1
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={LINKS.GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <button
            type="button"
            onClick={onStartWizard}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
          >
            <span>Crear Post</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 sm:py-20 flex flex-col items-center text-center space-y-8 z-10 my-auto">
        
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Generador de Contenido Visual en 1080p Nativo</span>
        </div>

        {/* Titular Principal */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Crea publicaciones técnicas de{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              alto impacto visual
            </span>{' '}
            en segundos.
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Diseñado para arquitectos de software, desarrolladores y agencias. Sin marcas de agua, sin curvas complejas y con módulos reales de código, métricas KPI, comparativas y chats.
          </p>
        </div>

        {/* Acciones Principales */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onStartWizard}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold font-mono text-sm sm:text-base transition-all duration-200 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Comenzar a Crear Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenTemplates}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 font-mono text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg"
          >
            <LayoutTemplate className="w-4 h-4 text-indigo-400" />
            <span>Explorar Catálogo (+24)</span>
          </button>
        </div>

        {/* Mini Badges de Confianza */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Gratis y Open Source</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Exportación Ultra HQ sin marcas</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Guarda tus Marcas en Local</span>
          </div>
        </div>

        {/* 3 TARJETAS DE CARACTERÍSTICAS DESTACADAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-12 w-full text-left">
          
          <div className="p-6 rounded-2xl bg-[#0A0F1D]/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Marca Recurrente al Instante</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define tu logo, handle (@usuario) y paleta corporativa una sola vez. Quedan guardados en tu navegador para que no tengas que reconfigurarlos nunca más.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A0F1D]/80 border border-slate-800 hover:border-emerald-500/40 transition space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Módulos Técnicos Reales</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resalta código fuente en TypeScript/Python, muestra métricas KPI de rendimiento, simula chats comerciales y crea gráficos comparativos de barras.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A0F1D]/80 border border-slate-800 hover:border-sky-500/40 transition space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Render 1080p Multiformato</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exporta con nitidez absoluta para LinkedIn, X (Twitter) e Instagram en proporciones 4:5, 1:1, 9:16 o 16:9 con verificación 100% idéntica a pantalla.
            </p>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-6 px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
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
            <span className="text-slate-700">•</span>
            <span>Software a la medida & Arquitectura Cloud</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={LINKS.KOFI}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 transition font-semibold"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Apóyanos en Ko-fi</span>
            </a>

            <button
              type="button"
              onClick={onGoWelcome}
              className="text-slate-400 hover:text-slate-200 transition underline underline-offset-2"
            >
              Ir al Menú Principal
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
