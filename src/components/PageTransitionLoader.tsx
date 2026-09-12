import React from 'react';
import { BrandLogo } from './BrandLogo';

interface PageTransitionLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  isLoading,
  message = 'Cargando espacio de trabajo...',
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#050811]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none transition-opacity duration-300">
      
      {/* Barra de progreso superior en degradado */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900 overflow-hidden z-10">
        <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 animate-progress-bar origin-left" />
      </div>

      {/* Glow ambiental */}
      <div className="absolute w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-5 text-center">
        {/* Spinner animado con BrandLogo en el centro */}
        <div className="relative flex items-center justify-center">
          {/* Anillo giratorio exterior */}
          <div className="w-20 h-20 rounded-full border-2 border-slate-800 border-t-indigo-500 border-r-indigo-400 animate-spin" />
          
          {/* Pulso interior */}
          <div className="absolute inset-2 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-xl">
            <BrandLogo size="sm" showText={false} />
          </div>
        </div>

        {/* Mensaje de estado */}
        <div className="space-y-1.5">
          <p className="text-sm font-bold text-white tracking-wide font-mono flex items-center justify-center gap-2">
            <span>{message}</span>
          </p>
          <p className="text-[11px] font-mono text-slate-400">
            Aleric Media Studio • Render 1080p Ultra HQ
          </p>
        </div>
      </div>

    </div>
  );
};
