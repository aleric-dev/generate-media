import { create } from 'zustand';
import { PostState, PostTemplate, BrandProfile } from '../types';
import { getDefaultBrand } from '../utils/brandStorage';

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
  category: 'DESARROLLO A LA MEDIDA',
  aspectRatio: '4:5',

  titleFont: defaultBrand?.titleFont || 'font-space-mono',
  subtitleFont: defaultBrand?.subtitleFont || 'font-inter',

  companyName: defaultBrand?.companyName || 'Tu Empresa',
  headerBrandMode: defaultBrand?.headerBrandMode || 'icon-text',
  brandIcon: defaultBrand?.brandIcon || 'terminal',
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
  tagsSize: 14,
  tagsAlign: 'center',
  tagsColorMode: 'inherit',
  tagsCustomColor: '#4F46E5',
  ratingValue: 5.0,
  ratingCount: '+500 clientes satisfechos',
  authorName: 'Ricardo Zapata',
  authorRole: 'Lead Cloud Architect',
  authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  socialProofText: '👥 +10,000 usuarios activos',
  statusPillText: '🟢 Production Ready',
  metricChipHighlight: '⚡ +450% ARR',
  metricChipLabel: 'Crecimiento Cloud Verificado',

  layoutFlow: 'text-first',
  contentBlockOrder: ['tags', 'title', 'subtitle', 'module'],
  gapContentBlocks: 18,
  gapTitleSubtitle: 16,
  gapTextToTags: 20,
  gapTagsToModule: 24,

  moduleVisible: true,
  moduleSize: 'normal',
  moduleScale: 100,
  moduleFontSize: 14,
  moduleContainerStyle: 'glass',
  activeModule: 'kpi',
  chartType: 'horizontal-bars',
  code: "system.migrate({ from: 'Inventario_Final_v3.xlsx', to: 'CloudDB' });",
  codeFilename: 'system/migrate.ts',
  codeLanguage: 'typescript',
  codeShowLineNumbers: true,
  codeFontSize: 13,
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
  contentHighlightAuthor: 'Ricardo Zapata',
  contentHighlightRole: 'Lead Cloud Architect',
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
  patternVignette: 'none',
  customPatternUrl: null,

  // Luces
  lightEnabled: true,
  lightType: 'glow',
  lightDirection: 'dual-corners-1',
  lightIntensity: 40,

  // Formas decorativas
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

  backgroundLayerOrder: 'pattern-lights-shapes',
  zoomMode: 'fit-height',
  zoomLevel: 0.5,
};

interface StudioStore {
  // Estado del post
  postState: PostState;
  updatePostState: (partial: Partial<PostState>) => void;

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

  // Acciones de alto nivel
  applyTemplate: (tpl: PostTemplate) => void;
  applyBrandProfile: (brand: BrandProfile) => void;
  resetToScratch: () => void;
  setZoom: (level: number, mode?: 'fit-height' | 'fit-width' | 'manual') => void;
}

export const useStudioStore = create<StudioStore>((set) => ({
  postState: initialPostState,

  updatePostState: (partial) =>
    set((state) => ({
      postState: { ...state.postState, ...partial },
    })),

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

  applyTemplate: (tpl) =>
    set((state) => ({
      postState: {
        ...state.postState,
        title: tpl.title,
        subtitle: tpl.subtitle,
        titleFont: tpl.titleFont || state.postState.titleFont,
        subtitleFont: tpl.subtitleFont || state.postState.subtitleFont,
        currentColor: tpl.color || state.postState.currentColor,
        category: tpl.category || state.postState.category,
        bgPattern: tpl.bgPattern || state.postState.bgPattern,
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
        activeStep: 1,
      },
      templatesModalOpen: false,
    })),

  applyBrandProfile: (brand) =>
    set((state) => ({
      postState: {
        ...state.postState,
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
      },
    })),

  resetToScratch: () =>
    set((state) => ({
      postState: {
        ...state.postState,
        title: '',
        subtitle: '',
        tags: '',
        cta: '',
        handle: '',
        moduleVisible: false,
        activeStep: 1,
        panelOpen: true,
      },
    })),

  setZoom: (level, mode) =>
    set((state) => ({
      postState: {
        ...state.postState,
        zoomLevel: level,
        zoomMode: mode || state.postState.zoomMode,
      },
    })),
}));
