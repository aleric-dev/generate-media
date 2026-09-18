import React, { useState } from 'react';
import { 
  PostState, 
  ModuleType, 
  ChartType, 
  StepItem 
} from '../../types';
import { 
  Sliders, 
  Code2, 
  TrendingUp, 
  BarChart3, 
  MessageSquare, 
  ListOrdered, 
  Gift, 
  Zap, 
  Quote, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Box, 
  Layers
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
        { val: '+50%', label: 'INCREMENTO DE EFICIENCIA', prefix: '', suffix: '', trend: 'up', borderTop: true }
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

  const updateChart = (idx: number, key: 'label' | 'pct', val: string | number) => {
    const updated = [...state.chartBars];
    if (key === 'pct') {
      updated[idx].pct = typeof val === 'number' ? val : parseInt(String(val), 10) || 0;
    } else {
      updated[idx].label = val as string;
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
      { stepNumber: nextNum, step: `0${nextNum}`, title: `Fase 0${nextNum}`, desc: 'Descripción y entregables.', description: 'Descripción y entregables.' }
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
      updateState({
        images: [{ url: ev.target?.result as string, caption: file.name }],
        activeModule: 'image'
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">

      {/* ========================================================================= */}
      {/* 1. TIPO DE MÓDULO CENTRAL (SELECTOR VISUAL DE LOS 9 TIPOS & ESCALA)       */}
      {/* ========================================================================= */}
      <AccordionSection
        id="module-type"
        title="1. Tipo de Módulo Central"
        icon={Sliders}
        badge={state.moduleVisible ? `Módulo: ${state.activeModule.toUpperCase()}` : 'Oculto'}
        isOpen={activeSection === 'module-type'}
        onToggle={() => toggleSection('module-type')}
      >
        <div className="space-y-3.5">
          {/* Interruptor de Visibilidad */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <label className="text-xs text-white font-bold flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" /> Visibilidad del Módulo Central
            </label>
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
            <div className="space-y-3.5">
              {/* Cuadrícula de Selección de los 9 Módulos */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1.5 font-mono">
                  Seleccionar Tipo de Módulo Central:
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  {[
                    { id: 'code' as ModuleType, label: 'Código IDE', icon: Code2 },
                    { id: 'kpi' as ModuleType, label: 'Métricas KPI', icon: TrendingUp },
                    { id: 'chart' as ModuleType, label: 'Gráficos', icon: BarChart3 },
                    { id: 'chat' as ModuleType, label: 'WhatsApp', icon: MessageSquare },
                    { id: 'steps' as ModuleType, label: 'Pasos / Fases', icon: ListOrdered },
                    { id: 'promo' as ModuleType, label: 'Promo / Cupón', icon: Gift },
                    { id: 'cta' as ModuleType, label: 'Frase Acción', icon: Zap },
                    { id: 'text' as ModuleType, label: 'Gran Cita', icon: Quote },
                    { id: 'image' as ModuleType, label: 'Mockup Imagen', icon: ImageIcon },
                  ].map((m) => {
                    const IconComponent = m.icon;
                    const isSelected = state.activeModule === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => updateState({ activeModule: m.id })}
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

              {/* ESCALA DEL MÓDULO CON SLIDER */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] text-slate-400 font-mono">
                    Escala del Contenedor del Módulo:
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
            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2. PERSONALIZACIÓN DEL CONTENIDO DEL MÓDULO                              */}
      {/* ========================================================================= */}
      <AccordionSection
        id="module-content"
        title="2. Contenido del Módulo"
        icon={Box}
        badge={state.activeModule.toUpperCase()}
        isOpen={activeSection === 'module-content'}
        onToggle={() => toggleSection('module-content')}
      >
        <div className="space-y-3.5">
          {!state.moduleVisible ? (
            <p className="text-xs text-slate-400 italic p-3 text-center bg-slate-950/40 rounded-xl border border-slate-800">
              Activa la visibilidad del módulo en el Grupo 1 para editar su contenido.
            </p>
          ) : (
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">

                {/* 1. MÓDULO DE CÓDIGO IDE */}
                {state.activeModule === 'code' && (
                  <div className="space-y-3">
                    <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/20 rounded-lg text-[11px] text-indigo-300">
                      💻 <strong>Snippet IDE Mac</strong>: Simulación de ventana de desarrollo con semáforo, ruta, lenguaje y números de línea.
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
                          id="toggleLineNumbers"
                          checked={state.codeShowLineNumbers !== false}
                          onChange={(e) => updateState({ codeShowLineNumbers: e.target.checked })}
                          className="accent-indigo-500 rounded cursor-pointer"
                        />
                        <label htmlFor="toggleLineNumbers" className="text-xs font-mono text-slate-300 cursor-pointer">
                          Números de Línea
                        </label>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">Tamaño Fuente Código:</label>
                        <select
                          value={state.codeFontSize || 13}
                          onChange={(e) => updateState({ codeFontSize: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                        >
                          {[11, 12, 13, 14, 16].map((s) => (
                            <option key={s} value={s}>
                              {s} px {s === 13 ? '(Defecto)' : ''}
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
                  </div>
                )}

                {/* 2. MÓDULO DE MÉTRICAS KPI */}
                {state.activeModule === 'kpi' && (
                  <div className="space-y-3">
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

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-0.5">Valor Numérico:</label>
                              <input
                                type="text"
                                value={kpi.val}
                                onChange={(e) => updateKPI(idx, 'val', e.target.value)}
                                placeholder="+50%"
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-slate-400 font-mono block mb-0.5">Etiqueta Descriptiva:</label>
                              <input
                                type="text"
                                value={kpi.label}
                                onChange={(e) => updateKPI(idx, 'label', e.target.value)}
                                placeholder="Eficiencia Operativa"
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. MÓDULO DE GRÁFICOS */}
                {state.activeModule === 'chart' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Tipo de Gráfico:</label>
                      <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                        {[
                          { id: 'horizontal-bars' as ChartType, label: '📊 Barras Horiz.' },
                          { id: 'pie' as ChartType, label: '🍩 Donut / Pastel' },
                          { id: 'line' as ChartType, label: '📈 Tendencia Línea' },
                        ].map((ct) => (
                          <button
                            key={ct.id}
                            type="button"
                            onClick={() => updateState({ chartType: ct.id })}
                            className={`py-2 px-1 rounded-xl text-center transition ${
                              (state.chartType || 'horizontal-bars') === ct.id
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {ct.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-mono text-slate-300 font-semibold">Métricas ({state.chartBars.length}/5)</span>
                      <button
                        type="button"
                        onClick={addChartBar}
                        disabled={state.chartBars.length >= 5}
                        className="px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" /> Añadir Dato
                      </button>
                    </div>

                    <div className="space-y-2">
                      {state.chartBars.map((bar, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                          <input
                            type="text"
                            value={bar.label}
                            onChange={(e) => updateChart(idx, 'label', e.target.value)}
                            placeholder="Etiqueta"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={bar.pct}
                              onChange={(e) => updateChart(idx, 'pct', e.target.value)}
                              className="w-14 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono text-right font-bold"
                            />
                            <span className="text-slate-400 font-mono">%</span>
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
                  </div>
                )}

                {/* 4. MÓDULO DE CHAT WHATSAPP */}
                {state.activeModule === 'chat' && (
                  <div className="space-y-3">
                    <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300">
                      💬 <strong>Conversación WhatsApp</strong>: Simulación hiperrealista de atención al cliente o bot empresarial.
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nombre Contacto:</label>
                        <input
                          type="text"
                          value={state.chatContactName || 'Asistente Digital'}
                          onChange={(e) => updateState({ chatContactName: e.target.value })}
                          placeholder="Ej: Asistente Aleric"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Estado:</label>
                        <input
                          type="text"
                          value={state.chatOnlineStatus || 'en línea'}
                          onChange={(e) => updateState({ chatOnlineStatus: e.target.value })}
                          placeholder="en línea, escribiendo..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-emerald-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-mono text-slate-300 font-semibold">Mensajes ({state.chatMessages.length}/5)</span>
                      <button
                        type="button"
                        onClick={addChatMessage}
                        disabled={state.chatMessages.length >= 5}
                        className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" /> Añadir Mensaje
                      </button>
                    </div>

                    <div className="space-y-2">
                      {state.chatMessages.map((msg, idx) => (
                        <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <select
                              value={msg.sender}
                              onChange={(e) => updateChatMessage(idx, 'sender', e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[11px] font-mono text-white"
                            >
                              <option value="client">Cliente (Gris)</option>
                              <option value="bot">Empresa / Bot (Verde WhatsApp)</option>
                            </select>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={msg.time}
                                onChange={(e) => updateChatMessage(idx, 'time', e.target.value)}
                                placeholder="10:14 AM"
                                className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400 text-center"
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

                          <input
                            type="text"
                            value={msg.text}
                            onChange={(e) => updateChatMessage(idx, 'text', e.target.value)}
                            placeholder="Texto del mensaje..."
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. MÓDULO DE PASOS / FASES */}
                {state.activeModule === 'steps' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-mono text-slate-300 font-semibold">
                        Etapas / Fases ({(state.stepsData || state.steps || []).length}/4)
                      </span>
                      <button
                        type="button"
                        onClick={addStepItem}
                        disabled={(state.stepsData || state.steps || []).length >= 4}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" /> Añadir Fase
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(state.stepsData || state.steps || []).map((st, idx) => (
                        <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-indigo-400 font-bold">
                              Fase {st.stepNumber || st.step || idx + 1}
                            </span>
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
                            value={st.title}
                            onChange={(e) => updateStepItem(idx, 'title', e.target.value)}
                            placeholder="Título del paso"
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-semibold"
                          />
                          <input
                            type="text"
                            value={st.description || st.desc || ''}
                            onChange={(e) => updateStepItem(idx, 'description', e.target.value)}
                            placeholder="Descripción breve..."
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. MÓDULO DE PROMO / OFERTA */}
                {state.activeModule === 'promo' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Badge Lanzamiento:</label>
                        <input
                          type="text"
                          value={state.promo?.badge || state.promoData?.badge || 'OFERTA LIMITADA'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateState({ 
                              promo: { ...(state.promo || { title: '', description: '', coupon: '', cta: '' }), badge: val },
                              promoData: { ...(state.promoData || { title: '', description: '', coupon: '', cta: '' }), badge: val }
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Código Cupón:</label>
                        <input
                          type="text"
                          value={state.promo?.coupon || state.promoData?.coupon || 'PROMO2026'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateState({ 
                              promo: { ...(state.promo || { badge: '', title: '', description: '', cta: '' }), coupon: val },
                              promoData: { ...(state.promoData || { badge: '', title: '', description: '', cta: '' }), coupon: val }
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-indigo-400 font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Título Principal de la Oferta:</label>
                      <input
                        type="text"
                        value={state.promo?.title || state.promo?.headline || state.promoData?.title || '50% OFF en Tu Primer Despliegue'}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateState({ 
                            promo: { ...(state.promo || { badge: '', description: '', coupon: '', cta: '' }), title: val, headline: val },
                            promoData: { ...(state.promoData || { badge: '', description: '', coupon: '', cta: '' }), title: val }
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Gancho Comercial (Subtítulo):</label>
                      <input
                        type="text"
                        value={state.promo?.subtitle || state.promo?.subheadline || state.promoData?.subtitle || 'Acelera tu operación antes de cerrar el mes.'}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateState({ 
                            promo: { ...(state.promo || { badge: '', title: '', description: '', coupon: '', cta: '' }), subtitle: val, subheadline: val },
                            promoData: { ...(state.promoData || { badge: '', title: '', description: '', coupon: '', cta: '' }), subtitle: val }
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Propuesta de Valor Detallada:</label>
                      <textarea
                        rows={3}
                        value={state.promo?.description || state.promoData?.description || 'Válido para nuevos clientes en desarrollo cloud y modernización.'}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateState({ 
                            promo: { ...(state.promo || { badge: '', title: '', coupon: '', cta: '' }), description: val },
                            promoData: { ...(state.promoData || { badge: '', title: '', coupon: '', cta: '' }), description: val }
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 leading-relaxed resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Botón de Reclamo:</label>
                        <input
                          type="text"
                          value={state.promo?.cta || state.promoData?.cta || 'Reclamar Oferta'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateState({ 
                              promo: { ...(state.promo || { badge: '', title: '', description: '', coupon: '' }), cta: val },
                              promoData: { ...(state.promoData || { badge: '', title: '', description: '', coupon: '' }), cta: val }
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Condiciones / Letra Pequeña:</label>
                        <input
                          type="text"
                          value={state.promo?.finePrint || state.promoData?.finePrint || 'Válido hasta agotar cupos'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateState({ 
                              promo: { ...(state.promo || { badge: '', title: '', description: '', coupon: '', cta: '' }), finePrint: val },
                              promoData: { ...(state.promoData || { badge: '', title: '', description: '', coupon: '', cta: '' }), finePrint: val }
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-400 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. MÓDULO DE FRASE DE ACCIÓN (CTA DIRECTO) */}
                {state.activeModule === 'cta' && (
                  <div className="space-y-3">
                    <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/20 rounded-lg text-[11px] text-indigo-300">
                      ⚡ <strong>Patrón Problema ➔ Acción</strong>: El titular expone el dolor operativo y esta tarjeta ofrece la solución inmediata.
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Badge de Acción:</label>
                      <input
                        type="text"
                        value={state.ctaActionBadge || '⚡ SOLUCIÓN DIRECTA'}
                        onChange={(e) => updateState({ ctaActionBadge: e.target.value })}
                        placeholder="Ej: ⚡ SOLUCIÓN DIRECTA"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Punchline / Frase Persuasiva:</label>
                      <textarea
                        rows={2}
                        value={state.ctaActionPhrase || 'Migra hoy tus procesos a la nube y reduce tiempos de respuesta en un 60%.'}
                        onChange={(e) => updateState({ ctaActionPhrase: e.target.value })}
                        placeholder="¿Qué acción o solución específica ejecuta tu producto?"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white leading-relaxed resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Botón de Acción:</label>
                      <input
                        type="text"
                        value={state.ctaActionButtonText || 'Solicitar Diagnóstico Técnico ➔'}
                        onChange={(e) => updateState({ ctaActionButtonText: e.target.value })}
                        placeholder="Ej: Agendar Demostración en Vivo ➔"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Garantía / Beneficio al Pie:</label>
                      <input
                        type="text"
                        value={state.ctaActionBenefit || 'Diagnóstico inicial sin costo • Despliegue en producción garantizado'}
                        onChange={(e) => updateState({ ctaActionBenefit: e.target.value })}
                        placeholder="Ej: Sin permanencia mínima • Soporte 24/7"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                      />
                    </div>
                  </div>
                )}

                {/* 8. MÓDULO DE GRAN CITA / TEXTO */}
                {state.activeModule === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Estilo Visual de la Cita:</label>
                      <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                        {[
                          { id: 'quote', label: 'Cita con Comillas' },
                          { id: 'banner', label: 'Banner de Impacto' },
                          { id: 'card', label: 'Tarjeta Glass' },
                        ].map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => updateState({ contentHighlightStyle: st.id as any })}
                            className={`py-1.5 px-2 rounded-lg text-center transition ${
                              (state.contentHighlightStyle || 'card') === st.id
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}
                          >
                            <span className="text-[10px]">{st.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto de la Cita / Frase:</label>
                      <textarea
                        rows={3}
                        value={state.contentHighlightText || 'Automatiza tu operación y escala sin límites con software a la medida.'}
                        onChange={(e) => updateState({ contentHighlightText: e.target.value })}
                        placeholder="Escribe la frase o reflexión..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Autor / Portavoz:</label>
                        <input
                          type="text"
                          value={state.contentHighlightAuthor || 'Ricardo Zapata'}
                          onChange={(e) => updateState({ contentHighlightAuthor: e.target.value })}
                          placeholder="Ej: Ricardo Zapata"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Cargo / Referencia:</label>
                        <input
                          type="text"
                          value={state.contentHighlightRole || 'Lead Software Architect'}
                          onChange={(e) => updateState({ contentHighlightRole: e.target.value })}
                          placeholder="Ej: Lead Software Architect"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. MÓDULO DE MOCKUP IMAGEN */}
                {state.activeModule === 'image' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-mono text-slate-300 font-semibold">Imágenes / Mockups</span>
                      <label className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer">
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
                  </div>
                )}

              </div>
            )}
          </div>
        </AccordionSection>

        {/* ========================================================================= */}
        {/* 3. PERSONALIZACIÓN DE ESTILO DEL MÓDULO (DE PUNTA A PUNTA)                */}
        {/* ========================================================================= */}
        <AccordionSection
          id="module-style"
          title="3. Estilo Visual del Módulo"
          icon={Layers}
          badge={(state.moduleContainerStyle || 'glass').toUpperCase()}
          isOpen={activeSection === 'module-style'}
          onToggle={() => toggleSection('module-style')}
        >
          <div className="space-y-3.5">
            {!state.moduleVisible ? (
              <p className="text-xs text-slate-400 italic p-3 text-center bg-slate-950/40 rounded-xl border border-slate-800">
                Activa la visibilidad del módulo en el Grupo 1 para personalizar su estilo.
              </p>
            ) : (
              <div className="space-y-3.5">
                {/* 1. Estilo de Contenedor */}
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1.5">
                    Estilo de Contenedor:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    {[
                      { id: 'glass', label: 'Cristal Glass' },
                      { id: 'solid', label: 'Sólido High-Contrast' },
                      { id: 'neon', label: 'Borde Neón Glow' },
                      { id: 'bracket', label: 'Corchetes Bracket' },
                      { id: 'minimal', label: 'Minimal Plano' },
                    ].map((style) => {
                      const isSelected = (state.moduleContainerStyle || 'glass') === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => updateState({ moduleContainerStyle: style.id as any })}
                          className={`py-2 px-2.5 rounded-xl border text-left truncate transition ${
                            isSelected
                              ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200 font-bold shadow-sm'
                              : 'bg-slate-950 border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white'
                          }`}
                        >
                          {style.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Opacidad del Fondo con Slider */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] text-slate-400 font-mono">
                      Opacidad del Fondo del Módulo:
                    </label>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">
                      {state.moduleBgOpacity ?? 85}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={state.moduleBgOpacity ?? 85}
                    onChange={(e) => updateState({ moduleBgOpacity: Number(e.target.value) })}
                    className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* 3. Radio de Esquinas & Grosor de Borde */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1">
                      Redondeo de Esquinas:
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { id: 'none', label: '0px' },
                        { id: 'md', label: '8px' },
                        { id: 'xl', label: '16px' },
                        { id: 'full', label: 'Pill' },
                      ].map((r) => {
                        const isSelected = (state.moduleBorderRadius || 'xl') === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => updateState({ moduleBorderRadius: r.id as any })}
                            className={`py-1.5 rounded-lg border text-center transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {r.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1">
                      Grosor de Borde:
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {[0, 1, 2, 3].map((w) => {
                        const isSelected = (state.moduleBorderWidth ?? 1) === w;
                        return (
                          <button
                            key={w}
                            type="button"
                            onClick={() => updateState({ moduleBorderWidth: w })}
                            className={`py-1.5 rounded-lg border text-center transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {w}px
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Resplandor / Glow Neón con Slider */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] text-slate-400 font-mono">
                      Intensidad de Resplandor / Glow:
                    </label>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">
                      {state.moduleGlowIntensity ?? 30}%
                    </span>
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

                {/* 5. Escala de Tipografía Interna con Slider */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] text-slate-400 font-mono">
                      Tamaño de Tipografía Interna:
                    </label>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">
                      {state.moduleFontSize || 14} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={11}
                    max={24}
                    step={1}
                    value={state.moduleFontSize || 14}
                    onChange={(e) => updateState({ moduleFontSize: Number(e.target.value) })}
                    className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* 6. Esquema Cromático del Módulo */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="text-[10px] text-slate-400 font-mono block mb-1.5">
                    Esquema Cromático del Módulo:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-mono mb-2">
                    {[
                      { id: 'accent', label: 'Color Marca' },
                      { id: 'mono', label: 'Neutro Mono' },
                      { id: 'custom', label: 'Custom' },
                    ].map((mode) => {
                      const isSelected = (state.moduleColorMode || 'accent') === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => updateState({ moduleColorMode: mode.id as any })}
                          className={`py-1.5 px-1 rounded-lg border text-center transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold shadow-sm'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {mode.label}
                        </button>
                      );
                    })}
                  </div>

                  {state.moduleColorMode === 'custom' && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="color"
                        value={state.moduleCustomColor || '#06B6D4'}
                        onChange={(e) => updateState({ moduleCustomColor: e.target.value })}
                        className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={state.moduleCustomColor || '#06B6D4'}
                        onChange={(e) => updateState({ moduleCustomColor: e.target.value })}
                        placeholder="#06B6D4"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </AccordionSection>

    </div>
  );
};
