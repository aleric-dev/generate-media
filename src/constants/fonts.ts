export interface FontOption {
  id: string;
  label: string;
  desc: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'font-inter', label: 'Inter UI', desc: 'Limpia, neutra y legible' },
  { id: 'font-montserrat', label: 'Montserrat', desc: 'Geométrica y comercial' },
  { id: 'font-poppins', label: 'Poppins', desc: 'Amigable, redondeada y actual' },
  { id: 'font-plus-jakarta', label: 'Plus Jakarta', desc: 'Moderna y corporativa' },
  { id: 'font-outfit', label: 'Outfit Bold', desc: 'Editorial de alto impacto' },
  { id: 'font-playfair', label: 'Playfair Display', desc: 'Elegante y serif de lujo' },
  { id: 'font-space-mono', label: 'Space Mono', desc: 'Monoespaciada de precisión' },
  { id: 'font-jetbrains', label: 'JetBrains Mono', desc: 'Sintaxis de código moderno' },
  { id: 'font-fira-code', label: 'Fira Code', desc: 'Mono técnica para devs' },
  { id: 'font-syne', label: 'Syne Futurista', desc: 'Vanguardista y diseño premium' },
  { id: 'font-raleway', label: 'Raleway', desc: 'Estilizada y refinada' },
  { id: 'font-oswald', label: 'Oswald', desc: 'Condensada y titulares potentes' },
];
