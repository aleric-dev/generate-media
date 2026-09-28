import React, { useState } from 'react';
import { PostState, ChartBar } from '../../../types';
import {
  TrendingUp,
  Zap,
  Activity,
  ArrowUpDown,
  TrendingDown,
  BarChart3,
  Sparkles,
  Sliders,
  Flame,
  CheckCircle2,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface ChartLineModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

const SEQUENCE_MAP: Record<string, string[]> = {
  meses: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  trimestres: ['Q1', 'Q2', 'Q3', 'Q4'],
  semanas: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8', 'Sem 9', 'Sem 10', 'Sem 11', 'Sem 12'],
  anos: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031']
};

interface TrendPreset {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  // Función matemática normalizada: t va de 0 a 1, devuelve valor numérico
  generate: (t: number) => number;
}

const TREND_PRESETS: TrendPreset[] = [
  {
    id: 'growth',
    name: 'Crecimiento Sólido',
    subtitle: 'Ascenso constante',
    icon: TrendingUp,
    generate: (t) => Math.round(20 + 78 * t)
  },
  {
    id: 'hyper',
    name: 'Despegue Exponencial',
    subtitle: 'Hockey stick SaaS',
    icon: Zap,
    generate: (t) => Math.round(15 + 125 * Math.pow(t, 2.2))
  },
  {
    id: 'recovery',
    name: 'Recuperación en V',
    subtitle: 'Valle y rebote',
    icon: ArrowUpDown,
    generate: (t) => Math.round(t < 0.45 ? 85 - 60 * (t / 0.45) : 25 + 85 * ((t - 0.45) / 0.55))
  },
  {
    id: 'peak-drop',
    name: 'Pico y Corrección',
    subtitle: 'Máximo y ajuste',
    icon: TrendingDown,
    generate: (t) => Math.round(t < 0.45 ? 25 + 85 * (t / 0.45) : 110 - 70 * ((t - 0.45) / 0.55))
  },
  {
    id: 'stability',
    name: 'Estabilidad Plena',
    subtitle: 'Métricas consistentes',
    icon: Activity,
    generate: (t) => Math.round(70 + Math.sin(t * Math.PI * 4) * 4)
  },
  {
    id: 'bullish',
    name: 'Alcista con Volatilidad',
    subtitle: 'Oscilaciones positivas',
    icon: BarChart3,
    generate: (t) => Math.round(30 + 75 * t + Math.sin(t * Math.PI * 5) * 14)
  },
  {
    id: 'step-up',
    name: 'Salto Cuántico',
    subtitle: 'Nuevo nivel operativo',
    icon: Sparkles,
    generate: (t) => Math.round(t < 0.5 ? 32 + t * 6 : 88 + (t - 0.5) * 8)
  },
  {
    id: 'wave',
    name: 'Ciclo Ondulado',
    subtitle: 'Estacionalidad periódica',
    icon: Sliders,
    generate: (t) => Math.round(65 + Math.sin(t * Math.PI * 3.5) * 25)
  },
  {
    id: 'rally',
    name: 'Rally Parabólico',
    subtitle: 'Subida sin pausas',
    icon: Flame,
    generate: (t) => Math.round(10 + 140 * Math.pow(t, 1.5))
  },
  {
    id: 'plateau',
    name: 'Ajuste y Meseta',
    subtitle: 'Caída hacia estabilidad',
    icon: CheckCircle2,
    generate: (t) => Math.round(t < 0.45 ? 95 - 45 * (t / 0.45) : 50 + (t - 0.45) * 2)
  }
];

export const ChartLineModuleConfig: React.FC<ChartLineModuleConfigProps> = ({ state, updateState }) => {
  const currentPoints = state.chartLinePoints || [];
  const currentFirstLabel = currentPoints[0]?.label || 'Jul';
  const initialCount = Math.max(3, Math.min(12, currentPoints.length || 6));

  const [pointsCount, setPointsCount] = useState<number>(initialCount);
  const [selectedTrendId, setSelectedTrendId] = useState<string>('growth');
  const [seqType, setSeqType] = useState<string>('meses');
  const [firstHito, setFirstHito] = useState<string>(currentFirstLabel);

  const generateLabels = (type: string, start: string, count: number): string[] => {
    const list = SEQUENCE_MAP[type] || SEQUENCE_MAP.meses;
    const startIndex = list.indexOf(start) >= 0 ? list.indexOf(start) : 0;
    return Array.from({ length: count }).map((_, i) => list[(startIndex + i) % list.length]);
  };

  const computePoints = (trendId: string, count: number, type: string, start: string): ChartBar[] => {
    const preset = TREND_PRESETS.find(p => p.id === trendId) || TREND_PRESETS[0];
    const labels = generateLabels(type, start, count);

    return Array.from({ length: count }).map((_, i) => {
      const t = count > 1 ? i / (count - 1) : 0.5;
      const val = preset.generate(t);
      return {
        label: labels[i] || `P${i + 1}`,
        pct: Math.max(0, val),
        color: state.currentColor
      };
    });
  };

  const handleSelectTrend = (trendId: string) => {
    setSelectedTrendId(trendId);
    const newPoints = computePoints(trendId, pointsCount, seqType, firstHito);
    updateState({
      chartLinePoints: newPoints,
      chartLineLabels: newPoints.map(p => p.label).join(', '),
      chartLineValues: newPoints.map(p => p.pct).join(', ')
    });
  };

  const handlePointsCountChange = (newCount: number) => {
    setPointsCount(newCount);
    const newPoints = computePoints(selectedTrendId, newCount, seqType, firstHito);
    updateState({
      chartLinePoints: newPoints,
      chartLineLabels: newPoints.map(p => p.label).join(', '),
      chartLineValues: newPoints.map(p => p.pct).join(', ')
    });
  };

  const handleSeqTypeChange = (newType: string) => {
    setSeqType(newType);
    const firstOption = (SEQUENCE_MAP[newType] || SEQUENCE_MAP.meses)[0];
    setFirstHito(firstOption);
    const newPoints = computePoints(selectedTrendId, pointsCount, newType, firstOption);
    updateState({
      chartLinePoints: newPoints,
      chartLineLabels: newPoints.map(p => p.label).join(', '),
      chartLineValues: newPoints.map(p => p.pct).join(', ')
    });
  };

  const handleFirstHitoChange = (newStart: string) => {
    setFirstHito(newStart);
    const newPoints = computePoints(selectedTrendId, pointsCount, seqType, newStart);
    updateState({
      chartLinePoints: newPoints,
      chartLineLabels: newPoints.map(p => p.label).join(', '),
      chartLineValues: newPoints.map(p => p.pct).join(', ')
    });
  };

  // Calcular porcentaje de altura actual (50% a 100%, mapeado internamente a 200px - 300px)
  const currentHeightPct = state.chartLineHeightPct !== undefined
    ? Math.min(100, Math.max(50, state.chartLineHeightPct))
    : (state.chartLineHeight
        ? Math.min(100, Math.max(50, Math.round(50 + ((state.chartLineHeight - 200) / 100) * 50)))
        : 50);

  return (
    <div className="space-y-3.5">
      {/* 1. TÍTULO DE LA CURVA (PRIMERO ABSOLUTO, OPCIONAL) CON ALINEACIÓN */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-400 font-mono">
            Título de la Curva (Opcional):
          </label>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => updateState({ chartTitleAlign: 'left' })}
              title="Alinear a la Izquierda"
              className={`p-1 rounded cursor-pointer transition ${
                (state.chartTitleAlign || 'left') === 'left'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => updateState({ chartTitleAlign: 'center' })}
              title="Centrar Título"
              className={`p-1 rounded cursor-pointer transition ${
                state.chartTitleAlign === 'center'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => updateState({ chartTitleAlign: 'right' })}
              title="Alinear a la Derecha"
              className={`p-1 rounded cursor-pointer transition ${
                state.chartTitleAlign === 'right'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <input
          type="text"
          value={state.chartTitle ?? ''}
          onChange={(e) => updateState({ chartTitle: e.target.value })}
          placeholder="Ej: Tendencia de Crecimiento / Precios"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* 2. COMPORTAMIENTO DE TENDENCIA (10 OPCIONES) — PRIMERO DE LAS LÍNEAS */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-300 font-mono font-bold uppercase tracking-wider block">
            Comportamiento de Tendencia (10 Opciones):
          </label>
          <span className="text-[9px] font-mono text-indigo-400 font-semibold">
            {pointsCount} puntos
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {TREND_PRESETS.map((preset) => {
            const IconComp = preset.icon;
            const isSelected = selectedTrendId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectTrend(preset.id)}
                className={`p-2 rounded-xl border text-left transition flex items-start gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 border-indigo-400 ring-1 ring-indigo-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-900 text-indigo-400'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold leading-tight break-words">
                    {preset.name}
                  </span>
                  <span
                    className={`text-[9.5px] leading-tight mt-0.5 ${
                      isSelected ? 'text-indigo-100 opacity-90' : 'text-slate-400'
                    }`}
                  >
                    {preset.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CANTIDAD DE PUNTOS EN SLIDER (3 A 12 PUNTOS) */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-300 font-mono font-bold uppercase tracking-wider block">
            Cantidad de Puntos en la Curva:
          </label>
          <span className="text-[11px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            {pointsCount} puntos
          </span>
        </div>

        <input
          type="range"
          min={3}
          max={12}
          step={1}
          value={pointsCount}
          onChange={(e) => handlePointsCountChange(Number(e.target.value))}
          className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>3 puntos</span>
          <span>6 puntos</span>
          <span>9 puntos</span>
          <span>12 puntos</span>
        </div>
      </div>

      {/* 4. INTERVALO AUTOMÁTICO DE HITOS (EJE X) */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
        <label className="text-[10px] text-slate-300 font-mono font-bold uppercase tracking-wider block">
          Intervalo de Hitos Automático (Eje X):
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-mono">
              Tipo de Intervalo:
            </label>
            <select
              value={seqType}
              onChange={(e) => handleSeqTypeChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
            >
              <option value="meses">Meses</option>
              <option value="dias">Días de Semana</option>
              <option value="trimestres">Trimestres</option>
              <option value="semanas">Semanas</option>
              <option value="anos">Años</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-mono">
              Primer Hito:
            </label>
            <select
              value={firstHito}
              onChange={(e) => handleFirstHitoChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-indigo-300 font-mono text-xs font-bold focus:border-indigo-500 focus:outline-none"
            >
              {(SEQUENCE_MAP[seqType] || SEQUENCE_MAP.meses).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5. ANCHO Y ALTURA DEL GRÁFICO EN LA MISMA FILA (50% A 100%) */}
      <div className="grid grid-cols-2 gap-2">
        {/* Ancho del Gráfico */}
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-indigo-400" /> Ancho:
            </span>
            <span className="font-bold text-indigo-400">{state.chartLineWidthPct ?? 75}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            step={5}
            value={state.chartLineWidthPct ?? 75}
            onChange={(e) => updateState({ chartLineWidthPct: Number(e.target.value) })}
            className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Altura del Gráfico (Mapeada a 200px - 300px) */}
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">Altura:</span>
            <span className="font-bold text-indigo-400">{currentHeightPct}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            step={5}
            value={currentHeightPct}
            onChange={(e) => {
              const pct = Number(e.target.value);
              // 50% -> 200px, 100% -> 300px
              const px = Math.round(200 + ((pct - 50) / 50) * 100);
              updateState({
                chartLineHeightPct: pct,
                chartLineHeight: px
              });
            }}
            className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
