import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Download,
  ShieldCheck,
  Zap,
  Coffee,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { GithubIcon } from '../components/GithubIcon';
import { LINKS } from '../constants/links';
import { APP_VERSION } from '../constants/version';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoWelcome = () => {
    navigate('/inicio');
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('caracteristicas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#050811] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      {/* Glows ambientales de fondo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. FOLD PRINCIPAL: TAMAÑO PANTALLA COMPLETO (h-screen / min-h-screen)    */}
      {/*    TEXTO Y LLAMADO A LA ACCIÓN 100% CENTRADOS VERTICAL Y HORIZONTALMENTE   */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 py-5">
        {/* BARRA SUPERIOR / NAVBAR */}
        <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <BrandLogo size="md" showText={true} />
            <span className="text-[11px] sm:text-xs font-mono font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {APP_VERSION}
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
              onClick={handleGoWelcome}
              className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Comenzar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* HERO CENTRAL: CENTRADO EXACTO VERTICAL Y HORIZONTAL */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 my-auto z-10 py-6 sm:py-10">
          {/* Badge superior minimalista */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-medium animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generador de Contenido Visual en 1080p Nativo</span>
          </div>

          {/* Titular Principal responsive y legible */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.18] sm:leading-[1.14]">
              Crea publicaciones técnicas de{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
                alto impacto visual
              </span>{' '}
              en segundos.
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Diseñado para arquitectos de software, desarrolladores y agencias técnicas. Sin marcas de agua, con
              módulos reales de código, métricas KPI, gráficos y chats.
            </p>
          </div>

          {/* ÚNICO BOTÓN PRINCIPAL (DIRIGE DIRECTAMENTE AL MENÚ DE BIENVENIDA) */}
          <div className="w-full sm:w-auto flex justify-center pt-1">
            <button
              type="button"
              onClick={handleGoWelcome}
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold font-mono text-sm sm:text-base transition-all duration-200 shadow-xl shadow-indigo-600/35 hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Comenzar a Crear Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Badges de Confianza / Micro-Proof */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Gratis & Open Source</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Exportación Ultra HQ sin marcas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Marcas en Local</span>
            </div>
          </div>
        </div>

        {/* INDICADOR INFERIOR PARA DESPLAZARSE HACIA ABAJO */}
        <div
          className={`shrink-0 pt-2 pb-2 flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer select-none ${
            hasScrolled ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 hover:opacity-80'
          }`}
          onClick={scrollToFeatures}
        >
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 tracking-wider uppercase">
            Desliza para ver características
          </span>
          <ChevronDown className="w-4 h-4 text-indigo-400 animate-bounce" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECCIÓN INFERIOR: CARACTERÍSTICAS Y LLAMADO ADICIONAL                 */}
      {/* ========================================================================= */}
      <section id="caracteristicas" className="w-full max-w-5xl mx-auto px-6 py-16 sm:py-20 z-10">
        <div className="text-center space-y-2 pb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Todo lo que necesitas para tu marca técnica
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Un estudio diseñado para la productividad editorial en redes sociales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          <div className="p-6 rounded-2xl bg-[#0A0F1D]/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Marca Recurrente al Instante</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define tu logo, handle (@usuario) y paleta corporativa una sola vez. Quedan guardados en tu navegador
              para que no tengas que reconfigurarlos cada vez.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A0F1D]/80 border border-slate-800 hover:border-emerald-500/40 transition space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Módulos Técnicos Reales</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resalta código fuente con sintaxis limpia, muestra métricas KPI de rendimiento, simula chats y crea
              gráficos de barras comparativos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A0F1D]/80 border border-slate-800 hover:border-sky-500/40 transition space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Render 1080p Multiformato</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exporta con nitidez absoluta para LinkedIn, X (Twitter) e Instagram en proporciones 4:5, 1:1, 9:16 o
              16:9 con verificación 100% idéntica a pantalla.
            </p>
          </div>
        </div>

        {/* CTA Intermedio */}
        <div className="pt-12 text-center">
          <button
            type="button"
            onClick={handleGoWelcome}
            className="px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-mono font-bold inline-flex items-center gap-2 transition cursor-pointer shadow-lg hover:border-indigo-400"
          >
            <span>Ir al Menú de Creación</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-6 px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>Media Studio {APP_VERSION}</span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <span>Creado por</span>
              <a
                href={LINKS.ALERIC}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4 inline-flex items-center gap-1 transition"
              >
                <span>aleric.dev</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-slate-400">Open Source</span>
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
              onClick={handleGoWelcome}
              className="text-slate-400 hover:text-slate-200 transition underline underline-offset-2 cursor-pointer"
            >
              Menú Principal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
