import React, { forwardRef, useMemo } from 'react';
import { PostState, ShapePlacement, ShapeStyleVariant, ShapeGeometry, ShapeProximity, BackgroundLayerOrder } from '../../types';
import { aspectRatios } from '../../constants/templates';
import { Star, CheckCircle2, Radio, User, Sparkles, Tag, ArrowRight, FileCode, Terminal, TrendingUp, TrendingDown, CheckCheck } from 'lucide-react';

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

  // Multiplicadores de Formas
  const shapeSizeMult = state.shapeSizeVariant === 'small' ? 0.65 : (state.shapeSizeVariant === 'large' ? 1.45 : 1.0);
  const shapeOpacity = (state.shapeOpacity ?? 60) / 100;
  const shapesEnabled = state.shapesEnabled !== false && state.shapeType !== 'none';

  // Desplazamiento según Proximidad ('edges', 'balanced', 'close')
  const proximityOffset = state.shapeProximity === 'edges' ? -60 : (state.shapeProximity === 'close' ? 10 : -25);

  // Generador procedimental de posiciones perimetrales (BORDES ÚNICAMENTE, CENTRO 100% LIMPIO)
  const perimeterPositions = useMemo(() => {
    const seed = state.shapeSeed || 12345;
    const count = Math.max(4, Math.min(14, state.shapeCount || 6));
    const off = proximityOffset;

    // Generador pseudoaleatorio determinista por semilla
    const rng = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const placement: ShapePlacement = state.shapePlacement || 'random-edges';

    if (placement === 'corners') {
      return [
        { top: `${off}px`, right: `${off}px`, size: 340, rot: 12 },
        { bottom: `${off}px`, left: `${off}px`, size: 300, rot: -14 },
        { top: `${Math.max(10, off + 50)}px`, left: `${off}px`, size: 230, rot: -8 },
        { bottom: `${Math.max(10, off + 60)}px`, right: `${off}px`, size: 250, rot: 18 },
      ];
    }

    if (placement === 'sides') {
      return [
        { top: '20%', left: `${off}px`, size: 270, rot: -10 },
        { top: '68%', left: `${off}px`, size: 240, rot: 15 },
        { top: '28%', right: `${off}px`, size: 290, rot: 12 },
        { top: '74%', right: `${off}px`, size: 260, rot: -15 },
      ];
    }

    // Procedural distribution: reparte orgánicamente entre los 4 bordes (top, right, bottom, left)
    const positions = [];
    const edges = ['top', 'right', 'bottom', 'left'];

    for (let i = 0; i < count; i++) {
      const s = seed + i * 17 + 1;
      const edge = edges[i % 4];
      const sizeBase = 200 + rng(s + 1) * 150;
      const rot = Math.round(rng(s + 2) * 120 - 60);

      if (edge === 'top') {
        const leftPct = 6 + rng(s + 3) * 84;
        const topOff = off + Math.round((rng(s + 4) - 0.5) * 35);
        positions.push({ top: `${topOff}px`, left: `${leftPct.toFixed(1)}%`, size: sizeBase, rot });
      } else if (edge === 'bottom') {
        const leftPct = 6 + rng(s + 3) * 84;
        const bottomOff = off + Math.round((rng(s + 4) - 0.5) * 35);
        positions.push({ bottom: `${bottomOff}px`, left: `${leftPct.toFixed(1)}%`, size: sizeBase, rot });
      } else if (edge === 'left') {
        const topPct = 12 + rng(s + 3) * 74;
        const leftOff = off + Math.round((rng(s + 4) - 0.5) * 35);
        positions.push({ top: `${topPct.toFixed(1)}%`, left: `${leftOff}px`, size: sizeBase, rot });
      } else {
        const topPct = 12 + rng(s + 3) * 74;
        const rightOff = off + Math.round((rng(s + 4) - 0.5) * 35);
        positions.push({ top: `${topPct.toFixed(1)}%`, right: `${rightOff}px`, size: sizeBase, rot });
      }
    }

    return positions;
  }, [state.shapePlacement, state.shapeSeed, state.shapeCount, proximityOffset]);

  // Clase de viñeta para la textura
  const vignetteClass = `vignette-${state.patternVignette || 'vignette'}`;

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
  const tagsJustifyClass = titleAlign === 'left' ? 'justify-start' : (titleAlign === 'right' ? 'justify-end' : 'justify-center');

  // Badges de Tecnologías
  const tagsList = (state.tags || '').split(',').map(t => t.trim()).filter(Boolean);

  // Bordes para imágenes
  const imgBorderClass = `img-border-${state.imageBorderStyle || 'none'}`;

  // Escala interna y tamaño de fuente del módulo
  const modScale = (state.moduleScale || 100) / 100;
  const modFontSize = state.moduleFontSize || 14;

  let modulePad = 'p-6';
  let moduleMinH = isWidescreen ? 'min-h-[220px]' : 'min-h-[280px]';
  if (state.moduleSize === 'compact') {
    modulePad = 'p-4';
    moduleMinH = isWidescreen ? 'min-h-[160px]' : 'min-h-[200px]';
  } else if (state.moduleSize === 'spacious') {
    modulePad = 'p-8';
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
  const renderLogoElement = () => {
    const name = state.companyName || 'Tu Empresa';
    const brandMode = state.headerBrandMode || 'icon-text';

    // 1. Solo texto de la empresa
    if (brandMode === 'only-text' || state.headerShowLogo === false) {
      return (
        <div
          className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}
          style={{ fontSize: `${Math.round(headerFontSize * 1.55)}px` }}
        >
          {name}
        </div>
      );
    }

    // Isotipo o imagen de logo
    let logoImgOrIcon: React.ReactNode = null;

    if (state.customLogoUrl) {
      logoImgOrIcon = (
        <img
          src={state.customLogoUrl}
          alt="Logo"
          className="filter drop-shadow-md transition-all"
          style={logoRatioStyle}
        />
      );
    } else if (state.logoType === 'monogram') {
      const initial = name.charAt(0).toUpperCase();
      logoImgOrIcon = (
        <div
          className="rounded-2xl flex items-center justify-center font-mono font-extrabold text-white shadow-lg transition-all shrink-0"
          style={{
            width: `${logoH}px`,
            height: `${logoH}px`,
            fontSize: `${Math.round(logoH * 0.45)}px`,
            background: `linear-gradient(135deg, ${state.currentColor}, #1E1B4B)`,
            border: '1.5px solid rgba(255,255,255,0.2)'
          }}
        >
          {initial}
        </div>
      );
    } else if (state.logoType === 'text') {
      return (
        <div
          className={`font-mono font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}
          style={{ fontSize: `${Math.round(headerFontSize * 1.6)}px` }}
        >
          {name}<span style={{ color: state.currentColor }}>.</span>
        </div>
      );
    } else {
      // 'generic': Logo Vectorial Tech
      logoImgOrIcon = (
        <div
          className="rounded-xl flex items-center justify-center shadow-lg transition-all shrink-0"
          style={{
            width: `${logoH}px`,
            height: `${logoH}px`,
            background: 'rgba(255,255,255,0.05)',
            border: `1.5px solid ${state.currentColor}`
          }}
        >
          <svg
            width={Math.round(logoH * 0.55)}
            height={Math.round(logoH * 0.55)}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={state.currentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke={state.currentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke={state.currentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    }

    // 2. Solo Logo
    if (brandMode === 'only-logo') {
      return (
        <div className="flex items-center shrink-0">
          {logoImgOrIcon}
        </div>
      );
    }

    // 3. Logo + Texto
    return (
      <div className="flex items-center gap-3">
        {logoImgOrIcon}
        <span
          className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}
          style={{ fontSize: `${Math.round(headerFontSize * 1.35)}px` }}
        >
          {name}
        </span>
      </div>
    );
  };

  // Badge Superior Estilos
  const badgeStyle = state.headerBadgeStyle || 'pill';
  const badgeColorMode = state.headerBadgeColorMode || 'inherit';
  let badgeColor = state.currentColor;
  if (badgeColorMode === 'contrast') {
    badgeColor = isLight ? '#0F172A' : '#FFFFFF';
  } else if (badgeColorMode === 'custom' && state.headerBadgeCustomColor) {
    badgeColor = state.headerBadgeCustomColor;
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
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: isLight ? '#0F172A' : '#FFFFFF',
            fontSize: `${headerFontSize}px`
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: badgeColor }} />
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
            color: isLight ? '#334155' : '#CBD5E1',
            fontSize: `${headerFontSize}px`
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: badgeColor }} />
          <span>{state.category}</span>
        </div>
      );
    }

    // Default 'pill'
    return (
      <div
        id="view-badge"
        className="px-5 py-2 rounded-full font-mono font-bold tracking-wider uppercase flex items-center gap-2.5 transition-all shadow-sm shrink-0"
        style={{
          backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15, 23, 42, 0.85)',
          border: `1.5px solid ${badgeColor}`,
          color: isLight ? '#0F172A' : '#FFFFFF',
          fontSize: `${headerFontSize}px`
        }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: badgeColor }} />
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
    headerClass += ' border-t-4 border-b border-white/10 py-4';
    headerInlineStyle.borderTopColor = state.currentColor;
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
    headerClass += ' border-b border-white/[0.08] pb-6';
  }

  // Footer class y estilo de contenedor
  let footerClass = 'relative z-10 flex items-center transition-all gap-6 w-full shrink-0';
  const footerInlineStyle: React.CSSProperties = {};
  if (state.footerShape === 'pill') {
    footerClass += ' bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-full px-6 py-3';
  } else if (state.footerShape === 'card') {
    footerClass += ' bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5';
  } else if (state.footerShape === 'accent-bar') {
    footerClass += ' border-b-4 border-t border-white/10 py-4';
    footerInlineStyle.borderBottomColor = state.currentColor;
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
    footerClass += ' border-t border-white/[0.08] pt-6';
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

    if (groupType === 'rating') {
      return (
        <div className={`flex items-center gap-2.5 pt-1 ${tagsJustifyClass}`}>
          <div className="flex items-center text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className={`font-mono font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {state.ratingScore || '4.9/5.0'}
          </span>
          <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            • {state.ratingCount || '+500 Clientes'}
          </span>
        </div>
      );
    }

    if (groupType === 'author') {
      return (
        <div className={`flex items-center gap-3 pt-1 ${tagsJustifyClass}`}>
          {state.authorAvatar ? (
            <img src={state.authorAvatar} alt="Autor" className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-sm" />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-white text-xs shadow-sm"
              style={{ backgroundColor: state.currentColor }}
            >
              {(state.authorName || 'R').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className={`font-bold text-xs tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {state.authorName || 'Ricardo Zapata'}
            </span>
            <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {state.authorRole || 'Lead Software Architect'}
            </span>
          </div>
        </div>
      );
    }

    if (groupType === 'social-proof') {
      return (
        <div className={`flex items-center gap-2 pt-1 ${tagsJustifyClass}`}>
          <div
            className="px-4 py-1.5 rounded-full font-mono text-xs font-semibold flex items-center gap-2 shadow-sm"
            style={{
              backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15, 23, 42, 0.75)',
              border: `1px solid ${state.currentColor}40`,
              color: isLight ? '#0F172A' : '#F1F5F9'
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: state.currentColor }} />
            <span>{state.socialProofText || '⚡ Confiado por más de 120 startups en Latam'}</span>
          </div>
        </div>
      );
    }

    if (groupType === 'status-pill') {
      return (
        <div className={`flex items-center gap-2 pt-1 ${tagsJustifyClass}`}>
          <div
            className="px-3.5 py-1 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-2"
            style={{
              backgroundColor: `${state.currentColor}20`,
              border: `1.5px solid ${state.currentColor}`,
              color: isLight ? '#0F172A' : '#FFFFFF'
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: state.currentColor }} />
            <span>{state.statusPillText || 'EN VIVO • NUEVA VERSIÓN'}</span>
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
            className={`px-4 py-1.5 rounded-lg text-sm font-mono font-medium tracking-wide ${
              isLight
                ? 'bg-slate-100/95 border border-slate-300/90 text-slate-800 shadow-xs'
                : 'bg-white/5 border border-white/10 text-slate-200'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Render del Bloque de Texto (Título, Subtítulo y Grupo Intermedio)
  const renderTextBlock = () => {
    const tagsPos = state.tagsPosition || 'below-subtitle';
    const gapTitleSub = state.gapTitleSubtitle || 12;
    const gapTextTags = state.gapTextToTags || 16;

    return (
      <div id="block-text" className="flex flex-col w-full">
        {/* Grupo Intermedio arriba del título si está configurado */}
        {tagsPos === 'above-title' && (
          <div style={{ marginBottom: `${gapTextTags}px` }}>
            {renderIntermediateGroup()}
          </div>
        )}

        {/* Subtítulo Arriba si subtitlePos === 'above' */}
        {state.subtitlePos === 'above' && state.subtitle && (
          <div className={subtitleAlignClass} style={{ marginBottom: `${gapTitleSub}px` }}>
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
        )}

        {/* Título Principal */}
        <div className={titleAlignClass}>
          <h2
            className={`font-extrabold leading-[1.22] tracking-tight drop-shadow-lg transition-all ${state.titleFont || 'font-inter'}`}
            style={{
              fontSize: `${state.titleSize}px`,
              color: titleColor
            }}
          >
            {state.title || 'Escribe aquí tu título principal...'}
          </h2>
        </div>

        {/* Subtítulo Abajo si subtitlePos === 'below' */}
        {state.subtitlePos !== 'above' && state.subtitle && (
          <div className={subtitleAlignClass} style={{ marginTop: `${gapTitleSub}px` }}>
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
        )}

        {/* Grupo Intermedio abajo del subtítulo si está configurado */}
        {tagsPos === 'below-subtitle' && (
          <div style={{ marginTop: `${gapTextTags}px` }}>
            {renderIntermediateGroup()}
          </div>
        )}
      </div>
    );
  };

  // Render del Módulo Central Optimizado (Todos los casos de nivel Ultra HQ)
  const renderModuleBlock = () => {
    if (!state.moduleVisible) return null;

    return (
      <div
        id="block-module"
        className={`${isLight ? 'glass-card-light' : 'glass-card-clean'} rounded-2xl ${modulePad} ${moduleMinH} transition-all w-full flex flex-col justify-center h-auto`}
        style={{
          padding: `${Math.round(24 * modScale)}px`
        }}
      >
        {/* ================================================================= */}
        {/* 1. MÓDULO DE CÓDIGO (VENTANA IDE TIPO MAC CON SEMÁFORO Y SINTAXIS) */}
        {/* ================================================================= */}
        {state.activeModule === 'code' && (
          <div
            className="w-full flex flex-col rounded-2xl overflow-hidden border shadow-2xl transition-all"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0B101B',
              borderColor: isLight ? 'rgba(0,0,0,0.1)' : `rgba(${rgb}, 0.35)`,
              boxShadow: isLight
                ? '0 20px 40px -10px rgba(0,0,0,0.12)'
                : `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 35px rgba(${rgb}, 0.15)`
            }}
          >
            {/* Barra Superior de la Ventana IDE */}
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b"
              style={{
                backgroundColor: isLight ? '#F8FAFC' : '#111827',
                borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.08)'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-xs" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-xs" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-xs" />

                {/* Pestaña de Archivo Activo */}
                <div
                  className="ml-4 px-3.5 py-1 rounded-lg border flex items-center gap-2 text-xs font-mono font-medium shadow-inner"
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : '#0B101B',
                    borderColor: isLight ? '#CBD5E1' : `rgba(${rgb}, 0.4)`,
                    color: isLight ? '#0F172A' : '#E2E8F0'
                  }}
                >
                  <FileCode className="w-3.5 h-3.5" style={{ color: state.currentColor }} />
                  <span>{state.codeFilename || 'server/pipeline.ts'}</span>
                </div>
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

            {/* Bloque de Código con Números de Línea y Sintaxis */}
            <div className="p-6 font-mono text-sm overflow-x-auto leading-relaxed flex gap-5">
              {state.codeShowLineNumbers !== false && (
                <div
                  className="select-none flex flex-col text-right pr-4 border-r font-mono text-xs"
                  style={{
                    borderColor: isLight ? '#E2E8F0' : 'rgba(255,255,255,0.08)',
                    color: isLight ? '#94A3B8' : '#475569'
                  }}
                >
                  {(state.code || "system.migrate({ from: 'Excel', to: 'CloudDB' });")
                    .split('\n')
                    .map((_, i) => (
                      <span key={i} className="leading-relaxed">{i + 1}</span>
                    ))}
                </div>
              )}
              <pre
                className="flex-1 whitespace-pre font-mono text-sm leading-relaxed"
                style={{
                  color: isLight ? '#0F172A' : '#F1F5F9'
                }}
              >
                {(state.code || "system.migrate({ from: 'Excel', to: 'CloudDB' });")}
              </pre>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. MÓDULO DE KPIS (TARJETAS DE MÉTRICAS ULTRA HQ CON GRADIENTES)  */}
        {/* ================================================================= */}
        {state.activeModule === 'kpi' && (
          <div
            className={`grid ${
              state.kpis.length === 3
                ? 'grid-cols-3'
                : state.kpis.length >= 4
                ? 'grid-cols-2'
                : 'grid-cols-2'
            } gap-4.5 h-auto w-full`}
          >
            {state.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border flex flex-col justify-center transition-all shadow-xl relative overflow-hidden backdrop-blur-xl"
                style={{
                  background: isLight
                    ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(${rgb}, 0.08) 100%)`
                    : `linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(${rgb}, 0.18) 100%)`,
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

                <div className="flex items-baseline gap-2 flex-wrap z-10">
                  {kpi.prefix && (
                    <span
                      className="font-mono font-bold"
                      style={{
                        fontSize: `${Math.round(24 * modScale)}px`,
                        color: isLight ? '#64748B' : '#94A3B8'
                      }}
                    >
                      {kpi.prefix}
                    </span>
                  )}
                  <span
                    className="font-mono font-black tracking-tight"
                    style={{
                      fontSize: `${Math.round(44 * modScale)}px`,
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
                        fontSize: `${Math.round(24 * modScale)}px`,
                        color: isLight ? '#64748B' : '#94A3B8'
                      }}
                    >
                      {kpi.suffix}
                    </span>
                  )}

                  {kpi.trend === 'up' && (
                    <span className="ml-auto text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Crecimiento</span>
                    </span>
                  )}
                  {kpi.trend === 'down' && (
                    <span className="ml-auto text-[11px] font-mono font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Reducción</span>
                    </span>
                  )}
                </div>

                <span
                  className="font-mono font-bold uppercase tracking-wider pt-3 truncate z-10"
                  style={{
                    fontSize: `${Math.max(11, Math.round(modFontSize * 0.9))}px`,
                    color: isLight ? '#475569' : '#CBD5E1'
                  }}
                >
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. MÓDULO DE GRÁFICOS (BARRAS, DONUT / PIE Y LÍNEA DE ÁREA)       */}
        {/* ================================================================= */}
        {state.activeModule === 'chart' && (
          <div className="flex flex-col gap-4 h-auto w-full">
            {/* Gráfico 1: BARRAS HORIZONTALES */}
            {(!state.chartType || state.chartType === 'horizontal-bars') && (
              <div className="flex flex-col gap-4 w-full py-2">
                {state.chartBars.map((bar, idx) => (
                  <div key={idx} className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {bar.label}
                      </span>
                      <span
                        className="font-bold text-white px-2.5 py-0.5 rounded-lg text-xs shadow-md border border-white/20"
                        style={{ backgroundColor: bar.color || state.currentColor }}
                      >
                        {bar.pct}%
                      </span>
                    </div>
                    <div
                      className="w-full h-4 rounded-full overflow-hidden p-0.5 border shadow-inner"
                      style={{
                        backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(15, 23, 42, 0.8)',
                        borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700 shadow-sm relative"
                        style={{
                          width: `${Math.min(100, Math.max(0, bar.pct))}%`,
                          background: `linear-gradient(90deg, ${bar.color || state.currentColor}99, ${bar.color || state.currentColor})`,
                          boxShadow: `0 0 12px ${bar.color || state.currentColor}80`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Gráfico 2: PASTEL / DONUT CIRCULAR */}
            {state.chartType === 'pie' && (() => {
              const totalPct = state.chartBars.reduce((acc, b) => acc + (b.pct || 0), 0) || 100;
              const circumference = 251.32; // 2 * pi * 40
              let accumulatedPct = 0;
              const defaultPalette = [state.currentColor, '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

              return (
                <div className="flex items-center justify-around gap-6 w-full py-3">
                  <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform filter drop-shadow-lg" viewBox="0 0 110 110">
                      <circle
                        cx="55"
                        cy="55"
                        r="40"
                        stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}
                        strokeWidth="16"
                        fill="transparent"
                      />
                      {state.chartBars.map((bar, idx) => {
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
                            strokeWidth="16"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                            className="transition-all duration-700"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span
                        className="font-mono font-black text-2xl"
                        style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}
                      >
                        {state.chartBars[0]?.pct || 100}%
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                        Líder
                      </span>
                    </div>
                  </div>

                  {/* Leyenda del Pastel */}
                  <div className="flex flex-col gap-2.5 flex-1 max-w-[55%]">
                    {state.chartBars.map((bar, idx) => {
                      const sliceColor = bar.color || defaultPalette[idx % defaultPalette.length];
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 text-xs font-mono p-1.5 rounded-lg border border-white/5"
                          style={{
                            backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'
                          }}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: sliceColor }}
                            />
                            <span className={`truncate text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                              {bar.label}
                            </span>
                          </div>
                          <span className="font-bold text-white shrink-0 text-xs px-2 py-0.5 rounded bg-slate-900/80">
                            {bar.pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Gráfico 3: LÍNEAS / TENDENCIA CON ÁREA */}
            {state.chartType === 'line' && (() => {
              const bars = state.chartBars.length > 0 ? state.chartBars : [{ label: 'Q1', pct: 40 }, { label: 'Q2', pct: 85 }];
              const svgW = 460;
              const svgH = 160;
              const padX = 45;
              const padY = 28;
              const maxPct = Math.max(...bars.map((b) => b.pct), 100);

              const points = bars.map((b, idx) => {
                const x = padX + (idx / Math.max(1, bars.length - 1)) * (svgW - 2 * padX);
                const y = svgH - padY - (b.pct / maxPct) * (svgH - 2 * padY);
                return { x, y, ...b };
              });

              const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, '');
              const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${(svgH - padY).toFixed(1)} L ${points[0].x.toFixed(1)} ${(svgH - padY).toFixed(1)} Z`;

              return (
                <div className="w-full flex flex-col items-center py-2">
                  <svg className="w-full h-40 overflow-visible" viewBox={`0 0 ${svgW} ${svgH}`}>
                    <defs>
                      <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={state.currentColor} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={state.currentColor} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Guías Horizontales */}
                    <line x1={padX} y1={padY} x2={svgW - padX} y2={padY} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                    <line x1={padX} y1={svgH / 2} x2={svgW - padX} y2={svgH / 2} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                    <line x1={padX} y1={svgH - padY} x2={svgW - padX} y2={svgH - padY} stroke="rgba(255,255,255,0.2)" />

                    {/* Área con Relleno Degradado */}
                    <path d={areaD} fill="url(#chartLineGrad)" />

                    {/* Línea de Tendencia */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={state.currentColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Puntos y Etiquetas */}
                    {points.map((pt, idx) => (
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
                        <rect
                          x={pt.x - 18}
                          y={pt.y - 25}
                          width="36"
                          height="18"
                          rx="5"
                          fill="#0F172A"
                          stroke={state.currentColor}
                          strokeWidth="1"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 13}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {pt.pct}%
                        </text>
                        <text
                          x={pt.x}
                          y={svgH - padY + 18}
                          textAnchor="middle"
                          fill={isLight ? '#475569' : '#94A3B8'}
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. MÓDULO DE CHAT WHATSAPP (BURBUJAS ULTRA REALISTAS)             */}
        {/* ================================================================= */}
        {state.activeModule === 'chat' && (
          <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-full h-auto">
            {/* Cabecera del Chat */}
            <div
              className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]"
              style={{
                backgroundColor: isLight ? '#F0F2F5' : '#1F2C34'
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-mono font-bold shadow-md shrink-0 ring-2 ring-white/20"
                  style={{ backgroundColor: state.currentColor }}
                >
                  {(state.chatContactName || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-mono font-bold text-sm tracking-tight ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {state.chatContactName || 'Asistente Virtual'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                    <span className="text-emerald-400 font-semibold">
                      {state.chatOnlineStatus || 'en línea'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensajes del Chat */}
            <div
              className="p-5 space-y-3.5"
              style={{
                backgroundColor: isLight ? '#EFEAE2' : '#0B141A'
              }}
            >
              {state.chatMessages.map((msg, idx) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isBot ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`relative max-w-[85%] px-4 py-3 rounded-2xl shadow-md transition-all ${
                        isBot
                          ? isLight
                            ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-xs'
                            : 'bg-[#005C4B] text-[#E9EDEF] rounded-tr-xs'
                          : isLight
                          ? 'bg-[#FFFFFF] text-[#111B21] rounded-tl-xs'
                          : 'bg-[#202C33] text-[#E9EDEF] rounded-tl-xs'
                      }`}
                      style={{ fontSize: `${Math.round(modFontSize * 1.05)}px` }}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap font-sans">{msg.text}</p>

                      <div className="flex items-center justify-end gap-1.5 mt-1.5 select-none">
                        <span
                          className={`text-[10px] font-mono ${
                            isLight ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          {msg.time}
                        </span>
                        {isBot && (
                          <CheckCheck className="w-4 h-4 text-[#53BDEB]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. MÓDULO DE PASOS / FASES (ROADMAP Y PROCESO ESTRUCTURADO)      */}
        {/* ================================================================= */}
        {state.activeModule === 'steps' && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {(state.steps || state.stepsData || []).map((st, idx) => {
              const stepNum = st.stepNumber || st.step || (idx + 1);
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
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `rgba(${rgb}, 0.12)`,
                        color: state.currentColor
                      }}
                    >
                      FASE 0{stepNum}
                    </span>
                  </div>
                  <h4 className={`font-bold text-sm text-white ${state.titleFont || 'font-inter'}`}>
                    {st.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {stepDesc}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================= */}
        {/* 6. MÓDULO PROMO / OFERTA / CUPÓN DE CONVERSIÓN                    */}
        {/* ================================================================= */}
        {state.activeModule === 'promo' && (
          <div
            className="w-full rounded-2xl p-7 flex flex-col items-center justify-center text-center gap-3.5 border shadow-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(${rgb}, 0.25) 0%, rgba(15, 23, 42, 0.85) 100%)`,
              borderColor: `rgba(${rgb}, 0.5)`
            }}
          >
            <span
              className="px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5"
              style={{
                backgroundColor: state.currentColor,
                color: '#FFFFFF'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{state.promo?.badge || state.promoData?.badge || 'OFERTA DE LANZAMIENTO'}</span>
            </span>

            <h3
              className="font-black tracking-tight text-white leading-tight"
              style={{ fontSize: `${Math.round(28 * modScale)}px` }}
            >
              {state.promo?.headline || state.promoData?.headline || state.promo?.title || state.promoData?.title || '50% OFF en Tu Primer Despliegue'}
            </h3>

            {(state.promo?.subheadline || state.promoData?.subheadline || state.promo?.subtitle || state.promoData?.subtitle) && (
              <p className="text-xs font-semibold text-indigo-200/95 max-w-[90%]">
                {state.promo?.subheadline || state.promoData?.subheadline || state.promo?.subtitle || state.promoData?.subtitle}
              </p>
            )}

            <p className="text-xs text-slate-300 max-w-[90%] leading-relaxed">
              {state.promo?.description || state.promoData?.description || 'Válido para proyectos de software a la medida, migraciones cloud y automatizaciones operativas.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div
                className="px-5 py-2 rounded-xl border-2 border-dashed font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2 shadow-inner"
                style={{
                  borderColor: state.currentColor,
                  color: state.currentColor,
                  backgroundColor: 'rgba(0,0,0,0.4)'
                }}
              >
                <span>🏷️ CÓDIGO:</span>
                <span>{state.promo?.coupon || state.promoData?.coupon || state.promo?.code || state.promoData?.code || 'OFERTA2026'}</span>
              </div>
              <div
                className="px-5 py-2 rounded-xl font-mono font-bold text-xs text-white shadow-lg flex items-center gap-2 transition"
                style={{
                  backgroundColor: state.currentColor,
                  boxShadow: `0 8px 25px rgba(${rgb}, 0.35)`
                }}
              >
                <span>{state.promo?.cta || state.promoData?.cta || 'Reclamar Oferta'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {(state.promo?.finePrint || state.promoData?.finePrint) && (
              <span className="text-[11px] font-mono text-slate-400 pt-1">
                {state.promo?.finePrint || state.promoData?.finePrint}
              </span>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 7. MÓDULO DE CALL TO ACTION / FRASE DE ACCIÓN (SOLUCIÓN DIRECTA)  */}
        {/* ================================================================= */}
        {state.activeModule === 'cta' && (
          <div
            className="w-full rounded-2xl p-7 flex flex-col items-center justify-center text-center gap-4 border shadow-2xl relative overflow-hidden"
            style={{
              background: isLight
                ? `linear-gradient(135deg, rgba(${rgb}, 0.12) 0%, rgba(255, 255, 255, 0.95) 100%)`
                : `linear-gradient(135deg, rgba(${rgb}, 0.28) 0%, rgba(15, 23, 42, 0.9) 100%)`,
              borderColor: `rgba(${rgb}, 0.45)`,
              boxShadow: `0 20px 45px -10px rgba(${rgb}, 0.25)`
            }}
          >
            <span
              className="px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5"
              style={{
                backgroundColor: state.currentColor,
                color: '#FFFFFF'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{state.ctaActionBadge || '⚡ SOLUCIÓN DIRECTA'}</span>
            </span>

            <p
              className="font-black tracking-tight leading-snug px-3"
              style={{
                fontSize: `${Math.round(25 * modScale)}px`,
                color: isLight ? '#0F172A' : '#FFFFFF'
              }}
            >
              {state.ctaActionPhrase || 'Migra hoy tus procesos a la nube y reduce tiempos de respuesta en un 60%.'}
            </p>

            <div className="flex flex-col items-center gap-2 pt-1 w-full max-w-[85%]">
              <div
                className="px-7 py-3 rounded-xl font-mono font-bold text-xs text-white shadow-xl flex items-center justify-center gap-2 transition"
                style={{
                  backgroundColor: state.currentColor,
                  boxShadow: `0 10px 30px rgba(${rgb}, 0.4)`
                }}
              >
                <span>{state.ctaActionButtonText || 'Solicitar Diagnóstico Técnico ➔'}</span>
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
          </div>
        )}

        {/* ================================================================= */}
        {/* 8. MÓDULO DE TEXTO / GRAN CITA / BANNER DE AUTOR                 */}
        {/* ================================================================= */}
        {state.activeModule === 'text' && (
          <div className="flex flex-col items-center justify-center text-center p-3 w-full h-auto">
            {state.contentHighlightStyle === 'quote' ? (
              <div className="relative w-full flex flex-col items-center py-4">
                <span
                  className="font-serif font-black select-none pointer-events-none absolute -top-8 left-4 opacity-25"
                  style={{ fontSize: `${Math.round(96 * modScale)}px`, color: state.currentColor }}
                >
                  “
                </span>
                <blockquote
                  className="italic font-medium leading-relaxed z-10 px-8 max-w-[92%]"
                  style={{
                    fontSize: `${Math.round(modFontSize * 1.55)}px`,
                    color: isLight ? '#0F172A' : '#F8FAFC'
                  }}
                >
                  {state.contentHighlightText || 'Automatiza tus flujos operativos y acelera el crecimiento de tu empresa con software a la medida.'}
                </blockquote>
              </div>
            ) : state.contentHighlightStyle === 'banner' ? (
              <div
                className="w-full rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border shadow-xl"
                style={{
                  background: `linear-gradient(135deg, rgba(${rgb}, 0.2) 0%, rgba(15, 23, 42, 0.6) 100%)`,
                  borderColor: `rgba(${rgb}, 0.4)`
                }}
              >
                <span
                  className="px-4 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase shadow-sm"
                  style={{
                    backgroundColor: state.currentColor,
                    color: '#FFFFFF'
                  }}
                >
                  LLAMADO A LA ACCIÓN
                </span>
                <p
                  className="font-extrabold tracking-tight text-center leading-snug px-4"
                  style={{
                    fontSize: `${Math.round(modFontSize * 1.55)}px`,
                    color: isLight ? '#0F172A' : '#FFFFFF'
                  }}
                >
                  {state.contentHighlightText || '¿Listo para dar el siguiente salto tecnológico? Escríbenos y transformemos tu visión en código.'}
                </p>
              </div>
            ) : (
              <div
                className="w-full rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border shadow-2xl"
                style={{
                  backgroundColor: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(15, 23, 42, 0.65)',
                  borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}
              >
                <p
                  className="font-bold tracking-tight text-center leading-relaxed max-w-[95%]"
                  style={{
                    fontSize: `${Math.round(modFontSize * 1.45)}px`,
                    color: isLight ? '#0F172A' : '#F1F5F9'
                  }}
                >
                  {state.contentHighlightText || 'Soluciones tecnológicas escalables diseñadas para operaciones de alto rendimiento.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 9. MÓDULO DE IMÁGENES (MOCKUPS MULTI-BORDE Y PNG TRANSPARENTE)   */}
        {/* ================================================================= */}
        {state.activeModule === 'image' && (
          <div className="flex flex-col gap-3 h-auto w-full">
            <div className="w-full flex items-center justify-center transition-all">
              {state.images.map((img, idx) => {
                const isRaw = state.imageBorderStyle === 'raw';

                return (
                  <div
                    key={idx}
                    className={`w-full flex items-center justify-center transition-all ${
                      isRaw ? 'p-0 bg-transparent border-0 shadow-none' : `overflow-hidden ${imgBorderClass}`
                    }`}
                    style={{ maxHeight: `${Math.round(380 * modScale)}px` }}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || 'Preview'}
                      className={`w-full h-full transition-all ${
                        isRaw ? 'object-contain filter drop-shadow-2xl' : 'object-cover rounded-xl'
                      }`}
                      style={{ maxHeight: `${Math.round(380 * modScale)}px` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render de Capas de Fondo según Layer Depth Order
  const renderBackgroundLayers = () => {
    const order: BackgroundLayerOrder = state.backgroundLayerOrder || 'pattern-lights-shapes';

    const patternEl = patternEnabled ? (
      <div
        key="pattern"
        id="pattern-layer"
        className={`absolute inset-0 pointer-events-none transition-all ${patternClass} ${vignetteClass}`}
        style={{
          opacity: (state.patternOpacity ?? 70) / 100,
          backgroundSize: `${state.patternScale}px ${state.patternScale}px`,
          backgroundImage: state.bgPattern === 'custom' && state.customPatternUrl
            ? `url('${state.customPatternUrl}')`
            : undefined
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

          // Geometría Radius
          let radius = '9999px';
          if (geo === 'squares') radius = '24px';
          else if (geo === 'diamonds') radius = '12px';
          else if (geo === 'triangles') radius = '6px';

          // Acabado Finish
          let finishStyle: React.CSSProperties = {};
          if (finish === 'flat') {
            finishStyle = {
              background: `rgba(${rgb}, 0.22)`,
              border: `1px solid rgba(${rgb}, 0.4)`
            };
          } else if (finish === 'pastel') {
            finishStyle = {
              background: `rgba(${rgb}, 0.12)`,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            };
          } else if (finish === 'neon-outline') {
            finishStyle = {
              background: 'transparent',
              border: `2px solid rgba(${rgb}, 0.8)`,
              boxShadow: `0 0 25px rgba(${rgb}, 0.5)`
            };
          } else if (finish === 'duotone') {
            finishStyle = {
              background: `linear-gradient(135deg, rgba(${rgb}, 0.35) 0%, rgba(${duoRgb}, 0.25) 100%)`,
              border: `1.5px solid rgba(${duoRgb}, 0.4)`,
              backdropFilter: 'blur(14px)',
              boxShadow: `0 20px 40px rgba(0,0,0,0.4)`
            };
          } else {
            // 'glass' standard
            finishStyle = {
              background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, rgba(${rgb}, 0.28) 45%, rgba(6,182,212,0.18) 75%, transparent 100%)`,
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(14px)',
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 0 25px rgba(${rgb}, 0.3)`
            };
          }

          if (geo === 'tech-code') {
            return (
              <div
                key={idx}
                className="font-mono font-bold tracking-widest flex items-center justify-center"
                style={{
                  ...styleProps,
                  fontSize: `${Math.round(finalSize * 0.16)}px`,
                  color: `rgba(${rgb}, 0.75)`,
                  textShadow: `0 0 20px rgba(${rgb}, 0.8)`,
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: `1px solid rgba(${rgb}, 0.3)`,
                  background: 'rgba(15, 23, 42, 0.5)',
                  backdropFilter: 'blur(8px)',
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
                borderRadius: radius,
                ...finishStyle
              }}
            />
          );
        })}
      </div>
    ) : null;

    // Orden de capas de fondo limpio y óptimo: Formas de fondo ➔ Patrón de textura ➔ Luces ambientales
    return <>{shapesEl}{patternEl}{lightsEl}</>;
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

          {/* Contenedor Vertical con Prioridad layoutFlow */}
          <div
            id="content-container"
            className="relative z-10 flex flex-col w-full shrink-0"
            style={{ gap: `${gapTagsToModule}px` }}
          >
            {state.layoutFlow === 'content-first' ? (
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
      <footer className={footerClass} style={footerInlineStyle}>
        {(state.ctaOrder || 'cta-first') === 'cta-first' ? (
          <>
            <div className="flex items-center gap-2.5 shrink min-w-0">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: state.currentColor }} />
              <p
                className="text-slate-300 font-medium truncate pr-4 transition-all"
                style={{ fontSize: `${footerSize * 1.3}px` }}
              >
                {state.cta || 'Escríbenos y migramos tu operación a la nube.'}
              </p>
            </div>
            <div
              className="font-mono font-bold text-white tracking-wide shrink-0 transition-all"
              style={{ fontSize: `${footerSize * 1.55}px` }}
            >
              {state.handle || 'tumarca.dev'}
            </div>
          </>
        ) : (
          <>
            <div
              className="font-mono font-bold text-white tracking-wide shrink-0 transition-all"
              style={{ fontSize: `${footerSize * 1.55}px` }}
            >
              {state.handle || 'tumarca.dev'}
            </div>
            <div className="flex items-center gap-2.5 shrink min-w-0">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: state.currentColor }} />
              <p
                className="text-slate-300 font-medium truncate pr-4 transition-all"
                style={{ fontSize: `${footerSize * 1.3}px` }}
              >
                {state.cta || 'Escríbenos y migramos tu operación a la nube.'}
              </p>
            </div>
          </>
        )}
      </footer>

    </div>
  );
});

CanvasTarget.displayName = 'CanvasTarget';
