import React from 'react';
import {
  Terminal,
  Code2,
  Cpu,
  Sparkles,
  Layers,
  Boxes,
  Globe,
  Zap,
  Shield,
  Rocket,
  Flame,
  Database,
  LucideIcon
} from 'lucide-react';

export interface BrandIconOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const BRAND_ICONS: BrandIconOption[] = [
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'code', label: 'Código', icon: Code2 },
  { id: 'cpu', label: 'Hardware / CPU', icon: Cpu },
  { id: 'sparkles', label: 'IA / Magia', icon: Sparkles },
  { id: 'layers', label: 'Stack / Capas', icon: Layers },
  { id: 'boxes', label: 'Módulos', icon: Boxes },
  { id: 'globe', label: 'Web Global', icon: Globe },
  { id: 'zap', label: 'Performance', icon: Zap },
  { id: 'shield', label: 'Seguridad', icon: Shield },
  { id: 'rocket', label: 'Lanzamiento', icon: Rocket },
  { id: 'flame', label: 'Tendencia', icon: Flame },
  { id: 'database', label: 'Datos', icon: Database },
];

export const getBrandIconComponent = (iconId?: string): LucideIcon => {
  const found = BRAND_ICONS.find(item => item.id === iconId);
  return found ? found.icon : Terminal;
};
