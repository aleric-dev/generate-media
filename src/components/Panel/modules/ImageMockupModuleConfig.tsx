import React from 'react';
import { PostState } from '../../../types';
import { Upload, Trash2, Image as ImageIcon, ZoomIn } from 'lucide-react';

interface ImageMockupModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const ImageMockupModuleConfig: React.FC<ImageMockupModuleConfigProps> = ({ state, updateState }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        updateState({
          images: [{ url: dataUrl, caption: '' }]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    updateState({ images: [] });
  };

  const currentImg = state.images && state.images[0];

  return (
    <div className="space-y-3.5">
      {/* 1. CARGA DE IMAGEN */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1.5 font-mono">
          Imagen para el Módulo Central:
        </label>
        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-900 border border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer transition text-xs font-mono text-slate-300 hover:text-white">
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>{currentImg ? 'Reemplazar Imagen' : 'Subir Imagen PNG / JPG'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {currentImg && (
            <button
              type="button"
              onClick={removeImage}
              className="p-3 bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/50 text-rose-400 rounded-xl transition"
              title="Quitar imagen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. PROPORCIÓN (ASPECT RATIO) Y AJUSTE */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">
            Proporción:
          </label>
          <select
            value={state.imageAspectRatio || 'auto'}
            onChange={(e) => updateState({ imageAspectRatio: e.target.value as any })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
          >
            <option value="auto">Auto (Original)</option>
            <option value="16:9">16:9 Panorámica</option>
            <option value="1:1">1:1 Cuadrada</option>
            <option value="4:5">4:5 Vertical</option>
            <option value="4:3">4:3 Clásica</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">
            Ajuste:
          </label>
          <select
            value={state.imageFit || 'cover'}
            onChange={(e) => updateState({ imageFit: e.target.value as any })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
          >
            <option value="cover">Cover (Llenar)</option>
            <option value="contain">Contain (Completa)</option>
          </select>
        </div>
      </div>

      {/* 3. ZOOM / ESCALA DE IMAGEN */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-indigo-400" /> Zoom de la Imagen:
          </span>
          <span className="font-bold text-indigo-400">{state.imageZoom || 100}%</span>
        </div>
        <input
          type="range"
          min={70}
          max={150}
          step={5}
          value={state.imageZoom || 100}
          onChange={(e) => updateState({ imageZoom: Number(e.target.value) })}
          className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
};
