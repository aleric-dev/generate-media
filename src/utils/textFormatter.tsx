import React from 'react';
import { TitleHighlightStyle, TitleHighlightWeight, TitleHighlightColorMode } from '../types';

interface TextFormatOptions {
  accentColor?: string;
  titleColor?: string;
  isDark?: boolean;
  highlightStyle?: TitleHighlightStyle;
  hasExplicitBold?: boolean;
  highlightFont?: string;
  highlightWeight?: TitleHighlightWeight;
  highlightColorMode?: TitleHighlightColorMode;
  highlightTextColor?: string;
  canvasBgColor?: string;
}

/**
 * Determina si un color hexadecimal es claro u oscuro para calcular contraste legible.
 */
function isLightColor(hex: string): boolean {
  if (!hex || !hex.startsWith('#')) return false;
  const clean = hex.replace('#', '');
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65;
}

/**
 * Parsea y formatea texto enriquecido para títulos y titulares en el Canvas:
 * - `*texto*` -> Negrita Ultra Black (950) con alto contraste sobre el texto base
 * - `_texto_` -> Cursiva (italic)
 * - `<texto>` -> Resaltador con personalización avanzada:
 *     - 6 estilos visuales: Pincelada, Rotulador, Bloque, Subrayado, Color Pop, Cápsula
 *     - 3 modos de color: Invertido (fondo texto/texto lienzo), Contraste opuesto, o Personalizado
 *     - Tipografía y peso independiente (Delgado 300, Normal 400, Grueso 700, Black 950)
 */
export function formatTitleText(
  text: string | undefined | null,
  options: TextFormatOptions = {}
): React.ReactNode {
  if (!text) return text ?? '';

  const {
    accentColor = '#FF5722',
    titleColor = '#FFFFFF',
    isDark = true,
    highlightStyle = 'marker-strip',
    highlightFont = 'inherit',
    highlightWeight = 'bold',
    highlightColorMode = 'contrast',
    highlightTextColor = '#FFFFFF',
    canvasBgColor = isDark ? '#0B0F19' : '#FFFFFF',
  } = options;

  // 1. Resolver colores del fondo y texto del resaltado:
  let finalBg = accentColor;
  let finalText = isLightColor(finalBg) ? '#0F172A' : '#FFFFFF';

  if (highlightColorMode === 'inverted') {
    // Fondo del color del texto, texto del color de fondo del lienzo
    finalBg = titleColor;
    finalText = canvasBgColor;
  } else if (highlightColorMode === 'custom') {
    finalBg = accentColor;
    finalText = highlightTextColor || '#FFFFFF';
  } else {
    // 'contrast': fondo del color de acento, texto del contraste opuesto
    finalBg = accentColor;
    finalText = isLightColor(finalBg) ? '#0F172A' : '#FFFFFF';
  }

  // 2. Resolver tipografía y peso del resaltador:
  const fontClass = highlightFont && highlightFont !== 'inherit' ? highlightFont : '';
  let fontWeightValue = 700;
  if (highlightWeight === 'thin') fontWeightValue = 300;
  else if (highlightWeight === 'normal') fontWeightValue = 400;
  else if (highlightWeight === 'bold') fontWeightValue = 700;
  else if (highlightWeight === 'black') fontWeightValue = 950;

  let keyCounter = 0;

  function parseSegment(input: string): React.ReactNode[] {
    if (!input) return [];

    // Busca el primer delimitador de *, _ o <>
    const tokenRegex = /(<[^>]+>|\*[^*]+\*|_[^_]+_)/;
    const match = input.match(tokenRegex);

    if (!match || match.index === undefined) {
      return [input];
    }

    const matchIndex = match.index;
    const fullMatch = match[0];
    const prefix = input.slice(0, matchIndex);
    const suffix = input.slice(matchIndex + fullMatch.length);

    const nodes: React.ReactNode[] = [];

    if (prefix) {
      nodes.push(prefix);
    }

    const currentKey = `fmt-${keyCounter++}`;

    if (fullMatch.startsWith('<') && fullMatch.endsWith('>')) {
      let rawInner = fullMatch.slice(1, -1);
      let targetStyle = highlightStyle;

      // Soporte para prefijo en sintaxis: <solid:texto>, <marker:texto>, etc.
      if (rawInner.startsWith('solid:')) {
        targetStyle = 'solid-block';
        rawInner = rawInner.slice(6);
      } else if (rawInner.startsWith('marker:')) {
        targetStyle = 'marker-strip';
        rawInner = rawInner.slice(7);
      } else if (rawInner.startsWith('brush:')) {
        targetStyle = 'brush-stroke';
        rawInner = rawInner.slice(6);
      } else if (rawInner.startsWith('underline:')) {
        targetStyle = 'underline-thick';
        rawInner = rawInner.slice(10);
      } else if (rawInner.startsWith('color:')) {
        targetStyle = 'colored-text';
        rawInner = rawInner.slice(6);
      } else if (rawInner.startsWith('circle:') || rawInner.startsWith('oval:')) {
        targetStyle = 'circle-sketch';
        rawInner = rawInner.replace(/^(circle|oval):/, '');
      }

      const parsedInner = parseSegment(rawInner);

      switch (targetStyle) {
        case 'solid-block':
          nodes.push(
            <span
              key={currentKey}
              className={`inline-block px-3 py-1 mx-1 rounded-[4px] tracking-tight leading-tight align-baseline select-none transition-all shadow-md ${fontClass}`}
              style={{
                backgroundColor: finalBg,
                color: finalText,
                fontWeight: fontWeightValue,
                boxShadow: isDark 
                  ? `0 6px 16px -2px rgba(0,0,0,0.6), 0 2px 8px ${finalBg}60` 
                  : `0 6px 16px -2px ${finalBg}40`,
                transform: 'translateY(-1px)',
              }}
            >
              {parsedInner}
            </span>
          );
          break;

        case 'brush-stroke':
          // Pincelada auténtica con textura orgánica y cerdas SVG
          nodes.push(
            <span
              key={currentKey}
              className={`relative inline-block px-2.5 mx-1 z-0 align-baseline ${fontClass}`}
            >
              <svg
                className="absolute -inset-x-2.5 -bottom-1.5 -top-1.5 w-[calc(100%+20px)] h-[calc(100%+12px)] -z-10 pointer-events-none"
                viewBox="0 0 320 64"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Cuerpo principal de la pincelada con bordes irregulares */}
                <path
                  d="M 6,36 C 25,24 75,18 160,20 C 230,22 285,16 312,24 C 318,30 315,38 305,44 C 270,54 210,50 140,52 C 70,54 20,52 6,42 C 3,40 3,38 6,36 Z"
                  fill={finalBg}
                  opacity={0.88}
                />
                {/* Trazo superior de cerdas secas */}
                <path
                  d="M 18,22 C 80,14 180,15 295,19"
                  stroke={finalBg}
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={0.5}
                />
                {/* Sangrado inferior de pintura fresca */}
                <path
                  d="M 28,48 C 110,55 200,53 285,49"
                  stroke={finalBg}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity={0.4}
                />
              </svg>
              <span
                className="relative z-10"
                style={{
                  fontWeight: fontWeightValue,
                  color: highlightColorMode === 'contrast' ? titleColor : finalText,
                }}
              >
                {parsedInner}
              </span>
            </span>
          );
          break;

        case 'underline-thick':
          // Subrayado trazado a mano con trazo grueso y curva orgánica
          nodes.push(
            <span
              key={currentKey}
              className={`relative inline-block px-1 mx-0.5 z-0 align-baseline ${fontClass}`}
            >
              <svg
                className="absolute -bottom-2.5 -left-1.5 -right-1.5 w-[calc(100%+12px)] h-4 -z-10 pointer-events-none"
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 3,8 C 45,4 95,9 145,5 C 175,3 192,6 197,8"
                  stroke={finalBg}
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity={0.9}
                />
                <path
                  d="M 12,11 C 60,8 130,11 185,9"
                  stroke={finalBg}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity={0.5}
                />
              </svg>
              <span
                className="relative z-10"
                style={{
                  fontWeight: fontWeightValue,
                  color: highlightColorMode === 'contrast' ? titleColor : finalText,
                }}
              >
                {parsedInner}
              </span>
            </span>
          );
          break;

        case 'colored-text':
          nodes.push(
            <span
              key={currentKey}
              className={`inline-block transition-colors align-baseline ${fontClass}`}
              style={{
                color: finalBg,
                fontWeight: fontWeightValue,
                textShadow: isDark ? `0 2px 16px ${finalBg}60` : `0 1px 8px ${finalBg}40`,
              }}
            >
              {parsedInner}
            </span>
          );
          break;

        case 'circle-sketch':
          // Óvalo / Círculo trazado a mano que rodea la palabra
          nodes.push(
            <span
              key={currentKey}
              className={`relative inline-block px-3 py-0.5 mx-1 z-0 align-baseline ${fontClass}`}
            >
              <svg
                className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+24px)] h-[calc(100%+16px)] -z-10 pointer-events-none"
                viewBox="0 0 240 70"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 30,35 C 20,15 75,8 140,9 C 200,10 230,20 226,38 C 221,55 170,62 95,60 C 35,58 10,48 18,32 C 26,16 85,9 155,11 C 210,13 234,25 228,39"
                  stroke={finalBg}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.92}
                />
              </svg>
              <span
                className="relative z-10"
                style={{
                  fontWeight: fontWeightValue,
                  color: highlightColorMode === 'contrast' ? titleColor : finalText,
                }}
              >
                {parsedInner}
              </span>
            </span>
          );
          break;

        case 'marker-strip':
        default:
          // Franja clásica tipo rotulador editorial (como imágenes 2 y 3)
          nodes.push(
            <span
              key={currentKey}
              className={`relative inline-block px-1.5 mx-0.5 z-0 align-baseline ${fontClass}`}
            >
              <span
                className="absolute -inset-x-1 bottom-[10%] h-[44%] -z-10 rounded-[3px] pointer-events-none transition-all"
                style={{
                  backgroundColor: finalBg,
                  opacity: isDark ? 0.92 : 0.85,
                  boxShadow: `0 0 1px 1px ${finalBg}40`,
                }}
              />
              <span
                className="relative z-10"
                style={{
                  fontWeight: fontWeightValue,
                  color: highlightColorMode === 'contrast' ? titleColor : finalText,
                }}
              >
                {parsedInner}
              </span>
            </span>
          );
          break;
      }
    } else if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
      const inner = fullMatch.slice(1, -1);
      nodes.push(
        <strong
          key={currentKey}
          className="font-black drop-shadow-md tracking-normal inline-block"
          style={{
            fontWeight: 950,
            color: isDark ? '#FFFFFF' : '#0B0F19',
            textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.7)' : '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          {parseSegment(inner)}
        </strong>
      );
    } else if (fullMatch.startsWith('_') && fullMatch.endsWith('_')) {
      const inner = fullMatch.slice(1, -1);
      nodes.push(
        <em
          key={currentKey}
          className="italic opacity-95"
        >
          {parseSegment(inner)}
        </em>
      );
    } else {
      nodes.push(fullMatch);
    }

    if (suffix) {
      nodes.push(...parseSegment(suffix));
    }

    return nodes;
  }

  const result = parseSegment(text);
  return <>{result}</>;
}
