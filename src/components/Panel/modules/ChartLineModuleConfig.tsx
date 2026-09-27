import React, { useEffect } from 'react';
import { PostState } from '../../../types';
import { Sliders, Activity } from 'lucide-react';

interface ChartLineModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const ChartLineModuleConfig: React.FC<ChartLineModuleConfigProps> = ({ state, updateState }) => {
  const linePoints = state.chartLinePoints && state.chartLinePoints.length > 0
    ? state.chartLinePoints
    : [
        { label: 'Ene', pct: 25 },
        { label: 'Feb', pct: 45 },
        { label: 'Mar', pct: 60 },
        { label: 'Abr', pct: 80 },
        { label: 'May', pct: 95 },
        { label: 'Jun', pct: 110 }
      ];

  const defaultLabels = linePoints.map((b) => b.label).join(', ');
  const defaultValues = linePoints.map((b) => b.pct).join(', ');

  const currentLabels = state.chartLineLabels ?? defaultLabels;
  const currentValues = state.chartLineValues ?? defaultValues;

  const syncPointsFromInputs = (labelsStr: string, valuesStr: string) => {
    const labels = labelsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const values = valuesStr.split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n));

    const count = Math.max(labels.length, values.length);
    if (count === 0) return;

    const newPoints = Array.from({ length: count }).map((_, i) => ({
      label: labels[i] || `P${i + 1}`,
      pct: values[i] !== undefined ? values[i] : 50,
      color: state.currentColor
    }));

    updateState({ chartLinePoints: newPoints });
  };

  const handleLabelsChange = (raw: string) => {
    updateState({ chartLineLabels: raw });
    syncPointsFromInputs(raw, currentValues);
  };

  // Secuencias base para auto-cálculo de hitos
  const SEQUENCE_MAP: Record<string, string[]> = {
    meses: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    trimestres: ['Q1', 'Q2', 'Q3', 'Q4'],
    semanas: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
    anos: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']
  };

  const [seqType, setSeqType] = React.useState<string>('meses');
  const [firstHito, setFirstHito] = React.useState<string>('Ene');

  const calculateMilestones = (type: string, start: string, valCount: number) => {
    const list = SEQUENCE_MAP[type] || SEQUENCE_MAP.meses;
    const startIndex = list.indexOf(start) >= 0 ? list.indexOf(start) : 0;
    const count = Math.max(2, valCount);
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(list[(startIndex + i) % list.length]);
    }
    return result.join(', ');
  };

  const handleSeqTypeChange = (newType: string) => {
    setSeqType(newType);
    const firstOption = (SEQUENCE_MAP[newType] || SEQUENCE_MAP.meses)[0];
    setFirstHito(firstOption);
    const valCount = (currentValues.split(',').filter(Boolean).length) || 5;
    const newLabels = calculateMilestones(newType, firstOption, valCount);
    updateState({ chartLineLabels: newLabels });
    syncPointsFromInputs(newLabels, currentValues);
  };

  const handleFirstHitoChange = (newStart: string) => {
    setFirstHito(newStart);
    const valCount = (currentValues.split(',').filter(Boolean).length) || 5;
    const newLabels = calculateMilestones(seqType, newStart, valCount);
    updateState({ chartLineLabels: newLabels });
    syncPointsFromInputs(newLabels, currentValues);
  };

  const handleValuesChange = (raw: string) => {
    updateState({ chartLineValues: raw });
    const valCount = raw.split(',').map((s) => s.trim()).filter(Boolean).length;
    if (valCount > 0) {
      const newLabels = calculateMilestones(seqType, firstHito, valCount);
      updateState({ chartLineLabels: newLabels });
      syncPointsFromInputs(newLabels, raw);
    } else {
      syncPointsFromInputs(currentLabels, raw);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* 1. TÍTULO OPCIONAL */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1 font-mono">
          Título de la Curva (Opcional):
        </label>
        <input
          type="text"
          value={state.chartTitle ?? ''}
          onChange={(e) => updateState({ chartTitle: e.target.value })}
          placeholder="Ej: Crecimiento Semestral de Usuarios"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* 2. GENERADOR DE HITOS / EJE X (EN UNA SOLA FILA: TIPO + PRIMER HITO) */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2.5">
        <label className="text-[10px] text-slate-300 font-mono font-bold uppercase tracking-wider block">
          Secuencia de Hitos Automática (Eje X):
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-mono">
              Tipo de Hito:
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

      {/* 3. ENTRADA RÁPIDA DE VALORES Y HITOS RESULTANTES */}
      <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
        {/* VALORES (CIFRAS) */}
        <div>
          <label className="text-xs font-mono font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Valores / Cifras (Separados por coma):
          </label>
          <input
            type="text"
            value={currentValues}
            onChange={(e) => handleValuesChange(e.target.value)}
            placeholder="25, 45, 60, 80, 95, 110"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-indigo-300 font-mono text-xs font-black focus:border-indigo-400 focus:outline-none"
          />
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
            Al escribir los valores, los hitos se calculan y asignan de forma automática.
          </span>
        </div>

        {/* HITOS CALCULADOS (EDITABLES) */}
        <div>
          <label className="text-xs font-mono font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Hitos Asignados (Calculados automáticamente):
          </label>
          <input
            type="text"
            value={currentLabels}
            onChange={(e) => handleLabelsChange(e.target.value)}
            placeholder="Ene, Feb, Mar, Abr, May, Jun"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-white font-mono text-xs font-semibold focus:border-indigo-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. OPCIONES DE VISUALIZACIÓN */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <button
          type="button"
          onClick={() => updateState({ chartLineCurved: !state.chartLineCurved })}
          className={`p-2.5 rounded-xl border text-center transition ${
            state.chartLineCurved !== false
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          {state.chartLineCurved !== false ? '✓ Curva Spline Suave' : 'Línea Recta Angular'}
        </button>

        <button
          type="button"
          onClick={() => updateState({ chartLineShowGrid: state.chartLineShowGrid === false })}
          className={`p-2.5 rounded-xl border text-center transition ${
            state.chartLineShowGrid !== false
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          {state.chartLineShowGrid !== false ? '✓ Cuadrícula Visible' : 'Sin Cuadrícula'}
        </button>
      </div>

      {/* 5. ALTURA / TAMAÑO DEL GRÁFICO */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold">Altura del Gráfico:</span>
          <span className="font-bold text-indigo-400">{state.chartLineHeight || 175} px</span>
        </div>
        <input
          type="range"
          min={130}
          max={260}
          step={5}
          value={state.chartLineHeight || 175}
          onChange={(e) => updateState({ chartLineHeight: Number(e.target.value) })}
          className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
        />
      </div>

      {/* 6. GROSOR DEL TRAZO */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold">Grosor de la Línea:</span>
          <span className="font-bold text-indigo-400">{state.chartLineStroke || 4} px</span>
        </div>
        <input
          type="range"
          min={2}
          max={8}
          value={state.chartLineStroke || 4}
          onChange={(e) => updateState({ chartLineStroke: Number(e.target.value) })}
          className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
};
