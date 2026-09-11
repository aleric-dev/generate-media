import React from 'react';
import { PostState, ModuleType, TitleColorMode, TextAlign, CtaOrder, CtaAlign, ImageBorderStyle } from '../../types';
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
  Code2
} from 'lucide-react';

interface Step1ContentProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const Step1Content: React.FC<Step1ContentProps> = ({
  state,
  updateState
}) => {
  const fonts = [
    { id: 'font-space-mono', label: 'Space Mono (Tech)', desc: 'Monoespaciada de precisión' },
    { id: 'font-jetbrains', label: 'JetBrains Mono', desc: 'Sintaxis de código moderno' },
    { id: 'font-inter', label: 'Inter UI', desc: 'Limpia, neutra y legible' },
    { id: 'font-plus-jakarta', label: 'Plus Jakarta', desc: 'Moderna y corporativa' },
    { id: 'font-outfit', label: 'Outfit Bold', desc: 'Editorial de alto impacto' },
    { id: 'font-syne', label: 'Syne Futurista', desc: 'Geométrica y vanguardista' },
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
      updated[idx].pct = typeof val === 'number' ? val : parseInt(val, 10) || 0;
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

  return (
    <div className="space-y-4">

      {/* ========================================================================= */}
      {/* 1. TIPOGRAFÍA GLOBAL (FUENTES DESDE EL INICIO) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-400" /> Familia Tipográfica Global
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {fonts.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => updateState({ titleFont: f.id })}
              className={`p-2 rounded-xl text-left border transition flex flex-col gap-0.5 ${
                state.titleFont === f.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className={`font-bold ${f.id}`}>{f.label}</span>
              <span className="text-[10px] text-slate-500">{f.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HEADER DE MARCA (TEXTOS, LOGO & TAMAÑOS) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Heading className="w-4 h-4 text-indigo-400" /> Cabecera de Marca (Header)
          </label>
          <span className="text-[11px] font-mono text-indigo-400 font-bold">{state.headerSize || 13} px</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Nombre de la Empresa:</label>
            <input
              type="text"
              value={state.companyName}
              onChange={(e) => updateState({ companyName: e.target.value })}
              placeholder="Ej: Aleric Dev"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Categoría / Badge Superior:</label>
            <input
              type="text"
              value={state.category}
              onChange={(e) => updateState({ category: e.target.value })}
              placeholder="Ej: DESARROLLO A LA MEDIDA"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Toggle para mostrar/ocultar logo en Header */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-300 font-medium">Mostrar Isotipo / Logo en Cabecera:</span>
          <button
            type="button"
            onClick={() => updateState({ headerShowLogo: !state.headerShowLogo })}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              state.headerShowLogo !== false ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                state.headerShowLogo !== false ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sliders de Tamaño del Logo y Tamaño de Tipografía de Header */}
        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          {state.headerShowLogo !== false && (
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Tamaño del Logo:</span>
                <span className="font-mono text-indigo-400 font-bold">{state.logoSize || 44} px</span>
              </div>
              <input
                type="range"
                min={24}
                max={96}
                value={state.logoSize || 44}
                onChange={(e) => updateState({ logoSize: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Tamaño de Texto del Header:</span>
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
      </div>

      {/* ========================================================================= */}
      {/* 3. TÍTULO Y SUBTÍTULO (CUERPO EDITORIAL) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-400" /> Título Principal & Subtítulo
          </label>
          <span className="text-[11px] font-mono text-indigo-400 font-bold">{state.titleSize} px</span>
        </div>

        <textarea
          rows={2}
          value={state.title}
          onChange={(e) => updateState({ title: e.target.value })}
          placeholder="Escribe aquí el título principal de tu post..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
        />

        {/* Alineación de Textos */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] text-slate-300 font-medium block">Alineación del Contenido:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'left' as TextAlign, label: 'Izquierda', icon: AlignLeft },
              { id: 'center' as TextAlign, label: 'Centro', icon: AlignCenter },
              { id: 'right' as TextAlign, label: 'Derecha', icon: AlignRight },
            ].map((align) => {
              const Icon = align.icon;
              const isSelected = (state.textAlign || 'center') === align.id;
              return (
                <button
                  key={align.id}
                  type="button"
                  onClick={() => updateState({ textAlign: align.id })}
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

        {/* Sliders de Tamaño y Color del Título */}
        <div className="space-y-2 pt-1">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Tamaño del Título:</span>
              <span className="font-mono text-indigo-400 font-bold">{state.titleSize} px</span>
            </div>
            <input
              type="range"
              min={28}
              max={84}
              value={state.titleSize}
              onChange={(e) => updateState({ titleSize: Number(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Color del Título:</label>
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

        {/* Subtítulo */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-[11px] text-slate-300 font-medium">Subtítulo / Bajada:</label>
            <span className="text-[11px] font-mono text-indigo-400 font-bold">{state.subtitleSize} px</span>
          </div>
          <textarea
            rows={2}
            value={state.subtitle}
            onChange={(e) => updateState({ subtitle: e.target.value })}
            placeholder="Subtítulo descriptivo o argumento secundario..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          />

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Posición del Subtítulo:</span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => updateState({ subtitlePos: 'below' })}
                  className={`py-1 px-1.5 rounded text-center transition ${
                    state.subtitlePos === 'below'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Abajo
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ subtitlePos: 'above' })}
                  className={`py-1 px-1.5 rounded text-center transition ${
                    state.subtitlePos === 'above'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Arriba
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Tamaño:</span>
              <input
                type="range"
                min={14}
                max={36}
                value={state.subtitleSize}
                onChange={(e) => updateState({ subtitleSize: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer mt-2"
              />
            </div>
          </div>
        </div>

        {/* Badges de Tecnologías / Tags */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-[11px] text-slate-300 font-medium block mb-1">
            Badges de Tecnologías (Separadas por comas):
          </label>
          <input
            type="text"
            value={state.tags}
            onChange={(e) => updateState({ tags: e.target.value })}
            placeholder="Ej: PostgreSQL, Next.js, FastAPI, Roles Seguros"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CONTENIDO CENTRAL (MÓDULOS ENRIQUECIDOS) */}
      {/* ========================================================================= */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-400" /> Módulo Central de Contenido
          </label>

          {/* Switch Contenido Visible */}
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
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            {/* Sliders de Escala y Fuente del Módulo */}
            <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300 font-medium">Escala del Módulo Central:</span>
                <span className="font-mono text-indigo-400 font-bold">{Math.round((state.moduleScale || 1.0) * 100)}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={140}
                value={Math.round((state.moduleScale || 1.0) * 100)}
                onChange={(e) => updateState({ moduleScale: Number(e.target.value) / 100 })}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between items-center text-[11px] pt-1">
                <span className="text-slate-300 font-medium">Tamaño de Fuente Interna:</span>
                <span className="font-mono text-indigo-400 font-bold">{state.moduleFontSize || 14} px</span>
              </div>
              <input
                type="range"
                min={11}
                max={24}
                value={state.moduleFontSize || 14}
                onChange={(e) => updateState({ moduleFontSize: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Selector de 6 Tipos de Módulos */}
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              {[
                { id: 'text' as ModuleType, label: 'Texto / CTA', icon: Sparkles },
                { id: 'chat' as ModuleType, label: 'WhatsApp', icon: MessageSquare },
                { id: 'kpi' as ModuleType, label: 'Métricas KPI', icon: TrendingUp },
                { id: 'code' as ModuleType, label: 'Código', icon: Terminal },
                { id: 'chart' as ModuleType, label: 'Gráfico', icon: BarChart3 },
                { id: 'image' as ModuleType, label: 'Imagen', icon: Image },
              ].map((mod) => {
                const Icon = mod.icon;
                const isSelected = state.activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => updateState({ activeModule: mod.id })}
                    className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{mod.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Subpaneles de Configuración Específica por Módulo */}
            <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80 space-y-3">
              
              {/* ========================================================================= */}
              {/* 4.A NUEVO MÓDULO: TEXTO / GRAN CTA / CITA EDITORIAL */}
              {/* ========================================================================= */}
              {state.activeModule === 'text' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Mensaje Destacado / Gran CTA
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                    {[
                      { id: 'card' as const, label: 'Tarjeta Glass' },
                      { id: 'quote' as const, label: 'Cita / Comillas' },
                      { id: 'banner' as const, label: 'Banner Neón' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => updateState({ contentHighlightStyle: st.id })}
                        className={`py-1.5 px-2 rounded-lg text-center transition text-[11px] ${
                          (state.contentHighlightStyle || 'card') === st.id
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    value={state.contentHighlightText || ''}
                    onChange={(e) => updateState({ contentHighlightText: e.target.value })}
                    placeholder="Escribe aquí el texto destacado central, manifiesto o gran llamado a la acción..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* ========================================================================= */}
              {/* 4.B MÓDULO: CHAT ESTILO WHATSAPP AUTÉNTICO */}
              {/* ========================================================================= */}
              {state.activeModule === 'chat' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-mono text-emerald-400 font-bold">WhatsApp Business API</span>
                    </div>
                    <button
                      type="button"
                      onClick={addChatMessage}
                      disabled={state.chatMessages.length >= 5}
                      className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" /> Añadir Mensaje
                    </button>
                  </div>

                  {/* Configuración de Contacto WhatsApp */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Nombre de Contacto:</label>
                      <input
                        type="text"
                        value={state.chatContactName || 'Aleric Dev Bot'}
                        onChange={(e) => updateState({ chatContactName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Estado de Presencia:</label>
                      <input
                        type="text"
                        value={state.chatOnlineStatus || 'en línea'}
                        onChange={(e) => updateState({ chatOnlineStatus: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-emerald-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Lista de Mensajes */}
                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {state.chatMessages.map((msg, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateChatMessage(idx, 'sender', 'client')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                msg.sender === 'client'
                                  ? 'bg-slate-700 text-white border border-slate-600'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              👤 Cliente
                            </button>
                            <button
                              type="button"
                              onClick={() => updateChatMessage(idx, 'sender', 'bot')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                msg.sender === 'bot'
                                  ? 'bg-emerald-600 text-white border border-emerald-500'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              🤖 Bot (WhatsApp)
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={msg.time}
                              onChange={(e) => updateChatMessage(idx, 'time', e.target.value)}
                              placeholder="10:14 AM"
                              className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 text-right font-mono"
                            />
                            {state.chatMessages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeChatMessage(idx)}
                                className="text-slate-500 hover:text-red-400 p-0.5"
                                title="Eliminar mensaje"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={msg.text}
                          onChange={(e) => updateChatMessage(idx, 'text', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 4.C MÓDULO: KPIS ENRIQUECIDOS */}
              {/* ========================================================================= */}
              {state.activeModule === 'kpi' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-bold">Métricas y KPIs Clave</span>
                    <button
                      type="button"
                      onClick={addKPICard}
                      disabled={state.kpis.length >= 4}
                      className="px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" /> Añadir KPI
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {state.kpis.map((kpi, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-indigo-400 font-bold">Tarjeta KPI #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            {/* Toggle de Borde Superior Neón */}
                            <label className="flex items-center gap-1 text-[10px] text-slate-400 font-mono cursor-pointer">
                              <input
                                type="checkbox"
                                checked={kpi.borderTop !== false}
                                onChange={(e) => updateKPI(idx, 'borderTop', e.target.checked)}
                                className="accent-indigo-500"
                              />
                              Borde Neón
                            </label>
                            {state.kpis.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeKPICard(idx)}
                                className="text-slate-500 hover:text-red-400 p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Valor Principal:</label>
                            <input
                              type="text"
                              value={kpi.val}
                              onChange={(e) => updateKPI(idx, 'val', e.target.value)}
                              placeholder="99/100"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Etiqueta / Descripción:</label>
                            <input
                              type="text"
                              value={kpi.label}
                              onChange={(e) => updateKPI(idx, 'label', e.target.value)}
                              placeholder="LIGHTHOUSE SPEED"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono"
                            />
                          </div>
                        </div>

                        {/* Prefijo / Sufijo y Tendencia */}
                        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono pt-1 border-t border-slate-800/60">
                          <div>
                            <span className="text-slate-500 block mb-0.5">Prefijo (ej. $):</span>
                            <input
                              type="text"
                              value={kpi.prefix || ''}
                              onChange={(e) => updateKPI(idx, 'prefix', e.target.value)}
                              placeholder="$"
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-white text-center"
                            />
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">Sufijo (ej. ms):</span>
                            <input
                              type="text"
                              value={kpi.suffix || ''}
                              onChange={(e) => updateKPI(idx, 'suffix', e.target.value)}
                              placeholder="%"
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-white text-center"
                            />
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">Tendencia:</span>
                            <select
                              value={kpi.trend || 'none'}
                              onChange={(e) => updateKPI(idx, 'trend', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-white"
                            >
                              <option value="none">Sin flecha</option>
                              <option value="up">▲ Crecimiento</option>
                              <option value="down">▼ Reducción</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 4.D MÓDULO: CÓDIGO PROFESIONAL */}
              {/* ========================================================================= */}
              {state.activeModule === 'code' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" /> Editor de Código & Sintaxis
                    </span>
                    <label className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.codeShowLineNumbers !== false}
                        onChange={(e) => updateState({ codeShowLineNumbers: e.target.checked })}
                        className="accent-indigo-500"
                      />
                      <span>Números de Línea</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Nombre del Archivo:</label>
                      <input
                        type="text"
                        value={state.codeFilename || 'system/migrate.ts'}
                        onChange={(e) => updateState({ codeFilename: e.target.value })}
                        placeholder="ej. api/checkout.ts"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Lenguaje:</label>
                      <select
                        value={state.codeLanguage || 'typescript'}
                        onChange={(e) => updateState({ codeLanguage: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="typescript">TypeScript (.ts)</option>
                        <option value="python">Python (.py)</option>
                        <option value="sql">SQL / Postgres</option>
                        <option value="bash">Bash / Docker</option>
                        <option value="json">JSON / Config</option>
                        <option value="go">Golang (.go)</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={state.code}
                    onChange={(e) => updateState({ code: e.target.value })}
                    placeholder="Escribe o pega el código a destacar..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 font-jetbrains text-xs text-emerald-400 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                  />
                </div>
              )}

              {/* ========================================================================= */}
              {/* 4.E MÓDULO: GRÁFICOS */}
              {/* ========================================================================= */}
              {state.activeModule === 'chart' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Barras Comparativas</span>
                    <button
                      type="button"
                      onClick={addChartBar}
                      disabled={state.chartBars.length >= 4}
                      className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" /> Añadir Barra
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

              {/* ========================================================================= */}
              {/* 4.F MÓDULO: IMÁGENES */}
              {/* ========================================================================= */}
              {state.activeModule === 'image' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-300 font-semibold">Imágenes / Mockups</span>
                    <label className="px-2.5 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer">
                      <Plus className="w-3 h-3" /> Subir Imagen
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Selector de Estilo de Borde */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Estilo de Borde:</label>
                    <select
                      value={state.imageBorderStyle || 'none'}
                      onChange={(e) => updateState({ imageBorderStyle: e.target.value as ImageBorderStyle })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                    >
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
      {/* 5. FOOTER (TEXTOS, TAMAÑOS, ORDEN Y ALINEACIÓN) */}
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
            placeholder="Ej: aleric.dev o @alericdev"
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
