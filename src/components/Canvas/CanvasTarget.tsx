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

  // Altura del logo y tamaño de fuente de cabecera configurables
  const logoH = state.logoSize || 44;
  const headerFontSize = state.headerSize || 13;

  // Render del logo
  const renderLogoElement = () => {
    const name = state.companyName || 'Aleric Dev';

    // Si el usuario desactiva el logo en la cabecera, mostrar solo el nombre en tipografía destacada
    if (state.headerShowLogo === false) {
      return (
        <div
          className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}
          style={{ fontSize: `${Math.round(headerFontSize * 1.55)}px` }}
        >
          {name}
        </div>
      );
    }

    if (state.logoType === 'custom' && state.customLogoUrl) {
      return (
        <div className="flex items-center gap-3">
          <img
            src={state.customLogoUrl}
            alt="Logo"
            className="object-contain filter drop-shadow-md transition-all"
            style={{ height: `${logoH}px` }}
          />
          <span
            className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}
            style={{ fontSize: `${Math.round(headerFontSize * 1.35)}px` }}
          >
            {name}
          </span>
        </div>
      );
    }
    if (state.logoType === 'aleric') {
      return (
        <div className="flex items-center gap-3">
          <img
            src={isLight ? LOGO_DARK : LOGO_WHITE}
            alt="Aleric Dev"
            className="object-contain filter drop-shadow-md transition-all"
            style={{ height: `${logoH}px` }}
          />
          <span
            className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}
            style={{ fontSize: `${Math.round(headerFontSize * 1.35)}px` }}
          >
            {name}
          </span>
        </div>
      );
    }
    if (state.logoType === 'monogram') {
      const initial = name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3">
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
          <span
            className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}
            style={{ fontSize: `${Math.round(headerFontSize * 1.35)}px` }}
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
          style={{ fontSize: `${Math.round(headerFontSize * 1.6)}px` }}
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
          className="px-5 py-2 rounded-full font-mono font-bold tracking-wider uppercase flex items-center gap-2.5 transition-all shadow-sm shrink-0"
          style={{
            backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15, 23, 42, 0.85)',
            border: `1.5px solid ${state.currentColor}`,
            color: isLight ? '#0F172A' : '#FFFFFF',
            fontSize: `${headerFontSize}px`
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
            {/* 0. MÓDULO DE TEXTO / GRAN CTA / CITA EDITORIAL */}
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
                      background: `linear-gradient(135deg, rgba(${rgb}, 0.16) 0%, rgba(15, 23, 42, 0.5) 100%)`,
                      borderColor: `rgba(${rgb}, 0.35)`
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
                    className="w-full rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border"
                    style={{
                      backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(15, 23, 42, 0.5)',
                      borderColor: 'rgba(255, 255, 255, 0.12)',
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

            {/* 1. MÓDULO DE CÓDIGO PROFESIONAL */}
            {state.activeModule === 'code' && (
              <div className="flex flex-col h-auto rounded-xl overflow-hidden border border-white/[0.08] bg-slate-950/90 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 bg-slate-900/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-xs" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-xs" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-xs" />
                    <div className="flex items-center gap-1.5 pl-3 border-l border-white/10">
                      <span className="text-xs font-mono text-slate-300 font-semibold">
                        {state.codeFilename || 'system/migrate.ts'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {state.codeLanguage || 'typescript'}
                  </span>
                </div>

                <div
                  className="p-5 font-jetbrains flex gap-4 leading-relaxed overflow-hidden"
                  style={{
                    fontSize: `${Math.round(modFontSize * 1.12)}px`
                  }}
                >
                  {state.codeShowLineNumbers !== false && (
                    <div className="select-none text-slate-600 text-right pr-2 border-r border-slate-800/80 flex flex-col font-mono text-xs">
                      {(state.code || '').split('\n').map((_, i) => (
                        <span key={i} className="leading-relaxed">{i + 1}</span>
                      ))}
                    </div>
                  )}

                  <pre className="text-emerald-400 font-medium whitespace-pre-wrap flex-1 overflow-x-auto leading-relaxed m-0">
                    <code>{state.code}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* 2. MÓDULO DE KPIS ENRIQUECIDOS */}
            {state.activeModule === 'kpi' && (
              <div className="grid grid-cols-2 gap-4 h-auto w-full">
                {state.kpis.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-center transition-all shadow-md relative overflow-hidden"
                    style={{
                      borderTopColor: kpi.borderTop !== false ? state.currentColor : undefined,
                      borderTopWidth: kpi.borderTop !== false ? '4px' : '1px'
                    }}
                  >
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {kpi.prefix && (
                        <span className="text-slate-400 font-mono font-bold" style={{ fontSize: `${Math.round(24 * modScale)}px` }}>
                          {kpi.prefix}
                        </span>
                      )}
                      <span
                        className="font-mono font-extrabold text-white tracking-tight"
                        style={{ fontSize: `${Math.round(44 * modScale)}px` }}
                      >
                        {kpi.val}
                      </span>
                      {kpi.suffix && (
                        <span className="text-slate-400 font-mono font-bold" style={{ fontSize: `${Math.round(24 * modScale)}px` }}>
                          {kpi.suffix}
                        </span>
                      )}

                      {kpi.trend === 'up' && (
                        <span className="ml-auto text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          ▲ Crecimiento
                        </span>
                      )}
                      {kpi.trend === 'down' && (
                        <span className="ml-auto text-[11px] font-mono font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          ▼ Reducción
                        </span>
                      )}
                    </div>

                    <span
                      className="font-mono text-slate-400 font-bold uppercase tracking-wider pt-2 truncate"
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

            {/* 4. MÓDULO DE CHAT WHATSAPP AUTÉNTICO */}
            {state.activeModule === 'chat' && (
              <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-full h-auto">
                {/* Barra de cabecera de contacto WhatsApp */}
                <div
                  className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]"
                  style={{
                    backgroundColor: isLight ? '#F0F2F5' : '#1F2C34'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-mono font-bold shadow-sm shrink-0"
                      style={{ backgroundColor: state.currentColor }}
                    >
                      {(state.chatContactName || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`font-mono font-bold text-sm tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}
                      >
                        {state.chatContactName || 'Aleric Dev Bot'}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 font-medium">
                          {state.chatOnlineStatus || 'en línea'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400">
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>

                {/* Fondo de mensajes WhatsApp */}
                <div
                  className="p-5 space-y-3"
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
                          className={`relative max-w-[85%] px-4 py-2.5 rounded-2xl shadow-md transition-all ${
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
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                          <div className="flex items-center justify-end gap-1.5 mt-1 select-none">
                            <span
                              className={`text-[10px] font-mono ${
                                isLight ? 'text-slate-500' : 'text-slate-400'
                              }`}
                            >
                              {msg.time}
                            </span>
                            {/* Doble check azul WhatsApp */}
                            {isBot && (
                              <svg className="w-4 h-3 text-[#53BDEB]" viewBox="0 0 16 11" fill="currentColor">
                                <path d="M11.07 0.93a.75.75 0 00-1.06 0L5.75 5.19 4.28 3.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.79-4.79a.75.75 0 000-1.06zM15.07 0.93a.75.75 0 00-1.06 0l-5.79 5.79.53.53a.75.75 0 001.06 0l4.2-4.2a.75.75 0 000-1.06l1.06-1.06z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
