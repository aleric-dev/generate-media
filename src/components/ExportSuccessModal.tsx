import React, { useState, useEffect } from 'react';
import { Check, Download, Copy, Coffee, X, Sparkles, ExternalLink } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { LINKS } from '../constants/links';

interface ExportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataUrl: string | null;
  filename: string;
  resolution: string;
}

export const ExportSuccessModal: React.FC<ExportSuccessModalProps> = ({
  isOpen,
  onClose,
  dataUrl,
  filename,
  resolution,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !dataUrl) return null;

  // Descargar archivo PNG
  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  // Copiar imagen PNG al portapapeles
  const handleCopyToClipboard = async () => {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn">
      {/* Backdrop con desenfoque profundo */}
      <div
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-lg bg-[#0B101B] border border-slate-800 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-10 animate-scaleUp">
        
        {/* Cabecera del Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                ¡Tu imagen está lista!
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Renderizada en resolución nativa {resolution}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Cerrar (Esc)"
            className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo: Miniatura y Acciones */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[80vh]">
          
          {/* Miniatura con marco elegante */}
          <div className="relative w-full max-h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 flex items-center justify-center p-2 shadow-inner group">
            <img
              src={dataUrl}
              alt="Generated Post"
              className="max-h-52 w-auto object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>

          {/* Botones de Acción Inmediata: Descargar y Copiar */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>¡Descargada!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar PNG</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copiar (Ctrl+V)</span>
                </>
              )}
            </button>
          </div>

          {/* Tarjeta de Apoyo Exclusiva en Ko-fi */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-900/90 border border-amber-500/25 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 shadow-sm mt-0.5">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-200">
                  ¿Te fue útil esta herramienta?
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Media Studio es <strong>100% gratuito y sin marcas de agua</strong>. Si te ahorró tiempo de diseño, invita un café en Ko-fi al equipo de <strong>Aleric.dev</strong> para seguir creando herramientas libres de bloatware.
                </p>
              </div>
            </div>

            <a
              href={LINKS.KOFI}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#FF5E5B] hover:bg-[#ff4744] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-[#FF5E5B]/20 active:scale-[0.98]"
            >
              <Coffee className="w-4 h-4" />
              <span>Invitar un café en Ko-fi</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Enlace para Proponer una mejora / Feedback en GitHub */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px]">¿Tienes ideas para mejorar Media Studio?</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={LINKS.GITHUB_ISSUES}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-bold text-[11px] underline underline-offset-2 flex items-center gap-1 transition"
              >
                <span>Proponer mejora</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Pie del modal */}
        <div className="p-3.5 bg-slate-950/80 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 text-[11px] truncate">
            {filename}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-indigo-400 hover:text-indigo-300 font-bold text-[11px] transition"
          >
            Seguir editando
          </button>
        </div>

      </div>
    </div>
  );
};
