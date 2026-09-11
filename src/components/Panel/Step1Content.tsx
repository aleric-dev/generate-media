import React from 'react';
import { PostState, ModuleType, ModuleSize, TitleColorMode, TextAlign, CtaOrder, CtaAlign } from '../../types';
import { Sparkles, Type, Layers, Terminal, TrendingUp, BarChart3, MessageSquare, Image, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, ArrowDownUp } from 'lucide-react';

interface Step1ContentProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

export const Step1Content: React.FC<Step1ContentProps> = ({
  state,
  updateState
}) => {
  const addKPICard = () => {
    if (state.kpis.length >= 4) return;
    updateState({
      kpis: [...state.kpis, { val: '+50%', label: 'INCREMENTO DE EFICIENCIA', borderTop: true }]
    });
  };

  const removeKPICard = (idx: number) => {
    if (state.kpis.length <= 1) return;
    updateState({
      kpis: state.kpis.filter((_, i) => i !== idx)
    });
  };

  const updateKPI = (idx: number, key: 'val' | 'label', val: string) => {
    const updated = [...state.kpis];
    updated[idx][key] = val;
    updateState({ kpis: updated });
  };

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

  const addChatMessage = () => {
    if (state.chatMessages.length >= 4) return;
    const isClient = state.chatMessages.length % 2 === 0;
    updateState({
      chatMessages: [
        ...state.chatMessages,
        {
          sender: isClient ? 'client' : 'bot',
          text: isClient ? '¿Cuánto tiempo tarda la implementación?' : 'En promedio 2 a 3 semanas con despliegue listo para tu equipo.',
          time: '10:16 AM'
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

  const updateChatMessage = (idx: number, text: string) => {
    const updated = [...state.chatMessages];
    updated[idx].text = text;
    updateState({ chatMessages: updated });
  };

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
      {/* 1.1 Título Principal */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-400" /> Título Principal
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

        {/* Alineación de Textos (Título, Subtítulo, Badges) */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] text-slate-300 font-medium block">Alineación del Contenido:</label>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => updateState({ textAlign: 'left' })}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                state.textAlign === 'left'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" /> Izquierda
            </button>
            <button
              type="button"
              onClick={() => updateState({ textAlign: 'center' })}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                state.textAlign === 'center'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" /> Centro
            </button>
            <button
              type="button"
              onClick={() => updateState({ textAlign: 'right' })}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                state.textAlign === 'right'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlignRight className="w-3.5 h-3.5" /> Derecha
            </button>
          </div>
        </div>

        {/* Slider Tamaño Título */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Tamaño de fuente del título:</span>
            <span>32px a 72px</span>
          </div>
          <input
            type="range"
            min={32}
            max={72}
            value={state.titleSize}
            onChange={(e) => updateState({ titleSize: parseInt(e.target.value, 10) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Selector de Color de Título */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] text-slate-300 font-medium block">Color del Título:</label>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => updateState({ titleColorMode: 'contrast' })}
              className={`py-1.5 px-2 rounded-lg text-center transition ${
                state.titleColorMode === 'contrast'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Alto Contraste
            </button>
            <button
              type="button"
              onClick={() => updateState({ titleColorMode: 'category' })}
              className={`py-1.5 px-2 rounded-lg text-center transition ${
                state.titleColorMode === 'category'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Color Categoría
            </button>
            <button
              type="button"
              onClick={() => updateState({ titleColorMode: 'custom' })}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition ${
                state.titleColorMode === 'custom'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>Personalizado</span>
              <input
                type="color"
                value={state.titleCustomColor}
                onChange={(e) => updateState({ titleCustomColor: e.target.value, titleColorMode: 'custom' })}
                className="w-4 h-4 rounded cursor-pointer border-none bg-transparent"
              />
            </button>
          </div>
        </div>
      </div>

      {/* 1.2 Subtítulo */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white font-bold">Subtítulo / Bajada Descriptiva</label>
          <select
            value={state.subtitlePos}
            onChange={(e) => updateState({ subtitlePos: e.target.value as 'below' | 'above' })}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-300"
          >
            <option value="below">Abajo del Título</option>
            <option value="above">Arriba del Título (Kicker)</option>
          </select>
        </div>

        <textarea
          rows={2}
          value={state.subtitle}
          onChange={(e) => updateState({ subtitle: e.target.value })}
          placeholder="Escribe el subtítulo o texto de soporte..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
        />

        {/* Slider Tamaño Subtítulo */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Tamaño de fuente del subtítulo:</span>
            <span className="text-indigo-400 font-bold">{state.subtitleSize} px</span>
          </div>
          <input
            type="range"
            min={16}
            max={36}
            value={state.subtitleSize}
            onChange={(e) => updateState({ subtitleSize: parseInt(e.target.value, 10) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 1.3 Badges / Tecnologías */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
        <label className="text-xs text-white font-bold block">Badges / Tecnologías (Separadas por comas)</label>
        <input
          type="text"
          value={state.tags}
          onChange={(e) => updateState({ tags: e.target.value })}
          placeholder="Ej: PostgreSQL, FastAPI, React 19, Docker"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* 1.4 Módulo Central (Dinamizar tamaño & Quitar) */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-white font-bold">Módulo Central</span>
          </div>

          {/* Switch Activar / Quitar Módulo */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-mono">Mostrar módulo:</span>
            <button
              type="button"
              role="switch"
              aria-checked={state.moduleVisible}
              onClick={() => updateState({ moduleVisible: !state.moduleVisible })}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                state.moduleVisible ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  state.moduleVisible ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {state.moduleVisible && (
          <div className="space-y-3">
            {/* 5 Botones de Tipo de Módulo */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => updateState({ activeModule: 'code' })}
                className={`py-2 rounded-lg font-bold transition flex flex-col items-center gap-1 ${
                  state.activeModule === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" /> Código
              </button>
              <button
                type="button"
                onClick={() => updateState({ activeModule: 'kpi' })}
                className={`py-2 rounded-lg font-bold transition flex flex-col items-center gap-1 ${
                  state.activeModule === 'kpi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> KPIs
              </button>
              <button
                type="button"
                onClick={() => updateState({ activeModule: 'chart' })}
                className={`py-2 rounded-lg font-bold transition flex flex-col items-center gap-1 ${
                  state.activeModule === 'chart' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Gráfico
              </button>
              <button
                type="button"
                onClick={() => updateState({ activeModule: 'chat' })}
                className={`py-2 rounded-lg font-bold transition flex flex-col items-center gap-1 ${
                  state.activeModule === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </button>
              <button
                type="button"
                onClick={() => updateState({ activeModule: 'image' })}
                className={`py-2 rounded-lg font-bold transition flex flex-col items-center gap-1 ${
                  state.activeModule === 'image' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Image className="w-3.5 h-3.5" /> Imagen
              </button>
            </div>

            {/* Selector de Escala / Altura del Módulo */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-300">Preset de Altura del Módulo:</span>
                <span className="text-indigo-400 font-bold uppercase">{state.moduleSize}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                {(['compact', 'normal', 'spacious'] as ModuleSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateState({ moduleSize: size })}
                    className={`py-1 px-2 rounded-lg text-center transition ${
                      state.moduleSize === size
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {size === 'compact' ? 'Compacto' : size === 'spacious' ? 'Amplio' : 'Normal'}
                  </button>
                ))}
              </div>

              {/* Slider de Escala Interna de Componentes */}
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Zoom / Escala interna componentes:</span>
                  <span className="text-indigo-400 font-bold">{Math.round((state.moduleScale || 1.0) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={140}
                  step={5}
                  value={Math.round((state.moduleScale || 1.0) * 100)}
                  onChange={(e) => updateState({ moduleScale: parseInt(e.target.value, 10) / 100 })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Slider de Tamaño de Fuente Interna */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Tamaño de fuente interno (código/textos):</span>
                  <span className="text-indigo-400 font-bold">{state.moduleFontSize || 14} px</span>
                </div>
                <input
                  type="range"
                  min={11}
                  max={24}
                  step={1}
                  value={state.moduleFontSize || 14}
                  onChange={(e) => updateState({ moduleFontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Controles de Contenido del Módulo Activo */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2.5">
              {/* CODE */}
              {state.activeModule === 'code' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Líneas de Código / Microservicio</span>
                    <span className="text-indigo-400">Editable</span>
                  </div>
                  <textarea
                    rows={4}
                    value={state.code}
                    onChange={(e) => updateState({ code: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* KPIS */}
              {state.activeModule === 'kpi' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 font-semibold">Métricas KPIs</span>
                    <button
                      type="button"
                      onClick={addKPICard}
                      className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" /> Añadir KPI
                    </button>
                  </div>
                  <div className="space-y-2">
                    {state.kpis.map((kpi, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <input
                          type="text"
                          value={kpi.val}
                          onChange={(e) => updateKPI(idx, 'val', e.target.value)}
                          className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono font-bold"
                        />
                        <input
                          type="text"
                          value={kpi.label}
                          onChange={(e) => updateKPI(idx, 'label', e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                        />
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
                    ))}
                  </div>
                </div>
              )}

              {/* CHARTS */}
              {state.activeModule === 'chart' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 font-semibold">Barras del Gráfico</span>
                    <button
                      type="button"
                      onClick={addChartBar}
                      className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" /> Añadir Barra
                    </button>
                  </div>
                  <div className="space-y-2">
                    {state.chartBars.map((bar, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <input
                          type="text"
                          value={bar.label}
                          onChange={(e) => updateChart(idx, 'label', e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={bar.pct}
                          onChange={(e) => updateChart(idx, 'pct', e.target.value)}
                          className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                        />
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

              {/* CHAT */}
              {state.activeModule === 'chat' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 font-semibold">Mensajes del Chat</span>
                    <button
                      type="button"
                      onClick={addChatMessage}
                      className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" /> Añadir Mensaje
                    </button>
                  </div>
                  <div className="space-y-2">
                    {state.chatMessages.map((msg, idx) => (
                      <div key={idx} className="space-y-1 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="font-bold">{msg.sender === 'client' ? '👤 Cliente' : '🤖 Bot Empresa'}</span>
                          {state.chatMessages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeChatMessage(idx)}
                              className="text-slate-500 hover:text-red-400 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={2}
                          value={msg.text}
                          onChange={(e) => updateChatMessage(idx, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IMAGES */}
              {state.activeModule === 'image' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 font-semibold">Imágenes / Mockups</span>
                    <label className="px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer">
                      <Plus className="w-3 h-3" /> Subir Imagen
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="space-y-2">
                    {state.images.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800 text-xs">
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

      {/* 1.5 Textos de Cierre & Footer (CTA y Handle) */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-white font-bold">Llamado a la Acción (CTA) & Footer</span>
        </div>

        <div>
          <label className="text-[11px] text-slate-300 font-medium mb-1 block">Texto del CTA (Llamado a la Acción):</label>
          <input
            type="text"
            value={state.cta}
            onChange={(e) => updateState({ cta: e.target.value })}
            placeholder="Ej: Escríbenos y migramos tu operación a la nube."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                className={`py-1 px-1.5 rounded text-center transition text-[11px] ${
                  (state.ctaOrder || 'cta-first') === 'cta-first'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                CTA ➔ Handle
              </button>
              <button
                type="button"
                onClick={() => updateState({ ctaOrder: 'handle-first' })}
                className={`py-1 px-1.5 rounded text-center transition text-[11px] ${
                  state.ctaOrder === 'handle-first'
                    ? 'bg-indigo-600 text-white font-bold'
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
                className={`py-1 px-1 rounded flex items-center justify-center transition ${
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
                className={`py-1 px-1 rounded flex items-center justify-center transition ${
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
                className={`py-1 px-1 rounded flex items-center justify-center transition text-[10px] ${
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
