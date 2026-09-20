import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Trash2,
  Building2,
  FolderPlus,
  FolderArchive,
  Globe,
  AlertTriangle,
  Folder,
  ArrowRight,
} from 'lucide-react';
import { PostState } from '../types';
import {
  saveProject,
  getSavedProjects,
  deleteProject,
  SavedProject,
  MAX_SAVED_PROJECTS,
} from '../utils/customPresetsStorage';
import { saveBrand } from '../utils/brandStorage';

interface SaveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PostState;
  onLoadPreset: (savedState: PostState) => void;
  onUpdateState?: (partial: Partial<PostState>) => void;
}

export const SaveConfigModal: React.FC<SaveConfigModalProps> = ({
  isOpen,
  onClose,
  state,
  onLoadPreset,
  onUpdateState,
}) => {
  const [activeTab, setActiveTab] = useState<'project' | 'my-projects' | 'brand' | 'json'>('project');
  const [projectName, setProjectName] = useState('');
  const [brandName, setBrandName] = useState(state.companyName || 'Mi Marca');
  const [brandHandle, setBrandHandle] = useState(state.handle || 'tumarca.dev');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  
  // Estado para la ventana de confirmación de eliminación
  const [projectToDelete, setProjectToDelete] = useState<SavedProject | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getSavedProjects();
      setSavedProjects(current);
      
      const defaultProjectTitle = state.title 
        ? (state.title.length > 35 ? `${state.title.slice(0, 35)}...` : state.title)
        : `Proyecto ${state.category || 'Editorial'} - ${new Date().toLocaleDateString('es-ES')}`;

      setProjectName(defaultProjectTitle);
      setBrandName(state.companyName || 'Mi Marca');
      setBrandHandle(state.handle || 'tumarca.dev');
      setSavedSuccess(null);
      setProjectToDelete(null);
    }
  }, [isOpen, state]);

  if (!isOpen) return null;

  const isLimitReached = savedProjects.length >= MAX_SAVED_PROJECTS;

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    if (isLimitReached) {
      setSavedSuccess(`⚠️ Límite de ${MAX_SAVED_PROJECTS} proyectos alcanzado. Elimina uno en "Mis Proyectos" para continuar.`);
      return;
    }

    const res = saveProject(projectName, state);
    if (!res.success || !res.project) {
      setSavedSuccess(`❌ ${res.error || 'No se pudo guardar el proyecto.'}`);
      return;
    }

    const updated = getSavedProjects();
    setSavedProjects(updated);
    setSavedSuccess(`¡Proyecto "${res.project.name}" guardado con éxito!`);
    
    // Cambiar a la pestaña de proyectos para que el usuario lo vea
    setTimeout(() => {
      setActiveTab('my-projects');
      setSavedSuccess(null);
    }, 900);
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

    // Sincronizar de inmediato con el estado activo del editor
    if (onUpdateState) {
      onUpdateState({
        companyName: trimmedName,
        handle: trimmedHandle,
      });
    }

    setSavedSuccess(`¡Perfil de marca "${trimmedName}" (Web: ${trimmedHandle}) guardado y sincronizado!`);
    setTimeout(() => setSavedSuccess(null), 3500);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    deleteProject(projectToDelete.id);
    const updated = getSavedProjects();
    setSavedProjects(updated);
    setSavedSuccess(`Proyecto "${projectToDelete.name}" eliminado correctamente. Espacio liberado.`);
    setProjectToDelete(null);
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
    a.download = `media-studio-proyecto-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#0B101B] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] relative">
        
        {/* ========================================================================= */}
        {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN DE PROYECTO                           */}
        {/* ========================================================================= */}
        {projectToDelete && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-white mb-1">¿Eliminar este proyecto?</h4>
                <p className="text-xs text-slate-300 font-medium truncate">
                  "{projectToDelete.name}"
                </p>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Esta acción no se puede deshacer. Se liberará 1 espacio de tus {MAX_SAVED_PROJECTS} proyectos disponibles.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sí, eliminar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Gestión de Proyectos & Marca</h3>
              <p className="text-xs font-mono text-slate-400">
                Guarda tu proyecto completo (máx. 5), perfil corporativo o exporta en JSON
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

        {/* Tabs */}
        <div className="grid grid-cols-4 p-2 bg-slate-900/60 border-b border-slate-800 text-xs font-mono gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('project')}
            className={`py-2 px-1.5 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold text-[11px] ${
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
            onClick={() => setActiveTab('my-projects')}
            className={`py-2 px-1.5 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold text-[11px] ${
              activeTab === 'my-projects'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Mis Proyectos ({savedProjects.length}/{MAX_SAVED_PROJECTS})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`py-2 px-1.5 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold text-[11px] ${
              activeTab === 'brand'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Marca</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`py-2 px-1.5 rounded-lg flex items-center justify-center gap-1.5 transition font-semibold text-[11px] ${
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
          {/* 1. GUARDAR PROYECTO (MÁXIMO 5)                                            */}
          {/* ========================================================================= */}
          {activeTab === 'project' && (
            <form onSubmit={handleSaveProject} className="space-y-4">
              
              {/* Indicador visual de slots de almacenamiento */}
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

              {/* Advertencia si se alcanzó el límite */}
              {isLimitReached ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Límite de {MAX_SAVED_PROJECTS} proyectos alcanzado</p>
                    <p className="text-[11px] text-amber-300/80">
                      Ya tienes 5 proyectos guardados. Para guardar este diseño como un nuevo proyecto, ve a la pestaña "Mis Proyectos" y elimina uno que ya no utilices.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('my-projects')}
                      className="text-white underline font-bold mt-1 inline-flex items-center gap-1 hover:text-amber-200"
                    >
                      Ir a Mis Proyectos para liberar espacio <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                  <span>Nombre del Proyecto</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Se guarda con todos los módulos y estilos
                  </span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Ej: Lanzamiento SaaS B2B v2"
                  disabled={isLimitReached}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-sans focus:outline-none focus:border-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <p className="text-[11px] font-mono text-slate-500 leading-relaxed">
                  Al guardarse como <strong>proyecto</strong>, almacena la totalidad del lienzo (módulo activo, textos, colores, tipografías, fondo, luces, cabecera y footer) para que al volver a abrirlo se cargue <strong>exactamente igual</strong>.
                </p>
              </div>

              {/* Resumen del Proyecto a Guardar */}
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
                  <span>Empresa / Marca:</span>
                  <span className="text-slate-200">{state.companyName || 'Sin definir'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Web en Footer:</span>
                  <span className="text-slate-200">{state.handle || 'tumarca.dev'}</span>
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
                disabled={isLimitReached}
                className={`w-full py-3 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                  isLimitReached
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                <FolderPlus className="w-4 h-4" />
                <span>
                  {isLimitReached
                    ? `Límite de ${MAX_SAVED_PROJECTS} Proyectos Alcanzado`
                    : `Guardar como Proyecto (${savedProjects.length}/${MAX_SAVED_PROJECTS})`}
                </span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 2. MIS PROYECTOS GUARDADOS (MÁXIMO 5 CON CONFIRMACIÓN AL ELIMINAR)        */}
          {/* ========================================================================= */}
          {activeTab === 'my-projects' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                <span className="text-xs font-mono text-slate-400">
                  Proyectos en este navegador ({savedProjects.length}/{MAX_SAVED_PROJECTS}):
                </span>
                <span className="text-[10px] font-mono text-indigo-400">
                  {MAX_SAVED_PROJECTS - savedProjects.length} espacios libres
                </span>
              </div>

              {savedProjects.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-slate-500 space-y-2">
                  <FolderArchive className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Aún no tienes proyectos guardados en este navegador.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('project')}
                    className="text-indigo-400 hover:text-indigo-300 underline font-bold"
                  >
                    Guarda tu proyecto actual aquí
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: project.postState?.currentColor || '#4F46E5' }}
                          />
                          <p className="text-xs font-bold text-white truncate">{project.name}</p>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 truncate">
                          {new Date(project.createdAt).toLocaleDateString('es-ES')} • {project.postState?.aspectRatio || '4:5'} • Módulo: {project.postState?.activeModule || 'code'} • {project.postState?.companyName || 'Marca'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            // Carga profunda idéntica del proyecto
                            onLoadPreset(JSON.parse(JSON.stringify(project.postState)));
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-mono font-semibold transition flex items-center gap-1"
                          title="Abrir este proyecto en el editor"
                        >
                          <span>Abrir</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Eliminar proyecto permanentemente"
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

          {/* ========================================================================= */}
          {/* 3. GUARDAR PERFIL DE MARCA (NOMBRE Y WEB DEL FOOTER)                      */}
          {/* ========================================================================= */}
          {activeTab === 'brand' && (
            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 font-mono">
                Guarda tu identidad de marca para que el <strong>Nombre de la Empresa</strong> y la <strong>Web del Footer</strong> se apliquen por defecto en nuevos posts.
              </div>

              {/* 1. Nombre de la Empresa o Marca */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Nombre de la Empresa o Marca:</span>
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ej: Aleric Dev"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-sans focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              {/* 2. Web o Red Social que va en el Footer */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sitio Web / Enlace (lo que va en el Footer):</span>
                </label>
                <input
                  type="text"
                  value={brandHandle}
                  onChange={(e) => setBrandHandle(e.target.value)}
                  placeholder="Ej: aleric.dev o @alericdev"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-sans focus:outline-none focus:border-indigo-500 transition"
                  required
                />
                <p className="text-[11px] font-mono text-slate-500">
                  Esta web o handle aparecerá en el pie de página (footer) de tus posts.
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
                  <span>Formato Marco Header:</span>
                  <span className="text-slate-200">{state.headerShape || 'line'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Formato Marco Footer:</span>
                  <span className="text-slate-200">{state.footerShape || 'line'}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20"
              >
                <Building2 className="w-4 h-4" />
                <span>Guardar y Establecer como Marca Predeterminada</span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 4. JSON EXPORT / COPY                                                     */}
          {/* ========================================================================= */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Configuración completa del proyecto en JSON:</span>
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

