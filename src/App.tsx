import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PostState, PostTemplate } from './types';
import { aspectRatios } from './constants/templates';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TemplatesModal } from './components/TemplatesModal';
import { TopNavbar } from './components/TopNavbar';
import { ControlPanel } from './components/Panel/ControlPanel';
import { CanvasTarget } from './components/Canvas/CanvasTarget';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';

export const App: React.FC = () => {
  // Canvas DOM ref para exportación
  const canvasRef = useRef<HTMLDivElement>(null);
  // Viewport DOM ref para listener de zoom con Ctrl + Rueda
  const viewportRef = useRef<HTMLDivElement>(null);

  // Modales
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('100% idéntico a pantalla');

  // Detección de ruta inicial: / o /editor
  const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const initialViewMode: 'welcome' | 'editor' = initialPath.startsWith('/editor') ? 'editor' : 'welcome';

  // Estado maestro del Post Studio v0.3
  const [state, setState] = useState<PostState>({
    viewMode: initialViewMode, // Página 1: '/' ('welcome') | Página 2: '/editor' ('editor')
    activeStep: 1,
    panelOpen: true,

    canvasMode: 'dark',
    currentColor: '#4F46E5',
    category: 'DESARROLLO A LA MEDIDA',
    aspectRatio: '4:5',

    titleFont: 'font-space-mono',
    companyName: 'Aleric Dev',
    headerShowLogo: true,
    headerSize: 13,
    logoSize: 44,

    title: '¿Tu empresa ya superó a Excel? 3 señales de que necesitas un panel propio',
    titleSize: 48,
    titleColorMode: 'contrast',
    titleCustomColor: '#FFFFFF',
    textAlign: 'center',
    subtitle: 'Centraliza pedidos, inventarios y permisos en una sola plataforma web en la nube sin errores de fórmula.',
    subtitleSize: 24,
    subtitlePos: 'below',
    tags: 'PostgreSQL, Next.js, FastAPI, Roles Seguros',

    moduleVisible: true,
    moduleSize: 'normal',
    moduleScale: 1.0,
    moduleFontSize: 14,
    activeModule: 'code',
    code: "system.migrate({ from: 'Inventario_Final_v3.xlsx', to: 'CloudDB' });",
    codeFilename: 'system/migrate.ts',
    codeLanguage: 'typescript',
    codeShowLineNumbers: true,
    kpis: [
      { val: '99/100', label: 'GOOGLE LIGHTHOUSE SPEED', prefix: '', suffix: '', trend: 'up', borderTop: true },
      { val: '< 0.4s', label: 'TIEMPO DE CARGA TOTAL', prefix: '', suffix: '', trend: 'down', borderTop: true },
    ],
    chartBars: [
      { label: 'WordPress Estándar', pct: 28, color: '#EF4444' },
      { label: 'Plataforma Aleric Dev', pct: 99, color: '#10B981' },
    ],
    chatMessages: [
      { sender: 'client', text: 'Hola, ¿cuánto cuesta desarrollar una plataforma para gestionar pedidos y clientes?', time: '10:14 AM' },
      { sender: 'bot', text: '¡Hola! En Aleric diseñamos arquitecturas web escalables y a la medida. ¿Manejas actualmente tu operación en Excel?', time: '10:14 AM' },
    ],
    chatContactName: 'Aleric Dev Bot',
    chatOnlineStatus: 'en línea',
    contentHighlightText: 'Automatiza tu operación y escala sin límites con software diseñado a tu medida.',
    contentHighlightStyle: 'card',
    images: [
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80', caption: 'Dashboard Analítico Cloud' },
    ],
    imageBorderStyle: 'none',

    cta: 'Escríbenos y migramos tu operación a la nube.',
    handle: 'aleric.dev',
    ctaOrder: 'cta-first',
    ctaAlign: 'between',
    footerSize: 13,

    logoType: 'generic',
    customLogoUrl: null,
    headerShape: 'line',
    footerShape: 'line',

    bgPattern: 'circuit',
    patternScale: 100,
    patternVignette: 'vignette',
    customPatternUrl: null,

    // Luces
    lightType: 'glow',
    lightDirection: 'dual-corners-1',
    lightIntensity: 40,

    // Formas perimetrales vítreas
    shapeType: 'glass-orbs',
    shapePlacement: 'corners',
    shapeSizeVariant: 'medium',
    shapeOpacity: 60,
    shapeSeed: 12345,

    zoomMode: 'fit-height',
    zoomLevel: 0.5,
  });

  const updateState = (partial: Partial<PostState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  // Enrutador ligero HTML5 History API (/ y /editor)
  const navigateTo = useCallback((path: '/' | '/editor') => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setState((prev) => ({
      ...prev,
      viewMode: path === '/editor' ? 'editor' : 'welcome',
    }));
  }, []);

  // Listener para navegación con botones Atrás/Adelante del navegador
  useEffect(() => {
    const onPopState = () => {
      const isEditor = window.location.pathname.startsWith('/editor');
      setState((prev) => ({
        ...prev,
        viewMode: isEditor ? 'editor' : 'welcome',
      }));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // 1. Empezar de 0 0 (Lienzo Vacío) -> Pasa a /editor
  const handleStartFromScratch = () => {
    navigateTo('/editor');
    setState((prev) => ({
      ...prev,
      viewMode: 'editor',
      title: '',
      subtitle: '',
      tags: '',
      cta: '',
      handle: '',
      moduleVisible: false,
      activeStep: 1,
      panelOpen: true,
      textAlign: 'center',
      ctaOrder: 'cta-first',
      ctaAlign: 'between',
      moduleScale: 1.0,
      moduleFontSize: 14,
      logoSize: 44,
      headerShowLogo: true,
      headerSize: 13,
      footerSize: 13,
      shapeType: 'none',
      lightType: 'glow',
      contentHighlightText: '',
      contentHighlightStyle: 'card',
    }));
  };

  // 2. Cargar Plantilla -> Pasa a /editor
  const handleSelectTemplate = (t: PostTemplate) => {
    setTemplatesModalOpen(false);
    navigateTo('/editor');
    setState((prev) => ({
      ...prev,
      viewMode: 'editor',
      title: t.title,
      titleSize: t.titleSize || 48,
      titleColorMode: t.titleColor || 'contrast',
      textAlign: t.textAlign || 'center',
      subtitle: t.subtitle,
      subtitleSize: t.subtitleSize || 24,
      subtitlePos: t.subtitlePos || 'below',
      tags: t.tags,
      cta: t.cta || 'Escríbenos y migramos tu operación a la nube.',
      handle: t.handle || 'aleric.dev',
      ctaOrder: t.ctaOrder || 'cta-first',
      ctaAlign: t.ctaAlign || 'between',
      companyName: t.companyName || prev.companyName,
      logoType: t.logoType || 'generic',
      logoSize: t.logoSize || 44,
      headerShowLogo: t.headerShowLogo !== undefined ? t.headerShowLogo : true,
      headerSize: t.headerSize || 13,
      footerSize: t.footerSize || 13,
      titleFont: t.titleFont || prev.titleFont,
      color: t.color,
      currentColor: t.color,
      category: t.category,
      bgPattern: t.bgPattern || 'circuit',
      patternScale: t.patternScale || 100,
      patternVignette: t.patternVignette || 'vignette',
      lightType: t.lightType || 'glow',
      lightDirection: t.lightDirection || 'dual-corners-1',
      lightIntensity: t.lightIntensity !== undefined ? t.lightIntensity : 40,
      shapeType: (t.shapeType || (t.accentShape === 'circles' ? 'glass-orbs' : t.accentShape === 'squares' ? 'tech-squares' : t.accentShape === 'diamonds' ? 'glass-cards' : 'glass-orbs')) as any,
      shapePlacement: t.shapePlacement || 'corners',
      shapeSizeVariant: t.shapeSizeVariant || 'medium',
      shapeOpacity: t.shapeOpacity !== undefined ? t.shapeOpacity : 60,
      headerShape: t.headerShape || 'line',
      footerShape: t.footerShape || 'line',
      moduleVisible: t.moduleVisible !== false,
      moduleSize: t.moduleSize || 'normal',
      moduleScale: t.moduleScale || 1.0,
      moduleFontSize: t.moduleFontSize || 14,
      activeModule: t.module || 'code',
      code: t.code || prev.code,
      codeFilename: t.codeFilename || prev.codeFilename,
      codeLanguage: t.codeLanguage || prev.codeLanguage,
      codeShowLineNumbers: t.codeShowLineNumbers !== undefined ? t.codeShowLineNumbers : true,
      chatContactName: t.chatContactName || prev.chatContactName,
      chatOnlineStatus: t.chatOnlineStatus || prev.chatOnlineStatus,
      contentHighlightText: t.contentHighlightText || prev.contentHighlightText,
      contentHighlightStyle: t.contentHighlightStyle || prev.contentHighlightStyle,
      activeStep: 1,
      panelOpen: true,
    }));
  };

  // Motor de Zoom
  const calculateZoom = useCallback((modeOrVal: 'fit-height' | 'fit-width' | '100%' | 'manual' | number) => {
    const r = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];
    const padX = window.innerWidth < 640 ? 24 : 64;
    const padY = window.innerWidth < 640 ? 24 : 64;
    const panelWidth = 480;
    const availW = Math.max(window.innerWidth - panelWidth - padX, 240);
    const availH = Math.max(window.innerHeight - 90 - padY, 240);

    const scaleW = availW / r.nativeW;
    const scaleH = availH / r.nativeH;

    if (modeOrVal === 'fit-height') {
      return { mode: 'fit-height' as const, level: Math.min(scaleH, 1.5) };
    }
    if (modeOrVal === 'fit-width') {
      return { mode: 'fit-width' as const, level: Math.min(scaleW, 1.5) };
    }
    if (modeOrVal === '100%' || modeOrVal === 1.0) {
      return { mode: '100%' as const, level: 1.0 };
    }
    if (typeof modeOrVal === 'number') {
      return { mode: 'manual' as const, level: Math.max(0.15, Math.min(2.0, modeOrVal)) };
    }
    return { mode: 'fit-height' as const, level: scaleH };
  }, [state.aspectRatio]);

  const handleZoomChange = (modeOrVal: 'fit-height' | 'fit-width' | '100%' | 'manual' | number) => {
    const res = calculateZoom(modeOrVal);
    setState((prev) => ({ ...prev, zoomMode: res.mode, zoomLevel: res.level }));
  };

  useEffect(() => {
    const res = calculateZoom(state.zoomMode);
    setState((prev) => ({ ...prev, zoomLevel: res.level }));
  }, [state.aspectRatio, calculateZoom]);

  // Listener para redimensionamiento de ventana
  useEffect(() => {
    const onResize = () => {
      if (state.zoomMode === 'fit-height' || state.zoomMode === 'fit-width') {
        const res = calculateZoom(state.zoomMode);
        setState((prev) => ({ ...prev, zoomLevel: res.level }));
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [state.zoomMode, calculateZoom]);

  // FIX: Listener nativo no-pasivo para Zoom interactivo con Ctrl + Rueda en el Canvas
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        setState((prev) => {
          const nextLevel = Math.max(0.15, Math.min(2.5, Number((prev.zoomLevel + delta).toFixed(2))));
          return { ...prev, zoomMode: 'manual', zoomLevel: nextLevel };
        });
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Exportación PNG 1080p Nativa HQ (Exclusiva de Paso 4)
  const handleExportHQ = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    setExportStatus('Renderizando imagen...');

    const r = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];
    const cleanCompany = (state.companyName || 'post').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${cleanCompany}-${state.aspectRatio.replace(':', '-')}-${Date.now()}.png`;
    const bgExportColor = state.canvasMode === 'light' ? '#F8FAFC' : '#070A0F';

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

  const r = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];
  const scaledW = Math.round(r.nativeW * state.zoomLevel);
  const scaledH = Math.round(r.nativeH * state.zoomLevel);

  // =========================================================================
  // PÁGINA 1: BIENVENIDA Y CATÁLOGO DE PLANTILLAS
  // =========================================================================
  if (state.viewMode === 'welcome') {
    return (
      <div className="h-full w-full overflow-hidden bg-[#070A0F] relative select-none">
        <WelcomeScreen
          onStartFromScratch={handleStartFromScratch}
          onOpenTemplates={() => setTemplatesModalOpen(true)}
        />

        <TemplatesModal
          isOpen={templatesModalOpen}
          onClose={() => setTemplatesModalOpen(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    );
  }

  // =========================================================================
  // PÁGINA 2: EDITOR (PANEL LATERAL FIJO EN EL FLUJO + CANVAS CENTRADO)
  // En esta vista NO se pueden abrir plantillas (solo botón Inicio para volver).
  // El panel corre naturalmente el canvas para que quede 100% centrado.
  // =========================================================================
  return (
    <div className="h-full w-full flex overflow-hidden bg-[#070A0F] select-none">
      
      {/* 1. COLUMNA IZQUIERDA: PANEL DE CONTROL INTEGRADO */}
      <aside className="w-[460px] xl:w-[500px] h-full flex-shrink-0 flex flex-col bg-[#0B101B] border-r border-slate-800 shadow-2xl z-20">
        <ControlPanel
          state={state}
          updateState={updateState}
          onExport={handleExportHQ}
          isExporting={isExporting}
          exportStatus={exportStatus}
        />
      </aside>

      {/* 2. COLUMNA DERECHA: ÁREA DE TRABAJO Y PREVISUALIZACIÓN */}
      <main className="flex-1 min-w-0 h-full flex flex-col p-3 sm:p-4 bg-gradient-to-b from-[#070A0F] to-[#020408] overflow-hidden">
        
        {/* TOP NAVBAR (Con selector de aspecto limpio numérico y zoom, sin plantillas) */}
        <TopNavbar
          aspectRatio={state.aspectRatio}
          onAspectRatioChange={(ratio) => updateState({ aspectRatio: ratio })}
          zoomMode={state.zoomMode}
          zoomLevel={state.zoomLevel}
          onZoomChange={handleZoomChange}
          onGoHome={() => navigateTo('/')}
        />

        {/* CANVAS VIEWPORT (Centra perfectamente el lienzo con m-auto e items-center) */}
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
                transform: `scale(${state.zoomLevel})`,
              }}
            >
              <CanvasTarget ref={canvasRef} state={state} />
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

    </div>
  );
};
