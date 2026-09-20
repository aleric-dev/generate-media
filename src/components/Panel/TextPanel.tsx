import React, { useState } from 'react';
import { 
  PostState, 
  TextAlign, 
  BadgeStyle,
  TagsGroupType
} from '../../types';
import { 
  Type, 
  Heading, 
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
  GripVertical,
  Pipette,
  Palette,
  Upload
} from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<string | null>('title');

  const toggleSection = (key: string) => {
    setActiveSection((prev) => (prev === key ? null : key));
  };

  const fontOptions = FONT_OPTIONS;

  // Helpers para Avatar de Autor en Badges
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

  return (
    <div className="space-y-3.5">

      {/* ========================================================================= */}
      {/* 1. TITULAR PRINCIPAL + COLOR DE TEXTO DEDICADO                             */}
      {/* ========================================================================= */}
      <AccordionSection
        id="title"
        title="1. Titular Principal"
        icon={Heading}
        badge={`${state.titleSize || 48}px • ${state.titleFont?.replace('font-', '') || 'inter'}`}
        isOpen={activeSection === 'title'}
        onToggle={() => toggleSection('title')}
      >
        <div className="space-y-3.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
              <Heading className="w-3.5 h-3.5 text-indigo-400" /> Contenido del Titular
            </span>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">
              {state.titleSize || 48} px
            </span>
          </div>

          <textarea
            rows={2}
            value={state.title ?? ''}
            onChange={(e) => updateState({ title: e.target.value })}
            placeholder="Escribe aquí el titular principal..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed font-semibold"
          />

          {/* FILA: FUENTE + ALINEACIÓN + TAMAÑO */}
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">
              Tipografía, Alineación & Tamaño:
            </label>
            <div className="flex items-center gap-1.5">
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

              <select
                value={state.titleSize || 48}
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

          {/* SELECTOR DE COLOR DEL TITULAR (3 OPCIONES CANÓNICAS) */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-slate-300 font-semibold flex items-center gap-1">
                <Palette className="w-3 h-3 text-indigo-400" /> Color del Titular:
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {state.titleColorMode === 'category' ? 'Color Principal' : state.titleColorMode === 'contrast' ? 'Alto Contraste' : (state.titleCustomColor || '#FFFFFF')}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => updateState({ titleColorMode: 'category' })}
                className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                  state.titleColorMode === 'category'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: state.currentColor }} />
                <span>Principal</span>
              </button>

              <button
                type="button"
                onClick={() => updateState({ titleColorMode: 'contrast' })}
                className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                  state.titleColorMode === 'contrast'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400" />
                <span>Contraste</span>
              </button>

              <button
                type="button"
                onClick={() => updateState({ titleColorMode: 'custom' })}
                className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                  state.titleColorMode === 'custom'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Pipette className="w-3 h-3" />
                <span>Personalizado</span>
              </button>
            </div>

            {/* COLORPICKER VISIBLE E INTUITIVO AL SELECCIONAR PERSONALIZADO */}
            {state.titleColorMode === 'custom' && (
              <div className="mt-2 p-2 bg-slate-900 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={state.titleCustomColor || '#FFFFFF'}
                    onChange={(e) => updateState({ titleCustomColor: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">
                    {state.titleCustomColor || '#FFFFFF'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Haz clic para cambiar tono</span>
              </div>
            )}
          </div>

        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2. SUBTÍTULO / BAJADA DESCRIPTIVA + COLOR DEDICADO                         */}
      {/* ========================================================================= */}
      <AccordionSection
        id="subtitle"
        title="2. Subtítulo / Bajada Descriptiva"
        icon={Type}
        badge={`${state.subtitleSize || 24}px • ${state.subtitleFont?.replace('font-', '') || 'inter'}`}
        isOpen={activeSection === 'subtitle'}
        onToggle={() => toggleSection('subtitle')}
      >
        <div className="space-y-3.5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-400" /> Contenido del Subtítulo
            </span>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">
              {state.subtitleSize || 24} px
            </span>
          </div>

          <textarea
            rows={2}
            value={state.subtitle ?? ''}
            onChange={(e) => updateState({ subtitle: e.target.value })}
            placeholder="Escribe el subtítulo o argumento secundario..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          />

          {/* FILA: FUENTE + ALINEACIÓN + TAMAÑO */}
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">
              Tipografía, Alineación & Tamaño:
            </label>
            <div className="flex items-center gap-1.5">
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

              <select
                value={state.subtitleSize || 24}
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

          {/* SELECTOR DE COLOR DEL SUBTÍTULO (3 OPCIONES CANÓNICAS) */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-slate-300 font-semibold flex items-center gap-1">
                <Palette className="w-3 h-3 text-indigo-400" /> Color del Subtítulo:
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {state.subtitleColorMode === 'category' ? 'Color Principal' : state.subtitleColorMode === 'contrast' ? 'Contraste' : (state.subtitleCustomColor || '#94A3B8')}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'category' })}
                className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                  state.subtitleColorMode === 'category'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: state.currentColor }} />
                <span>Principal</span>
              </button>

              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'contrast' })}
                className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                  (state.subtitleColorMode || 'contrast') === 'contrast'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500" />
                <span>Contraste</span>
              </button>

              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'custom' })}
                className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                  state.subtitleColorMode === 'custom'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Pipette className="w-3 h-3" />
                <span>Personalizado</span>
              </button>
            </div>

            {/* COLORPICKER VISIBLE PARA SUBTÍTULO */}
            {state.subtitleColorMode === 'custom' && (
              <div className="mt-2 p-2 bg-slate-900 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={state.subtitleCustomColor || '#94A3B8'}
                    onChange={(e) => updateState({ subtitleCustomColor: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">
                    {state.subtitleCustomColor || '#94A3B8'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Haz clic para cambiar tono</span>
              </div>
            )}
          </div>

        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 3. BADGES & METADATOS (ELEMENTOS INTERMEDIOS)                              */}
      {/* ========================================================================= */}
      <AccordionSection
        id="tags"
        title="3. Badges & Metadatos (Elementos Intermedios)"
        icon={Tag}
        badge={state.tagsGroupVisible ? `${state.tagsSize || 14}px • ${state.tagsGroupType || 'badges'}` : 'Oculto'}
        isOpen={activeSection === 'tags'}
        onToggle={() => toggleSection('tags')}
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <label className="text-xs text-white font-bold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" /> Visibilidad de Metadatos
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
              {/* Selector de los 6 Estilos */}
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
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rango de Tamaños y Alineación */}
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
                    max={24}
                    step={1}
                    value={state.tagsSize || 14}
                    onChange={(e) => updateState({ tagsSize: Number(e.target.value) })}
                    className="flex-1 accent-indigo-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 shrink-0">
                    {[
                      { id: 'left' as TextAlign, icon: AlignLeft, title: 'Izquierda' },
                      { id: 'center' as TextAlign, icon: AlignCenter, title: 'Centro' },
                      { id: 'right' as TextAlign, icon: AlignRight, title: 'Derecha' },
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

              {/* Estilo Visual del Badge (6 Opciones en 2 Filas de 3) */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                  Estilo Visual del Marco / Badge (2 filas de 3):
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                  {[
                    { id: 'pill' as BadgeStyle, label: 'Pastilla' },
                    { id: 'bracket' as BadgeStyle, label: '[ Bracket ]' },
                    { id: 'neon' as BadgeStyle, label: 'Neón Glow' },
                    { id: 'glass' as BadgeStyle, label: 'Glass' },
                    { id: 'minimal-dot' as BadgeStyle, label: '• Minimal' },
                    { id: 'outline' as BadgeStyle, label: 'Contorno' },
                  ].map((badge) => (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => updateState({ badgeStyle: badge.id, headerBadgeStyle: badge.id })}
                      className={`py-2 px-1.5 rounded-xl text-center transition font-semibold truncate ${
                        (state.badgeStyle || 'pill') === badge.id
                          ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {badge.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SELECTOR DE COLOR DE TAGS (3 OPCIONES CANÓNICAS) */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] text-slate-300 font-semibold flex items-center gap-1">
                    <Palette className="w-3 h-3 text-indigo-400" /> Color de Badges / Metadatos:
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {state.tagsColorMode === 'inherit' ? 'Color Principal' : state.tagsColorMode === 'contrast' ? 'Contraste' : (state.tagsCustomColor || state.currentColor)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => updateState({ tagsColorMode: 'inherit' })}
                    className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                      (state.tagsColorMode || 'inherit') === 'inherit'
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: state.currentColor }} />
                    <span>Principal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateState({ tagsColorMode: 'contrast' })}
                    className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                      state.tagsColorMode === 'contrast'
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-500" />
                    <span>Contraste</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateState({ tagsColorMode: 'custom' })}
                    className={`py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                      state.tagsColorMode === 'custom'
                        ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Pipette className="w-3 h-3" />
                    <span>Personalizado</span>
                  </button>
                </div>

                {state.tagsColorMode === 'custom' && (
                  <div className="mt-2 p-2 bg-slate-900 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={state.tagsCustomColor || state.currentColor}
                        onChange={(e) => updateState({ tagsCustomColor: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="text-xs font-mono font-bold text-white">
                        {state.tagsCustomColor || state.currentColor}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Haz clic para cambiar tono</span>
                  </div>
                )}
              </div>

              {/* INPUTS CONTEXTUALES SEGÚN EL TIPO (SIN DATOS POR DEFECTO FORZADOS) */}
              {(!state.tagsGroupType || state.tagsGroupType === 'badges') && (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                    Badges de Tecnologías (separadas por comas):
                  </label>
                  <input
                    type="text"
                    value={state.tags ?? ''}
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
                      value={state.ratingScore ?? ''}
                      onChange={(e) => updateState({ ratingScore: e.target.value })}
                      placeholder="4.9/5.0"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto Reseña:</label>
                    <input
                      type="text"
                      value={state.ratingCount ?? ''}
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
                        value={state.authorName ?? ''}
                        onChange={(e) => updateState({ authorName: e.target.value })}
                        placeholder="Nombre Apellido"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Cargo / Rol:</label>
                      <input
                        type="text"
                        value={state.authorRole ?? ''}
                        onChange={(e) => updateState({ authorRole: e.target.value })}
                        placeholder="Cargo o Rol"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Foto de Avatar:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={state.authorAvatarUrl ?? ''}
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
                    value={state.socialProofText ?? ''}
                    onChange={(e) => updateState({ socialProofText: e.target.value })}
                    placeholder="⚡ Confiado por más de 120 startups en Latam"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              )}

              {state.tagsGroupType === 'status-pill' && (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto de Estado:</label>
                  <input
                    type="text"
                    value={state.statusPillText ?? ''}
                    onChange={(e) => updateState({ statusPillText: e.target.value })}
                    placeholder="EN VIVO • NUEVA VERSIÓN"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              )}

              {state.tagsGroupType === 'metrics-chip' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Métrica Clave:</label>
                    <input
                      type="text"
                      value={state.metricChipHighlight ?? ''}
                      onChange={(e) => updateState({ metricChipHighlight: e.target.value })}
                      placeholder="⚡ +450% ARR"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto Descriptivo:</label>
                    <input
                      type="text"
                      value={state.metricChipLabel ?? ''}
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
      {/* 4. SECUENCIA & ORDEN DEL POST                                              */}
      {/* ========================================================================= */}
      <AccordionSection
        id="order"
        title="4. Secuencia & Orden del Post"
        icon={Layers}
        badge="Reordenar & Espacios"
        isOpen={activeSection === 'order'}
        onToggle={() => toggleSection('order')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 items-start">
            {/* COLUMNA 1: PRESETS RÁPIDOS */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1.5 font-mono">
                Presets de Disposición:
              </label>
              <div className="flex flex-col gap-1.5 text-xs font-mono">
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

            {/* COLUMNA 2: SECUENCIA ACTIVA ARRASTRABLE */}
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

    </div>
  );
};
