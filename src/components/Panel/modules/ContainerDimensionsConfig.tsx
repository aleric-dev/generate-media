import React from 'react';
import { PostState } from '../../../types';
import { Sliders, MoveVertical } from 'lucide-react';

interface ContainerDimensionsConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const ContainerDimensionsConfig: React.FC<ContainerDimensionsConfigProps> = ({ state, updateState }) => {
  return (
    <div className="space-y-3.5">
      {/* 1. ESCALA GENERAL UNIFORME DEL MÓDULO */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Escala General Uniforme (Todo el Módulo):
          </span>
          <span className="text-xs font-mono font-bold text-indigo-400">
            {state.moduleScale ?? 100}%
          </span>
        </div>
        <input
          type="range"
          min={80}
          max={150}
          step={5}
          value={state.moduleScale ?? 100}
          onChange={(e) => updateState({ moduleScale: Number(e.target.value) })}
          className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>80% (Compacto)</span>
          <span>100% (Normal)</span>
          <span>150% (Grande)</span>
        </div>
      </div>

      {/* 2. MARGEN SUPERIOR / SEPARACIÓN CON EL TEXTO */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
            <MoveVertical className="w-3.5 h-3.5 text-indigo-400" /> Margen Superior (Separación del Texto):
          </span>
          <span className="text-xs font-mono font-bold text-indigo-400">
            {state.moduleMarginTop ?? 0} px
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={80}
          step={4}
          value={state.moduleMarginTop ?? 0}
          onChange={(e) => updateState({ moduleMarginTop: Number(e.target.value) })}
          className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>0 px (Junto)</span>
          <span>40 px (Separado)</span>
          <span>80 px (Amplio)</span>
        </div>
      </div>
    </div>
  );
};
