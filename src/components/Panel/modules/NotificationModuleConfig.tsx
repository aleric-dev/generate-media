import React from 'react';
import { PostState } from '../../../types';
import { Rocket, Check, DollarSign, Zap, Bell, Shield, User, Star, TrendingUp } from 'lucide-react';

interface NotificationModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const NotificationModuleConfig: React.FC<NotificationModuleConfigProps> = ({ state, updateState }) => {
  const notifIcons = [
    { id: 'rocket', label: 'Cohete', icon: Rocket },
    { id: 'check', label: 'Check', icon: Check },
    { id: 'dollar', label: 'Finanzas', icon: DollarSign },
    { id: 'zap', label: 'Rayo', icon: Zap },
    { id: 'shield', label: 'Escudo', icon: Shield },
    { id: 'bell', label: 'Campana', icon: Bell },
    { id: 'user', label: 'Usuario', icon: User },
    { id: 'star', label: 'Estrella', icon: Star },
    { id: 'chart', label: 'Métricas', icon: TrendingUp },
  ];

  return (
    <div className="space-y-3.5">
      {/* 1. APP & TIEMPO */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Nombre de la App:</label>
          <input
            type="text"
            value={state.notificationApp ?? 'Aleric Platform'}
            onChange={(e) => updateState({ notificationApp: e.target.value })}
            placeholder="Aleric Platform"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">Marca de Tiempo:</label>
          <input
            type="text"
            value={state.notificationTime ?? 'hace 2 min'}
            onChange={(e) => updateState({ notificationTime: e.target.value })}
            placeholder="hace 2 min"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. SELECTOR DE ÍCONO */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Ícono del Evento:</label>
        <div className="grid grid-cols-5 gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
          {notifIcons.map((ic) => {
            const IconComp = ic.icon;
            const isSelected = (state.notificationIcon || 'rocket') === ic.id;
            return (
              <button
                key={ic.id}
                type="button"
                onClick={() => updateState({ notificationIcon: ic.id as any })}
                className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                title={ic.label}
              >
                <IconComp className="w-4 h-4" />
                <span className="text-[9px] font-mono truncate w-full text-center">{ic.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TÍTULO DEL EVENTO */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1 font-mono font-bold">Título del Evento:</label>
        <input
          type="text"
          value={state.notificationTitle ?? 'Despliegue a Producción'}
          onChange={(e) => updateState({ notificationTitle: e.target.value })}
          placeholder="Despliegue a Producción"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-medium text-xs focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* 4. CIFRA / MÉTRICA HERO (OPCIONAL) */}
      <div>
        <label className="text-[10px] text-indigo-400 block mb-1 font-mono font-bold">
          Cifra / Métrica Destacada (Opcional):
        </label>
        <input
          type="text"
          value={state.notificationHighlight ?? '+1,420 transacciones procesadas'}
          onChange={(e) => updateState({ notificationHighlight: e.target.value })}
          placeholder="+$14,500 USD / 99.99% Uptime"
          className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg p-2 text-white font-mono font-bold text-xs focus:border-indigo-400 focus:outline-none"
        />
      </div>

      {/* 5. MENSAJE DESCRIPTIVO */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1 font-mono">Mensaje o Subtítulo:</label>
        <textarea
          rows={2}
          value={state.notificationMessage ?? ''}
          onChange={(e) => updateState({ notificationMessage: e.target.value })}
          placeholder="Mensaje descriptivo del logro..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 resize-none leading-relaxed focus:border-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
