import React from 'react';
import { PostState } from '../../../types';

interface ComparisonModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const ComparisonModuleConfig: React.FC<ComparisonModuleConfigProps> = ({ state, updateState }) => {
  return (
    <div className="space-y-3.5">
      {/* 1. LADO ANTES / PROBLEMA */}
      <div className="p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2.5">
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
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-rose-300 font-mono font-bold focus:border-rose-500 focus:outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="text-[9px] text-slate-400 font-mono">Título:</label>
            <input
              type="text"
              value={state.comparisonTitleLeft ?? 'Procesos Manuales & Excel'}
              onChange={(e) => updateState({ comparisonTitleLeft: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white font-medium focus:border-rose-500 focus:outline-none"
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
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 font-mono leading-relaxed focus:border-rose-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. LADO HOY / SOLUCIÓN */}
      <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-2.5">
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
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-emerald-300 font-mono font-bold focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="text-[9px] text-slate-400 font-mono">Título:</label>
            <input
              type="text"
              value={state.comparisonTitleRight ?? 'Plataforma Web a Medida'}
              onChange={(e) => updateState({ comparisonTitleRight: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white font-medium focus:border-emerald-500 focus:outline-none"
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
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 font-mono leading-relaxed focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
