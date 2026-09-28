import { BrandProfile } from '../types';

const STORAGE_KEY = 'media_studio_saved_brands';
const ACTIVE_BRAND_KEY = 'media_studio_active_brand_id';

export const normalizeBrandName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const getSavedBrands = (): BrandProfile[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error al cargar marcas guardadas:', e);
    return [];
  }
};

export const findBrandByName = (name: string, excludeId?: string): BrandProfile | null => {
  const normalized = normalizeBrandName(name);
  if (!normalized) return null;
  const brands = getSavedBrands();
  return (
    brands.find(
      (b) => b.id !== excludeId && normalizeBrandName(b.name || b.companyName) === normalized
    ) || null
  );
};

export const saveBrand = (brand: Omit<BrandProfile, 'id' | 'createdAt'> & { id?: string }): BrandProfile => {
  const currentBrands = getSavedBrands();
  const id = brand.id || `brand_${Date.now()}`;
  const now = Date.now();

  const newProfile: BrandProfile = {
    ...brand,
    id,
    createdAt: now,
  };

  // Si se marca como default, desmarcar las demás
  let updatedList = currentBrands.map((b) => (brand.isDefault ? { ...b, isDefault: false } : b));

  const existingIndex = updatedList.findIndex((b) => b.id === id);
  if (existingIndex >= 0) {
    updatedList[existingIndex] = newProfile;
  } else {
    updatedList.unshift(newProfile);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Error al guardar marca en localStorage:', e);
  }

  return newProfile;
};

export interface SaveBrandValidationResult {
  success: boolean;
  brand?: BrandProfile;
  error?: string;
  isDuplicate?: boolean;
}

export const saveBrandWithValidation = (
  brandData: Omit<BrandProfile, 'id' | 'createdAt'> & { id?: string }
): SaveBrandValidationResult => {
  const rawName = brandData.name || brandData.companyName || '';
  const trimmedName = rawName.trim();

  if (!trimmedName) {
    return {
      success: false,
      error: 'El nombre de la marca es obligatorio y no puede contener solo espacios.',
    };
  }

  const duplicate = findBrandByName(trimmedName, brandData.id);
  if (duplicate) {
    return {
      success: false,
      isDuplicate: true,
      error: `Ya existe una marca guardada con el nombre exacto "${duplicate.name || duplicate.companyName}". Elige un nombre distinto.`,
    };
  }

  const brandToSave = {
    ...brandData,
    name: trimmedName,
    companyName: trimmedName,
  };

  const saved = saveBrand(brandToSave);
  setActiveBrandId(saved.id);

  return {
    success: true,
    brand: saved,
  };
};

export const updateBrand = (
  id: string,
  updates: Partial<Omit<BrandProfile, 'id' | 'createdAt'>>
): SaveBrandValidationResult => {
  const currentBrands = getSavedBrands();
  const existingIndex = currentBrands.findIndex((b) => b.id === id);
  if (existingIndex < 0) {
    return { success: false, error: 'La marca que intentas editar no existe.' };
  }

  const existing = currentBrands[existingIndex];
  const rawName = updates.name !== undefined ? updates.name : (updates.companyName !== undefined ? updates.companyName : existing.name);
  const trimmedName = rawName.trim();

  if (!trimmedName) {
    return {
      success: false,
      error: 'El nombre de la marca es obligatorio y no puede contener solo espacios.',
    };
  }

  // Validar duplicados excluyendo el propio ID que se está modificando
  const duplicate = findBrandByName(trimmedName, id);
  if (duplicate) {
    return {
      success: false,
      isDuplicate: true,
      error: `Ya existe otra marca guardada con el nombre exacto "${duplicate.name || duplicate.companyName}". Elige un nombre distinto.`,
    };
  }

  const updatedProfile: BrandProfile = {
    ...existing,
    ...updates,
    name: trimmedName,
    companyName: trimmedName,
    handle: updates.handle !== undefined ? (updates.handle.trim() || 'tumarca.dev') : existing.handle,
  };

  const updatedList = [...currentBrands];
  updatedList[existingIndex] = updatedProfile;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return { success: true, brand: updatedProfile };
  } catch (e) {
    console.error('Error al actualizar marca en localStorage:', e);
    return { success: false, error: 'Error al acceder a localStorage.' };
  }
};

export const deleteBrand = (id: string): void => {
  const currentBrands = getSavedBrands();
  const updatedList = currentBrands.filter((b) => b.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    if (getActiveBrandId() === id) {
      const fallback = updatedList[0]?.id || null;
      setActiveBrandId(fallback);
    }
  } catch (e) {
    console.error('Error al eliminar marca:', e);
  }
};

export const getDefaultBrand = (): BrandProfile | null => {
  const brands = getSavedBrands();
  const activeId = getActiveBrandId();
  if (activeId) {
    const active = brands.find((b) => b.id === activeId);
    if (active) return active;
  }
  return brands.find((b) => b.isDefault) || brands[0] || null;
};

export const setDefaultBrand = (id: string): void => {
  const brands = getSavedBrands();
  const updated = brands.map((b) => ({
    ...b,
    isDefault: b.id === id,
  }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setActiveBrandId(id);
  } catch (e) {
    console.error('Error al definir marca predeterminada:', e);
  }
};

export const getActiveBrandId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_BRAND_KEY);
};

export const setActiveBrandId = (id: string | null): void => {
  if (typeof window === 'undefined') return;
  if (!id) {
    localStorage.removeItem(ACTIVE_BRAND_KEY);
  } else {
    localStorage.setItem(ACTIVE_BRAND_KEY, id);
  }
};
