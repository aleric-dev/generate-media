import React from 'react';
import { PostState, AspectRatioKey } from '../../types';
import { aspectRatios } from '../../constants/templates';
import { 
  Maximize2, 
  Loader2, 
  Sparkles, 
  ExternalLink,
  Coffee,
  Globe,
  Linkedin,
  Instagram,
  CheckCircle2
} from 'lucide-react';
import { GithubIcon } from '../GithubIcon';
import { LINKS } from '../../constants/links';

interface RatioQuickInfo {
  badge: string;
  name: string;
  subtitle: string;
  px: string;
  desc: string;
}

const RATIO_CONFIG: Record<AspectRatioKey, RatioQuickInfo> = {
  '4:5': {
    badge: '4:5',
    name: 'Instagram & Facebook (Vertical)',
    subtitle: 'Vertical',
    px: '1080 × 1350 px',
    desc: '4:5 para posts de Instagram, Facebook y LinkedIn. Ocupa más espacio vertical y maximiza la retención.',
  },
  '1:1': {
    badge: '1:1',
    name: 'Cuadrado Clásico (Feed)',
    subtitle: 'Cuadrado',
    px: '1080 × 1080 px',
    desc: '1:1 universal para carruseles paso a paso, infografías y compatibilidad total en todas las redes.',
  },
  '9:16': {
    badge: '9:16',
    name: 'Story / Reel / TikTok',
    subtitle: 'Story',
    px: '1080 × 1920 px',
    desc: '9:16 vertical de pantalla completa inmersiva para Instagram Stories, WhatsApp Estados, Reels y TikTok.',
  },
  '16:9': {
    badge: '16:9',
    name: 'Panorámico (Landscape)',
    subtitle: 'Landscape',
    px: '1920 × 1080 px',
    desc: '16:9 horizontal para miniaturas de YouTube, cabeceras de artículos, banners web y posts en X.',
  },
};

interface ExportPanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
  onExport: () => void;
  isExporting: boolean;
  exportStatus: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  state,
  updateState,
  onExport,
  isExporting,
  exportStatus,
}) => {
  const selectedRatio = state.aspectRatio || '4:5';
  const currentRatio = RATIO_CONFIG[selectedRatio] || RATIO_CONFIG['4:5'];
  const templateConfig = aspectRatios[selectedRatio] || aspectRatios['4:5'];

  return (
    <div className="space-y-3.5 pb-2 select-none">
      
      {/* ========================================================================= */}
      {/* 1. FORMATO FINAL & DIMENSIONES                                            */}
      {/* ========================================================================= */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5 font-mono">
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" /> Formato & Dimensiones
          </label>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {currentRatio.px}
          </span>
        </div>

        {/* 4 Botones de Formato Limpios y sin texto cortado */}
        <div className="grid grid-cols-4 gap-1.5 font-mono">
          {(['4:5', '1:1', '9:16', '16:9'] as AspectRatioKey[]).map((key) => {
            const item = RATIO_CONFIG[key];
            const isSelected = selectedRatio === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => updateState({ aspectRatio: key })}
                className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-950 border border-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span className="text-xs font-bold leading-none">{item.badge}</span>
                <span className="text-[10px] font-medium leading-tight opacity-85 mt-0.5">
                  {item.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resumen conciso del formato seleccionado */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              {currentRatio.name}
            </span>
            <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">
              {currentRatio.badge}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            {currentRatio.desc}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. QUIÉN LO HIZO: ALERIC DEV, REDES, KO-FI & FEEDBACK (ANTES DE DESCARGAR)*/}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800/90 rounded-2xl space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold font-mono text-[10px] shadow-sm">
              AD
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>Creado por</span>
                <a
                  href={LINKS.ALERIC}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition"
                >
                  aleric.dev
                </a>
              </div>
              <p className="text-[10px] text-slate-400">
                Ingeniería web & plataformas cloud a la medida
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/50">
            MIT
          </span>
        </div>

        {/* Enlaces de Redes del Creador */}
        <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
          <a
            href={LINKS.ALERIC}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-1.5 transition text-[11px]"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Web</span>
          </a>

          <a
            href={LINKS.INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-pink-400 border border-slate-800 flex items-center justify-center gap-1.5 transition text-[11px]"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Instagram</span>
          </a>

          <a
            href={LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-[#0077b5] border border-slate-800 flex items-center justify-center gap-1.5 transition text-[11px]"
          >
            <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Botón Ko-fi y Feedback */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-xs font-mono">
          <a
            href={LINKS.KOFI}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2.5 rounded-lg bg-[#FF5E5B]/15 hover:bg-[#FF5E5B]/25 text-[#ff7b78] hover:text-white border border-[#FF5E5B]/30 flex items-center justify-center gap-1.5 transition font-semibold text-[11px]"
          >
            <Coffee className="w-3.5 h-3.5 text-[#FF5E5B]" />
            <span>Apoyar en Ko-fi</span>
          </a>

          <a
            href={LINKS.GITHUB_ISSUES}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-1.5 transition text-[11px]"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Feedback</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. GENERAR IMAGEN ULTRA HQ                                                */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/40 rounded-2xl space-y-2.5 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono text-indigo-300">
          <span className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Exportación Final
          </span>
          <span className="text-[10px] text-indigo-400 font-bold">
            {templateConfig.px}
          </span>
        </div>

        {/* Botón Principal: Generar Imagen */}
        <button
          type="button"
          disabled={isExporting}
          onClick={onExport}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 text-white font-mono font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generando Imagen {templateConfig.nativeH}p...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generar Imagen Ultra HQ ({templateConfig.nativeH}p)</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-tight">
          Genera la imagen para abrir la vista previa lista para descargar, copiar al portapapeles o publicar.
        </p>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 pt-0.5 border-t border-slate-800/80">
          <span className="text-emerald-400 truncate">{exportStatus || '100% idéntico a pantalla'}</span>
          <span className="text-slate-500">Ultra HQ</span>
        </div>
      </div>

    </div>
  );
};
