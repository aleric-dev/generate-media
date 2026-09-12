import React from 'react';
import { 
  PostState, 
  ModuleType, 
  TitleColorMode, 
  TextAlign, 
  CtaOrder, 
  CtaAlign, 
  ImageBorderStyle,
  HeaderBrandMode,
  LogoAspectRatio,
  BadgeStyle,
  BadgeColorMode,
  TagsGroupType,
  TagsPosition,
  LayoutFlow,
  SubtitleColorMode,
  StepItem,
  ChartType
} from '../../types';
import { 
  Type, 
  Terminal, 
  TrendingUp, 
  BarChart3, 
  MessageSquare, 
  Image, 
  Plus, 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Sliders, 
  Sparkles,
  Heading,
  Code2,
  Layers,
  Upload,
  Star,
  User,
  CheckCircle2,
  Radio,
  Tag,
  Gift,
  ListOrdered
} from 'lucide-react';

interface Step1ContentProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const Step1Content: React.FC<Step1ContentProps> = ({
  state,
  updateState
}) => {
  const fontOptions = [
    { id: 'font-inter', label: 'Inter UI', desc: 'Limpia, neutra y legible' },
    { id: 'font-montserrat', label: 'Montserrat', desc: 'Geométrica y comercial' },
    { id: 'font-poppins', label: 'Poppins', desc: 'Amigable, redondeada y actual' },
    { id: 'font-plus-jakarta', label: 'Plus Jakarta', desc: 'Moderna y corporativa' },
    { id: 'font-outfit', label: 'Outfit Bold', desc: 'Editorial de alto impacto' },
    { id: 'font-playfair', label: 'Playfair Display', desc: 'Elegante y serif de lujo' },
    { id: 'font-space-mono', label: 'Space Mono', desc: 'Monoespaciada de precisión' },
    { id: 'font-jetbrains', label: 'JetBrains Mono', desc: 'Sintaxis de código moderno' },
    { id: 'font-fira-code', label: 'Fira Code', desc: 'Mono técnica para devs' },
    { id: 'font-syne', label: 'Syne Futurista', desc: 'Vanguardista y diseño premium' },
    { id: 'font-raleway', label: 'Raleway', desc: 'Estilizada y refinada' },
    { id: 'font-oswald', label: 'Oswald', desc: 'Condensada y titulares potentes' },
  ];

  // Helper para KPIs
  const addKPICard = () => {
    if (state.kpis.length >= 4) return;
    updateState({
      kpis: [
        ...state.kpis,
        { val: '+50%', label: 'INCREMENTO DE EFICIENCIA', prefix: '', suffix: '', trend: 'up', borderTop: true }
      ]
    });
  };

  const removeKPICard = (idx: number) => {
    if (state.kpis.length <= 1) return;
    updateState({
      kpis: state.kpis.filter((_, i) => i !== idx)
    });
  };

  const updateKPI = (idx: number, key: keyof typeof state.kpis[0], val: any) => {
    const updated = [...state.kpis];
    updated[idx] = { ...updated[idx], [key]: val };
    updateState({ kpis: updated });
  };

  // Helper para Gráficos
  const addChartBar = () => {
    if (state.chartBars.length >= 4) return;
    updateState({
      chartBars: [...state.chartBars, { label: 'Métrica Nueva', pct: 75, color: state.currentColor }]
    });
  };

  const removeChartBar = (idx: number) => {
    if (state.chartBars.length <= 1) return;
    updateState({
      chartBars: state.chartBars.filter((_, i) => i !== idx)
    });
  };

  const updateChart = (idx: number, key: 'label' | 'pct', val: string | number) => {
    const updated = [...state.chartBars];
    if (key === 'pct') {
      updated[idx].pct = typeof val === 'number' ? val : parseInt(String(val), 10) || 0;
    } else {
      updated[idx].label = val as string;
    }
    updateState({ chartBars: updated });
  };

  // Helper para Mensajes WhatsApp
  const addChatMessage = () => {
    if (state.chatMessages.length >= 5) return;
    const isClient = state.chatMessages.length % 2 === 0;
    updateState({
      chatMessages: [
        ...state.chatMessages,
        {
          sender: isClient ? 'client' : 'bot',
          text: isClient ? '¿Tienen soporte para integración con APIs existentes?' : 'Totalmente, conectamos ERPs, CRMs y bases de datos a la nube.',
          time: '10:18 AM'
        }
      ]
    });
  };

  const removeChatMessage = (idx: number) => {
    if (state.chatMessages.length <= 1) return;
    updateState({
      chatMessages: state.chatMessages.filter((_, i) => i !== idx)
    });
  };

  const updateChatMessage = (idx: number, field: 'text' | 'time' | 'sender', val: any) => {
    const updated = [...state.chatMessages];
    updated[idx] = { ...updated[idx], [field]: val };
    updateState({ chatMessages: updated });
  };

  // Helper para Pasos / Steps
  const addStepItem = () => {
    const steps = state.stepsData || [];
    if (steps.length >= 4) return;
    const nextNum = steps.length + 1;
    updateState({
      stepsData: [
        ...steps,
        { stepNumber: nextNum, title: `Fase 0${nextNum}`, description: 'Descripción de la etapa y entregables clave.' }
      ]
    });
  };

  const removeStepItem = (idx: number) => {
    const steps = state.stepsData || [];
    if (steps.length <= 1) return;
    const filtered = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: i + 1 }));
    updateState({ stepsData: filtered });
  };

  const updateStepItem = (idx: number, field: keyof StepItem, val: any) => {
    const steps = [...(state.stepsData || [])];
    steps[idx] = { ...steps[idx], [field]: val };
    updateState({ stepsData: steps });
  };

  // Helper para Imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateState({
        images: [{ url: ev.target?.result as string, caption: file.name }],
        activeModule: 'image'
      });
    };
    reader.readAsDataURL(file);
  };

  // Helper para Logo Custom
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateState({
        customLogoUrl: ev.target?.result as string,
        logoStyle: 'custom',
        headerShowLogo: true
      });
    };
    reader.readAsDataURL(file);
  };

  // Helper para Avatar de Autor
  const handleAuthorAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateState({
        authorAvatar: ev.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">

      {/* ========================================================================= */}
      {/* 1. HEADER DE MARCA (MODO DE MARCA, LOGO, BADGE SUPERIOR) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Heading className="w-4 h-4 text-indigo-400" /> Cabecera de Marca (Header)
          </label>
          <span className="text-[11px] font-mono text-indigo-400 font-bold">{state.headerSize || 13} px</span>
        </div>

        {/* Modo de Marca en Cabecera */}
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Composición de Marca:</label>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            {[
              { id: 'icon-text' as HeaderBrandMode, label: 'Logo + Texto' },
              { id: 'only-logo' as HeaderBrandMode, label: 'Solo Logo' },
              { id: 'only-text' as HeaderBrandMode, label: 'Solo Texto Empresa' },
              { id: 'logo-text' as HeaderBrandMode, label: 'Logo Integrado' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateState({ 
                  headerBrandMode: mode.id,
                  headerShowLogo: mode.id !== 'only-text'
                })}
                className={`py-1.5 px-2 rounded-lg text-center transition ${
                  (state.headerBrandMode || 'icon-text') === mode.id
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subida o Selección de Logo y Formato de Aspecto */}
        {state.headerBrandMode !== 'only-text' && (
          <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-medium">Logo / Isotipo:</span>
              <label className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer">
                <Upload className="w-3 h-3" /> Subir Logo
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>

            {/* Proporción de Aspecto del Logo */}
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Proporción del Logo:</span>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                {[
                  { id: 'auto' as LogoAspectRatio, label: 'Auto' },
                  { id: 'square' as LogoAspectRatio, label: '1:1 Cuadrado' },
                  { id: 'horizontal' as LogoAspectRatio, label: 'Horizontal' },
                  { id: 'vertical' as LogoAspectRatio, label: 'Vertical' },
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

            {/* Slider Tamaño Logo */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Tamaño del Logo:</span>
                <span className="font-mono text-indigo-400 font-bold">{state.logoSize || 44} px</span>
              </div>
              <input
                type="range"
                min={20}
                max={120}
                value={state.logoSize || 44}
                onChange={(e) => updateState({ logoSize: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Textos del Header */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Nombre de la Empresa:</label>
            <input
              type="text"
              value={state.companyName}
              onChange={(e) => updateState({ companyName: e.target.value })}
              placeholder="Ej: Tu Empresa / Marca"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Badge Superior / Categoría:</label>
            <input
              type="text"
              value={state.category}
              onChange={(e) => updateState({ category: e.target.value })}
              placeholder="Ej: DESARROLLO A LA MEDIDA"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Estilo y Color del Badge Superior */}
        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <label className="text-[11px] text-slate-300 font-medium block">Estilo Visual del Badge:</label>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
            {[
              { id: 'pill' as BadgeStyle, label: 'Pastilla (Pill)' },
              { id: 'bracket' as BadgeStyle, label: '[ Bracket ]' },
              { id: 'neon' as BadgeStyle, label: 'Neón Glow' },
              { id: 'glass' as BadgeStyle, label: 'Glass Vidrio' },
              { id: 'minimal-dot' as BadgeStyle, label: '• Minimal Dot' },
            ].map((badge) => (
              <button
                key={badge.id}
                type="button"
                onClick={() => updateState({ headerBadgeStyle: badge.id })}
                className={`py-1 px-1.5 rounded text-center transition ${
                  (state.headerBadgeStyle || 'pill') === badge.id
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {badge.label}
              </button>
            ))}
          </div>

          {/* Color del Badge */}
          <div className="pt-1 flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] text-slate-400">Color del Badge:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateState({ headerBadgeColorMode: 'inherit' })}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  (state.headerBadgeColorMode || 'inherit') === 'inherit' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Color Acento
              </button>
              <button
                type="button"
                onClick={() => updateState({ headerBadgeColorMode: 'contrast' })}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  state.headerBadgeColorMode === 'contrast' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Contraste
              </button>
              <button
                type="button"
                onClick={() => updateState({ headerBadgeColorMode: 'custom' })}
                className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 ${
                  state.headerBadgeColorMode === 'custom' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Hex
                {state.headerBadgeColorMode === 'custom' && (
                  <input
                    type="color"
                    value={state.headerBadgeCustomColor || state.currentColor}
                    onChange={(e) => updateState({ headerBadgeCustomColor: e.target.value })}
                    className="w-3.5 h-3.5 rounded cursor-pointer border-0 p-0"
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Slider Tamaño de Texto de Header */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Tamaño de Texto Cabecera:</span>
            <span className="font-mono text-indigo-400 font-bold">{state.headerSize || 13} px</span>
          </div>
          <input
            type="range"
            min={10}
            max={24}
            value={state.headerSize || 13}
            onChange={(e) => updateState({ headerSize: Number(e.target.value) })}
            className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TÍTULO PRINCIPAL (TIPOGRAFÍA, ALINEACIÓN, COLOR) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-400" /> Título Principal
          </label>
          <span className="text-[11px] font-mono text-indigo-400 font-bold">{state.titleSize} px</span>
        </div>

        <textarea
          rows={2}
          value={state.title}
          onChange={(e) => updateState({ title: e.target.value })}
          placeholder="Escribe aquí el titular principal..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
        />

        {/* Tipografía Independiente del Título */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Fuente del Título:</label>
          <select
            value={state.titleFont || 'font-inter'}
            onChange={(e) => updateState({ titleFont: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          >
            {fontOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label} ({f.desc})
              </option>
            ))}
          </select>
        </div>

        {/* Alineación del Título */}
        <div className="space-y-1 pt-1">
          <label className="text-[10px] text-slate-400 font-mono block">Alineación del Título:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'left' as TextAlign, label: 'Izquierda', icon: AlignLeft },
              { id: 'center' as TextAlign, label: 'Centro', icon: AlignCenter },
              { id: 'right' as TextAlign, label: 'Derecha', icon: AlignRight },
            ].map((align) => {
              const Icon = align.icon;
              const isSelected = (state.titleAlign || state.textAlign || 'center') === align.id;
              return (
                <button
                  key={align.id}
                  type="button"
                  onClick={() => updateState({ titleAlign: align.id, textAlign: align.id })}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{align.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tamaño y Color del Título */}
        <div className="space-y-2 pt-1">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Tamaño del Título:</span>
              <span className="font-mono text-indigo-400 font-bold">{state.titleSize} px</span>
            </div>
            <input
              type="range"
              min={24}
              max={88}
              value={state.titleSize}
              onChange={(e) => updateState({ titleSize: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-mono">Color del Título:</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => updateState({ titleColorMode: 'contrast' })}
                className={`py-1.5 px-2 rounded-lg text-center transition ${
                  state.titleColorMode === 'contrast'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
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
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Color Acento
              </button>
              <button
                type="button"
                onClick={() => updateState({ titleColorMode: 'custom' })}
                className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1 ${
                  state.titleColorMode === 'custom'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Hex</span>
                {state.titleColorMode === 'custom' && (
                  <input
                    type="color"
                    value={state.titleCustomColor}
                    onChange={(e) => updateState({ titleCustomColor: e.target.value })}
                    className="w-3.5 h-3.5 rounded cursor-pointer border-0 p-0"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SUBTÍTULO INDEPENDIENTE (FUENTE, COLOR ALTO CONTRASTE, ALINEACIÓN) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-400" /> Subtítulo / Bajada Descriptiva
          </label>
          <span className="text-[11px] font-mono text-indigo-400 font-bold">{state.subtitleSize} px</span>
        </div>

        <textarea
          rows={2}
          value={state.subtitle}
          onChange={(e) => updateState({ subtitle: e.target.value })}
          placeholder="Escribe el subtítulo o argumento secundario..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
        />

        {/* Tipografía Independiente del Subtítulo */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Fuente del Subtítulo:</label>
          <select
            value={state.subtitleFont || state.titleFont || 'font-inter'}
            onChange={(e) => updateState({ subtitleFont: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          >
            {fontOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label} ({f.desc})
              </option>
            ))}
          </select>
        </div>

        {/* Alineación del Subtítulo */}
        <div className="space-y-1 pt-1">
          <label className="text-[10px] text-slate-400 font-mono block">Alineación del Subtítulo:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'left' as TextAlign, label: 'Izquierda', icon: AlignLeft },
              { id: 'center' as TextAlign, label: 'Centro', icon: AlignCenter },
              { id: 'right' as TextAlign, label: 'Derecha', icon: AlignRight },
            ].map((align) => {
              const Icon = align.icon;
              const isSelected = (state.subtitleAlign || state.textAlign || 'center') === align.id;
              return (
                <button
                  key={align.id}
                  type="button"
                  onClick={() => updateState({ subtitleAlign: align.id })}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{align.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tamaño y Color del Subtítulo */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Color del Subtítulo:</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'contrast' })}
                className={`py-1 px-1 rounded text-[10px] text-center transition ${
                  (state.subtitleColorMode || 'contrast') === 'contrast'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Contraste Óptimo (Claro en fondo oscuro, oscuro en fondo claro)"
              >
                Óptimo
              </button>
              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'dimmed' })}
                className={`py-1 px-1 rounded text-[10px] text-center transition ${
                  state.subtitleColorMode === 'dimmed'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Atenuado / Slate Suave"
              >
                Suave
              </button>
              <button
                type="button"
                onClick={() => updateState({ subtitleColorMode: 'custom' })}
                className={`py-1 px-1 rounded text-[10px] text-center transition flex items-center justify-center gap-0.5 ${
                  state.subtitleColorMode === 'custom'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Hex
                {state.subtitleColorMode === 'custom' && (
                  <input
                    type="color"
                    value={state.subtitleCustomColor || '#94a3b8'}
                    onChange={(e) => updateState({ subtitleCustomColor: e.target.value })}
                    className="w-3 h-3 rounded cursor-pointer border-0 p-0"
                  />
                )}
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Tamaño:</span>
            <input
              type="range"
              min={13}
              max={38}
              value={state.subtitleSize}
              onChange={(e) => updateState({ subtitleSize: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer mt-2"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. GRUPO INTERMEDIO OPCIONAL (BADGES, RATING, AUTOR, SOCIAL-PROOF, ETC.) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-indigo-400" /> Grupo Intermedio / Badges
          </label>
          <button
            type="button"
            onClick={() => updateState({ tagsGroupVisible: state.tagsGroupVisible === false ? true : false })}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              state.tagsGroupVisible !== false ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                state.tagsGroupVisible !== false ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {state.tagsGroupVisible !== false && (
          <div className="space-y-2.5">
            {/* Tipo de Elemento Intermedio */}
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-mono">Tipo de Elemento Intermedio:</span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                {[
                  { id: 'badges' as TagsGroupType, label: 'Badges Tech', icon: Tag },
                  { id: 'rating' as TagsGroupType, label: 'Estrellas ★', icon: Star },
                  { id: 'author' as TagsGroupType, label: 'Ficha Autor', icon: User },
                  { id: 'social-proof' as TagsGroupType, label: 'Social Proof', icon: CheckCircle2 },
                  { id: 'status-pill' as TagsGroupType, label: 'Live Status', icon: Radio },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = (state.tagsGroupType || 'badges') === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateState({ tagsGroupType: item.id })}
                      className={`py-1.5 px-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs según el Tipo */}
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
                  <label className="text-[10px] text-slate-400 block mb-1 font-mono">Puntuación (Score):</label>
                  <input
                    type="text"
                    value={state.ratingScore || '4.9/5.0'}
                    onChange={(e) => updateState({ ratingScore: e.target.value })}
                    placeholder="4.9/5.0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto de Reseña:</label>
                  <input
                    type="text"
                    value={state.ratingCount || '+500 Clientes Satisfechos'}
                    onChange={(e) => updateState({ ratingCount: e.target.value })}
                    placeholder="+500 Clientes Satisfechos"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
            )}

            {state.tagsGroupType === 'author' && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nombre del Autor:</label>
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
                      value={state.authorRole || 'Lead Software Architect'}
                      onChange={(e) => updateState({ authorRole: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">Avatar de Autor:</span>
                  <label className="px-2 py-1 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Subir Foto
                    <input type="file" accept="image/*" onChange={handleAuthorAvatarUpload} className="hidden" />
                  </label>
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
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto de Estado en Vivo:</label>
                <input
                  type="text"
                  value={state.statusPillText || 'EN VIVO • NUEVA VERSIÓN DISPONIBLE'}
                  onChange={(e) => updateState({ statusPillText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>
            )}

            {/* Posición del Grupo: Arriba del Título o Abajo del Subtítulo */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">Ubicación del Grupo:</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => updateState({ tagsPosition: 'above-title' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition ${
                    state.tagsPosition === 'above-title'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Arriba del Título
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ tagsPosition: 'below-subtitle' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition ${
                    (state.tagsPosition || 'below-subtitle') === 'below-subtitle'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Debajo del Subtítulo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. DISTRIBUCIÓN DE ESPACIOS & ORDEN JERÁRQUICO (16:9 2 COLUMNAS Y ESPACIADORES) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" /> Jerarquía y Espaciados Dinámicos
          </label>
        </div>

        {/* Flujo / Orden de Layout (Texto Primero vs Módulo Primero) */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-300 font-medium mb-1">
            <span>Prioridad de Contenido:</span>
            <span className="text-indigo-400 text-[10px] font-mono">
              {state.aspectRatio === '16:9' ? '(2 Columnas Izq / Der)' : '(Arriba / Abajo)'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => updateState({ layoutFlow: 'text-first' })}
              className={`py-1.5 px-2 rounded-lg text-center transition ${
                (state.layoutFlow || 'text-first') === 'text-first'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {state.aspectRatio === '16:9' ? 'Texto Izq ➔ Módulo Der' : 'Texto Arriba ➔ Módulo Abajo'}
            </button>
            <button
              type="button"
              onClick={() => updateState({ layoutFlow: 'content-first' })}
              className={`py-1.5 px-2 rounded-lg text-center transition ${
                state.layoutFlow === 'content-first'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {state.aspectRatio === '16:9' ? 'Módulo Izq ➔ Texto Der' : 'Módulo Arriba ➔ Texto Abajo'}
            </button>
          </div>
        </div>

        {/* Sliders de Separadores Dinámicos */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
              <span>Espacio Título ➔ Subtítulo:</span>
              <span className="text-indigo-400 font-bold">{state.gapTitleSubtitle || 12} px</span>
            </div>
            <input
              type="range"
              min={4}
              max={40}
              value={state.gapTitleSubtitle || 12}
              onChange={(e) => updateState({ gapTitleSubtitle: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
              <span>Espacio Textos ➔ Grupo Intermedio:</span>
              <span className="text-indigo-400 font-bold">{state.gapTextToTags || 16} px</span>
            </div>
            <input
              type="range"
              min={4}
              max={60}
              value={state.gapTextToTags || 16}
              onChange={(e) => updateState({ gapTextToTags: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
              <span>Espacio General ➔ Módulo Central:</span>
              <span className="text-indigo-400 font-bold">{state.gapTagsToModule || 24} px</span>
            </div>
            <input
              type="range"
              min={8}
              max={80}
              value={state.gapTagsToModule || 24}
              onChange={(e) => updateState({ gapTagsToModule: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. MÓDULOS DE CONTENIDO CENTRAL (CÓDIGO, KPIS, STEPS, PROMO, CHAT, ETC.) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-400" /> Módulo Central de Contenido
          </label>
          <button
            type="button"
            onClick={() => updateState({ moduleVisible: !state.moduleVisible })}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              state.moduleVisible ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                state.moduleVisible ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {state.moduleVisible && (
          <div className="space-y-3">
            {/* Selector de Tipo de Módulo Central */}
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              {[
                { id: 'kpi' as ModuleType, label: 'Métricas KPI', icon: TrendingUp },
                { id: 'chart' as ModuleType, label: 'Gráficos (3 Tipos)', icon: BarChart3 },
                { id: 'cta' as ModuleType, label: 'Frase Acción (CTA)', icon: Sparkles },
                { id: 'promo' as ModuleType, label: 'Promo / Cupón', icon: Gift },
                { id: 'steps' as ModuleType, label: 'Pasos / Fases', icon: ListOrdered },
                { id: 'chat' as ModuleType, label: 'Chat WhatsApp', icon: MessageSquare },
                { id: 'image' as ModuleType, label: 'Mockup Imagen', icon: Image },
              ].map((m) => {
                const IconComponent = m.icon;
                const isSelected = state.activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => updateState({ activeModule: m.id })}
                    className={`py-2 px-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Slider de Escala del Módulo */}
            <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Escala Global del Módulo:</span>
                <span className="font-mono text-indigo-400 font-bold">{state.moduleScale || 100}%</span>
              </div>
              <input
                type="range"
                min={75}
                max={135}
                value={state.moduleScale || 100}
                onChange={(e) => updateState({ moduleScale: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Contenido Específico según Módulo */}
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">

              {/* 6.A FRASE DE ACCIÓN (CALL TO ACTION DIRECTO) */}
              {state.activeModule === 'cta' && (
                <div className="space-y-2.5">
                  <div className="p-2 bg-indigo-950/30 border border-indigo-500/20 rounded-lg text-[11px] text-indigo-300">
                    💡 <strong>Patrón Problema ➔ Acción</strong>: El título y subtítulo exponen el reto; esta tarjeta destaca la acción inmediata y persuasiva que debe ejecutar tu cliente.
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Badge de Acción:</label>
                    <input
                      type="text"
                      value={state.ctaActionBadge || '⚡ SOLUCIÓN DIRECTA'}
                      onChange={(e) => updateState({ ctaActionBadge: e.target.value })}
                      placeholder="Ej: ⚡ SOLUCIÓN DIRECTA"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Frase de Acción (Punchline):</label>
                    <textarea
                      rows={2}
                      value={state.ctaActionPhrase || 'Migra hoy tus procesos a la nube y reduce tiempos de respuesta en un 60%.'}
                      onChange={(e) => updateState({ ctaActionPhrase: e.target.value })}
                      placeholder="¿Qué acción o solución específica ejecuta tu producto?"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white leading-relaxed resize-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Texto del Botón / Pill de Acción:</label>
                    <input
                      type="text"
                      value={state.ctaActionButtonText || 'Solicitar Diagnóstico Técnico ➔'}
                      onChange={(e) => updateState({ ctaActionButtonText: e.target.value })}
                      placeholder="Ej: Agendar Demostración en Vivo ➔"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Beneficio / Garantía al pie:</label>
                    <input
                      type="text"
                      value={state.ctaActionBenefit || 'Diagnóstico inicial sin costo • Despliegue en producción garantizado'}
                      onChange={(e) => updateState({ ctaActionBenefit: e.target.value })}
                      placeholder="Ej: Sin permanencia mínima • Soporte 24/7"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                    />
                  </div>
                </div>
              )}

              {/* 6.B KPIS */}
              {state.activeModule === 'kpi' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Tarjetas KPI ({state.kpis.length}/4)</span>
                    <button
                      type="button"
                      onClick={addKPICard}
                      disabled={state.kpis.length >= 4}
                      className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" /> Añadir Métrica
                    </button>
                  </div>

                  <div className="space-y-2">
                    {state.kpis.map((kpi, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-indigo-400 font-bold">Métrica #{idx + 1}</span>
                          {state.kpis.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeKPICard(idx)}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={kpi.val}
                            onChange={(e) => updateKPI(idx, 'val', e.target.value)}
                            placeholder="+50%"
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                          />
                          <input
                            type="text"
                            value={kpi.label}
                            onChange={(e) => updateKPI(idx, 'label', e.target.value)}
                            placeholder="Eficiencia Operativa"
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6.C PASOS / STEPS */}
              {state.activeModule === 'steps' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      Pasos / Fases ({(state.stepsData || []).length}/4)
                    </span>
                    <button
                      type="button"
                      onClick={addStepItem}
                      disabled={(state.stepsData || []).length >= 4}
                      className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" /> Añadir Paso
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(state.stepsData || []).map((st, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-indigo-400 font-bold">Fase {st.stepNumber}</span>
                          {(state.stepsData || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStepItem(idx)}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) => updateStepItem(idx, 'title', e.target.value)}
                          placeholder="Título del paso"
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={st.description}
                          onChange={(e) => updateStepItem(idx, 'description', e.target.value)}
                          placeholder="Descripción breve..."
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6.D PROMO CON TEXTO AMPLIADO */}
              {state.activeModule === 'promo' && (
                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Badge de Lanzamiento:</label>
                      <input
                        type="text"
                        value={state.promoData?.badge || 'OFERTA LIMITADA'}
                        onChange={(e) => updateState({ promoData: { ...(state.promoData || { title: '', description: '', coupon: '', cta: '' }), badge: e.target.value } })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Código Cupón:</label>
                      <input
                        type="text"
                        value={state.promoData?.coupon || 'PROMO2026'}
                        onChange={(e) => updateState({ promoData: { ...(state.promoData || { badge: '', title: '', description: '', cta: '' }), coupon: e.target.value } })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-indigo-400 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Título Principal de la Oferta:</label>
                    <input
                      type="text"
                      value={state.promoData?.title || '50% OFF en Tu Primer Despliegue'}
                      onChange={(e) => updateState({ promoData: { ...(state.promoData || { badge: '', description: '', coupon: '', cta: '' }), title: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Subtítulo / Gancho Comercial:</label>
                    <input
                      type="text"
                      value={state.promoData?.subtitle || 'Acelera tu operación antes de cerrar el trimestre.'}
                      onChange={(e) => updateState({ promoData: { ...(state.promoData || { badge: '', title: '', description: '', coupon: '', cta: '' }), subtitle: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Descripción / Propuesta de Valor (Ampliada):</label>
                    <textarea
                      rows={3}
                      value={state.promoData?.description || 'Válido para nuevos clientes en desarrollo cloud, microservicios y modernización de plataformas empresariales.'}
                      onChange={(e) => updateState({ promoData: { ...(state.promoData || { badge: '', title: '', coupon: '', cta: '' }), description: e.target.value } })}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 leading-relaxed resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Botón de Reclamo:</label>
                      <input
                        type="text"
                        value={state.promoData?.cta || 'Reclamar Oferta'}
                        onChange={(e) => updateState({ promoData: { ...(state.promoData || { badge: '', title: '', description: '', coupon: '' }), cta: e.target.value } })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-mono">Letra Pequeña / Condiciones:</label>
                      <input
                        type="text"
                        value={state.promoData?.finePrint || 'Válido hasta agotar cupos del mes'}
                        onChange={(e) => updateState({ promoData: { ...(state.promoData || { badge: '', title: '', description: '', coupon: '', cta: '' }), finePrint: e.target.value } })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-400 text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6.E CHAT WHATSAPP */}
              {state.activeModule === 'chat' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Mensajes Chat ({state.chatMessages.length}/5)</span>
                    <button
                      type="button"
                      onClick={addChatMessage}
                      disabled={state.chatMessages.length >= 5}
                      className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" /> Añadir Mensaje
                    </button>
                  </div>

                  <div className="space-y-2">
                    {state.chatMessages.map((msg, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <select
                            value={msg.sender}
                            onChange={(e) => updateChatMessage(idx, 'sender', e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[11px] font-mono text-white"
                          >
                            <option value="client">Cliente (Gris)</option>
                            <option value="bot">Empresa / Bot (Verde WhatsApp)</option>
                          </select>
                          {state.chatMessages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeChatMessage(idx)}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={msg.text}
                          onChange={(e) => updateChatMessage(idx, 'text', e.target.value)}
                          placeholder="Texto del mensaje..."
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6.F GRÁFICOS (BARRAS HORIZONTALES, PASTEL Y LÍNEAS) */}
              {state.activeModule === 'chart' && (
                <div className="space-y-3">
                  {/* Selector de Tipo de Gráfico */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-mono">Tipo de Gráfico:</label>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                      {[
                        { id: 'horizontal-bars' as ChartType, label: '📊 Barras Horiz.' },
                        { id: 'pie' as ChartType, label: '🍩 Pastel / Donut' },
                        { id: 'line' as ChartType, label: '📈 Líneas Tendencia' },
                      ].map((ct) => (
                        <button
                          key={ct.id}
                          type="button"
                          onClick={() => updateState({ chartType: ct.id })}
                          className={`py-1.5 px-1 rounded-lg text-center transition ${
                            (state.chartType || 'horizontal-bars') === ct.id
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {ct.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Métricas ({state.chartBars.length}/4)</span>
                    <button
                      type="button"
                      onClick={addChartBar}
                      disabled={state.chartBars.length >= 4}
                      className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" /> Añadir Dato
                    </button>
                  </div>

                  <div className="space-y-2">
                    {state.chartBars.map((bar, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                        <input
                          type="text"
                          value={bar.label}
                          onChange={(e) => updateChart(idx, 'label', e.target.value)}
                          placeholder="Etiqueta"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={bar.pct}
                            onChange={(e) => updateChart(idx, 'pct', e.target.value)}
                            className="w-14 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono text-right"
                          />
                          <span className="text-slate-400 font-mono">%</span>
                        </div>
                        {state.chartBars.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChartBar(idx)}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6.G MOCKUP IMAGEN (CON OPCIÓN SIN BORDES) */}
              {state.activeModule === 'image' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Imágenes / Mockups</span>
                    <label className="px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer">
                      <Plus className="w-3 h-3" /> Subir Imagen
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Estilo de Borde:</label>
                    <select
                      value={state.imageBorderStyle || 'none'}
                      onChange={(e) => updateState({ imageBorderStyle: e.target.value as ImageBorderStyle })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
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

                  <div className="space-y-2">
                    {state.images.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                        <span className="truncate flex-1 text-slate-300 font-mono text-[11px]">
                          {img.caption || `Imagen ${idx + 1}`}
                        </span>
                        {state.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => updateState({ images: state.images.filter((_, i) => i !== idx) })}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 7. FOOTER (TEXTOS, TAMAÑOS, ORDEN Y ALINEACIÓN) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Pie de Imagen (Footer & CTA)
          </label>
          <span className="text-[11px] font-mono text-indigo-400 font-bold">{state.footerSize || 13} px</span>
        </div>

        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Texto del CTA (Llamado a la Acción):</label>
          <input
            type="text"
            value={state.cta}
            onChange={(e) => updateState({ cta: e.target.value })}
            placeholder="Ej: Escríbenos y migramos tu operación a la nube."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-[11px] text-slate-400 block mb-1">Handle / Usuario / Sitio Web:</label>
          <input
            type="text"
            value={state.handle}
            onChange={(e) => updateState({ handle: e.target.value })}
            placeholder="Ej: tumarca.com o @tuempresa"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Slider de Tamaño de Tipografía del Footer */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Tamaño de Texto del Footer:</span>
            <span className="font-mono text-indigo-400 font-bold">{state.footerSize || 13} px</span>
          </div>
          <input
            type="range"
            min={10}
            max={24}
            value={state.footerSize || 13}
            onChange={(e) => updateState({ footerSize: Number(e.target.value) })}
            className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
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
                className={`py-1.5 px-1.5 rounded-lg text-center transition text-[11px] ${
                  (state.ctaOrder || 'cta-first') === 'cta-first'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                CTA ➔ Handle
              </button>
              <button
                type="button"
                onClick={() => updateState({ ctaOrder: 'handle-first' })}
                className={`py-1.5 px-1.5 rounded-lg text-center transition text-[11px] ${
                  state.ctaOrder === 'handle-first'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Handle ➔ CTA
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Alineación en Canvas:</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => updateState({ ctaAlign: 'left' })}
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center transition ${
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
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center transition ${
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
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center transition text-[10px] ${
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

    </div>
  );
};
