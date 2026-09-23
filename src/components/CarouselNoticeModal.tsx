import React from 'react';
import { 
  X, 
  Layers, 
  Sparkles, 
  FileText, 
  Archive, 
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from './ui';

interface CarouselNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSinglePost?: () => void;
}

export const CarouselNoticeModal: React.FC<CarouselNoticeModalProps> = ({
  isOpen,
  onClose,
  onStartSinglePost,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-lg bg-[#0B101B] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de fondo decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Cabecera del modal */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Modo Carrusel
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Roadmap v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generador multi-slide para LinkedIn e Instagram
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido / Explicación del Roadmap */}
        <div className="space-y-3 relative z-10 text-xs">
          <p className="text-slate-300 leading-relaxed font-sans">
            Estamos diseñando un flujo independiente y dedicado exclusivamente a narrativas de múltiples diapositivas, para garantizar una experiencia fluida sin saturar el editor principal:
          </p>

          <div className="space-y-2 pt-1 font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">Documentos PDF para LinkedIn</span>
                <span className="text-[11px] text-slate-400 font-sans leading-snug block mt-0.5">
                  Exportación de PDFs multipágina vectorizados de alta retención para subir directamente como documentos.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-pink-500/15 text-pink-400 shrink-0 mt-0.5">
                <Archive className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">Paquetes ZIP para Instagram</span>
                <span className="text-[11px] text-slate-400 font-sans leading-snug block mt-0.5">
                  Descarga en bloque de imágenes 1080p numeradas secuencialmente junto a un archivo con todos los copys.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">Estructuras de Storytelling</span>
                <span className="text-[11px] text-slate-400 font-sans leading-snug block mt-0.5">
                  Plantillas guiadas: Portada gancho ➔ Split Card Antes/Después ➔ Métricas Hero ➔ Llamado a la acción.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800/80 relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white"
          >
            Cerrar
          </Button>
          {onStartSinglePost && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onStartSinglePost();
              }}
              className="text-xs gap-1.5 font-mono"
            >
              <span>Crear Post Individual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
