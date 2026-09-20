import React, { useState } from 'react';
import { 
  PostState, 
  ModuleType, 
  CodeWindowStyle,
  StepItem,
  ImageBorderStyle 
} from '../../types';
import { 
  Sliders, 
  Code2, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  LineChart,
  MessageSquare, 
  ListOrdered, 
  Quote, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Box, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { AccordionSection } from './AccordionSection';

const MODULE_DOC_DATA: Record<string, { title: string; badgeText: string; usage: string; tip: string }> = {
  'code': {
    title: 'Ventana de Código IDE',
    badgeText: 'Devs & Tech Posts',
    usage: 'Muestra snippets de código, librerías, queries SQL o comandos de terminal de alto valor.',
    tip: 'Elige el sistema operativo para cambiar los controles de la ventana y activa números de línea.'
  },
  'kpi': {
    title: 'Métricas Clave de Rendimiento (KPI)',
    badgeText: 'Conversión & Tracción',
    usage: 'Destaca porcentajes de éxito, ROI, ahorro de tiempo o volumen de transacciones de forma impactante.',
    tip: 'Configura hasta 4 tarjetas con valor, etiqueta y tendencia alcista o bajista.'
  },
  'chart-bars': {
    title: 'Gráfico de Barras Horizontales',
    badgeText: 'Comparativas & Rankings',
    usage: 'Visualiza porcentajes de rendimiento, eficiencia o comparación entre metodologías.',
    tip: 'Añade barras, define su porcentaje y personaliza el color de cada métrica.'
  },
  'chart-pie': {
    title: 'Gráfico Donut / Pastel',
    badgeText: 'Distribución de Mercado',
    usage: 'Representa cuotas de mercado, distribución presupuestal o porcentajes de participación.',
    tip: 'Ajusta el grosor del anillo del donut y el texto central.'
  },
  'chart-line': {
    title: 'Gráfico de Tendencias & Área',
    badgeText: 'Evolución Temporal & Crecimiento',
    usage: 'Ilustra el crecimiento sostenido de usuarios, ingresos o ahorro de costes a lo largo del tiempo.',
    tip: 'Modifica el grosor del trazo de línea y las métricas de tendencia.'
  },
  'chat': {
    title: 'Simulación de Chat WhatsApp',
    badgeText: 'Prueba Social & Conversión',
    usage: 'Simula la interacción de un cliente haciendo una pregunta clave y la respuesta de valor de tu equipo.',
    tip: 'Edita los mensajes, el nombre del contacto y la hora.'
  },
  'steps': {
    title: 'Pasos & Fases Secuenciales',
    badgeText: 'How-To & Roadmaps',
    usage: 'Excelente para tutoriales, etapas de consultoría, fases de onboarding o sprints de entrega.',
    tip: 'Elige la nomenclatura de los pasos y define hasta 4 fases claras.'
  },
  'quote-cta': {
    title: 'Cita Editorial & Llamado a la Acción',
    badgeText: 'Impacto & Frases',
    usage: 'Resalta afirmaciones contundentes, testimonios de clientes satisfechos o banners directos a la acción.',
    tip: 'Cambia el modo entre Cita, Frase de Acción o Banner de Impacto sin datos forzados.'
  },
  'image': {
    title: 'Mockup de Imagen / Captura',
    badgeText: 'Showcase Visual & Producto',
    usage: 'Exhibe capturas de pantallas, dashboards, prototipos UI o fotos de productos en alta resolución.',
    tip: 'Sube tu archivo y ajusta el encuadre (contain o cover).'
  }
};

interface ModulePanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const ModulePanel: React.FC<ModulePanelProps> = ({
  state,
  updateState
}) => {
  const [activeSection, setActiveSection] = useState<string | null>('module-type');

  const toggleSection = (key: string) => {
    setActiveSection((prev) => (prev === key ? null : key));
  };

  // Helpers para KPIs
  const addKPICard = () => {
    if (state.kpis.length >= 4) return;
    updateState({
      kpis: [
        ...state.kpis,
        { 
          val: '+50%', 
          label: 'INCREMENTO DE EFICIENCIA', 
          prefix: '', 
          suffix: '', 
          trend: 'up', 
          trendLabel: 'Crecimiento',
          borderTop: true 
        }
      ]
    });
  };

  const removeKPICard = (idx: number) => {
    if (state.kpis.length <= 1) return;
    updateState({
      kpis: state.kpis.filter((_, i) => i !== idx)
    });
  };

  const updateKPI = (idx: number, key: keyof typeof state.kpis[0], val: any) => {
    const updated = [...state.kpis];
    updated[idx] = { ...updated[idx], [key]: val };
    updateState({ kpis: updated });
  };

  // Helpers para Gráficos
  const addChartBar = () => {
    if (state.chartBars.length >= 5) return;
    updateState({
      chartBars: [...state.chartBars, { label: 'Métrica Nueva', pct: 75, color: state.currentColor }]
    });
  };

  const removeChartBar = (idx: number) => {
    if (state.chartBars.length <= 1) return;
    updateState({
      chartBars: state.chartBars.filter((_, i) => i !== idx)
    });
  };

  const updateChart = (idx: number, key: 'label' | 'pct' | 'color', val: any) => {
    const updated = [...state.chartBars];
    if (key === 'pct') {
      updated[idx].pct = typeof val === 'number' ? val : parseInt(String(val), 10) || 0;
    } else {
      updated[idx][key] = val;
    }
    updateState({ chartBars: updated });
  };

  // Helpers para Chat WhatsApp
  const addChatMessage = () => {
    if (state.chatMessages.length >= 5) return;
    const isClient = state.chatMessages.length % 2 === 0;
    updateState({
      chatMessages: [
        ...state.chatMessages,
        {
          sender: isClient ? 'client' : 'bot',
          text: isClient 
            ? '¿Tienen soporte para integración con APIs existentes?' 
            : 'Totalmente, conectamos ERPs, CRMs y bases de datos a la nube.',
          time: '10:18 AM'
        }
      ]
    });
  };

  const removeChatMessage = (idx: number) => {
    if (state.chatMessages.length <= 1) return;
    updateState({
      chatMessages: state.chatMessages.filter((_, i) => i !== idx)
    });
  };

  const updateChatMessage = (idx: number, field: 'text' | 'time' | 'sender', val: any) => {
    const updated = [...state.chatMessages];
    updated[idx] = { ...updated[idx], [field]: val };
    updateState({ chatMessages: updated });
  };

  // Helpers para Pasos / Steps
  const addStepItem = () => {
    const steps = state.stepsData || state.steps || [];
    if (steps.length >= 4) return;
    const nextNum = steps.length + 1;
    const newSteps = [
      ...steps,
      { stepNumber: nextNum, step: `0${nextNum}`, title: `Fase 0${nextNum}`, desc: 'Descripción del entregable.', description: 'Descripción del entregable.' }
    ];
    updateState({ stepsData: newSteps, steps: newSteps });
  };

  const removeStepItem = (idx: number) => {
    const steps = state.stepsData || state.steps || [];
    if (steps.length <= 1) return;
    const filtered = steps.filter((_, i) => i !== idx).map((s, i) => ({ 
      ...s, 
      stepNumber: i + 1, 
      step: `0${i + 1}` 
    }));
    updateState({ stepsData: filtered, steps: filtered });
  };

  const updateStepItem = (idx: number, field: string, val: any) => {
    const steps = [...(state.stepsData || state.steps || [])];
    steps[idx] = { ...steps[idx], [field]: val };
    if (field === 'title') steps[idx].title = val;
    if (field === 'desc' || field === 'description') {
      steps[idx].desc = val;
      steps[idx].description = val;
    }
    updateState({ stepsData: steps, steps });
  };

  // Helpers para Imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        updateState({
          images: [{ url: dataUrl, caption: '' }]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Normalizador de Módulo Activo
  const getNormalizedActiveModule = (): ModuleType => {
    const m = state.activeModule;
    if (m === 'chart') {
      if (state.chartType === 'pie') return 'chart-pie';
      if (state.chartType === 'line') return 'chart-line';
      return 'chart-bars';
    }
    if (m === 'text' || m === 'cta' || m === 'promo') return 'quote-cta';
    return m;
  };

  const currentModule = getNormalizedActiveModule();

  // Helper común para renderizar el slider de escala interna del módulo
  const renderScaleControl = () => (
    <div className="pt-2.5 border-t border-slate-800">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[10px] text-slate-400 font-mono">
          Escala Interna del Módulo:
        </label>
        <span className="text-[10px] text-indigo-400 font-mono font-bold">
          {state.moduleScale || 100}%
        </span>
      </div>
      <input
        type="range"
        min={70}
        max={130}
        step={5}
        value={state.moduleScale || 100}
        onChange={(e) => updateState({ moduleScale: Number(e.target.value) })}
        className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
      />
    </div>
  );


  return (
    <div className="space-y-3.5">

      {/* ========================================================================= */}
      {/* 1. SELECCIÓN DE TIPO DE MÓDULO CENTRAL                                     */}
      {/* ========================================================================= */}
      <AccordionSection
        id="module-type"
        title="1. Selección de Módulo Central"
        icon={Sliders}
        badge={currentModule.toUpperCase()}
        isOpen={activeSection === 'module-type'}
        onToggle={() => toggleSection('module-type')}
      >
        <div className="space-y-3.5">
          {/* Toggle de Visibilidad General */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Visibilidad del Módulo Central
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateState({ moduleVisible: !state.moduleVisible })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                state.moduleVisible ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                  state.moduleVisible ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {state.moduleVisible && (
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1.5">
                Selecciona uno de los 9 Módulos Especializados:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                {[
                  { id: 'code' as ModuleType, label: 'Código IDE', icon: Code2 },
                  { id: 'kpi' as ModuleType, label: 'Métricas KPI', icon: TrendingUp },
                  { id: 'chart-bars' as ModuleType, label: 'Barras', icon: BarChart3 },
                  { id: 'chart-pie' as ModuleType, label: 'Donut Pastel', icon: PieChart },
                  { id: 'chart-line' as ModuleType, label: 'Líneas Área', icon: LineChart },
                  { id: 'chat' as ModuleType, label: 'WhatsApp', icon: MessageSquare },
                  { id: 'steps' as ModuleType, label: 'Pasos / Fases', icon: ListOrdered },
                  { id: 'quote-cta' as ModuleType, label: 'Cita / Frase', icon: Quote },
                  { id: 'image' as ModuleType, label: 'Mockup Imagen', icon: ImageIcon },
                ].map((m) => {
                  const IconComponent = m.icon;
                  const isSelected = currentModule === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        if (m.id === 'chart-bars') {
                          updateState({ activeModule: 'chart-bars', chartType: 'horizontal-bars' });
                        } else if (m.id === 'chart-pie') {
                          updateState({ activeModule: 'chart-pie', chartType: 'pie' });
                        } else if (m.id === 'chart-line') {
                          updateState({ activeModule: 'chart-line', chartType: 'line' });
                        } else {
                          updateState({ activeModule: m.id });
                        }
                      }}
                      className={`py-2.5 px-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {MODULE_DOC_DATA[currentModule] && (
                <div className="p-3 bg-gradient-to-r from-indigo-950/40 to-slate-900/60 border border-indigo-500/25 rounded-xl space-y-1.5 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-400" /> {MODULE_DOC_DATA[currentModule].title}
                    </span>
                    <span className="text-[9px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      {MODULE_DOC_DATA[currentModule].badgeText}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-indigo-300 font-medium">Uso ideal:</strong> {MODULE_DOC_DATA[currentModule].usage}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{MODULE_DOC_DATA[currentModule].tip}</span>
                  </p>
                </div>
              )}

            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2. PERSONALIZACIÓN DEL MÓDULO (DIRECTO, SIN INFO EXTRA)                    */}
      {/* ========================================================================= */}
      <AccordionSection
        id="module-content"
        title="2. Personalización del Módulo"
        icon={Box}
        badge={currentModule.toUpperCase()}
        isOpen={activeSection === 'module-content'}
        onToggle={() => toggleSection('module-content')}
      >
        <div className="space-y-3.5">
          {!state.moduleVisible ? (
            <p className="text-xs text-slate-400 italic p-3 text-center bg-slate-950/40 rounded-xl border border-slate-800">
              Activa la visibilidad del módulo en la Sección 1 para personalizar su contenido.
            </p>
          ) : (
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3.5">

              {/* 1. MÓDULO DE CÓDIGO IDE */}
              {currentModule === 'code' && (
                <div className="space-y-3">

                  {/* Selector de Estilo de Ventana */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1.5 font-mono font-bold">
                      Estilo de Ventana de Sistema:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                      {[
                        { id: 'macos' as CodeWindowStyle, label: '🍎 macOS' },
                        { id: 'windows' as CodeWindowStyle, label: '🪟 Windows' },
                        { id: 'linux' as CodeWindowStyle, label: '🐧 Linux' },
                        { id: 'bash' as CodeWindowStyle, label: '💻 Bash' },
                        { id: 'cmd' as CodeWindowStyle, label: '📟 CMD' },
                      ].map((w) => {
                        const isSelected = (state.codeWindowStyle || 'macos') === w.id;
                        return (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => updateState({ codeWindowStyle: w.id })}
                            className={`py-1.5 px-2 rounded-lg text-center transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {w.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tema de Sintaxis IDE */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1.5 font-mono font-bold">
                      Tema de Sintaxis / Paleta IDE:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                      {[
                        { id: 'tokyo-night', label: 'Tokyo Night' },
                        { id: 'cyber-emerald', label: 'Cyber Emerald' },
                        { id: 'monokai', label: 'Monokai' },
                        { id: 'one-dark', label: 'One Dark' },
                        { id: 'github-dark', label: 'GitHub Dark' },
                      ].map((th) => {
                        const isSelected = (state.codeTheme || 'tokyo-night') === th.id;
                        return (
                          <button
                            key={th.id}
                            type="button"
                            onClick={() => updateState({ codeTheme: th.id as any })}
                            className={`py-1 px-1.5 rounded-lg text-center text-[10px] transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {th.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nombre de Archivo y Lenguaje */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Archivo:</label>
                      <input
                        type="text"
                        value={state.codeFilename ?? ''}
                        onChange={(e) => updateState({ codeFilename: e.target.value })}
                        placeholder="pipeline.ts"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Lenguaje:</label>
                      <input
                        type="text"
                        value={state.codeLanguage ?? ''}
                        onChange={(e) => updateState({ codeLanguage: e.target.value })}
                        placeholder="TypeScript"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Opciones de Ventana IDE: Línea Destacada, Pestañas, Barra de Estado */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Línea Resaltada (#):</label>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={state.codeHighlightLine || 0}
                        onChange={(e) => updateState({ codeHighlightLine: Number(e.target.value) })}
                        placeholder="0 = ninguna"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800 mt-3.5">
                      <span className="text-[10px] text-slate-300 font-mono">Números Línea</span>
                      <button
                        type="button"
                        onClick={() => updateState({ codeShowLineNumbers: !state.codeShowLineNumbers })}
                        className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                          state.codeShowLineNumbers ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-transform transform ${
                            state.codeShowLineNumbers ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-300 font-mono">Pestañas IDE</span>
                      <button
                        type="button"
                        onClick={() => updateState({ codeShowTabs: state.codeShowTabs === false ? true : false })}
                        className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                          state.codeShowTabs !== false ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-transform transform ${
                            state.codeShowTabs !== false ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-300 font-mono">Barra Estado</span>
                      <button
                        type="button"
                        onClick={() => updateState({ codeShowStatusBar: state.codeShowStatusBar === false ? true : false })}
                        className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                          state.codeShowStatusBar !== false ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-transform transform ${
                            state.codeShowStatusBar !== false ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Código Fuente */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Código Fuente:</label>
                    <textarea
                      rows={5}
                      value={state.code ?? ''}
                      onChange={(e) => updateState({ code: e.target.value })}
                      placeholder="// Escribe o pega tu código aquí..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                    />
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 2. MÓDULO DE MÉTRICAS KPI */}
              {currentModule === 'kpi' && (
                <div className="space-y-3">

                  {/* Layout Bento vs Columnas */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono font-bold block">
                      Disposición de Tarjetas:
                    </label>
                    <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                      {[
                        { id: 'bento', label: '🍱 Bento' },
                        { id: 'auto', label: 'Auto' },
                        { id: '2', label: '2 Cols' },
                        { id: '1', label: '1 Col' },
                      ].map((col) => {
                        const isBentoActive = col.id === 'bento' && state.kpiLayout === 'bento';
                        const isColsActive = col.id !== 'bento' && state.kpiLayout !== 'bento' && (state.moduleKpiCols || 'auto') === col.id;
                        const isSelected = isBentoActive || isColsActive;

                        return (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => {
                              if (col.id === 'bento') {
                                updateState({ kpiLayout: 'bento' });
                              } else {
                                updateState({ kpiLayout: 'grid', moduleKpiCols: col.id as any });
                              }
                            }}
                            className={`py-1 px-1.5 rounded-lg text-center transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {col.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lista de Tarjetas KPI */}
                  <div className="space-y-2">
                    {state.kpis.map((kpi, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-indigo-400 font-bold">Métrica #{idx + 1}</span>
                          {state.kpis.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeKPICard(idx)}
                              className="text-slate-400 hover:text-rose-400 p-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-xs">
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono">Prefijo:</label>
                            <input
                              type="text"
                              value={kpi.prefix ?? ''}
                              onChange={(e) => updateKPI(idx, 'prefix', e.target.value)}
                              placeholder="Ej: +"
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono">Valor:</label>
                            <input
                              type="text"
                              value={kpi.val ?? ''}
                              onChange={(e) => updateKPI(idx, 'val', e.target.value)}
                              placeholder="99%"
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono">Sufijo:</label>
                            <input
                              type="text"
                              value={kpi.suffix ?? ''}
                              onChange={(e) => updateKPI(idx, 'suffix', e.target.value)}
                              placeholder="ms"
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-mono">Etiqueta Descriptiva:</label>
                          <input
                            type="text"
                            value={kpi.label ?? ''}
                            onChange={(e) => updateKPI(idx, 'label', e.target.value)}
                            placeholder="TIEMPO DE RESPUESTA"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white uppercase"
                          />
                        </div>

                        {/* Benchmark & Comparativa */}
                        <div>
                          <label className="text-[9px] text-slate-400 font-mono">Comparativa / Contexto:</label>
                          <input
                            type="text"
                            value={kpi.benchmark ?? ''}
                            onChange={(e) => updateKPI(idx, 'benchmark', e.target.value)}
                            placeholder="+18.4% vs mes anterior"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 font-mono"
                          />
                        </div>

                        {/* Barra de Progreso Objetivo */}
                        <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                          <span className="text-[9px] text-slate-400 font-mono">Barra Progreso Objetivo:</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={10}
                              max={100}
                              step={5}
                              value={kpi.progressPct ?? kpi.progressValue ?? 85}
                              onChange={(e) => updateKPI(idx, 'progressPct', Number(e.target.value))}
                              className="w-20 accent-indigo-500 bg-slate-900 h-1 rounded cursor-pointer"
                            />
                            <button
                              type="button"
                              onClick={() => updateKPI(idx, 'showProgress', !kpi.showProgress)}
                              className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                                kpi.showProgress ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500'
                              }`}
                            >
                              {kpi.showProgress ? 'Activa' : 'Off'}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                          <span className="text-slate-400">Tendencia:</span>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { id: 'up', label: '↑ Subida' },
                              { id: 'down', label: '↓ Bajada' },
                              { id: 'none', label: '— Neutro' },
                            ].map((tr) => (
                              <button
                                key={tr.id}
                                type="button"
                                onClick={() => updateKPI(idx, 'trend', tr.id)}
                                className={`px-2 py-0.5 rounded transition ${
                                  (kpi.trend || 'none') === tr.id
                                    ? 'bg-indigo-600 text-white font-bold'
                                    : 'bg-slate-950 border border-slate-800 text-slate-400'
                                }`}
                              >
                                {tr.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {state.kpis.length < 4 && (
                    <button
                      type="button"
                      onClick={addKPICard}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 rounded-xl text-xs font-mono text-indigo-300 flex items-center justify-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Otra Métrica KPI
                    </button>
                  )}

                  {renderScaleControl()}
                </div>
              )}

              {/* 3. MÓDULO DE GRÁFICO DE BARRAS */}
              {currentModule === 'chart-bars' && (
                <div className="space-y-3">

                  {/* Unidad de Medida y Toggle de Ranking */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Unidad de Valor:</label>
                      <input
                        type="text"
                        value={state.chartUnit ?? '%'}
                        onChange={(e) => updateState({ chartUnit: e.target.value })}
                        placeholder="%, $, k, ms..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800 mt-3.5">
                      <span className="text-[10px] text-slate-300 font-mono">Medallas #1-#3</span>
                      <button
                        type="button"
                        onClick={() => updateState({ chartShowRank: state.chartShowRank === false ? true : false })}
                        className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                          state.chartShowRank !== false ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-transform transform ${
                            state.chartShowRank !== false ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-400 font-mono">Altura de Barras:</label>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">
                      {state.chartBarHeight || 18} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={28}
                    step={2}
                    value={state.chartBarHeight || 18}
                    onChange={(e) => updateState({ chartBarHeight: Number(e.target.value) })}
                    className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                  />

                  <div className="space-y-2">
                    {state.chartBars.map((bar, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={bar.label ?? ''}
                            onChange={(e) => updateChart(idx, 'label', e.target.value)}
                            placeholder="Etiqueta de la métrica"
                            className="bg-transparent border-0 text-xs font-semibold text-white focus:outline-none flex-1"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={bar.color || state.currentColor}
                              onChange={(e) => updateChart(idx, 'color', e.target.value)}
                              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                            />
                            {state.chartBars.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeChartBar(idx)}
                                className="text-slate-400 hover:text-rose-400 p-0.5 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={bar.pct ?? 0}
                            onChange={(e) => updateChart(idx, 'pct', Number(e.target.value))}
                            className="flex-1 accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-indigo-400 w-12 text-right">
                            {bar.pct}{state.chartUnit || '%'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {state.chartBars.length < 5 && (
                    <button
                      type="button"
                      onClick={addChartBar}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 rounded-xl text-xs font-mono text-indigo-300 flex items-center justify-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Barra al Gráfico
                    </button>
                  )}

                  {renderScaleControl()}
                </div>
              )}

              {/* 4. MÓDULO DE GRÁFICO DONUT / PASTEL O GAUGE 180° */}
              {currentModule === 'chart-pie' && (
                <div className="space-y-3">

                  {/* Selector de Modo Donut 360 vs Gauge 180 */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono font-bold block">
                      Geometría del Gráfico:
                    </label>
                    <div className="grid grid-cols-2 gap-1 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => updateState({ chartPieMode: 'donut' })}
                        className={`py-1.5 px-2 rounded-lg text-center transition ${
                          (state.chartPieMode || 'donut') === 'donut'
                            ? 'bg-indigo-600 text-white font-bold shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        ⭕ Donut 360°
                      </button>
                      <button
                        type="button"
                        onClick={() => updateState({ chartPieMode: 'gauge' })}
                        className={`py-1.5 px-2 rounded-lg text-center transition ${
                          state.chartPieMode === 'gauge'
                            ? 'bg-indigo-600 text-white font-bold shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        ⏱️ Velocímetro 180°
                      </button>
                    </div>
                  </div>

                  {/* Métrica Central Hero */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Dato Central (Hero):</label>
                      <input
                        type="text"
                        value={state.chartDonutHeroText ?? ''}
                        onChange={(e) => updateState({ chartDonutHeroText: e.target.value })}
                        placeholder="Ej: 94%"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Etiqueta Central:</label>
                      <input
                        type="text"
                        value={state.chartDonutHeroSub ?? state.chartDonutText ?? ''}
                        onChange={(e) => updateState({ chartDonutHeroSub: e.target.value, chartDonutText: e.target.value })}
                        placeholder="Eficiencia"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Grosor de Anillo */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Grosor de Anillo:</label>
                    <select
                      value={state.chartDonutThickness || 'medium'}
                      onChange={(e) => updateState({ chartDonutThickness: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs"
                    >
                      <option value="thin">Delgada (Elegante)</option>
                      <option value="medium">Media (Equilibrada)</option>
                      <option value="full">Completa (Pastel)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    {state.chartBars.map((bar, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={bar.label ?? ''}
                            onChange={(e) => updateChart(idx, 'label', e.target.value)}
                            placeholder="Segmento"
                            className="bg-transparent border-0 text-xs font-semibold text-white focus:outline-none flex-1"
                          />
                          <input
                            type="color"
                            value={bar.color || state.currentColor}
                            onChange={(e) => updateChart(idx, 'color', e.target.value)}
                            className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={bar.pct ?? 0}
                            onChange={(e) => updateChart(idx, 'pct', Number(e.target.value))}
                            className="flex-1 accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-indigo-400 w-10 text-right">
                            {bar.pct}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 5. MÓDULO DE GRÁFICO DE LÍNEAS / ÁREA */}
              {currentModule === 'chart-line' && (
                <div className="space-y-3">

                  {/* Opciones de Curvatura y Guías */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-300 font-mono">Curva Spline</span>
                      <button
                        type="button"
                        onClick={() => updateState({ chartLineCurved: state.chartLineCurved === false ? true : false })}
                        className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                          state.chartLineCurved !== false ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-transform transform ${
                            state.chartLineCurved !== false ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-300 font-mono">Guías Cuadrícula</span>
                      <button
                        type="button"
                        onClick={() => updateState({ chartLineShowGrid: state.chartLineShowGrid === false ? true : false })}
                        className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                          state.chartLineShowGrid !== false ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-transform transform ${
                            state.chartLineShowGrid !== false ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Badge de ATH Máximo */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Etiqueta Pico ATH:</label>
                      <input
                        type="text"
                        value={state.chartLineAthLabel ?? '★ ATH MÁX'}
                        onChange={(e) => updateState({ chartLineAthLabel: e.target.value })}
                        placeholder="★ ATH MÁX"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800 mt-3.5">
                      <span className="text-[10px] text-slate-300 font-mono">Tooltip ATH</span>
                      <button
                        type="button"
                        onClick={() => updateState({ chartLineShowAth: state.chartLineShowAth === false ? true : false })}
                        className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                          state.chartLineShowAth !== false ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-transform transform ${
                            state.chartLineShowAth !== false ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Grosor de Trazo:</label>
                      <select
                        value={state.chartLineStroke || 4}
                        onChange={(e) => updateState({ chartLineStroke: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      >
                        <option value={2}>2 px (Fino)</option>
                        <option value={4}>4 px (Normal)</option>
                        <option value={6}>6 px (Grueso Neón)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Series:</label>
                      <div className="grid grid-cols-2 gap-1 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => updateState({ chartLineSeries: 1 })}
                          className={`py-1.5 px-2 rounded-lg ${
                            (state.chartLineSeries || 1) === 1 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                          }`}
                        >
                          1 Serie
                        </button>
                        <button
                          type="button"
                          onClick={() => updateState({ chartLineSeries: 2 })}
                          className={`py-1.5 px-2 rounded-lg ${
                            state.chartLineSeries === 2 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                          }`}
                        >
                          2 Series
                        </button>
                      </div>
                    </div>
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 6. MÓDULO DE CHAT MULTIPLATAFORMA */}
              {currentModule === 'chat' && (
                <div className="space-y-3">

                  {/* Selector de Plataforma */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">
                      Plataforma de Mensajería:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                      {[
                        { id: 'whatsapp', label: '🟢 WhatsApp' },
                        { id: 'imessage', label: '🔵 iMessage' },
                        { id: 'slack', label: '🟣 Slack' },
                      ].map((pl) => {
                        const isSelected = (state.chatPlatform || 'whatsapp') === pl.id;
                        return (
                          <button
                            key={pl.id}
                            type="button"
                            onClick={() => updateState({ chatPlatform: pl.id as any })}
                            className={`py-1.5 px-2 rounded-lg text-center transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {pl.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Contacto / Canal:</label>
                      <input
                        type="text"
                        value={state.chatContactName ?? ''}
                        onChange={(e) => updateState({ chatContactName: e.target.value })}
                        placeholder="Aleric Dev / #general"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Estado / Subtítulo:</label>
                      <input
                        type="text"
                        value={state.chatOnlineStatus ?? ''}
                        onChange={(e) => updateState({ chatOnlineStatus: e.target.value })}
                        placeholder="en línea"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Reacción Emoji y Nota de Voz */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Reacción Emoji Flotante:</label>
                      <div className="flex items-center gap-1">
                        {['❤️', '🔥', '🚀', '👍', '💯'].map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => updateState({ chatReaction: state.chatReaction === em ? undefined : em })}
                            className={`px-2 py-1 rounded text-xs transition ${
                              state.chatReaction === em ? 'bg-indigo-600 ring-1 ring-indigo-400' : 'bg-slate-900 hover:bg-slate-800'
                            }`}
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800 mt-3.5">
                      <span className="text-[10px] text-slate-300 font-mono">Nota de Voz</span>
                      <button
                        type="button"
                        onClick={() => updateState({ chatShowVoiceNote: !state.chatShowVoiceNote })}
                        className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${
                          state.chatShowVoiceNote ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full bg-white transition-transform transform ${
                            state.chatShowVoiceNote ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {state.chatMessages.map((msg, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateChatMessage(idx, 'sender', 'client')}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                msg.sender === 'client' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-950 text-slate-400'
                              }`}
                            >
                              Cliente
                            </button>
                            <button
                              type="button"
                              onClick={() => updateChatMessage(idx, 'sender', 'bot')}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                msg.sender === 'bot' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400'
                              }`}
                            >
                              Empresa
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={msg.time ?? ''}
                              onChange={(e) => updateChatMessage(idx, 'time', e.target.value)}
                              placeholder="10:14 AM"
                              className="bg-transparent border-0 text-[10px] font-mono text-slate-400 w-16 text-right focus:outline-none"
                            />
                            {state.chatMessages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeChatMessage(idx)}
                                className="text-slate-400 hover:text-rose-400 p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          value={msg.text ?? ''}
                          onChange={(e) => updateChatMessage(idx, 'text', e.target.value)}
                          placeholder="Texto del mensaje..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none"
                        />
                      </div>
                    ))}
                  </div>

                  {state.chatMessages.length < 5 && (
                    <button
                      type="button"
                      onClick={addChatMessage}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 rounded-xl text-xs font-mono text-indigo-300 flex items-center justify-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Mensaje al Chat
                    </button>
                  )}

                  {renderScaleControl()}
                </div>
              )}

              {/* 7. MÓDULO DE PASOS / FASES */}
              {currentModule === 'steps' && (
                <div className="space-y-3">

                  {/* Layout: Rejilla vs Timeline Conectada */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Diseño de Flujo:</label>
                      <select
                        value={state.stepsLayout || 'grid'}
                        onChange={(e) => updateState({ stepsLayout: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                      >
                        <option value="grid">Rejilla 2x2</option>
                        <option value="connected-timeline">Timeline Conectada</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nomenclatura:</label>
                      <select
                        value={state.stepsFormat || 'fase'}
                        onChange={(e) => updateState({ stepsFormat: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                      >
                        <option value="fase">Fase 01, Fase 02...</option>
                        <option value="paso">Paso 01, Paso 02...</option>
                        <option value="sprint">Sprint 01, Sprint 02...</option>
                        <option value="hito">Hito 01, Hito 02...</option>
                        <option value="number">01, 02, 03...</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(state.stepsData || state.steps || []).map((step, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={step.title ?? ''}
                            onChange={(e) => updateStepItem(idx, 'title', e.target.value)}
                            placeholder="Título del paso"
                            className="bg-transparent border-0 text-xs font-bold text-white focus:outline-none flex-1"
                          />
                          {(state.stepsData || state.steps || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStepItem(idx)}
                              className="text-slate-400 hover:text-rose-400 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={step.desc ?? step.description ?? ''}
                          onChange={(e) => updateStepItem(idx, 'desc', e.target.value)}
                          placeholder="Descripción breve del entregable..."
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </div>

                  {(state.stepsData || state.steps || []).length < 4 && (
                    <button
                      type="button"
                      onClick={addStepItem}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 rounded-xl text-xs font-mono text-indigo-300 flex items-center justify-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Siguiente Paso
                    </button>
                  )}

                  {renderScaleControl()}
                </div>
              )}

              {/* 8. MÓDULO DE CITA & LLAMADO A LA ACCIÓN (QUOTE-CTA-PROMO) */}
              {currentModule === 'quote-cta' && (
                <div className="space-y-3">

                  {/* Selector de Modo Enriquecido con Promo Ticket */}
                  <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                    {[
                      { id: 'quote', label: 'Cita VIP' },
                      { id: 'cta', label: 'Frase CTA' },
                      { id: 'banner', label: 'Banner' },
                      { id: 'promo', label: 'Ticket %' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => updateState({ quoteCtaMode: m.id as any })}
                        className={`py-1.5 px-1.5 rounded-lg text-center transition ${
                          (state.quoteCtaMode || 'cta') === m.id
                            ? 'bg-indigo-600 text-white font-bold shadow-sm'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Modo Cita VIP */}
                  {state.quoteCtaMode === 'quote' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto de la Cita:</label>
                        <textarea
                          rows={3}
                          value={state.contentHighlightText ?? ''}
                          onChange={(e) => updateState({ contentHighlightText: e.target.value })}
                          placeholder="Escribe la cita inspiradora o testimonial..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white italic"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Autor:</label>
                          <input
                            type="text"
                            value={state.contentHighlightAuthor ?? ''}
                            onChange={(e) => updateState({ contentHighlightAuthor: e.target.value })}
                            placeholder="Nombre Apellido"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Cargo / Rol:</label>
                          <input
                            type="text"
                            value={state.contentHighlightRole ?? ''}
                            onChange={(e) => updateState({ contentHighlightRole: e.target.value })}
                            placeholder="Directora Operaciones"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Empresa:</label>
                          <input
                            type="text"
                            value={state.quoteAuthorCompany ?? ''}
                            onChange={(e) => updateState({ quoteAuthorCompany: e.target.value })}
                            placeholder="Fintech Corp"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono">Estrellas de Calificación:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => updateState({ quoteRatingStars: st })}
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                (state.quoteRatingStars ?? 5) >= st ? 'text-amber-400 font-bold' : 'text-slate-600'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modo Frase de Acción (CTA) */}
                  {(state.quoteCtaMode === 'cta' || !state.quoteCtaMode) && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Badge de Impacto:</label>
                        <input
                          type="text"
                          value={state.ctaActionBadge ?? ''}
                          onChange={(e) => updateState({ ctaActionBadge: e.target.value })}
                          placeholder="SOLUCIÓN DIRECTA"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Frase Principal de Acción:</label>
                        <textarea
                          rows={2}
                          value={state.ctaActionPhrase ?? ''}
                          onChange={(e) => updateState({ ctaActionPhrase: e.target.value })}
                          placeholder="Escribe el beneficio concreto..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto del Botón:</label>
                          <input
                            type="text"
                            value={state.ctaActionButtonText ?? ''}
                            onChange={(e) => updateState({ ctaActionButtonText: e.target.value })}
                            placeholder="Comenzar Ahora ➔"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Sub-beneficio:</label>
                          <input
                            type="text"
                            value={state.ctaActionBenefit ?? ''}
                            onChange={(e) => updateState({ ctaActionBenefit: e.target.value })}
                            placeholder="Sin tarjetas ni permanencia"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Fila de Garantías (separadas por coma):</label>
                        <input
                          type="text"
                          value={(state.ctaGuarantees || ['Cero Riesgo', 'Soporte 24/7', 'Cancelación Libre']).join(', ')}
                          onChange={(e) => updateState({ ctaGuarantees: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          placeholder="Cero Riesgo, Soporte 24/7, Cancelación Libre"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Modo Banner VIP */}
                  {state.quoteCtaMode === 'banner' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Titular del Banner:</label>
                        <input
                          type="text"
                          value={state.ctaActionPhrase ?? ''}
                          onChange={(e) => updateState({ ctaActionPhrase: e.target.value })}
                          placeholder="OFERTA EXCLUSIVA"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Beneficio o Detalle:</label>
                        <input
                          type="text"
                          value={state.ctaActionBenefit ?? ''}
                          onChange={(e) => updateState({ ctaActionBenefit: e.target.value })}
                          placeholder="Diagnóstico inicial sin costo"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* Modo Ticket Cupón Promo */}
                  {state.quoteCtaMode === 'promo' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Código Cupón:</label>
                          <input
                            type="text"
                            value={state.promoCouponCode ?? 'ALERIC2025'}
                            onChange={(e) => updateState({ promoCouponCode: e.target.value })}
                            placeholder="ALERIC2025"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-emerald-400 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Badge de Descuento:</label>
                          <input
                            type="text"
                            value={state.promoDiscountBadge ?? '-30% DE DESCUENTO'}
                            onChange={(e) => updateState({ promoDiscountBadge: e.target.value })}
                            placeholder="-30% OFF"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-bold font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Frase de la Oferta:</label>
                        <input
                          type="text"
                          value={state.ctaActionPhrase ?? ''}
                          onChange={(e) => updateState({ ctaActionPhrase: e.target.value })}
                          placeholder="Acceso Ilimitado por tiempo limitado"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {renderScaleControl()}
                </div>
              )}

              {/* 9. MÓDULO DE MOCKUP IMAGEN (SAFARI, MOBILE, GLASS) */}
              {currentModule === 'image' && (
                <div className="space-y-3">

                  {/* Selector de Mockup Frame */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">
                      Estilo de Marco Mockup:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                      {[
                        { id: 'safari-browser', label: '🌐 macOS Safari' },
                        { id: 'mobile-frame', label: '📱 Mobile Frame' },
                        { id: 'glass-card', label: '💎 Cristal 3D' },
                        { id: 'clean-raw', label: '✨ Sin Marco' },
                      ].map((m) => {
                        const isSelected = (state.imageMockupType || 'clean-raw') === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => updateState({ imageMockupType: m.id as any })}
                            className={`py-1.5 px-2 rounded-lg text-center transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Cargar Imagen:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Proporción:</label>
                      <select
                        value={state.imageAspectRatio || 'auto'}
                        onChange={(e) => updateState({ imageAspectRatio: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      >
                        <option value="auto">Auto (Original)</option>
                        <option value="16:9">16:9 (Panorámica)</option>
                        <option value="1:1">1:1 (Cuadrada)</option>
                        <option value="4:5">4:5 (Vertical)</option>
                        <option value="4:3">4:3 (Estándar)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Ajuste de Encuadre:</label>
                      <select
                        value={state.imageFit || 'cover'}
                        onChange={(e) => updateState({ imageFit: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      >
                        <option value="cover">Cubrir (Cover)</option>
                        <option value="contain">Contener (Completa)</option>
                      </select>
                    </div>
                  </div>

                  {/* URL de Navegador y Badge de Showcase */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">URL en Barra Safari:</label>
                      <input
                        type="text"
                        value={state.imageBrowserUrl ?? 'aleric.dev/preview'}
                        onChange={(e) => updateState({ imageBrowserUrl: e.target.value })}
                        placeholder="aleric.dev/preview"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Badge de Showcase:</label>
                      <input
                        type="text"
                        value={state.imageShowcaseBadge ?? ''}
                        onChange={(e) => updateState({ imageShowcaseBadge: e.target.value })}
                        placeholder="★ DEMO EN VIVO"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Zoom de la Imagen */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-slate-400 font-mono">Zoom de la Imagen:</label>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">
                        {state.imageZoom || 100}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={150}
                      step={5}
                      value={state.imageZoom || 100}
                      onChange={(e) => updateState({ imageZoom: Number(e.target.value) })}
                      className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {state.images?.[0]?.url && (
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                      <img
                        src={state.images[0].url}
                        alt="Preview"
                        className="h-10 w-16 object-cover rounded-lg border border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => updateState({ images: [] })}
                        className="text-slate-400 hover:text-rose-400 text-xs font-mono p-1 rounded"
                      >
                        Quitar Imagen
                      </button>
                    </div>
                  )}

                  {renderScaleControl()}
                </div>
              )}

            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 3. CONTENEDOR & ESCALA TIPOGRÁFICA DEL MÓDULO                             */}
      {/* ========================================================================= */}
      <AccordionSection
        id="module-style"
        title="3. Contenedor & Tipografía del Módulo"
        icon={Sliders}
        badge={`${state.moduleFontSize || 15}px • ${state.moduleContainerStyle || 'glass'}`}
        isOpen={activeSection === 'module-style'}
        onToggle={() => toggleSection('module-style')}
      >
        <div className="space-y-4">
          
          {/* 1. TAMAÑO DE LETRA DEL MÓDULO CON SLIDER Y PRESETS RÁPIDOS */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Tamaño de Letra del Módulo
              </span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {state.moduleFontSize || 15} px
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Escala de forma coordinada textos, cifras KPI, bloques de código, pasos y leyendas dentro del módulo central.
            </p>

            <input
              type="range"
              min={12}
              max={30}
              step={1}
              value={state.moduleFontSize || 15}
              onChange={(e) => updateState({ moduleFontSize: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
            />

            {/* Presets Rápidos de Tamaño */}
            <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] font-mono">
              {[
                { size: 13, label: '13px', desc: 'Compacto' },
                { size: 15, label: '15px', desc: 'Normal' },
                { size: 18, label: '18px', desc: 'Medio' },
                { size: 22, label: '22px', desc: 'Grande' },
                { size: 26, label: '26px', desc: 'Titular' },
              ].map((p) => {
                const isSelected = (state.moduleFontSize || 15) === p.size;
                return (
                  <button
                    key={p.size}
                    type="button"
                    onClick={() => updateState({ moduleFontSize: p.size })}
                    className={`py-1.5 px-1 rounded-lg text-center transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="block font-bold">{p.label}</span>
                    <span className="text-[8px] opacity-75">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. ACABADO DE TARJETA / CONTENEDOR */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-indigo-400" /> Acabado del Contenedor
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                {state.moduleContainerStyle || 'glass'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'glass', label: 'Glassmorphism Estándar', desc: 'Superficie de vidrio suave con blur y borde sutil' },
                { id: 'solid', label: 'Tarjeta Sólida Minimal', desc: 'Fondo opaco con sombra de profundidad' },
                { id: 'neon', label: 'Borde Neón Brillante', desc: 'Borde de color de acento con halo luminoso' },
                { id: 'bracket', label: '[ Marco Bracket Tech ]', desc: 'Laterales gruesos con acento ciber/editorial' },
                { id: 'minimal', label: 'Minimalista Sin Fondo', desc: 'Completamente plano sin tarjeta ni bordes' },
              ].map((styleOpt) => {
                const isSelected = (state.moduleContainerStyle || 'glass') === styleOpt.id;
                return (
                  <button
                    key={styleOpt.id}
                    type="button"
                    onClick={() => updateState({ moduleContainerStyle: styleOpt.id as any })}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-900/50'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-mono font-bold block ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {styleOpt.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {styleOpt.desc}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. ESTILO DE BORDE PARA IMÁGENES / MOCKUPS */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <label className="text-[10px] text-slate-400 block font-mono">Estilo de Borde para Imágenes:</label>
            <select
              value={state.imageBorderStyle || 'none'}
              onChange={(e) => updateState({ imageBorderStyle: e.target.value as ImageBorderStyle })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="raw">✨ Sin Borde / Fondo Transparente (PNG)</option>
              <option value="none">Sin Borde Especial</option>
              <option value="rounded">Bordes Suaves Redondeados</option>
              <option value="glass">Marco Vidrio Glassmorphism</option>
              <option value="neon">Borde Neón Brillante</option>
              <option value="double">Doble Línea Cyber</option>
              <option value="dashed">Línea Punteada Blueprint</option>
              <option value="shadow">Sombra Flotante 3D</option>
            </select>
          </div>

          {/* 4. OPACIDAD Y RESPLANDOR NEÓN */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Opacidad Fondo:</span>
                <span className="text-indigo-400 font-bold">{state.moduleBgOpacity ?? 85}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={state.moduleBgOpacity ?? 85}
                onChange={(e) => updateState({ moduleBgOpacity: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Halo Neón:</span>
                <span className="text-indigo-400 font-bold">{state.moduleGlowIntensity ?? 30}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={state.moduleGlowIntensity ?? 30}
                onChange={(e) => updateState({ moduleGlowIntensity: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

        </div>
      </AccordionSection>

    </div>
  );
};
