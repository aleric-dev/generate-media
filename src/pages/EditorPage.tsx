import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Save } from 'lucide-react';
import { aspectRatios } from '../constants/templates';
import { ControlPanel } from '../components/Panel/ControlPanel';
import { CanvasTarget } from '../components/Canvas/CanvasTarget';
import { FloatingWorkspaceCard, MIN_ZOOM, MAX_ZOOM } from '../components/FloatingWorkspaceCard';
import { FloatingBrandBadge } from '../components/FloatingBrandBadge';
import { AboutStudioModal } from '../components/AboutStudioModal';
import { SaveConfigModal } from '../components/SaveConfigModal';
import { ExportSuccessModal } from '../components/ExportSuccessModal';
import { Button, Badge } from '../components/ui';
import { useStudioStore, extractSavableState } from '../store/useStudioStore';
import { saveOrUpdateProject } from '../utils/customPresetsStorage';
import { trackImageGeneration } from '../utils/generationTracker';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const postState = useStudioStore((s) => s.postState);
  const updatePostState = useStudioStore((s) => s.updatePostState);
  const loadProjectState = useStudioStore((s) => s.loadProjectState);
  const currentProjectId = useStudioStore((s) => s.currentProjectId);
  const currentProjectName = useStudioStore((s) => s.currentProjectName);
  const lastSavedSnapshot = useStudioStore((s) => s.lastSavedSnapshot);
  const setCurrentProject = useStudioStore((s) => s.setCurrentProject);
  const setWizardModalOpen = useStudioStore((s) => s.setWizardModalOpen);
  const showToast = useStudioStore((s) => s.showToast);

  const hasUnsavedChanges = React.useMemo(() => {
    if (!currentProjectId) return true;
    if (!lastSavedSnapshot) return false;
    return JSON.stringify(extractSavableState(postState)) !== lastSavedSnapshot;
  }, [postState, currentProjectId, lastSavedSnapshot]);

  const handleQuickSave = () => {
    if (currentProjectId && currentProjectName) {
      const res = saveOrUpdateProject(currentProjectName, postState, currentProjectId);
      if (res.success && res.project) {
        setCurrentProject(res.project.id, res.project.name, JSON.stringify(extractSavableState(postState)));
        showToast(`¡Cambios guardados en "${res.project.name}"!`, 'success');
      } else {
        showToast(res.error || 'No se pudo guardar el proyecto', 'error');
      }
    } else {
      setSaveModalOpen(true);
    }
  };

  // Sincronizar ancho del sidebar para centrar el Toast perfectamente sobre el Canvas
  useEffect(() => {
    const updateSidebarVar = () => {
      const isXl = window.innerWidth >= 1280;
      const width = isSidebarCollapsed ? '68px' : isXl ? '528px' : '488px';
      document.documentElement.style.setProperty('--sidebar-w', width);
    };

    updateSidebarVar();
    window.addEventListener('resize', updateSidebarVar);

    return () => {
      document.documentElement.style.setProperty('--sidebar-w', '0px');
      window.removeEventListener('resize', updateSidebarVar);
    };
  }, [isSidebarCollapsed]);

  const exportModalOpen = useStudioStore((s) => s.exportModalOpen);
  const setExportModalOpen = useStudioStore((s) => s.setExportModalOpen);
  const isExporting = useStudioStore((s) => s.isExporting);
  const setIsExporting = useStudioStore((s) => s.setIsExporting);
  const exportStatus = useStudioStore((s) => s.exportStatus);
  const setExportStatus = useStudioStore((s) => s.setExportStatus);
  const exportedDataUrl = useStudioStore((s) => s.exportedDataUrl);
  const setExportedDataUrl = useStudioStore((s) => s.setExportedDataUrl);
  const exportedFilename = useStudioStore((s) => s.exportedFilename);
  const setExportedFilename = useStudioStore((s) => s.setExportedFilename);

  const r = aspectRatios[postState.aspectRatio] || aspectRatios['4:5'];
  const scaledW = Math.round(r.nativeW * postState.zoomLevel);
  const scaledH = Math.round(r.nativeH * postState.zoomLevel);

  const getRealAvailable = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return { w: 900, h: 700 };
    const paddingX = window.innerWidth < 640 ? 40 : 96;
    const paddingY = window.innerWidth < 640 ? 40 : 96;
    return {
      w: Math.max(el.clientWidth - paddingX, 200),
      h: Math.max(el.clientHeight - paddingY, 200),
    };
  }, []);

  const calculateZoom = useCallback(
    (modeOrVal: 'fit-height' | 'fit-width' | '100%' | 'manual' | number) => {
      const { w: availW, h: availH } = getRealAvailable();
      const scaleW = availW / r.nativeW;
      const scaleH = availH / r.nativeH;

      if (modeOrVal === 'fit-height') {
        return { mode: 'fit-height' as const, level: Number(scaleH.toFixed(3)) };
      }
      if (modeOrVal === 'fit-width') {
        return { mode: 'fit-width' as const, level: Number(scaleW.toFixed(3)) };
      }
      if (modeOrVal === '100%' || modeOrVal === 1.0) {
        return { mode: '100%' as const, level: 1.0 };
      }
      if (typeof modeOrVal === 'number') {
        return { mode: 'manual' as const, level: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(modeOrVal.toFixed(3)))) };
      }
      return { mode: 'fit-height' as const, level: Number(scaleH.toFixed(3)) };
    },
    [r.nativeW, r.nativeH, getRealAvailable]
  );

  const handleZoomChange = (modeOrVal: 'fit-height' | 'fit-width' | '100%' | 'manual' | number) => {
    const res = calculateZoom(modeOrVal);
    updatePostState({ zoomMode: res.mode, zoomLevel: res.level });
  };

  useEffect(() => {
    const res = calculateZoom(postState.zoomMode);
    updatePostState({ zoomLevel: res.level });
  }, [postState.aspectRatio, calculateZoom, updatePostState]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (postState.zoomMode === 'fit-height' || postState.zoomMode === 'fit-width') {
        const res = calculateZoom(postState.zoomMode);
        if (Math.abs(res.level - postState.zoomLevel) > 0.005) {
          updatePostState({ zoomLevel: res.level });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [calculateZoom, postState.zoomMode, postState.zoomLevel, updatePostState]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        const nextLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number((postState.zoomLevel + delta).toFixed(2))));
        updatePostState({ zoomMode: 'manual', zoomLevel: nextLevel });
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [postState.zoomLevel, updatePostState]);

  const handleExportHQ = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    setExportStatus('Renderizando imagen...');

    const cleanCompany = (postState.companyName || 'post').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${cleanCompany}-${postState.aspectRatio.replace(':', '-')}-${Date.now()}.png`;
    const bgExportColor = postState.canvasMode === 'light' ? '#F8FAFC' : '#070A0F';

    try {
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: bgExportColor,
      });

      // Registrar conteo de generación (local-first + ping global serverless)
      trackImageGeneration();

      setExportedDataUrl(dataUrl);
      setExportedFilename(filename);
      setExportModalOpen(true);
      showToast('¡Imagen 1080p generada con éxito!', 'success');

      setExportStatus(`¡Imagen generada! (${r.nativeW}x${r.nativeH})`);
      setTimeout(() => setExportStatus('100% idéntico a pantalla'), 4000);
    } catch (err) {
      console.warn('html-to-image falló, ejecutando fallback con html2canvas:', err);
      try {
        const canvas = await html2canvas(canvasRef.current, {
          scale: 1,
          useCORS: true,
          backgroundColor: bgExportColor,
          logging: false,
        });
        const dataUrl = canvas.toDataURL('image/png');

        // Registrar conteo de generación
        trackImageGeneration();

        setExportedDataUrl(dataUrl);
        setExportedFilename(filename);
        setExportModalOpen(true);
        showToast('¡Imagen 1080p generada con éxito!', 'success');

        setExportStatus('¡Imagen generada (Fallback)!');
        setTimeout(() => setExportStatus('100% idéntico a pantalla'), 4000);
      } catch (e2) {
        console.error('Error fatal al exportar:', e2);
        showToast('Hubo un error al generar la imagen. Revisa la consola.', 'error');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#070A0F] select-none relative">
      {/* 1. COLUMNA IZQUIERDA: PANEL DE CONTROL CON RAIL PERMANENTE Y EXTENSIÓN */}
      <aside
        className={`${
          isSidebarCollapsed ? 'w-[68px]' : 'w-[488px] xl:w-[528px]'
        } h-full flex-shrink-0 flex flex-col bg-[#070A11] shadow-2xl z-20 transition-all duration-300 ease-in-out`}
      >
        <ControlPanel
          state={postState}
          updateState={updatePostState}
          onExport={handleExportHQ}
          isExporting={isExporting}
          exportStatus={exportStatus}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onGoHome={() => navigate('/inicio')}
          onOpenSaveModal={() => setSaveModalOpen(true)}
        />
      </aside>

      {/* 2. COLUMNA DERECHA: ÁREA DE TRABAJO Y PREVISUALIZACIÓN */}
      <main className="flex-1 min-w-0 h-full flex flex-col p-2 sm:p-4 bg-gradient-to-b from-[#070A0F] to-[#020408] overflow-hidden relative">
        
        {/* ESQUINA SUPERIOR IZQUIERDA: IDENTIDAD DEL PROYECTO Y BOTÓN GUARDAR JUSTO DEBAJO */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30 animate-fade-in pointer-events-auto flex flex-col items-start gap-2 select-none">
          {/* 1. Píldora de Identidad del Proyecto */}
          <button
            type="button"
            onClick={() => setSaveModalOpen(true)}
            className="flex items-center gap-2.5 py-1 px-3 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/90 hover:border-indigo-500/40 backdrop-blur-xl rounded-2xl shadow-xl transition-all duration-150 group cursor-pointer"
            title="Haz clic para abrir la configuración del proyecto"
          >
            {/* Nombre libre del Proyecto con icono de carpeta */}
            <div className="flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-mono font-bold text-white whitespace-nowrap">
                {currentProjectName || 'Proyecto sin guardar'}
              </span>
            </div>

            {/* Tag de Estado Reactivo con Badge Atómico */}
            <Badge
              variant={!currentProjectId ? 'warning' : hasUnsavedChanges ? 'warning' : 'success'}
            >
              {!currentProjectId ? 'Borrador' : hasUnsavedChanges ? 'Modificado' : 'Guardado'}
            </Badge>
          </button>

          {/* 2. Botón Guardar justo abajo del nombre (solo se muestra si hay cambios pendientes) */}
          {hasUnsavedChanges && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleQuickSave}
              className="hover:border-emerald-500/50 hover:text-emerald-300 font-mono text-xs gap-2 shadow-lg group"
              title={currentProjectId ? "Guardar cambios pendientes directamente" : "Guardar proyecto con nombre"}
            >
              <Save className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <span>Guardar</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </Button>
          )}
        </div>

        {/* DOCK INFERIOR IZQUIERDO: ZOOM */}
        <FloatingWorkspaceCard
          aspectRatio={postState.aspectRatio}
          onAspectRatioChange={(ratio) => updatePostState({ aspectRatio: ratio })}
          zoomMode={postState.zoomMode}
          zoomLevel={postState.zoomLevel}
          onZoomChange={handleZoomChange}
        />

        {/* CANVAS VIEWPORT CENTRAL */}
        <div
          id="canvas-viewport"
          ref={viewportRef}
          className="flex-1 w-full h-full overflow-auto flex items-center justify-center p-4 sm:p-8 bg-[#03060D]/90 rounded-2xl border border-slate-800/60 shadow-inner relative"
        >
          <div
            id="canvas-scaler-wrapper"
            className="relative flex-shrink-0 transition-all duration-150 m-auto"
            style={{ width: `${scaledW}px`, height: `${scaledH}px` }}
          >
            <div
              id="canvas-scaler"
              className="origin-top-left absolute top-0 left-0 transition-transform duration-150 ease-out"
              style={{
                width: `${r.nativeW}px`,
                height: `${r.nativeH}px`,
                transform: `scale(${postState.zoomLevel})`,
              }}
            >
              <CanvasTarget ref={canvasRef} state={postState} />
            </div>
          </div>
        </div>

        {/* BOTÓN FLOTANTE CON LOGO DE MARCA Y MODAL ABOUT US */}
        <FloatingBrandBadge onClick={() => setAboutModalOpen(true)} />
      </main>

      {/* MODAL DE GUARDAR PROYECTO / CONFIGURACIÓN / MARCA / JSON */}
      <SaveConfigModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        state={postState}
        currentProjectId={currentProjectId}
        currentProjectName={currentProjectName}
        onProjectSaved={(id, name) => setCurrentProject(id, name)}
        onUpdateState={updatePostState}
      />

      {/* MODAL ABOUT US / ACERCA DE MEDIA STUDIO */}
      <AboutStudioModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      {/* MODAL DE ÉXITO DE EXPORTACIÓN */}
      <ExportSuccessModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        dataUrl={exportedDataUrl}
        filename={exportedFilename}
        resolution={r.px}
        postTitle={postState.title}
        postTags={postState.tags}
        onSaveProject={() => {
          setExportModalOpen(false);
          setSaveModalOpen(true);
        }}
        onGoHome={() => {
          setExportModalOpen(false);
          navigate('/inicio');
        }}
      />
    </div>
  );
};
