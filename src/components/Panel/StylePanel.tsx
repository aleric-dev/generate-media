import React, { useState } from 'react';
import { 
  PostState, 
  HeaderShape, 
  FooterShape, 
  TitleColorMode, 
  SubtitleColorMode,
  BadgeStyle,
  BadgeColorMode,
  ImageBorderStyle
} from '../../types';
import { 
  Sun, 
  Moon, 
  Palette, 
  Layout, 
  Type, 
  Box, 
  Sparkles,
  Heading,
  Footprints
} from 'lucide-react';
import { AccordionSection } from './AccordionSection';

interface StylePanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const StylePanel: React.FC<StylePanelProps> = ({
  state,
  updateState
}) => {
  const [activeSection, setActiveSection] = useState<string | null>('palette');

  const toggleSection = (key: string) => {
    setActiveSection((prev) => (prev === key ? null : key));
  };

  // 20 Paletas de Color Curadas
  const colorPresets = [
    { color: '#4F46E5', name: 'Indigo' },
    { color: '#0891B2', name: 'Cyan' },
    { color: '#059669', name: 'Emerald' },
    { color: '#D97706', name: 'Amber' },
    { color: '#8B5CF6', name: 'Violet' },
    { color: '#E11D48', name: 'Rose' },
    { color: '#DC2626', name: 'Crimson' },
    { color: '#64748B', name: 'Slate' },
    { color: '#0D9488', name: 'Teal' },
    { color: '#0284C7', name: 'Sky' },
    { color: '#65A30D', name: 'Lime' },
    { color: '#C026D3', name: 'Fuchsia' },
    { color: '#EA580C', name: 'Coral' },
    { color: '#CA8A04', name: 'Gold' },
    { color: '#7C3AED', name: 'Purple' },
    { color: '#2563EB', name: 'Cobalt' },
    { color: '#10B981', name: 'Mint' },
    { color: '#9A3412', name: 'Bronze' },
    { color: '#BE185D', name: 'Berry' },
    { color: '#334155', name: 'Obsidian' },
  ];

  return (
    <div className="space-y-4">

      {/* ========================================================================= */}
      {/* 2.1 TEMA DEL LIENZO & PALETA CROMÁTICA (SOLO COLORES SIN TEXTO)           */}
      {/* ========================================================================= */}
      <AccordionSection
        id="palette"
        title="Tema & Paleta de Acento"
        icon={Palette}
        badge={state.canvasMode === 'dark' ? `Oscuro • ${state.currentColor}` : `Claro • ${state.currentColor}`}
        isOpen={activeSection === 'palette'}
        onToggle={() => toggleSection('palette')}
      >
        <div className="space-y-4">
          {/* Selector de Modo Oscuro / Claro */}
          <div>
            <label className="text-[11px] text-slate-400 font-mono mb-1.5 block">Modo Base del Lienzo:</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => updateState({ canvasMode: 'dark' })}
                className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                  state.canvasMode === 'dark'
                    ? 'bg-slate-950 border-2 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" /> Modo Oscuro
              </button>
              <button
                type="button"
                onClick={() => updateState({ canvasMode: 'light' })}
                className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                  state.canvasMode === 'light'
                    ? 'bg-slate-900 border-2 border-amber-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" /> Modo Claro
              </button>
            </div>
          </div>

          {/* 20 Presets Cromáticos: SOLO COLORES SIN TEXTO (Puntualizado por el Usuario) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-300 font-semibold">
                Color de Acento Corporativo:
              </label>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: state.currentColor }} />
                <span className="text-indigo-400 font-bold">{state.currentColor}</span>
              </div>
            </div>

            {/* Grid Limpio de Swatches (4 filas de 5 colores o 5 columnas de círculos puros) */}
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="grid grid-cols-5 gap-3 justify-items-center">
                {colorPresets.map((p) => {
                  const isSelected = state.currentColor.toLowerCase() === p.color.toLowerCase();
                  return (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => updateState({ currentColor: p.color })}
                      title={`${p.name} (${p.color})`}
                      className={`w-9 h-9 rounded-full transition-all flex items-center justify-center relative group active:scale-90 ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110 shadow-lg'
                          : 'hover:scale-105 border border-white/10 hover:border-white/40'
                      }`}
                      style={{ backgroundColor: p.color }}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selector Hexadecimal Libre */}
          <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.currentColor}
                onChange={(e) => updateState({ currentColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono font-bold text-slate-200">{state.currentColor}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Hexadecimal personalizado</span>
          </div>
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2.2 ESTILOS Y COLORES DEL TEXTO (TÍTULO, SUBTÍTULO Y TAGS)               */}
      {/* ========================================================================= */}
      <AccordionSection
        id="text-styles"
        title="Estilos & Colores del Texto"
        icon={Type}
        badge="Tipografías & Contraste"
        isOpen={activeSection === 'text-styles'}
        onToggle={() => toggleSection('text-styles')}
      >
        <div className="space-y-3.5">
          
          {/* Color del Titular (H1) */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <label className="text-[11px] text-slate-300 font-semibold block">Color del Titular (H1):</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => updateState({ titleColorMode: 'contrast' })}
                className={`py-1.5 px-2 rounded-lg text-center transition ${
                  state.titleColorMode === 'contrast'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Alto Contraste
              </button>
              <button
                type="button"
                onClick={() => updateState({ titleColorMode: 'category' })}
                className={`py-1.5 px-2 rounded-lg text-center transition ${
                  state.titleColorMode === 'category'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Color Acento
              </button>
              <button
                type="button"
                onClick={() => updateState({ titleColorMode: 'custom' })}
                className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                  state.titleColorMode === 'custom'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Hex</span>
                {state.titleColorMode === 'custom' && (
                  <input
                    type="color"
                    value={state.titleCustomColor || state.currentColor}
                    onChange={(e) => updateState({ titleCustomColor: e.target.value })}
                    className="w-3.5 h-3.5 rounded cursor-pointer border-0 p-0"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Color del Subtítulo */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <label className="text-[11px] text-slate-300 font-semibold block">Color del Subtítulo:</label>
            <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'contrast' })}
                className={`py-1.5 px-1 rounded-lg text-center transition ${
                  (state.subtitleColorMode || 'contrast') === 'contrast'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Contraste
              </button>
              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'dimmed' })}
                className={`py-1.5 px-1 rounded-lg text-center transition ${
                  state.subtitleColorMode === 'dimmed'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Suave
              </button>
              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'category' })}
                className={`py-1.5 px-1 rounded-lg text-center transition ${
                  state.subtitleColorMode === 'category'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Acento
              </button>
              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'custom' })}
                className={`py-1.5 px-1 rounded-lg text-center transition flex items-center justify-center gap-1 ${
                  state.subtitleColorMode === 'custom'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Hex</span>
                {state.subtitleColorMode === 'custom' && (
                  <input
                    type="color"
                    value={state.subtitleCustomColor || '#94A3B8'}
                    onChange={(e) => updateState({ subtitleCustomColor: e.target.value })}
                    className="w-3 h-3 rounded cursor-pointer border-0 p-0"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Color de las Tags / Badges Intermedios */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <label className="text-[11px] text-slate-300 font-semibold block">Color de Tags / Badges:</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => updateState({ tagsColorMode: 'inherit' })}
                className={`py-1.5 px-2 rounded-lg text-center transition ${
                  (state.tagsColorMode || 'inherit') === 'inherit'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Color Acento
              </button>
              <button
                type="button"
                onClick={() => updateState({ tagsColorMode: 'contrast' })}
                className={`py-1.5 px-2 rounded-lg text-center transition ${
                  state.tagsColorMode === 'contrast'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Contraste
              </button>
              <button
                type="button"
                onClick={() => updateState({ tagsColorMode: 'custom' })}
                className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                  state.tagsColorMode === 'custom'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Hex</span>
                {state.tagsColorMode === 'custom' && (
                  <input
                    type="color"
                    value={state.tagsCustomColor || state.currentColor}
                    onChange={(e) => updateState({ tagsCustomColor: e.target.value })}
                    className="w-3.5 h-3.5 rounded cursor-pointer border-0 p-0"
                  />
                )}
              </button>
            </div>
          </div>

        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2.3 ESTILOS DE CONTENEDORES (HEADER, MÓDULO CONTENT Y FOOTER)             */}
      {/* ========================================================================= */}
      <AccordionSection
        id="containers"
        title="Estilo de Contenedores & Marcos"
        icon={Layout}
        badge={`${state.headerShape || 'line'} • ${state.footerShape || 'line'}`}
        isOpen={activeSection === 'containers'}
        onToggle={() => toggleSection('containers')}
      >
        <div className="space-y-4">

          {/* 1. Contenedor de la Cabecera (Header) */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800/80 pb-1.5">
              <Heading className="w-3.5 h-3.5 text-indigo-400" />
              <span>Contenedor Header</span>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">Forma del Marco:</label>
              <select
                value={state.headerShape || 'line'}
                onChange={(e) => updateState({ headerShape: e.target.value as HeaderShape })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="line">Borde Línea Horizontal</option>
                <option value="pill">Cápsula Flotante Glass</option>
                <option value="card">Tarjeta Vidriada Elevada</option>
                <option value="minimal">Minimalista (Sin marco)</option>
                <option value="accent-bar">Barra con Acento Neón</option>
                <option value="floating-dock">Dock Flotante 3D</option>
                <option value="bracket-frame">[ Marco Tech Brackets ]</option>
                <option value="neon-glow">Resplandor Neón Intenso</option>
              </select>
            </div>

            {/* Estilo Visual del Badge de Cabecera */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">Estilo Visual del Badge:</label>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                {[
                  { id: 'pill' as BadgeStyle, label: 'Pastilla' },
                  { id: 'bracket' as BadgeStyle, label: '[ Bracket ]' },
                  { id: 'neon' as BadgeStyle, label: 'Neón Glow' },
                  { id: 'glass' as BadgeStyle, label: 'Glass' },
                  { id: 'minimal-dot' as BadgeStyle, label: '• Minimal' },
                ].map((badge) => (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => updateState({ badgeStyle: badge.id, headerBadgeStyle: badge.id })}
                    className={`py-1 px-1 rounded text-center transition ${
                      (state.badgeStyle || state.headerBadgeStyle || 'pill') === badge.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {badge.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color del Badge de Cabecera */}
            <div className="flex items-center justify-between text-[10px] font-mono pt-1">
              <span className="text-slate-400">Color del Badge:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateState({ badgeColorMode: 'inherit', headerBadgeColorMode: 'inherit' })}
                  className={`px-2 py-0.5 rounded ${
                    (state.badgeColorMode || state.headerBadgeColorMode || 'inherit') === 'inherit' 
                      ? 'bg-indigo-600 text-white font-bold' 
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Acento
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ badgeColorMode: 'contrast', headerBadgeColorMode: 'contrast' })}
                  className={`px-2 py-0.5 rounded ${
                    (state.badgeColorMode || state.headerBadgeColorMode) === 'contrast' 
                      ? 'bg-indigo-600 text-white font-bold' 
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Contraste
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ badgeColorMode: 'custom', headerBadgeColorMode: 'custom' })}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                    (state.badgeColorMode || state.headerBadgeColorMode) === 'custom' 
                      ? 'bg-indigo-600 text-white font-bold' 
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Hex
                  {(state.badgeColorMode || state.headerBadgeColorMode) === 'custom' && (
                    <input
                      type="color"
                      value={state.badgeCustomColor || state.headerBadgeCustomColor || state.currentColor}
                      onChange={(e) => updateState({ badgeCustomColor: e.target.value, headerBadgeCustomColor: e.target.value })}
                      className="w-3 h-3 rounded cursor-pointer border-0 p-0"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Contenedor del Módulo Central */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800/80 pb-1.5">
              <Box className="w-3.5 h-3.5 text-indigo-400" />
              <span>Contenedor Módulo Central</span>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">Acabado de Tarjeta:</label>
              <select
                value={state.moduleContainerStyle || 'glass'}
                onChange={(e) => updateState({ moduleContainerStyle: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="glass">Glassmorphism Estándar (Vidrio Suave)</option>
                <option value="solid">Tarjeta Sólida Minimal</option>
                <option value="neon">Borde Neón Brillante con Halo</option>
                <option value="bracket">[ Marco Bracket Tech ]</option>
                <option value="minimal">Minimalista Sin Fondo / Plano</option>
              </select>
            </div>

            {/* Estilo de Borde para Mockup Imagen */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">Estilo de Borde para Imágenes:</label>
              <select
                value={state.imageBorderStyle || 'none'}
                onChange={(e) => updateState({ imageBorderStyle: e.target.value as ImageBorderStyle })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="raw">✨ Sin Borde / Fondo Transparente (PNG)</option>
                <option value="none">Sin Borde Especial</option>
                <option value="rounded">Bordes Suaves Redondeados</option>
                <option value="glass">Marco Vidrio Glassmorphism</option>
                <option value="neon">Borde Neón Brillante</option>
                <option value="double">Doble Línea Cyber</option>
                <option value="dashed">Línea Punteada Blueprint</option>
                <option value="shadow">Sombra Flotante 3D</option>
              </select>
            </div>
          </div>

          {/* 3. Contenedor del Pie de Página (Footer) */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800/80 pb-1.5">
              <Footprints className="w-3.5 h-3.5 text-indigo-400" />
              <span>Contenedor Footer</span>
            </div>

            <label className="text-[10px] text-slate-400 block mb-1 font-mono">Forma del Marco:</label>
            <select
              value={state.footerShape || 'line'}
              onChange={(e) => updateState({ footerShape: e.target.value as FooterShape })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="line">Borde Línea Horizontal</option>
              <option value="card">Tarjeta Elevada</option>
              <option value="pill">Cápsula Flotante Centrada</option>
              <option value="minimal">Minimalista (Sin marco)</option>
              <option value="accent-bar">Barra con Acento Neón</option>
              <option value="floating-dock">Dock Flotante 3D</option>
              <option value="bracket-frame">[ Marco Tech Brackets ]</option>
              <option value="neon-glow">Resplandor Neón Intenso</option>
            </select>
          </div>

        </div>
      </AccordionSection>

    </div>
  );
};
