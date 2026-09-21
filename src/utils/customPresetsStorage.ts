import { PostState } from '../types';

export interface SavedProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt?: number;
  postState: PostState;
}

// Retrocompatibilidad con nombres anteriores
export type SavedCustomPreset = SavedProject;

const STORAGE_KEY = 'media_studio_saved_projects';
// Fallback para migrar presets antiguos si existían
const LEGACY_STORAGE_KEY = 'media_studio_custom_presets';

export const MAX_SAVED_PROJECTS = 5;
export const MAX_PROJECT_NAME_LENGTH = 25;

export const getSavedProjects = (): SavedProject[] => {
  if (typeof window === 'undefined') return [];
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Migrar desde legacy key si existe
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw);
      }
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error al cargar proyectos guardados:', e);
    return [];
  }
};

export const getSavedCustomPresets = getSavedProjects;

export const saveOrUpdateProject = (
  name: string,
  state: PostState,
  existingId?: string | null
): { success: boolean; project?: SavedProject; isUpdate: boolean; error?: string } => {
  const currentProjects = getSavedProjects();
  const rawName = name.trim() || `Proyecto ${new Date().toLocaleDateString('es-ES')}`;
  const trimmedName = rawName.slice(0, MAX_PROJECT_NAME_LENGTH);

  // 1. CASO: Actualizar proyecto existente
  if (existingId) {
    const existingIndex = currentProjects.findIndex((p) => p.id === existingId);
    if (existingIndex >= 0) {
      const existing = currentProjects[existingIndex];
      const updatedProject: SavedProject = {
        ...existing,
        name: trimmedName,
        updatedAt: Date.now(),
        postState: JSON.parse(JSON.stringify(state)),
      };

      const updatedList = [...currentProjects];
      updatedList[existingIndex] = updatedProject;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        return { success: true, project: updatedProject, isUpdate: true };
      } catch (e) {
        console.error('Error al actualizar proyecto:', e);
        return { success: false, isUpdate: true, error: 'Error al acceder a localStorage.' };
      }
    }
  }

  // 2. CASO: Crear nuevo proyecto (validar límite de 5)
  if (currentProjects.length >= MAX_SAVED_PROJECTS) {
    return {
      success: false,
      isUpdate: false,
      error: `Has alcanzado el límite máximo de ${MAX_SAVED_PROJECTS} proyectos guardados. Elimina uno para continuar.`,
    };
  }

  const id = `project_${Date.now()}`;
  const newProject: SavedProject = {
    id,
    name: trimmedName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    postState: JSON.parse(JSON.stringify(state)),
  };

  const updated = [newProject, ...currentProjects];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true, project: newProject, isUpdate: false };
  } catch (e) {
    console.error('Error al guardar proyecto en localStorage:', e);
    return { success: false, isUpdate: false, error: 'Error al acceder a localStorage.' };
  }
};

export const saveProject = (
  name: string,
  state: PostState
): { success: boolean; project?: SavedProject; error?: string } => {
  const res = saveOrUpdateProject(name, state, null);
  return { success: res.success, project: res.project, error: res.error };
};

export const saveCustomPreset = (name: string, state: PostState): SavedProject => {
  const res = saveProject(name, state);
  if (!res.project) {
    throw new Error(res.error || 'No se pudo guardar el proyecto.');
  }
  return res.project;
};

export const deleteProject = (id: string): void => {
  const currentProjects = getSavedProjects();
  const updated = currentProjects.filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error al eliminar proyecto:', e);
  }
};

export const deleteCustomPreset = deleteProject;
