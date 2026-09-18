import React, { useState } from 'react';
import { 
  PostState, 
  PatternType, 
  LightType, 
  LightDirection, 
  ShapeGeometry, 
  ShapeStyleVariant, 
  ShapeProximity 
} from '../../types';
import { 
  Cpu, 
  Sparkles, 
  Sun, 
  Shapes, 
  Dices, 
  Circle,
  Square,
  Diamond,
  Triangle,
  Code2,
  Gem,
  Plus,
  Compass,
  Zap,
  Sliders
} from 'lucide-react';
import { AccordionSection } from './AccordionSection';

interface BackgroundPanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({
  state,
  updateState
}) => {
  const [activeSection, setActiveSection] = useState<string | null>('pattern');

  const toggleSection = (key: string) => {
    setActiveSection((prev) => (prev === key ? null : key));
  };

  const isLight = state.canvasMode === 'light';

  // Catálogo de Patrones Tecnológicos
  const patternList: { id: PatternType; label: string; icon: string; desc: string }[] = [
    { id: 'circuit', label: 'Circuitos PCB', icon: '🖲️', desc: 'Pistas y microchips' },
    { id: 'hexagons', label: 'Hexágonos Tech', icon: '⬡', desc: 'Malla grafeno' },
    { id: 'matrix', label: 'Matriz Cyber', icon: '💻', desc: 'Grid reticular binario' },
    { id: 'neural', label: 'Red Neuronal', icon: '🌐', desc: 'Nodos y constelación' },
    { id: 'isometric', label: 'Isométrico 3D', icon: '📐', desc: 'Blueprint de perspectiva' },
    { id: 'grid', label: 'Rejilla Clásica', icon: '▦', desc: 'Grid milimétrico' },
    { id: 'dots', label: 'Puntos Tech', icon: '⁖', desc: 'Matriz minimalista' },
    { id: 'waves', label: 'Ondas Digitales', icon: '〰️', desc: 'Señal electromagnética' },
    { id: 'diagonal', label: 'Diagonales Cyber', icon: '📐', desc: 'Rayado industrial' },
    { id: 'topographic', label: 'Topográfico', icon: '🗺️', desc: 'Curvas de elevación' },
    { id: 'noise', label: 'Grano / Ruido', icon: '📺', desc: 'Textura analógica' },
    { id: 'none', label: 'Sin Patrón', icon: '⚪', desc: 'Lienzo plano liso' },
  ];

  // Catálogo de Iluminación
  const lightStyles: { id: LightType; label: string; icon: string; previewGrad: string }[] = [
    { 
      id: 'glow', 
      label: 'Glow Radial', 
      icon: '✨', 
      previewGrad: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.7) 0%, transparent 70%)' 
    },
    { 
      id: 'spotlight', 
      label: 'Focos Esquina', 
      icon: '🔦', 
      previewGrad: 'radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.8) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(6, 182, 212, 0.6) 0%, transparent 60%)' 
    },
    { 
      id: 'aurora', 
      label: 'Aurora Polar', 
      icon: '🌌', 
      previewGrad: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.8) 0%, rgba(6, 182, 212, 0.5) 45%, transparent 75%)' 
    },
    { 
      id: 'dual-beams', 
      label: 'Haces Duales', 
      icon: '⚡', 
      previewGrad: 'linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, transparent 50%), linear-gradient(315deg, rgba(6, 182, 212, 0.6) 0%, transparent 50%)' 
    },
    { 
      id: 'none', 
      label: 'Sin Luz', 
      icon: '🚫', 
      previewGrad: 'none' 
    },
  ];

  const lightDirections: { id: LightDirection; label: string }[] = [
    { id: 'dual-corners-1', label: 'Diagonal 1 (TL-BR)' },
    { id: 'dual-corners-2', label: 'Diagonal 2 (TR-BL)' },
    { id: 'four-corners', label: '4 Esquinas' },
    { id: 'top', label: 'Arriba' },
    { id: 'bottom', label: 'Abajo' },
    { id: 'sides', label: 'Laterales' },
    { id: 'center', label: 'Centro' },
  ];

  // Catálogo de Geometrías de Fondo Ampliado
  const geometryList: { id: ShapeGeometry; label: string; icon: any }[] = [
    { id: 'orbs', label: 'Esferas', icon: Circle },
    { id: 'rings', label: 'Anillos Cyber', icon: Compass },
    { id: 'squares', label: 'Cuadros', icon: Square },
    { id: 'diamonds', label: 'Rombos', icon: Diamond },
    { id: 'triangles', label: 'Triángulos', icon: Triangle },
    { id: 'crosses', label: 'Cruces Grid', icon: Plus },
    { id: 'stars', label: 'Destellos ✦', icon: Sparkles },
    { id: 'tech-code', label: 'Brackets Tech', icon: Code2 },
    { id: 'abstract', label: 'Híbrido Mixto', icon: Gem },
  ];

  return (
    <div className="space-y-4">
      
      {/* ========================================================================= */}
      {/* 3.1 PATRÓN DE TEXTURA EN CARDS VISUALES (OPACIDAD 100%, PLANO SIN VIÑETA) */}
      {/* ========================================================================= */}
      <AccordionSection
        id="pattern"
        title="Patrón / Trama en Cards"
        icon={Cpu}
        badge={state.patternEnabled !== false ? (state.bgPattern || 'circuit') : 'Desactivado'}
        isOpen={activeSection === 'pattern'}
        onToggle={() => toggleSection('pattern')}
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs text-slate-300 font-medium">Activar Patrón de Fondo:</span>
            <button
              type="button"
              onClick={() => updateState({ 
                patternEnabled: state.patternEnabled === false ? true : false,
                patternOpacity: 100,
                patternVignette: 'none'
              })}
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
            <div className="space-y-3.5">
              
              {/* Grid de Cards de Patrones (Puntualizado por el Usuario) */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-mono block">
                  Selecciona la Trama Tecnológica (Cards):
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {patternList.map((p) => {
                    const isSelected = (state.bgPattern || 'circuit') === p.id;
                    const patClass = p.id === 'none' 
                      ? 'bg-slate-950' 
                      : `pattern-${p.id}${isLight ? '-light' : ''} bg-[#0A0E1A]`;

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => updateState({ 
                          bgPattern: p.id,
                          patternEnabled: true,
                          patternOpacity: 100,
                          patternVignette: 'none'
                        })}
                        className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-24 ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-slate-900 shadow-md shadow-indigo-500/15'
                            : 'border-slate-800/90 hover:border-slate-700 bg-slate-950/80 hover:bg-slate-900/60'
                        }`}
                      >
                        {/* Miniatura que renderiza la trama real plana al 100% */}
                        <div 
                          className={`w-full h-10 rounded-lg border border-white/5 relative overflow-hidden mb-1.5 ${patClass}`}
                          style={{
                            backgroundSize: '24px 24px',
                            backgroundColor: isLight ? '#F1F5F9' : '#0B0F19'
                          }}
                        >
                          <span className="absolute top-1 left-1.5 text-xs">
                            {p.icon}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white leading-tight truncate">
                              {p.label}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            {p.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector Uniforme de Escala / Zoom del Patrón */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono block">
                  Escala / Zoom del Patrón:
                </label>
                <select
                  value={state.patternScale || 100}
                  onChange={(e) => updateState({ 
                    patternScale: parseInt(e.target.value, 10),
                    patternOpacity: 100,
                    patternVignette: 'none'
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                >
                  {[
                    { val: 40, label: '40 px (Trama Densa)' },
                    { val: 60, label: '60 px (Compacto)' },
                    { val: 80, label: '80 px (Medio)' },
                    { val: 100, label: '100 px (Normal - Defecto)' },
                    { val: 120, label: '120 px (Amplio)' },
                    { val: 160, label: '160 px (Grande)' },
                    { val: 200, label: '200 px (Extra Grande)' },
                  ].map((opt) => (
                    <option key={opt.val} value={opt.val}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 font-mono block pt-0.5">
                  ✓ Opacidad 100% fija • Fondo plano sin viñeta
                </span>
              </div>

            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 3.2 ILUMINACIÓN NEÓN EN CARDS DE EJEMPLO                                  */}
      {/* ========================================================================= */}
      <AccordionSection
        id="lights"
        title="Iluminación Neón en Cards"
        icon={Sparkles}
        badge={state.lightsEnabled !== false ? (state.lightType || 'glow') : 'Sin luces'}
        isOpen={activeSection === 'lights'}
        onToggle={() => toggleSection('lights')}
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Activar Iluminación Neón:
            </span>
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
            <div className="space-y-3.5">
              
              {/* Cards de Ejemplo para los Estilos de Iluminación */}
              <div>
                <label className="text-[11px] text-slate-400 font-mono block mb-1.5">
                  Estilo de Iluminación (Cards de Ejemplo):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {lightStyles.map((lt) => {
                    const isSelected = (state.lightType || 'glow') === lt.id;
                    return (
                      <button
                        key={lt.id}
                        type="button"
                        onClick={() => updateState({ lightType: lt.id })}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-22 relative overflow-hidden ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-500/50 bg-slate-900 shadow-md shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-950/80 hover:bg-slate-900/60'
                        }`}
                      >
                        {/* Miniatura que simula el resplandor cromático */}
                        <div 
                          className="w-full h-8 rounded-lg bg-slate-950 border border-white/5 relative overflow-hidden mb-1 flex items-center justify-center"
                          style={{
                            backgroundImage: lt.previewGrad !== 'none' ? lt.previewGrad : undefined,
                            backgroundColor: lt.previewGrad === 'none' ? '#030712' : undefined
                          }}
                        >
                          <span className="text-xs drop-shadow-md">{lt.icon}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white truncate">
                            {lt.label}
                          </span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {state.lightType !== 'none' && (
                <>
                  {/* Selector de Dirección de la Luz */}
                  <div>
                    <label className="text-[11px] text-slate-400 font-mono block mb-1">
                      Dirección y Posicionamiento:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                      {lightDirections.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => updateState({ lightDirection: d.id })}
                          className={`py-1.5 px-2 rounded-lg text-left transition ${
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

                  {/* Selector Uniforme de Intensidad de la Luz */}
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono block">
                      Intensidad de la Luz Ambiental:
                    </label>
                    <select
                      value={state.lightIntensity ?? 40}
                      onChange={(e) => updateState({ lightIntensity: parseInt(e.target.value, 10) })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    >
                      {[
                        { val: 20, label: '20% (Sutil / Tenue)' },
                        { val: 30, label: '30% (Moderado)' },
                        { val: 40, label: '40% (Equilibrado - Defecto)' },
                        { val: 60, label: '60% (Brillante)' },
                        { val: 80, label: '80% (Vívido)' },
                        { val: 100, label: '100% (Máximo Resplandor)' },
                      ].map((opt) => (
                        <option key={opt.val} value={opt.val}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 3.3 FORMAS & MOTIVOS DECORATIVOS AMPLIADOS EN CARDS                       */}
      {/* ========================================================================= */}
      <AccordionSection
        id="shapes"
        title="Formas & Motivos de Fondo"
        icon={Shapes}
        badge={state.shapesEnabled !== false ? (state.shapeGeometry || 'orbs') : 'Desactivado'}
        isOpen={activeSection === 'shapes'}
        onToggle={() => toggleSection('shapes')}
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Shapes className="w-3.5 h-3.5 text-indigo-400" /> Activar Formas Decorativas:
            </span>
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
            <div className="space-y-3.5">
              
              {/* Generador Procedimental Determinista */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Dices className="w-4 h-4 text-indigo-400" /> Distribución Determinista
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Semilla: #{state.shapeSeed || 12345}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateState({ 
                      shapeSeed: Math.floor(Math.random() * 900000) + 100000,
                      shapePlacement: 'random-edges'
                    })}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95 transition"
                  >
                    <Dices className="w-3.5 h-3.5" /> Aleatorizar
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">
                    Cantidad de Formas:
                  </label>
                  <select
                    value={state.shapeCount || 6}
                    onChange={(e) => updateState({ shapeCount: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {[
                      { val: 4, label: '4 formas (Minimal)' },
                      { val: 6, label: '6 formas (Equilibrado - Defecto)' },
                      { val: 8, label: '8 formas (Dinámico)' },
                      { val: 10, label: '10 formas (Rico)' },
                      { val: 12, label: '12 formas (Máximo)' },
                    ].map((opt) => (
                      <option key={opt.val} value={opt.val}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Catálogo de Geometrías Ampliado en Cards (Puntualizado por el Usuario) */}
              <div>
                <label className="text-[11px] text-slate-400 font-mono block mb-1.5">
                  Motivo / Geometría (Cards):
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  {geometryList.map((geo) => {
                    const IconCmp = geo.icon;
                    const isSelected = (state.shapeGeometry || 'orbs') === geo.id;
                    return (
                      <button
                        key={geo.id}
                        type="button"
                        onClick={() => updateState({ shapeGeometry: geo.id })}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition border ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold border-indigo-400 shadow-md ring-1 ring-indigo-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <IconCmp className="w-4 h-4" />
                        <span className="text-[10px] truncate w-full">{geo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Acabado Visual de las Formas */}
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Acabado Visual:</label>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                  {[
                    { id: 'glass' as ShapeStyleVariant, label: 'Vidrio Glass' },
                    { id: 'flat' as ShapeStyleVariant, label: 'Flat Sólido' },
                    { id: 'pastel' as ShapeStyleVariant, label: 'Pastel' },
                    { id: 'neon-outline' as ShapeStyleVariant, label: 'Neón Glow' },
                    { id: 'duotone' as ShapeStyleVariant, label: 'Duotono' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => updateState({ shapeStyleVariant: st.id })}
                      className={`py-1.5 px-1 rounded-lg text-center transition ${
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

              {/* Proximidad a los Bordes */}
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Proximidad a Bordes:</label>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                  {[
                    { id: 'edges' as ShapeProximity, label: 'Bordes Ext.' },
                    { id: 'balanced' as ShapeProximity, label: 'Equilibrado' },
                    { id: 'close' as ShapeProximity, label: 'Cercano' },
                  ].map((px) => (
                    <button
                      key={px.id}
                      type="button"
                      onClick={() => updateState({ shapeProximity: px.id })}
                      className={`py-1.5 px-1 rounded-lg text-center transition ${
                        (state.shapeProximity || 'edges') === px.id
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {px.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </AccordionSection>

    </div>
  );
};
