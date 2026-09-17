import React from 'react';
import { PostState } from '../../types';
import { 
  FileText, 
  Palette, 
  Sparkles, 
  Download, 
  Home, 
  BookmarkCheck,
  PanelLeftClose
} from 'lucide-react';
import { Step1Content } from './Step1Content';
import { Step2Style } from './Step2Style';
import { Step3Background } from './Step3Background';
import { Step4Export } from './Step4Export';

interface ControlPanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
  onExport: () => void;
  isExporting: boolean;
  exportStatus: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onGoHome: () => void;
  onOpenSaveModal: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  updateState,
  onExport,
  isExporting,
  exportStatus,
  isCollapsed,
  onToggleCollapse,
  onGoHome,
  onOpenSaveModal,
}) => {
  const stepTitles = {
    1: 'Paso 1: Contenido',
    2: 'Paso 2: Estilos',
    3: 'Paso 3: Fondos',
    4: 'Paso 4: Exportación HQ'
  };

  const steps = [
    { id: 1 as const, label: '1. Contenido', icon: FileText, desc: 'Textos, Módulos y Títulos' },
    { id: 2 as const, label: '2. Estilo', icon: Palette, desc: 'Colores, Logos y Marcos' },
    { id: 3 as const, label: '3. Fondo', icon: Sparkles, desc: 'Tramas, Luces y Formas' },
    { id: 4 as const, label: '4. Export', icon: Download, desc: 'Descarga Ultra HQ' },
  ];

  return (
    <div
      id="control-panel-root"
      className="h-full flex flex-row shrink-0 select-none overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. RAIL DE ICONOS PERMANENTE A LA IZQUIERDA (68px)                       */}
      {/* Permanece SIEMPRE visible tanto si el panel está colapsado como expandido */}
      {/* ========================================================================= */}
      <div className="w-[68px] h-full flex flex-col items-center justify-start py-5 bg-[#070A11] border-r border-slate-800/80 shrink-0 relative z-20 shadow-2xl">
        {/* PARTE SUPERIOR: BOTÓN VOLVER AL MENÚ */}
        <div className="flex flex-col items-center gap-4 w-full">
          <button
            type="button"
            onClick={onGoHome}
            title="Volver al Menú Principal"
            className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition shadow-md hover:scale-105 active:scale-95 group"
          >
            <Home className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
          </button>

          <div className="w-8 h-[1px] bg-slate-800/80 my-0.5" />

          {/* LOS 4 PASOS COMO ICONOS CON INDICADOR LUMINOSO */}
          <div className="flex flex-col items-center gap-3 w-full px-2">
            {steps.map((s) => {
              const IconComponent = s.icon;
              const isActive = state.activeStep === s.id;
              return (
                <div key={s.id} className="relative w-full flex items-center justify-center">
                  {/* Indicador azul flotante en el borde izquierdo (idéntico a la referencia) */}
                  {isActive && (
                    <span className="absolute -left-2 w-1.5 h-7 rounded-r-full bg-indigo-500 shadow-[0_0_12px_#6366F1] animate-pulse" />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      updateState({ activeStep: s.id });
                      if (isCollapsed) onToggleCollapse(); // Si estaba cerrado, abre la extensión suavemente
                    }}
                    title={`${s.label}: ${s.desc}`}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="w-8 h-[1px] bg-slate-800/80 my-0.5" />

          {/* BOTÓN GUARDAR CONFIGURACIÓN */}
          <button
            type="button"
            onClick={onOpenSaveModal}
            title="Guardar Configuración Actual (Plantilla, Marca o JSON)"
            className="w-11 h-11 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 flex items-center justify-center transition shadow-md hover:scale-105 active:scale-95"
          >
            <BookmarkCheck className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PANEL DE EXTENSIÓN DE CONTENIDO CON ANIMACIÓN SUAVE EN ENTRADA/SALIDA  */}
      {/* Transiciona fluidamente de 420px a 0px tanto al abrir como al cerrar     */}
      {/* ========================================================================= */}
      <div
        className={`h-full flex flex-col overflow-hidden bg-[#0B101B] border-r border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed
            ? 'w-0 opacity-0 pointer-events-none border-transparent'
            : 'w-[420px] xl:w-[460px] opacity-100'
        }`}
      >
        {/* Contenedor interior de anchura fija para evitar saltos durante la animación */}
        <div className="w-[420px] xl:w-[460px] h-full flex flex-col overflow-hidden">
          {/* Cabecera de la extensión: Título del paso + Botón Squircle Cerrar Sidebar */}
          <div className="px-3.5 py-3 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between gap-2 shrink-0">
            {/* Título del paso */}
            <div className="flex items-center gap-2 min-w-0 pr-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
              <span className="font-bold text-xs text-indigo-300 uppercase tracking-wider truncate">
                {stepTitles[state.activeStep]}
              </span>
            </div>

            {/* Botón Squircle de Cerrar Sidebar (idéntico al botón de referencia del usuario) */}
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Cerrar barra lateral"
              className="w-9 h-9 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-indigo-500/40 flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0 group"
            >
              <PanelLeftClose className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 transition-colors" />
            </button>
          </div>

          {/* Cuerpo del paso activo con scroll vertical */}
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
        </div>
      </div>
    </div>
  );
};
