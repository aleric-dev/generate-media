import React from 'react';
import { HeaderShape, FooterShape, HeaderBrandMode, LogoType } from '../../types';
import { BrandLogo } from '../BrandLogo';

interface BrandingPreviewProps {
  companyName: string;
  handle: string;
  logoType: LogoType;
  customLogoUrl?: string | null;
  headerBrandMode: HeaderBrandMode;
  headerShape: HeaderShape;
  footerShape: FooterShape;
  currentColor: string;
}

export const BrandingPreview: React.FC<BrandingPreviewProps> = ({
  companyName,
  handle,
  logoType,
  customLogoUrl,
  headerBrandMode,
  headerShape,
  footerShape,
  currentColor,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner">
      <div className="w-full text-[11px] font-mono text-slate-400 mb-3 flex items-center justify-between">
        <span>Previsualización de Identidad</span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold">Header & Footer</span>
      </div>

      {/* Mini Mockup Canvas */}
      <div className="w-full max-w-sm rounded-xl bg-[#070A0F] border border-slate-800 p-4 flex flex-col justify-between h-56 shadow-2xl relative overflow-hidden">
        {/* Glow decorativo sutil */}
        <div
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: currentColor }}
        />

        {/* 1. Mini Header Mockup */}
        <div
          className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
            headerShape === 'pill'
              ? 'rounded-full px-4 border-slate-700 bg-slate-900/90'
              : headerShape === 'card'
              ? 'rounded-xl border-slate-700 bg-slate-900/90 shadow-md'
              : headerShape === 'floating-dock'
              ? 'rounded-xl border-slate-700/80 bg-slate-900/70 backdrop-blur-md'
              : 'border-b border-slate-800 border-t-0 border-x-0 rounded-none bg-transparent'
          }`}
        >
          {/* Logo y Nombre */}
          <div className="flex items-center gap-2">
            {headerBrandMode !== 'only-text' && (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden"
                style={{
                  backgroundColor: `${currentColor}25`,
                  color: currentColor,
                  borderColor: `${currentColor}50`,
                  borderWidth: '1px',
                }}
              >
                {logoType === 'aleric' ? (
                  <BrandLogo size="sm" showText={false} />
                ) : logoType === 'custom' && customLogoUrl ? (
                  <img src={customLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>{(companyName || 'TE').substring(0, 2).toUpperCase()}</span>
                )}
              </div>
            )}

            {headerBrandMode !== 'only-logo' && (
              <span className="font-bold text-xs text-white tracking-tight">
                {companyName || 'Tu Empresa'}
              </span>
            )}
          </div>

          {/* Badge de Categoría */}
          <span
            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border"
            style={{
              color: currentColor,
              borderColor: `${currentColor}40`,
              backgroundColor: `${currentColor}15`,
            }}
          >
            DESARROLLO
          </span>
        </div>

        {/* Centro simbólico */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-2">
          <div className="w-16 h-1 rounded-full bg-slate-800/80 mb-2" />
          <p className="text-[11px] text-slate-500 font-mono">
            [ Espacio central para título & módulos ]
          </p>
        </div>

        {/* 2. Mini Footer Mockup */}
        <div
          className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
            footerShape === 'pill'
              ? 'rounded-full px-4 border-slate-700 bg-slate-900/90'
              : footerShape === 'card'
              ? 'rounded-xl border-slate-700 bg-slate-900/90 shadow-md'
              : 'border-t border-slate-800 border-b-0 border-x-0 rounded-none bg-transparent'
          }`}
        >
          <span className="text-[10px] text-slate-300 font-medium truncate max-w-[170px]">
            Escríbenos y migramos tu operación
          </span>
          <span
            className="text-[11px] font-mono font-bold"
            style={{ color: currentColor }}
          >
            {handle.startsWith('@') ? handle : `@${handle || 'tumarca'}`}
          </span>
        </div>
      </div>
    </div>
  );
};
