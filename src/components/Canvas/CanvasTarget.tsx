import React, { forwardRef, useMemo } from 'react';
import { PostState, ShapePlacement } from '../../types';
import { aspectRatios } from '../../constants/templates';
import { LOGO_WHITE, LOGO_DARK } from '../../constants/logos';

interface CanvasTargetProps {
  state: PostState;
}

export const CanvasTarget = forwardRef<HTMLDivElement, CanvasTargetProps>(({ state }, ref) => {
  const r = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];
  const isLight = state.canvasMode === 'light';

  // Cálculo de color RGB para iluminaciones y formas
  const cleanColor = (state.currentColor || '#4F46E5').replace('#', '');
  const bigint = parseInt(cleanColor, 16) || 0x4f46e5;
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;
  const rgb = `${red}, ${green}, ${blue}`;

  // Factores de iluminación
  const lightFactor = (state.lightIntensity ?? 40) / 100;
  const lightA1 = (lightFactor * (isLight ? 0.35 : 0.65)).toFixed(3);
  const lightA2 = (lightFactor * (isLight ? 0.18 : 0.35)).toFixed(3);

  // Background glow según estilo de luz y dirección
  let glowBg = 'none';
  const lightType = state.lightType || 'glow';
  if (lightType !== 'none' && lightFactor > 0) {
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

  // Multiplicadores de Formas Vítreas
  const shapeSizeMult = state.shapeSizeVariant === 'small' ? 0.65 : (state.shapeSizeVariant === 'large' ? 1.45 : 1.0);
  const shapeOpacity = (state.shapeOpacity ?? 60) / 100;

  // Generador determinista de posiciones perimetrales (BORDES ÚNICAMENTE, NADA EN EL CENTRO)
  const perimeterPositions = useMemo(() => {
    const placement: ShapePlacement = state.shapePlacement || 'corners';
    if (placement === 'corners') {
      return [
        { top: '-40px', right: '-40px', size: 360, rot: 12 },
        { bottom: '-50px', left: '-50px', size: 320, rot: -14 },
        { top: '30px', left: '-30px', size: 220, rot: -8 },
        { bottom: '40px', right: '-30px', size: 240, rot: 18 },
      ];
    }
    if (placement === 'sides') {
      return [
        { top: '22%', left: '-50px', size: 280, rot: -10 },
        { top: '65%', left: '-40px', size: 240, rot: 15 },
        { top: '30%', right: '-50px', size: 300, rot: 12 },
        { top: '72%', right: '-40px', size: 260, rot: -15 },
      ];
    }
    if (placement === 'periphery') {
      return [
        { top: '-30px', left: '15%', size: 260, rot: -12 },
        { top: '-40px', right: '18%', size: 300, rot: 15 },
        { top: '45%', left: '-50px', size: 240, rot: 8 },
        { top: '50%', right: '-50px', size: 270, rot: -14 },
        { bottom: '-40px', left: '20%', size: 280, rot: 10 },
        { bottom: '-50px', right: '15%', size: 320, rot: -16 },
      ];
    }
    // 'random-edges': Pseudoaleatorio asegurando que X o Y estén estrictamente en el perímetro
    const seed = state.shapeSeed || 12345;
    const rng = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const slots = [
      { edge: 'top-left', top: `${Math.round(rng(seed + 1) * 8 - 4)}%`, left: `${Math.round(rng(seed + 2) * 12 - 4)}%`, size: 280 + rng(seed + 3) * 120, rot: rng(seed + 4) * 30 - 15 },
      { edge: 'top-right', top: `${Math.round(rng(seed + 5) * 10 - 5)}%`, right: `${Math.round(rng(seed + 6) * 12 - 4)}%`, size: 300 + rng(seed + 7) * 100, rot: rng(seed + 8) * 30 - 15 },
      { edge: 'bottom-left', bottom: `${Math.round(rng(seed + 9) * 10 - 4)}%`, left: `${Math.round(rng(seed + 10) * 14 - 5)}%`, size: 260 + rng(seed + 11) * 120, rot: rng(seed + 12) * 30 - 15 },
      { edge: 'bottom-right', bottom: `${Math.round(rng(seed + 13) * 8 - 4)}%`, right: `${Math.round(rng(seed + 14) * 12 - 4)}%`, size: 320 + rng(seed + 15) * 110, rot: rng(seed + 16) * 30 - 15 },
      { edge: 'mid-right', top: `${Math.round(35 + rng(seed + 17) * 30)}%`, right: `${Math.round(rng(seed + 18) * 6 - 5)}%`, size: 220 + rng(seed + 19) * 80, rot: rng(seed + 20) * 30 - 15 },
    ];
    return slots;
  }, [state.shapePlacement, state.shapeSeed]);

  // Clase de viñeta para la textura
  const vignetteClass = `vignette-${state.patternVignette || 'vignette'}`;

  // Clase del patrón
  const patternClass = state.bgPattern === 'none' 
    ? 'pattern-none' 
    : (state.bgPattern === 'custom' ? '' : `pattern-${state.bgPattern}${isLight ? '-light' : ''}`);

  // Color del título
  let titleColor = isLight ? '#0F172A' : '#FFFFFF';
  if (state.titleColorMode === 'category') {
    titleColor = state.currentColor;
  } else if (state.titleColorMode === 'custom') {
    titleColor = state.titleCustomColor;
  }

  // Alineación de textos (Título, Subtítulo, Badges)
  const textAlign = state.textAlign || 'center';
  const textAlignmentClass = textAlign === 'left' ? 'text-left items-start' : (textAlign === 'right' ? 'text-right items-end' : 'text-center items-center');
  const tagsJustifyClass = textAlign === 'left' ? 'justify-start' : (textAlign === 'right' ? 'justify-end' : 'justify-center');

  // Badges de Tecnologías
  const tagsList = (state.tags || '').split(',').map(t => t.trim()).filter(Boolean);

  // Bordes para imágenes
  const imgBorderClass = `img-border-${state.imageBorderStyle || 'none'}`;

  // Escala interna y tamaño de fuente del módulo
  const modScale = state.moduleScale || 1.0;
  const modFontSize = state.moduleFontSize || 14;

  let modulePad = 'p-6';
  let moduleMinH = 'min-h-[280px]';
  if (state.moduleSize === 'compact') {
    modulePad = 'p-4';
    moduleMinH = 'min-h-[200px]';
  } else if (state.moduleSize === 'spacious') {
    modulePad = 'p-8';
    moduleMinH = 'min-h-[360px]';
  }

  // Altura del logo configurable
  const logoH = state.logoSize || 44;

  // Render del logo
  const renderLogoElement = () => {
    const name = state.companyName || 'Aleric Dev';
    if (state.logoType === 'custom' && state.customLogoUrl) {
      return (
        <img
          src={state.customLogoUrl}
          alt="Logo"
          className="object-contain filter drop-shadow-md transition-all"
          style={{ height: `${logoH}px` }}
        />
      );
    }
    if (state.logoType === 'aleric') {
      return (
        <img
          src={isLight ? LOGO_DARK : LOGO_WHITE}
          alt="Aleric Dev"
          className="object-contain filter drop-shadow-md transition-all"
          style={{ height: `${logoH}px` }}
        />
      );
    }
    if (state.logoType === 'monogram') {
      const initial = name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div
            className="rounded-2xl flex items-center justify-center font-mono font-extrabold text-white shadow-lg transition-all"
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
          <span
            className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}
            style={{ fontSize: `${Math.round(logoH * 0.55)}px` }}
          >
            {name}
          </span>
        </div>
      );
    }
    if (state.logoType === 'text') {
      return (
        <div
          className={`font-mono font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}
          style={{ fontSize: `${Math.round(logoH * 0.65)}px` }}
        >
          {name}<span style={{ color: state.currentColor }}>.</span>
        </div>
      );
    }
    // 'generic': Logo Vectorial Tech
    return (
      <div className="flex items-center gap-3">
        <div
          className="rounded-xl flex items-center justify-center shadow-lg transition-all"
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
        <div className="flex flex-col">
          <span
            className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}
            style={{ fontSize: `${Math.round(logoH * 0.52)}px` }}
          >
            {name}
          </span>
          <span
            className="font-mono tracking-widest uppercase opacity-70"
            style={{ color: state.currentColor, fontSize: `${Math.max(9, Math.round(logoH * 0.22))}px` }}
          >
            ENTERPRISE CLOUD
          </span>
        </div>
      </div>
    );
  };

  // Header class según estilo
  let headerClass = 'relative z-10 flex items-center justify-between transition-all gap-6 w-full';
  const headerInlineStyle: React.CSSProperties = {};
  if (state.headerShape === 'pill') {
    headerClass += ' bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-full px-6 py-3.5';
  } else if (state.headerShape === 'card') {
    headerClass += ' bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5';
  } else if (state.headerShape === 'accent-bar') {
    headerClass += ' border-t-4 border-b border-white/10 py-4';
    headerInlineStyle.borderTopColor = state.currentColor;
  } else if (state.headerShape === 'minimal') {
    headerClass += ' pb-4';
  } else {
    headerClass += ' border-b border-white/[0.08] pb-6';
  }

  // Footer class según estilo
  let footerClass = 'relative z-10 flex items-center transition-all gap-6 w-full';
  const footerInlineStyle: React.CSSProperties = {};
  if (state.footerShape === 'pill') {
    footerClass += ' bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-full px-6 py-3';
  } else if (state.footerShape === 'card') {
    footerClass += ' bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-5';
  } else if (state.footerShape === 'accent-bar') {
    footerClass += ' border-b-4 border-t border-white/10 py-4';
    footerInlineStyle.borderBottomColor = state.currentColor;
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
        padding: '56px 64px 72px 64px',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Capa de Textura / Patrón con Soporte para Máscaras */}
      <div
        id="pattern-layer"
        className={`absolute inset-0 pointer-events-none transition-all ${patternClass} ${vignetteClass}`}
        style={{
          backgroundSize: `${state.patternScale}px ${state.patternScale}px`,
          backgroundImage: state.bgPattern === 'custom' && state.customPatternUrl
            ? `url('${state.customPatternUrl}')`
            : undefined
        }}
      />

      {/* 2. Capa de Iluminación Neón Independiente */}
      <div
        id="glow-layer"
        className="absolute inset-0 pointer-events-none transition-all duration-500 overflow-hidden"
        style={{ background: glowBg }}
      />

      {/* 3. Capa de Formas Vítreas Perimetrales (Solo en los bordes, centro 100% limpio) */}
      {state.shapeType && state.shapeType !== 'none' && (
        <div id="shapes-layer" className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: shapeOpacity }}>
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

            // 1. Orbes Vítreos con Blur Suave (como en la imagen de referencia)
            if (state.shapeType === 'glass-orbs' || (state.shapeType === 'mixed-glass' && idx % 2 === 0)) {
              return (
                <div
                  key={idx}
                  style={{
                    ...styleProps,
                    width: `${finalSize}px`,
                    height: `${finalSize}px`,
                    borderRadius: '9999px',
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, rgba(${rgb}, 0.28) 45%, rgba(6,182,212,0.18) 75%, transparent 100%)`,
                    border: '1.5px solid rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 0 25px rgba(${rgb}, 0.3)`,
                  }}
                />
              );
            }

            // 2. Tarjetas Diagonales de Cristal Glassmorphism
            if (state.shapeType === 'glass-cards' || (state.shapeType === 'mixed-glass' && idx === 1)) {
              return (
                <div
                  key={idx}
                  style={{
                    ...styleProps,
                    width: `${Math.round(finalSize * 1.1)}px`,
                    height: `${Math.round(finalSize * 0.7)}px`,
                    borderRadius: '28px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)',
                    border: '1.5px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.3)',
                  }}
                />
              );
            }

            // 3. Cyber Brackets (< >, ../>)
            if (state.shapeType === 'cyber-brackets' || (state.shapeType === 'mixed-glass' && idx >= 2)) {
              const symbol = idx % 2 === 0 ? '<Aleric Dev>' : '</>';
              return (
                <div
                  key={idx}
                  className="font-space-mono font-bold tracking-widest flex items-center justify-center"
                  style={{
                    ...styleProps,
                    fontSize: `${Math.round(finalSize * 0.16)}px`,
                    color: `rgba(${rgb}, 0.65)`,
                    textShadow: `0 0 20px rgba(${rgb}, 0.8)`,
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {symbol}
                </div>
              );
            }

            // 4. Cuadrados / Prismas Tech
            return (
              <div
                key={idx}
                style={{
                  ...styleProps,
                  width: `${finalSize}px`,
                  height: `${finalSize}px`,
                  borderRadius: '20px',
                  border: `2px solid rgba(${rgb}, 0.4)`,
                  background: `rgba(${rgb}, 0.05)`,
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 0 30px rgba(${rgb}, 0.25)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 4. Header Oficial */}
      <header className={headerClass} style={headerInlineStyle}>
        <div id="view-logo-box" className="flex items-center shrink-0 max-w-[55%]">
          {renderLogoElement()}
        </div>

        <div
          id="view-badge"
          className="px-5 py-2 rounded-full text-sm font-mono font-bold tracking-wider uppercase flex items-center gap-2.5 transition-all shadow-sm"
          style={{
            backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15, 23, 42, 0.85)',
            border: `1.5px solid ${state.currentColor}`,
            color: isLight ? '#0F172A' : '#FFFFFF'
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: state.currentColor }} />
          <span>{state.category}</span>
        </div>
      </header>

      {/* 5. Espaciador Superior Dinámico */}
      <div
        id="canvas-spacer-top"
        className="w-full transition-all pointer-events-none"
        style={{
          flex: state.moduleVisible ? '4 1 0%' : '10 1 0%',
          minHeight: state.moduleVisible ? '60px' : '160px'
        }}
      />

      {/* 6. Contenedor Central de Contenido */}
      <div id="content-container" className={`relative z-10 flex flex-col gap-6 w-full shrink-0 ${textAlignmentClass}`}>
        
        {/* BLOQUE DE TEXTO */}
        <div id="block-text" className={`flex flex-col gap-4 w-full ${textAlignmentClass}`}>
          {/* Subtítulo Kicker Arriba */}
          {state.subtitlePos === 'above' && state.subtitle && (
            <p
              className={`text-slate-300 font-normal leading-relaxed transition-all ${state.titleFont}`}
              style={{ fontSize: `${state.subtitleSize}px` }}
            >
              {state.subtitle}
            </p>
          )}

          {/* Título Principal */}
          <h2
            className={`font-extrabold leading-[1.22] tracking-tight drop-shadow-lg transition-all ${state.titleFont}`}
            style={{
              fontSize: `${state.titleSize}px`,
              color: titleColor
            }}
          >
            {state.title || 'Escribe aquí tu título principal...'}
          </h2>

          {/* Subtítulo Abajo */}
          {state.subtitlePos === 'below' && state.subtitle && (
            <p
              className={`text-slate-300 font-normal leading-relaxed transition-all ${state.titleFont}`}
              style={{ fontSize: `${state.subtitleSize}px` }}
            >
              {state.subtitle}
            </p>
          )}

          {/* Badges de Tecnologías */}
          {tagsList.length > 0 && (
            <div id="view-tags-container" className={`flex flex-wrap gap-2.5 pt-2 ${tagsJustifyClass}`}>
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
          )}
        </div>

        {/* MÓDULO CENTRAL (RENDERIZADO CONDICIONAL SEGÚN TOGGLE) */}
        {state.moduleVisible && (
          <div
            id="block-module"
            className={`${isLight ? 'glass-card-light' : 'glass-card-clean'} rounded-2xl ${modulePad} ${moduleMinH} transition-all self-center w-full flex flex-col h-auto`}
            style={{
              padding: `${Math.round(24 * modScale)}px`
            }}
          >
            {/* 1. MÓDULO DE CÓDIGO */}
            {state.activeModule === 'code' && (
              <div className="flex flex-col h-auto">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3.5 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 pl-2">architecture/core.py</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">utf-8</span>
                </div>
                <div
                  className="font-jetbrains text-emerald-400 font-medium whitespace-pre-wrap transition-all leading-relaxed"
                  style={{
                    fontSize: `${Math.round(modFontSize * 1.15)}px`
                  }}
                >
                  {state.code}
                </div>
              </div>
            )}

            {/* 2. MÓDULO DE KPIS */}
            {state.activeModule === 'kpi' && (
              <div className="grid grid-cols-2 gap-4 h-auto">
                {state.kpis.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col justify-center transition-all shadow-sm"
                    style={{
                      borderTopColor: kpi.borderTop ? state.currentColor : undefined,
                      borderTopWidth: kpi.borderTop ? '3px' : '1px'
                    }}
                  >
                    <span
                      className="font-mono font-extrabold text-white tracking-tight"
                      style={{ fontSize: `${Math.round(44 * modScale)}px` }}
                    >
                      {kpi.val}
                    </span>
                    <span
                      className="font-mono text-slate-400 font-bold uppercase tracking-wider pt-1"
                      style={{ fontSize: `${Math.max(10, Math.round(modFontSize * 0.85))}px` }}
                    >
                      {kpi.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 3. MÓDULO DE GRÁFICOS */}
            {state.activeModule === 'chart' && (
              <div className="flex flex-col gap-4 h-auto w-full">
                <div
                  className="flex items-end justify-around gap-6 pt-6 transition-all"
                  style={{ height: `${Math.round(180 * modScale)}px` }}
                >
                  {state.chartBars.map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end">
                      <span
                        className="font-mono font-extrabold text-white"
                        style={{ fontSize: `${Math.round(modFontSize * 1.1)}px` }}
                      >
                        {bar.pct}%
                      </span>
                      <div className="w-full bg-slate-800/80 rounded-t-xl overflow-hidden h-full flex items-end">
                        <div
                          className="w-full rounded-t-xl transition-all duration-500 shadow-lg"
                          style={{
                            height: `${bar.pct}%`,
                            backgroundColor: bar.color || state.currentColor
                          }}
                        />
                      </div>
                      <span
                        className="font-mono text-slate-400 font-semibold truncate max-w-[140px] text-center"
                        style={{ fontSize: `${Math.round(modFontSize * 0.9)}px` }}
                      >
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. MÓDULO DE CHAT */}
            {state.activeModule === 'chat' && (
              <div className="flex flex-col gap-3.5 h-auto w-full">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-xs font-mono text-slate-400">
                  <span>Chatbot WhatsApp API</span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>En línea</span>
                  </span>
                </div>
                <div className="space-y-3 transition-all">
                  {state.chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={
                        msg.sender === 'client'
                          ? 'max-w-[85%] bg-slate-800/90 text-slate-200 rounded-2xl rounded-tl-sm px-5 py-3 text-sm leading-relaxed border border-slate-700/50 shadow-sm'
                          : 'ml-auto max-w-[88%] bg-emerald-950/80 border border-emerald-500/40 text-emerald-100 rounded-2xl rounded-tr-sm px-5 py-3 text-sm leading-relaxed shadow-sm'
                      }
                      style={{ fontSize: `${Math.round(modFontSize * 1.05)}px` }}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[10px] block text-right mt-1 opacity-60">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. MÓDULO DE IMÁGENES */}
            {state.activeModule === 'image' && (
              <div className="flex flex-col gap-3 h-auto w-full">
                <div className="w-full flex items-center justify-center transition-all">
                  {state.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`overflow-hidden w-full flex items-center justify-center ${imgBorderClass}`}
                      style={{ maxHeight: `${Math.round(360 * modScale)}px` }}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || 'Preview'}
                        className="w-full h-full object-cover rounded-xl"
                        style={{ maxHeight: `${Math.round(360 * modScale)}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 7. Espaciador Inferior Dinámico */}
      <div
        id="canvas-spacer-bottom"
        className="w-full transition-all pointer-events-none"
        style={{
          flex: state.moduleVisible ? '6 1 0%' : '12 1 0%',
          minHeight: state.moduleVisible ? '80px' : '180px'
        }}
      />

      {/* 8. Footer Oficial con Orden y Tamaño Configurable */}
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
              {state.handle || 'aleric.dev'}
            </div>
          </>
        ) : (
          <>
            <div
              className="font-mono font-bold text-white tracking-wide shrink-0 transition-all"
              style={{ fontSize: `${footerSize * 1.55}px` }}
            >
              {state.handle || 'aleric.dev'}
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
