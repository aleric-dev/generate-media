import React from 'react';
import { PostState, PatternType, PatternVignette, LightType, LightDirection, ShapeType, ShapePlacement, ShapeSizeVariant } from '../../types';
import { Cpu, ZoomIn, Blend, Sparkles, Sun, Upload, Shapes, Dices } from 'lucide-react';

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

  const lightTypes: { id: LightType; label: string }[] = [
    { id: 'glow', label: '✨ Luces Neón Radiales (Glow Tech)' },
    { id: 'spotlight', label: '🔦 Focos Neón Direccionales' },
    { id: 'aurora', label: '🌌 Aurora Polar Superior' },
    { id: 'dual-beams', label: '⚡ Haces de Luz Duales' },
    { id: 'none', label: '🚫 Sin Luces' },
  ];

  const lightDirections: { id: LightDirection; label: string; full?: boolean }[] = [
    { id: 'dual-corners-1', label: '🌟 Diagonal 1 (TL-BR)' },
    { id: 'dual-corners-2', label: '🌟 Diagonal 2 (TR-BL)' },
    { id: 'four-corners', label: '🔲 Las 4 Esquinas' },
    { id: 'top', label: '⬆️ Desde Arriba' },
    { id: 'bottom', label: '⬇️ Desde Abajo' },
    { id: 'sides', label: '↔️ Laterales Izq / Der' },
    { id: 'center', label: '🎯 Foco Central', full: true },
  ];

  const shapeStyles: { id: ShapeType; label: string; desc: string }[] = [
    { id: 'glass-orbs', label: '🔮 Orbes Vítreos con Blur', desc: 'Esferas translúcidas flotantes' },
    { id: 'glass-cards', label: '🪟 Tarjetas de Cristal Diagonales', desc: 'Paneles glassmorphism rotados' },
    { id: 'cyber-brackets', label: '💻 Brackets Tech & Símbolos', desc: '< >, ../>, { } decorativos' },
    { id: 'tech-squares', label: '⏹️ Cuadrados / Prismas Tech', desc: 'Geometría con borde luminoso' },
    { id: 'mixed-glass', label: '💎 Mezcla Editorial (Full Depth)', desc: 'Orbes + tarjetas + brackets' },
    { id: 'none', label: '🚫 Sin Formas', desc: 'Solo fondo y luces' },
  ];

  const shapePlacements: { id: ShapePlacement; label: string }[] = [
    { id: 'corners', label: '📐 4 Esquinas' },
    { id: 'periphery', label: '🔲 Todo el Borde' },
    { id: 'sides', label: '↔️ Solo Laterales' },
    { id: 'random-edges', label: '🎲 Aleatorio en Bordes' },
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
          <span className="text-[11px] text-slate-400">¿Tienes un patrón en SVG/PNG?</span>
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
        </div>

        {/* Difuminado / Máscara */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <label className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
            <Blend className="w-3.5 h-3.5 text-indigo-400" /> Viñeta / Máscara del Patrón:
          </label>
          <select
            value={state.patternVignette}
            onChange={(e) => updateState({ patternVignette: e.target.value as PatternVignette })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
          >
            {vignettes.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3.2 Luces Ambientales Neón (Glows / Iluminación) */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" /> Luces Ambientales & Neón
          </label>
          <span className="text-xs font-mono text-amber-400 font-bold">{state.lightIntensity}%</span>
        </div>

        <div>
          <label className="text-[11px] text-slate-300 font-medium mb-1 block">Estilo de Iluminación:</label>
          <select
            value={state.lightType || 'glow'}
            onChange={(e) => updateState({ lightType: e.target.value as LightType })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
          >
            {lightTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>{lt.label}</option>
            ))}
          </select>
        </div>

        {state.lightType !== 'none' && (
          <>
            <div>
              <label className="text-[11px] text-slate-300 font-medium mb-1 block">Dirección de la Luz:</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {lightDirections.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => updateState({ lightDirection: d.id })}
                    className={`py-1.5 px-2 rounded-lg text-left transition ${d.full ? 'col-span-2 text-center' : ''} ${
                      state.lightDirection === d.id
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Intensidad de la Luz:</span>
                <span className="text-amber-400 font-bold">{state.lightIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={state.lightIntensity}
                onChange={(e) => updateState({ lightIntensity: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </>
        )}
      </div>

      {/* 3.3 Formas Geométricas Vítreas (Solo en los bordes, centro 100% limpio) */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Shapes className="w-4 h-4 text-indigo-400" /> Formas Vítreas en Bordes
          </label>
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            Centro Limpio
          </span>
        </div>

        {/* Estilo de Formas */}
        <div>
          <label className="text-[11px] text-slate-300 font-medium mb-1.5 block">Estilo de Figuras:</label>
          <div className="space-y-1.5">
            {shapeStyles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => updateState({ shapeType: s.id })}
                className={`w-full p-2 rounded-xl border text-left transition flex items-center justify-between ${
                  (state.shapeType || 'glass-orbs') === s.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold">{s.label}</span>
                <span className="text-[10px] font-mono text-slate-500">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {state.shapeType !== 'none' && (
          <>
            {/* Ubicación Perimetral */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-300 font-medium">Ubicación en Bordes:</label>
                {state.shapePlacement === 'random-edges' && (
                  <button
                    type="button"
                    onClick={() => updateState({ shapeSeed: Date.now() })}
                    className="px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono flex items-center gap-1 transition"
                  >
                    <Dices className="w-3 h-3" /> Regenerar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                {shapePlacements.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => updateState({ shapePlacement: p.id })}
                    className={`py-1.5 px-2 rounded-lg text-center transition ${
                      (state.shapePlacement || 'corners') === p.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tamaño y Opacidad */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Tamaño:</label>
                <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                  {(['small', 'medium', 'large'] as ShapeSizeVariant[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => updateState({ shapeSizeVariant: sz })}
                      className={`py-1 rounded text-center transition ${
                        (state.shapeSizeVariant || 'medium') === sz
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz === 'small' ? 'S' : sz === 'large' ? 'L' : 'M'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Opacidad:</span>
                  <span className="text-indigo-400 font-bold">{state.shapeOpacity || 60}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={state.shapeOpacity || 60}
                  onChange={(e) => updateState({ shapeOpacity: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
