import React from 'react';
import { BrandPanel } from './BrandPanel';
import { PostState } from '../../types';

interface StylePanelProps {
  state: PostState;
  updateState: (partial: Partial<PostState>) => void;
}

/**
 * @deprecated StylePanel ha sido absorbido en BrandPanel (Paso 1: Marca) y ModulePanel (Paso 3: Módulo).
 */
export const StylePanel: React.FC<StylePanelProps> = (props) => {
  return <BrandPanel {...props} />;
};
