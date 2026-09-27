import React from 'react';
import { PostState } from '../../../types';
import { Plus, Trash2, GitCommit, LayoutGrid, ListFilter, Award } from 'lucide-react';

interface StepsModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const StepsModuleConfig: React.FC<StepsModuleConfigProps> = ({ state, updateState }) => {
  const steps = state.stepsData || state.steps || [];

  const addStepItem = () => {
    if (steps.length >= 4) return;
    const nextNum = steps.length + 1;
    const newSteps = [
      ...steps,
      {
        stepNumber: nextNum,
        step: `0${nextNum}`,
        title: `Fase 0${nextNum}`,
        desc: 'Descripción del entregable o hito.',
        description: 'Descripción del entregable o hito.'
      }
    ];
    updateState({ stepsData: newSteps, steps: newSteps });
  };

  const removeStepItem = (idx: number) => {
    if (steps.length <= 1) return;
    const filtered = steps
      .filter((_, i) => i !== idx)
      .map((s, i) => ({
        ...s,
        stepNumber: i + 1,
        step: `0${i + 1}`
      }));
    updateState({ stepsData: filtered, steps: filtered });
  };

  const updateStepItem = (idx: number, field: string, val: any) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: val };
    if (field === 'title') updated[idx].title = val;
    if (field === 'desc' || field === 'description') {
      updated[idx].desc = val;
      updated[idx].description = val;
    }
    updateState({ stepsData: updated, steps: updated });
  };

  const currentVariant = state.stepsVisualVariant || (state.stepsLayout === 'connected-timeline' ? 'timeline' : 'bento');

  return (
    <div className="space-y-3.5">
      {/* 1. SELECTOR DE FORMATO VISUAL */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1 font-mono">
          Estilo Visual de Pasos:
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => updateState({ stepsVisualVariant: 'timeline', stepsLayout: 'connected-timeline' })}
            className={`p-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
              currentVariant === 'timeline'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Timeline Conectada</span>
          </button>

          <button
            type="button"
            onClick={() => updateState({ stepsVisualVariant: 'bento', stepsLayout: 'bento-cards' })}
            className={`p-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
              currentVariant === 'bento'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tarjetas Bento 2x2</span>
          </button>

          <button
            type="button"
            onClick={() => updateState({ stepsVisualVariant: 'minimal' })}
            className={`p-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
              currentVariant === 'minimal'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Lista Minimal</span>
          </button>

          <button
            type="button"
            onClick={() => updateState({ stepsVisualVariant: 'badges' })}
            className={`p-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
              currentVariant === 'badges'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Chips / Badges</span>
          </button>
        </div>
      </div>

      {/* 2. LISTA DE PASOS */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Secuencia de Pasos ({steps.length}/4):
          </label>
          {steps.length < 4 && (
            <button
              type="button"
              onClick={addStepItem}
              className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 font-bold transition"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir Paso</span>
            </button>
          )}
        </div>

        {steps.map((st, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400">
                Paso #{st.stepNumber || idx + 1}
              </span>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStepItem(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">Título:</label>
              <input
                type="text"
                value={st.title}
                onChange={(e) => updateStepItem(idx, 'title', e.target.value)}
                placeholder="Nombre del paso o hito..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">Descripción:</label>
              <textarea
                rows={2}
                value={st.description || st.desc || ''}
                onChange={(e) => updateStepItem(idx, 'description', e.target.value)}
                placeholder="Detalle conciso del paso..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 resize-none leading-relaxed focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
