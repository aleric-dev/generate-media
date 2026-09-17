import React, { useState, useEffect } from 'react';
import { X, BookmarkCheck, Copy, Check, Download, Trash2, Sparkles, Building2, Layers } from 'lucide-react';
import { PostState } from '../types';
import { saveCustomPreset, getSavedCustomPresets, deleteCustomPreset, SavedCustomPreset } from '../utils/customPresetsStorage';
import { saveBrand } from '../utils/brandStorage';

interface SaveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PostState;
  onLoadPreset: (savedState: PostState) => void;
}

export const SaveConfigModal: React.FC<SaveConfigModalProps> = ({
  isOpen,
  onClose,
  state,
  onLoadPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'brand' | 'json' | 'my-designs'>('preset');
  const [presetName, setPresetName] = useState('');
  const [brandName, setBrandName] = useState(state.companyName || 'Mi Marca');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [savedPresets, setSavedPresets] = useState<SavedCustomPreset[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSavedPresets(getSavedCustomPresets());
      setPresetName(`Diseño ${state.category || 'Editorial'} - ${new Date().toLocaleDateString('es-ES')}`);
      setBrandName(state.companyName || 'Mi Marca');
      setSavedSuccess(null);
    }
  }, [isOpen, state]);

  if (!isOpen) return null;

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) return;
    const newPreset = saveCustomPreset(presetName, state);
    setSavedPresets(getSavedCustomPresets());
    setSavedSuccess(`¡Plantilla "${newPreset.name}" guardada con éxito!`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    saveBrand({
      name: brandName,
      companyName: brandName,
      handle: state.handle || 'tumarca.dev',
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
    setSavedSuccess(`¡Marca "${brandName}" guardada y establecida como predeterminada!`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const jsonString = JSON.stringify(state, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media-studio-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeletePreset = (id: string) => {
    deleteCustomPreset(id);
    setSavedPresets(getSavedCustomPresets());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#0B101B] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Guardar Configuración</h3>
              <p className="text-xs font-mono text-slate-400">Guarda como plantilla, perfil de marca o exporta en JSON</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {savedSuccess && (
          <div className="px-6 py-2.5 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{savedSuccess}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="grid grid-cols-4 p-2 bg-slate-900/60 border-b border-slate-800 text-xs font-mono gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold ${
              activeTab === 'preset'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plantilla</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my-designs')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold ${
              activeTab === 'my-designs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mis Diseños ({savedPresets.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold ${
              activeTab === 'brand'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Marca</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold ${
              activeTab === 'json'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 1. Guardar Plantilla */}
          {activeTab === 'preset' && (
            <form onSubmit={handleSavePreset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Nombre de la Plantilla Personalizada
                </label>
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Ej: Lanzamiento SaaS B2B v2"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-sans focus:outline-none focus:border-indigo-500 transition"
                  required
                />
                <p className="text-[11px] font-mono text-slate-500">
                  Se guardará en el navegador con todos los textos, módulos, colores, luces y formas configurados actualmente.
                </p>
              </div>

              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Módulo Activo:</span>
                  <span className="text-indigo-300 font-bold uppercase">{state.activeModule}</span>
                </div>
                <div className="flex justify-between">
                  <span>Formato Aspecto:</span>
                  <span className="text-indigo-300 font-bold">{state.aspectRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Primario:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: state.currentColor }} />
                    <span className="text-slate-200">{state.currentColor}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>Guardar en Mis Plantillas</span>
              </button>
            </form>
          )}

          {/* 2. Mis Diseños Guardados */}
          {activeTab === 'my-designs' && (
            <div className="space-y-3">
              {savedPresets.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-slate-500 space-y-2">
                  <Layers className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Aún no tienes diseños guardados en este navegador.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preset')}
                    className="text-indigo-400 hover:text-indigo-300 underline font-bold"
                  >
                    Guarda tu primer diseño aquí
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{preset.name}</p>
                        <p className="text-[10px] font-mono text-slate-500">
                          {new Date(preset.createdAt).toLocaleDateString('es-ES')} • {preset.postState.aspectRatio} • {preset.postState.activeModule}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onLoadPreset(preset.postState);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-mono font-semibold transition"
                        >
                          Cargar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Eliminar diseño"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Guardar Perfil de Marca */}
          {activeTab === 'brand' && (
            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Nombre de la Empresa o Marca
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ej: Aleric Dev"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-sans focus:outline-none focus:border-indigo-500 transition"
                  required
                />
                <p className="text-[11px] font-mono text-slate-500">
                  Guarda la paleta de colores, tipografías y enlaces corporativos para reutilizarlos automáticamente en nuevos posts.
                </p>
              </div>

              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Handle / Web:</span>
                  <span className="text-indigo-300 font-bold">{state.handle || 'tumarca.dev'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipografía Título:</span>
                  <span className="text-slate-200">{state.titleFont || 'font-inter'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Primario:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: state.currentColor }} />
                    <span className="text-slate-200">{state.currentColor}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20"
              >
                <Building2 className="w-4 h-4" />
                <span>Guardar Perfil de Marca</span>
              </button>
            </form>
          )}

          {/* 4. JSON Export / Copy */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Configuración completa en JSON:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-mono flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </button>
                </div>
              </div>

              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-56 overflow-auto leading-relaxed">
                {jsonString}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
