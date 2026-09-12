import React from 'react';
import { PostState, HeaderShape, FooterShape } from '../../types';
import { SunMoon, Sun, Moon, Palette, Layout } from 'lucide-react';

interface Step2StyleProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const Step2Style: React.FC<Step2StyleProps> = ({
  state,
  updateState
}) => {
  const colorPresets = [
    { color: '#4F46E5', name: 'Indigo', cat: 'DESARROLLO A LA MEDIDA' },
    { color: '#0891B2', name: 'Cyan', cat: 'CLOUD & DEVOPS' },
    { color: '#059669', name: 'Emerald', cat: 'AUTOMATIZACIÓN & IA' },
    { color: '#D97706', name: 'Amber', cat: 'CONSULTORÍA / B2B' },
    { color: '#8B5CF6', name: 'Violet', cat: 'INTELIGENCIA ARTIFICIAL' },
    { color: '#E11D48', name: 'Rose', cat: 'FINANZAS & PAGOS' },
    { color: '#DC2626', name: 'Crimson', cat: 'CIBERSEGURIDAD' },
    { color: '#64748B', name: 'Slate', cat: 'ARQUITECTURA WEB' },
    { color: '#0D9488', name: 'Teal', cat: 'DATA & ANALYTICS' },
    { color: '#0284C7', name: 'Sky', cat: 'SAAS B2B PLATFORM' },
    { color: '#65A30D', name: 'Lime', cat: 'HIGH-PERFORMANCE TECH' },
    { color: '#C026D3', name: 'Fuchsia', cat: 'PRODUCT DESIGN' },
    { color: '#EA580C', name: 'Coral', cat: 'GROWTH & MARKETING' },
    { color: '#CA8A04', name: 'Gold', cat: 'VENTURE CAPITAL' },
    { color: '#7C3AED', name: 'Purple', cat: 'DEEP TECH & ALGORITHMS' },
    { color: '#2563EB', name: 'Cobalt', cat: 'ENTERPRISE SOLUTIONS' },
    { color: '#10B981', name: 'Mint', cat: 'CLEANTECH & ESG' },
    { color: '#9A3412', name: 'Bronze', cat: 'ESTRATEGIA & NEGOCIOS' },
    { color: '#BE185D', name: 'Berry', cat: 'SOCIAL COMMERCE' },
    { color: '#334155', name: 'Obsidian', cat: 'MINIMAL LUXURY' },
  ];

  return (
    <div className="space-y-4">
      
      {/* 2.1 Tema Claro / Oscuro del Lienzo */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
        <label className="text-xs text-white font-bold flex items-center gap-1.5">
          <SunMoon className="w-4 h-4 text-indigo-400" /> Modo del Lienzo (Fondo Base)
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => updateState({ canvasMode: 'dark' })}
            className={`py-2.5 px-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
              state.canvasMode === 'dark'
                ? 'bg-slate-950 border-2 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" /> Modo Oscuro
          </button>
          <button
            type="button"
            onClick={() => updateState({ canvasMode: 'light' })}
            className={`py-2.5 px-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
              state.canvasMode === 'light'
                ? 'bg-slate-900 border-2 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" /> Modo Claro
          </button>
        </div>
      </div>

      {/* 2.2 Color Principal de la Vista & Acentos */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-400" /> Paleta Corporativa & Acentos
          </label>
          <span className="text-xs font-mono font-bold text-indigo-400">{state.currentColor}</span>
        </div>

        {/* 20 Presets Corporativos */}
        <div className="grid grid-cols-5 gap-1.5 text-[9px] font-mono max-h-48 overflow-y-auto pr-1">
          {colorPresets.map((p) => (
            <button
              key={p.color}
              type="button"
              onClick={() => updateState({ currentColor: p.color, category: p.cat })}
              className={`p-1.5 rounded-lg bg-slate-950 border flex flex-col items-center gap-1 transition ${
                state.currentColor.toLowerCase() === p.color.toLowerCase()
                  ? 'border-indigo-400 ring-1 ring-indigo-400'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
              title={`${p.name} - ${p.cat}`}
            >
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-slate-300 truncate w-full text-center">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Color Hexadecimal Libre */}
        <div className="pt-1 border-t border-slate-800/80">
          <label className="text-[11px] text-slate-400 block mb-1">Color Personalizado (Hexadecimal):</label>
          <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-xl p-2">
            <input
              type="color"
              value={state.currentColor}
              onChange={(e) => updateState({ currentColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
            />
            <span className="text-xs font-mono font-bold text-slate-200">{state.currentColor}</span>
            <span className="text-[11px] text-slate-500 font-mono pl-2">Tono exacto de tu marca</span>
          </div>
        </div>
      </div>

      {/* 2.3 Estilos de Contenedores: Header y Footer */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <Layout className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-white font-bold">Estilo de Contenedores (Header & Footer)</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-300 font-medium mb-1 block">Contenedor Header:</label>
            <select
              value={state.headerShape || 'line'}
              onChange={(e) => updateState({ headerShape: e.target.value as HeaderShape })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="line">Borde Línea</option>
              <option value="pill">Cápsula Flotante</option>
              <option value="card">Tarjeta Vidriada</option>
              <option value="minimal">Minimalista (Sin marco)</option>
              <option value="accent-bar">Barra con Acento Neón</option>
              <option value="floating-dock">Dock Flotante 3D</option>
              <option value="bracket-frame">[ Marco Tech Brackets ]</option>
              <option value="neon-glow">Resplandor Neón Intenso</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-300 font-medium mb-1 block">Contenedor Footer:</label>
            <select
              value={state.footerShape || 'line'}
              onChange={(e) => updateState({ footerShape: e.target.value as FooterShape })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="line">Borde Línea</option>
              <option value="card">Tarjeta Elevada</option>
              <option value="pill">Cápsula Centrada</option>
              <option value="minimal">Minimalista (Sin marco)</option>
              <option value="accent-bar">Barra con Acento Neón</option>
              <option value="floating-dock">Dock Flotante 3D</option>
              <option value="bracket-frame">[ Marco Tech Brackets ]</option>
              <option value="neon-glow">Resplandor Neón Intenso</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};
