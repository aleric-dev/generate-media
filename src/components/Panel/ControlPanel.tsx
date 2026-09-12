import React from 'react';
import { PostState } from '../../types';
import { ChevronLeft, ChevronRight, FileText, Palette, Sparkles, Download } from 'lucide-react';
import { Step1Content } from './Step1Content';
import { Step2Style } from './Step2Style';
import { Step3Background } from './Step3Background';
import { Step4Export } from './Step4Export';
import { BrandLogo } from '../BrandLogo';
import { GithubIcon } from '../GithubIcon';
import { LINKS } from '../../constants/links';

interface ControlPanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
  onExport: () => void;
  isExporting: boolean;
  exportStatus: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  updateState,
  onExport,
  isExporting,
  exportStatus
}) => {
  const stepTitles = {
    1: 'PASO 1: CONTENIDO, TEXTOS & TAMAÑOS',
    2: 'PASO 2: COLOR, LOGO & CONTENEDORES',
    3: 'PASO 3: PATRONES, LUCES & FORMAS',
    4: 'PASO 4: FORMATO & DESCARGA ULTRA HQ'
  };

  const steps = [
    { id: 1 as const, label: '1. Contenido', icon: FileText },
    { id: 2 as const, label: '2. Estilo', icon: Palette },
    { id: 3 as const, label: '3. Fondo', icon: Sparkles },
    { id: 4 as const, label: '4. Export', icon: Download },
  ];

  return (
    <aside
      id="control-panel"
      className="w-full h-full flex flex-col overflow-hidden bg-[#0B101B] select-none"
    >
      {/* CABECERA SUPERIOR CON BOTONES DE NAVEGACIÓN Y LOS 4 PASOS INTEGRADOS DENTRO */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/90 flex flex-col gap-2.5 shrink-0">
        
        {/* Fila 1: Botones Anterior / Siguiente y Versión */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={state.activeStep === 1}
              onClick={() => updateState({ activeStep: (state.activeStep - 1) as 1 | 2 | 3 | 4 })}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1 transition disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              disabled={state.activeStep === 4}
              onClick={() => updateState({ activeStep: (state.activeStep + 1) as 1 | 2 | 3 | 4 })}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-mono flex items-center gap-1 transition disabled:opacity-30 disabled:pointer-events-none"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <BrandLogo size="sm" showText={true} />
          </div>
        </div>

        {/* Fila 2: LOS 4 BOTONES DE PASOS INTEGRADOS DIRECTAMENTE DENTRO DEL PANEL */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {steps.map((s) => {
            const IconComponent = s.icon;
            const isActive = state.activeStep === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => updateState({ activeStep: s.id })}
                className={`py-2 px-1 rounded-lg text-xs font-mono font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span className="text-[11px]">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtítulo del Paso Activo */}
      <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-bold text-indigo-300 uppercase tracking-wider">
            {stepTitles[state.activeStep]}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">Paso {state.activeStep} de 4</span>
      </div>

      {/* CUERPO CON SCROLL PARA EL PASO ACTIVO */}
      <div className="flex-1 overflow-y-auto p-4">
        {state.activeStep === 1 && (
          <Step1Content
            state={state}
            updateState={updateState}
          />
        )}

        {state.activeStep === 2 && (
          <Step2Style
            state={state}
            updateState={updateState}
          />
        )}

        {state.activeStep === 3 && (
          <Step3Background
            state={state}
            updateState={updateState}
          />
        )}

        {state.activeStep === 4 && (
          <Step4Export
            state={state}
            updateState={updateState}
            onExport={onExport}
            isExporting={isExporting}
            exportStatus={exportStatus}
          />
        )}
      </div>

      {/* PIE DEL PANEL DE CONTROL: HECHO POR ALERIC.DEV + GITHUB + PROPONER MEJORA */}
      <div className="p-2.5 px-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>Hecho por</span>
          <a
            href={LINKS.ALERIC}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-2 transition"
          >
            aleric.dev
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={LINKS.GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver código en GitHub"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>

          <a
            href={LINKS.GITHUB_ISSUES}
            target="_blank"
            rel="noopener noreferrer"
            title="Sugerir o proponer una mejora en GitHub"
            className="px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 flex items-center gap-1 transition text-[11px] font-semibold"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Proponer mejora</span>
          </a>
        </div>
      </div>

    </aside>
  );
};
