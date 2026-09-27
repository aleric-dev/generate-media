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
  CheckCircle2,
  Split,
  Bell,
  Sparkles,
  Rocket,
  Zap,
  DollarSign,
  ArrowRight,
  Shield
} from 'lucide-react';
import { AccordionSection } from './AccordionSection';

const MODULE_OPTIONS = [
  { id: 'kpi' as ModuleType, label: 'Métricas KPI', icon: TrendingUp },
  { id: 'chart' as ModuleType, label: 'Gráficos', icon: BarChart3 },
  { id: 'comparison' as ModuleType, label: 'Comparativa', icon: Split },
  { id: 'chat' as ModuleType, label: 'WhatsApp', icon: MessageSquare },
  { id: 'code' as ModuleType, label: 'Código IDE', icon: Code2 },
  { id: 'notification' as ModuleType, label: 'Alerta Push', icon: Bell },
  { id: 'steps' as ModuleType, label: 'Pasos & Fases', icon: ListOrdered },
  { id: 'image' as ModuleType, label: 'Mockup Imagen', icon: ImageIcon },
];

const MODULE_LABELS: Record<string, string> = {
  kpi: 'Métricas KPI',
  chart: 'Gráficos de Datos',
  comparison: 'Comparativa Antes vs Hoy',
  chat: 'WhatsApp',
  code: 'Código IDE',
  notification: 'Alerta Push',
  steps: 'Pasos & Fases',
  image: 'Mockup de Imagen',
};

interface ModulePanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const ModulePanel: React.FC<ModulePanelProps> = ({
  state,
  updateState
}) => {
  const [activeSection, setActiveSection] = useState<string | null>('module-main');

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
    if (m === 'chart' || m === 'chart-bars' || m === 'chart-pie' || m === 'chart-line') {
      return 'chart';
    }
    if (m === 'quote-cta' || m === 'text' || m === 'cta' || m === 'promo') return 'notification';
    return m;
  };

  const currentModule = getNormalizedActiveModule();


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
        >
          <span
            className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
              state.moduleVisible ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Si la visibilidad está desactivada, NO MOSTRAR NADA MÁS */}
      {state.moduleVisible && (
        <>
          {/* ========================================================================= */}
          {/* 1. TIPO & CONTENIDO DEL MÓDULO CENTRAL                                     */}
          {/* ========================================================================= */}
          <AccordionSection
            id="module-main"
            title="1. Tipo & Contenido del Módulo Central"
            icon={Box}
            isOpen={activeSection === 'module-main'}
            onToggle={() => toggleSection('module-main')}
          >
            <div className="space-y-3.5">
              {/* Cuadrícula 3x3 de los 9 tipos de Módulo Central */}
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1.5 font-bold uppercase tracking-wider">
                  Tipo de Módulo Central:
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
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
              </div>

              {/* Subsección: Personalización de Contenido */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Contenido del Módulo Central
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">
                    {MODULE_LABELS[currentModule]}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3.5">

              {/* 0A. MÓDULO COMPARATIVA ANTES VS DESPUÉS */}
              {currentModule === 'comparison' && (
                <div className="space-y-3">

                  {/* Lado Antes / Problema */}
                  <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono font-bold text-rose-400 block uppercase">
                      🔴 Lado Izquierdo (Problema / Antes):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="text-[9px] text-slate-400 font-mono">Badge:</label>
                        <input
                          type="text"
                          value={state.comparisonBadgeLeft ?? 'ANTES'}
                          onChange={(e) => updateState({ comparisonBadgeLeft: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-rose-300 font-mono font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] text-slate-400 font-mono">Título:</label>
                        <input
                          type="text"
                          value={state.comparisonTitleLeft ?? 'Procesos Manuales & Excel'}
                          onChange={(e) => updateState({ comparisonTitleLeft: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 font-mono">Puntos Clave (1 por línea):</label>
                      <textarea
                        rows={3}
                        value={(state.comparisonPointsLeft || []).join('\n')}
                        onChange={(e) => updateState({ comparisonPointsLeft: e.target.value.split('\n').filter(Boolean) })}
                        placeholder="Escribe hasta 3 puntos clave..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 font-mono leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Lado Hoy / Solución */}
                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block uppercase">
                      🟢 Lado Derecho (Solución / Hoy):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="text-[9px] text-slate-400 font-mono">Badge:</label>
                        <input
                          type="text"
                          value={state.comparisonBadgeRight ?? 'HOY'}
                          onChange={(e) => updateState({ comparisonBadgeRight: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-emerald-300 font-mono font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[9px] text-slate-400 font-mono">Título:</label>
                        <input
                          type="text"
                          value={state.comparisonTitleRight ?? 'Plataforma Web a Medida'}
                          onChange={(e) => updateState({ comparisonTitleRight: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 font-mono">Puntos Clave (1 por línea):</label>
                      <textarea
                        rows={3}
                        value={(state.comparisonPointsRight || []).join('\n')}
                        onChange={(e) => updateState({ comparisonPointsRight: e.target.value.split('\n').filter(Boolean) })}
                        placeholder="Escribe hasta 3 puntos clave..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 font-mono leading-relaxed"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* 0B. MÓDULO NOTIFICACIÓN DE SISTEMA (PUSH ALERT) */}
              {currentModule === 'notification' && (
                <div className="space-y-3">
                  {/* Ícono de Notificación */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono font-bold block mb-1.5">
                      Ícono de la Notificación:
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 font-mono text-xs">
                      {[
                        { id: 'rocket', label: '🚀', name: 'Lanzamiento' },
                        { id: 'dollar', label: '💰', name: 'Venta' },
                        { id: 'zap', label: '⚡', name: 'Rendimiento' },
                        { id: 'shield', label: '🛡️', name: 'Seguridad' },
                        { id: 'bell', label: '🔔', name: 'Alerta' },
                        { id: 'check', label: '✓', name: 'Completado' },
                        { id: 'user', label: '👥', name: 'Usuario' },
                        { id: 'star', label: '⭐', name: 'Rating' },
                      ].map((ic) => (
                        <button
                          key={ic.id}
                          type="button"
                          onClick={() => updateState({ notificationIcon: ic.id as any })}
                          className={`py-1.5 rounded-lg text-center transition ${
                            (state.notificationIcon || 'rocket') === ic.id
                              ? 'bg-indigo-600 text-white font-bold ring-1 ring-indigo-400'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title={ic.name}
                        >
                          {ic.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nombre de Aplicación:</label>
                      <input
                        type="text"
                        value={state.notificationApp ?? 'Aleric Platform'}
                        onChange={(e) => updateState({ notificationApp: e.target.value })}
                        placeholder="Aleric Platform"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Marca de Tiempo:</label>
                      <input
                        type="text"
                        value={state.notificationTime ?? 'hace 2 min'}
                        onChange={(e) => updateState({ notificationTime: e.target.value })}
                        placeholder="hace 2 min"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">Título del Evento:</label>
                    <input
                      type="text"
                      value={state.notificationTitle ?? 'Despliegue a Producción'}
                      onChange={(e) => updateState({ notificationTitle: e.target.value })}
                      placeholder="Despliegue a Producción"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-indigo-400 block mb-1 font-mono font-bold">
                      Cifra / Métrica Destacada (Hero):
                    </label>
                    <input
                      type="text"
                      value={state.notificationHighlight ?? '+1,420 transacciones procesadas'}
                      onChange={(e) => updateState({ notificationHighlight: e.target.value })}
                      placeholder="+$14,500 USD / 99.99% Uptime"
                      className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg p-2 text-white font-mono font-black"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Mensaje Descriptivo:</label>
                    <textarea
                      rows={2}
                      value={state.notificationMessage ?? ''}
                      onChange={(e) => updateState({ notificationMessage: e.target.value })}
                      placeholder="Mensaje descriptivo del logro..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 resize-none leading-relaxed"
                    />
                  </div>

                </div>
              )}

              {/* 1. MÓDULO DE CÓDIGO IDE */}
              {currentModule === 'code' && (
                <div className="space-y-3">
                  {/* Fila superior con 2 selectores: Estilo de Ventana y Tema de Sintaxis */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">
                        Estilo de Ventana:
                      </label>
                      <select
                        value={state.codeWindowStyle || 'macos'}
                        onChange={(e) => updateState({ codeWindowStyle: e.target.value as CodeWindowStyle })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="macos">🍎 macOS Window</option>
                        <option value="windows">🪟 Windows Frame</option>
                        <option value="linux">🐧 Linux Terminal</option>
                        <option value="bash">💻 Bash Shell</option>
                        <option value="cmd">📟 CMD Prompt</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">
                        Tema de Sintaxis:
                      </label>
                      <select
                        value={state.codeTheme || 'tokyo-night'}
                        onChange={(e) => updateState({ codeTheme: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="tokyo-night">Tokyo Night</option>
                        <option value="cyber-emerald">Cyber Emerald</option>
                        <option value="monokai">Monokai</option>
                        <option value="one-dark">One Dark</option>
                        <option value="github-dark">GitHub Dark</option>
                      </select>
                    </div>
                  </div>

                  {/* Nombre de Archivo */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nombre de Archivo:</label>
                    <input
                      type="text"
                      value={state.codeFilename ?? ''}
                      onChange={(e) => updateState({ codeFilename: e.target.value })}
                      placeholder="pipeline.ts"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs"
                    />
                  </div>

                  {/* Código Fuente */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Código Fuente:</label>
                    <textarea
                      rows={6}
                      value={state.code ?? ''}
                      onChange={(e) => updateState({ code: e.target.value })}
                      placeholder="// Escribe o pega tu código aquí..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* 2. MÓDULO DE MÉTRICAS KPI */}
              {currentModule === 'kpi' && (
                <div className="space-y-3">
                  <div className="space-y-2.5">
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

                        {/* Título de la métrica */}
                        <div>
                          <label className="text-[9px] text-slate-400 font-mono">Título / Etiqueta:</label>
                          <input
                            type="text"
                            value={kpi.label ?? ''}
                            onChange={(e) => updateKPI(idx, 'label', e.target.value)}
                            placeholder="TIEMPO DE RESPUESTA"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white uppercase"
                          />
                        </div>

                        {/* Valor Principal y Tendencia Pequeña */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono">Valor Principal:</label>
                            <input
                              type="text"
                              value={kpi.val ?? ''}
                              onChange={(e) => updateKPI(idx, 'val', e.target.value)}
                              placeholder="99.9%"
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono">Variación / Crecimiento (Opcional):</label>
                            <input
                              type="text"
                              value={kpi.trendLabel ?? kpi.benchmark ?? ''}
                              onChange={(e) => {
                                updateKPI(idx, 'trendLabel', e.target.value);
                                updateKPI(idx, 'benchmark', e.target.value);
                              }}
                              placeholder="+18.4% / -2.1s"
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 font-mono"
                            />
                          </div>
                        </div>

                        {/* Botones de Tendencia */}
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
                                className={`px-2 py-1 rounded transition text-xs ${
                                  (kpi.trend || 'none') === tr.id
                                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
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
                </div>
              )}

              {/* 3. MÓDULO CENTRAL DE GRÁFICOS (BARRAS, DONUT, LÍNEAS) */}
              {currentModule === 'chart' && (
                <div className="space-y-3.5">
                  {/* Selector de Subtipo de Gráfico: Barras, Donut / Gauge, Líneas */}
                  <div className="p-1 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-3 gap-1 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => updateState({ chartType: 'horizontal-bars' })}
                      className={`py-2 px-2 rounded-lg text-center font-bold flex items-center justify-center gap-1.5 transition ${
                        (state.chartType || 'horizontal-bars') === 'horizontal-bars'
                          ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Barras</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateState({ chartType: 'pie' })}
                      className={`py-2 px-2 rounded-lg text-center font-bold flex items-center justify-center gap-1.5 transition ${
                        state.chartType === 'pie'
                          ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <PieChart className="w-3.5 h-3.5" />
                      <span>Donut</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateState({ chartType: 'line' })}
                      className={`py-2 px-2 rounded-lg text-center font-bold flex items-center justify-center gap-1.5 transition ${
                        state.chartType === 'line'
                          ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <LineChart className="w-3.5 h-3.5" />
                      <span>Líneas</span>
                    </button>
                  </div>

                  {/* Título Global del Gráfico (Opcional) */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Título del Gráfico (Opcional):</label>
                    <input
                      type="text"
                      value={state.chartTitle ?? ''}
                      onChange={(e) => updateState({ chartTitle: e.target.value })}
                      placeholder="Ej: Distribución de Tráfico / Rendimiento"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-medium focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Sub-editor: Barras */}
                  {(state.chartType || 'horizontal-bars') === 'horizontal-bars' && (
                    <div className="space-y-3">
                      {/* Unidad de Medida simple */}
                      <div className="flex items-center justify-between text-xs">
                        <label className="text-[10px] text-slate-400 font-mono">Unidad de Medida:</label>
                        <input
                          type="text"
                          value={state.chartUnit ?? '%'}
                          onChange={(e) => updateState({ chartUnit: e.target.value })}
                          placeholder="%"
                          className="w-20 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-center text-white font-mono text-xs"
                        />
                      </div>

                      {/* Lista de Barras */}
                      <div className="space-y-2">
                        {state.chartBars.map((bar, idx) => {
                          const isHighlighted = (state.chartHighlightIndex ?? 0) === idx;
                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl border space-y-1.5 transition ${
                                isHighlighted
                                  ? 'bg-slate-900 border-indigo-500/60 ring-1 ring-indigo-500/40'
                                  : 'bg-slate-900/60 border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={bar.label ?? ''}
                                  onChange={(e) => updateChart(idx, 'label', e.target.value)}
                                  placeholder="Etiqueta de la barra"
                                  className="bg-transparent border-0 text-xs font-semibold text-white focus:outline-none flex-1"
                                />
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => updateState({ chartHighlightIndex: idx })}
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                                      isHighlighted
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                                    }`}
                                  >
                                    {isHighlighted ? '★ Resaltada' : 'Resaltar'}
                                  </button>
                                  {state.chartBars.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeChartBar(idx)}
                                      className="text-slate-400 hover:text-rose-400 p-1 transition"
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
                          );
                        })}
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
                    </div>
                  )}

                  {/* Sub-editor: Donut / Gauge */}
                  {state.chartType === 'pie' && (() => {
                    const currentTotal = state.chartBars.reduce((sum, b) => sum + (b.pct || 0), 0);
                    const normalizeBars = () => {
                      if (!state.chartBars.length) return;
                      const sum = state.chartBars.reduce((s, b) => s + (b.pct || 0), 0) || 1;
                      let accumulated = 0;
                      const normalized = state.chartBars.map((b, i) => {
                        if (i === state.chartBars.length - 1) {
                          return { ...b, pct: Math.max(0, 100 - accumulated) };
                        }
                        const p = Math.round((b.pct / sum) * 100);
                        accumulated += p;
                        return { ...b, pct: p };
                      });
                      updateState({ chartBars: normalized });
                    };

                    return (
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
                          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Grosor de Trazo:</label>
                          <select
                            value={state.chartDonutThickness || 'medium'}
                            onChange={(e) => updateState({ chartDonutThickness: e.target.value as any })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="thin">Delgada (Elegante)</option>
                            <option value="medium">Media (Equilibrada)</option>
                            <option value="full">Completa (Pastel)</option>
                          </select>
                        </div>

                        {/* Total y botón de normalización */}
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">Total segmentos:</span>
                            <span className={`font-bold ${currentTotal === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {currentTotal}%
                            </span>
                          </div>
                          {currentTotal !== 100 && (
                            <button
                              type="button"
                              onClick={normalizeBars}
                              className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2 py-1 rounded transition"
                            >
                              ⚖️ Ajustar a 100%
                            </button>
                          )}
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
                      </div>
                    );
                  })()}

                  {/* Sub-editor: Línea / Tendencia */}
                  {state.chartType === 'line' && (
                    <div className="space-y-3">
                      {/* Opciones de Curvatura y Grosor */}
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

                        <div>
                          <select
                            value={state.chartLineStroke || 4}
                            onChange={(e) => updateState({ chartLineStroke: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                          >
                            <option value={2}>Línea Fina (2px)</option>
                            <option value={4}>Línea Normal (4px)</option>
                            <option value={6}>Línea Gruesa (6px)</option>
                          </select>
                        </div>
                      </div>

                      {/* Lista de Puntos (Fecha / Cantidad) */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 block font-mono font-bold">
                          Puntos de Tendencia (Fecha X / Cantidad Y):
                        </label>
                        {state.chartBars.map((pt, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
                            <div className="flex-1">
                              <label className="text-[9px] text-slate-500 font-mono block">Fecha / Etiqueta:</label>
                              <input
                                type="text"
                                value={pt.label ?? ''}
                                onChange={(e) => updateChart(idx, 'label', e.target.value)}
                                placeholder="Ene, Feb..."
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono"
                              />
                            </div>
                            <div className="w-24">
                              <label className="text-[9px] text-slate-500 font-mono block">Cantidad:</label>
                              <input
                                type="number"
                                value={pt.pct ?? 0}
                                onChange={(e) => updateChart(idx, 'pct', Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono font-bold"
                              />
                            </div>
                            {state.chartBars.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeChartBar(idx)}
                                className="text-slate-400 hover:text-rose-400 p-1 mt-3.5 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {state.chartBars.length < 6 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newIdx = state.chartBars.length + 1;
                            updateState({
                              chartBars: [
                                ...state.chartBars,
                                { label: `Q${newIdx}`, pct: Math.min(100, (state.chartBars[state.chartBars.length - 1]?.pct || 50) + 15) }
                              ]
                            });
                          }}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 rounded-xl text-xs font-mono text-indigo-300 flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" /> Añadir Punto de Tendencia
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 6. MÓDULO DE CHAT WHATSAPP */}
              {currentModule === 'chat' && (
                <div className="space-y-3">
                  {/* Selector de Tema Claro / Oscuro */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">
                        Tema de WhatsApp:
                      </label>
                      <div className="grid grid-cols-2 gap-1 font-mono">
                        <button
                          type="button"
                          onClick={() => updateState({ chatTheme: 'dark' })}
                          className={`py-1.5 px-2 rounded-lg text-center transition ${
                            (state.chatTheme || 'dark') === 'dark'
                              ? 'bg-indigo-600 text-white font-bold shadow-xs'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          🌙 Oscuro
                        </button>
                        <button
                          type="button"
                          onClick={() => updateState({ chatTheme: 'light' })}
                          className={`py-1.5 px-2 rounded-lg text-center transition ${
                            state.chatTheme === 'light'
                              ? 'bg-indigo-600 text-white font-bold shadow-xs'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          ☀️ Claro
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Fondo Personalizado (Opcional):</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={state.chatBgColor || (state.chatTheme === 'light' ? '#EFEAE2' : '#0B141A')}
                          onChange={(e) => updateState({ chatBgColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                        />
                        {state.chatBgColor && (
                          <button
                            type="button"
                            onClick={() => updateState({ chatBgColor: undefined })}
                            className="text-[10px] font-mono text-slate-400 hover:text-white underline"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nombre del Contacto / Empresa:</label>
                    <input
                      type="text"
                      value={state.chatContactName ?? ''}
                      onChange={(e) => updateState({ chatContactName: e.target.value })}
                      placeholder="Aleric Partner"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-medium text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Mensajes del Chat */}
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
                </div>
              )}

              {/* 7. MÓDULO DE PASOS / FASES */}
              {currentModule === 'steps' && (
                <div className="space-y-3">
                  {/* Selector de Variante Visual (4 opciones) */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">
                      Diseño Visual de Pasos:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                      {[
                        { id: 'timeline', label: 'Timeline Conectada' },
                        { id: 'bento', label: 'Tarjetas Bento' },
                        { id: 'minimal', label: 'Minimalista Limpio' },
                        { id: 'badges', label: 'Badges Compactos' },
                      ].map((variant) => {
                        const isSelected = (state.stepsVisualVariant || (state.stepsLayout === 'connected-timeline' ? 'timeline' : 'bento')) === variant.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => {
                              updateState({
                                stepsVisualVariant: variant.id as any,
                                stepsLayout: variant.id === 'timeline' ? 'connected-timeline' : 'grid'
                              });
                            }}
                            className={`py-2 px-2 rounded-lg text-center transition ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-xs ring-1 ring-indigo-400'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {variant.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(state.stepsData || state.steps || []).map((step, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-indigo-400 font-bold">Paso #{idx + 1}</span>
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
                          value={step.title ?? ''}
                          onChange={(e) => updateStepItem(idx, 'title', e.target.value)}
                          placeholder="Título del paso"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs font-bold text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          value={step.desc ?? step.description ?? ''}
                          onChange={(e) => updateStepItem(idx, 'desc', e.target.value)}
                          placeholder="Descripción breve del paso..."
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none"
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
                </div>
              )}

              {/* 8. MÓDULO DE IMAGEN */}
              {currentModule === 'image' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">Cargar Imagen:</label>
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
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
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
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="cover">Cubrir (Cover)</option>
                        <option value="contain">Contener (Completa)</option>
                      </select>
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
                </div>
              )}

            </div>
          </div>

                {/* Acceso Rápido: Personalizar Contenedor */}
                <button
                  type="button"
                  onClick={() => toggleSection('module-container')}
                  className="w-full py-2.5 px-3 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 hover:border-indigo-500/60 rounded-xl text-xs font-mono text-indigo-300 flex items-center justify-center gap-2 transition group cursor-pointer"
                >
                  <span>Personalizar Contenedor, Escala y Efectos</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </AccordionSection>

            {/* ========================================================================= */}
            {/* 2. CONTENEDOR & DIMENSIONES DEL MÓDULO CENTRAL                            */}
            {/* ========================================================================= */}
            <AccordionSection
              id="module-container"
              title="2. Contenedor & Dimensiones del Módulo Central"
              icon={Sliders}
              isOpen={activeSection === 'module-container'}
              onToggle={() => toggleSection('module-container')}
            >
              <div className="space-y-4">
                {/* 1. ACABADO DEL CONTENEDOR */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                    <Box className="w-3.5 h-3.5 text-indigo-400" /> Acabado del Contenedor:
                  </label>
                  <select
                    value={state.moduleContainerStyle || 'minimal'}
                    onChange={(e) => updateState({ moduleContainerStyle: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="minimal">Minimalista Sin Fondo (Plano)</option>
                    <option value="glass">Glassmorphism Estándar (Vidrio suave)</option>
                    <option value="solid">Tarjeta Sólida (Fondo opaco)</option>
                    <option value="neon">Borde Neón Brillante</option>
                    <option value="bracket">[ Marco Bracket Tech ]</option>
                  </select>
                </div>

                {/* 2. ESCALA GENERAL DEL MÓDULO */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Escala General del Módulo:
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {state.moduleScale || 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={150}
                    step={5}
                    value={state.moduleScale || 100}
                    onChange={(e) => updateState({ moduleScale: Number(e.target.value) })}
                    className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* 3. ESPACIADO / PADDING DEL CONTENEDOR */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      <Box className="w-3.5 h-3.5 text-indigo-400" /> Espaciado Interno (Padding):
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {state.modulePadding || 36} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={16}
                    max={64}
                    step={4}
                    value={state.modulePadding || 36}
                    onChange={(e) => updateState({ modulePadding: Number(e.target.value) })}
                    className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </AccordionSection>
    </>
  )}

    </div>
  );
};
