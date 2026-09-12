export type AspectRatioKey = '4:5' | '1:1' | '9:16' | '16:9';

export interface AspectRatioConfig {
  nativeW: number;
  nativeH: number;
  px: string;
  label: string;
}

export type ModuleType = 'kpi' | 'chart' | 'chat' | 'image' | 'text' | 'steps' | 'promo' | 'cta' | 'code';

export type ChartType = 'horizontal-bars' | 'pie' | 'line';

export type LogoType = 'generic' | 'monogram' | 'text' | 'aleric' | 'custom';

export type HeaderBrandMode = 'icon-text' | 'only-text' | 'only-logo' | 'logo-text';

export type LogoAspectRatio = 'square' | 'horizontal' | 'vertical' | 'auto';

export type BadgeStyle = 'pill' | 'bracket' | 'neon' | 'glass' | 'minimal-dot';

export type BadgeColorMode = 'inherit' | 'contrast' | 'custom';

export type TagsGroupType = 'badges' | 'rating' | 'author' | 'social-proof' | 'status-pill';

export type TagsPosition = 'above-title' | 'below-subtitle';

export type LayoutFlow = 'text-first' | 'content-first';

export type TitleColorMode = 'contrast' | 'category' | 'custom';

export type SubtitleColorMode = 'muted' | 'contrast' | 'category' | 'custom' | 'dimmed';

export type TextAlign = 'left' | 'center' | 'right';

export type CtaOrder = 'cta-first' | 'handle-first';

export type CtaAlign = 'left' | 'center' | 'right' | 'between';

export type SubtitlePos = 'below' | 'above';

export type ModuleSize = 'compact' | 'normal' | 'spacious';

export type ImageBorderStyle = 'none' | 'rounded' | 'glass' | 'neon' | 'double' | 'dashed' | 'shadow' | 'raw';

export type HeaderShape = 'line' | 'pill' | 'card' | 'minimal' | 'accent-bar' | 'floating-dock' | 'bracket-frame' | 'neon-glow';

export type FooterShape = 'line' | 'card' | 'pill' | 'minimal' | 'accent-bar' | 'floating-dock' | 'bracket-frame' | 'neon-glow';

export type PatternType = 
  | 'circuit' 
  | 'hexagons' 
  | 'matrix' 
  | 'neural' 
  | 'isometric' 
  | 'grid' 
  | 'dots' 
  | 'waves' 
  | 'diagonal' 
  | 'topographic' 
  | 'noise' 
  | 'custom' 
  | 'none';

export type PatternVignette = 
  | 'none' 
  | 'vignette' 
  | 'gradient-top' 
  | 'gradient-bottom' 
  | 'gradient-lateral' 
  | 'mask-center';

// Luces ambientales independientes
export type LightType = 'glow' | 'spotlight' | 'aurora' | 'dual-beams' | 'none';

export type LightDirection = 
  | 'dual-corners-1' 
  | 'dual-corners-2' 
  | 'four-corners' 
  | 'top' 
  | 'bottom' 
  | 'sides' 
  | 'center';

// Formas geométricas decorativas enriquecidas
export type ShapeType = string;
export type ShapeStyleVariant = 'glass' | 'flat' | 'pastel' | 'neon-outline' | 'duotone';

export type ShapeGeometry = 'orbs' | 'squares' | 'diamonds' | 'triangles' | 'tech-code' | 'abstract';

export type ShapePlacement = 
  | 'corners' 
  | 'periphery' 
  | 'sides' 
  | 'random-edges';

export type ShapeProximity = 'edges' | 'balanced' | 'close';

export type ShapeSizeVariant = 'small' | 'medium' | 'large';

export type BackgroundLayerOrder = 
  | 'pattern-lights-shapes' 
  | 'pattern-shapes-lights' 
  | 'lights-pattern-shapes' 
  | 'shapes-pattern-lights';

export interface KPICard {
  val: string;
  label: string;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'none';
  borderTop?: boolean;
}

export interface ChartBar {
  label: string;
  pct: number;
  color?: string;
}

export interface ChatMessage {
  sender: 'client' | 'bot';
  text: string;
  time: string;
}

export interface CustomImage {
  url: string;
  caption?: string;
}

export interface StepItem {
  stepNumber?: number;
  step?: string;
  title: string;
  desc?: string;
  description?: string;
}

export interface PromoData {
  badge?: string;
  headline?: string;
  title?: string;
  subheadline?: string;
  subtitle?: string;
  description?: string;
  code?: string;
  coupon?: string;
  discount?: string;
  cta?: string;
  bullets?: string[];
  finePrint?: string;
}

export interface PostTemplate {
  id: string;
  category: string;
  color: string;
  companyName: string;
  logoType?: LogoType;
  logoSize?: number;
  headerBrandMode?: HeaderBrandMode;
  logoAspectRatio?: LogoAspectRatio;
  headerShowLogo?: boolean;
  headerSize?: number;
  badgeStyle?: BadgeStyle;
  badgeColorMode?: BadgeColorMode;
  badgeCustomColor?: string;
  titleFont?: string;
  subtitleFont?: string;
  title: string;
  titleSize?: number;
  titleColor?: TitleColorMode;
  titleCustomColor?: string;
  titleAlign?: TextAlign;
  subtitleAlign?: TextAlign;
  textAlign?: TextAlign;
  subtitle: string;
  subtitleSize?: number;
  subtitlePos?: SubtitlePos;
  subtitleColorMode?: SubtitleColorMode;
  subtitleCustomColor?: string;
  tagsGroupVisible?: boolean;
  tagsGroupType?: TagsGroupType;
  tagsPosition?: TagsPosition;
  tags: string;
  ratingValue?: number;
  ratingCount?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatarUrl?: string;
  socialProofText?: string;
  statusPillText?: string;
  layoutFlow?: LayoutFlow;
  gapTitleSubtitle?: number;
  gapTextToTags?: number;
  gapTagsToModule?: number;
  moduleVisible?: boolean;
  moduleSize?: ModuleSize;
  moduleScale?: number;
  moduleFontSize?: number;
  module?: ModuleType;
  chartType?: ChartType;
  code?: string;
  codeFilename?: string;
  codeLanguage?: string;
  codeShowLineNumbers?: boolean;
  kpis?: KPICard[];
  chartBars?: ChartBar[];
  chatMessages?: ChatMessage[];
  chatContactName?: string;
  chatOnlineStatus?: string;
  contentHighlightText?: string;
  contentHighlightStyle?: 'card' | 'quote' | 'banner';
  ctaActionPhrase?: string;
  ctaActionBadge?: string;
  ctaActionButtonText?: string;
  ctaActionBenefit?: string;
  steps?: StepItem[];
  promo?: PromoData;
  bgPattern?: PatternType;
  patternEnabled?: boolean;
  patternOpacity?: number;
  patternScale?: number;
  patternVignette?: PatternVignette;
  lightEnabled?: boolean;
  lightType?: LightType;
  lightDirection?: LightDirection;
  lightIntensity?: number;
  shapeEnabled?: boolean;
  shapeCount?: number;
  shapeType?: any;
  shapeStyleVariant?: ShapeStyleVariant;
  shapeGeometry?: ShapeGeometry;
  shapePlacement?: ShapePlacement;
  shapeProximity?: ShapeProximity;
  shapeSizeVariant?: ShapeSizeVariant;
  shapeOpacity?: number;
  shapeSecondaryColor?: string;
  backgroundLayerOrder?: BackgroundLayerOrder;
  accentShape?: string;
  headerShape?: HeaderShape;
  footerShape?: FooterShape;
  footerSize?: number;
  cta?: string;
  handle?: string;
  ctaOrder?: CtaOrder;
  ctaAlign?: CtaAlign;
}

export interface BrandProfile {
  id: string;
  name: string;
  companyName: string;
  handle: string;
  logoType: LogoType;
  customLogoUrl?: string | null;
  primaryColor: string;
  secondaryColor?: string;
  titleFont?: string;
  subtitleFont?: string;
  headerBrandMode?: HeaderBrandMode;
  headerShape?: HeaderShape;
  footerShape?: FooterShape;
  isDefault?: boolean;
  createdAt: number;
}

export interface PostState {
  // Navigation & View (3 vistas: Landing, Bienvenida/Menú, Editor)
  viewMode: 'landing' | 'welcome' | 'editor';
  activeStep: 1 | 2 | 3 | 4;
  panelOpen: boolean;

  // Visual Theme
  canvasMode: 'dark' | 'light';
  currentColor: string;
  category: string;
  aspectRatio: AspectRatioKey;

  // Tipografía Independiente
  titleFont: string;
  subtitleFont: string;

  // Header
  companyName: string;
  headerBrandMode: HeaderBrandMode;
  logoAspectRatio: LogoAspectRatio;
  headerShowLogo: boolean;
  headerSize: number; // 10 a 24 px
  logoSize: number; // 24 a 96 px
  badgeStyle: BadgeStyle;
  badgeColorMode: BadgeColorMode;
  badgeCustomColor: string;

  // Título y Subtítulo
  title: string;
  titleSize: number;
  titleColorMode: TitleColorMode;
  titleCustomColor: string;
  titleAlign: TextAlign;
  textAlign: TextAlign; // fallback retrocompatibilidad
  subtitle: string;
  subtitleSize: number;
  subtitlePos: SubtitlePos;
  subtitleColorMode: SubtitleColorMode;
  subtitleCustomColor: string;
  subtitleAlign: TextAlign;

  // Grupo Intermedio
  tagsGroupVisible: boolean;
  tagsGroupType: TagsGroupType;
  tagsPosition: TagsPosition;
  tags: string;
  ratingValue: number;
  ratingCount: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl: string;
  socialProofText: string;
  statusPillText: string;

  // Layout Flow & Gaps Dinámicos
  layoutFlow: LayoutFlow;
  gapTitleSubtitle: number; // 4 a 40 px
  gapTextToTags: number; // 8 a 60 px
  gapTagsToModule: number; // 12 a 80 px

  // Central Module & Scaling
  moduleVisible: boolean;
  moduleSize: ModuleSize;
  moduleScale: number; // 0.7 a 1.4
  moduleFontSize: number; // 11 a 24 px
  activeModule: ModuleType;
  chartType?: ChartType;
  code: string;
  codeFilename: string;
  codeLanguage: string;
  codeShowLineNumbers: boolean;
  kpis: KPICard[];
  chartBars: ChartBar[];
  chatMessages: ChatMessage[];
  chatContactName: string;
  chatOnlineStatus: string;
  contentHighlightText: string;
  contentHighlightStyle: 'card' | 'quote' | 'banner';
  ctaActionPhrase?: string;
  ctaActionBadge?: string;
  ctaActionButtonText?: string;
  ctaActionBenefit?: string;
  steps: StepItem[];
  promo: PromoData;
  images: CustomImage[];
  imageBorderStyle: ImageBorderStyle;

  // Footer in Step 1
  cta: string;
  handle: string;
  ctaOrder: CtaOrder;
  ctaAlign: CtaAlign;
  footerSize: number; // 10 a 24 px

  // Style, Logo & Containers (Step 2)
  logoType: LogoType;
  customLogoUrl: string | null;
  headerShape: HeaderShape;
  footerShape: FooterShape;

  // Background, Lights & Perimeter Shapes (Step 3)
  patternEnabled: boolean;
  bgPattern: PatternType;
  patternScale: number;
  patternOpacity: number; // 0 a 100
  patternVignette: PatternVignette;
  customPatternUrl: string | null;
  
  // Luces
  lightEnabled: boolean;
  lightsEnabled?: boolean;
  lightType: LightType;
  lightDirection: LightDirection;
  lightIntensity: number; // 0 a 100

  // Formas Decorativas
  shapeEnabled: boolean;
  shapesEnabled?: boolean;
  shapeType: any; // retrocompatibilidad
  shapeCount?: number; // 4 a 12 formas
  shapeStyleVariant: ShapeStyleVariant;
  shapeGeometry: ShapeGeometry;
  shapePlacement: ShapePlacement;
  shapeProximity: ShapeProximity;
  shapeSizeVariant: ShapeSizeVariant;
  shapeOpacity: number; // 10 a 100
  shapeSeed: number; // semilla determinista
  shapeSecondaryColor: string;
  shapeDuotoneColor?: string;

  // Aliases & Extended Properties
  logoStyle?: any;
  codeSnippet?: { filename: string; language: string; code: string; };
  authorAvatar?: string;
  stepsData?: StepItem[];
  promoData?: PromoData;
  headerBadgeStyle?: BadgeStyle;
  headerBadgeColorMode?: BadgeColorMode;
  headerBadgeCustomColor?: string;
  codeFontSize?: number;
  ratingScore?: string;

  // Orden de Capas del Fondo
  backgroundLayerOrder: BackgroundLayerOrder;

  // Zoom
  zoomMode: 'fit-height' | 'fit-width' | '100%' | 'manual';
  zoomLevel: number;
}
