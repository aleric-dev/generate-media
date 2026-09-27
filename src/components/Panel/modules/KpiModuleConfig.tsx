import React from 'react';
import { PostState, KPICard } from '../../../types';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const KpiModuleConfig: React.FC<KpiModuleConfigProps> = ({ state, updateState }) => {
  const addKpi = () => {
    if (state.kpis.length >= 4) return;
    updateState({
      kpis: [
        ...state.kpis,
        {
          label: 'NUEVA MÉTRICA',
          val: '85%',
          trend: 'up',
          trendLabel: '+12%'
        }
      ]
    });
  };

  const removeKpi = (idx: number) => {
    if (state.kpis.length <= 1) return;
    updateState({
      kpis: state.kpis.filter((_, i) => i !== idx)
    });
  };

  const updateKpi = (idx: number, field: keyof KPICard, val: any) => {
    const updated = [...state.kpis];
    updated[idx] = { ...updated[idx], [field]: val };
    updateState({ kpis: updated });
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
        <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
          Métricas KPI
        </span>
      </div>

      <div className="space-y-3">
        {state.kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400">
                Métrica
              </span>
              {state.kpis.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKpi(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  title="Eliminar métrica"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Título / Etiqueta */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                Título / Etiqueta:
              </label>
              <input
                type="text"
                value={kpi.label}
                onChange={(e) => updateKpi(idx, 'label', e.target.value)}
                placeholder="Ej: RENDIMIENTO"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs font-bold focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Fila: Valor Principal y Variación (Delta) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                  Valor Principal:
                </label>
                <input
                  type="text"
                  value={kpi.val}
                  onChange={(e) => updateKpi(idx, 'val', e.target.value)}
                  placeholder="99/100 o +$45k"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs font-black focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono truncate">
                  Variación / Delta (Opcional):
                </label>
                <input
                  type="text"
                  value={kpi.trendLabel ?? ''}
                  onChange={(e) => updateKpi(idx, 'trendLabel', e.target.value)}
                  placeholder="+18.4% / -2.1s"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Selector de Tendencia */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                Tendencia:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateKpi(idx, 'trend', 'up')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1 transition ${
                    kpi.trend === 'up'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Subida</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateKpi(idx, 'trend', 'down')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1 transition ${
                    kpi.trend === 'down'
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Bajada</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateKpi(idx, 'trend', 'none')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1 transition ${
                    !kpi.trend || kpi.trend === 'none'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Neutro</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {state.kpis.length < 4 && (
        <button
          type="button"
          onClick={addKpi}
          className="w-full py-2.5 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Añadir Métrica ({state.kpis.length}/4)</span>
        </button>
      )}
    </div>
  );
};
