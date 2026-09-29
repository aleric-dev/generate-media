import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStudioStore } from '../store/useStudioStore';
import { getProjectById } from '../utils/customPresetsStorage';

/**
 * Hook de sesión del Editor:
 * - Centraliza de forma declarativa la inicialización y sincronización de estado.
 * - Procesa payloads externos (como importaciones desde Aleric Editorial Hub) limpiando la URL de forma transparente.
 * - Carga proyectos guardados por UUID en la ruta (/editor/:projectId).
 * - Mantiene los componentes de la vista limpios y sin lógica de efectos dispersa.
 */
export function useEditorSession(projectId?: string) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const loadProjectState = useStudioStore((s) => s.loadProjectState);
  const resetToScratch = useStudioStore((s) => s.resetToScratch);
  const currentProjectId = useStudioStore((s) => s.currentProjectId);
  const importExternalPayload = useStudioStore((s) => s.importExternalPayload);
  const showToast = useStudioStore((s) => s.showToast);

  // Evitar procesamiento duplicado en React 19 StrictMode
  const lastProcessedRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. Carga prioritaria de Payload Externo (vía Query Param 'importPayload')
    const rawPayload = searchParams.get('importPayload');
    if (rawPayload) {
      if (lastProcessedRef.current === rawPayload) return;
      lastProcessedRef.current = rawPayload;

      const success = importExternalPayload(rawPayload);
      if (success) {
        // Limpieza transparente de la URL sin disparar re-render de React Router
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
      return;
    }

    // 2. Carga reactiva de Proyecto Local por UUID
    if (projectId) {
      if (currentProjectId === projectId) return;
      const proj = getProjectById(projectId);
      if (proj) {
        loadProjectState(proj.postState, proj.id, proj.name);
      } else {
        showToast('El proyecto solicitado no existe o fue eliminado.', 'error');
        navigate('/editor', { replace: true });
      }
      return;
    }

    // 3. Si no hay proyecto en la URL pero había uno en sesión, resetear a nuevo lienzo
    if (currentProjectId) {
      resetToScratch();
    }
  }, [projectId, searchParams, currentProjectId, importExternalPayload, loadProjectState, resetToScratch, showToast, navigate]);
}
