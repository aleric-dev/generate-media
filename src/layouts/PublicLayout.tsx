import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { GithubIcon } from '../components/GithubIcon';
import { WebIcon, InstagramIcon, LinkedinIcon } from '../components/SocialIcons';
import { LINKS } from '../constants/links';
import { APP_VERSION } from '../constants/version';
import { getDefaultBrand } from '../utils/brandStorage';

export const PublicLayout: React.FC = () => {
  const defaultBrand = typeof window !== 'undefined' ? getDefaultBrand() : null;
  const savedBrandName = defaultBrand?.name || defaultBrand?.companyName;

  return (
    <div className="w-full min-h-screen bg-[#050811] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden flex flex-col justify-between">
      {/* Glows ambientales de fondo globales */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-40 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[170px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 -left-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* CABECERA COMPARTIDA (HEADER PÚBLICO)                                      */}
      {/* ========================================================================= */}
      <header className="w-full border-b border-slate-800/60 bg-[#050811]/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group transition-opacity hover:opacity-90"
              title="Volver a la página principal"
            >
              <BrandLogo size="md" showText={true} />
            </Link>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {APP_VERSION}
            </span>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ultra HQ Studio</span>
            </div>

            {savedBrandName && (
              <span className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Marca activa: {savedBrandName}</span>
              </span>
            )}
          </div>

          {/* DERECHA: REPOSITORIO GITHUB OFICIAL */}
          <div className="flex items-center gap-3">
            <a
              href={LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-mono transition shadow-sm group"
              title="Ver código fuente en GitHub"
            >
              <GithubIcon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span className="font-semibold">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* CONTENIDO DE LA PÁGINA (OUTLET DINÁMICO: LANDING O HOME)                   */}
      {/* ========================================================================= */}
      <div className="w-full flex-1 flex flex-col">
        <Outlet />
      </div>

      {/* ========================================================================= */}
      {/* PIE DE PÁGINA COMPARTIDO (FOOTER PÚBLICO)                                 */}
      {/* ========================================================================= */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-6 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          {/* Lado izquierdo: Branding de Aleric + Enlaces a redes oficiales */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span>Media Studio {APP_VERSION}</span>
            <span className="text-slate-700 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <span>Creado por</span>
              <a
                href={LINKS.ALERIC}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4 inline-flex items-center gap-1 transition"
              >
                <span>aleric.dev</span>
              </a>
            </div>

            <span className="text-slate-700 hidden sm:inline">•</span>

            {/* Iconos sociales interactivos oficiales */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <a
                href={LINKS.ALERIC}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-indigo-300 transition"
                title="Sitio Web Oficial de Aleric.dev"
                aria-label="Sitio Web Oficial"
              >
                <WebIcon className="w-4 h-4" />
              </a>

              <a
                href={LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-pink-400 transition"
                title="Instagram Oficial de Aleric.dev"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-sky-400 transition"
                title="LinkedIn Oficial de Aleric.dev"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Lado derecho: Apoyo Ko-fi */}
          <div className="flex items-center gap-3">
            <a
              href={LINKS.KOFI}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 transition font-semibold"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Apóyanos en Ko-fi</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
