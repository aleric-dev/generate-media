import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppRoutes } from './routes';
import { CreationWizardModal } from './components/CreationWizardModal';
import { TemplatesModal } from './components/TemplatesModal';
import { useStudioStore } from './store/useStudioStore';

const AppModals: React.FC = () => {
  const navigate = useNavigate();
  const wizardModalOpen = useStudioStore((s) => s.wizardModalOpen);
  const setWizardModalOpen = useStudioStore((s) => s.setWizardModalOpen);
  const templatesModalOpen = useStudioStore((s) => s.templatesModalOpen);
  const setTemplatesModalOpen = useStudioStore((s) => s.setTemplatesModalOpen);
  const postState = useStudioStore((s) => s.postState);
  const updatePostState = useStudioStore((s) => s.updatePostState);
  const applyTemplate = useStudioStore((s) => s.applyTemplate);

  const handleConfirmWizard = (customized: Partial<typeof postState>) => {
    updatePostState({
      ...customized,
      activeStep: 1,
    });
    setWizardModalOpen(false);
    navigate('/editor');
  };

  const handleSelectTemplate = (tpl: Parameters<typeof applyTemplate>[0]) => {
    applyTemplate(tpl);
    setTemplatesModalOpen(false);
    navigate('/editor');
  };

  return (
    <>
      <CreationWizardModal
        isOpen={wizardModalOpen}
        onClose={() => setWizardModalOpen(false)}
        onConfirmAndOpenEditor={handleConfirmWizard}
        currentState={postState}
      />

      <TemplatesModal
        isOpen={templatesModalOpen}
        onClose={() => setTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#050811] text-slate-100 font-inter">
        <AppRoutes />
        <AppModals />
        <Toaster
          theme="dark"
          position="top-center"
          richColors
          closeButton
          duration={3000}
          toastOptions={{
            style: {
              background: '#0B101B',
              border: '1px solid rgba(51, 65, 85, 0.7)',
              color: '#F1F5F9',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '13px',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
};
