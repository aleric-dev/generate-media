import React from 'react';
import { 
  PostState, 
  PatternType, 
  PatternVignette, 
  LightType, 
  LightDirection, 
  ShapeType, 
  ShapePlacement, 
  ShapeSizeVariant,
  ShapeStyleVariant,
  ShapeGeometry,
  ShapeProximity,
  BackgroundLayerOrder
} from '../../types';
import { 
  Cpu, 
  ZoomIn, 
  Blend, 
  Sparkles, 
  Sun, 
  Upload, 
  Shapes, 
  Dices,
  Layers,
  Eye,
  Sliders,
  Palette
} from 'lucide-react';

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
        bgPattern: 'custom',
        patternEnabled: true
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      
      {/* ========================================================================= */}
      {/* 1. PATRÓN DE TEXTURA (CON SWITCH ON/OFF Y OPACIDAD) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-400" /> Patrón / Trama de Fondo
          </label>
          <button
            type="button"
            onClick={() => updateState({ patternEnabled: state.patternEnabled === false ? true : false })}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              state.patternEnabled !== false ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                state.patternEnabled !== false ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {state.patternEnabled !== false && (
          <>
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

            {/* Sliders: Zoom del Patrón y Opacidad del Patrón */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Zoom Patrón:</span>
                  <span className="text-indigo-400 font-bold">{state.patternScale} px</span>
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

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Opacidad Patrón:</span>
                  <span className="text-indigo-400 font-bold">{state.patternOpacity ?? 70}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={state.patternOpacity ?? 70}
                  onChange={(e) => updateState({ patternOpacity: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
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
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. LUCES AMBIENTALES NEÓN (CON SWITCH ON/OFF E INTENSIDAD) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" /> Luces Ambientales & Neón
          </label>
          <button
            type="button"
            onClick={() => updateState({ lightsEnabled: state.lightsEnabled === false ? true : false })}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              state.lightsEnabled !== false ? 'bg-amber-500' : 'bg-slate-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                state.lightsEnabled !== false ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {state.lightsEnabled !== false && (
          <>
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
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. FORMAS GEOMÉTRICAS (ACABADOS, GEOMETRÍAS, BORDES LIMPIOS) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Shapes className="w-4 h-4 text-indigo-400" /> Formas Decorativas en Bordes
          </label>
          <button
            type="button"
            onClick={() => updateState({ shapesEnabled: state.shapesEnabled === false ? true : false })}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              state.shapesEnabled !== false ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                state.shapesEnabled !== false ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {state.shapesEnabled !== false && (
          <div className="space-y-3">
            {/* Generador Aleatorio Procedimental de Posiciones */}
            <div className="p-3 bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Dices className="w-4 h-4 text-indigo-400" /> Distribución Procedimental
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Semilla: #{state.shapeSeed || 12345} (posiciones 100% únicas en bordes)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updateState({ 
                    shapeSeed: Math.floor(Math.random() * 900000) + 100000,
                    shapePlacement: 'random-edges'
                  })}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95 transition"
                >
                  <Dices className="w-3.5 h-3.5" /> Aleatorizar Posiciones
                </button>
              </div>

              {/* Slider Cantidad de Formas */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                  <span>Cantidad de Formas en Bordes:</span>
                  <span className="text-indigo-400 font-bold">{state.shapeCount || 6} elementos</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={12}
                  step={1}
                  value={state.shapeCount || 6}
                  onChange={(e) => updateState({ shapeCount: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Acabado / Textura de Forma */}
            <div>
              <label className="text-[11px] text-slate-300 font-medium mb-1 block">Acabado / Textura:</label>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                {[
                  { id: 'glass' as ShapeStyleVariant, label: 'Vidrio Glass' },
                  { id: 'flat' as ShapeStyleVariant, label: 'Plano Sólido' },
                  { id: 'pastel' as ShapeStyleVariant, label: 'Pastel Suave' },
                  { id: 'neon-outline' as ShapeStyleVariant, label: 'Neón Trazo' },
                  { id: 'duotone' as ShapeStyleVariant, label: 'Duotono' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => updateState({ shapeStyleVariant: st.id })}
                    className={`py-1.5 px-1.5 rounded-lg text-center transition ${
                      (state.shapeStyleVariant || 'glass') === st.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Geometría */}
            <div>
              <label className="text-[11px] text-slate-300 font-medium mb-1 block">Geometría:</label>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                {[
                  { id: 'orbs' as ShapeGeometry, label: '🔮 Esferas' },
                  { id: 'squares' as ShapeGeometry, label: '⏹️ Cuadrados' },
                  { id: 'diamonds' as ShapeGeometry, label: '💠 Rombos' },
                  { id: 'triangles' as ShapeGeometry, label: '▲ Triángulos' },
                  { id: 'tech-code' as ShapeGeometry, label: '💻 Brackets { }' },
                  { id: 'abstract' as ShapeGeometry, label: '💎 Mixto Editorial' },
                ].map((geo) => (
                  <button
                    key={geo.id}
                    type="button"
                    onClick={() => updateState({ shapeGeometry: geo.id })}
                    className={`py-1.5 px-1.5 rounded-lg text-center transition ${
                      (state.shapeGeometry || 'orbs') === geo.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {geo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Secundario para Duotono */}
            {state.shapeStyleVariant === 'duotone' && (
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-mono">Color Secundario Duotono:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={state.shapeDuotoneColor || '#06b6d4'}
                    onChange={(e) => updateState({ shapeDuotoneColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-[11px] font-mono text-slate-300">{state.shapeDuotoneColor || '#06b6d4'}</span>
                </div>
              </div>
            )}

            {/* Proximidad a Bordes */}
            <div>
              <label className="text-[11px] text-slate-300 font-medium mb-1 block">Proximidad al Marco Exterior:</label>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                {[
                  { id: 'edges' as ShapeProximity, label: 'Borde Extremo' },
                  { id: 'balanced' as ShapeProximity, label: 'Equilibrado' },
                  { id: 'close' as ShapeProximity, label: 'Cerca del Contenido' },
                ].map((prox) => (
                  <button
                    key={prox.id}
                    type="button"
                    onClick={() => updateState({ shapeProximity: prox.id })}
                    className={`py-1.5 px-1 rounded-lg text-center transition ${
                      (state.shapeProximity || 'edges') === prox.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {prox.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modo de Ubicación */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-300 font-medium block">Patrón de Distribución:</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                {[
                  { id: 'random-edges', label: '🎲 Orgánico / Aleatorio' },
                  { id: 'periphery', label: '📐 Perimetral Equilibrado' },
                  { id: 'corners', label: '🔲 Cuatro Esquinas' },
                  { id: 'sides', label: '↔️ Laterales Flotantes' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => updateState({ shapePlacement: p.id as any })}
                    className={`py-1.5 px-2 rounded-lg text-center transition ${
                      (state.shapePlacement || 'random-edges') === p.id
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
          </div>
        )}
      </div>

    </div>
  );
};
