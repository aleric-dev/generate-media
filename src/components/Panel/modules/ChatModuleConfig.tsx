import React from 'react';
import { PostState, ChatMessage } from '../../../types';
import { Plus, Trash2, Bot, User, Sun, Moon } from 'lucide-react';

interface ChatModuleConfigProps {
  state: PostState;
  updateState: (updates: Partial<PostState>) => void;
}

export const ChatModuleConfig: React.FC<ChatModuleConfigProps> = ({ state, updateState }) => {
  const addChatMessage = (sender: 'bot' | 'client') => {
    updateState({
      chatMessages: [
        ...state.chatMessages,
        {
          sender,
          text: sender === 'bot' ? '¡Respuesta automática o mensaje enviado!' : 'Pregunta del cliente...',
          time: ''
        }
      ]
    });
  };

  const removeChatMessage = (idx: number) => {
    if (state.chatMessages.length <= 1) return;
    updateState({
      chatMessages: state.chatMessages.filter((_, i) => i !== idx)
    });
  };

  const updateChatMessage = (idx: number, field: keyof ChatMessage, val: any) => {
    const updated = [...state.chatMessages];
    updated[idx] = { ...updated[idx], [field]: val };
    updateState({ chatMessages: updated });
  };

  return (
    <div className="space-y-3.5">
      {/* 1. CONTACTO Y TEMA */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">
            Nombre del Contacto:
          </label>
          <input
            type="text"
            value={state.chatContactName ?? 'Aleric Partner'}
            onChange={(e) => updateState({ chatContactName: e.target.value })}
            placeholder="Aleric Partner"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">
            Tema Visual del Chat:
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => updateState({ chatTheme: 'dark' })}
              className={`py-1 px-1.5 rounded text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 ${
                state.chatTheme !== 'light'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Oscuro</span>
            </button>
            <button
              type="button"
              onClick={() => updateState({ chatTheme: 'light' })}
              className={`py-1 px-1.5 rounded text-[10px] font-mono font-bold transition flex items-center justify-center gap-1 ${
                state.chatTheme === 'light'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>Claro</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. COLOR DE FONDO PERSONALIZADO (COLORPICKER) & REACCIÓN EMOJI */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">
            Fondo Custom:
          </label>
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <input
              type="color"
              value={state.chatBgColor && state.chatBgColor.startsWith('#') && state.chatBgColor.length === 7 ? state.chatBgColor : '#0B141A'}
              onChange={(e) => updateState({ chatBgColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
              title="Seleccionar color con cuentagotas"
            />
            <input
              type="text"
              value={state.chatBgColor ?? ''}
              onChange={(e) => updateState({ chatBgColor: e.target.value })}
              placeholder="#0B141A"
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1 font-mono">
            Reacción Emoji (Último msg):
          </label>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <input
              type="text"
              value={state.chatReaction ?? ''}
              onChange={(e) => updateState({ chatReaction: e.target.value })}
              placeholder="Sin emoji"
              className="w-16 bg-transparent text-white font-mono text-xs text-center focus:outline-none"
            />
            <div className="flex items-center gap-0.5 overflow-x-auto py-0.5">
              {['🔥', '❤️', '👍', '🚀', '⭐', '👏'].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => updateState({ chatReaction: em })}
                  className="hover:scale-125 transition-transform text-xs px-0.5"
                  title={`Asignar ${em}`}
                >
                  {em}
                </button>
              ))}
              {state.chatReaction && (
                <button
                  type="button"
                  onClick={() => updateState({ chatReaction: '' })}
                  className="text-[10px] text-slate-500 hover:text-rose-400 font-bold px-1"
                  title="Quitar reacción"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MENSAJES DE WHATSAPP (SIN HORAS) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Conversación ({state.chatMessages.length} mensajes):
          </label>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => addChatMessage('client')}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
              title="Añadir mensaje recibido del cliente"
            >
              <User className="w-3 h-3" />
              <span>+ Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => addChatMessage('bot')}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold"
              title="Añadir mensaje enviado por ti/bot"
            >
              <Bot className="w-3 h-3" />
              <span>+ Enviado</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {state.chatMessages.map((msg, idx) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border space-y-2 transition-all ${
                  isBot
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateChatMessage(idx, 'sender', isBot ? 'client' : 'bot')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                        isBot
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                      title="Alternar entre enviado y recibido"
                    >
                      {isBot ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      <span>{isBot ? 'Enviado (Tú / Bot)' : 'Recibido (Cliente)'}</span>
                    </button>
                  </div>

                  {state.chatMessages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChatMessage(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  value={msg.text}
                  onChange={(e) => updateChatMessage(idx, 'text', e.target.value)}
                  placeholder="Escribe el mensaje..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-sans focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
