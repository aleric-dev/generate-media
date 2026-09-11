import React, { forwardRef } from 'react';
import { PostState } from '../../types';
import { aspectRatios } from '../../constants/templates';
import { LOGO_WHITE, LOGO_DARK } from '../../constants/logos';

interface CanvasTargetProps {
  state: PostState;
}

export const CanvasTarget = forwardRef<HTMLDivElement, CanvasTargetProps>(({ state }, ref) => {
  const r = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];
  const isLight = state.canvasMode === 'light';

  // Cálculo de color para glows y formas
  const cleanColor = state.currentColor.replace('#', '');
  const bigint = parseInt(cleanColor, 16) || 0x4f46e5;
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;
  const rgb = `${red}, ${green}, ${blue}`;

  const factor = state.lightIntensity / 100;
  const a1 = (factor * (isLight ? 0.35 : 0.65)).toFixed(3);
  const a2 = (factor * (isLight ? 0.18 : 0.35)).toFixed(3);

  // Background glow según dirección
  let glowBg = 'none';
  if (state.accentShape !== 'none' && state.lightIntensity > 0) {
    if (state.lightDirection === 'dual-corners-1') {
      glowBg = `
        radial-gradient(circle at 100% 0%, rgba(${rgb}, ${a1}) 0%, rgba(${rgb}, 0.03) 50%, transparent 75%),
        radial-gradient(circle at 0% 100%, rgba(${rgb}, ${a2}) 0%, rgba(${rgb}, 0.02) 45%, transparent 70%)
      `;
    } else if (state.lightDirection === 'dual-corners-2') {
      glowBg = `
        radial-gradient(circle at 0% 0%, rgba(${rgb}, ${a1}) 0%, rgba(${rgb}, 0.03) 50%, transparent 75%),
        radial-gradient(circle at 100% 100%, rgba(${rgb}, ${a2}) 0%, rgba(${rgb}, 0.02) 45%, transparent 70%)
      `;
    } else if (state.lightDirection === 'four-corners') {
      glowBg = `
        radial-gradient(circle at 0% 0%, rgba(${rgb}, ${a2}) 0%, transparent 45%),
        radial-gradient(circle at 100% 0%, rgba(${rgb}, ${a2}) 0%, transparent 45%),
        radial-gradient(circle at 0% 100%, rgba(${rgb}, ${a2}) 0%, transparent 45%),
        radial-gradient(circle at 100% 100%, rgba(${rgb}, ${a2}) 0%, transparent 45%)
      `;
    } else if (state.lightDirection === 'top') {
      glowBg = `radial-gradient(ellipse at 50% 0%, rgba(${rgb}, ${a1}) 0%, rgba(${rgb}, 0.04) 60%, transparent 85%)`;
    } else if (state.lightDirection === 'bottom') {
      glowBg = `radial-gradient(ellipse at 50% 100%, rgba(${rgb}, ${a1}) 0%, rgba(${rgb}, 0.04) 55%, transparent 80%)`;
    } else if (state.lightDirection === 'sides') {
      glowBg = `
        radial-gradient(ellipse at 0% 50%, rgba(${rgb}, ${a2}) 0%, transparent 55%),
        radial-gradient(ellipse at 100% 50%, rgba(${rgb}, ${a2}) 0%, transparent 55%)
      `;
    } else if (state.lightDirection === 'center') {
      glowBg = `radial-gradient(circle at 50% 50%, rgba(${rgb}, ${a1}) 0%, rgba(${rgb}, 0.03) 55%, transparent 80%)`;
    }
  }

  // Multiplicador de escala de figuras geométricas
  const scaleMult = state.shapeSizeVariant === 'small' ? 0.6 : (state.shapeSizeVariant === 'large' ? 1.4 : 1.0);

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

  // Tags
  const tagsList = (state.tags || '').split(',').map(t => t.trim()).filter(Boolean);

  // Borde para imágenes
  const imgBorderClass = `img-border-${state.imageBorderStyle || 'none'}`;

  // Padding y altura del módulo
  let modulePad = 'p-6';
  let moduleMinH = 'min-h-[300px]';
  if (state.moduleSize === 'compact') {
    modulePad = 'p-4';
    moduleMinH = 'min-h-[220px]';
  } else if (state.moduleSize === 'spacious') {
    modulePad = 'p-8';
    moduleMinH = 'min-h-[380px]';
  }

  // Render del logo
  const renderLogoElement = () => {
    const name = state.companyName || 'Aleric Dev';
    if (state.logoType === 'custom' && state.customLogoUrl) {
      return <img src={state.customLogoUrl} alt="Logo" className="h-11 sm:h-12 object-contain filter drop-shadow-md" />;
    }
    if (state.logoType === 'aleric') {
      return <img src={isLight ? LOGO_DARK : LOGO_WHITE} alt="Aleric Dev" className="h-11 sm:h-12 object-contain filter drop-shadow-md" />;
    }
    if (state.logoType === 'monogram') {
      const initial = name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-extrabold text-white text-xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${state.currentColor}, #1E1B4B)`,
              border: '1.5px solid rgba(255,255,255,0.2)'
            }}
          >
            {initial}
          </div>
          <span className={`text-2xl font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}>
            {name}
          </span>
        </div>
      );
    }
    if (state.logoType === 'text') {
      return (
        <div className={`text-3xl font-mono font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {name}<span style={{ color: state.currentColor }}>.</span>
        </div>
      );
    }
    // 'generic': Logo Vectorial Tech
    return (
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${state.currentColor}` }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={state.currentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke={state.currentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke={state.currentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className={`text-2xl font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight`}>
            {name}
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-70" style={{ color: state.currentColor }}>
            ENTERPRISE CLOUD
          </span>
        </div>
      </div>
    );
  };

  // Header class según estilo
  let headerClass = 'relative z-10 flex items-center justify-between transition-all gap-6 w-full';
  let headerInlineStyle: React.CSSProperties = {};
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
  let footerClass = 'relative z-10 flex items-center justify-between transition-all gap-6 w-full';
  let footerInlineStyle: React.CSSProperties = {};
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

      {/* 2. Capa de Iluminación Neón / Formas Geométricas */}
      <div
        id="glow-layer"
        className="absolute inset-0 pointer-events-none transition-all duration-500 overflow-hidden"
        style={{ background: glowBg }}
      >
        {state.accentShape === 'circles' && (
          <>
            <div
              style={{
                position: 'absolute',
                width: `${Math.round(480 * scaleMult)}px`,
                height: `${Math.round(480 * scaleMult)}px`,
                borderRadius: '9999px',
                border: `2.5px solid rgba(${rgb}, ${a1})`,
                top: '-80px',
                right: '-80px',
                pointerEvents: 'none',
                opacity: 0.65
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: `${Math.round(280 * scaleMult)}px`,
                height: `${Math.round(280 * scaleMult)}px`,
                borderRadius: '9999px',
                border: `1.5px dashed rgba(${rgb}, ${a2})`,
                top: '40px',
                right: '40px',
                pointerEvents: 'none',
                opacity: 0.6
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: `${Math.round(380 * scaleMult)}px`,
                height: `${Math.round(380 * scaleMult)}px`,
                borderRadius: '9999px',
                border: `2px solid rgba(${rgb}, ${a2})`,
                bottom: '-90px',
                left: '-70px',
                pointerEvents: 'none',
                opacity: 0.55
              }}
            />
          </>
        )}

        {state.accentShape === 'squares' && (
          <>
            <div
              style={{
                position: 'absolute',
                width: `${Math.round(380 * scaleMult)}px`,
                height: `${Math.round(380 * scaleMult)}px`,
                border: `2px solid rgba(${rgb}, ${a1})`,
                top: '-80px',
                right: '-60px',
                pointerEvents: 'none',
                opacity: 0.5
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: `${Math.round(260 * scaleMult)}px`,
                height: `${Math.round(260 * scaleMult)}px`,
                border: `1.5px dashed rgba(${rgb}, ${a2})`,
                bottom: '-40px',
                left: '-40px',
                pointerEvents: 'none',
                opacity: 0.5
              }}
            />
          </>
        )}

        {state.accentShape === 'diamonds' && (
          <>
            <div
              style={{
                position: 'absolute',
                width: `${Math.round(340 * scaleMult)}px`,
                height: `${Math.round(340 * scaleMult)}px`,
                transform: 'rotate(45deg)',
                border: `2.5px solid rgba(${rgb}, ${a1})`,
                top: '-60px',
                right: '-50px',
                pointerEvents: 'none',
                opacity: 0.6
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: `${Math.round(240 * scaleMult)}px`,
                height: `${Math.round(240 * scaleMult)}px`,
                transform: 'rotate(45deg)',
                border: `1.5px dashed rgba(${rgb}, ${a2})`,
                bottom: '-50px',
                left: '-30px',
                pointerEvents: 'none',
                opacity: 0.55
              }}
            />
          </>
        )}

        {state.accentShape === 'lines' && (
          <>
            <div
              style={{
                position: 'absolute',
                width: '2px',
                height: '100%',
                left: '15%',
                top: '0',
                background: `linear-gradient(to bottom, transparent, rgba(${rgb}, ${a1}), transparent)`,
                opacity: 0.6
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                top: '22%',
                left: '0',
                background: `linear-gradient(to right, transparent, rgba(${rgb}, ${a2}), transparent)`,
                opacity: 0.5
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '2px',
                height: '100%',
                right: '18%',
                top: '0',
                background: `linear-gradient(to bottom, transparent, rgba(${rgb}, ${a2}), transparent)`,
                opacity: 0.5
              }}
            />
          </>
        )}
      </div>

      {/* 3. Header Oficial */}
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

      {/* 4. Espaciador Superior Dinámico */}
      <div
        id="canvas-spacer-top"
        className="w-full transition-all pointer-events-none"
        style={{
          flex: state.moduleVisible ? '4 1 0%' : '10 1 0%',
          minHeight: state.moduleVisible ? '80px' : '180px'
        }}
      />

      {/* 5. Contenedor Central de Contenido */}
      <div id="content-container" className="relative z-10 flex flex-col gap-6 w-full shrink-0">
        
        {/* BLOQUE DE TEXTO */}
        <div id="block-text" className="flex flex-col gap-4">
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
            <div id="view-tags-container" className="flex flex-wrap gap-2.5 pt-2">
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
          >
            {/* 1. MÓDULO DE CÓDIGO */}
            {state.activeModule === 'code' && (
              <div className="flex flex-col h-auto">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3.5 transition-all">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
                    <span className="text-sm font-mono text-slate-400 tracking-wider ml-2">architecture.py</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">PYTHON 3.12</span>
                </div>
                <div className={`${isLight ? 'glass-subcard-light' : 'glass-subcard'} rounded-xl p-5 transition-all flex items-center h-auto`}>
                  <pre className="font-mono text-xl text-emerald-400 leading-relaxed overflow-hidden whitespace-pre-wrap w-full">
                    <code>{state.code}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* 2. MÓDULO DE KPIS */}
            {state.activeModule === 'kpi' && (
              <div className="flex flex-col gap-4 h-auto">
                <div className="grid grid-cols-2 gap-4 transition-all">
                  {state.kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className={`${isLight ? 'glass-subcard-light' : 'glass-subcard'} rounded-xl p-6 text-center border-t-2 transition-all flex flex-col justify-center`}
                      style={{ borderTopColor: state.currentColor }}
                    >
                      <span className={`text-5xl sm:text-6xl font-mono font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {kpi.val}
                      </span>
                      <span className={`text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-2 uppercase tracking-wider`}>
                        {kpi.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={`text-center font-mono text-sm ${isLight ? 'text-slate-600 bg-slate-100 border-slate-200' : 'text-slate-400 bg-slate-900/60 border-white/5'} py-2.5 rounded-xl border transition-all`}>
                  Auditado con Google Lighthouse v12
                </div>
              </div>
            )}

            {/* 3. MÓDULO DE GRÁFICOS */}
            {state.activeModule === 'chart' && (
              <div className="flex flex-col gap-4 h-auto">
                <div className="flex justify-between items-center text-sm font-mono text-slate-300 border-b border-white/10 pb-3 transition-all">
                  <span className="font-bold flex items-center gap-2">
                    <span style={{ color: state.currentColor }}>📊</span>
                    <span>Métrica de Optimización Web</span>
                  </span>
                  <span className="text-xs text-slate-400">Score & Rendimiento</span>
                </div>
                <div className="space-y-3.5 transition-all">
                  {state.chartBars.map((bar, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className={`flex justify-between text-xs font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span>{bar.label}</span>
                        <span className="font-bold">{bar.pct}%</span>
                      </div>
                      <div className={`w-full h-4 rounded-full ${isLight ? 'bg-slate-200' : 'bg-slate-800'} overflow-hidden`}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${bar.pct}%`,
                            backgroundColor: bar.color || state.currentColor
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. MÓDULO DE CHAT WHATSAPP */}
            {state.activeModule === 'chat' && (
              <div className="flex flex-col gap-3.5 h-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-xs font-mono text-slate-400 transition-all">
                  <span className="flex items-center gap-1.5 font-bold text-slate-200">
                    <span>🤖</span>
                    <span>{state.companyName} Bot WhatsApp</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
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
                      className={`overflow-hidden max-h-[360px] w-full flex items-center justify-center ${imgBorderClass}`}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || 'Preview'}
                        className="w-full h-full object-cover max-h-[360px] rounded-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 6. Espaciador Inferior Dinámico */}
      <div
        id="canvas-spacer-bottom"
        className="w-full transition-all pointer-events-none"
        style={{
          flex: state.moduleVisible ? '6 1 0%' : '12 1 0%',
          minHeight: state.moduleVisible ? '120px' : '220px'
        }}
      />

      {/* 7. Footer Oficial */}
      <footer className={footerClass} style={footerInlineStyle}>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: state.currentColor }} />
          <p className="text-xl text-slate-300 font-medium truncate pr-4 transition-all">
            {state.cta || 'Escríbenos y migramos tu operación a la nube.'}
          </p>
        </div>
        <div className="text-2xl font-mono font-bold text-white tracking-wide shrink-0 transition-all">
          {state.handle || 'aleric.dev'}
        </div>
      </footer>

    </div>
  );
});

CanvasTarget.displayName = 'CanvasTarget';
