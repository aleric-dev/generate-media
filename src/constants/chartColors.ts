// Paleta de colores básicos y lógica dinámica para gráficos
// La Posición 1 siempre corresponde al color del tema (state.currentColor).
// Las Posiciones 2 a 5 toman colores básicos (Amarillo, Rojo, Verde, Azul, etc.)
// descartando automáticamente cualquier color similar al tema para evitar repeticiones.

export interface ColorDef {
  id: string;
  name: string;
  hex: string;
}

export const BASE_DISTINCT_COLORS: ColorDef[] = [
  { id: 'yellow', name: 'Amarillo', hex: '#EAB308' },
  { id: 'red',    name: 'Rojo',     hex: '#EF4444' },
  { id: 'green',  name: 'Verde',    hex: '#10B981' },
  { id: 'blue',   name: 'Azul',     hex: '#2563EB' },
  { id: 'orange', name: 'Naranja',  hex: '#F97316' },
  { id: 'purple', name: 'Púrpura',  hex: '#8B5CF6' },
  { id: 'cyan',   name: 'Cian',     hex: '#06B6D4' },
  { id: 'pink',   name: 'Rosa',     hex: '#EC4899' },
];

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  const fullHex = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return [79, 70, 229];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function colorDistance(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}

export function getChartColors(themeColor: string = '#4F46E5'): string[] {
  const cleanTheme = (themeColor || '#4F46E5').trim();

  // Filtrar colores de la paleta básica que sean idénticos o cromáticamente muy cercanos al tema (< 85 de distancia RGB)
  const filtered = BASE_DISTINCT_COLORS.filter(base => {
    if (base.hex.toLowerCase() === cleanTheme.toLowerCase()) return false;
    const dist = colorDistance(base.hex, cleanTheme);
    return dist >= 85;
  });

  const remaining = filtered.slice(0, 4).map(c => c.hex);

  // Asegurar siempre tener al menos 4 colores secundarios
  if (remaining.length < 4) {
    for (const b of BASE_DISTINCT_COLORS) {
      if (!remaining.includes(b.hex) && b.hex.toLowerCase() !== cleanTheme.toLowerCase()) {
        remaining.push(b.hex);
        if (remaining.length === 4) break;
      }
    }
  }

  // Posición 0 es siempre el color del tema
  return [cleanTheme, ...remaining];
}

// Exportación canónica por defecto
export const FIXED_CHART_COLORS = getChartColors('#4F46E5');
