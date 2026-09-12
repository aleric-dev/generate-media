import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Building2, 
  Palette, 
  FileText, 
  Layers, 
  Save, 
  Trash2, 
  LayoutTemplate,
  Search,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { PostState, PostTemplate, HeaderShape, FooterShape, HeaderBrandMode, LogoType, PatternType, PatternVignette, LightType, ModuleType } from '../types';
import { defaultTemplates } from '../constants/templates';
import { getSavedBrands, saveBrand, getDefaultBrand, deleteBrand } from '../utils/brandStorage';
import { RealCanvasPreview } from './RealCanvasPreview';

interface CreationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAndOpenEditor: (customizedState: Partial<PostState>) => void;
  currentState: PostState;
}

export const CreationWizardModal: React.FC<CreationWizardModalProps> = ({
  isOpen,
  onClose,
  onConfirmAndOpenEditor,
  currentState,
}) => {
  // Pasos: 1: Branding, 2: Paleta & Fuentes, 3: Contenido / Plantillas, 4: Fondo, 5: Confirmar
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Estado temporal del asistente
  const [wizardState, setWizardState] = useState<PostState>({ ...currentState });

  // Gestión de Marcas Recurrentes
  const [savedBrands, setSavedBrands] = useState(getSavedBrands());
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [brandSavedNotice, setBrandSavedNotice] = useState(false);

  // Filtros de plantillas en el Paso 3
  const [contentMode, setContentMode] = useState<'custom' | 'template'>('custom');
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Cargar marca por defecto al abrir si existe
  useEffect(() => {
    if (isOpen) {
      const brands = getSavedBrands();
      setSavedBrands(brands);
      const defaultBrand = getDefaultBrand();
      if (defaultBrand) {
        setSelectedBrandId(defaultBrand.id);
        applyBrandProfile(defaultBrand);
      } else {
        setWizardState({ ...currentState });
      }
      setCurrentStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateWizard = (partial: Partial<PostState>) => {
    setWizardState((prev) => ({ ...prev, ...partial }));
  };

  const applyBrandProfile = (brand: ReturnType<typeof getSavedBrands>[0]) => {
    updateWizard({
      companyName: brand.companyName,
      handle: brand.handle,
      logoType: brand.logoType,
      customLogoUrl: brand.customLogoUrl || null,
      currentColor: brand.primaryColor,
      titleFont: brand.titleFont || wizardState.titleFont,
      subtitleFont: brand.subtitleFont || wizardState.subtitleFont,
      headerBrandMode: brand.headerBrandMode || wizardState.headerBrandMode,
      headerShape: brand.headerShape || wizardState.headerShape,
      footerShape: brand.footerShape || wizardState.footerShape,
    });
  };

  const handleSaveCurrentBrand = () => {
    const saved = saveBrand({
      name: wizardState.companyName || 'Mi Marca',
      companyName: wizardState.companyName,
      handle: wizardState.handle,
      logoType: wizardState.logoType,
      customLogoUrl: wizardState.customLogoUrl,
      primaryColor: wizardState.currentColor,
      titleFont: wizardState.titleFont,
      subtitleFont: wizardState.subtitleFont,
      headerBrandMode: wizardState.headerBrandMode,
      headerShape: wizardState.headerShape,
      footerShape: wizardState.footerShape,
      isDefault: true,
    });
    setSavedBrands(getSavedBrands());
    setSelectedBrandId(saved.id);
    setBrandSavedNotice(true);
    setTimeout(() => setBrandSavedNotice(false), 2500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        updateWizard({ customLogoUrl: url, logoType: 'custom' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectTemplate = (tpl: PostTemplate) => {
    setSelectedTemplateId(tpl.id);
    updateWizard({
      title: tpl.title,
      subtitle: tpl.subtitle,
      activeModule: tpl.module || 'code',
      code: tpl.code || wizardState.code,
      kpis: tpl.kpis || wizardState.kpis,
      chartBars: tpl.chartBars || wizardState.chartBars,
      chatMessages: tpl.chatMessages || wizardState.chatMessages,
      steps: tpl.steps || wizardState.steps,
      promo: tpl.promo || wizardState.promo,
      tags: tpl.tags || wizardState.tags,
      bgPattern: tpl.bgPattern || wizardState.bgPattern,
      category: tpl.category || wizardState.category,
    });
  };

  const colorPresets = [
    { color: '#4F46E5', name: 'Indigo' },
    { color: '#0891B2', name: 'Cyan' },
    { color: '#059669', name: 'Emerald' },
    { color: '#D97706', name: 'Amber' },
    { color: '#8B5CF6', name: 'Violet' },
    { color: '#E11D48', name: 'Rose' },
    { color: '#DC2626', name: 'Crimson' },
    { color: '#64748B', name: 'Slate' },
    { color: '#0284C7', name: 'Sky' },
    { color: '#10B981', name: 'Mint' },
  ];

  const fontOptions = [
    { id: 'font-space-mono', label: 'Space Mono', desc: 'Precisión técnica' },
    { id: 'font-inter', label: 'Inter UI', desc: 'Limpia y neutral' },
    { id: 'font-plus-jakarta', label: 'Plus Jakarta', desc: 'Corporativa moderna' },
    { id: 'font-outfit', label: 'Outfit Bold', desc: 'Alto impacto' },
    { id: 'font-syne', label: 'Syne Futurista', desc: 'Vanguardista' },
    { id: 'font-jetbrains', label: 'JetBrains Mono', desc: 'Código sintáctico' },
  ];

  const patterns: PatternType[] = [
    'circuit',
    'hexagons',
    'matrix',
    'neural',
    'grid',
    'dots',
    'waves',
    'isometric',
    'topographic',
    'none',
  ];

  const modules: { id: ModuleType; label: string }[] = [
    { id: 'code', label: 'Código Fuente' },
    { id: 'kpi', label: 'Tarjetas KPI' },
    { id: 'steps', label: 'Pasos / Steps' },
    { id: 'chat', label: 'Chat WhatsApp' },
    { id: 'chart', label: 'Gráfico Comparativo' },
    { id: 'promo', label: 'Promo / Oferta' },
    { id: 'cta', label: 'Llamado a Acción' },
  ];

  const filteredTemplates = defaultTemplates.filter(
    (t) =>
      t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(templateSearch.toLowerCase()) ||
      (t.tags && t.tags.toLowerCase().includes(templateSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
      <div className="bg-[#0B101B] border border-slate-800 w-full max-w-5xl rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        
        {/* CABECERA DEL ASISTENTE */}
        <div className="p-4 px-6 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Asistente de Creación Modular</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Paso {currentStep} de 5
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configura los ingredientes clave antes de entrar al editor interactivo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* INDICADOR DE PASOS SUPERIOR */}
        <div className="px-6 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono shrink-0 overflow-x-auto gap-2">
          {[
            { step: 1, label: '1. Branding', icon: Building2 },
            { step: 2, label: '2. Paleta & Tipografía', icon: Palette },
            { step: 3, label: '3. Contenido / Plantillas', icon: FileText },
            { step: 4, label: '4. Atmósfera & Fondo', icon: Layers },
            { step: 5, label: '5. Confirmar', icon: CheckCircle2 },
          ].map((s) => {
            const IconComponent = s.icon;
            const isCurrent = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : isCompleted
                    ? 'bg-slate-900 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* CUERPO SPLIT (CONTROLES A LA IZQUIERDA + PREVIEW A LA DERECHA) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO DEL PASO ACTIVO (7 cols) */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-800/80 overflow-y-auto space-y-5">
            
            {/* ========================================================================= */}
            {/* PASO 1: BRANDING & IDENTIDAD */}
            {/* ========================================================================= */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>Identidad de Marca & Perfiles Recurrentes</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Define tu empresa y guárdala para no volver a escribirla
                    </p>
                  </div>

                  {/* Selector de Marcas Guardadas */}
                  {savedBrands.length > 0 && (
                    <select
                      value={selectedBrandId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedBrandId(id);
                        const found = savedBrands.find((b) => b.id === id);
                        if (found) applyBrandProfile(found);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-indigo-300"
                    >
                      <option value="">-- Cargar Marca Guardada --</option>
                      {savedBrands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.handle})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Inputs de Nombre y Handle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Nombre de la Empresa o Creador</label>
                    <input
                      type="text"
                      value={wizardState.companyName}
                      onChange={(e) => updateWizard({ companyName: e.target.value })}
                      placeholder="Ej. Aleric Dev"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Handle Oficial (@usuario)</label>
                    <input
                      type="text"
                      value={wizardState.handle}
                      onChange={(e) => updateWizard({ handle: e.target.value })}
                      placeholder="Ej. @aleric.dev"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Selección y Carga de Logo */}
                <div className="space-y-2 text-xs font-mono">
                  <label className="text-slate-300 font-semibold">Tipo de Logotipo</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'generic' as const, label: 'Monograma' },
                      { id: 'text' as const, label: 'Solo Texto' },
                      { id: 'aleric' as const, label: 'Aleric Oficial' },
                      { id: 'custom' as const, label: 'Subir Imagen' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => updateWizard({ logoType: m.id })}
                        className={`p-2 rounded-lg border text-center transition ${
                          wizardState.logoType === m.id
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {wizardState.logoType === 'custom' && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {wizardState.customLogoUrl ? (
                          <img
                            src={wizardState.customLogoUrl}
                            alt="Logo"
                            className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500">
                            <Upload className="w-4 h-4" />
                          </div>
                        )}
                        <span className="text-slate-400 text-[11px]">
                          {wizardState.customLogoUrl ? 'Logo personalizado cargado' : 'Selecciona un archivo PNG o SVG'}
                        </span>
                      </div>

                      <label className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] cursor-pointer shadow-sm">
                        <span>Cargar Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Estilo de Header y Footer */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Estilo de Cabecera</label>
                    <select
                      value={wizardState.headerShape}
                      onChange={(e) => updateWizard({ headerShape: e.target.value as HeaderShape })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-none"
                    >
                      <option value="line">Línea Minimal</option>
                      <option value="pill">Pill Flotante</option>
                      <option value="card">Tarjeta Card</option>
                      <option value="floating-dock">Floating Dock</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Estilo de Pie (Footer)</label>
                    <select
                      value={wizardState.footerShape}
                      onChange={(e) => updateWizard({ footerShape: e.target.value as FooterShape })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-none"
                    >
                      <option value="line">Línea Minimal</option>
                      <option value="pill">Pill Flotante</option>
                      <option value="card">Tarjeta Card</option>
                    </select>
                  </div>
                </div>

                {/* BOTÓN PARA GUARDAR COMO MARCA RECURRENTE */}
                <div className="pt-2 flex items-center justify-between gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/25">
                  <div className="flex items-center gap-2 text-xs text-indigo-300 font-mono">
                    <Save className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>¿Quieres guardar esta marca para futuros posts?</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveCurrentBrand}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar Marca</span>
                  </button>
                </div>

                {brandSavedNotice && (
                  <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Marca guardada exitosamente en este navegador!</span>
                  </p>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* PASO 2: PALETA & TIPOGRAFÍA */}
            {/* ========================================================================= */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-400" />
                    <span>Color Corporativo y Fuentes Tipográficas</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Selecciona los tonos de acento y la tipografía editorial
                  </p>
                </div>

                {/* Color Primario */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-semibold">Color de Acento Principal</label>
                    <span className="font-bold text-indigo-400">{wizardState.currentColor}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {colorPresets.map((p) => (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => updateWizard({ currentColor: p.color })}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                          wizardState.currentColor.toLowerCase() === p.color.toLowerCase()
                            ? 'border-indigo-400 bg-slate-900 ring-1 ring-indigo-400'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-[10px] text-slate-300">{p.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selector HEX libre */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      value={wizardState.currentColor}
                      onChange={(e) => updateWizard({ currentColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={wizardState.currentColor}
                      onChange={(e) => updateWizard({ currentColor: e.target.value })}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs w-28 focus:border-indigo-500 outline-none"
                    />
                    <span className="text-slate-500 text-[11px]">Cód. Hexadecimal libre</span>
                  </div>
                </div>

                {/* Fuentes: Título y Subtítulo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
                  <div className="space-y-2">
                    <label className="text-slate-300 font-semibold">Tipografía del Título</label>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {fontOptions.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => updateWizard({ titleFont: f.id })}
                          className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition ${
                            wizardState.titleFont === f.id
                              ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className={f.id}>{f.label}</span>
                          <span className="text-[9px] text-slate-500">{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-300 font-semibold">Tipografía del Subtítulo</label>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {fontOptions.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => updateWizard({ subtitleFont: f.id })}
                          className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition ${
                            wizardState.subtitleFont === f.id
                              ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className={f.id}>{f.label}</span>
                          <span className="text-[9px] text-slate-500">{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PASO 3: CONTENIDO O PLANTILLAS */}
            {/* ========================================================================= */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span>Contenido o Selección de Plantilla</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Redacta desde cero o selecciona una plantilla prediseñada
                    </p>
                  </div>

                  {/* Switch entre Contenido Manual y Plantillas */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setContentMode('custom')}
                      className={`px-3 py-1 rounded-lg transition ${
                        contentMode === 'custom'
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Redactar Propio
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentMode('template')}
                      className={`px-3 py-1 rounded-lg transition ${
                        contentMode === 'template'
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Usar Plantilla (+24)
                    </button>
                  </div>
                </div>

                {contentMode === 'custom' ? (
                  <div className="space-y-3.5 text-xs font-mono">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">Título Principal</label>
                      <textarea
                        rows={2}
                        value={wizardState.title}
                        onChange={(e) => updateWizard({ title: e.target.value })}
                        placeholder="Escribe el titular impactante..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-none resize-none font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">Subtítulo Descriptivo</label>
                      <textarea
                        rows={2}
                        value={wizardState.subtitle}
                        onChange={(e) => updateWizard({ subtitle: e.target.value })}
                        placeholder="Explicación concisa de valor..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-none resize-none font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-300 font-semibold">Tipo de Módulo Central</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {modules.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => updateWizard({ activeModule: m.id })}
                            className={`p-2 rounded-lg border text-center transition ${
                              wizardState.activeModule === m.id
                                ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Buscador de Plantillas */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        placeholder="Buscar por tecnología, cloud, métricas o palabras clave..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 outline-none"
                      />
                    </div>

                    {/* Lista con Scroll de Plantillas */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {filteredTemplates.map((tpl) => (
                        <div
                          key={tpl.id}
                          onClick={() => handleSelectTemplate(tpl)}
                          className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                            selectedTemplateId === tpl.id
                              ? 'bg-indigo-600/20 border-indigo-500'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                                style={{
                                  color: tpl.color,
                                  borderColor: `${tpl.color}40`,
                                  backgroundColor: `${tpl.color}15`,
                                }}
                              >
                                {tpl.category}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 uppercase">
                                {tpl.module}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white truncate">{tpl.title}</h4>
                          </div>

                          <button
                            type="button"
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition shrink-0 ${
                              selectedTemplateId === tpl.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {selectedTemplateId === tpl.id ? 'Seleccionada' : 'Elegir'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* PASO 4: ATMÓSFERA & FONDO */}
            {/* ========================================================================= */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Atmósfera, Tramas Tecnológicas y Luces</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configura el modo visual, la trama de fondo y los efectos de iluminación
                  </p>
                </div>

                {/* Modo Oscuro / Claro */}
                <div className="space-y-1.5 text-xs font-mono">
                  <label className="text-slate-300 font-semibold">Modo Base del Lienzo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateWizard({ canvasMode: 'dark' })}
                      className={`p-2.5 rounded-xl border font-semibold transition ${
                        wizardState.canvasMode === 'dark'
                          ? 'bg-slate-950 border-indigo-500 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      🌙 Modo Oscuro (Recomendado)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateWizard({ canvasMode: 'light' })}
                      className={`p-2.5 rounded-xl border font-semibold transition ${
                        wizardState.canvasMode === 'light'
                          ? 'bg-slate-900 border-amber-500 text-white shadow-lg'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      ☀️ Modo Claro
                    </button>
                  </div>
                </div>

                {/* Tramas Tecnológicas */}
                <div className="space-y-2 text-xs font-mono">
                  <label className="text-slate-300 font-semibold">Trama de Fondo</label>
                  <div className="grid grid-cols-5 gap-2">
                    {patterns.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => updateWizard({ bgPattern: p })}
                        className={`p-2 rounded-xl border text-center transition capitalize text-[11px] ${
                          wizardState.bgPattern === p
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacidad e Iluminación */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-slate-300">
                      <span>Opacidad de Trama</span>
                      <span className="text-indigo-400 font-bold">{wizardState.patternOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={70}
                      value={wizardState.patternOpacity}
                      onChange={(e) => updateWizard({ patternOpacity: parseInt(e.target.value, 10) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Iluminación Ambiental</label>
                    <select
                      value={wizardState.lightType}
                      onChange={(e) => updateWizard({ lightType: e.target.value as LightType })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-none"
                    >
                      <option value="glow">Glow Suave</option>
                      <option value="spotlight">Spotlight Esquina</option>
                      <option value="aurora">Aurora Boreal</option>
                      <option value="dual-beams">Haces Dobles</option>
                      <option value="none">Sin Iluminación</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PASO 5: CONFIRMACIÓN Y RESUMEN */}
            {/* ========================================================================= */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Resumen y Confirmación Final</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Revisa las configuraciones elegidas antes de transferirlas al editor
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Empresa / Marca:</span>
                    <span className="text-white font-bold">{wizardState.companyName} ({wizardState.handle})</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Color Primario:</span>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: wizardState.currentColor }} />
                      <span className="text-white font-bold">{wizardState.currentColor}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Fuentes Seleccionadas:</span>
                    <span className="text-white font-bold">{wizardState.titleFont.replace('font-', '')} / {wizardState.subtitleFont.replace('font-', '')}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Módulo Central:</span>
                    <span className="text-emerald-400 font-bold uppercase">{wizardState.activeModule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Fondo & Trama:</span>
                    <span className="text-indigo-300 font-bold capitalize">{wizardState.canvasMode} • {wizardState.bgPattern}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300">
                    Todo está listo. Al confirmar, ingresaremos directamente al <strong>Editor Ultra HQ 1080p</strong> con tu diseño completamente ensamblado.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* COLUMNA DERECHA: PREVISUALIZACIÓN REAL EN TIEMPO REAL (5 cols) */}
          <div className="lg:col-span-5 p-4 bg-slate-950/60 flex flex-col items-center justify-center border-l border-slate-800/80">
            <RealCanvasPreview state={wizardState} maxHeight={490} />
          </div>

        </div>

        {/* PIE DEL MODAL CON BOTONES DE NAVEGACIÓN */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((currentStep - 1) as any)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Paso Anterior</span>
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep + 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/25"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onConfirmAndOpenEditor(wizardState)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/25 animate-pulse"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Abrir en el Editor Ultra HQ ➔</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
