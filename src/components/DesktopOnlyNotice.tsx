import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Copy, Check, ArrowLeft, Sparkles, ShieldCheck, Zap, Laptop } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface DesktopOnlyNoticeProps {
  showHeader?: boolean;
  showFooter?: boolean;
}

export const DesktopOnlyNotice: React.FC<DesktopOnlyNoticeProps> = ({
  showHeader = false,
  showFooter = false,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/editor');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 sm:p-10 select-none relative my-auto">
      {/* Glows ambientales de fondo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-sky-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header superior opcional con Logo */}
      {showHeader && (
        <div className="w-full max-w-md flex items-center justify-between z-10 mb-4">
          <BrandLogo size="md" showText={true} />
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            1080p Nativo
          </span>
        </div>
      )}

      {/* Contenido Central */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 my-auto py-8 z-10">
        {/* Ilustración tecnológica: Monitor con badge 1080p */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-950 border border-indigo-500/40 flex items-center justify-center shadow-2xl shadow-indigo-500/20 relative">
            <Monitor className="w-12 h-12 text-indigo-400" />
            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PC / Mac
            </span>
          </div>
        </div>

        {/* Titular y Explicación */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/20">
            <Laptop className="w-3.5 h-3.5" />
            <span>Pantalla de Escritorio Requerida</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            El Editor Ultra HQ está diseñado para pantallas de escritorio
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed max-w-sm mx-auto">
            Para garantizar la máxima precisión en código, métricas KPI, gráficas y controles avanzados en 1080p nativo, el espacio de trabajo requiere una pantalla de PC o Mac.
          </p>
        </div>

        {/* Acciones */}
        <div className="w-full space-y-3 pt-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-mono text-xs sm:text-sm font-bold transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>¡Enlace copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white" />
                <span>Copiar enlace para abrir en PC</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs sm:text-sm font-semibold border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Volver a la página principal</span>
          </button>
        </div>
      </div>

      {/* Footer con Micro-Proof */}
      <div className="w-full max-w-md pt-4 border-t border-slate-800/60 flex items-center justify-center gap-4 sm:gap-6 text-[11px] font-mono text-slate-500 z-10">
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>100% Gratis</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Sin Marcas</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Fidelidad 1080p</span>
        </div>
      </div>
    </div>
  );
};
