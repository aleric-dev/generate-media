import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutTemplate,
  Sparkles,
  ArrowRight,
  FolderArchive,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { DesktopOnlyNotice } from '../components/DesktopOnlyNotice';
import { ProjectsModal } from '../components/ProjectsModal';
import { useStudioStore } from '../store/useStudioStore';
import {
  getSavedProjects,
  deleteProject,
  SavedProject,
  MAX_SAVED_PROJECTS,
} from '../utils/customPresetsStorage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const setWizardModalOpen = useStudioStore((s) => s.setWizardModalOpen);
  const setTemplatesModalOpen = useStudioStore((s) => s.setTemplatesModalOpen);
  const resetToScratch = useStudioStore((s) => s.resetToScratch);
  const loadProjectState = useStudioStore((s) => s.loadProjectState);

  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  useEffect(() => {
    setSavedProjects(getSavedProjects());
  }, []);

  const handleStartFromScratch = () => {
    resetToScratch();
    navigate('/editor');
  };

  const handleOpenTemplates = () => {
    setTemplatesModalOpen(true);
  };

  const handleOpenWizard = () => {
    setWizardModalOpen(true);
  };

  const handleOpenProject = (project: SavedProject) => {
    loadProjectState(project.postState, project.id, project.name);
    navigate('/editor');
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setSavedProjects(getSavedProjects());
  };

  return (
    <>
      {/* VISTA MÓVIL (< 1024px): AVISO DE PANTALLA DE ESCRITORIO REQUERIDA */}
      <div className="block lg:hidden w-full">
        <DesktopOnlyNotice showHeader={false} showFooter={false} />
      </div>

      {/* VISTA ESCRITORIO (>= 1024px): PANEL DE CREACIÓN CON LAS 4 OPCIONES */}
      <div className="hidden lg:flex w-full flex-1 flex-col items-center justify-center p-6 sm:p-10 select-none relative my-auto overflow-y-auto">
        
        {/* CONTENIDO PRINCIPAL: 100% CENTRADO */}
        <main className="relative z-10 max-w-6xl w-full text-center space-y-7 sm:space-y-8 py-4 flex flex-col items-center justify-center">
          {/* Logo & Título */}
          <div className="space-y-2.5 flex flex-col items-center">
            <div className="pb-1">
              <BrandLogo size="xl" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Panel de Creación
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Generador editorial en 1080p nativo. Inicia un nuevo diseño o retoma tus proyectos guardados:
            </p>
          </div>

          {/* Las 4 Grandes Opciones de Entrada (Cards Uniformes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left w-full items-stretch">
            
            {/* OPCIÓN 1: ASISTENTE PASO A PASO (DESTACADO) */}
            <button
              type="button"
              onClick={handleOpenWizard}
              className="group relative p-5 rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] hover:from-[#131D35] hover:to-[#0D1426] border-2 border-indigo-500/60 hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-indigo-500/20 z-10 cursor-pointer h-full"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Recomendado
                  </span>
                </div>
                <h2 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
                  Asistente Guiado
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Configura tu marca, paleta, contenido y atmósfera con previsualizaciones antes de entrar.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5 pt-1">
                <span>Iniciar Asistente</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* OPCIÓN 2: A PARTIR DE UNA PLANTILLA */}
            <button
              type="button"
              onClick={handleOpenTemplates}
              className="group relative p-5 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-indigo-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-indigo-500/10 cursor-pointer h-full"
            >
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Usar Plantilla
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Elige entre más de 24 diseños probados para SaaS, cloud, arquitectura y desarrollo.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5 pt-1">
                <span>Ver Catálogo (+24)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* OPCIÓN 3: EMPEZAR DE 0 */}
            <button
              type="button"
              onClick={handleStartFromScratch}
              className="group relative p-5 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-emerald-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-emerald-500/10 cursor-pointer h-full"
            >
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Lienzo en Blanco
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Entra directo al editor con el lienzo limpio, sin textos ni módulos preconfigurados.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                <span>Empezar de 0</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* OPCIÓN 4: MIS PROYECTOS (CARD UNIFORME, GESTIÓN Y DETALLES EN EL MODAL) */}
            <button
              type="button"
              onClick={() => setIsProjectsModalOpen(true)}
              className="group relative p-5 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-indigo-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-indigo-500/10 cursor-pointer h-full"
            >
              <div className="space-y-2.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Mis Proyectos
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Accede a tus diseños guardados, edítalos, duplícalos o continúa trabajando en tus proyectos.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5 pt-1">
                <span>Ver Proyectos</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

          </div>
        </main>

        {/* MODAL CON TABLA DE PROYECTOS */}
        <ProjectsModal
          isOpen={isProjectsModalOpen}
          onClose={() => setIsProjectsModalOpen(false)}
          savedProjects={savedProjects}
          onOpenProject={handleOpenProject}
          onDeleteProject={handleDeleteProject}
        />
      </div>
    </>
  );
};
