import React from 'react';
import { PostState } from '../../../types';
import { Plus, Trash2, Sliders, Star } from 'lucide-react';

interface ChartBarsModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

const FIXED_CHART_COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'];

export const ChartBarsModuleConfig: React.FC<ChartBarsModuleConfigProps> = ({ state, updateState }) => {
  const addBar = () => {
    if (state.chartBars.length >= 5) return;
    const nextColor = FIXED_CHART_COLORS[state.chartBars.length % FIXED_CHART_COLORS.length];
    updateState({
      chartBars: [...state.chartBars, { label: 'Métrica Nueva', pct: 75, color: nextColor }]
    });
  };

  const removeBar = (idx: number) => {
    if (state.chartBars.length <= 1) return;
    updateState({
      chartBars: state.chartBars.filter((_, i) => i !== idx)
    });
  };

  const updateBar = (idx: number, field: string, val: any) => {
    const updated = [...state.chartBars];
    updated[idx] = { ...updated[idx], [field]: val };
    updateState({ chartBars: updated });
  };

  const isHighlightFirst = state.chartBarHighlightMode !== 'normal';

  return (
    <div className="space-y-3.5">
      {/* 1. TÍTULO OPCIONAL DEL GRÁFICO */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1 font-mono">
          Título del Gráfico (Opcional):
        </label>
        <input
          type="text"
          value={state.chartTitle ?? ''}
          onChange={(e) => updateState({ chartTitle: e.target.value })}
          placeholder="Ej: Rendimiento Operativo / Comparativa"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* 2. FILA: MODO DE RESALTADO & ESPACIADO DINÁMICO (GAP) */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">
            Estilo de Color:
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => updateState({ chartBarHighlightMode: 'first', chartHighlightIndex: 0 })}
              className={`py-1 px-1.5 rounded text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 ${
                isHighlightFirst
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="La primera barra lleva el color de la marca y las demás se muestran en tono neutro"
            >
              <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>1ª Barra</span>
            </button>
            <button
              type="button"
              onClick={() => updateState({ chartBarHighlightMode: 'normal' })}
              className={`py-1 px-1.5 rounded text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 ${
                !isHighlightFirst
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Todas las barras usan la paleta fija de colores"
            >
              <span>Normal</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
            <span className="flex items-center gap-1"><Sliders className="w-3 h-3 text-indigo-400" /> Gap:</span>
            <span className="font-bold text-indigo-400">{state.chartBarsGap ?? 20}px</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center h-[34px]">
            <input
              type="range"
              min={8}
              max={36}
              step={2}
              value={state.chartBarsGap ?? 20}
              onChange={(e) => updateState({ chartBarsGap: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. LISTA DE BARRAS CON INPUT VISIBLE */}
      <div className="space-y-2.5 pt-1">
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Barras de Datos ({state.chartBars.length}/5):
        </label>

        {state.chartBars.map((bar, idx) => {
          const isTargetHighlighted = isHighlightFirst && idx === 0;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border space-y-2 transition-all ${
                isTargetHighlighted
                  ? 'bg-slate-900 border-indigo-500/50 shadow-sm'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Input visible para el nombre/label de la barra */}
                <input
                  type="text"
                  value={bar.label}
                  onChange={(e) => updateBar(idx, 'label', e.target.value)}
                  placeholder="Nombre de la barra..."
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-white font-medium text-xs focus:border-indigo-400 focus:outline-none"
                />

                <span className="font-mono font-bold text-xs text-indigo-300 min-w-[38px] text-right">
                  {bar.pct}%
                </span>

                {state.chartBars.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBar(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                    title="Eliminar barra"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Slider de porcentaje */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={bar.pct}
                  onChange={(e) => updateBar(idx, 'pct', Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          );
        })}

        {state.chartBars.length < 5 && (
          <button
            type="button"
            onClick={addBar}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/80 text-xs font-mono text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Barra al Gráfico</span>
          </button>
        )}
      </div>
    </div>
  );
};
