import React from 'react';
import { PostState, CodeWindowStyle } from '../../../types';

interface CodeModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const CodeModuleConfig: React.FC<CodeModuleConfigProps> = ({ state, updateState }) => {
  return (
    <div className="space-y-3.5">
      {/* 1. SELECTORES SUPERIORES: ESTILO DE VENTANA Y TEMA */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">
            Estilo de Ventana:
          </label>
          <select
            value={state.codeWindowStyle || 'macos'}
            onChange={(e) => updateState({ codeWindowStyle: e.target.value as CodeWindowStyle })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
          >
            <option value="macos">🍎 macOS Window</option>
            <option value="windows">🪟 Windows Frame</option>
            <option value="linux">🐧 Linux Terminal</option>
            <option value="bash">💻 Bash Shell</option>
            <option value="cmd">📟 CMD Prompt</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">
            Tema de Sintaxis:
          </label>
          <select
            value={state.codeTheme || 'tokyo-night'}
            onChange={(e) => updateState({ codeTheme: e.target.value as any })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
          >
            <option value="tokyo-night">Tokyo Night</option>
            <option value="cyber-emerald">Cyber Emerald</option>
            <option value="monokai">Monokai</option>
            <option value="one-dark">One Dark</option>
            <option value="github-dark">GitHub Dark</option>
          </select>
        </div>
      </div>

      {/* 2. NOMBRE DE ARCHIVO */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nombre de Archivo:</label>
        <input
          type="text"
          value={state.codeFilename ?? ''}
          onChange={(e) => updateState({ codeFilename: e.target.value })}
          placeholder="pipeline.ts"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* 3. EDITOR DE CÓDIGO */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">
          Bloque de Código (Snippet):
        </label>
        <textarea
          rows={6}
          value={state.code ?? ''}
          onChange={(e) => updateState({ code: e.target.value })}
          placeholder="const app = new Server();\napp.start();"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-indigo-200 font-mono focus:border-indigo-500 focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );
};
