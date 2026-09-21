import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Building2,
  FolderPlus,
  Globe,
  AlertTriangle,
  Folder,
  Save,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { PostState } from '../types';
import {
  saveOrUpdateProject,
  getSavedProjects,
  SavedProject,
  MAX_SAVED_PROJECTS,
  MAX_PROJECT_NAME_LENGTH,
} from '../utils/customPresetsStorage';
import { saveBrand } from '../utils/brandStorage';
import { useStudioStore } from '../store/useStudioStore';
import { Button, Input } from './ui';

interface SaveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PostState;
  currentProjectId?: string | null;
  currentProjectName?: string | null;
  onProjectSaved?: (projectId: string, projectName: string) => void;
  onUpdateState?: (partial: Partial<PostState>) => void;
}

export const SaveConfigModal: React.FC<SaveConfigModalProps> = ({
  isOpen,
  onClose,
  state,
  currentProjectId,
  currentProjectName,
  onProjectSaved,
  onUpdateState,
}) => {
  const showToast = useStudioStore((s) => s.showToast);
  const [activeTab, setActiveTab] = useState<'project' | 'brand' | 'json'>('project');
  const [projectName, setProjectName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brandHandle, setBrandHandle] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    if (isOpen) {
      const current = getSavedProjects();
      setSavedProjects(current);

      // Si ya hay un proyecto activo en el editor, usar su nombre
      if (currentProjectName) {
        setProjectName(currentProjectName);
      } else {
        const defaultProjectTitle = state.title 
          ? (state.title.length > 35 ? `${state.title.slice(0, 35)}...` : state.title)
          : `Proyecto ${state.category || 'Editorial'} - ${new Date().toLocaleDateString('es-ES')}`;
        setProjectName(defaultProjectTitle);
      }

      setBrandName(state.companyName || 'Mi Marca');
      setBrandHandle(state.handle || 'tumarca.dev');
      setSavedSuccess(null);
    }
  }, [isOpen, state, currentProjectId, currentProjectName]);

  if (!isOpen) return null;

  const existingProject = currentProjectId 
    ? savedProjects.find((p) => p.id === currentProjectId) 
    : null;
  const isExisting = !!existingProject;
  const isLimitReached = !isExisting && savedProjects.length >= MAX_SAVED_PROJECTS;

  // Guardar (actualizar si existe, o crear nuevo si no existe)
  const handleSave = (asCopy = false) => {
    const cleanName = projectName.trim().slice(0, MAX_PROJECT_NAME_LENGTH);
    if (!cleanName) return;

    const targetId = asCopy ? null : currentProjectId;

    if (!targetId && savedProjects.length >= MAX_SAVED_PROJECTS) {
      showToast(`⚠️ Límite de ${MAX_SAVED_PROJECTS} proyectos alcanzado.`, 'error');
      setSavedSuccess(`⚠️ Límite de ${MAX_SAVED_PROJECTS} proyectos alcanzado. Gestiona tus proyectos en el inicio para liberar espacio.`);
      return;
    }

    const res = saveOrUpdateProject(cleanName, state, targetId);
    if (!res.success || !res.project) {
      showToast(res.error || 'No se pudo guardar el proyecto.', 'error');
      setSavedSuccess(`❌ ${res.error || 'No se pudo guardar el proyecto.'}`);
      return;
    }

    const updated = getSavedProjects();
    setSavedProjects(updated);

    if (onProjectSaved) {
      onProjectSaved(res.project.id, res.project.name);
    }

    showToast(
      asCopy
        ? `¡Copia de "${res.project.name}" guardada!`
        : res.isUpdate
        ? `¡Cambios guardados en "${res.project.name}"!`
        : `¡Proyecto "${res.project.name}" guardado con éxito!`,
      'success'
    );

    onClose();
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    const trimmedName = brandName.trim();
    const trimmedHandle = brandHandle.trim() || 'tumarca.dev';

    saveBrand({
      name: trimmedName,
      companyName: trimmedName,
      handle: trimmedHandle,
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

    if (onUpdateState) {
      onUpdateState({
        companyName: trimmedName,
        handle: trimmedHandle,
      });
    }

    showToast(`¡Perfil de marca "${trimmedName}" guardado y sincronizado!`, 'success');
    setSavedSuccess(`¡Perfil de marca "${trimmedName}" (Web: ${trimmedHandle}) guardado y sincronizado!`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const jsonString = JSON.stringify(state, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    showToast('¡Configuración JSON copiada al portapapeles!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media-studio-proyecto-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('¡Archivo JSON del proyecto descargado!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#0B101B] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isExisting ? 'Guardar Cambios del Proyecto' : 'Guardar Proyecto'}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                {isExisting
                  ? `Actualizando "${currentProjectName || projectName}"`
                  : `Guarda tu proyecto (máx. ${MAX_SAVED_PROJECTS}) o perfil de marca`}
              </p>
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
          <div className="px-6 py-2.5 bg-indigo-500/10 border-b border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{savedSuccess}</span>
          </div>
        )}

        {/* Tabs (3 Pestañas Claras) */}
        <div className="grid grid-cols-3 p-2 bg-slate-900/60 border-b border-slate-800 text-xs font-mono gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('project')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold text-xs ${
              activeTab === 'project'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Guardar Proyecto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold text-xs ${
              activeTab === 'brand'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Marca & Footer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold text-xs ${
              activeTab === 'json'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Copy className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">JSON</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* ========================================================================= */}
          {/* 1. GUARDAR PROYECTO                                                       */}
          {/* ========================================================================= */}
          {activeTab === 'project' && (
            <div className="space-y-4">
              
              {/* Badge informativo de proyecto existente */}
              {isExisting ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-emerald-300 font-bold block">Proyecto Detectado</span>
                      <span className="text-[11px] text-slate-400">
                        Al guardar, se conservarán los cambios en este mismo proyecto sin consumir espacios adicionales.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Indicador de capacidad para proyectos nuevos */
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-mono text-slate-300">
                      Capacidad de Proyectos:
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {[...Array(MAX_SAVED_PROJECTS)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-3.5 h-2 rounded-sm transition-colors ${
                          i < savedProjects.length
                            ? 'bg-indigo-500 shadow-xs shadow-indigo-500/40'
                            : 'bg-slate-800 border border-slate-700'
                        }`}
                        title={i < savedProjects.length ? `Espacio ${i + 1} ocupado` : `Espacio ${i + 1} disponible`}
                      />
                    ))}
                    <span className="text-[11px] font-mono font-bold text-indigo-400 ml-1.5">
                      {savedProjects.length}/{MAX_SAVED_PROJECTS}
                    </span>
                  </div>
                </div>
              )}

              {/* Advertencia si es nuevo y se alcanzó el límite */}
              {isLimitReached && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Límite de {MAX_SAVED_PROJECTS} proyectos alcanzado</p>
                    <p className="text-[11px] text-amber-300/80">
                      Tienes los 5 proyectos llenos. Para guardar este diseño como un proyecto nuevo, elimina uno desde la pantalla de inicio.
                    </p>
                  </div>
                </div>
              )}

              {/* Nombre del Proyecto con límite estricto de 25 caracteres */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                  <span>Nombre del Proyecto</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    <span className={projectName.length >= MAX_PROJECT_NAME_LENGTH ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {projectName.length}
                    </span>
                    /{MAX_PROJECT_NAME_LENGTH} caracteres
                  </span>
                </label>
                <Input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.slice(0, MAX_PROJECT_NAME_LENGTH))}
                  maxLength={MAX_PROJECT_NAME_LENGTH}
                  placeholder="Ej: Lanzamiento SaaS v2"
                  disabled={isLimitReached}
                  required
                />
              </div>

              {/* Resumen del Proyecto a Guardar */}
              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Módulo Activo:</span>
                  <span className="text-indigo-300 font-bold uppercase">{state.activeModule}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aspect Ratio:</span>
                  <span className="text-indigo-300 font-bold">{state.aspectRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span>Empresa / Marca:</span>
                  <span className="text-slate-200">{state.companyName || 'Sin definir'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Web en Footer:</span>
                  <span className="text-slate-200">{state.handle || 'tumarca.dev'}</span>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="space-y-2 pt-1">
                {isExisting ? (
                  <>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={() => handleSave(false)}
                      className="w-full"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Proyecto</span>
                    </Button>

                    {savedProjects.length < MAX_SAVED_PROJECTS && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => handleSave(true)}
                        className="w-full"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Guardar como Copia Nueva ({savedProjects.length + 1}/{MAX_SAVED_PROJECTS})</span>
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    type="button"
                    variant={isLimitReached ? 'secondary' : 'primary'}
                    size="lg"
                    onClick={() => handleSave(false)}
                    disabled={isLimitReached}
                    className="w-full"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>
                      {isLimitReached
                        ? `Límite de ${MAX_SAVED_PROJECTS} Proyectos Alcanzado`
                        : `Guardar Proyecto (${savedProjects.length}/${MAX_SAVED_PROJECTS})`}
                    </span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. GUARDAR PERFIL DE MARCA (NOMBRE Y WEB DEL FOOTER)                      */}
          {/* ========================================================================= */}
          {activeTab === 'brand' && (
            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 font-mono">
                Guarda tu identidad de marca para que el <strong>Nombre de la Empresa</strong> y la <strong>Web del Footer</strong> se apliquen automáticamente en tus posts.
              </div>

              {/* 1. Nombre de la Empresa o Marca */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Nombre de la Empresa o Marca:</span>
                </label>
                <Input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ej: Aleric Dev"
                  required
                />
              </div>

              {/* 2. Web o Red Social que va en el Footer */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sitio Web / Enlace (lo que va en el Footer):</span>
                </label>
                <Input
                  type="text"
                  value={brandHandle}
                  onChange={(e) => setBrandHandle(e.target.value)}
                  placeholder="Ej: aleric.dev o @alericdev"
                  required
                />
                <p className="text-[11px] font-mono text-slate-500">
                  Esta web o handle aparecerá en el pie de página (footer) de tus publicaciones.
                </p>
              </div>

              {/* Resumen del perfil visual asociado */}
              <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Color Primario:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: state.currentColor }} />
                    <span className="text-slate-200">{state.currentColor}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Tipografía Título:</span>
                  <span className="text-slate-200">{state.titleFont || 'font-inter'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Marco Cabecera:</span>
                  <span className="text-slate-200">{state.headerShape || 'line'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Marco Footer:</span>
                  <span className="text-slate-200">{state.footerShape || 'line'}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                <Building2 className="w-4 h-4" />
                <span>Guardar Perfil de Marca</span>
              </Button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 3. JSON EXPORT / COPY                                                     */}
          {/* ========================================================================= */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Configuración completa del proyecto en JSON:</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyJson}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadJson}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </Button>
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


