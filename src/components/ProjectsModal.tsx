import React, { useState } from 'react';
import {
  X,
  FolderArchive,
  Play,
  Trash2,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SavedProject, MAX_SAVED_PROJECTS } from '../utils/customPresetsStorage';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProjects: SavedProject[];
  onOpenProject: (project: SavedProject) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  savedProjects,
  onOpenProject,
  onDeleteProject,
}) => {
  const [projectToDelete, setProjectToDelete] = useState<SavedProject | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (projectToDelete) {
          setProjectToDelete(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, projectToDelete, onClose]);

  if (!isOpen) return null;

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    onDeleteProject(projectToDelete.id);
    setProjectToDelete(null);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !projectToDelete) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="bg-[#0B101B] border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh] relative">
        
        {/* ========================================================================= */}
        {/* CONFIRMACIÓN DE ELIMINACIÓN                                               */}
        {/* ========================================================================= */}
        {projectToDelete && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <div>
                <h4 className="text-base font-bold text-white mb-1">¿Eliminar este proyecto?</h4>
                <p className="text-xs text-slate-300 font-semibold truncate">
                  "{projectToDelete.name}"
                </p>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Esta acción no se puede deshacer y liberará 1 espacio de tus {MAX_SAVED_PROJECTS} proyectos disponibles.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sí, eliminar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HEADER DEL MODAL */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Mis Proyectos Guardados</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  {savedProjects.length} de {MAX_SAVED_PROJECTS}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Selecciona un proyecto para abrirlo en el editor o libera espacio eliminando los que no uses.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BARRA DE CAPACIDAD DE SLOTS */}
        <div className="px-6 py-2.5 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Capacidad de Almacenamiento:</span>
            <div className="flex items-center gap-1">
              {[...Array(MAX_SAVED_PROJECTS)].map((_, i) => (
                <span
                  key={i}
                  className={`w-3.5 h-2 rounded-xs transition-colors ${
                    i < savedProjects.length
                      ? 'bg-indigo-500 shadow-xs shadow-indigo-500/40'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                  title={i < savedProjects.length ? `Espacio ${i + 1} ocupado` : `Espacio ${i + 1} libre`}
                />
              ))}
            </div>
          </div>

          <span className="text-[11px] text-indigo-400 font-bold">
            {MAX_SAVED_PROJECTS - savedProjects.length === 0
              ? 'Límite alcanzado'
              : `${MAX_SAVED_PROJECTS - savedProjects.length} espacio(s) disponible(s)`}
          </span>
        </div>

        {/* CONTENIDO: TABLA DE PROYECTOS O EMPTY STATE */}
        <div className="p-6 overflow-y-auto flex-1">
          {savedProjects.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500 space-y-3">
              <FolderArchive className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No tienes proyectos guardados aún</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Crea un diseño desde el asistente, plantilla o lienzo en blanco y guárdalo para que aparezca en esta tabla.
              </p>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Proyecto</th>
                    <th className="py-3 px-3 font-semibold">Formato</th>
                    <th className="py-3 px-3 font-semibold">Módulo</th>
                    <th className="py-3 px-3 font-semibold">Marca</th>
                    <th className="py-3 px-3 font-semibold">Fecha</th>
                    <th className="py-3 px-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {savedProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-slate-900/50 transition-colors group"
                    >
                      {/* 1. Nombre & Color */}
                      <td className="py-3.5 px-4 font-sans font-bold text-white max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: project.postState?.currentColor || '#4F46E5' }}
                          />
                          <span className="truncate group-hover:text-indigo-300 transition-colors">
                            {project.name}
                          </span>
                        </div>
                      </td>

                      {/* 2. Formato (Aspect Ratio) */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-indigo-300 font-bold text-[10px]">
                          {project.postState?.aspectRatio || '4:5'}
                        </span>
                      </td>

                      {/* 3. Módulo Central */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 uppercase text-[10px]">
                          {project.postState?.activeModule || 'code'}
                        </span>
                      </td>

                      {/* 4. Empresa / Marca */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-400">
                        <span className="truncate block max-w-[120px]">
                          {project.postState?.companyName || 'Sin definir'}
                        </span>
                      </td>

                      {/* 5. Fecha de Edición */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(project.updatedAt || project.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </td>

                      {/* 6. Botones de Acción */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenProject(project);
                              onClose();
                            }}
                            className="py-1.5 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title="Abrir en el editor"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Abrir</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setProjectToDelete(project)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Eliminar este proyecto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
