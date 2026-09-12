import React, { useRef, useState, useEffect } from 'react';
import { PostState } from '../types';
import { aspectRatios } from '../constants/templates';
import { CanvasTarget } from './Canvas/CanvasTarget';
import { Sparkles, Eye } from 'lucide-react';

interface RealCanvasPreviewProps {
  state: PostState;
  className?: string;
  maxHeight?: number;
}

export const RealCanvasPreview: React.FC<RealCanvasPreviewProps> = ({
  state,
  className = '',
  maxHeight = 520,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.3);

  const ratioConfig = aspectRatios[state.aspectRatio] || aspectRatios['4:5'];
  const { nativeW, nativeH } = ratioConfig;

  // Cálculo de escala responsive preciso basado en el contenedor disponible
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availW = rect.width - 24; // padding horizontal
      const availH = Math.min(rect.height || maxHeight, maxHeight) - 24; // padding vertical

      if (availW > 0 && availH > 0) {
        const scaleW = availW / nativeW;
        const scaleH = availH / nativeH;
        // Tomamos el factor menor para asegurar que el canvas quepa completo
        const computedScale = Math.min(scaleW, scaleH);
        setScale(Math.max(0.15, Math.min(computedScale, 0.45)));
      }
    };

    updateScale();
    const ro = new ResizeObserver(() => {
      updateScale();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [nativeW, nativeH, maxHeight]);

  const scaledW = Math.round(nativeW * scale);
  const scaledH = Math.round(nativeH * scale);

  return (
    <div className={`flex flex-col items-center w-full h-full ${className}`}>
      {/* Header Info Badge */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-t-xl text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            Lienzo Real Ultra HQ
          </span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30">
            {state.aspectRatio}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[10px]">
            {ratioConfig.px}
          </span>
          <span className="text-[10px] text-slate-400">
            {Math.round(scale * 100)}% zoom
          </span>
        </div>
      </div>

      {/* Viewport Contenedor con fondo cuadriculado oscuro */}
      <div
        ref={containerRef}
        className="w-full flex-1 flex items-center justify-center p-4 bg-slate-950/90 border-x border-b border-slate-800 rounded-b-xl overflow-hidden relative"
        style={{ minHeight: `${maxHeight}px` }}
      >
        {/* Trama sutil de fondo de mesa de trabajo */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Caja envolvente dimensionada exactamente a la escala */}
        <div
          className="relative shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/20 transition-all duration-300"
          style={{
            width: `${scaledW}px`,
            height: `${scaledH}px`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(79, 70, 229, 0.15)',
          }}
        >
          {/* Contenedor del Canvas a resolución nativa escalado con transform */}
          <div
            style={{
              width: `${nativeW}px`,
              height: `${nativeH}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <CanvasTarget state={state} />
          </div>
        </div>
      </div>

      {/* Mini footer de estado del asistente */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 mt-2 text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Cambios en tiempo real sincronizados
        </span>
        <span className="text-slate-400">
          Modo: <strong className="text-slate-300 capitalize">{state.canvasMode}</strong>
        </span>
      </div>
    </div>
  );
};
