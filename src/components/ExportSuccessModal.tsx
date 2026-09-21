import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Download, 
  Copy, 
  Coffee, 
  X, 
  Sparkles, 
  ExternalLink, 
  Home,
  BookmarkCheck,
  ArrowRight
} from 'lucide-react';
import { LINKS } from '../constants/links';
import { useStudioStore } from '../store/useStudioStore';

interface ExportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataUrl: string | null;
  filename: string;
  resolution: string;
  postTitle?: string;
  postTags?: string;
  onSaveProject?: () => void;
  onGoHome?: () => void;
}

export const ExportSuccessModal: React.FC<ExportSuccessModalProps> = ({
  isOpen,
  onClose,
  dataUrl,
  filename,
  resolution,
  onSaveProject,
  onGoHome,
}) => {
  const showToast = useStudioStore((s) => s.showToast);
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
    showToast('¡Descargando imagen Ultra HQ!', 'success');
    setTimeout(() => setDownloaded(false), 3000);
  };

  // Copiar imagen PNG al portapapeles del sistema
  const handleCopyToClipboard = async () => {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      showToast('¡Imagen copiada al portapapeles!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      showToast('No se pudo copiar al portapapeles', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      {/* Backdrop con desenfoque profundo */}
      <div
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del Modal: 2 Columnas (Contenido a la Izquierda, Imagen a la Derecha) */}
      <div className="relative w-full max-w-4xl xl:max-w-5xl max-h-[92vh] bg-[#0B101B] border border-slate-800 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-10 animate-scaleUp">
        
        {/* Cabecera del Modal */}
        <div className="p-4 sm:px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
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

        {/* Cuerpo del Modal: 2 Columnas (Izquierda: Acciones Reales | Derecha: Imagen Grande) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* COLUMNA IZQUIERDA: ACCIONES REALES DE IMAGEN & APOYO                      */}
          {/* ========================================================================= */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Botones de Acción de Imagen Reales: Descargar y Copiar */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
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
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]"
                  title="Copia el archivo de imagen directamente para pegar con Ctrl+V"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">¡Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-indigo-400" />
                      <span>Copiar (Ctrl+V)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Explicación de uso para Copiar (Ctrl+V) */}
              <p className="text-[11px] text-slate-400 px-1 leading-relaxed">
                Usa <strong>Copiar (Ctrl+V)</strong> para pegar la imagen directamente en WhatsApp Web, Slack, Twitter o LinkedIn sin tener que guardarla en tu disco.
              </p>
            </div>

            {/* Tarjeta de Apoyo Exclusiva en Ko-fi */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-900/90 border border-amber-500/25 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <Coffee className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-amber-200">
                    ¿Te fue útil esta herramienta?
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Media Studio es <strong>100% libre y sin marcas de agua</strong>. Si te ahorró tiempo, apoya el proyecto invitando un café en Ko-fi.
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

            {/* Enlace para Feedback / Proponer mejora */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">¿Tienes ideas o feedback?</span>
              </div>
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

          {/* ========================================================================= */}
          {/* COLUMNA DERECHA: PREVISUALIZACIÓN DE LA IMAGEN GENERADA                   */}
          {/* ========================================================================= */}
          <div className="md:col-span-6 flex flex-col items-center justify-center h-full">
            <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950/90 border border-slate-800/90 p-3 shadow-2xl flex flex-col items-center justify-center group min-h-[320px] md:min-h-[440px]">
              <img
                src={dataUrl}
                alt="Generated Post"
                className="max-h-[380px] xl:max-h-[420px] w-auto max-w-full object-contain rounded-xl shadow-xl transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="w-full flex items-center justify-between pt-2.5 px-1 text-[10px] font-mono text-slate-500">
                <span className="truncate max-w-[200px]">{filename}</span>
                <span className="text-indigo-400 font-semibold">{resolution}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* FOOTER DEL MODAL: SEGUIR EDITANDO, GUARDAR PROYECTO O VOLVER AL INICIO     */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:px-6 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono shrink-0">
          
          {/* Botón: Volver al Inicio */}
          <button
            type="button"
            onClick={onGoHome ? onGoHome : onClose}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 transition active:scale-95"
            title="Volver a la pantalla de inicio"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Volver al inicio</span>
          </button>

          {/* Grupo Derecho: Guardar Proyecto y Seguir Editando */}
          <div className="flex items-center gap-2">
            {onSaveProject && (
              <button
                type="button"
                onClick={onSaveProject}
                className="py-2 px-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition font-semibold active:scale-95"
                title="Guardar como plantilla o proyecto en tu navegador"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Guardar proyecto</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/20 active:scale-95"
              title="Cerrar modal y seguir trabajando en el canvas"
            >
              <span>Seguir editando</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
