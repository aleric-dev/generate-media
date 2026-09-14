import React, { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { aspectRatios } from '../constants/templates';
import { TopNavbar } from '../components/TopNavbar';
import { ControlPanel } from '../components/Panel/ControlPanel';
import { CanvasTarget } from '../components/Canvas/CanvasTarget';
import { ExportSuccessModal } from '../components/ExportSuccessModal';
import { useStudioStore } from '../store/useStudioStore';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const postState = useStudioStore((s) => s.postState);
  const updatePostState = useStudioStore((s) => s.updatePostState);
  const setWizardModalOpen = useStudioStore((s) => s.setWizardModalOpen);

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
    const padding = window.innerWidth < 640 ? 24 : 48;
    return {
      w: Math.max(el.clientWidth - padding, 200),
      h: Math.max(el.clientHeight - padding, 200),
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
        return { mode: 'manual' as const, level: Math.max(0.15, Math.min(2.5, Number(modeOrVal.toFixed(3)))) };
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
        const nextLevel = Math.max(0.15, Math.min(2.5, Number((postState.zoomLevel + delta).toFixed(2))));
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

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportedDataUrl(dataUrl);
      setExportedFilename(filename);
      setExportModalOpen(true);

      setExportStatus(`¡Descargada con éxito! (${r.nativeW}x${r.nativeH})`);
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
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setExportedDataUrl(dataUrl);
        setExportedFilename(filename);
        setExportModalOpen(true);

        setExportStatus('¡Descargada (Fallback)!');
        setTimeout(() => setExportStatus('100% idéntico a pantalla'), 4000);
      } catch (e2) {
        console.error('Error fatal al exportar:', e2);
        alert('Hubo un error al exportar la imagen. Revisa la consola.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#070A0F] select-none">
      {/* 1. COLUMNA IZQUIERDA: PANEL DE CONTROL INTEGRADO */}
      <aside className="w-[460px] xl:w-[500px] h-full flex-shrink-0 flex flex-col bg-[#0B101B] border-r border-slate-800 shadow-2xl z-20">
        <ControlPanel
          state={postState}
          updateState={updatePostState}
          onExport={handleExportHQ}
          isExporting={isExporting}
          exportStatus={exportStatus}
        />
      </aside>

      {/* 2. COLUMNA DERECHA: ÁREA DE TRABAJO Y PREVISUALIZACIÓN */}
      <main className="flex-1 min-w-0 h-full flex flex-col p-3 sm:p-4 bg-gradient-to-b from-[#070A0F] to-[#020408] overflow-hidden">
        {/* TOP NAVBAR */}
        <TopNavbar
          aspectRatio={postState.aspectRatio}
          onAspectRatioChange={(ratio) => updatePostState({ aspectRatio: ratio })}
          zoomMode={postState.zoomMode}
          zoomLevel={postState.zoomLevel}
          onZoomChange={handleZoomChange}
          onGoHome={() => navigate('/inicio')}
          onOpenWizard={() => setWizardModalOpen(true)}
        />

        {/* CANVAS VIEWPORT */}
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

        {/* FOOTER SUTIL */}
        <div className="mt-2 text-center text-xs font-mono text-slate-500 flex items-center justify-center gap-4 shrink-0">
          <span>
            <strong className="text-slate-400">Ctrl + Rueda</strong> para Zoom
          </span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">Previsualización en Base 1080p Nativa</span>
        </div>
      </main>

      {/* Modal de Éxito de Exportación */}
      <ExportSuccessModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        dataUrl={exportedDataUrl}
        filename={exportedFilename}
        resolution={r.px}
      />
    </div>
  );
};
