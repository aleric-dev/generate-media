import React from 'react';
import { HeaderBrandMode, LogoType } from '../../types';
import { getBrandIconComponent } from '../../constants/brandIcons';
import { Upload, CheckCircle2 } from 'lucide-react';

interface BrandingPreviewProps {
  companyName: string;
  handle: string;
  logoType?: LogoType;
  brandIcon?: string;
  customLogoUrl?: string | null;
  headerBrandMode: HeaderBrandMode;
  currentColor: string;
  onLogoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BrandingPreview: React.FC<BrandingPreviewProps> = ({
  companyName,
  handle,
  brandIcon = 'terminal',
  customLogoUrl,
  headerBrandMode,
  currentColor,
  onLogoUpload,
}) => {
  const SelectedIcon = getBrandIconComponent(brandIcon);

  // Clasificación canónica de los 4 modos de marca
  const isOnlyText = headerBrandMode === 'only-text';
  const isOnlyCustom = headerBrandMode === 'only-custom' || headerBrandMode === 'only-logo';
  const isCustomText = headerBrandMode === 'custom-text' || headerBrandMode === 'logo-text';
  const isIconText = headerBrandMode === 'icon-text' || (!isOnlyText && !isOnlyCustom && !isCustomText);

  const getModeLabel = () => {
    if (isIconText) return 'Ícono + Texto';
    if (isOnlyText) return 'Solo Texto';
    if (isCustomText) return 'Texto + Logo Personalizado';
    if (isOnlyCustom) return 'Solo Logo Personalizado';
    return 'Branding';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner">
      <div className="w-full text-[11px] font-mono text-slate-400 mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span>Identidad de Marca:</span>
          <span className="text-indigo-300 font-bold">{getModeLabel()}</span>
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold">Logo & Marca</span>
      </div>

      {/* Mini Mockup Canvas - Enfoque 100% en la Marca */}
      <div className="w-full max-w-sm rounded-xl bg-[#070A0F] border border-slate-800 p-5 flex flex-col justify-between h-56 shadow-2xl relative overflow-hidden">
        {/* Glow decorativo sutil con el color de marca */}
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: currentColor }}
        />

        {/* 1. Muestra de Marca (Sin depender de estilos de cabecera) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          {/* 1.1 MODO: ICONO + TEXTO */}
          {isIconText && (
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-md shrink-0 transition-transform"
                style={{
                  backgroundColor: `${currentColor}25`,
                  color: currentColor,
                  borderColor: `${currentColor}60`,
                  borderWidth: '1.5px',
                }}
              >
                <SelectedIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white tracking-tight leading-tight">
                  {companyName || 'Tu Empresa'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {handle.startsWith('@') ? handle : `@${handle || 'tumarca'}`}
                </span>
              </div>
            </div>
          )}

          {/* 1.2 MODO: SOLO TEXTO */}
          {isOnlyText && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-white tracking-tight leading-tight">
                {companyName || 'Tu Empresa'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {handle.startsWith('@') ? handle : `@${handle || 'tumarca'}`}
              </span>
            </div>
          )}

          {/* 1.3 MODO: TEXTO + LOGO PERSONALIZADO */}
          {isCustomText && (
            <div className="flex items-center gap-2.5">
              {customLogoUrl ? (
                <img
                  src={customLogoUrl}
                  alt="Logo"
                  className="w-8 h-8 rounded-xl object-contain bg-slate-900/80 p-0.5 border border-slate-700 shrink-0 shadow-md"
                />
              ) : (
                <label
                  title="Subir logo personalizado"
                  className="w-8 h-8 rounded-xl border border-dashed border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 flex items-center justify-center cursor-pointer transition shrink-0"
                >
                  <Upload className="w-4 h-4 text-indigo-300" />
                  <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />
                </label>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white tracking-tight leading-tight">
                  {companyName || 'Tu Empresa'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {handle.startsWith('@') ? handle : `@${handle || 'tumarca'}`}
                </span>
              </div>
            </div>
          )}

          {/* 1.4 MODO: SOLO LOGO PERSONALIZADO */}
          {isOnlyCustom && (
            <div className="flex items-center">
              {customLogoUrl ? (
                <img
                  src={customLogoUrl}
                  alt="Logo"
                  className="h-8 max-w-[150px] rounded-xl object-contain bg-slate-900/80 p-1 border border-slate-700 shrink-0 shadow-md"
                />
              ) : (
                <label
                  title="Subir logo personalizado"
                  className="px-3 py-1.5 rounded-xl border border-dashed border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 flex items-center gap-2 cursor-pointer transition text-xs text-indigo-300 font-mono shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir Logo</span>
                  <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />
                </label>
              )}
            </div>
          )}

          {/* Badge de Categoría */}
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0"
            style={{
              color: currentColor,
              borderColor: `${currentColor}40`,
              backgroundColor: `${currentColor}15`,
            }}
          >
            BRAND
          </span>
        </div>

        {/* 2. Centro de la tarjeta con presencia de marca */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-2">
          <p className="text-xs text-slate-300 font-medium">
            Identidad corporativa configurada
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Se aplicará automáticamente a tus encabezados y firmas
          </p>
        </div>

        {/* 3. Footer con Handle */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-[11px] font-mono">
          <span className="text-slate-400">Handle Oficial:</span>
          <span className="font-bold" style={{ color: currentColor }}>
            {handle.startsWith('@') ? handle : `@${handle || 'tumarca'}`}
          </span>
        </div>
      </div>

      {/* Widget de Carga de Logo para modos personalizados */}
      {(isCustomText || isOnlyCustom) && (
        <div className="w-full max-w-sm mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            {customLogoUrl ? (
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Logo cargado
              </span>
            ) : (
              <span className="text-amber-400/90 text-[11px]">Falta subir imagen</span>
            )}
          </div>

          <label className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            <span>{customLogoUrl ? 'Cambiar Logo' : 'Subir Archivo'}</span>
            <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
};
