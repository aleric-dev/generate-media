import React, { useState } from 'react';
import { 
  PostState, 
  HeaderShape, 
  FooterShape, 
  BadgeStyle, 
  HeaderBrandMode, 
  LogoAspectRatio,
  BrandProfile
} from '../../types';
import { 
  Palette, 
  Sun, 
  Moon, 
  Heading, 
  Footprints, 
  Upload, 
  X, 
  Pipette, 
  AlignLeft, 
  AlignCenter, 
  Sparkles, 
  Layers, 
  Sliders, 
  Check,
  Building2,
  Plus,
  Pencil,
  Trash2,
  Globe,
  AlertCircle,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { BRAND_ICONS } from '../../constants/brandIcons';
import { AccordionSection } from './AccordionSection';
import { 
  getSavedBrands, 
  saveBrandWithValidation, 
  updateBrand,
  deleteBrand, 
  findBrandByName 
} from '../../utils/brandStorage';
import { useStudioStore } from '../../store/useStudioStore';

interface BrandPanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

// 6 Estilos visuales de Badge organizados en 2 filas de 3
const BADGE_STYLE_OPTIONS: Array<{ id: BadgeStyle; label: string }> = [
  { id: 'pill', label: 'Pastilla' },
  { id: 'bracket', label: '[ Bracket ]' },
  { id: 'neon', label: 'Neón Glow' },
  { id: 'glass', label: 'Glass' },
  { id: 'minimal-dot', label: '• Minimal' },
  { id: 'outline', label: 'Contorno' },
];

// 8 Opciones de Formato de Marco con solo nombre y estado activo limpio (sin previsualización)
const FRAME_SHAPE_OPTIONS: Array<{ id: HeaderShape; label: string }> = [
  { id: 'line', label: 'Línea Divisoria' },
  { id: 'accent-bar', label: 'Barra Acento' },
  { id: 'pill', label: 'Cápsula Glass' },
  { id: 'card', label: 'Tarjeta Vidriada' },
  { id: 'floating-dock', label: 'Dock 3D' },
  { id: 'bracket-frame', label: '[ Brackets ]' },
  { id: 'neon-glow', label: 'Resplandor Neón' },
  { id: 'minimal', label: 'Minimalista' },
];

export const BrandPanel: React.FC<BrandPanelProps> = ({
  state,
  updateState
}) => {
  const [activeSection, setActiveSection] = useState<string | null>('brand-profile');

  const toggleSection = (key: string) => {
    setActiveSection((prev) => (prev === key ? null : key));
  };

  const activeBrandId = useStudioStore((s) => s.activeBrandId);
  const setActiveBrandId = useStudioStore((s) => s.setActiveBrandId);
  const applyBrandProfile = useStudioStore((s) => s.applyBrandProfile);
  const showToast = useStudioStore((s) => s.showToast);

  const [savedBrands, setSavedBrands] = useState<BrandProfile[]>(() => getSavedBrands());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandProfile | null>(null);
  const [brandFormName, setBrandFormName] = useState('');
  const [brandFormHandle, setBrandFormHandle] = useState('');
  const [brandFormColor, setBrandFormColor] = useState('');
  const [syncWithEditorStyles, setSyncWithEditorStyles] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const refreshBrands = () => {
    setSavedBrands(getSavedBrands());
  };

  const duplicateBrand = React.useMemo(() => {
    if (!brandFormName.trim()) return null;
    return findBrandByName(brandFormName.trim(), editingBrand ? editingBrand.id : undefined);
  }, [brandFormName, editingBrand]);

  const activeBrand = savedBrands.find((b) => b.id === activeBrandId) || null;

  const handleSelectBrand = (brand: BrandProfile) => {
    applyBrandProfile(brand);
    showToast(`Marca "${brand.name || brand.companyName}" activada`, 'success');
  };

  const handleOpenCreateForm = () => {
    setEditingBrand(null);
    setBrandFormName('');
    setBrandFormHandle('');
    setBrandFormColor(state.currentColor);
    setSyncWithEditorStyles(true);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (brand: BrandProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBrand(brand);
    setBrandFormName(brand.name || brand.companyName);
    setBrandFormHandle(brand.handle || 'tumarca.dev');
    setBrandFormColor(brand.primaryColor || state.currentColor);
    setSyncWithEditorStyles(false);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingBrand(null);
    setBrandFormName('');
    setBrandFormHandle('');
    setBrandFormColor('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = brandFormName.trim();
    if (!cleanName) {
      showToast('El nombre de la marca es obligatorio.', 'error');
      return;
    }

    if (duplicateBrand) {
      showToast(`Ya existe otra marca con el nombre "${duplicateBrand.name || duplicateBrand.companyName}".`, 'error');
      return;
    }

    if (editingBrand) {
      // 1. MODO EDICIÓN
      const updates: Partial<Omit<BrandProfile, 'id' | 'createdAt'>> = {
        name: cleanName,
        companyName: cleanName,
        handle: brandFormHandle.trim() || 'tumarca.dev',
        primaryColor: brandFormColor || editingBrand.primaryColor,
      };

      if (syncWithEditorStyles) {
        updates.primaryColor = state.currentColor;
        updates.titleFont = state.titleFont;
        updates.subtitleFont = state.subtitleFont;
        updates.brandIcon = state.brandIcon;
        updates.headerBrandMode = state.headerBrandMode;
        updates.headerShape = state.headerShape;
        updates.footerShape = state.footerShape;
        updates.customLogoUrl = state.customLogoUrl;
        updates.logoType = state.logoType;
      }

      const res = updateBrand(editingBrand.id, updates);
      if (!res.success || !res.brand) {
        showToast(res.error || 'No se pudo actualizar la marca.', 'error');
        return;
      }

      // Si la marca modificada es la que está activa actualmente, sincronizar el editor de inmediato
      if (activeBrand?.id === editingBrand.id) {
        applyBrandProfile(res.brand);
      }

      refreshBrands();
      handleCancelForm();
      showToast(`¡Marca "${res.brand.name}" actualizada con éxito!`, 'success');
    } else {
      // 2. MODO CREACIÓN
      const res = saveBrandWithValidation({
        name: cleanName,
        companyName: cleanName,
        handle: brandFormHandle.trim() || 'tumarca.dev',
        logoType: (state.headerBrandMode as any) || 'icon-text',
        primaryColor: state.currentColor || '#4F46E5',
        titleFont: state.titleFont,
        subtitleFont: state.subtitleFont,
        brandIcon: state.brandIcon,
        headerBrandMode: state.headerBrandMode,
        headerShape: state.headerShape,
        footerShape: state.footerShape,
        isDefault: true,
      });

      if (!res.success || !res.brand) {
        showToast(res.error || 'No se pudo guardar la marca.', 'error');
        return;
      }

      applyBrandProfile(res.brand);
      refreshBrands();
      handleCancelForm();
      showToast(`¡Marca "${res.brand.name}" creada y activada con éxito!`, 'success');
    }
  };

  const handleDeleteBrand = (id: string, name: string) => {
    deleteBrand(id);
    setConfirmDeleteId(null);
    const updated = getSavedBrands();
    setSavedBrands(updated);
    if (activeBrandId === id) {
      const nextActiveId = updated[0]?.id || null;
      setActiveBrandId(nextActiveId);
    }
    showToast(`Marca "${name}" eliminada.`, 'info');
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

  return (
    <div className="space-y-3.5">

      {/* ========================================================================= */}
      {/* 1. PERFIL DE MARCA CORPORATIVA (SELECCIÓN, EDICIÓN Y CREACIÓN)           */}
      {/* ========================================================================= */}
      <AccordionSection
        id="brand-profile"
        title="1. Perfil de Marca Corporativa"
        icon={Building2}
        badge={activeBrand?.name || state.companyName || 'Sin Marca'}
        isOpen={activeSection === 'brand-profile'}
        onToggle={() => toggleSection('brand-profile')}
      >
        <div className="space-y-3.5">
          {/* Tarjeta de Marca Activa Actual */}
          {activeBrand ? (
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-4 h-4 rounded-full ring-2 ring-white/20 shrink-0 shadow-sm"
                  style={{ backgroundColor: activeBrand.primaryColor }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">
                      {activeBrand.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      Activa
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono truncate block">
                    @{activeBrand.handle || 'tumarca.dev'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleOpenEditForm(activeBrand, e)}
                  title="Editar datos de esta marca"
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-mono transition flex items-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] hidden sm:inline">Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isFormOpen && !editingBrand) {
                      handleCancelForm();
                    } else {
                      handleOpenCreateForm();
                    }
                  }}
                  className="py-1 px-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white border border-indigo-500/40 text-[11px] font-mono font-semibold flex items-center gap-1 transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isFormOpen && !editingBrand ? 'Cerrar' : 'Nueva'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-3.5 h-3.5 rounded-full bg-slate-700 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-300 block truncate">Sin marca activa</span>
                  <span className="text-[10px] text-slate-500 font-mono truncate block">0 marcas disponibles</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="py-1 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-mono font-semibold flex items-center gap-1 transition shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Crear Marca</span>
              </button>
            </div>
          )}

          {/* Formulario de Creación / Edición de Marca */}
          {isFormOpen && (
            <form onSubmit={handleFormSubmit} className="p-3 bg-slate-950 rounded-2xl border border-indigo-500/40 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {editingBrand ? (
                    <>
                      <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Editar Marca: {editingBrand.name}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Crear Perfil de Marca</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {editingBrand ? 'Actualizar perfil' : 'Guarda estilo actual'}
                </span>
              </div>

              {/* Nombre de la marca */}
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">
                  Nombre de la Empresa o Marca: <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={brandFormName}
                  onChange={(e) => setBrandFormName(e.target.value)}
                  placeholder="ej. Aleric Dev"
                  className={`w-full py-1.5 px-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition ${
                    duplicateBrand
                      ? 'border-amber-500/80 focus:border-amber-400 ring-1 ring-amber-500/30'
                      : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />

                {/* ALERTA DE NOMBRE DUPLICADO */}
                {duplicateBrand && (
                  <div className="mt-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-1.5 text-[11px] text-amber-300 font-mono">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Ya existe otra marca registrada con el nombre exacto <strong>"{duplicateBrand.name}"</strong>. Elige un nombre distinto.
                    </span>
                  </div>
                )}
              </div>

              {/* Handle / Web */}
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">
                  Sitio Web o Handle:
                </label>
                <input
                  type="text"
                  value={brandFormHandle}
                  onChange={(e) => setBrandFormHandle(e.target.value)}
                  placeholder="ej. aleric.dev"
                  className="w-full py-1.5 px-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Opciones adicionales para Edición */}
              {editingBrand && (
                <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300 font-mono">
                    <input
                      type="checkbox"
                      checked={syncWithEditorStyles}
                      onChange={(e) => setSyncWithEditorStyles(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-0"
                    />
                    <span>Sincronizar colores, logo y fuentes del lienzo actual</span>
                  </label>
                </div>
              )}

              {/* Resumen y Botón Guardar */}
              <div className="pt-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: syncWithEditorStyles ? state.currentColor : (brandFormColor || state.currentColor) }}
                  />
                  <span>Color: {syncWithEditorStyles ? state.currentColor : (brandFormColor || state.currentColor)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!brandFormName.trim() || !!duplicateBrand}
                    className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-mono font-semibold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingBrand ? 'Guardar Cambios' : 'Guardar y Activar'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Selector de Marcas Guardadas */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                Marcas Disponibles ({savedBrands.length}):
              </label>
              <span className="text-[10px] text-slate-500 font-mono">1 clic para alternar</span>
            </div>

            {savedBrands.length === 0 ? (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center">
                <p className="text-xs text-slate-400 font-mono">No hay marcas guardadas.</p>
                <p className="text-[10px] text-slate-500 mt-1">Crea tu primera marca arriba para alternar con un solo clic.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                {savedBrands.map((b) => {
                  const isSelected = (activeBrand?.id === b.id) || (state.companyName?.toLowerCase() === b.name?.toLowerCase());
                  const isDeleting = confirmDeleteId === b.id;

                  return (
                    <div
                      key={b.id}
                      onClick={() => !isDeleting && handleSelectBrand(b)}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition text-xs ${
                        isSelected
                          ? 'bg-slate-900/90 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                          : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: b.primaryColor }}
                        />
                        <div className="min-w-0">
                          <span className={`font-semibold block truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {b.name || b.companyName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono truncate block">
                            @{b.handle || 'tumarca.dev'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {isDeleting ? (
                          /* Micro-confirmación de eliminación */
                          <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-500/50 py-0.5 px-1.5 rounded-lg text-[10px] font-mono text-rose-300 animate-fade-in">
                            <span>¿Borrar?</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteBrand(b.id, b.name || b.companyName)}
                              className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition"
                            >
                              Sí
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <>
                            {isSelected ? (
                              <span className="py-0.5 px-2 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Activa
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectBrand(b)}
                                className="py-0.5 px-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[10px] font-mono transition"
                              >
                                Usar
                              </button>
                            )}

                            {/* Botón Editar Marca */}
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditForm(b, e)}
                              title={`Editar marca "${b.name || b.companyName}"`}
                              className="p-1 text-slate-500 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>

                            {/* Botón Eliminar Marca con confirmación */}
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(b.id)}
                              title={`Eliminar marca "${b.name || b.companyName}"`}
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 2. COLOR DE MARCA & MODO BASE                                             */}
      {/* ========================================================================= */}
      <AccordionSection
        id="palette"
        title="2. Color de Marca & Modo Base"
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

          {/* 20 Presets Cromáticos: SWATCHES PUROS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-300 font-semibold">
                Color Principal de Marca (Acento):
              </label>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: state.currentColor }} />
                <span className="text-indigo-400 font-bold">{state.currentColor}</span>
              </div>
            </div>

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
      {/* 3. CABECERA DE MARCA (HEADER)                                             */}
      {/* ========================================================================= */}
      <AccordionSection
        id="header-brand"
        title="3. Cabecera de Marca (Header)"
        icon={Heading}
        badge={`${state.headerShape || 'line'} • ${state.companyName || 'Marca'}`}
        isOpen={activeSection === 'header-brand'}
        onToggle={() => toggleSection('header-brand')}
      >
        <div className="space-y-4">

          {/* 1. EMPRESA O MARCA (CON LOGO O ÍCONO) */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Heading className="w-3.5 h-3.5 text-indigo-400" /> 1. Empresa, Marca & Logotipo
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {state.headerTitleColorMode === 'inherit' ? 'Color Acento' : state.headerTitleColorMode === 'custom' ? (state.headerTitleCustomColor || '#FFFFFF') : 'Contraste'}
              </span>
            </div>

            {/* Selector de Composición */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1.5 font-mono">
                Composición de Cabecera:
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                {[
                  { id: 'icon-text' as HeaderBrandMode, label: 'Ícono + Nombre' },
                  { id: 'only-text' as HeaderBrandMode, label: 'Solo Nombre' },
                  { id: 'custom-text' as HeaderBrandMode, label: 'Nombre + Logo PNG' },
                  { id: 'only-custom' as HeaderBrandMode, label: 'Solo Logo PNG' },
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
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Ícono cuando aplica */}
            {(state.headerBrandMode || 'icon-text') === 'icon-text' && (
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-medium">Ícono de Cabecera:</span>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">
                    {BRAND_ICONS.find((i) => i.id === (state.brandIcon || 'terminal'))?.label || 'Terminal'}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1.5 max-h-32 overflow-y-auto p-1 custom-scrollbar">
                  {BRAND_ICONS.map((iconItem) => {
                    const IconCmp = iconItem.icon;
                    const isSelected = (state.brandIcon || 'terminal') === iconItem.id;
                    return (
                      <button
                        key={iconItem.id}
                        type="button"
                        onClick={() => updateState({ brandIcon: iconItem.id })}
                        title={iconItem.label}
                        className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <IconCmp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Carga de Logo Custom cuando aplica */}
            {(state.headerBrandMode === 'custom-text' || state.headerBrandMode === 'only-custom') && (
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-medium">Subir Logotipo Oficial:</span>
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

            {/* Input de Nombre de Empresa o Marca */}
            <div className="space-y-2">
              <label className="text-[11px] text-slate-300 font-semibold block">
                Nombre de la Empresa o Marca:
              </label>
              <input
                type="text"
                value={state.companyName ?? ''}
                onChange={(e) => updateState({ companyName: e.target.value })}
                placeholder="Ej: Aleric.dev"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
              
              {/* Selector de Color de Nombre */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] font-mono text-slate-400 shrink-0">Color:</span>
                <div className="grid grid-cols-3 gap-1.5 flex-1 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => updateState({ headerTitleColorMode: 'contrast' })}
                    className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                      (state.headerTitleColorMode || 'contrast') === 'contrast'
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white border border-slate-400 shrink-0" />
                    <span>Contraste</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateState({ headerTitleColorMode: 'inherit' })}
                    className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                      state.headerTitleColorMode === 'inherit'
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: state.currentColor }} />
                    <span>Acento</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateState({ headerTitleColorMode: 'custom' })}
                    className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                      state.headerTitleColorMode === 'custom'
                        ? 'bg-indigo-600 text-white font-bold shadow-xs ring-1 ring-indigo-400'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Pipette className="w-3 h-3 shrink-0" />
                    <span>Hex</span>
                  </button>
                </div>
              </div>

              {state.headerTitleColorMode === 'custom' && (
                <div className="p-2 bg-slate-950 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.headerTitleCustomColor || (state.canvasMode === 'light' ? '#0F172A' : '#FFFFFF')}
                      onChange={(e) => updateState({ headerTitleCustomColor: e.target.value })}
                      className="w-6 h-6 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-xs font-mono font-bold text-white">
                      {state.headerTitleCustomColor || (state.canvasMode === 'light' ? '#0F172A' : '#FFFFFF')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Tono personalizado</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. NOMBRE DEL BADGE SUPERIOR (CON 6 ESTILOS EN 2 FILAS DE 3) */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> 2. Badge / Categoría Superior & Estilo
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {(state.headerBadgeColorMode || state.badgeColorMode) === 'contrast' ? 'Contraste' : (state.headerBadgeColorMode || state.badgeColorMode) === 'custom' ? (state.headerBadgeCustomColor || state.badgeCustomColor || state.currentColor) : 'Color Acento'}
              </span>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                Texto del Badge Superior:
              </label>
              <input
                type="text"
                value={state.category ?? ''}
                onChange={(e) => updateState({ category: e.target.value })}
                placeholder="Ej: DESARROLLO A LA MEDIDA"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono uppercase"
              />
            </div>

            {/* 6 Estilos Visuales del Badge en 2 Filas de 3 */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-mono">
                Estilo Visual del Badge (2 filas de 3):
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                {BADGE_STYLE_OPTIONS.map((badge) => {
                  const isSelected = (state.headerBadgeStyle || state.badgeStyle || 'pill') === badge.id;
                  return (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => updateState({ badgeStyle: badge.id, headerBadgeStyle: badge.id })}
                      className={`py-2 px-1.5 rounded-xl text-center transition font-semibold truncate ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {badge.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector de Color de Badge */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[10px] font-mono text-slate-400 shrink-0">Color:</span>
              <div className="grid grid-cols-3 gap-1.5 flex-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => updateState({ badgeColorMode: 'inherit', headerBadgeColorMode: 'inherit' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    (state.headerBadgeColorMode || state.badgeColorMode || 'inherit') === 'inherit'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: state.currentColor }} />
                  <span>Acento</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ badgeColorMode: 'contrast', headerBadgeColorMode: 'contrast' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    (state.headerBadgeColorMode || state.badgeColorMode) === 'contrast'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white border border-slate-400 shrink-0" />
                  <span>Contraste</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ badgeColorMode: 'custom', headerBadgeColorMode: 'custom' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    (state.headerBadgeColorMode || state.badgeColorMode) === 'custom'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs ring-1 ring-indigo-400'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Pipette className="w-3 h-3 shrink-0" />
                  <span>Hex</span>
                </button>
              </div>
            </div>

            {(state.headerBadgeColorMode || state.badgeColorMode) === 'custom' && (
              <div className="p-2 bg-slate-950 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={state.headerBadgeCustomColor || state.badgeCustomColor || state.currentColor}
                    onChange={(e) => updateState({ headerBadgeCustomColor: e.target.value, badgeCustomColor: e.target.value })}
                    className="w-6 h-6 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">
                    {state.headerBadgeCustomColor || state.badgeCustomColor || state.currentColor}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Tono personalizado</span>
              </div>
            )}
          </div>

          {/* 3. TAMAÑO Y ESCALA COORDINADA (PRIMERO QUE EL FORMATO) */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> 3. Escala Coordinada (Texto & Logo)
              </span>
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

          {/* 4. FORMATO DEL MARCO (HEADER SHAPE - SOLO OPCIONES LIMPIAS CON NOMBRE, SIN PREVIEWS) */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> 4. Formato del Marco (Header)
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                {FRAME_SHAPE_OPTIONS.find((s) => s.id === (state.headerShape || 'line'))?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {FRAME_SHAPE_OPTIONS.map((opt) => {
                const isSelected = (state.headerShape || 'line') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateState({ headerShape: opt.id })}
                    className={`py-2.5 px-3 rounded-xl border text-center transition flex items-center justify-between text-xs font-mono font-semibold ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm ring-1 ring-indigo-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </AccordionSection>

      {/* ========================================================================= */}
      {/* 4. PIE DE PÁGINA (FOOTER)                                                 */}
      {/* ========================================================================= */}
      <AccordionSection
        id="footer-brand"
        title="4. Pie de Página (Footer)"
        icon={Footprints}
        badge={`${state.footerShape || 'line'} • ${state.handle || 'Footer'}`}
        isOpen={activeSection === 'footer-brand'}
        onToggle={() => toggleSection('footer-brand')}
      >
        <div className="space-y-4">

          {/* 1. LLAMADO A LA ACCIÓN (CTA & COLOR DEDICADO) */}
          <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> 1. Frase de Remate / CTA
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {state.ctaColorMode === 'inherit' ? 'Color Acento' : state.ctaColorMode === 'custom' ? (state.ctaCustomColor || '#FFFFFF') : 'Contraste'}
              </span>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">
                Texto del CTA:
              </label>
              <input
                type="text"
                value={state.cta ?? ''}
                onChange={(e) => updateState({ cta: e.target.value })}
                placeholder="Ej: Escríbenos y migramos tu operación a la nube."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* Selector de Color de CTA */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[10px] font-mono text-slate-400 shrink-0">Color:</span>
              <div className="grid grid-cols-3 gap-1.5 flex-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => updateState({ ctaColorMode: 'contrast' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    (state.ctaColorMode || 'contrast') === 'contrast'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white border border-slate-400 shrink-0" />
                  <span>Contraste</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ ctaColorMode: 'inherit' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    state.ctaColorMode === 'inherit'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: state.currentColor }} />
                  <span>Acento</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ ctaColorMode: 'custom' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    state.ctaColorMode === 'custom'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs ring-1 ring-indigo-400'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Pipette className="w-3 h-3 shrink-0" />
                  <span>Hex</span>
                </button>
              </div>
            </div>

            {state.ctaColorMode === 'custom' && (
              <div className="p-2 bg-slate-950 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={state.ctaCustomColor || (state.canvasMode === 'light' ? '#0F172A' : '#FFFFFF')}
                    onChange={(e) => updateState({ ctaCustomColor: e.target.value })}
                    className="w-6 h-6 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">
                    {state.ctaCustomColor || (state.canvasMode === 'light' ? '#0F172A' : '#FFFFFF')}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Tono personalizado</span>
              </div>
            )}
          </div>

          {/* 2. IDENTIFICADOR / HANDLE / REDES (CON COLOR DEDICADO) */}
          <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-indigo-400" /> 2. Handle / Sitio Web / Red Social
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {(state.handleColorMode || 'contrast') === 'inherit' ? 'Color Acento' : state.handleColorMode === 'custom' ? (state.handleCustomColor || state.currentColor) : 'Contraste'}
              </span>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1 font-mono">
                Handle o URL:
              </label>
              <input
                type="text"
                value={state.handle ?? ''}
                onChange={(e) => updateState({ handle: e.target.value })}
                placeholder="Ej: tumarca.dev o @tuempresa"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Selector de Color de Handle */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[10px] font-mono text-slate-400 shrink-0">Color:</span>
              <div className="grid grid-cols-3 gap-1.5 flex-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => updateState({ handleColorMode: 'contrast' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    (state.handleColorMode || 'contrast') === 'contrast'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white border border-slate-400 shrink-0" />
                  <span>Contraste</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ handleColorMode: 'inherit' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    state.handleColorMode === 'inherit'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: state.currentColor }} />
                  <span>Acento</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ handleColorMode: 'custom' })}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex items-center justify-center gap-1.5 ${
                    state.handleColorMode === 'custom'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs ring-1 ring-indigo-400'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Pipette className="w-3 h-3 shrink-0" />
                  <span>Hex</span>
                </button>
              </div>
            </div>

            {state.handleColorMode === 'custom' && (
              <div className="p-2 bg-slate-950 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={state.handleCustomColor || state.currentColor}
                    onChange={(e) => updateState({ handleCustomColor: e.target.value })}
                    className="w-6 h-6 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className="text-xs font-mono font-bold text-white">
                    {state.handleCustomColor || state.currentColor}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Tono personalizado</span>
              </div>
            )}
          </div>

          {/* 3. ORDEN Y ALINEACIÓN DEL FOOTER */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
            <span className="text-xs font-bold text-white block border-b border-slate-800/80 pb-1.5 font-mono">
              3. Disposición & Alineación del Footer
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Secuencia:</label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => updateState({ ctaOrder: 'cta-first' })}
                    className={`py-2 px-1 rounded-xl text-center transition text-[11px] ${
                      (state.ctaOrder || 'cta-first') === 'cta-first'
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
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
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Web ➔ CTA
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Alineación:</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => updateState({ ctaAlign: 'left' })}
                    className={`py-2 px-1 rounded-xl flex items-center justify-center transition ${
                      state.ctaAlign === 'left'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
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
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
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
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Extremos (Separados)"
                  >
                    Extremos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. TAMAÑO DE TEXTO DEL FOOTER CON SLIDER (PRIMERO QUE EL FORMATO) */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> 4. Tamaño de Texto del Footer
              </span>
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

          {/* 5. FORMATO DEL MARCO DEL FOOTER (SOLO OPCIONES LIMPIAS CON NOMBRE, SIN PREVIEWS) */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> 5. Formato del Marco (Footer)
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                {FRAME_SHAPE_OPTIONS.find((s) => s.id === (state.footerShape || 'line'))?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {FRAME_SHAPE_OPTIONS.map((opt) => {
                const isSelected = (state.footerShape || 'line') === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateState({ footerShape: opt.id })}
                    className={`py-2.5 px-3 rounded-xl border text-center transition flex items-center justify-between text-xs font-mono font-semibold ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm ring-1 ring-indigo-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </AccordionSection>

    </div>
  );
};
