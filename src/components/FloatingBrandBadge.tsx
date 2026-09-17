import React from 'react';
import { APP_VERSION } from '../constants/version';
import { Sparkles, Info } from 'lucide-react';

interface FloatingBrandBadgeProps {
  onClick: () => void;
}

export const FloatingBrandBadge: React.FC<FloatingBrandBadgeProps> = ({ onClick }) => {
  return (
    <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 select-none">
      <button
        type="button"
        onClick={onClick}
        title="Acerca de Media Studio & Aleric.dev"
        className="group flex items-center gap-2.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl backdrop-blur-xl shadow-2xl transition-all duration-200 hover:shadow-indigo-500/20 active:scale-95"
      >
        {/* Isotipo oficial Aleric sin bordes dobles */}
        <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-slate-950 p-0.5 border border-white/10">
          <img
            src="/logo-rounded.png"
            alt="Logo"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        </div>

        {/* Nombre y Versión */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-white font-inter tracking-tight">
            Media Studio
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold">
            {APP_VERSION}
          </span>
          <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition" />
        </div>
      </button>
    </div>
  );
};
