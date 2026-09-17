import { PostState } from '../types';

export interface SavedCustomPreset {
  id: string;
  name: string;
  createdAt: number;
  postState: PostState;
}

const STORAGE_KEY = 'media_studio_custom_presets';

export const getSavedCustomPresets = (): SavedCustomPreset[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error al cargar plantillas personalizadas:', e);
    return [];
  }
};

export const saveCustomPreset = (name: string, state: PostState): SavedCustomPreset => {
  const currentPresets = getSavedCustomPresets();
  const id = `preset_${Date.now()}`;
  const newPreset: SavedCustomPreset = {
    id,
    name: name.trim() || `Diseño ${new Date().toLocaleDateString('es-ES')}`,
    createdAt: Date.now(),
    postState: { ...state },
  };

  const updated = [newPreset, ...currentPresets];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error al guardar plantilla en localStorage:', e);
  }

  return newPreset;
};

export const deleteCustomPreset = (id: string): void => {
  const currentPresets = getSavedCustomPresets();
  const updated = currentPresets.filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error al eliminar plantilla:', e);
  }
};
