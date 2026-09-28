import { createRoot } from 'react-dom/client';
import React from 'react';
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { PostState } from '../types';
import { aspectRatios } from '../constants/templates';
import { CanvasTarget } from '../components/Canvas/CanvasTarget';
import { trackImageGeneration } from './generationTracker';

export interface CarouselExportProgress {
  current: number;
  total: number;
  message: string;
}

export type ProgressCallback = (progress: CarouselExportProgress) => void;

/**
 * Renderiza una diapositiva fuera de pantalla a su resolución nativa (ej: 1080x1350)
 * y retorna su DataURL (image/png).
 */
export async function renderSlideToPng(slideState: PostState): Promise<string> {
  const r = aspectRatios[slideState.aspectRatio] || aspectRatios['4:5'];
  const bgExportColor = slideState.canvasMode === 'light' ? '#F8FAFC' : '#070A0F';

  // 1. Crear contenedor temporal fuera de pantalla pero dentro del DOM
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = `${r.nativeW}px`;
  container.style.height = `${r.nativeH}px`;
  container.style.overflow = 'hidden';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '-999';
  container.style.opacity = '1';
  document.body.appendChild(container);

  const root = createRoot(container);

  return new Promise<string>((resolve, reject) => {
    // Renderizamos el CanvasTarget a tamaño 100% nativo
    root.render(
      React.createElement(
        'div',
        {
          style: {
            width: `${r.nativeW}px`,
            height: `${r.nativeH}px`,
            backgroundColor: bgExportColor,
          },
        },
        React.createElement(CanvasTarget, { state: slideState })
      )
    );

    // Esperar a que el DOM y fuentes se sincronicen
    setTimeout(async () => {
      try {
        if (document.fonts) {
          await document.fonts.ready;
        }

        let dataUrl: string;
        try {
          dataUrl = await htmlToImage.toPng(container.firstElementChild as HTMLElement || container, {
            pixelRatio: 1,
            cacheBust: true,
            backgroundColor: bgExportColor,
          });
        } catch (h2iErr) {
          console.warn('htmlToImage falló en slide offscreen, usando fallback html2canvas:', h2iErr);
          const canvas = await html2canvas(container.firstElementChild as HTMLElement || container, {
            scale: 1,
            useCORS: true,
            backgroundColor: bgExportColor,
            logging: false,
          });
          dataUrl = canvas.toDataURL('image/png');
        }

        // Limpiar el contenedor del DOM
        root.unmount();
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }

        resolve(dataUrl);
      } catch (err) {
        root.unmount();
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
        reject(err);
      }
    }, 120);
  });
}

/**
 * Renderiza todas las diapositivas secuencialmente y emite progreso
 */
export async function renderAllSlides(
  slides: PostState[],
  onProgress?: ProgressCallback
): Promise<string[]> {
  const dataUrls: string[] = [];
  const total = slides.length;

  for (let i = 0; i < total; i++) {
    const slideNumber = i + 1;
    if (onProgress) {
      onProgress({
        current: slideNumber,
        total,
        message: `Renderizando diapositiva ${slideNumber} de ${total}...`,
      });
    }

    const dataUrl = await renderSlideToPng(slides[i]);
    dataUrls.push(dataUrl);

    // Registrar generación de cada slide
    trackImageGeneration();
  }

  return dataUrls;
}

/**
 * Exporta el carrusel completo como archivo .ZIP (imágenes PNG individuales)
 * Perfecto para carruseles de Instagram / Facebook
 */
export async function exportCarouselToZip(
  slides: PostState[],
  onProgress?: ProgressCallback
): Promise<{ filename: string; blob: Blob }> {
  if (!slides.length) throw new Error('No hay diapositivas para exportar.');

  const total = slides.length;
  const dataUrls = await renderAllSlides(slides, onProgress);

  if (onProgress) {
    onProgress({
      current: total,
      total,
      message: 'Comprimiendo archivo ZIP...',
    });
  }

  const zip = new JSZip();
  const firstSlide = slides[0];
  const cleanCompany = (firstSlide.companyName || 'carrusel').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  const folder = zip.folder(`carrusel-${cleanCompany}`) || zip;

  dataUrls.forEach((dataUrl, idx) => {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const slideNumber = String(idx + 1).padStart(2, '0');
    folder.file(`slide-${slideNumber}.png`, base64Data, { base64: true });
  });

  // Agregar archivo de texto con copys y tags
  const copyContent = slides
    .map((s, idx) => `[SLIDE ${idx + 1}]\n${s.title}\n${s.subtitle}\n`)
    .join('\n----------------------------------------\n\n');

  folder.file(
    'contenido-y-copys.txt',
    `CARRUSEL CREADO CON ALERIC DEV MEDIA STUDIO\nFecha: ${new Date().toLocaleString()}\nEmpresa: ${firstSlide.companyName}\n\n${copyContent}\nHashtags:\n${firstSlide.tags || '#AlericDev #Tech #Software'}\n`
  );

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const filename = `carrusel-${cleanCompany}-${slides[0].aspectRatio.replace(':', '-')}-${timestamp}.zip`;

  // Descarga automática en navegador
  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipBlob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);

  return { filename, blob: zipBlob };
}

/**
 * Exporta el carrusel completo como documento .PDF multipágina de alta resolución
 * Formato estándar requerido por LinkedIn para publicaciones tipo carrusel (documentos)
 */
export async function exportCarouselToPdf(
  slides: PostState[],
  onProgress?: ProgressCallback
): Promise<{ filename: string; pdf: jsPDF }> {
  if (!slides.length) throw new Error('No hay diapositivas para exportar.');

  const total = slides.length;
  const dataUrls = await renderAllSlides(slides, onProgress);

  if (onProgress) {
    onProgress({
      current: total,
      total,
      message: 'Compilando documento PDF para LinkedIn...',
    });
  }

  const firstSlide = slides[0];
  const r = aspectRatios[firstSlide.aspectRatio] || aspectRatios['4:5'];
  const orientation = r.nativeW > r.nativeH ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [r.nativeW, r.nativeH],
    hotfixes: ['px_scaling'],
  });

  dataUrls.forEach((dataUrl, idx) => {
    if (idx > 0) {
      pdf.addPage([r.nativeW, r.nativeH], orientation);
    }
    pdf.addImage(dataUrl, 'PNG', 0, 0, r.nativeW, r.nativeH, undefined, 'FAST');
  });

  const cleanCompany = (firstSlide.companyName || 'carrusel').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  const filename = `carrusel-linkedin-${cleanCompany}-${timestamp}.pdf`;

  pdf.save(filename);

  return { filename, pdf };
}
