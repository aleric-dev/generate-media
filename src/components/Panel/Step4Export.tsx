import React from 'react';
import { PostState, AspectRatioKey } from '../../types';
import { aspectRatios } from '../../constants/templates';
import { Maximize2, Download, CheckCircle2, Loader2 } from 'lucide-react';

interface Step4ExportProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
  onExport: () => void;
  isExporting: boolean;
  exportStatus: string;
}

export const Step4Export: React.FC<Step4ExportProps> = ({
  state,
  updateState,
  onExport,
  isExporting,
  exportStatus
}) => {
  const currentRatio = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];

  return (
    <div className="space-y-4">
      
      {/* 4.1 Aspect Ratio y Resoluciones */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-indigo-400" /> Formato & Dimensiones
          </label>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {currentRatio.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {(['4:5', '1:1', '9:16', '16:9'] as AspectRatioKey[]).map((key) => {
            const r = aspectRatios[key];
            const isSelected = state.aspectRatio === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => updateState({ aspectRatio: key })}
                className={`py-2.5 px-3 rounded-xl transition flex flex-col items-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-sm">{r.label.split(' ')[0]}</span>
                <span className="text-[11px] font-normal opacity-80">{r.px}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4.2 BOTÓN DE DESCARGA EXCLUSIVO DE ESTE PASO */}
      <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/40 rounded-2xl space-y-3.5 shadow-xl">
        <div className="text-xs font-mono text-indigo-300 font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Listo para Publicar
        </div>

        <button
          type="button"
          disabled={isExporting}
          onClick={onExport}
          className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 text-white font-mono font-bold text-sm tracking-wide shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition transform active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generando PNG 1080p...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Descargar PNG 1080p Nativo</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1 pt-1">
          <span className="text-emerald-400">{exportStatus || '100% idéntico a pantalla'}</span>
          <span className="text-indigo-400 font-bold">{currentRatio.px}</span>
        </div>
      </div>

    </div>
  );
};
