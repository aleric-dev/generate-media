import React from 'react';
import { PostState, PatternType, PatternVignette, AccentShape, ShapeSizeVariant, LightDirection } from '../../types';
import { Cpu, ZoomIn, Blend, Sparkles, Sun, Upload } from 'lucide-react';

interface Step3BackgroundProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const Step3Background: React.FC<Step3BackgroundProps> = ({
  state,
  updateState
}) => {
  const patterns: { id: PatternType; label: string }[] = [
    { id: 'circuit', label: '🖲️ Circuitos Impresos PCB' },
    { id: 'hexagons', label: '⬡ Hexágonos Tech (Grafeno)' },
    { id: 'matrix', label: '💻 Matriz Cyberpunk' },
    { id: 'neural', label: '🌐 Red Neuronal & Constelación' },
    { id: 'isometric', label: '📐 Blueprint Isométrico 3D' },
    { id: 'grid', label: '▦ Rejilla Clásica de Precisión' },
    { id: 'dots', label: '⁖ Puntos Tech Minimalistas' },
    { id: 'waves', label: '〰️ Ondas Digitales Futuristas' },
    { id: 'diagonal', label: '📐 Líneas Diagonales Cyber' },
    { id: 'topographic', label: '🗺️ Topográfico / Curvas de Nivel' },
    { id: 'noise', label: '📺 Grano / Ruido Analógico' },
    { id: 'custom', label: '📁 Patrón Personalizado (Subido)' },
    { id: 'none', label: '⚪ Sin Patrón (Fondo Plano)' },
  ];

  const vignettes: { id: PatternVignette; label: string }[] = [
    { id: 'vignette', label: '🎯 Viñeta Radial (Bordes difuminados)' },
    { id: 'none', label: '⬛ Completo / Nítido (Sin difuminado)' },
    { id: 'gradient-top', label: '⬆️ Degradado Superior (Fuerte arriba)' },
    { id: 'gradient-bottom', label: '⬇️ Degradado Inferior (Fuerte abajo)' },
    { id: 'gradient-lateral', label: '↔️ Degradado Lateral (Lados suaves)' },
    { id: 'mask-center', label: '👁️ Máscara Central (Texto legible)' },
  ];

  const shapes: { id: AccentShape; label: string }[] = [
    { id: 'glow', label: '✨ Luces Neón Radial (Glow Tech)' },
    { id: 'circles', label: '⭕ Círculos Geométricos Reales' },
    { id: 'squares', label: '⏹️ Cuadrados Tech / Cubos' },
    { id: 'diamonds', label: '💠 Rombos Geométricos (Diamonds)' },
    { id: 'lines', label: '⚡ Líneas Cyber / Rayos Láser' },
    { id: 'none', label: '🚫 Sin Luces ni Formas' },
  ];

  const directions: { id: LightDirection; label: string; full?: boolean }[] = [
    { id: 'dual-corners-1', label: '🌟 Diagonal 1 (TL-BR)' },
    { id: 'dual-corners-2', label: '🌟 Diagonal 2 (TR-BL)' },
    { id: 'four-corners', label: '🔲 Las 4 Esquinas' },
    { id: 'top', label: '⬆️ Desde Arriba' },
    { id: 'bottom', label: '⬇️ Desde Abajo' },
    { id: 'sides', label: '↔️ Laterales Izq / Der' },
    { id: 'center', label: '🎯 Foco Central', full: true },
  ];

  const handleCustomPattern = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateState({
        customPatternUrl: ev.target?.result as string,
        bgPattern: 'custom'
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      
      {/* 3.1 Patrón de Textura */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-400" /> Textura / Patrón de Fondo
          </label>
        </div>

        <select
          value={state.bgPattern}
          onChange={(e) => updateState({ bgPattern: e.target.value as PatternType })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
        >
          {patterns.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>

        {/* Uploader Patrón Propio */}
        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">¿Tienes un patrón propio en SVG/PNG?</span>
          <label className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold cursor-pointer transition flex items-center gap-1">
            <Upload className="w-3 h-3" /> Cargar Patrón
            <input type="file" accept="image/*" onChange={handleCustomPattern} className="hidden" />
          </label>
        </div>

        {/* Slider Zoom del Patrón */}
        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-indigo-400" /> Escala / Zoom del Patrón:
            </span>
            <span className="font-mono text-indigo-400 font-bold">{state.patternScale} px</span>
          </div>
          <input
            type="range"
            min={30}
            max={220}
            value={state.patternScale}
            onChange={(e) => updateState({ patternScale: parseInt(e.target.value, 10) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Denso (30px)</span>
            <span>Normal (100px)</span>
            <span>Amplio (220px)</span>
          </div>
        </div>
      </div>

      {/* 3.2 Difuminados, Viñetas y Degradados de Textura */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
        <label className="text-xs text-white font-bold flex items-center gap-1.5">
          <Blend className="w-4 h-4 text-indigo-400" /> Difuminado / Máscara del Patrón
        </label>
        <p className="text-[11px] text-slate-400">Aplica viñetas o degradados para que la textura no abrume el texto:</p>

        <select
          value={state.patternVignette}
          onChange={(e) => updateState({ patternVignette: e.target.value as PatternVignette })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
        >
          {vignettes.map((v) => (
            <option key={v.id} value={v.id}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* 3.3 Luces y Formas Geométricas Precisas */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Luces & Formas de Acento
          </label>
          <span className="text-xs font-mono text-indigo-400">{state.lightIntensity}% Intensidad</span>
        </div>

        {/* Tipo de Figura */}
        <div>
          <label className="text-[11px] text-slate-300 font-medium mb-1 block">Tipo de Forma / Iluminación:</label>
          <select
            value={state.accentShape}
            onChange={(e) => updateState({ accentShape: e.target.value as AccentShape })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          >
            {shapes.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Selector de Tamaño de Formas */}
        {state.accentShape !== 'glow' && state.accentShape !== 'none' && (
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-300 font-medium block">Variante de Tamaño de la Figura:</label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {(['small', 'medium', 'large'] as ShapeSizeVariant[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => updateState({ shapeSizeVariant: sz })}
                  className={`py-1.5 px-2 rounded-lg text-center transition ${
                    state.shapeSizeVariant === sz
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-300'
                  }`}
                >
                  {sz === 'small' ? 'Pequeño' : sz === 'large' ? 'Grande' : 'Mediano'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posiciones de Iluminación y Formas */}
        <div>
          <label className="text-[11px] text-slate-300 font-medium mb-1 block">Posición & Orientación:</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {directions.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => updateState({ lightDirection: d.id })}
                className={`py-2 px-2.5 rounded-lg text-left transition ${d.full ? 'col-span-2 text-center' : ''} ${
                  state.lightDirection === d.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider Intensidad Neón */}
        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Intensidad / Opacidad:
            </span>
            <span className="font-mono text-indigo-400 font-bold">{state.lightIntensity}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={state.lightIntensity}
            onChange={(e) => updateState({ lightIntensity: parseInt(e.target.value, 10) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

    </div>
  );
};
