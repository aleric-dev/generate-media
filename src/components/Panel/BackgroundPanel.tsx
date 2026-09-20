import React, { useState } from 'react';
import { 
  PostState, 
  PatternType, 
  PatternVignette,
  FullBackgroundType,
  LightDirection, 
  ShapeGeometry, 
  ShapeStyleVariant, 
  ShapePlacement,
  ShapeSizeVariant,
  ShapeIconCategory
} from '../../types';
import { 
  Cpu, 
  Sparkles, 
  Shapes, 
  Circle,
  RectangleHorizontal,
  Triangle,
  Hexagon,
  Compass,
  Plus,
  Code2,
  Rocket,
  Image,
  Upload
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

  // Catálogo de 10 Patrones Web Tech Curados
  const patternList: PatternType[] = [
    'grid',
    'grid-dot',
    'dots',
    'excel-grid',
    'git-graph',
    'horizontal-lines',
    'waves',
    'diagonal',
    'blueprint',
    'crosses'
  ];

  const patternLabels: Record<string, string> = {
    'grid': 'Cuadrícula',
    'grid-dot': 'Grid + Punto',
    'dots': 'Puntos',
    'excel-grid': 'Celdas Excel',
    'git-graph': 'Ramas Git',
    'horizontal-lines': 'Renglones',
    'waves': 'Ondas',
    'diagonal': 'Diagonal',
    'blueprint': 'Blueprint',
    'crosses': 'Cruces'
  };

  // 5 Opciones de Degradado / Desvanecimiento del Patrón
  const vignetteList: { id: PatternVignette; label: string; previewGrad: string }[] = [
    { 
      id: 'gradient-diagonal', 
      label: 'Diagonal', 
      previewGrad: 'linear-gradient(135deg, rgba(99,102,241,0.95) 10%, rgba(99,102,241,0.2) 60%, transparent 100%)' 
    },
    { 
      id: 'vignette', 
      label: 'Viñeta', 
      previewGrad: 'radial-gradient(circle at center, rgba(99,102,241,0.95) 20%, transparent 85%)' 
    },
    { 
      id: 'gradient-top', 
      label: 'Superior', 
      previewGrad: 'linear-gradient(to bottom, rgba(99,102,241,0.95) 10%, transparent 90%)' 
    },
    { 
      id: 'gradient-bottom', 
      label: 'Inferior', 
      previewGrad: 'linear-gradient(to top, rgba(99,102,241,0.95) 10%, transparent 90%)' 
    },
    { 
      id: 'none', 
      label: 'Plano', 
      previewGrad: 'rgba(99,102,241,0.7)' 
    },
  ];

  const vignetteLabels: Record<PatternVignette, string> = {
    'gradient-diagonal': 'Diagonal (135°)',
    'vignette': 'Viñeta Radial',
    'gradient-top': 'Superior',
    'gradient-bottom': 'Inferior',
    'gradient-lateral': 'Lateral',
    'none': 'Plano (Sin corte)'
  };

  // 7 Direcciones de Iluminación representadas por sus degradados visuales
  const rgb = state.currentColor || '#4F46E5';
  const lightDirections: { id: LightDirection; title: string; grad: string }[] = [
    { 
      id: 'dual-corners-1', 
      title: 'Diagonal (Sup-Der a Inf-Izq)', 
      grad: `radial-gradient(circle at 100% 0%, ${rgb} 0%, transparent 60%), radial-gradient(circle at 0% 100%, ${rgb} 0%, transparent 55%)` 
    },
    { 
      id: 'dual-corners-2', 
      title: 'Diagonal (Sup-Izq a Inf-Der)', 
      grad: `radial-gradient(circle at 0% 0%, ${rgb} 0%, transparent 60%), radial-gradient(circle at 100% 100%, ${rgb} 0%, transparent 55%)` 
    },
    { 
      id: 'four-corners', 
      title: '4 Esquinas', 
      grad: `radial-gradient(circle at 0% 0%, ${rgb} 0%, transparent 45%), radial-gradient(circle at 100% 0%, ${rgb} 0%, transparent 45%), radial-gradient(circle at 0% 100%, ${rgb} 0%, transparent 45%), radial-gradient(circle at 100% 100%, ${rgb} 0%, transparent 45%)` 
    },
    { 
      id: 'top', 
      title: 'Superior', 
      grad: `radial-gradient(ellipse at 50% 0%, ${rgb} 0%, transparent 70%)` 
    },
    { 
      id: 'bottom', 
      title: 'Inferior', 
      grad: `radial-gradient(ellipse at 50% 100%, ${rgb} 0%, transparent 70%)` 
    },
    { 
      id: 'sides', 
      title: 'Laterales', 
      grad: `radial-gradient(ellipse at 0% 50%, ${rgb} 0%, transparent 55%), radial-gradient(ellipse at 100% 50%, ${rgb} 0%, transparent 55%)` 
    },
    { 
      id: 'center', 
      title: 'Centro Radial', 
      grad: `radial-gradient(circle at 50% 50%, ${rgb} 0%, transparent 65%)` 
    },
  ];

  // Catálogo de Geometrías & Motivos Flotantes Enriquecido (6 Opciones Limpias)
  const geometryList: { id: ShapeGeometry; label: string; icon: any }[] = [
    { id: 'orbs', label: 'Esferas', icon: Circle },
    { id: 'custom-icons', label: 'Íconos Flotantes', icon: Rocket },
    { id: 'triangles', label: 'Triángulos', icon: Triangle },
    { id: 'hexagons', label: 'Hexágonos', icon: Hexagon },
    { id: 'crosses', label: 'Cruces Tech', icon: Plus },
    { id: 'stars', label: 'Estrellas Glow', icon: Sparkles },
  ];

  const wallpaperList: { id: FullBackgroundType; name: string; desc: string }[] = [
    { id: 'none', name: 'Sin Wallpaper', desc: 'Solo color base' },
    { id: 'mesh-aurora', name: 'Mesh Aurora', desc: 'Gradientes orgánicos fluidos' },
    { id: 'horizon-3d', name: 'Horizonte 3D', desc: 'Perspectiva futurista fugada' },
    { id: 'terminal-wall', name: 'Terminal Wall', desc: 'Código denso en pantalla' },
    { id: 'custom-image', name: 'Imagen Propia', desc: 'Carga tu foto o wallpaper' }
  ];

  return (
    <div className="space-y-3.5">
      
      {/* ========================================================================= */}
      {/* 1. FONDOS COMPLETOS & WALLPAPERS ESCÉNICOS                                */}
      {/* ========================================================================= */}
      <AccordionSection
        id="wallpaper"
        title="1. Fondo Completo / Wallpaper Escénico"
        icon={Image}
        badge={state.fullBgType && state.fullBgType !== 'none' ? state.fullBgType : 'Ninguno'}
        isOpen={activeSection === 'wallpaper'}
        onToggle={() => toggleSection('wallpaper')}
      >
        <div className="space-y-3.5">
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1.5">
              Selecciona el Estilo Escénico:
            </label>
            <div className="grid grid-cols-5 gap-1.5 p-0.5">
              {wallpaperList.map((wp) => {
                const isSelected = (state.fullBgType || 'none') === wp.id;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => updateState({ fullBgType: wp.id })}
                    title={wp.desc}
                    className={`h-16 rounded-xl border transition-all relative overflow-hidden flex flex-col items-center justify-between p-1.5 ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/60 shadow-lg shadow-indigo-500/20 bg-indigo-950/30 scale-[1.02]'
                        : 'border-slate-800 hover:border-slate-600 hover:scale-[1.01] bg-slate-950/60'
                    }`}
                  >
                    <div className="w-full h-8 rounded-lg overflow-hidden relative flex items-center justify-center bg-slate-900 border border-slate-800/60">
                      {wp.id === 'none' && <span className="text-[10px] text-slate-500 font-mono">Liso</span>}
                      {wp.id === 'mesh-aurora' && <div className="w-full h-full full-bg-mesh-aurora" />}
                      {wp.id === 'horizon-3d' && <div className="w-full h-full full-bg-horizon-3d" />}
                      {wp.id === 'terminal-wall' && <div className="w-full h-full full-bg-terminal-wall" />}
                      {wp.id === 'custom-image' && (
                        state.customWallpaperUrl 
                          ? <img src={state.customWallpaperUrl} className="w-full h-full object-cover" alt="prev" />
                          : <Image className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-300 font-semibold truncate w-full text-center">
                      {wp.name}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400 shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subida o URL de Imagen Personalizada */}
          {state.fullBgType === 'custom-image' && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <label className="text-[10px] text-slate-300 font-mono block">
                URL o Carga de Imagen de Fondo:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://ejemplo.com/fondo.jpg"
                  value={state.customWallpaperUrl || ''}
                  onChange={(e) => updateState({ customWallpaperUrl: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
                <label className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg cursor-pointer flex items-center gap-1 font-medium transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            updateState({ customWallpaperUrl: event.target.result as string });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Sliders de Opacidad y Desenfoque Blur para el Wallpaper */}
          {state.fullBgType && state.fullBgType !== 'none' && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-400 font-mono">Opacidad Wallpaper:</label>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">
                      {state.wallpaperOpacity ?? 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={state.wallpaperOpacity ?? 100}
                    onChange={(e) => updateState({ wallpaperOpacity: Number(e.target.value) })}
                    className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-400 font-mono">Desenfoque (Blur):</label>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">
                      {state.wallpaperBlur || 0}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={state.wallpaperBlur || 0}
                    onChange={(e) => updateState({ wallpaperBlur: Number(e.target.value) })}
                    className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2. PATRÓN DE TEXTURA EN CARDS PURAS (10 TRAMAS CURADAS)                   */}
      {/* ========================================================================= */}
      <AccordionSection
        id="pattern"
        title="2. Patrón / Trama Tecnológica"
        icon={Cpu}
        badge={state.patternEnabled !== false ? (patternLabels[state.bgPattern || 'grid'] || state.bgPattern || 'Cuadrícula') : 'Desactivado'}
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
                patternOpacity: 100
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
              
              {/* GRID DE CARDS CON LOS 10 PATRONES CURADOS (5x2) */}
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1.5">
                  Selecciona la Trama:
                </label>
                <div className="grid grid-cols-5 gap-1.5 p-0.5">
                  {patternList.map((patId) => {
                    const isSelected = (state.bgPattern || 'grid') === patId;
                    const patClass = `pattern-${patId}${isLight ? '-light' : ''}`;

                    const previewBgSize =
                      patId === 'dots' ? '18px 18px' :
                      patId === 'grid' || patId === 'grid-dot' ? '14px 14px' :
                      patId === 'diagonal' ? '14px 14px' :
                      patId === 'crosses' ? '24px 24px' :
                      patId === 'blueprint' ? '32px 32px, 32px 32px, 10px 10px, 10px 10px' :
                      patId === 'waves' ? '38px 18px' :
                      patId === 'excel-grid' ? '36px 12px' :
                      patId === 'git-graph' ? '40px 15px' :
                      patId === 'horizontal-lines' ? '100% 10px' : '20px 20px';

                    return (
                      <button
                        key={patId}
                        type="button"
                        onClick={() => updateState({ 
                          bgPattern: patId,
                          patternEnabled: true,
                          patternOpacity: state.patternOpacity ?? 100
                        })}
                        title={patternLabels[patId] || patId}
                        className={`h-16 rounded-xl border transition-all relative overflow-hidden flex flex-col items-center justify-between p-1.5 ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/60 shadow-lg shadow-indigo-500/20 bg-indigo-950/20 scale-[1.02]'
                            : 'border-slate-800 hover:border-slate-600 hover:scale-[1.01]'
                        }`}
                        style={{
                          backgroundColor: isLight ? '#F1F5F9' : '#0B0F19'
                        }}
                      >
                        <div 
                          className={`w-full h-8 rounded-lg ${patClass}`}
                          style={{
                            backgroundSize: previewBgSize,
                            backgroundPosition: 'center',
                            opacity: 1
                          }}
                        />
                        <span className="text-[9px] font-mono text-slate-300 font-semibold truncate w-full text-center">
                          {patternLabels[patId] || patId}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400 shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SLIDERS DE ZOOM Y OPACIDAD EN LA MISMA FILA */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="grid grid-cols-2 gap-3">
                  {/* Slider Zoom / Escala */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-slate-400 font-mono">Zoom / Escala:</label>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold">
                        {state.patternScale || 100}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={400}
                      step={5}
                      value={state.patternScale || 100}
                      onChange={(e) => updateState({ patternScale: Number(e.target.value) })}
                      className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Slider Opacidad (0 a 100% donde 100% en slider = 20% real en lienzo) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-slate-400 font-mono">Opacidad:</label>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold">
                        {state.patternOpacity ?? 100}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={state.patternOpacity ?? 100}
                      onChange={(e) => updateState({ patternOpacity: Number(e.target.value) })}
                      className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* DEGRADADO / DESVANECIMIENTO VISUAL DEL PATRÓN */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] text-slate-400 font-mono">
                    Degradado / Desvanecimiento del Patrón:
                  </label>
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold">
                    {vignetteLabels[state.patternVignette || 'gradient-diagonal'] || 'Diagonal'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 p-0.5">
                  {vignetteList.map((vig) => {
                    const isSelected = (state.patternVignette || 'gradient-diagonal') === vig.id;
                    return (
                      <button
                        key={vig.id}
                        type="button"
                        onClick={() => updateState({ patternVignette: vig.id })}
                        title={vignetteLabels[vig.id] || vig.label}
                        className={`h-14 rounded-lg border transition-all relative overflow-hidden flex flex-col items-center justify-between p-1 ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/60 shadow-md shadow-indigo-500/20 bg-indigo-950/20 scale-[1.02]'
                            : 'border-slate-800 hover:border-slate-600 hover:scale-[1.01]'
                        }`}
                        style={{
                          backgroundColor: isLight ? '#F1F5F9' : '#0B0F19'
                        }}
                      >
                        <div
                          className="w-full h-6 rounded border border-slate-700/50"
                          style={{
                            background: vig.previewGrad
                          }}
                        />
                        <span className="text-[8.5px] font-mono text-slate-300 font-semibold truncate w-full text-center">
                          {vig.label}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Slider de Intensidad del Degradado */}
                {state.patternVignette !== 'none' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-slate-400 font-mono">
                        Intensidad / Foco del Degradado:
                      </label>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold">
                        {state.patternVignetteIntensity ?? 70}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      step={5}
                      value={state.patternVignetteIntensity ?? 70}
                      onChange={(e) => updateState({ patternVignetteIntensity: Number(e.target.value) })}
                      className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2. ILUMINACIÓN NEÓN AMBIENTAL (UN SOLO TIPO, DIRECCIÓN EN CARDS VISUALES)  */}
      {/* ========================================================================= */}
      <AccordionSection
        id="lights"
        title="3. Iluminación Ambiental Neón"
        icon={Sparkles}
        badge={state.lightsEnabled !== false ? `${state.lightIntensity ?? 40}%` : 'Sin luces'}
        isOpen={activeSection === 'lights'}
        onToggle={() => toggleSection('lights')}
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Activar Iluminación:
            </span>
            <button
              type="button"
              onClick={() => updateState({ 
                lightsEnabled: state.lightsEnabled === false ? true : false,
                lightType: 'glow'
              })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                state.lightsEnabled !== false ? 'bg-indigo-600' : 'bg-slate-800'
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
              
              {/* SELECTOR DE DIRECCIÓN EN CARDS VISUALES (SIN NOMBRE) */}
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1.5">
                  Dirección de la Luz (Cards de Ejemplo):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {lightDirections.map((dir) => {
                    const isSelected = (state.lightDirection || 'dual-corners-1') === dir.id;
                    return (
                      <button
                        key={dir.id}
                        type="button"
                        onClick={() => updateState({ lightDirection: dir.id, lightType: 'glow' })}
                        title={dir.title}
                        className={`h-14 rounded-xl border transition-all relative overflow-hidden ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/60 shadow-lg shadow-indigo-500/20 scale-105'
                            : 'border-slate-800 hover:border-slate-600 hover:scale-[1.02]'
                        }`}
                        style={{
                          backgroundColor: '#030712'
                        }}
                      >
                        <div 
                          className="w-full h-full"
                          style={{
                            backgroundImage: dir.grad,
                            opacity: 0.85
                          }}
                        />
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400 shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SLIDER DE INTENSIDAD */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] text-slate-400 font-mono">Intensidad del Resplandor:</label>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold">
                    {state.lightIntensity ?? 40}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={state.lightIntensity ?? 40}
                  onChange={(e) => updateState({ lightIntensity: Number(e.target.value) })}
                  className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 3. FORMAS & MOTIVOS DECORATIVOS (VARIEDAD REAL + 6 ACABADOS + AUTO RANDOM)  */}
      {/* ========================================================================= */}
      <AccordionSection
        id="shapes"
        title="4. Formas Decorativas & Geometrías"
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
              onClick={() => updateState({ 
                shapesEnabled: state.shapesEnabled === false ? true : false,
                shapeEnabled: state.shapesEnabled === false ? true : false
              })}
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
              
              {/* CATÁLOGO DE GEOMETRÍAS REALES EN CARDS */}
              <div>
                <label className="text-[11px] text-slate-400 font-mono block mb-1.5">
                  Variedad de Geometrías:
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  {geometryList.map((geo) => {
                    const IconCmp = geo.icon;
                    const isSelected = (state.shapeGeometry || 'orbs') === geo.id;
                    return (
                      <button
                        key={geo.id}
                        type="button"
                        onClick={() => updateState({ 
                          shapeGeometry: geo.id,
                          shapeType: geo.id,
                          // Autogenerar sutilmente la semilla orgánica para refresco natural
                          shapeSeed: Math.floor(Math.random() * 900000) + 100000
                        })}
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

              {/* SELECTOR TEMÁTICO DE ÍCONOS FLOTANTES */}
              {/* SELECTOR TEMÁTICO DE ÍCONOS FLOTANTES (6 CATEGORÍAS COMPACTAS) */}
              {state.shapeGeometry === 'custom-icons' && (
                <div className="p-2.5 bg-slate-950/80 border border-indigo-500/30 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-indigo-300 font-mono font-bold block">
                      Temática de Íconos:
                    </label>
                    <span className="text-[9px] text-slate-400 font-mono">
                      6 colecciones
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                    {[
                      { id: 'tech' as ShapeIconCategory, label: '💻 Dev & Tech' },
                      { id: 'growth' as ShapeIconCategory, label: '🚀 Growth & SaaS' },
                      { id: 'creative' as ShapeIconCategory, label: '🎨 Creativo & UI' },
                      { id: 'social' as ShapeIconCategory, label: '💬 Social Media' },
                      { id: 'security' as ShapeIconCategory, label: '🔒 Cloud & Sec' },
                      { id: 'finance' as ShapeIconCategory, label: '📈 Ventas & ROI' },
                    ].map((cat) => {
                      const isCatSelected = (state.shapeIconCategory || 'tech') === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => updateState({ 
                            shapeIconCategory: cat.id,
                            shapeSeed: Math.floor(Math.random() * 900000) + 100000
                          })}
                          className={`py-1.5 px-1 rounded-lg text-center transition border truncate ${
                            isCatSelected
                              ? 'bg-indigo-600/40 border-indigo-400 text-white font-bold ring-1 ring-indigo-400 shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                          }`}
                        >
                          <span className="truncate block">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6 OPCIONES DE ACABADO VISUAL (UNIVERSAL A TODAS LAS FIGURAS) */}
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">
                  Acabado Visual (6 Estilos Verificados):
                </label>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                  {[
                    { id: 'glass' as ShapeStyleVariant, label: 'Vidrio Glass' },
                    { id: 'flat' as ShapeStyleVariant, label: 'Flat Sólido' },
                    { id: 'pastel' as ShapeStyleVariant, label: 'Suave Pastel' },
                    { id: 'neon-outline' as ShapeStyleVariant, label: 'Neón Glow' },
                    { id: 'duotone' as ShapeStyleVariant, label: 'Duotono' },
                    { id: 'holographic' as ShapeStyleVariant, label: 'Holográfico' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => updateState({ shapeStyleVariant: st.id })}
                      className={`py-2 px-1 rounded-xl text-center transition ${
                        (state.shapeStyleVariant || 'glass') === st.id
                          ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DISTRIBUCIÓN AUTOMÁTICA (CON ALEATORIEDAD ORGÁNICA INTEGRADA) */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">
                    Distribución en Canvas (Aleatoriedad Automática):
                  </label>
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                    {[
                      { id: 'corners' as ShapePlacement, label: 'Esquinas' },
                      { id: 'sides' as ShapePlacement, label: 'Laterales' },
                      { id: 'periphery' as ShapePlacement, label: 'Periferia' },
                      { id: 'random-edges' as ShapePlacement, label: 'Disperso' },
                    ].map((pl) => (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={() => updateState({ 
                          shapePlacement: pl.id,
                          shapeSeed: Math.floor(Math.random() * 900000) + 100000
                        })}
                        className={`py-1.5 px-1 rounded-lg text-center transition ${
                          (state.shapePlacement || 'corners') === pl.id
                            ? 'bg-indigo-600 text-white font-bold shadow-sm'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pl.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono block mt-1">
                    ✓ Algoritmo perimetral anti-colisión sin solapamiento
                  </span>
                </div>

                {/* Sliders para Cantidad y Tamaño de Formas */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-slate-400 font-mono">Cantidad:</label>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">
                        {state.shapeCount ?? 6} formas
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      step={1}
                      value={state.shapeCount ?? 6}
                      onChange={(e) => updateState({ 
                        shapeCount: Number(e.target.value),
                        shapeSeed: Math.floor(Math.random() * 900000) + 100000
                      })}
                      className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] text-slate-400 font-mono">Escala / Tamaño:</label>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">
                        {state.shapeSizeScale ?? 100}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={180}
                      step={5}
                      value={state.shapeSizeScale ?? 100}
                      onChange={(e) => updateState({ shapeSizeScale: Number(e.target.value) })}
                      className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </AccordionSection>

    </div>
  );
};
