export type AspectRatioKey = '4:5' | '1:1' | '9:16' | '16:9';

export interface AspectRatioConfig {
  nativeW: number;
  nativeH: number;
  px: string;
  label: string;
}

export type ModuleType = 'code' | 'kpi' | 'chart' | 'chat' | 'image';

export type LogoType = 'generic' | 'monogram' | 'text' | 'aleric' | 'custom';

export type TitleColorMode = 'contrast' | 'category' | 'custom';

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

export type AccentShape = 'glow' | 'circles' | 'squares' | 'diamonds' | 'lines' | 'none';

export type ShapeSizeVariant = 'small' | 'medium' | 'large';

export type LightDirection = 
  | 'dual-corners-1' 
  | 'dual-corners-2' 
  | 'four-corners' 
  | 'top' 
  | 'bottom' 
  | 'sides' 
  | 'center';

export interface KPICard {
  val: string;
  label: string;
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
  title: string;
  titleSize?: number;
  titleColor?: TitleColorMode;
  subtitle: string;
  subtitleSize?: number;
  subtitlePos?: SubtitlePos;
  moduleVisible?: boolean;
  moduleSize?: ModuleSize;
  module?: ModuleType;
  code?: string;
  tags: string;
  bgPattern?: PatternType;
  patternScale?: number;
  patternVignette?: PatternVignette;
  accentShape?: AccentShape;
  shapeSizeVariant?: ShapeSizeVariant;
  lightDirection?: LightDirection;
  lightIntensity?: number;
  headerShape?: HeaderShape;
  footerShape?: FooterShape;
  cta?: string;
  handle?: string;
}

export interface PostState {
  // Navigation & View
  viewMode: 'welcome' | 'editor';
  activeStep: 1 | 2 | 3 | 4;
  panelOpen: boolean;

  // Visual Theme
  canvasMode: 'dark' | 'light';
  currentColor: string;
  category: string;
  aspectRatio: AspectRatioKey;

  // Content (Step 1)
  title: string;
  titleSize: number;
  titleColorMode: TitleColorMode;
  titleCustomColor: string;
  subtitle: string;
  subtitleSize: number;
  subtitlePos: SubtitlePos;
  tags: string;
  
  // Central Module
  moduleVisible: boolean;
  moduleSize: ModuleSize;
  activeModule: ModuleType;
  code: string;
  kpis: KPICard[];
  chartBars: ChartBar[];
  chatMessages: ChatMessage[];
  images: CustomImage[];
  imageBorderStyle: ImageBorderStyle;

  // Footer text in Step 1
  cta: string;
  handle: string;

  // Style & Branding (Step 2)
  companyName: string;
  logoType: LogoType;
  customLogoUrl: string | null;
  titleFont: string;
  headerShape: HeaderShape;
  footerShape: FooterShape;

  // Background & Shapes (Step 3)
  bgPattern: PatternType;
  patternScale: number;
  patternVignette: PatternVignette;
  customPatternUrl: string | null;
  accentShape: AccentShape;
  shapeSizeVariant: ShapeSizeVariant;
  lightDirection: LightDirection;
  lightIntensity: number;

  // Zoom
  zoomMode: 'fit-height' | 'fit-width' | '100%' | 'manual';
  zoomLevel: number;
}
