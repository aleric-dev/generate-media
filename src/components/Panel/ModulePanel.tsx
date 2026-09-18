import React, { useState } from 'react';
import { 
  PostState, 
  ModuleType, 
  CodeWindowStyle,
  StepItem 
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
  Layers,
  Terminal,
  Monitor,
  Sparkles,
  ArrowRight,
  Type
} from 'lucide-react';
import { AccordionSection } from './AccordionSection';

interface ModulePanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const ModulePanel: React.FC<ModulePanelProps> = ({
  state,
  updateState
}) => {
  const [activeSection, setActiveSection] = useState<string | null>('module-content');

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
            : 'Totalmente, conectamos *ERPs*, *CRMs* y bases de datos a la nube.',
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

  // Helper común para renderizar el slider de escala dentro de la personalización de cada módulo
  const renderScaleControl = () => (
    <div className="pt-2.5 border-t border-slate-800">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[10px] text-slate-400 font-mono">
          Escala de este Módulo:
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
    <div className="space-y-3">

      {/* ========================================================================= */}
      {/* 1. GRUPO 1: TIPO DE MÓDULO CENTRAL (SOLO TOGGLE Y SELECCIÓN)              */}
      {/* ========================================================================= */}
      <AccordionSection
        id="module-type"
        title="1. Tipo de Módulo Central"
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
              className={`w-11 h-6 rounded-full transition-colors relative ${
                state.moduleVisible ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  state.moduleVisible ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {state.moduleVisible && (
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1.5">
                Seleccionar Tipo de Módulo:
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
                        // Abrir automáticamente el grupo 2 para personalizarlo de inmediato
                        setActiveSection('module-content');
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
            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2. GRUPO 2: PERSONALIZACIÓN DEL MÓDULO (CONTENIDO + ESTILO + ESCALA)      */}
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
              Activa la visibilidad del módulo en el Grupo 1 para personalizarlo.
            </p>
          ) : (
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3.5">

              {/* 1. MÓDULO DE CÓDIGO IDE */}
              {currentModule === 'code' && (
                <div className="space-y-3">
                  {/* Selector de Estilo de Ventana */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1.5 font-mono font-bold">
                      Estilo de Ventana de Código:
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
                            className={`py-1.5 px-2 rounded-lg border text-center transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {w.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Ruta / Archivo:</label>
                      <input
                        type="text"
                        value={state.codeFilename || 'server/pipeline.ts'}
                        onChange={(e) => updateState({ codeFilename: e.target.value })}
                        placeholder="server/pipeline.ts"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Lenguaje:</label>
                      <input
                        type="text"
                        value={state.codeLanguage || 'TypeScript'}
                        onChange={(e) => updateState({ codeLanguage: e.target.value })}
                        placeholder="TypeScript, Python, SQL..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showLineNumbers"
                        checked={state.codeShowLineNumbers !== false}
                        onChange={(e) => updateState({ codeShowLineNumbers: e.target.checked })}
                        className="accent-indigo-500 rounded"
                      />
                      <label htmlFor="showLineNumbers" className="text-xs text-slate-300 font-mono">
                        Números de línea
                      </label>
                    </div>

                    <div>
                      <select
                        value={state.codeFontSize || 13}
                        onChange={(e) => updateState({ codeFontSize: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                      >
                        {[11, 12, 13, 14, 15, 16, 17, 18].map((s) => (
                          <option key={s} value={s}>
                            Fuente: {s} px {s === 13 ? '(Defecto)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Código Fuente:</label>
                    <textarea
                      rows={5}
                      value={state.code || "system.migrate({ from: 'Inventario.xlsx', to: 'CloudDB' });"}
                      onChange={(e) => updateState({ code: e.target.value })}
                      placeholder="Escribe aquí tu código..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono leading-relaxed"
                    />
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 2. MÓDULO DE MÉTRICAS KPI */}
              {currentModule === 'kpi' && (
                <div className="space-y-3">
                  {/* Controles Generales de KPI: Gap y Columnas */}
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-slate-400 font-mono">Separación (Gap):</label>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">
                        {state.moduleKpiGap ?? 18} px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={36}
                      step={2}
                      value={state.moduleKpiGap ?? 18}
                      onChange={(e) => updateState({ moduleKpiGap: Number(e.target.value) })}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                    />

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono">
                      <span className="text-slate-400">Distribución Columnas:</span>
                      <div className="flex items-center gap-1">
                        {[
                          { id: 'auto', label: 'Auto' },
                          { id: '2', label: '2 Col' },
                          { id: '1', label: '1 Col' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => updateState({ moduleKpiCols: c.id as any })}
                            className={`px-2 py-0.5 rounded border transition ${
                              (state.moduleKpiCols || 'auto') === c.id
                                ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Tarjetas KPI ({state.kpis.length}/4)</span>
                    <button
                      type="button"
                      onClick={addKPICard}
                      disabled={state.kpis.length >= 4}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir KPI
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {state.kpis.map((kpi, idx) => (
                      <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-indigo-400 font-bold">Métrica #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            {/* Selector de Tendencia */}
                            <div className="flex items-center gap-1 text-[10px] font-mono">
                              {[
                                { id: 'up', label: '↗' },
                                { id: 'none', label: '•' },
                                { id: 'down', label: '↘' },
                              ].map((tr) => (
                                <button
                                  key={tr.id}
                                  type="button"
                                  onClick={() => updateKPI(idx, 'trend', tr.id)}
                                  className={`w-5 h-5 rounded flex items-center justify-center font-bold ${
                                    (kpi.trend || 'up') === tr.id ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
                                  }`}
                                >
                                  {tr.label}
                                </button>
                              ))}
                            </div>

                            {state.kpis.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeKPICard(idx)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Valor, Prefijo y Sufijo */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-0.5">Prefijo:</label>
                            <input
                              type="text"
                              value={kpi.prefix || ''}
                              onChange={(e) => updateKPI(idx, 'prefix', e.target.value)}
                              placeholder="$ o <"
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-0.5">Valor Central:</label>
                            <input
                              type="text"
                              value={kpi.val}
                              onChange={(e) => updateKPI(idx, 'val', e.target.value)}
                              placeholder="99"
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-0.5">Sufijo:</label>
                            <input
                              type="text"
                              value={kpi.suffix || ''}
                              onChange={(e) => updateKPI(idx, 'suffix', e.target.value)}
                              placeholder="%, s, x"
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                            />
                          </div>
                        </div>

                        {/* Etiqueta y Texto de Tendencia */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-0.5">Etiqueta Principal:</label>
                            <input
                              type="text"
                              value={kpi.label}
                              onChange={(e) => updateKPI(idx, 'label', e.target.value)}
                              placeholder="Eficiencia Operativa"
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-0.5">Texto Tendencia:</label>
                            <input
                              type="text"
                              value={kpi.trendLabel !== undefined ? kpi.trendLabel : (kpi.trend === 'up' ? 'Crecimiento' : kpi.trend === 'down' ? 'Reducción' : '')}
                              onChange={(e) => updateKPI(idx, 'trendLabel', e.target.value)}
                              placeholder="+35% YoY, Ahorro..."
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 3. MÓDULO DE BARRAS HORIZONTALES */}
              {currentModule === 'chart-bars' && (
                <div className="space-y-3">
                  {/* Grosor de Barra */}
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] text-slate-400 font-mono">Altura de Barra:</label>
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
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Barras ({state.chartBars.length}/5)</span>
                    <button
                      type="button"
                      onClick={addChartBar}
                      disabled={state.chartBars.length >= 5}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Barra
                    </button>
                  </div>

                  <div className="space-y-2">
                    {state.chartBars.map((bar, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                        <input
                          type="color"
                          value={bar.color || state.currentColor}
                          onChange={(e) => updateChart(idx, 'color', e.target.value)}
                          className="w-7 h-7 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0.5 shrink-0"
                        />
                        <input
                          type="text"
                          value={bar.label}
                          onChange={(e) => updateChart(idx, 'label', e.target.value)}
                          placeholder="Etiqueta..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                        <div className="w-16 flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={bar.pct}
                            onChange={(e) => updateChart(idx, 'pct', Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-xs text-white font-mono text-right"
                          />
                          <span className="text-xs text-slate-400 font-mono">%</span>
                        </div>
                        {state.chartBars.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChartBar(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 4. MÓDULO DE PASTEL / DONUT */}
              {currentModule === 'chart-pie' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto Central:</label>
                      <input
                        type="text"
                        value={state.chartDonutText || 'Total'}
                        onChange={(e) => updateState({ chartDonutText: e.target.value })}
                        placeholder="Total, Meta, Líder..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Grosor de Anillo:</label>
                      <select
                        value={state.chartDonutThickness || 'medium'}
                        onChange={(e) => updateState({ chartDonutThickness: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                      >
                        <option value="thin">Delgado</option>
                        <option value="medium">Medio</option>
                        <option value="full">Relleno</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Sectores ({state.chartBars.length}/5)</span>
                    <button
                      type="button"
                      onClick={addChartBar}
                      disabled={state.chartBars.length >= 5}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Sector
                    </button>
                  </div>

                  <div className="space-y-2">
                    {state.chartBars.map((bar, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                        <input
                          type="color"
                          value={bar.color || state.currentColor}
                          onChange={(e) => updateChart(idx, 'color', e.target.value)}
                          className="w-7 h-7 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0.5 shrink-0"
                        />
                        <input
                          type="text"
                          value={bar.label}
                          onChange={(e) => updateChart(idx, 'label', e.target.value)}
                          placeholder="Etiqueta..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                        <div className="w-16 flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={bar.pct}
                            onChange={(e) => updateChart(idx, 'pct', Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-xs text-white font-mono text-right"
                          />
                          <span className="text-xs text-slate-400 font-mono">%</span>
                        </div>
                        {state.chartBars.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChartBar(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 5. MÓDULO DE LÍNEAS / ÁREA */}
              {currentModule === 'chart-line' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Series de Datos:</label>
                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                        {[1, 2].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => updateState({ chartLineSeries: s as any })}
                            className={`py-1 rounded border text-center transition ${
                              (state.chartLineSeries || 1) === s
                                ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {s} {s === 1 ? 'Línea' : 'Líneas'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Grosor de Trazo:</label>
                      <select
                        value={state.chartLineStroke || 4}
                        onChange={(e) => updateState({ chartLineStroke: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-xs text-white font-mono"
                      >
                        {[2, 3, 4, 5, 6].map((st) => (
                          <option key={st} value={st}>{st} px</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {state.chartLineSeries === 2 && (
                    <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
                      <span className="text-[10px] text-slate-400">Color Línea 2:</span>
                      <input
                        type="color"
                        value={state.chartLineColor2 || '#06B6D4'}
                        onChange={(e) => updateState({ chartLineColor2: e.target.value })}
                        className="w-7 h-7 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0.5"
                      />
                      <span className="text-[10px] text-cyan-400 font-bold">{state.chartLineColor2 || '#06B6D4'}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Puntos de Tendencia ({state.chartBars.length}/5)</span>
                    <button
                      type="button"
                      onClick={addChartBar}
                      disabled={state.chartBars.length >= 5}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Punto
                    </button>
                  </div>

                  <div className="space-y-2">
                    {state.chartBars.map((bar, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                        <input
                          type="text"
                          value={bar.label}
                          onChange={(e) => updateChart(idx, 'label', e.target.value)}
                          placeholder="Q1, Mes 1..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                        <div className="w-20 flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={bar.pct}
                            onChange={(e) => updateChart(idx, 'pct', Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-xs text-white font-mono text-right"
                          />
                          <span className="text-xs text-slate-400 font-mono">%</span>
                        </div>
                        {state.chartBars.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChartBar(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 6. MÓDULO DE CHAT WHATSAPP */}
              {currentModule === 'chat' && (
                <div className="space-y-3">
                  <div className="p-2 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300">
                    💡 <strong>Tip de Formato</strong>: Usa <code>*texto*</code> para <strong>negrita</strong> y <code>_texto_</code> para <em>cursiva</em>.
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nombre Contacto:</label>
                      <input
                        type="text"
                        value={state.chatContactName || 'Asistente Digital'}
                        onChange={(e) => updateState({ chatContactName: e.target.value })}
                        placeholder="Asistente Digital"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Estado:</label>
                      <input
                        type="text"
                        value={state.chatOnlineStatus || 'en línea'}
                        onChange={(e) => updateState({ chatOnlineStatus: e.target.value })}
                        placeholder="en línea"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 pt-1">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Mensajes ({state.chatMessages.length}/5)</span>
                    <button
                      type="button"
                      onClick={addChatMessage}
                      disabled={state.chatMessages.length >= 5}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Mensaje
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {state.chatMessages.map((msg, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[10px] font-mono">
                            <button
                              type="button"
                              onClick={() => updateChatMessage(idx, 'sender', 'client')}
                              className={`px-2 py-0.5 rounded ${
                                msg.sender === 'client' ? 'bg-slate-800 text-white font-bold' : 'bg-slate-950 text-slate-400'
                              }`}
                            >
                              Cliente
                            </button>
                            <button
                              type="button"
                              onClick={() => updateChatMessage(idx, 'sender', 'bot')}
                              className={`px-2 py-0.5 rounded ${
                                msg.sender === 'bot' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400'
                              }`}
                            >
                              Asistente
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={msg.time}
                              onChange={(e) => updateChatMessage(idx, 'time', e.target.value)}
                              placeholder="10:14 AM"
                              className="w-20 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 font-mono text-center"
                            />
                            {state.chatMessages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeChatMessage(idx)}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={msg.text}
                          onChange={(e) => updateChatMessage(idx, 'text', e.target.value)}
                          placeholder="Escribe el mensaje..."
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 7. MÓDULO DE PASOS / FASES */}
              {currentModule === 'steps' && (
                <div className="space-y-3">
                  {/* Controles de Formato y Gap de Pasos */}
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-slate-400 font-mono">Separación (Gap):</label>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">
                        {state.stepsGap ?? 16} px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={32}
                      step={2}
                      value={state.stepsGap ?? 16}
                      onChange={(e) => updateState({ stepsGap: Number(e.target.value) })}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                    />

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono">
                      <span className="text-slate-400">Estilo de Etiqueta:</span>
                      <select
                        value={state.stepsFormat || 'fase'}
                        onChange={(e) => updateState({ stepsFormat: e.target.value as any })}
                        className="bg-slate-950 border border-slate-800 rounded p-1 text-xs text-white font-mono"
                      >
                        <option value="fase">FASE 01</option>
                        <option value="paso">PASO 01</option>
                        <option value="sprint">SPRINT 01</option>
                        <option value="hito">HITO A</option>
                        <option value="number">#01</option>
                        <option value="minimal">1 (Solo número)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      Etapas ({(state.stepsData || state.steps || []).length}/4)
                    </span>
                    <button
                      type="button"
                      onClick={addStepItem}
                      disabled={(state.stepsData || state.steps || []).length >= 4}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" /> Añadir Etapa
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(state.stepsData || state.steps || []).map((step, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-indigo-400 font-bold">Paso #{idx + 1}</span>
                          {(state.stepsData || state.steps || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStepItem(idx)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateStepItem(idx, 'title', e.target.value)}
                          placeholder="Título del paso..."
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-semibold"
                        />
                        <textarea
                          rows={2}
                          value={step.description || step.desc || ''}
                          onChange={(e) => updateStepItem(idx, 'desc', e.target.value)}
                          placeholder="Descripción y entregable..."
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </div>

                  {renderScaleControl()}
                </div>
              )}

              {/* 8. MÓDULO UNIFICADO: CITA / FRASE DE ACCIÓN */}
              {currentModule === 'quote-cta' && (
                <div className="space-y-3">
                  {/* Selector de Modo */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1.5 font-mono font-bold">
                      Variante de Cita / Impacto:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                      {[
                        { id: 'quote', label: '“ Gran Cita' },
                        { id: 'cta', label: '⚡ Frase Acción' },
                        { id: 'banner', label: '📢 Banner' },
                      ].map((m) => {
                        const isSelected = (state.quoteCtaMode || (state.activeModule === 'cta' ? 'cta' : state.contentHighlightStyle === 'banner' ? 'banner' : 'quote')) === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => updateState({ quoteCtaMode: m.id as any })}
                            className={`py-1.5 px-2 rounded-lg border text-center transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ESTILOS DE TEXTO: Tamaño de fuente y Tipografía para la Cita / Frase */}
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider block border-b border-slate-800 pb-1 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5" /> Estilo de Texto del Módulo
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Tamaño Texto:</label>
                        <select
                          value={state.moduleFontSize || 16}
                          onChange={(e) => updateState({ moduleFontSize: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-xs text-white font-mono"
                        >
                          {[14, 16, 18, 20, 22, 24, 26, 28].map((sz) => (
                            <option key={sz} value={sz}>{sz} px</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Tipografía:</label>
                        <select
                          value={state.subtitleFont || state.titleFont || 'font-inter'}
                          onChange={(e) => updateState({ subtitleFont: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-xs text-white font-mono"
                        >
                          <option value="font-inter">Inter Sans</option>
                          <option value="font-plus-jakarta">Plus Jakarta</option>
                          <option value="font-outfit">Outfit</option>
                          <option value="font-montserrat">Montserrat</option>
                          <option value="font-mono">Space Mono</option>
                          <option value="font-syne">Syne Heavy</option>
                          <option value="font-playfair">Playfair Serif</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Modo CITA */}
                  {(state.quoteCtaMode === 'quote' || (!state.quoteCtaMode && state.activeModule !== 'cta')) && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto de la Cita:</label>
                        <textarea
                          rows={3}
                          value={state.contentHighlightText || 'Automatiza tus flujos operativos y acelera el crecimiento con software a la medida.'}
                          onChange={(e) => updateState({ contentHighlightText: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white italic"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Autor:</label>
                          <input
                            type="text"
                            value={state.contentHighlightAuthor || ''}
                            onChange={(e) => updateState({ contentHighlightAuthor: e.target.value })}
                            placeholder="Nombre del autor"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Cargo / Rol:</label>
                          <input
                            type="text"
                            value={state.contentHighlightRole || ''}
                            onChange={(e) => updateState({ contentHighlightRole: e.target.value })}
                            placeholder="CEO, Founder..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modo FRASE ACCIÓN (CTA) */}
                  {state.quoteCtaMode === 'cta' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Badge de Impacto:</label>
                        <input
                          type="text"
                          value={state.ctaActionBadge || '⚡ SOLUCIÓN DIRECTA'}
                          onChange={(e) => updateState({ ctaActionBadge: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Frase de Impacto Principal:</label>
                        <textarea
                          rows={2}
                          value={state.ctaActionPhrase || 'Migra hoy tus procesos a la nube y reduce tiempos de respuesta en un 60%.'}
                          onChange={(e) => updateState({ ctaActionPhrase: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto del Botón CTA:</label>
                        <input
                          type="text"
                          value={state.ctaActionButtonText || 'Solicitar Diagnóstico Técnico ➔'}
                          onChange={(e) => updateState({ ctaActionButtonText: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Garantía / Beneficio:</label>
                        <input
                          type="text"
                          value={state.ctaActionBenefit || ''}
                          onChange={(e) => updateState({ ctaActionBenefit: e.target.value })}
                          placeholder="Sin costo inicial • Despliegue en 48h"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Modo BANNER */}
                  {state.quoteCtaMode === 'banner' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto Destacado:</label>
                        <textarea
                          rows={2}
                          value={state.contentHighlightText || '¿Listo para dar el siguiente salto tecnológico?'}
                          onChange={(e) => updateState({ contentHighlightText: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Firma / Autor:</label>
                          <input
                            type="text"
                            value={state.contentHighlightAuthor || ''}
                            onChange={(e) => updateState({ contentHighlightAuthor: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Badge Superior:</label>
                          <input
                            type="text"
                            value={state.ctaActionBadge || 'LLAMADO A LA ACCIÓN'}
                            onChange={(e) => updateState({ ctaActionBadge: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {renderScaleControl()}
                </div>
              )}

              {/* 9. MÓDULO DE IMÁGENES */}
              {currentModule === 'image' && (
                <div className="space-y-3">
                  {/* Proporción de Imagen (Aspect Ratio) & Fit */}
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Proporción de Imagen:</label>
                      <div className="grid grid-cols-5 gap-1 text-[10px] font-mono">
                        {[
                          { id: 'auto', label: 'Auto' },
                          { id: '1:1', label: '1:1' },
                          { id: '16:9', label: '16:9' },
                          { id: '4:5', label: '4:5' },
                          { id: '4:3', label: '4:3' },
                        ].map((ar) => (
                          <button
                            key={ar.id}
                            type="button"
                            onClick={() => updateState({ imageAspectRatio: ar.id as any })}
                            className={`py-1 rounded border text-center transition ${
                              (state.imageAspectRatio || 'auto') === ar.id
                                ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {ar.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono">
                      <span className="text-slate-400">Ajuste de Relleno:</span>
                      <div className="flex items-center gap-1">
                        {[
                          { id: 'cover', label: 'Cover' },
                          { id: 'contain', label: 'Contain' },
                        ].map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => updateState({ imageFit: f.id as any })}
                            className={`px-2 py-0.5 rounded border transition ${
                              (state.imageFit || 'cover') === f.id
                                ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Estilo de Marco */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Estilo de Borde:</label>
                    <select
                      value={state.imageBorderStyle || 'glass'}
                      onChange={(e) => updateState({ imageBorderStyle: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                    >
                      <option value="raw">Transparente Puro (Sin marco)</option>
                      <option value="glass">Cristal Glass</option>
                      <option value="neon">Borde Neón</option>
                      <option value="rounded">Redondeado Sólido</option>
                      <option value="double">Doble Línea</option>
                      <option value="dashed">Punteado</option>
                      <option value="shadow">Sombra Flotante</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Cargar Imagen</span>
                    <label className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition">
                      <Plus className="w-3 h-3" /> Subir Imagen
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="space-y-2">
                    {state.images.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                        <img
                          src={img.url}
                          alt={img.caption || `Img ${idx + 1}`}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <input
                          type="text"
                          value={img.caption || ''}
                          onChange={(e) => {
                            const updated = [...state.images];
                            updated[idx] = { ...updated[idx], caption: e.target.value };
                            updateState({ images: updated });
                          }}
                          placeholder="Pie de foto / Caption..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
                        />
                        {state.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => updateState({ images: state.images.filter((_, i) => i !== idx) })}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {renderScaleControl()}
                </div>
              )}

            </div>
          )}
        </div>
      </AccordionSection>

    </div>
  );
};
