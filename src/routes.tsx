import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas Públicas bajo PublicLayout (Comparten Header y Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/presentacion" element={<Navigate to="/" replace />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/bienvenida" element={<Navigate to="/inicio" replace />} />
        <Route path="/welcome" element={<Navigate to="/inicio" replace />} />
        <Route path="/menu" element={<Navigate to="/inicio" replace />} />
      </Route>

      {/* Ruta del Editor con su propio layout dedicado */}
      <Route path="/editor" element={<EditorPage />} />

      {/* Fallback general a la raíz (LandingPage) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
