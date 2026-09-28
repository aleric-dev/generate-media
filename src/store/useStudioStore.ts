import { create } from 'zustand';
import { toast as sonnerToast } from 'sonner';
import { PostState, PostTemplate, BrandProfile } from '../types';
import { getDefaultBrand, setActiveBrandId as persistActiveBrandId } from '../utils/brandStorage';

const getInitialDefaultBrand = (): BrandProfile | null => {
  if (typeof window === 'undefined') return null;
  return getDefaultBrand();
};

const defaultBrand = getInitialDefaultBrand();

export const initialPostState: PostState = {
  viewMode: 'landing',
  activeStep: 1,
  panelOpen: true,

  canvasMode: 'dark',
  currentColor: defaultBrand?.primaryColor || '#4F46E5',
  category: '',
  aspectRatio: '4:5',

  titleFont: defaultBrand?.titleFont || 'font-space-mono',
  subtitleFont: defaultBrand?.subtitleFont || 'font-inter',

  companyName: defaultBrand?.companyName || '',
  headerBrandMode: defaultBrand?.headerBrandMode || 'icon-text',
  brandIcon: defaultBrand?.brandIcon || 'terminal',
  logoAspectRatio: 'square',
  headerShowLogo: true,
  headerSize: 13,
  logoSize: 44,
  badgeStyle: 'pill',
  badgeColorMode: 'inherit',
  badgeCustomColor: '#4F46E5',

  title: '',
  titleSize: 48,
  titleColorMode: 'contrast',
  titleCustomColor: '#FFFFFF',
  titleAlign: 'center',
  textAlign: 'center',
  subtitle: '',
  subtitleSize: 24,
  subtitlePos: 'below',
  subtitleColorMode: 'muted',
  subtitleCustomColor: '#94A3B8',
  subtitleAlign: 'center',

  tagsGroupVisible: false,
  tagsGroupType: 'badges',
  tagsPosition: 'below-subtitle',
  tags: '',
  tagsSize: 14,
  tagsAlign: 'center',
  tagsColorMode: 'inherit',
  tagsCustomColor: '#4F46E5',
  ratingValue: 5.0,
  ratingCount: '',
  authorName: '',
  authorRole: '',
  authorAvatarUrl: '',
  socialProofText: '',
  statusPillText: '',
  metricChipHighlight: '',
  metricChipLabel: '',

  layoutFlow: 'text-first',
  contentBlockOrder: ['tags', 'title', 'subtitle', 'module'],
  gapContentBlocks: 18,
  gapTitleSubtitle: 16,
  gapTextToTags: 20,
  gapTagsToModule: 24,

  moduleVisible: false,
  moduleSize: 'normal',
  moduleScale: 100,
  moduleFontSize: 14,
  moduleMarginTop: 0,
  moduleContainerStyle: 'minimal',
  modulePadding: 0,
  chartTitleAlign: 'left',
  activeModule: 'kpi',
  chartType: 'horizontal-bars',
  code: "system.migrate({ from: 'Inventario_Final_v3.xlsx', to: 'CloudDB' });",
  codeFilename: 'system/migrate.ts',
  codeLanguage: 'typescript',
  codeShowLineNumbers: true,
  codeFontSize: 13,
  codeWindowStyle: 'macos',
  moduleKpiGap: 18,
  moduleKpiCols: 'auto',
  chartBarHeight: 18,
  chartLineSeries: 1,
  chartLineStroke: 4,
  chartLineHeight: 200,
  chartLineHeightPct: 50,
  chartLineWidthPct: 75,
  chartLineCurved: false,
  chartLineShowGrid: true,
  chartDonutText: '',
  chartDonutHeroText: '',
  chartDonutThickness: 'medium',
  quoteCtaMode: 'cta',
  stepsGap: 16,
  stepsFormat: 'fase',
  imageAspectRatio: 'auto',
  imageFit: 'cover',
  kpis: [
    { val: '99/100', label: 'OPTIMIZACIÓN & RENDIMIENTO', prefix: '', suffix: '', trend: 'up', borderTop: true },
    { val: '< 0.4s', label: 'TIEMPO DE RESPUESTA CLOUD', prefix: '', suffix: '', trend: 'down', borderTop: true },
  ],
  chartBars: [
    { label: 'Procesamiento Manual', pct: 28, color: '#4F46E5' },
    { label: 'Arquitectura Automatizada', pct: 98, color: '#EAB308' },
    { label: 'Disponibilidad Cloud SLA', pct: 99, color: '#EF4444' },
  ],
  chartBarHighlightMode: 'normal',
  chartBarsGap: 22,
  chartPieSlices: [
    { label: 'Frontend', pct: 40, color: '#4F46E5' },
    { label: 'Backend & Cloud', pct: 35, color: '#EAB308' },
    { label: 'DevOps & CI/CD', pct: 25, color: '#EF4444' },
  ],
  chartLinePoints: [
    { label: 'Ene', pct: 25 },
    { label: 'Feb', pct: 45 },
    { label: 'Mar', pct: 60 },
    { label: 'Abr', pct: 80 },
    { label: 'May', pct: 95 },
    { label: 'Jun', pct: 110 },
  ],
  chatMessages: [
    { sender: 'client', text: 'Hola, ¿cuánto cuesta desarrollar una plataforma para gestionar pedidos y clientes?', time: '10:14 AM' },
    { sender: 'bot', text: '¡Hola! Diseñamos arquitecturas web escalables y a la medida de tu operación.', time: '10:14 AM' },
  ],
  chatContactName: 'Asistente Digital',
  chatOnlineStatus: 'en línea',
  contentHighlightText: '',
  contentHighlightAuthor: '',
  contentHighlightRole: '',
  contentHighlightStyle: 'card',
  ctaActionBadge: '⚡ SOLUCIÓN DIRECTA',
  ctaActionPhrase: '',
  ctaActionButtonText: 'Solicitar Sesión de Arquitectura ➔',
  ctaActionBenefit: '',
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

  comparisonBadgeLeft: 'ANTES',
  comparisonTitleLeft: 'Procesos Manuales & Excel',
  comparisonPointsLeft: [
    'Datos duplicados y fórmulas rotas',
    'Cero control de accesos por roles',
    'Reportes tardíos de 3 a 5 días'
  ],
  comparisonBadgeRight: 'HOY',
  comparisonTitleRight: 'Plataforma Web a Medida',
  comparisonPointsRight: [
    'Base de datos PostgreSQL en tiempo real',
    'Seguridad RBAC y auditoría total',
    'Métricas automáticas con 1 clic'
  ],
  comparisonLayout: 'split',

  notificationApp: 'Aleric Platform',
  notificationTitle: 'Despliegue a Producción',
  notificationMessage: 'Pipeline CI/CD completado. Base de datos migrada con éxito.',
  notificationHighlight: '+1,420 transacciones procesadas',
  notificationTime: 'hace 2 min',
  notificationIcon: 'rocket',

  cta: '',
  handle: defaultBrand?.handle || '',
  ctaOrder: 'cta-first',
  ctaAlign: 'between',
  footerSize: 13,

  logoType: defaultBrand?.logoType || 'generic',
  customLogoUrl: defaultBrand?.customLogoUrl || null,
  headerShape: defaultBrand?.headerShape || 'line',
  footerShape: defaultBrand?.footerShape || 'line',

  patternEnabled: true,
  bgPattern: 'grid',
  patternScale: 100,
  patternOpacity: 100,
  patternVignette: 'gradient-diagonal',
  customPatternUrl: null,

  fullBgType: 'none',
  customWallpaperUrl: null,
  wallpaperOpacity: 100,
  wallpaperBlur: 0,

  // Luces
  lightEnabled: true,
  lightType: 'glow',
  lightDirection: 'dual-corners-1',
  lightIntensity: 40,

  // Formas decorativas (desactivadas por defecto)
  shapeEnabled: false,
  shapesEnabled: false,
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
  shapeIconCategory: 'tech',

  backgroundLayerOrder: 'pattern-lights-shapes',
  zoomMode: 'fit-height',
  zoomLevel: 0.5,
};

export const extractSavableState = (state: PostState): Partial<PostState> => {
  const {
    viewMode,
    activeStep,
    panelOpen,
    zoomLevel,
    zoomMode,
    ...rest
  } = state;
  return rest;
};

interface StudioStore {
  postState: PostState;
  currentProjectId: string | null;
  currentProjectName: string | null;
  lastSavedSnapshot: string | null;
  setCurrentProject: (id: string | null, name: string | null, snapshot?: string | null) => void;
  setLastSavedSnapshot: (snapshot: string | null) => void;
  recordCurrentSnapshot: () => void;
  updatePostState: (partial: Partial<PostState>) => void;

  // Marca Activa
  activeBrandId: string | null;
  setActiveBrandId: (id: string | null) => void;

  // Modales
  templatesModalOpen: boolean;
  setTemplatesModalOpen: (open: boolean) => void;
  wizardModalOpen: boolean;
  setWizardModalOpen: (open: boolean) => void;
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;

  // Estado de exportación
  isExporting: boolean;
  setIsExporting: (exporting: boolean) => void;
  exportStatus: string;
  setExportStatus: (status: string) => void;
  exportedDataUrl: string | null;
  setExportedDataUrl: (url: string | null) => void;
  exportedFilename: string;
  setExportedFilename: (filename: string) => void;

  // Notificaciones Toast
  toast: { id: number; message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;

  // Modo Carrusel (Multi-Slide)
  slides: PostState[];
  activeSlideIndex: number;
  setActiveSlideIndex: (index: number) => void;
  addSlide: (templateType?: 'duplicate' | 'blank' | 'comparison' | 'kpi' | 'code' | 'cta') => void;
  duplicateSlide: (index?: number) => void;
  removeSlide: (index: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  resetCarousel: () => void;

  // Acciones de alto nivel
  applyTemplate: (tpl: PostTemplate) => void;
  applyBrandProfile: (brand: BrandProfile) => void;
  resetToScratch: () => void;
  setZoom: (level: number, mode?: 'fit-height' | 'fit-width' | 'manual') => void;
  loadProjectState: (projectState: PostState, projectId?: string | null, projectName?: string | null) => void;
}

export const useStudioStore = create<StudioStore>((set, get) => ({
  postState: initialPostState,

  activeBrandId: defaultBrand?.id || null,
  setActiveBrandId: (id) => {
    persistActiveBrandId(id);
    set({ activeBrandId: id });
  },

  currentProjectId: null,
  currentProjectName: null,
  lastSavedSnapshot: null,
  setCurrentProject: (id, name, snapshot) =>
    set((state) => ({
      currentProjectId: id,
      currentProjectName: name,
      lastSavedSnapshot:
        snapshot !== undefined ? snapshot : JSON.stringify(extractSavableState(state.postState)),
    })),
  setLastSavedSnapshot: (snapshot) => set({ lastSavedSnapshot: snapshot }),
  recordCurrentSnapshot: () =>
    set((state) => ({
      lastSavedSnapshot: JSON.stringify(extractSavableState(state.postState)),
    })),

  slides: [initialPostState],
  activeSlideIndex: 0,

  setActiveSlideIndex: (index) =>
    set((state) => {
      if (index < 0 || index >= state.slides.length) return state;
      return {
        activeSlideIndex: index,
        postState: { ...state.slides[index] },
      };
    }),

  addSlide: (templateType = 'duplicate') =>
    set((state) => {
      if (state.slides.length >= 10) {
        sonnerToast.info('El límite máximo para carruseles es de 10 diapositivas.');
        return state;
      }
      const current = state.postState;
      let newSlide: PostState;

      if (templateType === 'comparison') {
        newSlide = {
          ...current,
          title: 'El antes y el después de nuestra solución',
          subtitle: 'Compara el impacto de modernizar tu stack tecnológico con Aleric.',
          activeModule: 'comparison',
          moduleVisible: true,
          comparisonBadgeLeft: 'ANTES',
          comparisonTitleLeft: 'Operación Manual & Excel',
          comparisonPointsLeft: [
            'Procesos lentos y desarticulados',
            'Falta de visibilidad de datos',
            'Errores humanos recurrentes'
          ],
          comparisonBadgeRight: 'HOY',
          comparisonTitleRight: 'Operación Automatizada',
          comparisonPointsRight: [
            'Flujos 100% integrados y en la nube',
            'Dashboard analítico en tiempo real',
            'Cero fricción y soporte continuo'
          ]
        };
      } else if (templateType === 'kpi') {
        newSlide = {
          ...current,
          title: 'Resultados comprobados en producción',
          subtitle: 'Métricas de tracción y rendimiento tras 90 días de implementación.',
          activeModule: 'kpi',
          moduleVisible: true,
          kpis: [
            { val: '+180%', label: 'INCREMENTO DE EFICIENCIA', prefix: '', suffix: '', trend: 'up', borderTop: true },
            { val: '99.9%', label: 'DISPONIBILIDAD DE SERVICIO', prefix: '', suffix: '', trend: 'up', borderTop: true },
          ]
        };
      } else if (templateType === 'code') {
        newSlide = {
          ...current,
          title: 'Arquitectura escalable en pocas líneas',
          subtitle: 'Diseñado bajo estándares de ingeniería de alto rendimiento.',
          activeModule: 'code',
          moduleVisible: true,
          code: 'const aleric = new EnterprisePlatform({\n  cloud: true,\n  security: "RBAC",\n  automation: true\n});\naleric.scale();',
          codeFilename: 'enterprise.ts',
          codeLanguage: 'typescript'
        };
      } else if (templateType === 'cta') {
        newSlide = {
          ...current,
          title: '¿Listo para llevar tu empresa al siguiente nivel?',
          subtitle: 'Agenda una sesión de arquitectura técnica con nuestro equipo.',
          activeModule: 'quote-cta',
          quoteCtaMode: 'cta',
          moduleVisible: true,
          ctaActionPhrase: 'Escríbenos hoy y construyamos la solución digital que tu operación necesita.',
          ctaActionButtonText: 'Agendar Consulta ➔'
        };
      } else {
        // 'duplicate'
        newSlide = { ...current };
      }

      const nextSlides = [...state.slides, newSlide];
      const nextIndex = nextSlides.length - 1;
      sonnerToast.success(`Diapositiva #${nextIndex + 1} añadida al carrusel`);
      return {
        slides: nextSlides,
        activeSlideIndex: nextIndex,
        postState: newSlide,
      };
    }),

  duplicateSlide: (index) =>
    set((state) => {
      if (state.slides.length >= 10) {
        sonnerToast.info('Límite máximo de 10 diapositivas alcanzado.');
        return state;
      }
      const targetIndex = index !== undefined ? index : state.activeSlideIndex;
      const targetSlide = state.slides[targetIndex] || state.postState;
      const duplicated: PostState = { ...targetSlide };
      const nextSlides = [...state.slides];
      nextSlides.splice(targetIndex + 1, 0, duplicated);
      const nextIndex = targetIndex + 1;
      sonnerToast.success(`Diapositiva #${nextIndex + 1} duplicada con éxito`);
      return {
        slides: nextSlides,
        activeSlideIndex: nextIndex,
        postState: duplicated,
      };
    }),

  removeSlide: (index) =>
    set((state) => {
      if (state.slides.length <= 1) {
        sonnerToast.error('El carrusel debe tener al menos una diapositiva.');
        return state;
      }
      const nextSlides = state.slides.filter((_, i) => i !== index);
      let nextIndex = state.activeSlideIndex;
      if (index <= state.activeSlideIndex) {
        nextIndex = Math.max(0, state.activeSlideIndex - 1);
      }
      if (nextIndex >= nextSlides.length) {
        nextIndex = nextSlides.length - 1;
      }
      sonnerToast.info(`Diapositiva eliminada`);
      return {
        slides: nextSlides,
        activeSlideIndex: nextIndex,
        postState: { ...nextSlides[nextIndex] },
      };
    }),

  reorderSlides: (fromIndex, toIndex) =>
    set((state) => {
      if (fromIndex === toIndex) return state;
      const nextSlides = [...state.slides];
      const [moved] = nextSlides.splice(fromIndex, 1);
      nextSlides.splice(toIndex, 0, moved);
      return {
        slides: nextSlides,
        activeSlideIndex: toIndex,
        postState: { ...nextSlides[toIndex] },
      };
    }),

  resetCarousel: () =>
    set((state) => ({
      slides: [{ ...state.postState }],
      activeSlideIndex: 0,
    })),

  updatePostState: (partial) =>
    set((state) => {
      const nextPostState = { ...state.postState, ...partial };
      const nextSlides = [...state.slides];
      if (nextSlides[state.activeSlideIndex]) {
        nextSlides[state.activeSlideIndex] = nextPostState;
      } else {
        nextSlides[0] = nextPostState;
      }
      return {
        postState: nextPostState,
        slides: nextSlides,
      };
    }),

  loadProjectState: (projectState, projectId = null, projectName = null) => {
    const finalState: PostState = {
      ...initialPostState,
      ...projectState,
      viewMode: 'editor',
    };
    set({
      postState: finalState,
      slides: [finalState],
      activeSlideIndex: 0,
      currentProjectId: projectId,
      currentProjectName: projectName,
      lastSavedSnapshot: projectId ? JSON.stringify(extractSavableState(finalState)) : null,
    });
  },

  templatesModalOpen: false,
  setTemplatesModalOpen: (open) => set({ templatesModalOpen: open }),

  wizardModalOpen: false,
  setWizardModalOpen: (open) => set({ wizardModalOpen: open }),

  exportModalOpen: false,
  setExportModalOpen: (open) => set({ exportModalOpen: open }),

  isExporting: false,
  setIsExporting: (isExporting) => set({ isExporting }),

  exportStatus: '100% idéntico a pantalla',
  setExportStatus: (exportStatus) => set({ exportStatus }),

  exportedDataUrl: null,
  setExportedDataUrl: (exportedDataUrl) => set({ exportedDataUrl }),

  exportedFilename: '',
  setExportedFilename: (exportedFilename) => set({ exportedFilename }),

  // Notificaciones Toast
  toast: null,
  showToast: (message, type = 'success') => {
    if (type === 'error') {
      sonnerToast.error(message);
    } else if (type === 'info') {
      sonnerToast.info(message);
    } else {
      sonnerToast.success(message);
    }
  },
  hideToast: () => sonnerToast.dismiss(),

  applyTemplate: (tpl) =>
    set((state) => {
      const updatedPostState: PostState = {
        ...state.postState,
        title: tpl.title,
        subtitle: tpl.subtitle,
        titleFont: tpl.titleFont || state.postState.titleFont,
        subtitleFont: tpl.subtitleFont || state.postState.subtitleFont,
        currentColor: tpl.color || state.postState.currentColor,
        category: tpl.category || state.postState.category,
        bgPattern: 'grid',
        patternEnabled: true,
        patternScale: 100,
        patternVignette: 'gradient-diagonal',
        shapeEnabled: false,
        shapesEnabled: false,
        lightEnabled: true,
        lightsEnabled: true,
        lightType: 'glow',
        lightDirection: 'dual-corners-1',
        fullBgType: 'none',
        activeModule: tpl.module || 'code',
        code: tpl.code || state.postState.code,
        codeFilename: tpl.codeFilename || state.postState.codeFilename,
        codeLanguage: tpl.codeLanguage || state.postState.codeLanguage,
        kpis: tpl.kpis || state.postState.kpis,
        chartBars: tpl.chartBars || state.postState.chartBars,
        chatMessages: tpl.chatMessages || state.postState.chatMessages,
        steps: tpl.steps || state.postState.steps,
        promo: tpl.promo || state.postState.promo,
        tags: tpl.tags || state.postState.tags,
        tagsGroupVisible: tpl.tagsGroupVisible ?? state.postState.tagsGroupVisible,
        tagsGroupType: tpl.tagsGroupType || state.postState.tagsGroupType,
        ratingValue: tpl.ratingValue ?? state.postState.ratingValue,
        ratingCount: tpl.ratingCount || state.postState.ratingCount,
        authorName: tpl.authorName || state.postState.authorName,
        authorRole: tpl.authorRole || state.postState.authorRole,
        socialProofText: tpl.socialProofText || state.postState.socialProofText,
        statusPillText: tpl.statusPillText || '🟢 Production Ready',
        ctaActionBadge: tpl.ctaActionBadge || state.postState.ctaActionBadge,
        ctaActionPhrase: tpl.ctaActionPhrase || state.postState.ctaActionPhrase,
        ctaActionButtonText: tpl.ctaActionButtonText || state.postState.ctaActionButtonText,
        ctaActionBenefit: tpl.ctaActionBenefit || state.postState.ctaActionBenefit,
        contentHighlightText: tpl.contentHighlightText || state.postState.contentHighlightText,
        contentHighlightStyle: tpl.contentHighlightStyle || state.postState.contentHighlightStyle,
        cta: tpl.cta || state.postState.cta,
        moduleVisible: true,
        activeStep: 1 as const,
      };

      const nextSlides = [...state.slides];
      if (nextSlides[state.activeSlideIndex]) {
        nextSlides[state.activeSlideIndex] = updatedPostState;
      } else {
        nextSlides[0] = updatedPostState;
      }

      return {
        postState: updatedPostState,
        slides: nextSlides,
        currentProjectId: null,
        currentProjectName: null,
        lastSavedSnapshot: null,
        templatesModalOpen: false,
      };
    }),

  applyBrandProfile: (brand) => {
    persistActiveBrandId(brand.id);
    set((state) => {
      const brandUpdates = {
        companyName: brand.companyName,
        handle: brand.handle,
        logoType: brand.logoType,
        customLogoUrl: brand.customLogoUrl || null,
        currentColor: brand.primaryColor,
        titleFont: brand.titleFont || state.postState.titleFont,
        subtitleFont: brand.subtitleFont || state.postState.subtitleFont,
        headerBrandMode: brand.headerBrandMode || state.postState.headerBrandMode,
        headerShape: brand.headerShape || state.postState.headerShape,
        footerShape: brand.footerShape || state.postState.footerShape,
      };

      // Actualizar slide actual y sincronizar todas las slides del carrusel con la identidad de marca
      const updatedPostState = {
        ...state.postState,
        ...brandUpdates,
      };

      const updatedSlides = state.slides.map((s) => ({
        ...s,
        ...brandUpdates,
      }));

      return {
        activeBrandId: brand.id,
        postState: updatedPostState,
        slides: updatedSlides,
      };
    });
  },

  resetToScratch: () =>
    set((state) => {
      const brand = getDefaultBrand();
      const cleanState: PostState = {
        ...state.postState,
        title: '',
        subtitle: '',
        category: '',
        tags: '',
        tagsGroupVisible: false,
        cta: '',
        handle: brand?.handle || '',
        companyName: brand?.companyName || '',
        currentColor: brand?.primaryColor || state.postState.currentColor,
        titleFont: brand?.titleFont || state.postState.titleFont,
        subtitleFont: brand?.subtitleFont || state.postState.subtitleFont,
        brandIcon: brand?.brandIcon || state.postState.brandIcon,
        headerBrandMode: brand?.headerBrandMode || state.postState.headerBrandMode,
        logoType: brand?.logoType || state.postState.logoType,
        customLogoUrl: brand?.customLogoUrl || null,
        headerShape: brand?.headerShape || state.postState.headerShape,
        footerShape: brand?.footerShape || state.postState.footerShape,
        ratingCount: '',
        authorName: '',
        authorRole: '',
        authorAvatarUrl: '',
        socialProofText: '',
        statusPillText: '',
        metricChipHighlight: '',
        metricChipLabel: '',
        contentHighlightText: '',
        ctaActionPhrase: '',
        moduleVisible: false,
        activeStep: 1,
        panelOpen: true,
      };
      return {
        postState: cleanState,
        slides: [cleanState],
        activeSlideIndex: 0,
        currentProjectId: null,
        currentProjectName: null,
        lastSavedSnapshot: null,
      };
    }),

  setZoom: (level, mode) =>
    set((state) => ({
      postState: {
        ...state.postState,
        zoomLevel: level,
        zoomMode: mode || state.postState.zoomMode,
      },
    })),
}));
