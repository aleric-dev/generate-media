import React from 'react';
import { PostState } from '../../../types';
import {
  Plus,
  Trash2,
  PieChart,
  Disc,
  Gauge,
  Check,
  TrendingUp,
  Activity,
  Zap,
  Target,
  Shield,
  Award,
  Sparkles,
  BarChart3,
  Percent,
  DollarSign,
  Ban,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { getChartColors } from '../../../constants/chartColors';

interface ChartDonutModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

const DONUT_ICONS = [
  { id: 'trending-up', label: 'Crecimiento', icon: TrendingUp },
  { id: 'pie-chart', label: 'Donut', icon: PieChart },
  { id: 'activity', label: 'Actividad', icon: Activity },
  { id: 'zap', label: 'Velocidad', icon: Zap },
  { id: 'target', label: 'Objetivo', icon: Target },
  { id: 'shield', label: 'Seguridad', icon: Shield },
  { id: 'award', label: 'Hito', icon: Award },
  { id: 'sparkles', label: 'Innovación', icon: Sparkles },
  { id: 'bar-chart', label: 'Métricas', icon: BarChart3 },
  { id: 'percent', label: 'Porcentaje', icon: Percent },
  { id: 'dollar', label: 'Finanzas', icon: DollarSign },
  { id: 'none', label: 'Sin icono', icon: Ban },
];

export const ChartDonutModuleConfig: React.FC<ChartDonutModuleConfigProps> = ({ state, updateState }) => {
  const chartColors = getChartColors(state.currentColor);

  const slices = state.chartPieSlices && state.chartPieSlices.length > 0
    ? state.chartPieSlices
    : (state.chartBars.length > 0 ? state.chartBars : [
        { label: 'Frontend', pct: 40, color: chartColors[0] },
        { label: 'Backend', pct: 35, color: chartColors[1] },
        { label: 'Cloud / DevOps', pct: 25, color: chartColors[2] }
      ]);

  const currentTotal = slices.reduce((sum, b) => sum + (b.pct || 0), 0);

  const normalizeBars = () => {
    if (!slices.length) return;
    const sum = slices.reduce((s, b) => s + (b.pct || 0), 0) || 1;
    let accumulated = 0;
    const normalized = slices.map((b, i) => {
      if (i === slices.length - 1) {
        return { ...b, pct: Math.max(0, 100 - accumulated) };
      }
      const val = Math.round((b.pct / sum) * 100);
      accumulated += val;
      return { ...b, pct: val };
    });
    updateState({ chartPieSlices: normalized });
  };

  const addSlice = () => {
    if (slices.length >= 5) return;
    const nextColor = chartColors[slices.length % chartColors.length];
    updateState({
      chartPieSlices: [...slices, { label: 'Nueva Categoría', pct: 20, color: nextColor }]
    });
  };

  const removeSlice = (idx: number) => {
    if (slices.length <= 2) return;
    updateState({
      chartPieSlices: slices.filter((_, i) => i !== idx)
    });
  };

  const updateSlice = (idx: number, field: string, val: any) => {
    const updated = [...slices];
    updated[idx] = { ...updated[idx], [field]: val };
    updateState({ chartPieSlices: updated });
  };

  const activeMode = state.chartPieStyle || (state.chartPieMode === 'gauge' ? 'gauge' : 'donut');
  const selectedIcon = state.chartDonutIcon || 'trending-up';

  return (
    <div className="space-y-3.5">
      {/* 1. TÍTULO OPCIONAL CON ALINEACIÓN */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-400 font-mono">
            Título del Gráfico (Opcional):
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
          placeholder="Ej: Distribución de Tráfico / Ingresos"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* 2. SELECTOR DE FORMATO: PIE, DONUT O VELOCÍMETRO */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1 font-mono">
          Geometría del Gráfico:
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => updateState({ chartPieStyle: 'donut', chartPieMode: 'donut' })}
            className={`py-2 px-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
              activeMode === 'donut'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Donut</span>
          </button>

          <button
            type="button"
            onClick={() => updateState({ chartPieStyle: 'pie', chartPieMode: 'donut' })}
            className={`py-2 px-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
              activeMode === 'pie'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Pastel</span>
          </button>

          <button
            type="button"
            onClick={() => updateState({ chartPieStyle: 'gauge', chartPieMode: 'gauge' })}
            className={`py-2 px-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
              activeMode === 'gauge'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Velocímetro</span>
          </button>
        </div>
      </div>

      {/* 3. ÍCONO EN EL CENTRO DEL DONUT / VELOCÍMETRO */}
      {activeMode !== 'pie' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-mono">
              Ícono en el Centro del Donut / Velocímetro:
            </label>
            <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">
              {DONUT_ICONS.find(i => i.id === selectedIcon)?.label || selectedIcon}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {DONUT_ICONS.map((ico) => {
              const IconComp = ico.icon;
              const isSelected = selectedIcon === ico.id;
              return (
                <button
                  key={ico.id}
                  type="button"
                  onClick={() => updateState({ chartDonutIcon: ico.id })}
                  title={ico.label}
                  className={`p-2 rounded-xl flex items-center justify-center transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-400'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TOTAL Y NORMALIZADOR A 100% */}
      <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
        <div className="text-xs font-mono">
          <span className="text-slate-400">Suma Total: </span>
          <span className={`font-bold ${currentTotal === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {currentTotal}%
          </span>
        </div>
        <button
          type="button"
          onClick={normalizeBars}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Ajustar a 100%</span>
        </button>
      </div>

      {/* 5. LISTA DE PORCIONES CON INPUT VISIBLE */}
      <div className="space-y-2.5 pt-1">
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Segmentos del Gráfico ({slices.length}/5):
        </label>

        {slices.map((bar, idx) => {
          const sliceColor = chartColors[idx % chartColors.length];

          return (
            <div
              key={idx}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm ring-1 ring-white/20"
                  style={{ backgroundColor: sliceColor }}
                  title={`Color: ${sliceColor}`}
                />
                <input
                  type="text"
                  value={bar.label}
                  onChange={(e) => updateSlice(idx, 'label', e.target.value)}
                  placeholder="Categoría..."
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-white font-medium text-xs focus:border-indigo-400 focus:outline-none"
                />
                <span className="font-mono font-bold text-xs text-indigo-300 min-w-[38px] text-right">
                  {bar.pct}%
                </span>
                {slices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeSlice(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={bar.pct}
                onChange={(e) => updateSlice(idx, 'pct', Number(e.target.value))}
                style={{ accentColor: sliceColor }}
                className="w-full bg-slate-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          );
        })}

        {slices.length < 5 && (
          <button
            type="button"
            onClick={addSlice}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/80 text-xs font-mono text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Categoría</span>
          </button>
        )}
      </div>
    </div>
  );
};
