import React from 'react';
import { PostState, LogoType, HeaderShape, FooterShape, ImageBorderStyle } from '../../types';
import { SunMoon, Sun, Moon, Palette, Type, Shield, Layout, Frame, Upload } from 'lucide-react';

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
  ];

  const fonts = [
    { id: 'font-space-mono', label: 'Space Mono (Tech)' },
    { id: 'font-jetbrains', label: 'JetBrains (Code)' },
    { id: 'font-inter', label: 'Inter (UI Clean)' },
    { id: 'font-plus-jakarta', label: 'Plus Jakarta (Modern)' },
    { id: 'font-outfit', label: 'Outfit (Bold Editorial)' },
    { id: 'font-syne', label: 'Syne (Futurista)' },
  ];

  const handleCustomLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateState({
        customLogoUrl: ev.target?.result as string,
        logoType: 'custom'
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      
      {/* 2.1 Tema Claro / Oscuro */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
        <label className="text-xs text-white font-bold flex items-center gap-1.5">
          <SunMoon className="w-4 h-4 text-indigo-400" /> Modo del Lienzo (Fondo)
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

      {/* 2.2 Categorías de Color Ampliadas */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-400" /> Color de Categoría & Acento
          </label>
          <span className="text-xs font-mono font-bold text-indigo-400">{state.currentColor}</span>
        </div>

        {/* 8 Presets */}
        <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
          {colorPresets.map((p) => (
            <button
              key={p.color}
              type="button"
              onClick={() => updateState({ currentColor: p.color, category: p.cat })}
              className={`p-2 rounded-xl bg-slate-950 border flex flex-col items-center gap-1 transition ${
                state.currentColor === p.color
                  ? 'border-indigo-400 ring-1 ring-indigo-400'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-slate-300">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Color Personalizado y Nombre de Categoría */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Color Personalizado:</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
              <input
                type="color"
                value={state.currentColor}
                onChange={(e) => updateState({ currentColor: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer border-none bg-transparent"
              />
              <span className="text-xs font-mono text-slate-300">{state.currentColor}</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Texto de Categoría:</label>
            <input
              type="text"
              value={state.category}
              onChange={(e) => updateState({ category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 2.3 Tipografía */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
        <label className="text-xs text-white font-bold flex items-center gap-1.5">
          <Type className="w-4 h-4 text-indigo-400" /> Fuente Tipográfica
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {fonts.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => updateState({ titleFont: f.id })}
              className={`py-2 px-2.5 rounded-lg text-left transition ${f.id} ${
                state.titleFont === f.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2.4 Identidad de Marca: Nombre de Empresa & Logo Genérico / Propio */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-white font-bold">Identidad de Marca & Logo</span>
        </div>

        {/* Nombre de la Empresa */}
        <div>
          <label className="text-[11px] text-slate-300 font-medium mb-1 block">Nombre de la Empresa / Marca:</label>
          <input
            type="text"
            value={state.companyName}
            onChange={(e) => updateState({ companyName: e.target.value })}
            placeholder="Ej: Aleric Dev o Tu Empresa"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Selector de Tipo de Logo */}
        <div>
          <label className="text-[11px] text-slate-300 font-medium mb-1.5 block">Formato del Logo en el Header:</label>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {[
              { id: 'generic', label: '💠 Logo Genérico Tech' },
              { id: 'monogram', label: '🔤 Monograma / Inicial' },
              { id: 'text', label: '🏷️ Solo Nombre Texto' },
              { id: 'aleric', label: '⚡ Logo Aleric Dev' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateState({ logoType: item.id as LogoType })}
                className={`py-2 px-2.5 rounded-lg text-left transition ${
                  state.logoType === item.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Uploader Logo Propio */}
        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">O sube el logo de tu empresa:</span>
          <label className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold cursor-pointer transition flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Subir Logo PNG/SVG
            <input type="file" accept="image/*" onChange={handleCustomLogo} className="hidden" />
          </label>
        </div>
      </div>

      {/* 2.5 Estilos de Header y Footer */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <Layout className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-white font-bold">Estilos de Header & Footer</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-300 font-medium mb-1 block">Estilo Header:</label>
            <select
              value={state.headerShape}
              onChange={(e) => updateState({ headerShape: e.target.value as HeaderShape })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              <option value="line">Borde Línea</option>
              <option value="pill">Cápsula Flotante</option>
              <option value="card">Tarjeta de Cristal</option>
              <option value="minimal">Minimalista</option>
              <option value="accent-bar">Barra de Acento</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-300 font-medium mb-1 block">Estilo Footer:</label>
            <select
              value={state.footerShape}
              onChange={(e) => updateState({ footerShape: e.target.value as FooterShape })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              <option value="line">Borde Línea</option>
              <option value="card">Tarjeta Elevada</option>
              <option value="pill">Cápsula Centrada</option>
              <option value="minimal">Minimalista</option>
              <option value="accent-bar">Barra Destacada</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2.6 Bordes para Imágenes del Módulo */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2.5">
        <label className="text-xs text-white font-bold flex items-center gap-1.5">
          <Frame className="w-4 h-4 text-indigo-400" /> Estilo de Borde para Imágenes
        </label>
        <select
          value={state.imageBorderStyle}
          onChange={(e) => updateState({ imageBorderStyle: e.target.value as ImageBorderStyle })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
        >
          <option value="none">Sin Borde (Limpio / Flat)</option>
          <option value="rounded">Borde Redondeado Clásico</option>
          <option value="glass">Borde Cristal Glassmorphism con Glow</option>
          <option value="neon">Borde Neón con Color de Marca</option>
          <option value="double">Doble Marco Técnico</option>
          <option value="dashed">Borde Punteado Técnico (Dashed)</option>
          <option value="shadow">Sombra Flotante Profunda (Sin borde)</option>
        </select>
      </div>

    </div>
  );
};
