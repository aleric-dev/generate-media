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
import { BRAND_ICONS } from '../constants/brandIcons';
import { FONT_OPTIONS } from '../constants/fonts';
import { getSavedBrands, saveBrand, getDefaultBrand, deleteBrand } from '../utils/brandStorage';
import { BrandingPreview } from './WizardPreviews/BrandingPreview';
import { TypographyPreview } from './WizardPreviews/TypographyPreview';
import { ContentPreview } from './WizardPreviews/ContentPreview';
import { BackgroundPreview } from './WizardPreviews/BackgroundPreview';

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
  // Pasos: 1: Branding, 2: Paleta & Fuentes, 3: Contenido, 4: Atmósfera & Fondo
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

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
      brandIcon: brand.brandIcon || 'terminal',
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
      brandIcon: wizardState.brandIcon || 'terminal',
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
      bgPattern: 'grid',
      patternEnabled: true,
      patternScale: 100,
      shapeEnabled: false,
      shapesEnabled: false,
      lightEnabled: true,
      lightsEnabled: true,
      lightType: 'glow',
      lightDirection: 'dual-corners-1',
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

  const patterns: PatternType[] = [
    'grid',
    'grid-dot',
    'dots',
    'excel-grid',
    'git-graph',
    'horizontal-lines',
    'waves',
    'diagonal',
    'blueprint',
    'crosses',
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
                  Paso {currentStep} de 4
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

        {/* INDICADOR DE PASOS SUPERIOR (4 PASOS ESENCIALES) */}
        <div className="px-6 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono shrink-0 overflow-x-auto gap-2">
          {[
            { step: 1, label: '1. Branding', icon: Building2 },
            { step: 2, label: '2. Paleta & Fuentes', icon: Palette },
            { step: 3, label: '3. Contenido & Módulos', icon: FileText },
            { step: 4, label: '4. Atmósfera & Fondo', icon: Layers },
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
                      placeholder="Ej. Mi Marca"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Handle Oficial (@usuario)</label>
                    <input
                      type="text"
                      value={wizardState.handle}
                      onChange={(e) => updateWizard({ handle: e.target.value })}
                      placeholder="Ej. @mimarca"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Composición de Marca (4 Modos Canónicos) */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-semibold">Composición de Marca</label>
                    <span className="text-[10px] text-indigo-400">
                      {(wizardState.headerBrandMode || 'icon-text') === 'icon-text' && 'Ícono + Texto'}
                      {wizardState.headerBrandMode === 'only-text' && 'Solo Texto'}
                      {wizardState.headerBrandMode === 'custom-text' && 'Texto + Logo Personalizado'}
                      {wizardState.headerBrandMode === 'only-custom' && 'Solo Logo Personalizado'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'icon-text' as HeaderBrandMode, label: 'Ícono + Texto' },
                      { id: 'only-text' as HeaderBrandMode, label: 'Solo Texto' },
                      { id: 'custom-text' as HeaderBrandMode, label: 'Texto + Logo' },
                      { id: 'only-custom' as HeaderBrandMode, label: 'Solo Logo' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => updateWizard({ 
                          headerBrandMode: m.id,
                          headerShowLogo: m.id !== 'only-text',
                          logoType: (m.id === 'custom-text' || m.id === 'only-custom') ? 'custom' : 'generic'
                        })}
                        className={`p-2 rounded-lg border text-center transition text-[11px] ${
                          (wizardState.headerBrandMode || 'icon-text') === m.id
                            ? 'bg-indigo-600/25 border-indigo-500 text-white font-bold shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* 1. Selector de Íconos cuando está en 'icon-text' */}
                  {(wizardState.headerBrandMode || 'icon-text') === 'icon-text' && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Selecciona un Ícono:</span>
                        <span className="text-indigo-400 text-[11px] font-semibold">
                          {BRAND_ICONS.find((i) => i.id === (wizardState.brandIcon || 'terminal'))?.label || 'Terminal'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-32 overflow-y-auto pr-0.5 custom-scrollbar">
                        {BRAND_ICONS.map((iconItem) => {
                          const IconCmp = iconItem.icon;
                          const isSelected = (wizardState.brandIcon || 'terminal') === iconItem.id;
                          return (
                            <button
                              key={iconItem.id}
                              type="button"
                              onClick={() => updateWizard({ brandIcon: iconItem.id })}
                              title={iconItem.label}
                              className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 transition ${
                                isSelected
                                  ? 'bg-indigo-600/25 border-indigo-500 text-indigo-300 shadow-sm'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                              }`}
                            >
                              <IconCmp className="w-3.5 h-3.5" />
                              <span className="text-[8px] font-mono truncate w-full text-center">{iconItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Carga de Logo cuando es 'custom-text' o 'only-custom' */}
                  {(wizardState.headerBrandMode === 'custom-text' || wizardState.headerBrandMode === 'only-custom') && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {wizardState.customLogoUrl ? (
                          <img
                            src={wizardState.customLogoUrl}
                            alt="Logo"
                            className="w-8 h-8 rounded-lg object-contain border border-slate-700 bg-slate-900"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500">
                            <Upload className="w-4 h-4" />
                          </div>
                        )}
                        <span className="text-slate-400 text-[11px]">
                          {wizardState.customLogoUrl ? 'Logo personalizado cargado' : 'Selecciona un archivo PNG, SVG o JPG'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {wizardState.customLogoUrl && (
                          <button
                            type="button"
                            onClick={() => updateWizard({ customLogoUrl: null })}
                            className="px-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-mono transition"
                          >
                            Quitar
                          </button>
                        )}
                        <label className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] cursor-pointer shadow-sm">
                          <span>{wizardState.customLogoUrl ? 'Cambiar' : 'Cargar Logo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
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

                {/* Fuentes: Título y Subtítulo con Selects idénticos al Editor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Tipografía del Título</label>
                    <select
                      value={wizardState.titleFont}
                      onChange={(e) => updateWizard({ titleFont: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 outline-none transition"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label} ({f.desc})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Tipografía del Subtítulo</label>
                    <select
                      value={wizardState.subtitleFont}
                      onChange={(e) => updateWizard({ subtitleFont: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 outline-none transition"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label} ({f.desc})
                        </option>
                      ))}
                    </select>
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
                    {patterns.map((p) => {
                      const labels: Record<string, string> = {
                        'grid': 'Cuadrícula',
                        'grid-dot': 'Grid + Punto',
                        'dots': 'Puntos',
                        'excel-grid': 'Celdas Excel',
                        'git-graph': 'Ramas Git',
                        'horizontal-lines': 'Renglones',
                        'waves': 'Ondas',
                        'diagonal': 'Diagonal',
                        'blueprint': 'Blueprint',
                        'crosses': 'Cruces',
                      };
                      return (
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
                          {labels[p] || p}
                        </button>
                      );
                    })}
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

          </div>

          {/* COLUMNA DERECHA: PREVISUALIZACIÓN AISLADA FOCALIZADA POR PASO (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-slate-950/60 flex flex-col items-center justify-center border-l border-slate-800/80 min-h-[380px]">
            {currentStep === 1 && (
              <BrandingPreview
                companyName={wizardState.companyName}
                handle={wizardState.handle}
                logoType={wizardState.logoType}
                brandIcon={wizardState.brandIcon}
                customLogoUrl={wizardState.customLogoUrl}
                headerBrandMode={wizardState.headerBrandMode}
                currentColor={wizardState.currentColor}
                onLogoUpload={handleLogoUpload}
              />
            )}

            {currentStep === 2 && (
              <TypographyPreview
                currentColor={wizardState.currentColor}
                titleFont={wizardState.titleFont}
                subtitleFont={wizardState.subtitleFont}
                sampleTitle={wizardState.title}
                sampleSubtitle={wizardState.subtitle}
                onTitleFontChange={(font) => updateWizard({ titleFont: font })}
                onSubtitleFontChange={(font) => updateWizard({ subtitleFont: font })}
              />
            )}

            {currentStep === 3 && (
              <ContentPreview
                title={wizardState.title}
                subtitle={wizardState.subtitle}
                activeModule={wizardState.activeModule}
                currentColor={wizardState.currentColor}
                titleFont={wizardState.titleFont}
              />
            )}

            {currentStep === 4 && (
              <BackgroundPreview
                canvasMode={wizardState.canvasMode}
                bgPattern={wizardState.bgPattern}
                patternOpacity={wizardState.patternOpacity}
                patternVignette={wizardState.patternVignette}
                lightType={wizardState.lightType}
                currentColor={wizardState.currentColor}
              />
            )}
          </div>

        </div>

        {/* PIE DEL MODAL CON BOTONES DE NAVEGACIÓN */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Paso Anterior</span>
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onConfirmAndOpenEditor(wizardState)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/25 cursor-pointer"
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
