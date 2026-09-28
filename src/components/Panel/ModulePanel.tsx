import React, { useState } from 'react';
import { PostState, ModuleType } from '../../types';
import { AccordionSection } from './AccordionSection';
import {
  Sliders,
  TrendingUp,
  BarChart3,
  GitCompare,
  Code2,
  MessageSquare,
  Bell,
  ListOrdered,
  Image as ImageIcon,
  ArrowRight,
  PieChart,
  Activity
} from 'lucide-react';
import {
  KpiModuleConfig,
  ChartBarsModuleConfig,
  ChartDonutModuleConfig,
  ChartLineModuleConfig,
  ChatModuleConfig,
  CodeModuleConfig,
  ComparisonModuleConfig,
  NotificationModuleConfig,
  StepsModuleConfig,
  ImageMockupModuleConfig,
  ContainerDimensionsConfig
} from './modules';

interface ModulePanelProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const ModulePanel: React.FC<ModulePanelProps> = ({ state, updateState }) => {
  const [activeSection, setActiveSection] = useState<string | null>('module-content');

  const toggleSection = (id: string) => {
    setActiveSection(prev => prev === id ? null : id);
  };

  // Normalizador del módulo activo
  const getNormalizedActiveModule = (): ModuleType => {
    const m = state.activeModule;
    if (m === 'chart' || m === 'chart-bars' || m === 'chart-pie' || m === 'chart-line') {
      return 'chart';
    }
    if (m === 'quote-cta' || m === 'text' || m === 'cta' || m === 'promo') {
      return 'notification';
    }
    return m;
  };

  const currentModule = getNormalizedActiveModule();

  // 8 Módulos centrales en cuadrícula simétrica 4x2
  const MODULE_OPTIONS: { id: ModuleType; label: string; icon: any }[] = [
    { id: 'kpi', label: 'Métricas KPI', icon: TrendingUp },
    { id: 'chart', label: 'Gráficos', icon: BarChart3 },
    { id: 'comparison', label: 'Comparativa', icon: GitCompare },
    { id: 'code', label: 'Código IDE', icon: Code2 },
    { id: 'chat', label: 'WhatsApp', icon: MessageSquare },
    { id: 'notification', label: 'Notificación', icon: Bell },
    { id: 'steps', label: 'Pasos / Fases', icon: ListOrdered },
    { id: 'image', label: 'Imagen Mockup', icon: ImageIcon }
  ];

  const MODULE_LABELS: Record<string, string> = {
    kpi: 'Métricas KPI',
    chart: 'Gráfico Analítico',
    comparison: 'Comparativa Antes vs Hoy',
    code: 'Editor de Código IDE',
    chat: 'WhatsApp Chat',
    notification: 'Notificación / Push Alert',
    steps: 'Pasos & Fases',
    image: 'Imagen Mockup'
  };

  const chartType = state.chartType || 'horizontal-bars';

  return (
    <div className="space-y-3.5">
      {/* 1. Toggle Maestro de Visibilidad del Módulo Central */}
      <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <div>
            <span className="text-xs font-mono font-bold text-slate-200 block">
              Visibilidad del Módulo Central
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              {state.moduleVisible ? 'Módulo activo en el lienzo' : 'Módulo apagado (oculto)'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => updateState({ moduleVisible: !state.moduleVisible })}
          className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
            state.moduleVisible ? 'bg-indigo-600' : 'bg-slate-800'
          }`}
          title="Alternar visibilidad del módulo central"
        >
          <span
            className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
              state.moduleVisible ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Si el módulo está desactivado, no se muestra nada más */}
      {state.moduleVisible && (
        <>
          {/* ========================================================================= */}
          {/* 1. SELECCIÓN DE TIPO DE MÓDULO CENTRAL                                    */}
          {/* ========================================================================= */}
          <AccordionSection
            id="module-type"
            title="1. Tipo de Módulo Central"
            icon={Sliders}
            isOpen={activeSection === 'module-type'}
            onToggle={() => toggleSection('module-type')}
          >
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Selecciona el módulo para el lienzo:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {MODULE_OPTIONS.map((m) => {
                  const IconComponent = m.icon;
                  const isSelected = currentModule === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        if (m.id === 'chart') {
                          updateState({ activeModule: 'chart', chartType: state.chartType || 'horizontal-bars' });
                        } else {
                          updateState({ activeModule: m.id });
                        }
                      }}
                      className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center gap-1 relative cursor-pointer text-center ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span className="text-[9px] leading-tight font-medium truncate w-full">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Botón de acceso directo al contenido del módulo */}
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => setActiveSection('module-content')}
                  className="w-full py-2 px-3 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-xs font-mono text-indigo-300 hover:text-white transition flex items-center justify-between group"
                >
                  <span>Editar contenido de {MODULE_LABELS[currentModule] || 'este módulo'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </AccordionSection>

          {/* ========================================================================= */}
          {/* 2. CONTENIDO DEL MÓDULO + ESCALA INTEGRADA                                */}
          {/* ========================================================================= */}
          <AccordionSection
            id="module-content"
            title={`2. Contenido (${MODULE_LABELS[currentModule] || 'Módulo'})`}
            icon={BarChart3}
            isOpen={activeSection === 'module-content'}
            onToggle={() => toggleSection('module-content')}
          >
            <div className="space-y-4">
              {/* Formulario de Contenido Específico */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3.5">
                {/* KPI */}
                {currentModule === 'kpi' && (
                  <KpiModuleConfig state={state} updateState={updateState} />
                )}

                {/* GRÁFICOS (Barras / Donut / Líneas) */}
                {currentModule === 'chart' && (
                  <div className="space-y-3">
                    {/* Pestañas de tipo de gráfico */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => updateState({ activeModule: 'chart', chartType: 'horizontal-bars' })}
                        className={`py-1.5 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1 transition ${
                          chartType === 'horizontal-bars'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Barras</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateState({ activeModule: 'chart', chartType: 'pie' })}
                        className={`py-1.5 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1 transition ${
                          chartType === 'pie'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <PieChart className="w-3.5 h-3.5" />
                        <span>Donut / Pie</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateState({ activeModule: 'chart', chartType: 'line' })}
                        className={`py-1.5 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1 transition ${
                          chartType === 'line'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Líneas</span>
                      </button>
                    </div>

                    {chartType === 'horizontal-bars' && (
                      <ChartBarsModuleConfig state={state} updateState={updateState} />
                    )}
                    {chartType === 'pie' && (
                      <ChartDonutModuleConfig state={state} updateState={updateState} />
                    )}
                    {chartType === 'line' && (
                      <ChartLineModuleConfig state={state} updateState={updateState} />
                    )}
                  </div>
                )}

                {/* COMPARATIVA */}
                {currentModule === 'comparison' && (
                  <ComparisonModuleConfig state={state} updateState={updateState} />
                )}

                {/* CÓDIGO IDE */}
                {currentModule === 'code' && (
                  <CodeModuleConfig state={state} updateState={updateState} />
                )}

                {/* WHATSAPP CHAT */}
                {currentModule === 'chat' && (
                  <ChatModuleConfig state={state} updateState={updateState} />
                )}

                {/* NOTIFICACIÓN / PUSH ALERT */}
                {currentModule === 'notification' && (
                  <NotificationModuleConfig state={state} updateState={updateState} />
                )}

                {/* PASOS / FASES */}
                {currentModule === 'steps' && (
                  <StepsModuleConfig state={state} updateState={updateState} />
                )}

                {/* IMAGEN MOCKUP */}
                {currentModule === 'image' && (
                  <ImageMockupModuleConfig state={state} updateState={updateState} />
                )}
              </div>

              {/* ESCALA GENERAL UNIFORME INTEGRADA DIRECTAMENTE AL FINAL DEL CONTENIDO */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Escala y Proporción General del Módulo
                </span>
                <ContainerDimensionsConfig state={state} updateState={updateState} />
              </div>
            </div>
          </AccordionSection>
        </>
      )}
    </div>
  );
};
