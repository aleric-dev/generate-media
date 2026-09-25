import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutTemplate,
  Sparkles,
  ArrowRight,
  FolderArchive,
  Layers,
  Clock,
  Compass
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { DesktopOnlyNotice } from '../components/DesktopOnlyNotice';
import { ProjectsModal } from '../components/ProjectsModal';
import { CarouselNoticeModal } from '../components/CarouselNoticeModal';
import { useStudioStore } from '../store/useStudioStore';
import {
  getSavedProjects,
  deleteProject,
  SavedProject,
} from '../utils/customPresetsStorage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const setWizardModalOpen = useStudioStore((s) => s.setWizardModalOpen);
  const setTemplatesModalOpen = useStudioStore((s) => s.setTemplatesModalOpen);
  const resetToScratch = useStudioStore((s) => s.resetToScratch);
  const loadProjectState = useStudioStore((s) => s.loadProjectState);

  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isCarouselNoticeOpen, setIsCarouselNoticeOpen] = useState(false);

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
    navigate(`/editor/${project.id}`);
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

      {/* VISTA ESCRITORIO (>= 1024px): PANEL DE CREACIÓN REORGANIZADO */}
      <div className="hidden lg:flex w-full flex-1 flex-col items-center justify-center p-6 sm:p-10 select-none relative my-auto overflow-y-auto">
        
        {/* CONTENIDO PRINCIPAL: CENTRADO */}
        <main className="relative z-10 max-w-5xl w-full text-center space-y-6 sm:space-y-7 py-2 flex flex-col items-center justify-center">
          
          {/* Logo & Título */}
          <div className="space-y-2 flex flex-col items-center">
            <div className="pb-1">
              <BrandLogo size="xl" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Panel de Creación
            </h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Generador editorial en 1080p nativo para ingeniería, SaaS y redes sociales. Elige cómo deseas comenzar tu próximo contenido:
            </p>
          </div>

          {/* ========================================================================= */}
          {/* BLOQUE 1: HERO CARD DESTACADA (ASISTENTE GUIADO - RECOMENDADO)           */}
          {/* ========================================================================= */}
          <button
            type="button"
            onClick={handleOpenWizard}
            className="w-full group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#111A30] to-[#0A0F1D] hover:from-[#131D35] hover:via-[#16213D] hover:to-[#0D1426] border-2 border-indigo-500/50 hover:border-indigo-400 transition-all duration-300 text-left shadow-2xl hover:shadow-indigo-500/20 cursor-pointer overflow-hidden"
          >
            {/* Glow de fondo */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-indigo-500/15 transition-colors" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 shadow-lg">
                  <Compass className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Recomendado
                    </span>
                    <span className="text-xs font-mono text-slate-400">Paso a paso interactivo</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                    Asistente Guiado de Creación
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Personaliza tu identidad de marca, paleta cromática, módulos de alto impacto (KPIs, split cards, código) y atmósfera visual con previsualización en vivo antes de entrar al editor.
                  </p>
                </div>
              </div>

              {/* Botón Callout */}
              <div className="shrink-0 self-end sm:self-center">
                <span className="py-2.5 px-4 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition">
                  <span>Iniciar Asistente</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </button>

          {/* ========================================================================= */}
          {/* BLOQUE 2: GRID DE 4 OPCIONES SIMÉTRICAS                                   */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left w-full items-stretch">
            
            {/* OPCIÓN 1: USAR PLANTILLA */}
            <button
              type="button"
              onClick={handleOpenTemplates}
              className="group relative p-5 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-indigo-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-indigo-500/10 cursor-pointer h-full"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Usar Plantilla
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Elige entre más de 24 diseños probados para SaaS, cloud, arquitectura y desarrollo.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5 pt-1">
                <span>Ver Catálogo (+24)</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* OPCIÓN 2: LIENZO EN BLANCO */}
            <button
              type="button"
              onClick={handleStartFromScratch}
              className="group relative p-5 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-emerald-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-emerald-500/10 cursor-pointer h-full"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Lienzo en Blanco
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Entra directo al editor con el lienzo limpio, sin textos ni módulos preconfigurados.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                <span>Empezar de 0</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* OPCIÓN 3: MODO CARRUSEL (NUEVA OPCIÓN DEDICADA) */}
            <button
              type="button"
              onClick={() => setIsCarouselNoticeOpen(true)}
              className="group relative p-5 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-pink-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-pink-500/10 cursor-pointer h-full"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Roadmap
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                  Modo Carrusel
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Secuencias multi-slide para carruseles de Instagram y documentos PDF para LinkedIn.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-pink-400 flex items-center gap-1.5 pt-1">
                <span>Ver Información</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* OPCIÓN 4: MIS PROYECTOS */}
            <button
              type="button"
              onClick={() => setIsProjectsModalOpen(true)}
              className="group relative p-5 rounded-2xl bg-[#0B101B]/80 hover:bg-[#0E1524] border border-slate-800 hover:border-indigo-500/60 text-left transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-indigo-500/10 cursor-pointer h-full"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  {savedProjects.length > 0 && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {savedProjects.length}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Mis Proyectos
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Accede a tus diseños guardados, edítalos, duplícalos o continúa trabajando en tus proyectos.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5 pt-1">
                <span>Ver Proyectos</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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

        {/* MODAL INFORMATIVO ROADMAP MODO CARRUSEL */}
        <CarouselNoticeModal
          isOpen={isCarouselNoticeOpen}
          onClose={() => setIsCarouselNoticeOpen(false)}
          onStartSinglePost={() => {
            setIsCarouselNoticeOpen(false);
            handleOpenWizard();
          }}
        />
      </div>
    </>
  );
};
