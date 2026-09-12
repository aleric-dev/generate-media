import { BrandProfile } from '../types';

const STORAGE_KEY = 'aleric_saved_brands';

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

export const deleteBrand = (id: string): void => {
  const currentBrands = getSavedBrands();
  const updatedList = currentBrands.filter((b) => b.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Error al eliminar marca:', e);
  }
};

export const getDefaultBrand = (): BrandProfile | null => {
  const brands = getSavedBrands();
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
  } catch (e) {
    console.error('Error al definir marca predeterminada:', e);
  }
};
