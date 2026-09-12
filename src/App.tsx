import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PostState, PostTemplate } from './types';
import { aspectRatios } from './constants/templates';
import { LandingScreen } from './components/LandingScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CreationWizardModal } from './components/CreationWizardModal';
import { TemplatesModal } from './components/TemplatesModal';
import { TopNavbar } from './components/TopNavbar';
import { ControlPanel } from './components/Panel/ControlPanel';
import { CanvasTarget } from './components/Canvas/CanvasTarget';
import { ExportSuccessModal } from './components/ExportSuccessModal';
import { PageTransitionLoader } from './components/PageTransitionLoader';
import { getDefaultBrand } from './utils/brandStorage';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';

export const App: React.FC = () => {
  // Canvas DOM ref para exportación
  const canvasRef = useRef<HTMLDivElement>(null);
  // Viewport DOM ref para listener de zoom con Ctrl + Rueda
  const viewportRef = useRef<HTMLDivElement>(null);

  // Modales
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('100% idéntico a pantalla');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportedDataUrl, setExportedDataUrl] = useState<string | null>(null);
  const [exportedFilename, setExportedFilename] = useState('');

  // Transiciones y Loader de Página
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('Cargando...');

  // Carga de marca por defecto guardada en localStorage si existe
  const defaultBrand = typeof window !== 'undefined' ? getDefaultBrand() : null;

  // Detección de ruta inicial: /, /landing, /menu, /welcome o /editor
  const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  let initialViewMode: 'landing' | 'welcome' | 'editor' = 'landing';
  if (initialPath.startsWith('/editor')) {
    initialViewMode = 'editor';
  } else if (initialPath.startsWith('/menu') || initialPath.startsWith('/welcome')) {
    initialViewMode = 'welcome';
  } else {
    initialViewMode = 'landing';
  }

  // Estado maestro del Post Studio v1.1
  const [state, setState] = useState<PostState>({
    viewMode: initialViewMode,
    activeStep: 1,
    panelOpen: true,

    canvasMode: 'dark',
    currentColor: defaultBrand?.primaryColor || '#4F46E5',
    category: 'DESARROLLO A LA MEDIDA',
    aspectRatio: '4:5',

    titleFont: defaultBrand?.titleFont || 'font-space-mono',
    subtitleFont: defaultBrand?.subtitleFont || 'font-inter',

    companyName: defaultBrand?.companyName || 'Tu Empresa',
    headerBrandMode: defaultBrand?.headerBrandMode || 'icon-text',
    logoAspectRatio: 'square',
    headerShowLogo: true,
    headerSize: 13,
    logoSize: 44,
    badgeStyle: 'pill',
    badgeColorMode: 'inherit',
    badgeCustomColor: '#4F46E5',

    title: '¿Tu empresa ya superó a Excel? 3 señales de que necesitas un panel propio',
    titleSize: 48,
    titleColorMode: 'contrast',
    titleCustomColor: '#FFFFFF',
    titleAlign: 'center',
    textAlign: 'center',
    subtitle: 'Centraliza pedidos, inventarios y permisos en una sola plataforma web en la nube sin errores de fórmula.',
    subtitleSize: 24,
    subtitlePos: 'below',
    subtitleColorMode: 'muted',
    subtitleCustomColor: '#94A3B8',
    subtitleAlign: 'center',

    tagsGroupVisible: true,
    tagsGroupType: 'badges',
    tagsPosition: 'below-subtitle',
    tags: 'PostgreSQL, Next.js, FastAPI, Roles Seguros',
    ratingValue: 5.0,
    ratingCount: '+500 clientes satisfechos',
    authorName: 'Ricardo Zapata',
    authorRole: 'Lead Cloud Architect',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    socialProofText: '👥 +10,000 usuarios activos',
    statusPillText: '🟢 v1.0 Production Ready',

    layoutFlow: 'text-first',
    gapTitleSubtitle: 16,
    gapTextToTags: 20,
    gapTagsToModule: 24,

    moduleVisible: true,
    moduleSize: 'normal',
    moduleScale: 1.0,
    moduleFontSize: 14,
    activeModule: 'kpi',
    chartType: 'horizontal-bars',
    code: "system.migrate({ from: 'Inventario_Final_v3.xlsx', to: 'CloudDB' });",
    codeFilename: 'system/migrate.ts',
    codeLanguage: 'typescript',
    codeShowLineNumbers: true,
    kpis: [
      { val: '99/100', label: 'OPTIMIZACIÓN & RENDIMIENTO', prefix: '', suffix: '', trend: 'up', borderTop: true },
      { val: '< 0.4s', label: 'TIEMPO DE RESPUESTA CLOUD', prefix: '', suffix: '', trend: 'down', borderTop: true },
    ],
    chartBars: [
      { label: 'Procesamiento Manual', pct: 28, color: '#EF4444' },
      { label: 'Arquitectura Automatizada', pct: 98, color: '#10B981' },
      { label: 'Disponibilidad Cloud SLA', pct: 99, color: '#6366F1' },
    ],
    chatMessages: [
      { sender: 'client', text: 'Hola, ¿cuánto cuesta desarrollar una plataforma para gestionar pedidos y clientes?', time: '10:14 AM' },
      { sender: 'bot', text: '¡Hola! Diseñamos arquitecturas web escalables y a la medida de tu operación.', time: '10:14 AM' },
    ],
    chatContactName: 'Asistente Digital',
    chatOnlineStatus: 'en línea',
    contentHighlightText: 'Automatiza tu operación y escala sin límites con software diseñado a tu medida.',
    contentHighlightStyle: 'card',
    ctaActionBadge: '⚡ SOLUCIÓN DIRECTA',
    ctaActionPhrase: 'Migra hoy tus procesos manuales a la nube y reduce tiempos de respuesta en un 60%.',
    ctaActionButtonText: 'Solicitar Sesión de Arquitectura ➔',
    ctaActionBenefit: 'Diagnóstico inicial sin costo • Despliegue en producción garantizado',
    steps: [
      { step: '01', title: 'Auditoría & Diagnóstico', desc: 'Identificamos cuellos de botella en tu operación actual.' },
      { step: '02', title: 'Arquitectura Cloud', desc: 'Diseñamos sistemas escalables en microservicios y bases seguras.' },
      { step: '03', title: 'Despliegue & Soporte', desc: 'Lanzamiento a producción con monitoreo en tiempo real.' },
    ],
    promo: {
      badge: 'OFERTA DE LANZAMIENTO',
      headline: 'Migración a la Nube con 30% OFF',
      subheadline: 'Acelera tu operación antes de cerrar el trimestre con infraestructura lista para escalar.',
      description: 'Arquitectura en microservicios, bases de datos PostgreSQL de alta disponibilidad y soporte técnico dedicado durante el primer mes.',
      code: 'CLOUD30',
      coupon: 'CLOUD30',
      discount: '30% OFF',
      cta: 'Reclamar Oferta',
      finePrint: 'Válido para proyectos contratados durante este mes.',
    },
    images: [
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80', caption: 'Dashboard Analítico Cloud' },
    ],
    imageBorderStyle: 'none',

    cta: 'Escríbenos y migramos tu operación a la nube.',
    handle: defaultBrand?.handle || 'tumarca.dev',
    ctaOrder: 'cta-first',
    ctaAlign: 'between',
    footerSize: 13,

    logoType: defaultBrand?.logoType || 'generic',
    customLogoUrl: defaultBrand?.customLogoUrl || null,
    headerShape: defaultBrand?.headerShape || 'line',
    footerShape: defaultBrand?.footerShape || 'line',

    patternEnabled: true,
    bgPattern: 'circuit',
    patternScale: 100,
    patternOpacity: 100,
    patternVignette: 'vignette',
    customPatternUrl: null,

    // Luces
    lightEnabled: true,
    lightType: 'glow',
    lightDirection: 'dual-corners-1',
    lightIntensity: 40,

    // Formas decorativas enriquecidas
    shapeEnabled: true,
    shapeType: 'glass-orbs',
    shapeCount: 6,
    shapeStyleVariant: 'glass',
    shapeGeometry: 'orbs',
    shapePlacement: 'random-edges',
    shapeProximity: 'edges',
    shapeSizeVariant: 'medium',
    shapeOpacity: 60,
    shapeSeed: 48192,
    shapeSecondaryColor: '#06B6D4',

    // Orden de Capas
    backgroundLayerOrder: 'pattern-lights-shapes',

    zoomMode: 'fit-height',
    zoomLevel: 0.5,
  });

  const updateState = (partial: Partial<PostState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  // Enrutador ligero HTML5 History API con loader fluido
  const navigateTo = useCallback((path: '/' | '/landing' | '/menu' | '/welcome' | '/editor') => {
    setIsPageTransitioning(true);
    let msg = 'Cargando...';
    if (path === '/editor') msg = 'Preparando Lienzo Ultra HQ 1080p...';
    else if (path === '/menu' || path === '/welcome') msg = 'Cargando Menú de Bienvenida...';
    else msg = 'Cargando Media Studio...';
    setTransitionMessage(msg);

    setTimeout(() => {
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
      let mode: 'landing' | 'welcome' | 'editor' = 'landing';
      if (path === '/editor') mode = 'editor';
      else if (path === '/menu' || path === '/welcome') mode = 'welcome';
      else mode = 'landing';

      setState((prev) => ({
        ...prev,
        viewMode: mode,
      }));

      setTimeout(() => {
        setIsPageTransitioning(false);
      }, 260);
    }, 180);
  }, []);

  // Listener para navegación con botones Atrás/Adelante del navegador
  useEffect(() => {
    const onPopState = () => {
      const p = window.location.pathname;
      let mode: 'landing' | 'welcome' | 'editor' = 'landing';
      if (p.startsWith('/editor')) mode = 'editor';
      else if (p.startsWith('/menu') || p.startsWith('/welcome')) mode = 'welcome';
      else mode = 'landing';

      setState((prev) => ({
        ...prev,
        viewMode: mode,
      }));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Manejador del Asistente Wizard Confirmado -> Pasa al editor con loader
  const handleConfirmWizard = (customized: Partial<PostState>) => {
    setWizardModalOpen(false);
    setIsPageTransitioning(true);
    setTransitionMessage('Ensamblando diseño en el Editor Ultra HQ...');
    setTimeout(() => {
      updateState({
        ...customized,
        viewMode: 'editor',
        activeStep: 1,
      });
      if (window.location.pathname !== '/editor') {
        window.history.pushState(null, '', '/editor');
      }
      setTimeout(() => {
        setIsPageTransitioning(false);
      }, 300);
    }, 240);
  };

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
      titleAlign: 'center',
      subtitleAlign: 'center',
      textAlign: 'center',
      ctaOrder: 'cta-first',
      ctaAlign: 'between',
      moduleScale: 1.0,
      moduleFontSize: 14,
      logoSize: 44,
      headerBrandMode: 'icon-text',
      logoAspectRatio: 'square',
      headerShowLogo: true,
      headerSize: 13,
      badgeStyle: 'pill',
      badgeColorMode: 'inherit',
      badgeCustomColor: '#4F46E5',
      footerSize: 13,
      tagsGroupVisible: false,
      tagsGroupType: 'badges',
      tagsPosition: 'below-subtitle',
      layoutFlow: 'text-first',
      gapTitleSubtitle: 16,
      gapTextToTags: 20,
      gapTagsToModule: 24,
      patternEnabled: true,
      patternOpacity: 100,
      lightEnabled: true,
      shapeEnabled: false,
      shapeType: 'none',
      lightType: 'glow',
      contentHighlightText: '',
      contentHighlightStyle: 'card',
      backgroundLayerOrder: 'pattern-lights-shapes',
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
      titleCustomColor: t.titleCustomColor || '#FFFFFF',
      titleAlign: t.titleAlign || t.textAlign || 'center',
      subtitleAlign: t.subtitleAlign || t.textAlign || 'center',
      textAlign: t.textAlign || 'center',
      subtitle: t.subtitle,
      subtitleSize: t.subtitleSize || 24,
      subtitlePos: t.subtitlePos || 'below',
      subtitleColorMode: t.subtitleColorMode || 'muted',
      subtitleCustomColor: t.subtitleCustomColor || '#94A3B8',
      tagsGroupVisible: t.tagsGroupVisible !== false,
      tagsGroupType: t.tagsGroupType || 'badges',
      tagsPosition: t.tagsPosition || 'below-subtitle',
      tags: t.tags,
      ratingValue: t.ratingValue || 5.0,
      ratingCount: t.ratingCount || '+500 clientes satisfechos',
      authorName: t.authorName || 'Ricardo Zapata',
      authorRole: t.authorRole || 'Lead Cloud Architect',
      authorAvatarUrl: t.authorAvatarUrl || prev.authorAvatarUrl,
      socialProofText: t.socialProofText || '👥 +10,000 usuarios activos',
      statusPillText: t.statusPillText || '🟢 v1.0 Production Ready',
      layoutFlow: t.layoutFlow || 'text-first',
      gapTitleSubtitle: t.gapTitleSubtitle || 16,
      gapTextToTags: t.gapTextToTags || 20,
      gapTagsToModule: t.gapTagsToModule || 24,
      cta: t.cta || 'Escríbenos y migramos tu operación a la nube.',
      handle: t.handle || '@tuempresa',
      ctaOrder: t.ctaOrder || 'cta-first',
      ctaAlign: t.ctaAlign || 'between',
      companyName: t.companyName || prev.companyName,
      headerBrandMode: t.headerBrandMode || 'icon-text',
      logoAspectRatio: t.logoAspectRatio || 'square',
      logoType: t.logoType || 'generic',
      logoSize: t.logoSize || 44,
      headerShowLogo: t.headerShowLogo !== undefined ? t.headerShowLogo : true,
      headerSize: t.headerSize || 13,
      badgeStyle: t.badgeStyle || 'pill',
      badgeColorMode: t.badgeColorMode || 'inherit',
      badgeCustomColor: t.badgeCustomColor || t.color || '#4F46E5',
      footerSize: t.footerSize || 13,
      titleFont: t.titleFont || prev.titleFont,
      subtitleFont: t.subtitleFont || prev.subtitleFont,
      color: t.color,
      currentColor: t.color,
      category: t.category,
      patternEnabled: t.patternEnabled !== false,
      bgPattern: t.bgPattern || 'circuit',
      patternScale: t.patternScale || 100,
      patternOpacity: t.patternOpacity !== undefined ? t.patternOpacity : 100,
      patternVignette: t.patternVignette || 'vignette',
      lightEnabled: t.lightEnabled !== false,
      lightType: t.lightType || 'glow',
      lightDirection: t.lightDirection || 'dual-corners-1',
      lightIntensity: t.lightIntensity !== undefined ? t.lightIntensity : 40,
      shapeEnabled: t.shapeEnabled !== false,
      shapeType: (t.shapeType || (t.accentShape === 'circles' ? 'glass-orbs' : t.accentShape === 'squares' ? 'tech-squares' : t.accentShape === 'diamonds' ? 'glass-cards' : 'glass-orbs')) as any,
      shapeStyleVariant: t.shapeStyleVariant || 'glass',
      shapeGeometry: t.shapeGeometry || 'orbs',
      shapePlacement: t.shapePlacement || 'corners',
      shapeProximity: t.shapeProximity || 'edges',
      shapeSizeVariant: t.shapeSizeVariant || 'medium',
      shapeOpacity: t.shapeOpacity !== undefined ? t.shapeOpacity : 60,
      shapeSecondaryColor: t.shapeSecondaryColor || '#06B6D4',
      backgroundLayerOrder: t.backgroundLayerOrder || 'pattern-lights-shapes',
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
      steps: t.steps || prev.steps,
      promo: t.promo || prev.promo,
      activeStep: 1,
      panelOpen: true,
    }));
  };

  // Medición del espacio disponible real en el viewport del Canvas
  const getRealAvailable = useCallback(() => {
    const el = viewportRef.current;
    if (!el) {
      const panelWidth = window.innerWidth >= 1280 ? 500 : 460;
      return {
        w: Math.max(window.innerWidth - panelWidth - 96, 240),
        h: Math.max(window.innerHeight - 170, 240),
      };
    }
    // Medición exacta del DOM: clientWidth y clientHeight reales
    const padding = window.innerWidth < 640 ? 24 : 48;
    return {
      w: Math.max(el.clientWidth - padding, 200),
      h: Math.max(el.clientHeight - padding, 200),
    };
  }, []);

  // Motor de Zoom con dimensiones reales
  const calculateZoom = useCallback((modeOrVal: 'fit-height' | 'fit-width' | '100%' | 'manual' | number) => {
    const r = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];
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
  }, [state.aspectRatio, getRealAvailable]);

  const handleZoomChange = (modeOrVal: 'fit-height' | 'fit-width' | '100%' | 'manual' | number) => {
    const res = calculateZoom(modeOrVal);
    setState((prev) => ({ ...prev, zoomMode: res.mode, zoomLevel: res.level }));
  };

  // Recalcular zoom cuando cambia la proporción de aspecto
  useEffect(() => {
    const res = calculateZoom(state.zoomMode);
    setState((prev) => ({ ...prev, zoomLevel: res.level }));
  }, [state.aspectRatio, calculateZoom]);

  // Observer reactivo para que siempre se adapte al espacio disponible real
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setState((prev) => {
        if (prev.zoomMode === 'fit-height' || prev.zoomMode === 'fit-width') {
          const res = calculateZoom(prev.zoomMode);
          if (Math.abs(res.level - prev.zoomLevel) > 0.005) {
            return { ...prev, zoomLevel: res.level };
          }
        }
        return prev;
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [calculateZoom]);

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
  }, [state.viewMode]);

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

  const r = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];
  const scaledW = Math.round(r.nativeW * state.zoomLevel);
  const scaledH = Math.round(r.nativeH * state.zoomLevel);

  // =========================================================================
  // PÁGINA 1: LANDING PAGE DE PRESENTACIÓN
  // =========================================================================
  if (state.viewMode === 'landing') {
    return (
      <div className="h-full w-full overflow-hidden bg-[#050811] relative select-none animate-page-enter">
        <PageTransitionLoader isLoading={isPageTransitioning} message={transitionMessage} />

        <LandingScreen
          onStartWizard={() => setWizardModalOpen(true)}
          onOpenTemplates={() => {
            navigateTo('/menu');
            setTemplatesModalOpen(true);
          }}
          onGoWelcome={() => navigateTo('/menu')}
        />

        <CreationWizardModal
          isOpen={wizardModalOpen}
          onClose={() => setWizardModalOpen(false)}
          onConfirmAndOpenEditor={handleConfirmWizard}
          currentState={state}
        />
      </div>
    );
  }

  // =========================================================================
  // PÁGINA 2: MENÚ DE BIENVENIDA Y CATÁLOGO DE PLANTILLAS
  // =========================================================================
  if (state.viewMode === 'welcome') {
    return (
      <div className="h-full w-full overflow-hidden bg-[#070A0F] relative select-none animate-page-enter">
        <PageTransitionLoader isLoading={isPageTransitioning} message={transitionMessage} />

        <WelcomeScreen
          onStartFromScratch={handleStartFromScratch}
          onOpenTemplates={() => setTemplatesModalOpen(true)}
          onOpenWizard={() => setWizardModalOpen(true)}
          onGoLanding={() => navigateTo('/landing')}
          savedBrandName={defaultBrand?.name || defaultBrand?.companyName}
        />

        <CreationWizardModal
          isOpen={wizardModalOpen}
          onClose={() => setWizardModalOpen(false)}
          onConfirmAndOpenEditor={handleConfirmWizard}
          currentState={state}
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
  // PÁGINA 3: EDITOR (PANEL LATERAL FIJO EN EL FLUJO + CANVAS CENTRADO)
  // =========================================================================
  return (
    <div className="h-full w-full flex overflow-hidden bg-[#070A0F] select-none animate-page-enter">
      <PageTransitionLoader isLoading={isPageTransitioning} message={transitionMessage} />
      
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
        
        {/* TOP NAVBAR */}
        <TopNavbar
          aspectRatio={state.aspectRatio}
          onAspectRatioChange={(ratio) => updateState({ aspectRatio: ratio })}
          zoomMode={state.zoomMode}
          zoomLevel={state.zoomLevel}
          onZoomChange={handleZoomChange}
          onGoHome={() => navigateTo('/menu')}
          onOpenWizard={() => setWizardModalOpen(true)}
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

      {/* Modal de Éxito de Exportación y Apoyo Ko-fi */}
      <ExportSuccessModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        dataUrl={exportedDataUrl}
        filename={exportedFilename}
        resolution={r.px}
      />

      {/* Modal Asistente de Creación por Pasos Reutilizable desde el Editor */}
      <CreationWizardModal
        isOpen={wizardModalOpen}
        onClose={() => setWizardModalOpen(false)}
        onConfirmAndOpenEditor={handleConfirmWizard}
        currentState={state}
      />

    </div>
  );
};
