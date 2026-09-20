import { PostState } from '../types';

export interface SavedProject {
  id: string;
  name: string;
  createdAt: number;
  postState: PostState;
}

// Retrocompatibilidad con nombres anteriores
export type SavedCustomPreset = SavedProject;

const STORAGE_KEY = 'media_studio_saved_projects';
// Fallback para migrar presets antiguos si existían
const LEGACY_STORAGE_KEY = 'media_studio_custom_presets';

export const MAX_SAVED_PROJECTS = 5;

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

export const saveProject = (
  name: string,
  state: PostState
): { success: boolean; project?: SavedProject; error?: string } => {
  const currentProjects = getSavedProjects();

  if (currentProjects.length >= MAX_SAVED_PROJECTS) {
    return {
      success: false,
      error: `Has alcanzado el límite máximo de ${MAX_SAVED_PROJECTS} proyectos guardados. Elimina uno para continuar.`,
    };
  }

  const id = `project_${Date.now()}`;
  const newProject: SavedProject = {
    id,
    name: name.trim() || `Proyecto ${new Date().toLocaleDateString('es-ES')}`,
    createdAt: Date.now(),
    // Clonado profundo para garantizar integridad absoluta del proyecto
    postState: JSON.parse(JSON.stringify(state)),
  };

  const updated = [newProject, ...currentProjects];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error al guardar proyecto en localStorage:', e);
    return { success: false, error: 'Error al acceder a localStorage.' };
  }

  return { success: true, project: newProject };
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
