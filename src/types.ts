export type AspectRatioKey = '4:5' | '1:1' | '9:16' | '16:9';

export interface AspectRatioConfig {
  nativeW: number;
  nativeH: number;
  px: string;
  label: string;
}

export type ModuleType = 'code' | 'kpi' | 'chart' | 'chat' | 'image' | 'text';

export type LogoType = 'generic' | 'monogram' | 'text' | 'aleric' | 'custom';

export type TitleColorMode = 'contrast' | 'category' | 'custom';

export type TextAlign = 'left' | 'center' | 'right';

export type CtaOrder = 'cta-first' | 'handle-first';

export type CtaAlign = 'left' | 'center' | 'right' | 'between';

export type SubtitlePos = 'below' | 'above';

export type ModuleSize = 'compact' | 'normal' | 'spacious';

export type ImageBorderStyle = 'none' | 'rounded' | 'glass' | 'neon' | 'double' | 'dashed' | 'shadow';

export type HeaderShape = 'line' | 'pill' | 'card' | 'minimal' | 'accent-bar';

export type FooterShape = 'line' | 'card' | 'pill' | 'minimal' | 'accent-bar';

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

// Formas geométricas perimetrales vítreas (solo en los bordes, nada en el centro)
export type ShapeType = 
  | 'glass-orbs' 
  | 'glass-cards' 
  | 'cyber-brackets' 
  | 'tech-squares' 
  | 'mixed-glass' 
  | 'none';

export type ShapePlacement = 
  | 'corners' 
  | 'periphery' 
  | 'sides' 
  | 'random-edges';

export type ShapeSizeVariant = 'small' | 'medium' | 'large';

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

export interface PostTemplate {
  id: string;
  category: string;
  color: string;
  companyName: string;
  logoType?: LogoType;
  logoSize?: number;
  headerShowLogo?: boolean;
  headerSize?: number;
  titleFont?: string;
  title: string;
  titleSize?: number;
  titleColor?: TitleColorMode;
  textAlign?: TextAlign;
  subtitle: string;
  subtitleSize?: number;
  subtitlePos?: SubtitlePos;
  moduleVisible?: boolean;
  moduleSize?: ModuleSize;
  moduleScale?: number;
  moduleFontSize?: number;
  module?: ModuleType;
  code?: string;
  codeFilename?: string;
  codeLanguage?: string;
  codeShowLineNumbers?: boolean;
  chatContactName?: string;
  chatOnlineStatus?: string;
  contentHighlightText?: string;
  contentHighlightStyle?: 'card' | 'quote' | 'banner';
  tags: string;
  bgPattern?: PatternType;
  patternScale?: number;
  patternVignette?: PatternVignette;
  lightType?: LightType;
  lightDirection?: LightDirection;
  lightIntensity?: number;
  shapeType?: ShapeType;
  shapePlacement?: ShapePlacement;
  shapeSizeVariant?: ShapeSizeVariant;
  shapeOpacity?: number;
  accentShape?: string;
  headerShape?: HeaderShape;
  footerShape?: FooterShape;
  footerSize?: number;
  cta?: string;
  handle?: string;
  ctaOrder?: CtaOrder;
  ctaAlign?: CtaAlign;
}

export interface PostState {
  // Navigation & View (2 páginas independientes)
  viewMode: 'welcome' | 'editor';
  activeStep: 1 | 2 | 3 | 4;
  panelOpen: boolean;

  // Visual Theme
  canvasMode: 'dark' | 'light';
  currentColor: string;
  category: string;
  aspectRatio: AspectRatioKey;

  // Typography & Content (Step 1)
  titleFont: string;

  // Header in Step 1
  companyName: string;
  headerShowLogo: boolean;
  headerSize: number; // 10 a 24 px
  logoSize: number; // 24 a 96 px

  title: string;
  titleSize: number;
  titleColorMode: TitleColorMode;
  titleCustomColor: string;
  textAlign: TextAlign;
  subtitle: string;
  subtitleSize: number;
  subtitlePos: SubtitlePos;
  tags: string;
  
  // Central Module & Scaling
  moduleVisible: boolean;
  moduleSize: ModuleSize;
  moduleScale: number; // 0.7 a 1.4
  moduleFontSize: number; // 11 a 24 px
  activeModule: ModuleType;
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
  bgPattern: PatternType;
  patternScale: number;
  patternVignette: PatternVignette;
  customPatternUrl: string | null;
  
  // Luces
  lightType: LightType;
  lightDirection: LightDirection;
  lightIntensity: number; // 0 a 100

  // Formas vítreas (perímetro / bordes)
  shapeType: ShapeType;
  shapePlacement: ShapePlacement;
  shapeSizeVariant: ShapeSizeVariant;
  shapeOpacity: number; // 10 a 100
  shapeSeed: number; // semilla para random-edges

  // Zoom
  zoomMode: 'fit-height' | 'fit-width' | '100%' | 'manual';
  zoomLevel: number;
}
