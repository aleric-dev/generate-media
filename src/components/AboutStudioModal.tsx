import React from 'react';
import { X, Sparkles, Coffee, ExternalLink, Code2, Layers, Cpu, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { GithubIcon } from './GithubIcon';
import { WebIcon, InstagramIcon, LinkedinIcon } from './SocialIcons';
import { LINKS } from '../constants/links';
import { APP_VERSION } from '../constants/version';

interface AboutStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutStudioModal: React.FC<AboutStudioModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#0B101B] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Cabecera del Modal */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showText={true} />
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
              {APP_VERSION}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Descripción de Aleric Dev */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Estudio Editorial Ultra HQ de Alto Rendimiento
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              <strong>Media Studio</strong> es una plataforma creada por{' '}
              <a
                href={LINKS.ALERIC}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline font-bold"
              >
                Aleric.dev
              </a>{' '}
              diseñada para fundadores, agencias y arquitectos de software que necesitan comunicar productos tecnológicos con estética visual de nivel mundial para redes como LinkedIn, X (Twitter) e Instagram.
            </p>
          </div>

          {/* Características del Motor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">9 Módulos Centrales</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  KPIs, Ventana IDE, Gráficos Donut/Barras, Chat WhatsApp, Roadmap, CTA y más.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">11 Tramas Algorítmicas</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Circuitos PCB, Hexágonos de grafeno, Matriz, Red Neuronal y Luces dinámicas.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">24 Plantillas Optimizadas</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Casos de uso reales de arquitectura cloud, automatización e ingeniería.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Exportación Nativa 1080p</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Renderizado pixel-perfect en alta definición sin pérdida de nitidez vectorial.
                </p>
              </div>
            </div>
          </div>

          {/* Enlaces a Redes y Contacto Oficial */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Conecta con Aleric.dev
            </h4>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={LINKS.ALERIC}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2 transition"
              >
                <WebIcon className="w-4 h-4 text-indigo-400" />
                <span>Sitio Web Oficial</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              <a
                href={LINKS.GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2 transition"
              >
                <GithubIcon className="w-4 h-4 text-slate-300" />
                <span>Código en GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              <a
                href={LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-pink-400 transition"
                title="Instagram Oficial"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-sky-400 transition"
                title="LinkedIn Oficial"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Pie del Modal con Apoyo Ko-fi */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <span className="text-slate-500">© {new Date().getFullYear()} Aleric.dev • Software Architecture & Studio</span>

          <a
            href={LINKS.KOFI}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-2 transition font-semibold"
          >
            <Coffee className="w-4 h-4 text-amber-400" />
            <span>Apóyanos en Ko-fi</span>
          </a>
        </div>
      </div>
    </div>
  );
};
