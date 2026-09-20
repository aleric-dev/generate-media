import React, { forwardRef, useMemo, useState } from 'react';
import { PostState, ShapePlacement, ShapeStyleVariant, ShapeGeometry, ShapeProximity, BackgroundLayerOrder, PatternVignette } from '../../types';
import { aspectRatios } from '../../constants/templates';
import { getBrandIconComponent } from '../../constants/brandIcons';
import { 
  Star, CheckCircle2, Radio, User, Sparkles, Tag, ArrowRight, 
  FileCode, Terminal, TrendingUp, TrendingDown, CheckCheck, Minus, 
  Square, X, Code2, Cpu, Layers, Rocket, Zap, ShieldCheck, 
  Heart, Flame, Palette, Compass, MessageSquare, Share2,
  Lock, Server, Cloud, DollarSign, ShoppingCart, Percent, Award,
  Globe, Mic, Copy, Check, Shield, CircleDot, Play, ExternalLink,
  GitBranch
} from 'lucide-react';

interface CanvasTargetProps {
  state: PostState;
}

export const CanvasTarget = forwardRef<HTMLDivElement, CanvasTargetProps>(({ state }, ref) => {
  const r = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];
  const isLight = state.canvasMode === 'light';
  const isWidescreen = state.aspectRatio === '16:9';

  // Cálculo de color RGB para iluminaciones y formas
  const cleanColor = (state.currentColor || '#4F46E5').replace('#', '');
  const bigint = parseInt(cleanColor, 16) || 0x4f46e5;
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;
  const rgb = `${red}, ${green}, ${blue}`;

  // Duotono RGB
  const duotoneClean = (state.shapeDuotoneColor || '#06b6d4').replace('#', '');
  const duoInt = parseInt(duotoneClean, 16) || 0x06b6d4;
  const dRed = (duoInt >> 16) & 255;
  const dGreen = (duoInt >> 8) & 255;
  const dBlue = duoInt & 255;
  const duoRgb = `${dRed}, ${dGreen}, ${dBlue}`;

  // Factores de iluminación
  const lightFactor = (state.lightIntensity ?? 40) / 100;
  const lightA1 = (lightFactor * (isLight ? 0.35 : 0.65)).toFixed(3);
  const lightA2 = (lightFactor * (isLight ? 0.18 : 0.35)).toFixed(3);

  // Background glow según estilo de luz y dirección
  let glowBg = 'none';
  const lightType = state.lightType || 'glow';
  const lightsEnabled = state.lightsEnabled !== false;

  if (lightsEnabled && lightType !== 'none' && lightFactor > 0) {
    if (lightType === 'spotlight') {
      glowBg = `
        radial-gradient(circle at 100% 0%, rgba(${rgb}, ${lightA1}) 0%, transparent 60%),
        radial-gradient(circle at 0% 100%, rgba(${rgb}, ${lightA2}) 0%, transparent 55%)
      `;
    } else if (lightType === 'aurora') {
      glowBg = `
        radial-gradient(ellipse at 50% 0%, rgba(${rgb}, ${lightA1}) 0%, rgba(6, 182, 212, 0.2) 40%, transparent 75%)
      `;
    } else if (lightType === 'dual-beams') {
      glowBg = `
        linear-gradient(135deg, rgba(${rgb}, ${lightA1}) 0%, transparent 45%),
        linear-gradient(315deg, rgba(${rgb}, ${lightA2}) 0%, transparent 45%)
      `;
    } else {
      // 'glow'
      if (state.lightDirection === 'dual-corners-1') {
        glowBg = `
          radial-gradient(circle at 100% 0%, rgba(${rgb}, ${lightA1}) 0%, rgba(${rgb}, 0.03) 50%, transparent 75%),
          radial-gradient(circle at 0% 100%, rgba(${rgb}, ${lightA2}) 0%, rgba(${rgb}, 0.02) 45%, transparent 70%)
        `;
      } else if (state.lightDirection === 'dual-corners-2') {
        glowBg = `
          radial-gradient(circle at 0% 0%, rgba(${rgb}, ${lightA1}) 0%, rgba(${rgb}, 0.03) 50%, transparent 75%),
          radial-gradient(circle at 100% 100%, rgba(${rgb}, ${lightA2}) 0%, rgba(${rgb}, 0.02) 45%, transparent 70%)
        `;
      } else if (state.lightDirection === 'four-corners') {
        glowBg = `
          radial-gradient(circle at 0% 0%, rgba(${rgb}, ${lightA2}) 0%, transparent 45%),
          radial-gradient(circle at 100% 0%, rgba(${rgb}, ${lightA2}) 0%, transparent 45%),
          radial-gradient(circle at 0% 100%, rgba(${rgb}, ${lightA2}) 0%, transparent 45%),
          radial-gradient(circle at 100% 100%, rgba(${rgb}, ${lightA2}) 0%, transparent 45%)
        `;
      } else if (state.lightDirection === 'top') {
        glowBg = `radial-gradient(ellipse at 50% 0%, rgba(${rgb}, ${lightA1}) 0%, rgba(${rgb}, 0.04) 60%, transparent 85%)`;
      } else if (state.lightDirection === 'bottom') {
        glowBg = `radial-gradient(ellipse at 50% 100%, rgba(${rgb}, ${lightA1}) 0%, rgba(${rgb}, 0.04) 55%, transparent 80%)`;
      } else if (state.lightDirection === 'sides') {
        glowBg = `
          radial-gradient(ellipse at 0% 50%, rgba(${rgb}, ${lightA2}) 0%, transparent 55%),
          radial-gradient(ellipse at 100% 50%, rgba(${rgb}, ${lightA2}) 0%, transparent 55%)
        `;
      } else {
        glowBg = `radial-gradient(circle at 50% 50%, rgba(${rgb}, ${lightA1}) 0%, rgba(${rgb}, 0.03) 55%, transparent 80%)`;
      }
    }
  }

  // Multiplicadores de Formas (con slider shapeSizeScale)
  const shapeSizeScaleFactor = (state.shapeSizeScale ?? 100) / 100;
  const shapeSizeMult = shapeSizeScaleFactor * (state.shapeSizeVariant === 'small' ? 0.65 : (state.shapeSizeVariant === 'large' ? 1.45 : 1.0));
  const shapeOpacity = (state.shapeOpacity ?? 60) / 100;
  const shapesEnabled = state.shapesEnabled !== false && state.shapeType !== 'none';

  // Desplazamiento según Proximidad ('edges', 'balanced', 'close')
  const proximityOffset = state.shapeProximity === 'edges' ? -60 : (state.shapeProximity === 'close' ? 10 : -25);

  // Generador procedimental anti-colisión de posiciones perimetrales (CENTRO 100% LIMPIO)
  const perimeterPositions = useMemo(() => {
    const seed = state.shapeSeed || 12345;
    const count = Math.max(2, Math.min(12, state.shapeCount ?? 6));
    const off = proximityOffset;

    // Generador pseudoaleatorio determinista por semilla
    const rng = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const placement: ShapePlacement = state.shapePlacement || 'corners';
    const positions: { top?: string; bottom?: string; left?: string; right?: string; size: number; rot: number }[] = [];
    const sizeBase = 180;

    if (placement === 'corners') {
      const cornerOffsets = [
        { vert: 'top', horiz: 'left' },
        { vert: 'top', horiz: 'right' },
        { vert: 'bottom', horiz: 'left' },
        { vert: 'bottom', horiz: 'right' },
      ];

      for (let i = 0; i < count; i++) {
        const corner = cornerOffsets[i % 4];
        const s = seed + i * 29 + 11;
        const subIndex = Math.floor(i / 4);
        const size = sizeBase + rng(s + 1) * 70;
        const rot = Math.round(rng(s + 2) * 90 - 45);

        // Separación garantizada entre formas de la misma esquina para evitar solapamiento
        const separation = subIndex * 210;
        const isHorizontalShift = (i % 2 === 0);

        const vertDist = off + (subIndex > 0 && !isHorizontalShift ? separation : 0);
        const horizDist = off + (subIndex > 0 && isHorizontalShift ? separation : 0);

        const posObj: any = { size, rot };
        posObj[corner.vert] = `${vertDist}px`;
        posObj[corner.horiz] = `${horizDist}px`;
        positions.push(posObj);
      }
      return positions;
    }

    if (placement === 'sides') {
      const leftCount = Math.ceil(count / 2);
      const rightCount = Math.floor(count / 2);

      for (let i = 0; i < leftCount; i++) {
        const s = seed + i * 23 + 7;
        const size = sizeBase + rng(s + 1) * 70;
        const rot = Math.round(rng(s + 2) * 60 - 30);
        const minTop = 15;
        const maxTop = 82;
        const topPct = minTop + ((i + 0.5) / leftCount) * (maxTop - minTop) + (rng(s + 3) - 0.5) * 3;
        positions.push({ top: `${topPct.toFixed(1)}%`, left: `${off}px`, size, rot });
      }

      for (let i = 0; i < rightCount; i++) {
        const s = seed + (i + leftCount) * 23 + 7;
        const size = sizeBase + rng(s + 1) * 70;
        const rot = Math.round(rng(s + 2) * 60 - 30);
        const minTop = 15;
        const maxTop = 82;
        const topPct = minTop + ((i + 0.5) / rightCount) * (maxTop - minTop) + (rng(s + 3) - 0.5) * 3;
        positions.push({ top: `${topPct.toFixed(1)}%`, right: `${off}px`, size, rot });
      }

      return positions;
    }

    // 'periphery' o 'random-edges': perímetro dividido en ranuras disjuntas
    for (let i = 0; i < count; i++) {
      const s = seed + i * 31 + 17;
      const size = sizeBase + rng(s + 1) * 70;
      const rot = Math.round(rng(s + 2) * 120 - 60);

      const edgeIdx = i % 4; // 0=top, 1=right, 2=bottom, 3=left
      const slotPerEdge = Math.floor(i / 4);
      const totalInEdge = Math.ceil((count - edgeIdx) / 4);

      const tMin = 12;
      const tMax = 88;
      const slotCenter = tMin + ((slotPerEdge + 0.5) / Math.max(1, totalInEdge)) * (tMax - tMin);
      const boundedJitter = (rng(s + 3) - 0.5) * ((tMax - tMin) / Math.max(1, totalInEdge) * 0.35);
      const pct = Math.max(8, Math.min(92, slotCenter + boundedJitter));

      if (edgeIdx === 0) {
        positions.push({ top: `${off}px`, left: `${pct.toFixed(1)}%`, size, rot });
      } else if (edgeIdx === 1) {
        positions.push({ top: `${pct.toFixed(1)}%`, right: `${off}px`, size, rot });
      } else if (edgeIdx === 2) {
        positions.push({ bottom: `${off}px`, left: `${pct.toFixed(1)}%`, size, rot });
      } else {
        positions.push({ top: `${pct.toFixed(1)}%`, left: `${off}px`, size, rot });
      }
    }

    return positions;
  }, [state.shapePlacement, state.shapeSeed, state.shapeCount, proximityOffset]);

  // Clase del patrón
  const patternEnabled = state.patternEnabled !== false && state.bgPattern !== 'none';
  const patternClass = !patternEnabled 
    ? 'pattern-none' 
    : (state.bgPattern === 'custom' ? '' : `pattern-${state.bgPattern}${isLight ? '-light' : ''}`);

  // Color del título
  let titleColor = isLight ? '#0F172A' : '#FFFFFF';
  if (state.titleColorMode === 'category') {
    titleColor = state.currentColor;
  } else if (state.titleColorMode === 'custom') {
    titleColor = state.titleCustomColor;
  }

  // Color del subtítulo (con alto contraste en fondo claro)
  let subtitleColor = isLight ? '#334155' : '#CBD5E1';
  if (state.subtitleColorMode === 'contrast') {
    subtitleColor = isLight ? '#1E293B' : '#F1F5F9';
  } else if (state.subtitleColorMode === 'dimmed') {
    subtitleColor = isLight ? '#64748B' : '#94A3B8';
  } else if (state.subtitleColorMode === 'custom') {
    subtitleColor = state.subtitleCustomColor || '#94A3B8';
  }

  // Alineaciones Independientes
  const titleAlign = state.titleAlign || state.textAlign || 'center';
  const subtitleAlign = state.subtitleAlign || state.textAlign || 'center';

  const getAlignClasses = (al: string) => {
    if (al === 'left') return 'text-left items-start';
    if (al === 'right') return 'text-right items-end';
    return 'text-center items-center';
  };

  const titleAlignClass = getAlignClasses(titleAlign);
  const subtitleAlignClass = getAlignClasses(subtitleAlign);
  const tagsAlign = state.tagsAlign || titleAlign || 'center';
  const tagsJustifyClass = tagsAlign === 'left' ? 'justify-start' : (tagsAlign === 'right' ? 'justify-end' : 'justify-center');

  // Badges de Tecnologías
  const tagsList = (state.tags || '').split(',').map(t => t.trim()).filter(Boolean);

  // Bordes para imágenes
  const imgBorderClass = `img-border-${state.imageBorderStyle || 'none'}`;

  // Escala interna y tamaño de fuente del módulo
  const rawScale = state.moduleScale ?? 100;
  const modScale = rawScale <= 2.5 ? (rawScale === 0 ? 1 : rawScale) : rawScale / 100;
  const modFontSize = state.moduleFontSize || 15;
  const fontMult = Math.max(0.8, Math.min(2.0, modFontSize / 14));

  let basePadding = 36;
  let moduleMinH = isWidescreen ? 'min-h-[220px]' : 'min-h-[280px]';
  if (state.moduleSize === 'compact') {
    basePadding = 24;
    moduleMinH = isWidescreen ? 'min-h-[160px]' : 'min-h-[200px]';
  } else if (state.moduleSize === 'spacious') {
    basePadding = 52;
    moduleMinH = isWidescreen ? 'min-h-[280px]' : 'min-h-[360px]';
  }

  // Altura del logo y tamaño de fuente de cabecera
  const logoH = state.logoSize || 44;
  const headerFontSize = state.headerSize || 13;

  // Proporción de aspecto del logo
  const logoRatio = state.logoAspectRatio || 'auto';
  let logoRatioStyle: React.CSSProperties = { height: `${logoH}px` };
  if (logoRatio === 'square') {
    logoRatioStyle = { width: `${logoH}px`, height: `${logoH}px`, objectFit: 'contain' };
  } else if (logoRatio === 'horizontal') {
    logoRatioStyle = { height: `${logoH}px`, maxWidth: `${Math.round(logoH * 3.2)}px`, objectFit: 'contain' };
  } else if (logoRatio === 'vertical') {
    logoRatioStyle = { height: `${logoH}px`, maxWidth: `${Math.round(logoH * 0.75)}px`, objectFit: 'contain' };
  }

  // Render del logo y de la identidad de marca según HeaderBrandMode
  const headerTitleColorMode = state.headerTitleColorMode || 'contrast';
  let headerTitleColor = isLight ? '#0F172A' : '#FFFFFF';
  if (headerTitleColorMode === 'inherit') {
    headerTitleColor = state.currentColor;
  } else if (headerTitleColorMode === 'custom' && state.headerTitleCustomColor) {
    headerTitleColor = state.headerTitleCustomColor;
  }

  const renderLogoElement = () => {
    const name = state.companyName ?? '';
    const brandMode = state.headerBrandMode || 'icon-text';

    // 1. Solo texto de la empresa
    if (brandMode === 'only-text' || state.headerShowLogo === false) {
      if (!name) return null;
      return (
        <div
          className="font-mono font-bold tracking-tight"
          style={{
            fontSize: `${Math.round(headerFontSize * 1.55)}px`,
            color: headerTitleColor
          }}
        >
          {name}
        </div>
      );
    }

    // Isotipo o imagen de logo
    let logoImgOrIcon: React.ReactNode = null;

    if (brandMode === 'custom-text' || brandMode === 'only-custom' || brandMode === 'logo-text') {
      if (state.customLogoUrl) {
        logoImgOrIcon = (
          <img
            src={state.customLogoUrl}
            alt="Logo"
            className="filter drop-shadow-md transition-all"
            style={logoRatioStyle}
          />
        );
      } else {
        // Placeholder estilizado cuando no hay imagen cargada aún
        const boxH = Math.max(30, Math.round(headerFontSize * 2.2));
        logoImgOrIcon = (
          <div
            className="rounded-xl flex items-center justify-center shadow-lg transition-all shrink-0 border border-dashed"
            style={{
              width: `${boxH}px`,
              height: `${boxH}px`,
              borderColor: state.currentColor,
              backgroundColor: `${state.currentColor}15`,
            }}
          >
            <span
              className="font-mono font-bold uppercase text-[10px]"
              style={{ color: state.currentColor }}
            >
              LOGO
            </span>
          </div>
        );
      }
    } else {
      // 'icon-text' o fallback: Ícono vectorial seleccionado con el acento de color
      const SelectedIcon = getBrandIconComponent(state.brandIcon);
      // Logo un poco más grande en comparación al texto para jerarquía visual óptima
      const iconBoxSize = Math.max(30, Math.round(headerFontSize * 2.2));
      const iconPx = Math.max(17, Math.round(iconBoxSize * 0.62));
      logoImgOrIcon = (
        <div
          className="rounded-xl flex items-center justify-center shadow-md transition-all shrink-0"
          style={{
            width: `${iconBoxSize}px`,
            height: `${iconBoxSize}px`,
            background: 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${state.currentColor}`
          }}
        >
          <SelectedIcon size={iconPx} color={state.currentColor} strokeWidth={2.2} />
        </div>
      );
    }

    // 2. Solo Logo (modo 'only-custom' o fallback 'only-logo')
    if (brandMode === 'only-custom' || brandMode === 'only-logo') {
      return (
        <div className="flex items-center shrink-0">
          {logoImgOrIcon}
        </div>
      );
    }

    // 3. Logo / Ícono + Texto ('icon-text' o 'custom-text')
    return (
      <div className="flex items-center" style={{ gap: '14px' }}>
        {logoImgOrIcon}
        <span
          className="font-mono font-bold tracking-tight"
          style={{
            fontSize: `${Math.round(headerFontSize * 1.35)}px`,
            lineHeight: 1,
            color: headerTitleColor
          }}
        >
          {name}
        </span>
      </div>
    );
  };

  // Badge Superior Estilos
  const badgeStyle = state.headerBadgeStyle || state.badgeStyle || 'pill';
  const badgeColorMode = state.headerBadgeColorMode || state.badgeColorMode || 'inherit';
  let badgeColor = state.currentColor;
  if (badgeColorMode === 'contrast') {
    badgeColor = isLight ? '#0F172A' : '#FFFFFF';
  } else if (badgeColorMode === 'custom' && (state.headerBadgeCustomColor || state.badgeCustomColor)) {
    badgeColor = state.headerBadgeCustomColor || state.badgeCustomColor;
  }

  const renderHeaderBadge = () => {
    if (!state.category) return null;

    if (badgeStyle === 'bracket') {
      return (
        <div
          id="view-badge"
          className="font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 transition-all shrink-0"
          style={{
            color: badgeColor,
            fontSize: `${headerFontSize}px`
          }}
        >
          <span className="text-slate-500 font-normal">[</span>
          <span>{state.category}</span>
          <span className="text-slate-500 font-normal">]</span>
        </div>
      );
    }

    if (badgeStyle === 'neon') {
      return (
        <div
          id="view-badge"
          className="px-5 py-2 rounded-full font-mono font-bold tracking-wider uppercase flex items-center gap-2.5 transition-all shrink-0"
          style={{
            backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15, 23, 42, 0.9)',
            border: `2px solid ${badgeColor}`,
            boxShadow: `0 0 16px ${badgeColor}66`,
            color: badgeColor,
            fontSize: `${headerFontSize}px`
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: badgeColor }} />
          <span>{state.category}</span>
        </div>
      );
    }

    if (badgeStyle === 'glass') {
      return (
        <div
          id="view-badge"
          className="px-5 py-2 rounded-xl font-mono font-bold tracking-wider uppercase flex items-center gap-2.5 transition-all shrink-0 backdrop-blur-md"
          style={{
            backgroundColor: isLight ? 'rgba(255,255,255,0.65)' : 'rgba(255, 255, 255, 0.08)',
            border: `1px solid ${badgeColor}66`,
            color: badgeColor,
            fontSize: `${headerFontSize}px`
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: badgeColor }} />
          <span>{state.category}</span>
        </div>
      );
    }

    if (badgeStyle === 'minimal-dot') {
      return (
        <div
          id="view-badge"
          className="font-mono font-semibold tracking-wider uppercase flex items-center gap-2 transition-all shrink-0"
          style={{
            color: badgeColor,
            fontSize: `${headerFontSize}px`
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: badgeColor }} />
          <span>{state.category}</span>
        </div>
      );
    }

    if (badgeStyle === 'outline') {
      return (
        <div
          id="view-badge"
          className="px-4 py-1 rounded-full font-mono font-bold tracking-wider uppercase flex items-center gap-2 transition-all shrink-0"
          style={{
            border: `2px solid ${badgeColor}`,
            color: badgeColor,
            fontSize: `${headerFontSize}px`,
            backgroundColor: 'transparent'
          }}
        >
          <span>{state.category}</span>
        </div>
      );
    }

    // Default 'pill'
    return (
      <div
        id="view-badge"
        className="px-4 py-1.5 rounded-full font-mono font-bold tracking-wider uppercase flex items-center gap-2 transition-all shadow-sm shrink-0"
        style={{
          backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15, 23, 42, 0.85)',
          border: `1.5px solid ${badgeColor}`,
          color: badgeColor,
          fontSize: `${headerFontSize}px`
        }}
      >
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: badgeColor }} />
        <span>{state.category}</span>
      </div>
    );
  };

  // Header class y estilo de contenedor
  let headerClass = 'relative z-10 flex items-center justify-between transition-all gap-6 w-full shrink-0';
  const headerInlineStyle: React.CSSProperties = {};
  if (state.headerShape === 'pill') {
    headerClass += ' bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-full px-6 py-3.5';
  } else if (state.headerShape === 'card') {
    headerClass += ' bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5';
  } else if (state.headerShape === 'accent-bar') {
    headerClass += ' border-b-4 pb-4';
    headerInlineStyle.borderBottomColor = state.currentColor;
  } else if (state.headerShape === 'floating-dock') {
    headerClass += ' bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-2xl px-6 py-3.5 shadow-2xl';
  } else if (state.headerShape === 'bracket-frame') {
    headerClass += ' border-l-4 border-r-4 border-white/20 px-4 py-3';
    headerInlineStyle.borderLeftColor = state.currentColor;
    headerInlineStyle.borderRightColor = state.currentColor;
  } else if (state.headerShape === 'neon-glow') {
    headerClass += ' rounded-2xl p-4 border border-indigo-500/50 bg-slate-950/60';
    headerInlineStyle.boxShadow = `0 0 25px rgba(${rgb}, 0.3)`;
  } else if (state.headerShape === 'minimal') {
    headerClass += ' pb-4';
  } else {
    // 'line' divisoria visible y limpia
    headerClass += isLight ? ' border-b-2 border-slate-300 pb-5' : ' border-b-2 border-white/20 pb-5';
  }

  // Footer class y estilo de contenedor
  let footerClass = 'relative z-10 flex items-center transition-all gap-6 w-full shrink-0';
  const footerInlineStyle: React.CSSProperties = {};
  if (state.footerShape === 'pill') {
    footerClass += ' bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-full px-6 py-3';
  } else if (state.footerShape === 'card') {
    footerClass += ' bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5';
  } else if (state.footerShape === 'accent-bar') {
    footerClass += ' border-t-4 pt-4';
    footerInlineStyle.borderTopColor = state.currentColor;
  } else if (state.footerShape === 'floating-dock') {
    footerClass += ' bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-2xl px-6 py-3 shadow-2xl';
  } else if (state.footerShape === 'bracket-frame') {
    footerClass += ' border-l-4 border-r-4 border-white/20 px-4 py-3';
    footerInlineStyle.borderLeftColor = state.currentColor;
    footerInlineStyle.borderRightColor = state.currentColor;
  } else if (state.footerShape === 'neon-glow') {
    footerClass += ' rounded-2xl p-4 border border-indigo-500/50 bg-slate-950/60';
    footerInlineStyle.boxShadow = `0 0 25px rgba(${rgb}, 0.3)`;
  } else if (state.footerShape === 'minimal') {
    footerClass += ' pt-4';
  } else {
    // 'line' divisoria visible y limpia
    footerClass += isLight ? ' border-t-2 border-slate-300 pt-5' : ' border-t-2 border-white/20 pt-5';
  }

  // Alineación del Footer (CTA y Handle)
  const ctaAlign = state.ctaAlign || 'between';
  let footerJustify = 'justify-between';
  if (ctaAlign === 'center') footerJustify = 'justify-center';
  else if (ctaAlign === 'left') footerJustify = 'justify-start';
  else if (ctaAlign === 'right') footerJustify = 'justify-end';
  footerClass += ` ${footerJustify}`;

  const footerSize = state.footerSize || 13;

  // Render del Grupo Intermedio (Badges, Rating, Autor, Social Proof, Status Pill)
  const renderIntermediateGroup = () => {
    if (state.tagsGroupVisible === false) return null;
    const groupType = state.tagsGroupType || 'badges';

    const tagPx = state.tagsSize || 14;
    let tagTextColor = isLight ? '#1E293B' : '#F1F5F9';
    let tagBgColor = isLight ? 'rgba(241, 245, 249, 0.95)' : 'rgba(255, 255, 255, 0.06)';
    let tagBorderColor = isLight ? 'rgba(203, 213, 225, 0.9)' : 'rgba(255, 255, 255, 0.12)';

    if (state.tagsColorMode === 'contrast') {
      tagTextColor = isLight ? '#0F172A' : '#FFFFFF';
      tagBgColor = isLight ? '#FFFFFF' : '#0B101B';
      tagBorderColor = isLight ? '#94A3B8' : 'rgba(255,255,255,0.25)';
    } else if (state.tagsColorMode === 'custom' && state.tagsCustomColor) {
      tagTextColor = state.tagsCustomColor;
      tagBorderColor = `${state.tagsCustomColor}66`;
      tagBgColor = `${state.tagsCustomColor}15`;
    } else if (state.tagsColorMode === 'inherit') {
      tagTextColor = state.currentColor;
      tagBorderColor = `${state.currentColor}44`;
      tagBgColor = `${state.currentColor}12`;
    }

    if (groupType === 'rating') {
      return (
        <div className={`flex items-center gap-2.5 pt-1 ${tagsJustifyClass}`}>
          <div className="flex items-center text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          {state.ratingScore && (
            <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`} style={{ fontSize: `${tagPx}px` }}>
              {state.ratingScore}
            </span>
          )}
          {state.ratingCount && (
            <span className={`font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`} style={{ fontSize: `${Math.round(tagPx * 0.85)}px` }}>
              • {state.ratingCount}
            </span>
          )}
        </div>
      );
    }

    if (groupType === 'author') {
      const hasAuthor = Boolean(state.authorName || state.authorRole || state.authorAvatar);
      if (!hasAuthor) return null;

      return (
        <div className={`flex items-center gap-3 pt-1 ${tagsJustifyClass}`}>
          {state.authorAvatar ? (
            <img src={state.authorAvatar} alt="Autor" className="rounded-full object-cover border border-white/20 shadow-sm" style={{ width: `${tagPx * 2.5}px`, height: `${tagPx * 2.5}px` }} />
          ) : state.authorName ? (
            <div
              className="rounded-full flex items-center justify-center font-mono font-bold text-white shadow-sm"
              style={{ width: `${tagPx * 2.5}px`, height: `${tagPx * 2.5}px`, fontSize: `${Math.round(tagPx * 0.9)}px`, backgroundColor: state.currentColor }}
            >
              {state.authorName.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div
              className="rounded-full flex items-center justify-center text-slate-300 shadow-sm bg-slate-800"
              style={{ width: `${tagPx * 2.5}px`, height: `${tagPx * 2.5}px` }}
            >
              <User className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="flex flex-col text-left">
            {state.authorName && (
              <span className={`font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`} style={{ fontSize: `${tagPx}px` }}>
                {state.authorName}
              </span>
            )}
            {state.authorRole && (
              <span className={`font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`} style={{ fontSize: `${Math.round(tagPx * 0.8)}px` }}>
                {state.authorRole}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (groupType === 'social-proof') {
      if (!state.socialProofText) return null;
      return (
        <div className={`flex items-center gap-2 pt-1 ${tagsJustifyClass}`}>
          <div
            className="rounded-full font-mono font-semibold flex items-center gap-2 shadow-sm"
            style={{
              fontSize: `${tagPx}px`,
              padding: `${Math.round(tagPx * 0.35)}px ${Math.round(tagPx * 0.9)}px`,
              backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15, 23, 42, 0.75)',
              border: `1px solid ${state.currentColor}40`,
              color: isLight ? '#0F172A' : '#F1F5F9'
            }}
          >
            <CheckCircle2 style={{ width: `${tagPx}px`, height: `${tagPx}px`, color: state.currentColor }} />
            <span>{state.socialProofText}</span>
          </div>
        </div>
      );
    }

    if (groupType === 'status-pill') {
      if (!state.statusPillText) return null;
      return (
        <div className={`flex items-center gap-2 pt-1 ${tagsJustifyClass}`}>
          <div
            className="rounded-full font-mono font-bold tracking-wider uppercase flex items-center gap-2"
            style={{
              fontSize: `${Math.round(tagPx * 0.85)}px`,
              padding: `${Math.round(tagPx * 0.3)}px ${Math.round(tagPx * 0.8)}px`,
              backgroundColor: `${tagTextColor}20`,
              border: `1.5px solid ${tagTextColor}`,
              color: tagTextColor
            }}
          >
            <span className="rounded-full animate-pulse" style={{ width: `${Math.round(tagPx * 0.55)}px`, height: `${Math.round(tagPx * 0.55)}px`, backgroundColor: tagTextColor }} />
            <span>{state.statusPillText}</span>
          </div>
        </div>
      );
    }

    if (groupType === 'metrics-chip') {
      if (!state.metricChipHighlight && !state.metricChipLabel) return null;
      return (
        <div className={`flex items-center gap-2 pt-1 ${tagsJustifyClass}`}>
          <div
            className="rounded-xl font-mono flex items-center gap-2.5 shadow-md transition-all"
            style={{
              fontSize: `${tagPx}px`,
              padding: `${Math.round(tagPx * 0.4)}px ${Math.round(tagPx * 0.95)}px`,
              backgroundColor: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(15, 23, 42, 0.85)',
              border: `1.5px solid ${state.currentColor}50`,
              color: isLight ? '#0F172A' : '#F8FAFC'
            }}
          >
            <div
              className="p-1 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${state.currentColor}25` }}
            >
              <TrendingUp style={{ width: `${Math.round(tagPx * 1.1)}px`, height: `${Math.round(tagPx * 1.1)}px`, color: state.currentColor }} />
            </div>
            <div className="flex items-center gap-2">
              {state.metricChipHighlight && (
                <span className="font-extrabold tracking-tight" style={{ color: state.currentColor }}>
                  {state.metricChipHighlight}
                </span>
              )}
              {state.metricChipLabel && (
                <span className={`text-[0.9em] font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {state.metricChipLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Default 'badges'
    if (tagsList.length === 0) return null;
    return (
      <div id="view-tags-container" className={`flex flex-wrap gap-2.5 pt-1 ${tagsJustifyClass}`}>
        {tagsList.map((tag, idx) => (
          <span
            key={idx}
            className="rounded-lg font-mono font-medium tracking-wide shadow-xs transition-all"
            style={{
              fontSize: `${tagPx}px`,
              color: tagTextColor,
              backgroundColor: tagBgColor,
              border: `1px solid ${tagBorderColor}`,
              padding: `${Math.round(tagPx * 0.3)}px ${Math.round(tagPx * 0.85)}px`
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Elementos Modulares Desacoplados para Ordenamiento Libre
  const renderTitleElement = () => (
    <div key="block-title" className={titleAlignClass}>
      <h2
        className={`font-extrabold leading-[1.22] tracking-tight drop-shadow-lg transition-all ${state.titleFont || 'font-inter'}`}
        style={{
          fontSize: `${state.titleSize}px`,
          color: titleColor
        }}
      >
        {state.title ?? ''}
      </h2>
    </div>
  );

  const renderSubtitleElement = () => {
    if (!state.subtitle) return null;
    return (
      <div key="block-subtitle" className={subtitleAlignClass}>
        <p
          className={`font-normal leading-relaxed transition-all ${state.subtitleFont || state.titleFont || 'font-inter'}`}
          style={{
            fontSize: `${state.subtitleSize}px`,
            color: subtitleColor
          }}
        >
          {state.subtitle}
        </p>
      </div>
    );
  };

  const renderTagsElement = () => {
    if (!state.tagsGroupVisible) return null;
    return (
      <div key="block-tags" className="w-full">
        {renderIntermediateGroup()}
      </div>
    );
  };

  const renderBlockById = (id: 'title' | 'subtitle' | 'tags' | 'module') => {
    if (id === 'tags') return renderTagsElement();
    if (id === 'title') return renderTitleElement();
    if (id === 'subtitle') return renderSubtitleElement();
    if (id === 'module') return renderModuleBlock();
    return null;
  };

  // Render del Bloque de Texto (para vista en 2 columnas 16:9 o fallback)
  const renderTextBlock = () => {
    const textBlocks = (state.contentBlockOrder || ['tags', 'title', 'subtitle', 'module'])
      .filter((b) => b !== 'module');
    const gap = state.gapTitleSubtitle || 12;

    return (
      <div id="block-text" className="flex flex-col w-full" style={{ gap: `${gap}px` }}>
        {textBlocks.map((blockId) => {
          if (blockId === 'tags') return renderTagsElement();
          if (blockId === 'title') return renderTitleElement();
          if (blockId === 'subtitle') return renderSubtitleElement();
          return null;
        })}
      </div>
    );
  };

  // Render del Módulo Central Optimizado (Todos los casos de nivel Ultra HQ)
  const renderModuleBlock = () => {
    if (!state.moduleVisible) return null;

    // Color de acento para el módulo
    let moduleAccent = state.currentColor;
    if (state.moduleColorMode === 'mono') {
      moduleAccent = isLight ? '#475569' : '#94A3B8';
    } else if (state.moduleColorMode === 'custom' && state.moduleCustomColor) {
      moduleAccent = state.moduleCustomColor;
    }

    // Radio de esquinas configurable
    let roundedClass = 'rounded-2xl';
    if (state.moduleBorderRadius === 'none') roundedClass = 'rounded-none';
    else if (state.moduleBorderRadius === 'md') roundedClass = 'rounded-lg';
    else if (state.moduleBorderRadius === 'xl') roundedClass = 'rounded-xl';
    else if (state.moduleBorderRadius === '2xl') roundedClass = 'rounded-2xl';
    else if (state.moduleBorderRadius === 'full') roundedClass = 'rounded-[36px]';

    let moduleContainerClasses = `${roundedClass} ${moduleMinH} transition-all w-full flex flex-col justify-center h-auto`;
    let moduleContainerStyles: React.CSSProperties = {
      padding: `${Math.round(basePadding * modScale)}px`
    };

    const bgOpacity = (state.moduleBgOpacity ?? 85) / 100;
    const glowIntensity = (state.moduleGlowIntensity ?? 30) / 100;

    if (state.moduleContainerStyle === 'solid') {
      moduleContainerClasses += isLight ? ' border shadow-xl' : ' border shadow-2xl';
      moduleContainerStyles.backgroundColor = isLight ? `rgba(255, 255, 255, ${bgOpacity})` : `rgba(15, 23, 42, ${bgOpacity})`;
      moduleContainerStyles.borderColor = isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(30, 41, 59, 0.8)';
    } else if (state.moduleContainerStyle === 'neon') {
      moduleContainerClasses += isLight ? ' border-2 shadow-2xl' : ' border-2 shadow-2xl';
      moduleContainerStyles.backgroundColor = isLight ? `rgba(255, 255, 255, ${bgOpacity})` : `rgba(10, 15, 29, ${bgOpacity})`;
      moduleContainerStyles.borderColor = moduleAccent;
      if (glowIntensity > 0) {
        moduleContainerStyles.boxShadow = `0 0 ${Math.round(40 * glowIntensity)}px ${moduleAccent}55`;
      }
    } else if (state.moduleContainerStyle === 'bracket') {
      moduleContainerClasses += isLight ? ' border-l-4 border-r-4 shadow-xl' : ' border-l-4 border-r-4 shadow-2xl';
      moduleContainerStyles.backgroundColor = isLight ? `rgba(248, 250, 252, ${bgOpacity})` : `rgba(15, 23, 42, ${bgOpacity})`;
      moduleContainerStyles.borderLeftColor = moduleAccent;
      moduleContainerStyles.borderRightColor = moduleAccent;
    } else if (state.moduleContainerStyle === 'minimal') {
      moduleContainerClasses += ' bg-transparent';
    } else {
      // 'glass' standard
      moduleContainerClasses += isLight ? ' glass-card-light' : ' glass-card-clean';
      if (state.moduleBgOpacity !== undefined) {
        moduleContainerStyles.backgroundColor = isLight ? `rgba(255, 255, 255, ${bgOpacity * 0.9})` : `rgba(15, 23, 42, ${bgOpacity * 0.75})`;
      }
    }

    if (state.moduleBorderWidth !== undefined && state.moduleContainerStyle !== 'minimal') {
      moduleContainerStyles.borderWidth = `${state.moduleBorderWidth}px`;
    }

    if (glowIntensity > 0 && state.moduleContainerStyle !== 'neon' && state.moduleContainerStyle !== 'minimal') {
      moduleContainerStyles.boxShadow = `0 10px 30px -10px ${moduleAccent}40`;
    }

    return (
      <div
        id="block-module"
        className={moduleContainerClasses}
        style={moduleContainerStyles}
      >
        {/* ================================================================= */}
        {/* 1. MÓDULO DE CÓDIGO (VENTANAS MACOS, WINDOWS, LINUX, BASH, CMD)  */}
        {/* ================================================================= */}
        {state.activeModule === 'code' && (() => {
          const windowStyle = state.codeWindowStyle || 'macos';
          const theme = state.codeTheme || 'tokyo-night';
          const highlightLine = state.codeHighlightLine || 0;
          const showTabs = state.codeShowTabs !== false;
          const showStatusBar = state.codeShowStatusBar !== false;

          let themeBg = isLight ? '#FFFFFF' : '#0F1420';
          if (!isLight) {
            if (theme === 'tokyo-night') themeBg = '#1A1B26';
            else if (theme === 'cyber-emerald') themeBg = '#051412';
            else if (theme === 'monokai') themeBg = '#272822';
            else if (theme === 'one-dark') themeBg = '#282C34';
            else if (theme === 'github-dark') themeBg = '#0D1117';
          }

          const codeLines = (state.code || "const server = new CloudEngine({\n  region: 'us-east',\n  autoScale: true\n});\nawait server.deploy();").split('\n');

          return (
            <div
              className="w-full flex flex-col rounded-2xl overflow-hidden border shadow-2xl transition-all"
              style={{
                backgroundColor: themeBg,
                borderColor: isLight ? 'rgba(0,0,0,0.1)' : `rgba(${rgb}, 0.35)`,
                boxShadow: isLight
                  ? '0 20px 40px -10px rgba(0,0,0,0.12)'
                  : `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 35px rgba(${rgb}, 0.15)`
              }}
            >
              {/* Barra Superior según Estilo de Ventana */}
              {windowStyle === 'windows' && (
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-b"
                  style={{
                    backgroundColor: isLight ? '#F1F5F9' : 'rgba(0,0,0,0.25)',
                    borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <FileCode className="w-4 h-4" style={{ color: state.currentColor }} />
                    <span className="font-semibold" style={{ color: isLight ? '#0F172A' : '#F1F5F9' }}>
                      {state.codeFilename || 'pipeline.ts'}
                    </span>
                    <span
                      className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `rgba(${rgb}, 0.15)`,
                        color: state.currentColor
                      }}
                    >
                      {state.codeLanguage || 'TypeScript'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3.5 text-slate-400">
                    <Minus className="w-3.5 h-3.5 cursor-default" />
                    <Square className="w-3 h-3 cursor-default" />
                    <X className="w-3.5 h-3.5 cursor-default hover:text-rose-400" />
                  </div>
                </div>
              )}

              {windowStyle === 'linux' && (
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-b"
                  style={{
                    backgroundColor: isLight ? '#E2E8F0' : 'rgba(0,0,0,0.3)',
                    borderColor: isLight ? '#CBD5E1' : 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: state.currentColor }} />
                    <span className="font-mono text-xs font-medium" style={{ color: isLight ? '#0F172A' : '#E2E8F0' }}>
                      {state.codeFilename || 'main.py'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{
                        backgroundColor: `rgba(${rgb}, 0.15)`,
                        color: state.currentColor
                      }}
                    >
                      {state.codeLanguage || 'Python'}
                    </span>
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    </div>
                  </div>
                </div>
              )}

              {windowStyle === 'bash' && (
                <div
                  className="flex items-center justify-between px-4 py-2 border-b"
                  style={{
                    backgroundColor: isLight ? '#0F172A' : '#060911',
                    borderColor: 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>cloud-server:~$ cat {state.codeFilename || 'deploy.sh'}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    bash 5.2
                  </span>
                </div>
              )}

              {windowStyle === 'cmd' && (
                <div
                  className="flex items-center justify-between px-3 py-1.5 border-b"
                  style={{
                    backgroundColor: '#0C0C0C',
                    borderColor: 'rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Terminal className="w-3 h-3 text-slate-400" />
                    <span>Command Prompt - {state.codeFilename || 'script.cmd'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400 text-xs font-mono">
                    <span>—</span>
                    <span>□</span>
                    <span className="text-slate-200">✕</span>
                  </div>
                </div>
              )}

              {windowStyle === 'macos' && (
                <div
                  className="flex items-center justify-between px-5 py-3 border-b"
                  style={{
                    backgroundColor: isLight ? '#F8FAFC' : 'rgba(0,0,0,0.25)',
                    borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-xs" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-xs" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-xs" />

                    {showTabs ? (
                      <div className="flex items-center ml-4 gap-1.5">
                        {/* Pestaña Principal Activa */}
                        <div
                          className="px-3.5 py-1 rounded-t-lg border-t border-x flex items-center gap-2 text-xs font-mono font-medium shadow-xs"
                          style={{
                            backgroundColor: themeBg,
                            borderColor: isLight ? '#CBD5E1' : `rgba(${rgb}, 0.4)`,
                            color: isLight ? '#0F172A' : '#E2E8F0'
                          }}
                        >
                          <FileCode className="w-3.5 h-3.5" style={{ color: state.currentColor }} />
                          <span>{state.codeFilename || 'pipeline.ts'}</span>
                          <span className="text-[10px] text-slate-500 hover:text-white cursor-default">✕</span>
                        </div>
                        {/* Pestaña Secundaria Inactiva */}
                        <div
                          className="px-3 py-1 rounded-t-lg opacity-60 flex items-center gap-1.5 text-xs font-mono"
                          style={{ color: isLight ? '#64748B' : '#94A3B8' }}
                        >
                          <span>types.d.ts</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="ml-4 px-3 py-1 rounded-lg border flex items-center gap-2 text-xs font-mono font-medium shadow-inner"
                        style={{
                          backgroundColor: isLight ? '#FFFFFF' : '#0B101B',
                          borderColor: isLight ? '#CBD5E1' : `rgba(${rgb}, 0.4)`,
                          color: isLight ? '#0F172A' : '#E2E8F0'
                        }}
                      >
                        <FileCode className="w-3.5 h-3.5" style={{ color: state.currentColor }} />
                        <span>{state.codeFilename || 'server/pipeline.ts'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span
                      className="px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `rgba(${rgb}, 0.15)`,
                        color: state.currentColor,
                        border: `1px solid rgba(${rgb}, 0.3)`
                      }}
                    >
                      {state.codeLanguage || 'TypeScript'}
                    </span>
                  </div>
                </div>
              )}

              {/* Bloque de Código con Números de Línea y Resaltado */}
              <div className="p-5 font-mono text-sm overflow-x-auto leading-relaxed flex flex-col gap-1">
                {codeLines.map((lineText, i) => {
                  const lineNum = i + 1;
                  const isHighlighted = highlightLine === lineNum;
                  return (
                    <div
                      key={i}
                      className={`flex items-center px-2 py-0.5 rounded transition-all ${
                        isHighlighted
                          ? 'bg-indigo-500/20 border-l-2 border-indigo-400 font-bold shadow-xs'
                          : ''
                      }`}
                      style={{
                        backgroundColor: isHighlighted ? `rgba(${rgb}, 0.2)` : undefined,
                        borderLeftColor: isHighlighted ? state.currentColor : undefined
                      }}
                    >
                      {state.codeShowLineNumbers !== false && (
                        <span
                          className={`w-7 select-none text-right pr-3 shrink-0 font-mono text-xs ${
                            isHighlighted
                              ? 'text-indigo-300 font-bold'
                              : isLight ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {lineNum}
                        </span>
                      )}
                      <span
                        className="flex-1 whitespace-pre font-mono"
                        style={{
                          color: isHighlighted
                            ? (isLight ? '#0F172A' : '#FFFFFF')
                            : (isLight ? '#1E293B' : '#E2E8F0'),
                          fontSize: `${state.codeFontSize ? state.codeFontSize : modFontSize}px`
                        }}
                      >
                        {lineText || ' '}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Barra de Estado Inferior IDE */}
              {showStatusBar && (
                <div
                  className="flex items-center justify-between px-4 py-1.5 border-t text-[10px] font-mono select-none"
                  style={{
                    backgroundColor: isLight ? '#F1F5F9' : 'rgba(0,0,0,0.3)',
                    borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.06)',
                    color: isLight ? '#64748B' : '#94A3B8'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold" style={{ color: state.currentColor }}>
                      <GitBranch className="w-3 h-3" /> main*
                    </span>
                    <span>UTF-8</span>
                    <span>{state.codeLanguage || 'TypeScript'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* 2. MÓDULO DE KPIS (TARJETAS DE MÉTRICAS ULTRA HQ CON GRADIENTES)  */}
        {/* ================================================================= */}
        {state.activeModule === 'kpi' && (() => {
          const isBento = state.kpiLayout === 'bento';
          return (
            <div
              className={`grid ${
                isBento
                  ? 'grid-cols-2'
                  : state.moduleKpiCols === '1'
                  ? 'grid-cols-1'
                  : state.moduleKpiCols === '2'
                  ? 'grid-cols-2'
                  : state.kpis.length === 3
                  ? 'grid-cols-3'
                  : 'grid-cols-2'
              } h-auto w-full`}
              style={{ gap: `${state.moduleKpiGap ?? 18}px` }}
            >
              {state.kpis.map((kpi, idx) => {
                const trendText = kpi.trendLabel !== undefined
                  ? kpi.trendLabel
                  : (kpi.trend === 'up' ? 'Crecimiento' : kpi.trend === 'down' ? 'Reducción' : '');
                const isHeroBento = isBento && idx === 0 && state.kpis.length >= 3;

                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border flex flex-col justify-between transition-all shadow-xl relative overflow-hidden backdrop-blur-xl ${
                      isHeroBento ? 'col-span-2' : ''
                    }`}
                    style={{
                      background: isLight
                        ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(${rgb}, ${isHeroBento ? 0.14 : 0.08}) 100%)`
                        : `linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(${rgb}, ${isHeroBento ? 0.25 : 0.18}) 100%)`,
                      borderColor: isLight ? 'rgba(0,0,0,0.08)' : `rgba(${rgb}, 0.35)`,
                      borderTopColor: kpi.borderTop !== false ? state.currentColor : undefined,
                      borderTopWidth: kpi.borderTop !== false ? '4px' : '1px',
                      boxShadow: `0 15px 35px -10px rgba(${rgb}, 0.2)`
                    }}
                  >
                    {/* Halo decorativo de fondo */}
                    <div
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-20 blur-xl"
                      style={{ backgroundColor: state.currentColor }}
                    />

                    {/* Cabecera de la Tarjeta KPI con Etiqueta e Ícono */}
                    <div className="flex items-center justify-between gap-2 z-10 mb-2">
                      <span
                        className="font-mono font-bold uppercase tracking-wider truncate"
                        style={{
                          fontSize: `${Math.max(12, Math.round(modFontSize * 0.95))}px`,
                          color: isLight ? '#475569' : '#CBD5E1'
                        }}
                      >
                        {kpi.label}
                      </span>
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                        style={{
                          backgroundColor: `rgba(${rgb}, 0.15)`,
                          color: state.currentColor
                        }}
                      >
                        {idx === 0 ? <Award className="w-3.5 h-3.5" /> : idx === 1 ? <TrendingUp className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {/* Valor Central & Tendencia */}
                    <div className="flex items-baseline gap-2 flex-wrap z-10 my-1">
                      {kpi.prefix && (
                        <span
                          className="font-mono font-bold"
                          style={{
                            fontSize: `${Math.round((isHeroBento ? 28 : 24) * modScale * fontMult)}px`,
                            color: isLight ? '#64748B' : '#94A3B8'
                          }}
                        >
                          {kpi.prefix}
                        </span>
                      )}
                      <span
                        className="font-mono font-black tracking-tight"
                        style={{
                          fontSize: `${Math.round((isHeroBento ? 52 : 42) * modScale * fontMult)}px`,
                          color: isLight ? '#0F172A' : '#FFFFFF',
                          textShadow: isLight ? 'none' : `0 0 20px rgba(${rgb}, 0.3)`
                        }}
                      >
                        {kpi.val}
                      </span>
                      {kpi.suffix && (
                        <span
                          className="font-mono font-bold"
                          style={{
                            fontSize: `${Math.round((isHeroBento ? 28 : 24) * modScale * fontMult)}px`,
                            color: isLight ? '#64748B' : '#94A3B8'
                          }}
                        >
                          {kpi.suffix}
                        </span>
                      )}

                      {kpi.trend === 'up' && (
                        <span className="ml-auto text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {trendText && <span>{trendText}</span>}
                        </span>
                      )}
                      {kpi.trend === 'down' && (
                        <span className="ml-auto text-xs font-mono font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                          <TrendingDown className="w-3.5 h-3.5" />
                          {trendText && <span>{trendText}</span>}
                        </span>
                      )}
                    </div>

                    {/* Barra de Progreso Objetivo (Opcional) */}
                    {(kpi.showProgress || isHeroBento) && (
                      <div className="w-full mt-3 pt-2 border-t border-white/5 flex flex-col gap-1.5 z-10">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>Objetivo Anual</span>
                          <span className="font-bold" style={{ color: state.currentColor }}>{kpi.progressValue ?? 88}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(100, Math.max(0, kpi.progressValue ?? 88))}%`,
                              backgroundColor: state.currentColor,
                              boxShadow: `0 0 10px ${state.currentColor}88`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Texto de Comparativa / Benchmark */}
                    {kpi.benchmark && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-2 z-10">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: state.currentColor }} />
                        <span>{kpi.benchmark}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* 3. GRÁFICOS: BARRAS HORIZONTALES CON RANKING Y CONTENEDOR ANALYTIC*/}
        {/* ================================================================= */}
        {(state.activeModule === 'chart-bars' || (state.activeModule === 'chart' && (!state.chartType || state.chartType === 'horizontal-bars'))) && (() => {
          const maxVal = Math.max(...state.chartBars.map(b => b.pct), 0);
          const showRank = state.chartShowRank !== false;
          const unit = state.chartUnit || '%';

          return (
            <div
              className="w-full rounded-2xl p-5 border flex flex-col gap-4 backdrop-blur-xl shadow-2xl"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                borderColor: isLight ? 'rgba(0,0,0,0.08)' : `rgba(${rgb}, 0.35)`,
                boxShadow: `0 20px 40px -10px rgba(${rgb}, 0.2)`
              }}
            >
              {/* Cabecera Analítica */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: state.currentColor }} />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400">
                    Ranking Comparativo
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <span>Pico Máx:</span>
                  <span className="font-bold px-2 py-0.5 rounded-md text-white bg-slate-900 border border-white/10" style={{ color: state.currentColor }}>
                    {maxVal}{unit}
                  </span>
                </div>
              </div>

              {/* Lista de Barras con Ranking */}
              <div className="flex flex-col gap-3.5 w-full">
                {state.chartBars.map((bar, idx) => {
                  const barH = state.chartBarHeight || 18;
                  const rankColors = [
                    'text-amber-400 bg-amber-400/15 border-amber-400/30',
                    'text-slate-300 bg-slate-300/15 border-slate-300/30',
                    'text-amber-600 bg-amber-600/15 border-amber-600/30'
                  ];
                  const rankBadgeClass = rankColors[idx] || 'text-slate-400 bg-slate-800 border-slate-700';

                  return (
                    <div key={idx} className="flex flex-col gap-1.5 w-full">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <div className="flex items-center gap-2">
                          {showRank && (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${rankBadgeClass}`}>
                              #{idx + 1}
                            </span>
                          )}
                          <span
                            className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}
                            style={{ fontSize: `${modFontSize}px` }}
                          >
                            {bar.label}
                          </span>
                        </div>
                        <span
                          className="font-bold text-white px-2.5 py-0.5 rounded-lg shadow-md border border-white/20"
                          style={{ backgroundColor: bar.color || state.currentColor, fontSize: `${Math.max(11, Math.round(modFontSize * 0.88))}px` }}
                        >
                          {bar.pct}{unit}
                        </span>
                      </div>
                      <div
                        className="w-full rounded-full overflow-hidden p-0.5 border shadow-inner"
                        style={{
                          height: `${barH}px`,
                          backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(15, 23, 42, 0.8)',
                          borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700 shadow-sm relative"
                          style={{
                            width: `${Math.min(100, Math.max(0, bar.pct))}%`,
                            background: `linear-gradient(90deg, ${bar.color || state.currentColor}88, ${bar.color || state.currentColor})`,
                            boxShadow: `0 0 12px ${bar.color || state.currentColor}80`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* 4. GRÁFICOS: PASTEL / DONUT CIRCULAR O SPEEDOMETER GAUGE 180°     */}
        {/* ================================================================= */}
        {(state.activeModule === 'chart-pie' || (state.activeModule === 'chart' && state.chartType === 'pie')) && (() => {
          const totalPct = state.chartBars.reduce((acc, b) => acc + (b.pct || 0), 0) || 100;
          const defaultPalette = [state.currentColor, '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
          const isGauge = state.chartPieMode === 'gauge';
          const donutStroke = state.chartDonutThickness === 'thin' ? '10' : state.chartDonutThickness === 'full' ? '28' : '16';
          const heroMetric = state.chartDonutHeroText || `${state.chartBars[0]?.pct || 100}%`;
          const heroSub = state.chartDonutHeroSub || state.chartDonutText || 'Total';

          return (
            <div
              className="flex items-center justify-around gap-6 w-full p-5 rounded-2xl border backdrop-blur-xl shadow-2xl"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                borderColor: isLight ? 'rgba(0,0,0,0.08)' : `rgba(${rgb}, 0.35)`,
                boxShadow: `0 20px 40px -10px rgba(${rgb}, 0.2)`
              }}
            >
              {/* Contenedor Gráfico Circular o Gauge */}
              <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
                {isGauge ? (
                  // Velocímetro / Gauge 180°
                  <div className="relative w-48 h-36 flex items-end justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 160 95">
                      {/* Arco base */}
                      <path
                        d="M 20 85 A 60 60 0 0 1 140 85"
                        fill="none"
                        stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}
                        strokeWidth={donutStroke}
                        strokeLinecap="round"
                      />
                      {/* Arco activo principal */}
                      {(() => {
                        const topPct = (state.chartBars[0]?.pct || 80) / 100;
                        const arcLength = 188.5; // pi * 60
                        const dashArray = `${topPct * arcLength} ${arcLength}`;
                        return (
                          <path
                            d="M 20 85 A 60 60 0 0 1 140 85"
                            fill="none"
                            stroke={state.currentColor}
                            strokeWidth={donutStroke}
                            strokeDasharray={dashArray}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                            style={{ filter: `drop-shadow(0 0 8px ${state.currentColor}66)` }}
                          />
                        );
                      })()}
                    </svg>
                    <div className="absolute bottom-2 flex flex-col items-center text-center">
                      <span
                        className="font-mono font-black text-3xl tracking-tight"
                        style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}
                      >
                        {heroMetric}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        {heroSub}
                      </span>
                    </div>
                  </div>
                ) : (
                  // Donut 360° Circular
                  <>
                    <svg className="w-full h-full -rotate-90 transform filter drop-shadow-lg" viewBox="0 0 110 110">
                      <circle
                        cx="55"
                        cy="55"
                        r="40"
                        stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}
                        strokeWidth={donutStroke}
                        fill="transparent"
                      />
                      {(() => {
                        const circumference = 251.32;
                        let accumulatedPct = 0;
                        return state.chartBars.map((bar, idx) => {
                          const slicePct = bar.pct / totalPct;
                          const strokeDasharray = `${(slicePct * circumference).toFixed(2)} ${circumference.toFixed(2)}`;
                          const strokeDashoffset = `${(-(accumulatedPct / totalPct) * circumference).toFixed(2)}`;
                          accumulatedPct += bar.pct;
                          const sliceColor = bar.color || defaultPalette[idx % defaultPalette.length];

                          return (
                            <circle
                              key={idx}
                              cx="55"
                              cy="55"
                              r="40"
                              stroke={sliceColor}
                              strokeWidth={donutStroke}
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              fill="transparent"
                              className="transition-all duration-700"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span
                        className="font-mono font-black text-2xl"
                        style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}
                      >
                        {heroMetric}
                      </span>
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold pt-0.5">
                        {heroSub}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Leyenda Bento de Chips */}
              <div className="flex flex-col gap-2.5 flex-1 max-w-[55%]">
                {state.chartBars.map((bar, idx) => {
                  const sliceColor = bar.color || defaultPalette[idx % defaultPalette.length];
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 text-xs font-mono p-2.5 rounded-xl border"
                      style={{
                        backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
                        borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: sliceColor }}
                        />
                        <span className={`truncate text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                          {bar.label}
                        </span>
                      </div>
                      <span className="font-bold text-white shrink-0 text-xs px-2.5 py-0.5 rounded-lg bg-slate-900/90 border border-white/10">
                        {bar.pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* 5. GRÁFICOS: LÍNEAS / TENDENCIA CURVADA SPLINE CON PICO ATH       */}
        {/* ================================================================= */}
        {(state.activeModule === 'chart-line' || (state.activeModule === 'chart' && state.chartType === 'line')) && (() => {
          const bars1 = state.chartBars.length > 0 ? state.chartBars : [{ label: 'Q1', pct: 40 }, { label: 'Q2', pct: 85 }];
          const isDualSeries = state.chartLineSeries === 2;
          const bars2 = state.chartLineSeries2 && state.chartLineSeries2.length > 0
            ? state.chartLineSeries2
            : bars1.map((b) => ({ ...b, pct: Math.max(10, Math.round(b.pct * 0.7)) }));
          const color2 = state.chartLineColor2 || '#06B6D4';
          const strokeW = state.chartLineStroke || 4;
          const isCurved = state.chartLineCurved !== false;
          const showGrid = state.chartLineShowGrid !== false;
          const showAth = state.chartLineShowAth !== false;

          const svgW = 460;
          const svgH = 175;
          const padX = 45;
          const padY = 32;
          const maxPct = Math.max(100, ...bars1.map((b) => b.pct), ...(isDualSeries ? bars2.map((b) => b.pct) : []));

          const points1 = bars1.map((b, idx) => {
            const x = padX + (idx / Math.max(1, bars1.length - 1)) * (svgW - 2 * padX);
            const y = svgH - padY - (b.pct / maxPct) * (svgH - 2 * padY);
            return { x, y, ...b };
          });

          // Helper para generar curva Bezier Spline suave
          const getCurvedPath = (pts: typeof points1) => {
            if (pts.length <= 1) return '';
            let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
            for (let i = 1; i < pts.length; i++) {
              const prev = pts[i - 1];
              const curr = pts[i];
              const cp1x = (prev.x + curr.x) / 2;
              const cp1y = prev.y;
              const cp2x = (prev.x + curr.x) / 2;
              const cp2y = curr.y;
              d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
            }
            return d;
          };

          const pathD1 = isCurved
            ? getCurvedPath(points1)
            : points1.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, '');

          const areaD1 = `${pathD1} L ${points1[points1.length - 1].x.toFixed(1)} ${(svgH - padY).toFixed(1)} L ${points1[0].x.toFixed(1)} ${(svgH - padY).toFixed(1)} Z`;

          let pathD2 = '';
          let points2: typeof points1 = [];
          if (isDualSeries) {
            points2 = bars2.map((b, idx) => {
              const x = padX + (idx / Math.max(1, bars2.length - 1)) * (svgW - 2 * padX);
              const y = svgH - padY - (b.pct / maxPct) * (svgH - 2 * padY);
              return { x, y, ...b };
            });
            pathD2 = isCurved
              ? getCurvedPath(points2)
              : points2.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, '');
          }

          // Punto pico ATH
          const athPoint = points1.reduce((prev, curr) => (curr.pct > prev.pct ? curr : prev), points1[0]);

          return (
            <div
              className="w-full rounded-2xl p-5 border flex flex-col items-center backdrop-blur-xl shadow-2xl"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                borderColor: isLight ? 'rgba(0,0,0,0.08)' : `rgba(${rgb}, 0.35)`,
                boxShadow: `0 20px 40px -10px rgba(${rgb}, 0.2)`
              }}
            >
              <svg className="w-full h-44 overflow-visible" viewBox={`0 0 ${svgW} ${svgH}`}>
                <defs>
                  <linearGradient id="chartLineGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={state.currentColor} stopOpacity="0.45" />
                    <stop offset="100%" stopColor={state.currentColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Guías Horizontales con Escalas */}
                {showGrid && (
                  <>
                    <line x1={padX} y1={padY} x2={svgW - padX} y2={padY} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                    <text x={padX - 8} y={padY + 4} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">100%</text>

                    <line x1={padX} y1={(padY + svgH - padY) / 2} x2={svgW - padX} y2={(padY + svgH - padY) / 2} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                    <text x={padX - 8} y={(padY + svgH - padY) / 2 + 4} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">50%</text>

                    <line x1={padX} y1={svgH - padY} x2={svgW - padX} y2={svgH - padY} stroke="rgba(255,255,255,0.15)" />
                    <text x={padX - 8} y={svgH - padY + 4} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">0%</text>
                  </>
                )}

                {/* Área con Relleno Degradado de Serie 1 */}
                <path d={areaD1} fill="url(#chartLineGrad1)" />

                {/* Serie 2 (Si está activa) */}
                {isDualSeries && (
                  <path
                    d={pathD2}
                    fill="none"
                    stroke={color2}
                    strokeWidth={Math.max(2, strokeW - 1)}
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Línea Principal de Serie 1 */}
                <path
                  d={pathD1}
                  fill="none"
                  stroke={state.currentColor}
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: `drop-shadow(0 0 6px ${state.currentColor}80)` }}
                />

                {/* Tooltip ATH (Pico Histórico) */}
                {showAth && athPoint && (
                  <g transform={`translate(${athPoint.x}, ${athPoint.y - 36})`}>
                    <rect
                      x="-38"
                      y="-12"
                      width="76"
                      height="22"
                      rx="11"
                      fill={state.currentColor}
                      className="filter drop-shadow-lg"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {state.chartLineAthLabel || '★ ATH MÁX'}
                    </text>
                  </g>
                )}

                {/* Puntos y Etiquetas de Serie 1 */}
                {points1.map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill={state.currentColor}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="shadow-lg"
                    />
                    <text
                      x={pt.x}
                      y={svgH - padY + 18}
                      textAnchor="middle"
                      fill={isLight ? '#475569' : '#CBD5E1'}
                      fontSize="12"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}

                {/* Puntos de Serie 2 */}
                {isDualSeries && points2.map((pt, idx) => (
                  <circle
                    key={`p2-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill={color2}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* 6. MÓDULO DE CHAT MULTIPLATAFORMA (WHATSAPP, IMESSAGE, SLACK)     */}
        {/* ================================================================= */}
        {state.activeModule === 'chat' && (() => {
          const platform = state.chatPlatform || 'whatsapp';

          const renderFormattedText = (raw: string) => {
            const tokens = raw.split(/(\*\*.*?\*\*|\*[^*]+\*|__.*?__|_.*?_)/g);
            return tokens.map((token, i) => {
              if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('*') && token.endsWith('*') && token.length > 2)) {
                const clean = token.replace(/^\*+|\*+$/g, '');
                return <strong key={i} className="font-bold">{clean}</strong>;
              }
              if ((token.startsWith('__') && token.endsWith('__')) || (token.startsWith('_') && token.endsWith('_') && token.length > 2)) {
                const clean = token.replace(/^_+|_+$/g, '');
                return <em key={i} className="italic">{clean}</em>;
              }
              return token;
            });
          };

          return (
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-full h-auto backdrop-blur-xl">
              {/* Cabecera según Plataforma */}
              {platform === 'whatsapp' && (
                <div
                  className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]"
                  style={{ backgroundColor: isLight ? '#F0F2F5' : '#1F2C34' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-mono font-bold shadow-md shrink-0 ring-2 ring-white/20"
                      style={{ backgroundColor: state.currentColor }}
                    >
                      {(state.chatContactName ? state.chatContactName.charAt(0).toUpperCase() : 'A')}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-mono font-bold text-sm tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {state.chatContactName || 'Aleric Partner'}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 font-semibold">{state.chatOnlineStatus ?? 'en línea'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {platform === 'imessage' && (
                <div className="flex flex-col items-center px-4 py-3 bg-slate-900/90 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-1 ring-white/20">
                    {(state.chatContactName ? state.chatContactName.charAt(0).toUpperCase() : 'i')}
                  </div>
                  <span className="text-xs font-bold text-white mt-1">
                    {state.chatContactName || 'Cliente VIP'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">iMessage</span>
                </div>
              )}

              {platform === 'slack' && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1A1D21] border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-400 text-sm">#</span>
                    <span className="font-bold text-xs text-white">
                      {state.chatContactName ? state.chatContactName.toLowerCase().replace(/\s+/g, '-') : 'general'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Slack Active
                  </span>
                </div>
              )}

              {/* Mensajes del Chat */}
              <div
                className="p-5 space-y-3.5"
                style={{
                  backgroundColor: platform === 'whatsapp'
                    ? (isLight ? '#EFEAE2' : '#0B141A')
                    : platform === 'imessage'
                    ? '#05070A'
                    : '#1A1D21'
                }}
              >
                {state.chatMessages.map((msg, idx) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isBot ? 'items-end' : 'items-start'} relative`}
                    >
                      <div
                        className={`relative max-w-[85%] px-4 py-3 rounded-2xl shadow-md transition-all ${
                          platform === 'imessage'
                            ? isBot
                              ? 'bg-blue-600 text-white rounded-br-xs'
                              : 'bg-slate-800 text-slate-100 rounded-bl-xs'
                            : platform === 'slack'
                            ? isBot
                              ? 'bg-indigo-950/80 border border-indigo-500/30 text-indigo-100'
                              : 'bg-slate-900 border border-white/10 text-slate-200'
                            : isBot
                            ? isLight
                              ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-xs'
                              : 'bg-[#005C4B] text-[#E9EDEF] rounded-tr-xs'
                            : isLight
                            ? 'bg-[#FFFFFF] text-[#111B21] rounded-tl-xs'
                            : 'bg-[#202C33] text-[#E9EDEF] rounded-tl-xs'
                        }`}
                        style={{ fontSize: `${Math.round(modFontSize * 1.05)}px` }}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap font-sans">
                          {renderFormattedText(msg.text)}
                        </p>

                        <div className="flex items-center justify-end gap-1.5 mt-1.5 select-none">
                          <span className={`text-[10px] font-mono ${isLight && platform === 'whatsapp' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {msg.time}
                          </span>
                          {isBot && platform === 'whatsapp' && (
                            <CheckCheck className="w-4 h-4 text-[#53BDEB]" />
                          )}
                          {isBot && platform === 'imessage' && (
                            <span className="text-[9px] text-blue-200 font-mono">Entregado</span>
                          )}
                        </div>

                        {/* Reacción Emoji Flotante (en el último mensaje) */}
                        {state.chatReaction && idx === state.chatMessages.length - 1 && (
                          <div className="absolute -bottom-2.5 right-2 px-2 py-0.5 rounded-full bg-slate-900 border border-white/20 text-xs shadow-lg flex items-center gap-1 z-20">
                            <span>{state.chatReaction}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Nota de Voz Simulada (Opcional) */}
                {state.chatShowVoiceNote && (
                  <div className="flex items-end justify-end">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600/90 text-white shadow-lg max-w-[80%]">
                      <button type="button" className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-0.5 h-4">
                          {[6, 12, 16, 8, 14, 18, 10, 15, 7, 13, 11, 17, 9, 14].map((h, i) => (
                            <span key={i} className="w-1 bg-white/80 rounded-full" style={{ height: `${h}px` }} />
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-indigo-100">
                          <span>{state.chatVoiceNoteDuration || '0:38'}</span>
                          <span>Audio Note</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* 7. MÓDULO DE PASOS / FASES CON TIMELINE CONECTADA                 */}
        {/* ================================================================= */}
        {state.activeModule === 'steps' && (() => {
          const isTimeline = state.stepsLayout === 'connected-timeline';
          const formatLabel = (num: number, fmt?: string) => {
            const pad = num < 10 ? `0${num}` : `${num}`;
            switch (fmt) {
              case 'number': return `#${pad}`;
              case 'paso': return `PASO ${pad}`;
              case 'sprint': return `SPRINT ${pad}`;
              case 'hito': return `HITO ${String.fromCharCode(64 + num)}`;
              case 'minimal': return `${num}`;
              case 'fase':
              default:
                return `FASE ${pad}`;
            }
          };

          const stepsList = state.steps || state.stepsData || [];

          if (isTimeline) {
            return (
              <div className="w-full flex flex-col gap-3 py-2">
                {stepsList.map((st, idx) => {
                  const stepNum = st.stepNumber || (idx + 1);
                  const isLast = idx === stepsList.length - 1;
                  return (
                    <div key={idx} className="flex items-start gap-4 relative">
                      {/* Línea conectora entre nodos */}
                      {!isLast && (
                        <div
                          className="absolute left-4 top-8 bottom-0 w-0.5"
                          style={{
                            background: `linear-gradient(to bottom, ${state.currentColor}, rgba(255,255,255,0.1))`
                          }}
                        />
                      )}
                      {/* Nodo numérico con brillo */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs text-white shrink-0 shadow-lg z-10 ring-4 ring-slate-900"
                        style={{ backgroundColor: state.currentColor }}
                      >
                        {stepNum}
                      </div>

                      {/* Tarjeta del Paso */}
                      <div
                        className="flex-1 p-4 rounded-xl border backdrop-blur-xl transition-all shadow-md"
                        style={{
                          backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15, 23, 42, 0.85)',
                          borderColor: isLight ? 'rgba(0,0,0,0.08)' : `rgba(${rgb}, 0.35)`
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase"
                            style={{ backgroundColor: `rgba(${rgb}, 0.15)`, color: state.currentColor }}
                          >
                            {formatLabel(stepNum, state.stepsFormat)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {idx === 0 ? '✓ Completado' : idx === 1 ? '● En Proceso' : '○ Planificado'}
                          </span>
                        </div>
                        <h4
                          className={`font-bold text-white ${state.titleFont || 'font-inter'}`}
                          style={{ fontSize: `${Math.round(modFontSize * 1.15)}px` }}
                        >
                          {st.title}
                        </h4>
                        <p
                          className="text-slate-400 leading-relaxed mt-1"
                          style={{ fontSize: `${modFontSize}px` }}
                        >
                          {st.desc || st.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Layout estándar Grid 2x2
          return (
            <div
              className="grid grid-cols-2 w-full"
              style={{ gap: `${state.stepsGap ?? 16}px` }}
            >
              {stepsList.map((st, idx) => {
                const stepNum = st.stepNumber || (idx + 1);
                const stepDesc = st.description || st.desc || '';
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border flex flex-col gap-2 relative overflow-hidden shadow-xl backdrop-blur-xl transition-all"
                    style={{
                      backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15, 23, 42, 0.85)',
                      borderColor: isLight ? 'rgba(0,0,0,0.08)' : `rgba(${rgb}, 0.35)`,
                      boxShadow: `0 10px 25px -5px rgba(0,0,0,0.3)`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs text-white shadow-md ring-2 ring-white/20"
                        style={{ backgroundColor: state.currentColor }}
                      >
                        {stepNum}
                      </span>
                      <span
                        className="text-xs font-mono px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `rgba(${rgb}, 0.12)`,
                          color: state.currentColor
                        }}
                      >
                        {formatLabel(stepNum, state.stepsFormat)}
                      </span>
                    </div>
                    <h4
                      className={`font-bold text-white ${state.titleFont || 'font-inter'}`}
                      style={{ fontSize: `${Math.round(modFontSize * 1.15)}px` }}
                    >
                      {st.title}
                    </h4>
                    <p
                      className="text-slate-400 leading-relaxed line-clamp-3"
                      style={{ fontSize: `${modFontSize}px` }}
                    >
                      {stepDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* 8. MÓDULO UNIFICADO: CITA VIP, CTA CON GARANTÍAS O PROMO VOUCHER  */}
        {/* ================================================================= */}
        {(state.activeModule === 'quote-cta' || state.activeModule === 'text' || state.activeModule === 'cta' || state.activeModule === 'promo') && (() => {
          const mode = state.quoteCtaMode || (state.activeModule === 'cta' ? 'cta' : state.activeModule === 'promo' ? 'promo' : 'quote');

          // 1. MODO CTA: ALTA CONVERSIÓN CON FILA DE GARANTÍAS
          if (mode === 'cta') {
            const guarantees = state.ctaGuarantees && state.ctaGuarantees.length > 0
              ? state.ctaGuarantees
              : ['Cero Riesgo', 'Soporte 24/7', 'Cancelación Libre'];

            return (
              <div
                className="w-full rounded-2xl p-7 flex flex-col items-center justify-center text-center gap-4 border shadow-2xl relative overflow-hidden backdrop-blur-xl"
                style={{
                  background: isLight
                    ? `linear-gradient(135deg, rgba(${rgb}, 0.12) 0%, rgba(255, 255, 255, 0.95) 100%)`
                    : `linear-gradient(135deg, rgba(${rgb}, 0.28) 0%, rgba(15, 23, 42, 0.9) 100%)`,
                  borderColor: `rgba(${rgb}, 0.45)`,
                  boxShadow: `0 20px 45px -10px rgba(${rgb}, 0.25)`
                }}
              >
                {state.ctaActionBadge && (
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5"
                    style={{ backgroundColor: state.currentColor, color: '#FFFFFF' }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{state.ctaActionBadge}</span>
                  </span>
                )}

                {state.ctaActionPhrase && (
                  <p
                    className="font-black tracking-tight leading-snug px-3"
                    style={{
                      fontSize: `${Math.round(25 * modScale)}px`,
                      color: isLight ? '#0F172A' : '#FFFFFF'
                    }}
                  >
                    {state.ctaActionPhrase}
                  </p>
                )}

                {/* Botón Neón */}
                <div className="flex flex-col items-center gap-2 pt-1 w-full max-w-[85%]">
                  <div
                    className="px-8 py-3.5 rounded-xl font-mono font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
                    style={{
                      backgroundColor: state.currentColor,
                      boxShadow: `0 10px 30px rgba(${rgb}, 0.45)`
                    }}
                  >
                    <span>{state.ctaActionButtonText || 'Comenzar Ahora ➔'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  {state.ctaActionBenefit && (
                    <span
                      className="text-xs font-mono text-slate-400 text-center pt-0.5"
                      style={{ fontSize: `${Math.max(11, Math.round(modFontSize * 0.88))}px` }}
                    >
                      {state.ctaActionBenefit}
                    </span>
                  )}
                </div>

                {/* Fila de Garantías */}
                <div className="flex items-center justify-center gap-3 flex-wrap pt-2 border-t border-white/10 w-full">
                  {guarantees.map((g, gi) => (
                    <div key={gi} className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // 2. MODO PROMO: TICKET DE CUPÓN DE DESCUENTO
          if (mode === 'promo') {
            return (
              <div
                className="w-full rounded-2xl p-6 border-2 border-dashed flex items-center justify-between gap-4 backdrop-blur-xl relative overflow-hidden shadow-2xl"
                style={{
                  backgroundColor: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(15, 23, 42, 0.9)',
                  borderColor: state.currentColor
                }}
              >
                <div className="flex flex-col gap-1.5 flex-1">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider w-fit"
                    style={{ backgroundColor: state.currentColor, color: '#FFFFFF' }}
                  >
                    {state.promoDiscountBadge || '-30% DE DESCUENTO'}
                  </span>
                  <h3 className="font-extrabold text-base text-white">
                    {state.ctaActionPhrase || 'Oferta Exclusiva por Tiempo Limitado'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Aplica en el checkout antes del cierre del sprint.
                  </p>
                </div>

                {/* Caja de Código Perforado */}
                <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-900 border border-white/10 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CÓDIGO</span>
                  <span className="font-mono font-black text-lg tracking-widest text-emerald-400">
                    {state.promoCouponCode || 'ALERIC2025'}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <Copy className="w-3 h-3" /> Copiar cupón
                  </div>
                </div>
              </div>
            );
          }

          // 3. MODO DEFAULT: CITA EDITORIAL VIP CON ESTRELLAS Y AVATAR
          const starsCount = state.quoteRatingStars ?? 5;
          return (
            <div
              className="relative w-full rounded-2xl p-7 flex flex-col items-center text-center gap-4 border backdrop-blur-xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                borderColor: isLight ? 'rgba(0,0,0,0.08)' : `rgba(${rgb}, 0.35)`,
                boxShadow: `0 20px 45px -10px rgba(${rgb}, 0.2)`
              }}
            >
              {/* Marca de agua tipográfica */}
              <span
                className="font-serif font-black select-none pointer-events-none absolute -top-8 left-6 opacity-15"
                style={{ fontSize: `${Math.round(110 * modScale)}px`, color: state.currentColor }}
              >
                “
              </span>

              {/* 5 Estrellas Doradas */}
              <div className="flex items-center gap-1 z-10">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`w-4 h-4 ${si < starsCount ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                  />
                ))}
              </div>

              {/* Texto de la Cita */}
              <blockquote
                className={`italic font-medium leading-relaxed z-10 px-4 max-w-[95%] ${state.subtitleFont || state.titleFont || 'font-inter'}`}
                style={{
                  fontSize: `${Math.round((state.moduleFontSize || 16) * 1.35)}px`,
                  color: isLight ? '#0F172A' : '#F8FAFC'
                }}
              >
                "{state.contentHighlightText || 'El software a la medida transformó nuestra tasa de conversión en menos de 30 días.'}"
              </blockquote>

              {/* Perfil del Autor */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5 z-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-white shadow-md ring-2 ring-white/20"
                  style={{ backgroundColor: state.currentColor }}
                >
                  {(state.contentHighlightAuthor ? state.contentHighlightAuthor.charAt(0) : 'E')}
                </div>
                <div className="flex flex-col text-left">
                  <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {state.contentHighlightAuthor || 'Elena Rodríguez'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {state.contentHighlightRole || 'Directora de Operaciones'} {state.quoteAuthorCompany ? `• ${state.quoteAuthorCompany}` : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ================================================================= */}
        {/* 9. MÓDULO DE IMÁGENES: MOCKUPS DE SAFARI, MOBILE & GLASS CARD     */}
        {/* ================================================================= */}
        {state.activeModule === 'image' && (() => {
          const mockupType = state.imageMockupType || 'clean-raw';
          const zoomScale = (state.imageZoom || 100) / 100;
          const browserUrl = state.imageBrowserUrl || 'aleric.dev/preview';
          const showcaseBadge = state.imageShowcaseBadge;

          return (
            <div className="flex flex-col gap-3 h-auto w-full items-center justify-center">
              {state.images.map((img, idx) => {
                const ar = state.imageAspectRatio || 'auto';
                const fit = state.imageFit || 'cover';

                let containerStyle: React.CSSProperties = {
                  maxHeight: `${Math.round(380 * modScale)}px`
                };

                if (ar === '1:1') {
                  containerStyle.aspectRatio = '1 / 1';
                  containerStyle.maxHeight = '420px';
                } else if (ar === '16:9') {
                  containerStyle.aspectRatio = '16 / 9';
                  containerStyle.maxHeight = '360px';
                } else if (ar === '4:5') {
                  containerStyle.aspectRatio = '4 / 5';
                  containerStyle.maxHeight = '440px';
                } else if (ar === '4:3') {
                  containerStyle.aspectRatio = '4 / 3';
                  containerStyle.maxHeight = '380px';
                }

                // Mockup 1: Safari Browser Window
                if (mockupType === 'safari-browser') {
                  return (
                    <div
                      key={idx}
                      className="w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950 flex flex-col relative"
                      style={containerStyle}
                    >
                      {/* Barra Superior del Navegador */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-white/10 select-none">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950/80 border border-white/10 text-[10px] font-mono text-slate-300 w-48 justify-center">
                          <Lock className="w-2.5 h-2.5 text-emerald-400" />
                          <span>https://{browserUrl}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </div>

                      {/* Imagen dentro del Navegador */}
                      <div className="w-full h-full overflow-hidden relative">
                        <img
                          src={img.url}
                          alt={img.caption || 'Preview'}
                          className="w-full h-full transition-transform duration-500"
                          style={{ objectFit: fit, transform: `scale(${zoomScale})` }}
                        />
                        {showcaseBadge && (
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white bg-slate-900/90 border border-white/20 shadow-lg flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{showcaseBadge}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Mockup 2: Mobile Smartphone Frame
                if (mockupType === 'mobile-frame') {
                  return (
                    <div
                      key={idx}
                      className="rounded-[36px] p-2.5 bg-slate-900 border-4 border-slate-700 shadow-2xl flex flex-col items-center relative max-w-[280px]"
                      style={{ maxHeight: '420px' }}
                    >
                      {/* Dynamic Island */}
                      <div className="absolute top-4 w-20 h-4 rounded-full bg-black z-20 flex items-center justify-end px-2">
                        <span className="w-2 h-2 rounded-full bg-slate-800" />
                      </div>
                      <div className="w-full h-full rounded-[28px] overflow-hidden relative">
                        <img
                          src={img.url}
                          alt={img.caption || 'Preview'}
                          className="w-full h-full"
                          style={{ objectFit: fit, transform: `scale(${zoomScale})` }}
                        />
                      </div>
                    </div>
                  );
                }

                // Mockup 3: 3D Floating Glass Card
                if (mockupType === 'glass-card') {
                  return (
                    <div
                      key={idx}
                      className="w-full rounded-2xl p-2 border border-white/20 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                      style={{
                        ...containerStyle,
                        background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(${rgb}, 0.2) 100%)`,
                        boxShadow: `0 25px 50px -12px rgba(${rgb}, 0.35)`
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || 'Preview'}
                        className="w-full h-full rounded-xl"
                        style={{ objectFit: fit, transform: `scale(${zoomScale})` }}
                      />
                      {showcaseBadge && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white bg-slate-900/90 border border-white/20 shadow-lg flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{showcaseBadge}</span>
                        </div>
                      )}
                    </div>
                  );
                }

                // Mockup 4: Clean Raw
                return (
                  <div
                    key={idx}
                    className="w-full flex items-center justify-center transition-all overflow-hidden rounded-xl shadow-xl relative"
                    style={containerStyle}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || 'Preview'}
                      className="w-full h-full rounded-xl filter drop-shadow-2xl"
                      style={{
                        objectFit: fit,
                        transform: `scale(${zoomScale})`
                      }}
                    />
                    {showcaseBadge && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white bg-slate-900/90 border border-white/20 shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{showcaseBadge}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    );
  };

  // Render de Capas de Fondo según Layer Depth Order
  const renderBackgroundLayers = () => {
    const order: BackgroundLayerOrder = state.backgroundLayerOrder || 'pattern-lights-shapes';

    // El 100% del slider de opacidad mapea a 20% de opacidad real en el lienzo (sutil y elegante)
    const canvasPatternOpacity = ((state.patternOpacity ?? 100) / 100) * 0.20;

    const pScale = (state.patternScale || 100) / 100;
    let canvasBgSize = `${state.patternScale || 100}px ${state.patternScale || 100}px`;
    if (state.bgPattern === 'blueprint') {
      const maj = `${Math.round(140 * pScale)}px ${Math.round(140 * pScale)}px`;
      const min = `${Math.round(35 * pScale)}px ${Math.round(35 * pScale)}px`;
      canvasBgSize = `${maj}, ${maj}, ${min}, ${min}`;
    } else if (state.bgPattern === 'waves') {
      canvasBgSize = `${Math.round(200 * pScale)}px ${Math.round(90 * pScale)}px`;
    } else if (state.bgPattern === 'diagonal') {
      canvasBgSize = `${Math.round(80 * pScale)}px ${Math.round(80 * pScale)}px`;
    } else if (state.bgPattern === 'circuit') {
      canvasBgSize = `${Math.round(140 * pScale)}px ${Math.round(140 * pScale)}px`;
    } else if (state.bgPattern === 'crosses') {
      canvasBgSize = `${Math.round(90 * pScale)}px ${Math.round(90 * pScale)}px`;
    } else if (state.bgPattern === 'dots') {
      canvasBgSize = `${Math.round(64 * pScale)}px ${Math.round(64 * pScale)}px`;
    } else if (state.bgPattern === 'grid' || state.bgPattern === 'grid-dot' || state.bgPattern === 'matrix') {
      canvasBgSize = `${Math.round(90 * pScale)}px ${Math.round(90 * pScale)}px`;
    } else if (state.bgPattern === 'excel-grid') {
      canvasBgSize = `${Math.round(160 * pScale)}px ${Math.round(36 * pScale)}px`;
    } else if (state.bgPattern === 'git-graph' || state.bgPattern === 'code-lines') {
      canvasBgSize = `${Math.round(160 * pScale)}px ${Math.round(60 * pScale)}px`;
    } else if (state.bgPattern === 'horizontal-lines') {
      canvasBgSize = `100% ${Math.round(36 * pScale)}px`;
    }

    const fullBgEl = state.fullBgType && state.fullBgType !== 'none' ? (
      <div
        key="full-bg-layer"
        id="full-bg-layer"
        className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-300"
        style={{
          opacity: (state.wallpaperOpacity ?? 100) / 100,
          filter: state.wallpaperBlur ? `blur(${state.wallpaperBlur}px)` : undefined,
        }}
      >
        {state.fullBgType === 'custom-image' && state.customWallpaperUrl && (
          <img
            src={state.customWallpaperUrl}
            alt="Fondo personalizado"
            className="w-full h-full object-cover"
          />
        )}
        {state.fullBgType === 'mesh-aurora' && (
          <div className="w-full h-full full-bg-mesh-aurora" />
        )}
        {state.fullBgType === 'horizon-3d' && (
          <div className="w-full h-full full-bg-horizon-3d" />
        )}
        {state.fullBgType === 'terminal-wall' && (
          <div className="w-full h-full full-bg-terminal-wall" />
        )}
      </div>
    ) : null;

    const currentVignette: PatternVignette = state.patternVignette !== undefined ? state.patternVignette : 'gradient-diagonal';
    const intensity = (state.patternVignetteIntensity ?? 70) / 100;
    // Puntos de difusión calculados según la intensidad
    const fStart = Math.max(5, Math.round(25 - intensity * 15)); // 10% a 22%
    const fMid = Math.max(25, Math.round(65 - intensity * 25));   // 40% a 60%
    const fEnd = Math.max(60, Math.round(95 - intensity * 15));   // 80% a 92%
    const midAlpha = (0.5 * (1 - intensity * 0.5)).toFixed(2);

    const getVignetteStyle = (vig: PatternVignette): React.CSSProperties => {
      switch (vig) {
        case 'vignette':
          return {
            WebkitMaskImage: `radial-gradient(circle at 50% 50%, black ${fStart}%, transparent ${fEnd}%)`,
            maskImage: `radial-gradient(circle at 50% 50%, black ${fStart}%, transparent ${fEnd}%)`,
          };
        case 'gradient-diagonal':
          return {
            WebkitMaskImage: `linear-gradient(135deg, black ${fStart}%, rgba(0, 0, 0, ${midAlpha}) ${fMid}%, transparent ${fEnd}%)`,
            maskImage: `linear-gradient(135deg, black ${fStart}%, rgba(0, 0, 0, ${midAlpha}) ${fMid}%, transparent ${fEnd}%)`,
          };
        case 'gradient-top':
          return {
            WebkitMaskImage: `linear-gradient(to bottom, black ${fStart}%, transparent ${fEnd}%)`,
            maskImage: `linear-gradient(to bottom, black ${fStart}%, transparent ${fEnd}%)`,
          };
        case 'gradient-bottom':
          return {
            WebkitMaskImage: `linear-gradient(to top, black ${fStart}%, transparent ${fEnd}%)`,
            maskImage: `linear-gradient(to top, black ${fStart}%, transparent ${fEnd}%)`,
          };
        case 'gradient-lateral':
          return {
            WebkitMaskImage: 'linear-gradient(to right, transparent 5%, black 25%, black 75%, transparent 95%)',
            maskImage: 'linear-gradient(to right, transparent 5%, black 25%, black 75%, transparent 95%)',
          };
        case 'none':
        default:
          return {};
      }
    };

    const patternEl = patternEnabled ? (
      <div
        key="pattern"
        id="pattern-layer"
        className={`absolute inset-0 pointer-events-none transition-all ${patternClass} vignette-${currentVignette}`}
        style={{
          opacity: canvasPatternOpacity,
          backgroundSize: canvasBgSize,
          ...getVignetteStyle(currentVignette)
        }}
      />
    ) : null;

    const lightsEl = lightsEnabled && glowBg !== 'none' ? (
      <div
        key="lights"
        id="glow-layer"
        className="absolute inset-0 pointer-events-none transition-all duration-500 overflow-hidden"
        style={{ background: glowBg }}
      />
    ) : null;

    const shapesEl = shapesEnabled ? (
      <div
        key="shapes"
        id="shapes-layer"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: shapeOpacity }}
      >
        {perimeterPositions.map((pos, idx) => {
          const finalSize = Math.round(pos.size * shapeSizeMult);
          const styleProps: React.CSSProperties = {
            position: 'absolute',
            top: (pos as any).top,
            bottom: (pos as any).bottom,
            left: (pos as any).left,
            right: (pos as any).right,
            transform: `rotate(${pos.rot}deg)`,
            pointerEvents: 'none',
            transition: 'all 0.5s ease-out',
          };

          const finish: ShapeStyleVariant = state.shapeStyleVariant || 'glass';
          const geo: ShapeGeometry = state.shapeGeometry || 'orbs';

          // Acabado Visual Universal (6 Estilos Verificados)
          let finishStyle: React.CSSProperties = {};
          if (finish === 'flat') {
            finishStyle = {
              background: `rgba(${rgb}, 0.25)`,
              border: `1.5px solid rgba(${rgb}, 0.5)`
            };
          } else if (finish === 'pastel') {
            finishStyle = {
              background: `rgba(${rgb}, 0.12)`,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            };
          } else if (finish === 'neon-outline') {
            finishStyle = {
              background: `rgba(${rgb}, 0.05)`,
              border: `2px solid rgba(${rgb}, 0.85)`,
              boxShadow: `0 0 25px rgba(${rgb}, 0.6), inset 0 0 15px rgba(${rgb}, 0.2)`
            };
          } else if (finish === 'duotone') {
            finishStyle = {
              background: `linear-gradient(135deg, rgba(${rgb}, 0.4) 0%, rgba(${duoRgb}, 0.3) 100%)`,
              border: `1.5px solid rgba(${duoRgb}, 0.5)`,
              backdropFilter: 'blur(14px)',
              boxShadow: `0 20px 40px rgba(0,0,0,0.4)`
            };
          } else if (finish === 'holographic') {
            finishStyle = {
              background: `linear-gradient(135deg, rgba(244, 114, 182, 0.35) 0%, rgba(${rgb}, 0.4) 40%, rgba(6, 182, 212, 0.35) 70%, rgba(52, 211, 153, 0.25) 100%)`,
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(16px)',
              boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.3)`
            };
          } else {
            // 'glass' estándar
            finishStyle = {
              background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, rgba(${rgb}, 0.28) 45%, rgba(6,182,212,0.18) 75%, transparent 100%)`,
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(14px)',
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 0 25px rgba(${rgb}, 0.3)`
            };
          }

          // Geometrías con Acabado Visual Universal
          let shapeRadius = '9999px';
          let clipPath: string | undefined = undefined;

          if (geo === 'squares') {
            shapeRadius = '24px';
          } else if (geo === 'diamonds') {
            clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
            shapeRadius = '0px';
          } else if (geo === 'triangles') {
            clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            shapeRadius = '0px';
          } else if (geo === 'hexagons') {
            clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
            shapeRadius = '0px';
          } else if (geo === 'crosses') {
            clipPath = 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)';
            shapeRadius = '0px';
          } else if (geo === 'stars') {
            clipPath = 'polygon(50% 0%, 63% 37%, 100% 50%, 63% 63%, 50% 100%, 37% 63%, 0% 50%, 37% 37%)';
            shapeRadius = '0px';
          }

          if (geo === 'capsules') {
            const capWidth = Math.round(finalSize * 1.8);
            const capHeight = Math.round(finalSize * 0.75);
            return (
              <div
                key={idx}
                style={{
                  ...styleProps,
                  width: `${capWidth}px`,
                  height: `${capHeight}px`,
                  borderRadius: '9999px',
                  ...finishStyle
                }}
              />
            );
          }

          if (geo === 'custom-icons') {
            const iconCat = state.shapeIconCategory || 'tech';
            const iconPool = iconCat === 'growth' 
              ? [Rocket, TrendingUp, Zap, Sparkles, ShieldCheck]
              : iconCat === 'creative'
              ? [Palette, Compass, Sparkles, Star, Tag]
              : iconCat === 'social'
              ? [MessageSquare, Share2, Heart, Flame, User]
              : iconCat === 'security'
              ? [ShieldCheck, Lock, Server, Cloud, Cpu]
              : iconCat === 'finance'
              ? [DollarSign, ShoppingCart, Percent, TrendingUp, Award]
              : [Code2, Cpu, Terminal, Layers, FileCode];
            
            const IconCmp = iconPool[idx % iconPool.length];
            const iconInnerSize = Math.max(16, Math.round(finalSize * 0.45));

            return (
              <div
                key={idx}
                style={{
                  ...styleProps,
                  width: `${finalSize}px`,
                  height: `${finalSize}px`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...finishStyle
                }}
              >
                <IconCmp 
                  style={{ 
                    width: `${iconInnerSize}px`, 
                    height: `${iconInnerSize}px`,
                    color: finish === 'flat' ? (isLight ? '#0F172A' : '#FFFFFF') : `rgb(${rgb})`,
                    filter: finish === 'neon-outline' ? `drop-shadow(0 0 10px rgba(${rgb}, 0.8))` : undefined
                  }} 
                />
              </div>
            );
          }

          if (geo === 'rings') {
            return (
              <div
                key={idx}
                style={{
                  ...styleProps,
                  width: `${finalSize}px`,
                  height: `${finalSize}px`,
                  borderRadius: '9999px',
                  padding: `${Math.round(finalSize * 0.18)}px`,
                  ...finishStyle
                }}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: isLight ? '#F8FAFC' : '#070A0F',
                    opacity: 0.95
                  }}
                />
              </div>
            );
          }

          if (geo === 'tech-code') {
            return (
              <div
                key={idx}
                className="font-mono font-bold tracking-widest flex items-center justify-center select-none"
                style={{
                  ...styleProps,
                  fontSize: `${Math.round(finalSize * 0.16)}px`,
                  padding: '8px 18px',
                  borderRadius: '14px',
                  ...finishStyle,
                  color: isLight ? '#0F172A' : '#FFFFFF'
                }}
              >
                {idx % 2 === 0 ? '<Media Studio />' : '{ v1.0 }'}
              </div>
            );
          }

          return (
            <div
              key={idx}
              style={{
                ...styleProps,
                width: `${finalSize}px`,
                height: `${finalSize}px`,
                borderRadius: shapeRadius,
                clipPath,
                ...finishStyle
              }}
            />
          );
        })}
      </div>
    ) : null;

    // Orden de capas de fondo: Fondo Completo/Wallpaper ➔ Patrón de textura ➔ Formas decorativas ➔ Luces ambientales
    return <>{fullBgEl}{patternEl}{shapesEl}{lightsEl}</>;
  };

  // Separación / Gap entre el bloque de texto y el módulo central
  const gapTagsToModule = state.gapTagsToModule || 24;

  return (
    <div
      ref={ref}
      id="canvas-target"
      className={`relative overflow-hidden rounded-2xl flex flex-col select-none shadow-[0_35px_100px_rgba(0,0,0,0.9)] border transition-all duration-300 ${
        isLight ? 'bg-[#F8FAFC] border-slate-200/90' : 'bg-[#070A0F] border-slate-800/60'
      }`}
      style={{
        width: `${r.nativeW}px`,
        height: `${r.nativeH}px`,
        padding: isWidescreen ? '44px 56px 44px 56px' : '56px 64px 64px 64px',
        boxSizing: 'border-box'
      }}
    >
      {/* CAPAS DE FONDO INTERACTIVAS (PATRÓN, LUCES Y FORMAS) */}
      {renderBackgroundLayers()}

      {/* CABECERA (HEADER OFICIAL) */}
      <header className={headerClass} style={headerInlineStyle}>
        <div id="view-logo-box" className="flex items-center shrink-0 max-w-[55%]">
          {renderLogoElement()}
        </div>

        {renderHeaderBadge()}
      </header>

      {/* ÁREA CENTRAL PRINCIPAL: 16:9 2 COLUMNAS VS FORMATO VERTICAL */}
      {isWidescreen ? (
        <div
          id="content-container"
          className="relative z-10 grid grid-cols-2 gap-10 items-center w-full h-full my-auto flex-1"
        >
          {state.layoutFlow === 'content-first' ? (
            <>
              <div className="flex items-center justify-center w-full">
                {renderModuleBlock()}
              </div>
              <div className="flex flex-col justify-center w-full">
                {renderTextBlock()}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col justify-center w-full">
                {renderTextBlock()}
              </div>
              <div className="flex items-center justify-center w-full">
                {renderModuleBlock()}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Espaciador Superior Dinámico para vertical / cuadrado */}
          <div
            id="canvas-spacer-top"
            className="w-full transition-all pointer-events-none"
            style={{
              flex: state.moduleVisible ? '4 1 0%' : '10 1 0%',
              minHeight: state.moduleVisible ? '40px' : '140px'
            }}
          />

          {/* Contenedor Vertical Dinámico que respeta contentBlockOrder */}
          <div
            id="content-container"
            className="relative z-10 flex flex-col w-full shrink-0"
            style={{ gap: `${state.gapContentBlocks || gapTagsToModule}px` }}
          >
            {state.contentBlockOrder ? (
              state.contentBlockOrder.map((blockId) => {
                if (blockId === 'tags') return renderTagsElement();
                if (blockId === 'title') return renderTitleElement();
                if (blockId === 'subtitle') return renderSubtitleElement();
                if (blockId === 'module') return renderModuleBlock();
                return null;
              })
            ) : state.layoutFlow === 'content-first' ? (
              <>
                {renderModuleBlock()}
                {renderTextBlock()}
              </>
            ) : (
              <>
                {renderTextBlock()}
                {renderModuleBlock()}
              </>
            )}
          </div>

          {/* Espaciador Inferior Dinámico para vertical / cuadrado */}
          <div
            id="canvas-spacer-bottom"
            className="w-full transition-all pointer-events-none"
            style={{
              flex: state.moduleVisible ? '6 1 0%' : '12 1 0%',
              minHeight: state.moduleVisible ? '50px' : '160px'
            }}
          />
        </>
      )}

      {/* PIE DE IMAGEN (FOOTER OFICIAL) */}
      {(() => {
        const ctaColor = state.ctaColorMode === 'inherit' 
          ? state.currentColor 
          : state.ctaColorMode === 'custom' 
          ? (state.ctaCustomColor || '#FFFFFF') 
          : (isLight ? '#334155' : '#CBD5E1');

        const handleColor = state.handleColorMode === 'contrast' 
          ? (isLight ? '#0F172A' : '#FFFFFF') 
          : state.handleColorMode === 'custom' 
          ? (state.handleCustomColor || state.currentColor) 
          : state.currentColor;

        return (
          <footer className={footerClass} style={footerInlineStyle}>
            {(state.ctaOrder || 'cta-first') === 'cta-first' ? (
              <>
                <div className="flex items-center gap-2.5 shrink min-w-0">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: state.currentColor }} />
                  <p
                    className="font-medium truncate pr-4 transition-all"
                    style={{ fontSize: `${footerSize * 1.3}px`, color: ctaColor }}
                  >
                    {state.cta || 'Escríbenos y migramos tu operación a la nube.'}
                  </p>
                </div>
                <div
                  className="font-mono font-bold tracking-wide shrink-0 transition-all"
                  style={{ fontSize: `${footerSize * 1.55}px`, color: handleColor }}
                >
                  {state.handle || 'tumarca.dev'}
                </div>
              </>
            ) : (
              <>
                <div
                  className="font-mono font-bold tracking-wide shrink-0 transition-all"
                  style={{ fontSize: `${footerSize * 1.55}px`, color: handleColor }}
                >
                  {state.handle || 'tumarca.dev'}
                </div>
                <div className="flex items-center gap-2.5 shrink min-w-0">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: state.currentColor }} />
                  <p
                    className="font-medium truncate pr-4 transition-all"
                    style={{ fontSize: `${footerSize * 1.3}px`, color: ctaColor }}
                  >
                    {state.cta || 'Escríbenos y migramos tu operación a la nube.'}
                  </p>
                </div>
              </>
            )}
          </footer>
        );
      })()}

    </div>
  );
});

CanvasTarget.displayName = 'CanvasTarget';
