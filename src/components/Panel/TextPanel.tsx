import React, { useState } from 'react';
import { 
  PostState, 
  TextAlign, 
  CtaOrder, 
  CtaAlign, 
  HeaderBrandMode,
  LogoAspectRatio,
  TagsGroupType
} from '../../types';
import { 
  Type, 
  Heading, 
  Upload, 
  Star, 
  User, 
  CheckCircle2, 
  Radio, 
  Tag, 
  X, 
  TrendingUp, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Layers, 
  Sliders, 
  MessageSquare,
  GripVertical
} from 'lucide-react';
import { BRAND_ICONS } from '../../constants/brandIcons';
import { FONT_OPTIONS } from '../../constants/fonts';
import { AccordionSection } from './AccordionSection';

interface TextPanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const TextPanel: React.FC<TextPanelProps> = ({
  state,
  updateState
}) => {
  const [activeSection, setActiveSection] = useState<string | null>('header');

  const toggleSection = (key: string) => {
    setActiveSection((prev) => (prev === key ? null : key));
  };

  const fontOptions = FONT_OPTIONS;

  // Helpers para Logo Custom
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateState({
        customLogoUrl: ev.target?.result as string,
        logoType: 'custom',
        headerShowLogo: true
      });
    };
    reader.readAsDataURL(file);
  };

  // Helpers para Avatar de Autor
  const handleAuthorAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateState({
        authorAvatar: ev.target?.result as string,
        authorAvatarUrl: ev.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // Helpers para Reordenamiento de Bloques
  const currentBlockOrder: Array<'title' | 'subtitle' | 'tags' | 'module'> = 
    state.contentBlockOrder || ['tags', 'title', 'subtitle', 'module'];

  const setPresetOrder = (preset: Array<'title' | 'subtitle' | 'tags' | 'module'>) => {
    updateState({ contentBlockOrder: preset });
  };

  // Drag and drop para píldoras de secuencia en el sidebar
  const [draggedPill, setDraggedPill] = useState<string | null>(null);
  const [dropTargetPill, setDropTargetPill] = useState<string | null>(null);

  const handlePillDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPill(id);
  };

  const handlePillDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetPill !== id) {
      setDropTargetPill(id);
    }
  };

  const handlePillDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = (e.dataTransfer.getData('text/plain') || draggedPill) as 'title' | 'subtitle' | 'tags' | 'module';
    if (sourceId && sourceId !== targetId) {
      const oldIndex = currentBlockOrder.indexOf(sourceId);
      const newIndex = currentBlockOrder.indexOf(targetId as any);
      if (oldIndex !== -1 && newIndex !== -1) {
        const nextOrder = [...currentBlockOrder];
        nextOrder.splice(oldIndex, 1);
        nextOrder.splice(newIndex, 0, sourceId);
        updateState({ contentBlockOrder: nextOrder });
      }
    }
    setDraggedPill(null);
    setDropTargetPill(null);
  };

  const handlePillDragEnd = () => {
    setDraggedPill(null);
    setDropTargetPill(null);
  };

  // Escala Coordinada de Cabecera (Texto + Logo Armónicos)
  const headerScalePresets = [
    { text: 11, logo: 32, label: '11 px texto • 32 px logo (Ultra Compacta)' },
    { text: 13, logo: 40, label: '13 px texto • 40 px logo (Discreta)' },
    { text: 16, logo: 48, label: '16 px texto • 48 px logo (Equilibrada - Estándar)' },
    { text: 20, logo: 60, label: '20 px texto • 60 px logo (Destacada)' },
    { text: 24, logo: 72, label: '24 px texto • 72 px logo (Presencia Fuerte)' },
    { text: 28, logo: 84, label: '28 px texto • 84 px logo (Gran Editorial)' },
    { text: 34, logo: 100, label: '34 px texto • 100 px logo (Máximo Impacto)' },
  ];

  const currentHeaderMatch = headerScalePresets.find(
    (p) => p.text === (state.headerSize || 13)
  ) || headerScalePresets[1];

  return (
    <div className="space-y-4">

      {/* ========================================================================= */}
      {/* 1. CABECERA DE MARCA (EMPRESA + BADGE EN UNA FILA Y ESCALA COORDINADA)    */}
      {/* ========================================================================= */}
      <AccordionSection
        id="header"
        title="Cabecera de Marca (Header)"
        icon={Heading}
        badge={state.companyName || 'Tu Empresa'}
        isOpen={activeSection === 'header'}
        onToggle={() => toggleSection('header')}
      >
        <div className="space-y-3.5">
          {/* NOMBRE DE LA EMPRESA Y BADGE SUPERIOR EN UNA SOLA FILA */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-300 font-semibold block mb-1">
                Empresa o Marca:
              </label>
              <input
                type="text"
                value={state.companyName}
                onChange={(e) => updateState({ companyName: e.target.value })}
                placeholder="Ej: Aleric.dev"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-300 font-semibold block mb-1">
                Badge / Categoría:
              </label>
              <input
                type="text"
                value={state.category}
                onChange={(e) => updateState({ category: e.target.value })}
                placeholder="Ej: DESARROLLO A LA MEDIDA"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono tracking-wide uppercase"
              />
            </div>
          </div>

          {/* ESCALA COORDINADA DE CABECERA CON SLIDER (TEXTO + LOGO CRECEN JUNTOS) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-slate-400 font-mono">
                Escala Coordinada (Texto & Logo):
              </label>
              <span className="text-[10px] text-indigo-400 font-mono font-bold">
                {state.headerSize || 13} px texto • {state.logoSize || 40} px logo
              </span>
            </div>
            <input
              type="range"
              min={11}
              max={34}
              step={1}
              value={state.headerSize || 13}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateState({
                  headerSize: val,
                  logoSize: Math.round(val * 2.9)
                });
              }}
              className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
            />
          </div>


          {/* Modo de Composición de Marca */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="text-[10px] text-slate-400 block mb-1.5 font-mono">
              Composición de Identidad:
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              {[
                { id: 'icon-text' as HeaderBrandMode, label: 'Ícono + Nombre' },
                { id: 'only-text' as HeaderBrandMode, label: 'Solo Nombre' },
                { id: 'custom-text' as HeaderBrandMode, label: 'Nombre + Logo Subido' },
                { id: 'only-custom' as HeaderBrandMode, label: 'Solo Logo Subido' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => updateState({ 
                    headerBrandMode: mode.id,
                    headerShowLogo: mode.id !== 'only-text',
                    logoType: (mode.id === 'custom-text' || mode.id === 'only-custom') ? 'custom' : 'generic'
                  })}
                  className={`py-2 px-2 rounded-xl text-center transition text-[11px] ${
                    (state.headerBrandMode || 'icon-text') === mode.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Ícono: SOLO ÍCONOS EN CUADRÍCULA LIMPIA */}
          {(state.headerBrandMode || 'icon-text') === 'icon-text' && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-medium">Ícono de Cabecera:</span>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">
                  {BRAND_ICONS.find((i) => i.id === (state.brandIcon || 'terminal'))?.label || 'Terminal'}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5 max-h-36 overflow-y-auto p-1 custom-scrollbar">
                {BRAND_ICONS.map((iconItem) => {
                  const IconCmp = iconItem.icon;
                  const isSelected = (state.brandIcon || 'terminal') === iconItem.id;
                  return (
                    <button
                      key={iconItem.id}
                      type="button"
                      onClick={() => updateState({ brandIcon: iconItem.id })}
                      title={iconItem.label}
                      className={`h-9 rounded-lg border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-300'
                          : 'bg-slate-900/90 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <IconCmp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Carga de Logo Custom */}
          {(state.headerBrandMode === 'custom-text' || state.headerBrandMode === 'only-custom') && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-medium">Subir Logo Oficial:</span>
                <label className="cursor-pointer text-[10px] font-mono bg-indigo-600 hover:bg-indigo-500 text-white py-1 px-2.5 rounded-lg flex items-center gap-1 transition">
                  <Upload className="w-3 h-3" /> Subir PNG
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {state.customLogoUrl && (
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <img
                    src={state.customLogoUrl}
                    alt="Logo Subido"
                    className="h-7 w-auto object-contain max-w-[120px]"
                  />
                  <button
                    type="button"
                    onClick={() => updateState({ customLogoUrl: null })}
                    className="text-slate-400 hover:text-rose-400 text-[10px] font-mono flex items-center gap-0.5 p-1 rounded hover:bg-rose-500/10 transition"
                    title="Quitar logo"
                  >
                    <X className="w-3.5 h-3.5" /> Quitar
                  </button>
                </div>
              )}

              {/* Proporción del Logo */}
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-mono">Proporción del Logo:</span>
                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                  {[
                    { id: 'auto' as LogoAspectRatio, label: 'Auto' },
                    { id: 'square' as LogoAspectRatio, label: '1:1 Cuad.' },
                    { id: 'horizontal' as LogoAspectRatio, label: 'Horiz.' },
                    { id: 'vertical' as LogoAspectRatio, label: 'Vert.' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => updateState({ logoAspectRatio: ratio.id })}
                      className={`py-1 px-1 rounded text-center transition ${
                        (state.logoAspectRatio || 'auto') === ratio.id
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2. TÍTULO Y SUBTÍTULO (FILA ÚNICA: FUENTE + ALINEACIÓN + TAMAÑO)           */}
      {/* ========================================================================= */}
      <AccordionSection
        id="typography"
        title="Título & Subtítulo"
        icon={Type}
        badge={`${state.titleSize}px • ${state.titleFont?.replace('font-', '') || 'inter'}`}
        isOpen={activeSection === 'typography'}
        onToggle={() => toggleSection('typography')}
      >
        <div className="space-y-4">
          
          {/* 2.1 TÍTULAR PRINCIPAL (H1) */}
          <div className="space-y-2.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
                <Heading className="w-3.5 h-3.5 text-indigo-400" /> Titular Principal (H1)
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold">
                {state.titleSize} px
              </span>
            </div>

            <textarea
              rows={2}
              value={state.title}
              onChange={(e) => updateState({ title: e.target.value })}
              placeholder="Escribe aquí el titular principal..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed font-semibold"
            />

            {/* FILA ÚNICA COMPACTA: FUENTE + ALINEACIÓN + TAMAÑO */}
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">
                Tipografía, Alineación & Tamaño:
              </label>
              <div className="flex items-center gap-1.5">
                {/* 1. Fuente (flex-1) ordenada de A-Z */}
                <select
                  value={state.titleFont || 'font-inter'}
                  onChange={(e) => updateState({ titleFont: e.target.value })}
                  className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                >
                  {fontOptions.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {/* 2. Alineación (3 icon buttons) */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 shrink-0">
                  {[
                    { id: 'left' as TextAlign, icon: AlignLeft, title: 'Izquierda' },
                    { id: 'center' as TextAlign, icon: AlignCenter, title: 'Centro' },
                    { id: 'right' as TextAlign, icon: AlignRight, title: 'Derecha' },
                  ].map((align) => {
                    const Icon = align.icon;
                    const isSelected = (state.titleAlign || state.textAlign || 'center') === align.id;
                    return (
                      <button
                        key={align.id}
                        type="button"
                        onClick={() => updateState({ titleAlign: align.id, textAlign: align.id })}
                        title={align.title}
                        className={`p-1.5 rounded-lg transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>

                {/* 3. Tamaño (w-24 select) con opciones amplias */}
                <select
                  value={state.titleSize || 56}
                  onChange={(e) => updateState({ titleSize: Number(e.target.value) })}
                  className="w-24 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 shrink-0"
                >
                  {[32, 40, 48, 56, 64, 72, 80, 88].map((size) => (
                    <option key={size} value={size}>
                      {size} px
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2.2 SUBTÍTULO / BAJADA DESCRIPTIVA */}
          <div className="space-y-2.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-400" /> Subtítulo / Bajada
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold">
                {state.subtitleSize} px
              </span>
            </div>

            <textarea
              rows={2}
              value={state.subtitle}
              onChange={(e) => updateState({ subtitle: e.target.value })}
              placeholder="Escribe el subtítulo o argumento secundario..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />

            {/* FILA ÚNICA COMPACTA: FUENTE + ALINEACIÓN + TAMAÑO (SIN SELECTOR OBSOLETO DE POSICIÓN) */}
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">
                Tipografía, Alineación & Tamaño:
              </label>
              <div className="flex items-center gap-1.5">
                {/* 1. Fuente (flex-1) */}
                <select
                  value={state.subtitleFont || state.titleFont || 'font-inter'}
                  onChange={(e) => updateState({ subtitleFont: e.target.value })}
                  className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                >
                  {fontOptions.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {/* 2. Alineación (3 icon buttons) */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 shrink-0">
                  {[
                    { id: 'left' as TextAlign, icon: AlignLeft, title: 'Izquierda' },
                    { id: 'center' as TextAlign, icon: AlignCenter, title: 'Centro' },
                    { id: 'right' as TextAlign, icon: AlignRight, title: 'Derecha' },
                  ].map((align) => {
                    const Icon = align.icon;
                    const isSelected = (state.subtitleAlign || state.textAlign || 'center') === align.id;
                    return (
                      <button
                        key={align.id}
                        type="button"
                        onClick={() => updateState({ subtitleAlign: align.id })}
                        title={align.title}
                        className={`p-1.5 rounded-lg transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>

                {/* 3. Tamaño (w-24 select) con opciones amplias */}
                <select
                  value={state.subtitleSize || 18}
                  onChange={(e) => updateState({ subtitleSize: Number(e.target.value) })}
                  className="w-24 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 shrink-0"
                >
                  {[14, 16, 18, 20, 24, 28, 32, 36].map((size) => (
                    <option key={size} value={size}>
                      {size} px
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 3. TAGS & GRUPO INTERMEDIO (6 OPCIONES CON RANGO DE TAMAÑOS AMPLIADO)     */}
      {/* ========================================================================= */}
      <AccordionSection
        id="tags"
        title="Tags & Grupo Intermedio"
        icon={Tag}
        badge={state.tagsGroupVisible ? `${state.tagsSize || 14}px • ${state.tagsGroupType || 'badges'}` : 'Oculto'}
        isOpen={activeSection === 'tags'}
        onToggle={() => toggleSection('tags')}
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <label className="text-xs text-white font-bold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" /> Visibilidad de Tags
            </label>
            <button
              type="button"
              onClick={() => updateState({ tagsGroupVisible: !state.tagsGroupVisible })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                state.tagsGroupVisible ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                  state.tagsGroupVisible ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {state.tagsGroupVisible && (
            <div className="space-y-3.5">
              {/* Selector de las 6 Opciones */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                  Tipo de Elemento (6 Estilos Curados):
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                  {[
                    { id: 'badges' as TagsGroupType, label: 'Badges Tech', icon: Tag },
                    { id: 'rating' as TagsGroupType, label: 'Estrellas ★', icon: Star },
                    { id: 'author' as TagsGroupType, label: 'Ficha Autor', icon: User },
                    { id: 'social-proof' as TagsGroupType, label: 'Social Proof', icon: CheckCircle2 },
                    { id: 'status-pill' as TagsGroupType, label: 'Live Status', icon: Radio },
                    { id: 'metrics-chip' as TagsGroupType, label: 'Métrica Clave', icon: TrendingUp },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = (state.tagsGroupType || 'badges') === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => updateState({ tagsGroupType: item.id })}
                        className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RANGO DE TAMAÑOS Y ALINEACIÓN INDEPENDIENTE DE TAGS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-400 font-mono">
                    Tamaño & Alineación Independiente:
                  </label>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold">
                    {state.tagsSize || 14} px
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="range"
                    min={11}
                    max={38}
                    step={1}
                    value={state.tagsSize || 14}
                    onChange={(e) => updateState({ tagsSize: Number(e.target.value) })}
                    className="flex-1 accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 shrink-0">
                    {[
                      { id: 'left' as TextAlign, icon: AlignLeft, title: 'Alinear a la izquierda' },
                      { id: 'center' as TextAlign, icon: AlignCenter, title: 'Centrar' },
                      { id: 'right' as TextAlign, icon: AlignRight, title: 'Alinear a la derecha' },
                    ].map((align) => {
                      const Icon = align.icon;
                      const isSelected = (state.tagsAlign || state.titleAlign || 'center') === align.id;
                      return (
                        <button
                          key={align.id}
                          type="button"
                          onClick={() => updateState({ tagsAlign: align.id })}
                          title={align.title}
                          className={`p-1.5 rounded-lg transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Inputs contextuales según el Tipo */}
              {(!state.tagsGroupType || state.tagsGroupType === 'badges') && (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                    Badges de Tecnologías (separadas por comas):
                  </label>
                  <input
                    type="text"
                    value={state.tags}
                    onChange={(e) => updateState({ tags: e.target.value })}
                    placeholder="Ej: PostgreSQL, Next.js, Cloudflare, Docker"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              )}

              {state.tagsGroupType === 'rating' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Puntuación:</label>
                    <input
                      type="text"
                      value={state.ratingScore || '4.9/5.0'}
                      onChange={(e) => updateState({ ratingScore: e.target.value })}
                      placeholder="4.9/5.0"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto Reseña:</label>
                    <input
                      type="text"
                      value={state.ratingCount || '+500 Clientes'}
                      onChange={(e) => updateState({ ratingCount: e.target.value })}
                      placeholder="+500 Clientes"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {state.tagsGroupType === 'author' && (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nombre Autor:</label>
                      <input
                        type="text"
                        value={state.authorName || 'Ricardo Zapata'}
                        onChange={(e) => updateState({ authorName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Cargo / Rol:</label>
                      <input
                        type="text"
                        value={state.authorRole || 'Lead Cloud Architect'}
                        onChange={(e) => updateState({ authorRole: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Foto de Avatar:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={state.authorAvatarUrl || ''}
                        onChange={(e) => updateState({ authorAvatarUrl: e.target.value, authorAvatar: e.target.value })}
                        placeholder="https://... o sube una imagen"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                      <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-2.5 rounded-lg flex items-center gap-1 text-[11px] font-mono transition shrink-0">
                        <Upload className="w-3 h-3" />
                        <input type="file" accept="image/*" onChange={handleAuthorAvatarUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {state.tagsGroupType === 'social-proof' && (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto de Prueba Social:</label>
                  <input
                    type="text"
                    value={state.socialProofText || '⚡ Confiado por más de 120 startups en Latam'}
                    onChange={(e) => updateState({ socialProofText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              )}

              {state.tagsGroupType === 'status-pill' && (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto de Estado:</label>
                  <input
                    type="text"
                    value={state.statusPillText || 'EN VIVO • NUEVA VERSIÓN'}
                    onChange={(e) => updateState({ statusPillText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              )}

              {/* 6. Métrica Clave / Impact Chip */}
              {state.tagsGroupType === 'metrics-chip' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Métrica Clave:</label>
                    <input
                      type="text"
                      value={state.metricChipHighlight || '⚡ +450% ARR'}
                      onChange={(e) => updateState({ metricChipHighlight: e.target.value })}
                      placeholder="⚡ +450% ARR"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto Descriptivo:</label>
                    <input
                      type="text"
                      value={state.metricChipLabel || 'Crecimiento Verificado'}
                      onChange={(e) => updateState({ metricChipLabel: e.target.value })}
                      placeholder="Crecimiento Verificado"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 4. JERARQUÍA & REORDENAMIENTO DE BLOQUES (PRESETS - SECUENCIA EN 2 COLUMNAS) */}
      {/* ========================================================================= */}
      <AccordionSection
        id="order"
        title="Ubicaciones, Orden & Espaciados"
        icon={Layers}
        badge="Reordenar & Espacios"
        isOpen={activeSection === 'order'}
        onToggle={() => toggleSection('order')}
      >
        <div className="space-y-4">
          {/* Layout en 2 Columnas: Presets (Izquierda) - Secuencia Activa (Derecha) */}
          <div className="grid grid-cols-2 gap-3 items-start">
            {/* COLUMNA 1: PRESETS RÁPIDOS */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1.5 font-mono">
                Presets de Disposición:
              </label>
              <div className="flex flex-col gap-1.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setPresetOrder(['title', 'subtitle', 'tags', 'module'])}
                  className={`py-2 px-2 rounded-xl border text-left truncate transition ${
                    JSON.stringify(currentBlockOrder) === JSON.stringify(['title', 'subtitle', 'tags', 'module'])
                      ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white'
                  }`}
                  title="Título ➔ Subtítulo ➔ Tags ➔ Módulo"
                >
                  1. Editorial Clásico
                </button>
                <button
                  type="button"
                  onClick={() => setPresetOrder(['tags', 'title', 'subtitle', 'module'])}
                  className={`py-2 px-2 rounded-xl border text-left truncate transition ${
                    JSON.stringify(currentBlockOrder) === JSON.stringify(['tags', 'title', 'subtitle', 'module'])
                      ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white'
                  }`}
                  title="Tags ➔ Título ➔ Subtítulo ➔ Módulo"
                >
                  2. Tech Modern
                </button>
                <button
                  type="button"
                  onClick={() => setPresetOrder(['title', 'module', 'subtitle', 'tags'])}
                  className={`py-2 px-2 rounded-xl border text-left truncate transition ${
                    JSON.stringify(currentBlockOrder) === JSON.stringify(['title', 'module', 'subtitle', 'tags'])
                      ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white'
                  }`}
                  title="Título ➔ Módulo ➔ Subtítulo ➔ Tags"
                >
                  3. Módulo Central
                </button>
                <button
                  type="button"
                  onClick={() => setPresetOrder(['module', 'title', 'subtitle', 'tags'])}
                  className={`py-2 px-2 rounded-xl border text-left truncate transition ${
                    JSON.stringify(currentBlockOrder) === JSON.stringify(['module', 'title', 'subtitle', 'tags'])
                      ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white'
                  }`}
                  title="Módulo ➔ Título ➔ Subtítulo ➔ Tags"
                >
                  4. Showcase Visual
                </button>
              </div>
            </div>

            {/* COLUMNA 2: SECUENCIA ACTIVA ARRASTRABLE EN COLUMNA VERTICAL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <GripVertical className="w-3 h-3 text-indigo-400" />
                  Secuencia (Arrastra):
                </label>
              </div>
              <div className="flex flex-col gap-1.5 p-2 bg-slate-950/90 rounded-xl border border-slate-800/90 shadow-inner">
                {currentBlockOrder.map((b, idx) => {
                  const isDragging = draggedPill === b;
                  const isTarget = dropTargetPill === b && !isDragging;
                  const label = b === 'title' ? 'Titular' : b === 'subtitle' ? 'Subtítulo' : b === 'tags' ? 'Tags' : 'Módulo';

                  return (
                    <div
                      key={b}
                      draggable
                      onDragStart={(e) => handlePillDragStart(e, b)}
                      onDragOver={(e) => handlePillDragOver(e, b)}
                      onDragLeave={() => setDropTargetPill(null)}
                      onDrop={(e) => handlePillDrop(e, b)}
                      onDragEnd={handlePillDragEnd}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-grab active:cursor-grabbing transition-all select-none ${
                        isDragging
                          ? 'opacity-40 scale-95 border-dashed border-indigo-400 bg-indigo-500/20'
                          : isTarget
                          ? 'border-indigo-400 bg-indigo-600/30 scale-[1.02] shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400'
                          : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500/60 hover:bg-slate-800/80 hover:text-white'
                      }`}
                      title="Arrastra para cambiar el orden"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <GripVertical className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate text-[11px]">{label}</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold shrink-0">
                        {idx + 1}º
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Espaciado Vertical entre Bloques con Slider */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-slate-400 font-mono">
                Espaciado Vertical entre Bloques:
              </label>
              <span className="text-[10px] text-indigo-400 font-mono font-bold">
                {state.gapContentBlocks || 20} px
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={48}
              step={2}
              value={state.gapContentBlocks || 20}
              onChange={(e) => updateState({ gapContentBlocks: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </AccordionSection>


      {/* ========================================================================= */}
      {/* 5. PIE DE IMAGEN (FOOTER & CTA CON RANGO DE TAMAÑOS AMPLIADO)              */}
      {/* ========================================================================= */}
      <AccordionSection
        id="footer"
        title="Pie de Imagen (Footer & CTA)"
        icon={MessageSquare}
        badge={state.handle || 'tumarca.dev'}
        isOpen={activeSection === 'footer'}
        onToggle={() => toggleSection('footer')}
      >
        <div className="space-y-3.5">
          <div>
            <label className="text-[11px] text-slate-300 font-medium block mb-1">
              Texto del CTA (Llamado a la Acción):
            </label>
            <input
              type="text"
              value={state.cta}
              onChange={(e) => updateState({ cta: e.target.value })}
              placeholder="Ej: Escríbenos y migramos tu operación a la nube."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-medium block mb-1 font-mono">
              Handle / Identificador / Sitio Web:
            </label>
            <input
              type="text"
              value={state.handle}
              onChange={(e) => updateState({ handle: e.target.value })}
              placeholder="Ej: tumarca.dev o @tuempresa"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* RANGO DE TAMAÑOS DE FOOTER CON SLIDER */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-slate-400 font-mono">
                Tamaño de Texto del Footer:
              </label>
              <span className="text-[10px] text-indigo-400 font-mono font-bold">
                {state.footerSize || 13} px
              </span>
            </div>
            <input
              type="range"
              min={11}
              max={34}
              step={1}
              value={state.footerSize || 13}
              onChange={(e) => updateState({ footerSize: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Orden y Alineación del CTA y Handle */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-xs font-mono">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Orden de Elementos:</label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => updateState({ ctaOrder: 'cta-first' })}
                  className={`py-2 px-1 rounded-xl text-center transition text-[11px] ${
                    (state.ctaOrder || 'cta-first') === 'cta-first'
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  CTA ➔ Web
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ ctaOrder: 'handle-first' })}
                  className={`py-2 px-1 rounded-xl text-center transition text-[11px] ${
                    state.ctaOrder === 'handle-first'
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Web ➔ CTA
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Alineación en Canvas:</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => updateState({ ctaAlign: 'left' })}
                  className={`py-2 px-1 rounded-xl flex items-center justify-center transition ${
                    state.ctaAlign === 'left'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Izquierda"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ ctaAlign: 'center' })}
                  className={`py-2 px-1 rounded-xl flex items-center justify-center transition ${
                    (state.ctaAlign || 'center') === 'center'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Centrado"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ ctaAlign: 'between' })}
                  className={`py-2 px-1 rounded-xl flex items-center justify-center transition text-[10px] ${
                    state.ctaAlign === 'between'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Extremos (Separados)"
                >
                  Extremos
                </button>
              </div>
            </div>
          </div>
        </div>
      </AccordionSection>

    </div>
  );
};
