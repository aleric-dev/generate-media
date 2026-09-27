import React from 'react';
import { PostState } from '../../../types';
import { Sliders } from 'lucide-react';

interface ContainerDimensionsConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const ContainerDimensionsConfig: React.FC<ContainerDimensionsConfigProps> = ({ state, updateState }) => {
  return (
    <div className="space-y-3.5">
      {/* ESCALA GENERAL UNIFORME DEL MÓDULO */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Escala General Uniforme (Todo el Módulo):
          </span>
          <span className="text-xs font-mono font-bold text-indigo-400">
            {Math.max(100, state.moduleScale || 100)}%
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={180}
          step={5}
          value={Math.max(100, state.moduleScale || 100)}
          onChange={(e) => updateState({ moduleScale: Number(e.target.value) })}
          className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
        />
        <span className="text-[10px] text-slate-500 font-mono block">
          Escala proporcionalmente textos, cifras, íconos, títulos de gráficos y badges sin deformar el contenedor (mínimo 100%).
        </span>
      </div>
    </div>
  );
};
