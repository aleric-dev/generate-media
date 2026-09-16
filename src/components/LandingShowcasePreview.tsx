import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Zap,
  BarChart3,
  MessageSquare,
  Layers,
  Quote,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { PostState } from '../types';
import { initialPostState, useStudioStore } from '../store/useStudioStore';
import { aspectRatios } from '../constants/templates';
import { CanvasTarget } from './Canvas/CanvasTarget';

// 7 Colores de acento seleccionables (cálidos, fríos y neón)
export const SHOWCASE_COLORS = [
  { id: 'orange', name: 'Naranja Neón', hex: '#EA580C' },
  { id: 'red', name: 'Rojo Carmesí', hex: '#DC2626' },
  { id: 'purple', name: 'Púrpura / Violeta', hex: '#8B5CF6' },
  { id: 'indigo', name: 'Índigo Cyber', hex: '#4F46E5' },
  { id: 'cyan', name: 'Cian Eléctrico', hex: '#06B6D4' },
  { id: 'emerald', name: 'Verde Esmeralda', hex: '#10B981' },
  { id: 'amber', name: 'Ámbar / Oro', hex: '#F59E0B' },
];

// 6 Temáticas de ejemplo con datos genéricos
export const SHOWCASE_THEMES = [
  {
    id: 'code',
    name: 'Código & Backend',
    icon: Code2,
    module: 'code' as const,
    category: 'INGENIERÍA DE SOFTWARE',
    title: '¿Tu base de datos está lista para picos de tráfico?',
    subtitle: 'Aplica réplicas de lectura y caché distribuido para mantener la latencia por debajo de 20ms.',
    code: `export async function processOrder(orderId: string) {\n  const session = await db.startTransaction();\n  await inventory.lockStock(orderId);\n  return await paymentGateway.charge(orderId);\n}`,
    codeFilename: 'infrastructure/cluster.ts',
    tags: 'TypeScript, PostgreSQL, Redis, Docker',
    cta: 'Escríbenos y optimizamos tu infraestructura.',
  },
  {
    id: 'kpi',
    name: 'Métricas & KPIs',
    icon: Zap,
    module: 'kpi' as const,
    category: 'RENDIMIENTO & ANALÍTICA',
    title: 'Resultados reales medidos en entornos de producción',
    subtitle: 'Optimizaciones de velocidad y disponibilidad para aplicaciones web de alta demanda.',
    kpis: [
      { val: '+380%', label: 'CRECIMIENTO DE CONVERSIÓN', prefix: '', suffix: '', trend: 'up' as const, borderTop: true },
      { val: '< 15ms', label: 'TIEMPO DE RESPUESTA EDGE', prefix: '', suffix: '', trend: 'down' as const, borderTop: true },
    ],
    tags: 'Core Web Vitals, CDN Global, Next.js, Cloudflare',
    cta: 'Acelera la velocidad de tu plataforma.',
  },
  {
    id: 'chart',
    name: 'Gráfica Comparativa',
    icon: BarChart3,
    module: 'chart' as const,
    category: 'EFICIENCIA OPERACIONAL',
    title: 'Procesos Manuales vs Arquitectura Automatizada',
    subtitle: 'Impacto en reducción de errores y horas de trabajo en tareas críticas.',
    chartBars: [
      { label: 'Procesamiento Manual en Hojas', pct: 22, color: '#EF4444' },
      { label: 'Flujos Automatizados en la Nube', pct: 94, color: '#10B981' },
      { label: 'Disponibilidad SLA Garantizada', pct: 99.9, color: '#6366F1' },
    ],
    tags: 'Automatización, APIs, Webhooks, Base Centralizada',
    cta: 'Cotiza tu sistema a la medida.',
  },
  {
    id: 'chat',
    name: 'Chat & Soporte',
    icon: MessageSquare,
    module: 'chat' as const,
    category: 'ATENCIÓN COMERCIAL 24/7',
    title: 'Atención al cliente inmediata sin fricción ni demoras',
    subtitle: 'Respuestas contextuales en tiempo real conectadas directamente con tu base de datos.',
    chatMessages: [
      { sender: 'client' as const, text: 'Hola, ¿tienen disponibilidad para agendar una demostración hoy?', time: '10:30 AM' },
      { sender: 'bot' as const, text: '¡Hola! Tenemos cupos disponibles a las 3:00 PM y 5:00 PM. ¿Cuál prefieres?', time: '10:30 AM' },
    ],
    chatContactName: 'Asistente Digital Aleric',
    tags: 'WhatsApp API, Respuestas en Vivo, CRM Cloud',
    cta: 'Integra atención 24/7 en tu negocio.',
  },
  {
    id: 'steps',
    name: 'Pasos & Roadmap',
    icon: Layers,
    module: 'steps' as const,
    category: 'METODOLOGÍA & FLUJO',
    title: 'De la planeación al lanzamiento en 3 fases simples',
    subtitle: 'Un marco de ejecución ágil para entregar proyectos a tiempo y sin sobrecostos.',
    steps: [
      { step: '01', title: 'Auditoría & Diagnóstico', desc: 'Mapeo de requerimientos técnicos y diseño de base de datos.' },
      { step: '02', title: 'Desarrollo en Sprints', desc: 'Construcción iterativa con pruebas automatizadas de extremo a extremo.' },
      { step: '03', title: 'Despliegue & Monitoreo', desc: 'Puesta en producción en la nube con monitoreo 24/7.' },
    ],
    tags: 'Sprints Ágiles, CI/CD, Docker, Infraestructura Cloud',
    cta: 'Inicia tu proyecto de software hoy.',
  },
  {
    id: 'quote',
    name: 'Cita & Declaración',
    icon: Quote,
    module: 'text' as const,
    category: 'ESTRATEGIA & LIDERAZGO',
    title: 'El software bien diseñado es una ventaja competitiva',
    subtitle: 'No se trata solo de escribir código, sino de resolver cuellos de botella reales de negocio.',
    contentHighlightText: 'Las empresas que automatizan sus procesos críticos crecen hasta 3 veces más rápido que las que dependen de hojas de cálculo manuales.',
    contentHighlightStyle: 'quote' as const,
    tags: 'Arquitectura Web, Buenas Prácticas, Escalabilidad',
    cta: 'Construye software sólido con nosotros.',
  },
];

interface LandingShowcasePreviewProps {
  className?: string;
  onSelectState?: (state: Partial<PostState>) => void;
}

export const LandingShowcasePreview: React.FC<LandingShowcasePreviewProps> = ({
  className = '',
  onSelectState,
}) => {
  const navigate = useNavigate();
  const updatePostState = useStudioStore((s) => s.updatePostState);
  const setWizardModalOpen = useStudioStore((s) => s.setWizardModalOpen);

  // Estados interactivos
  const [activeThemeId, setActiveThemeId] = useState<string>('code');
  const [activeColorHex, setActiveColorHex] = useState<string>('#EA580C'); // Naranja por defecto

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.38);

  const currentTheme =
    SHOWCASE_THEMES.find((t) => t.id === activeThemeId) || SHOWCASE_THEMES[0];

  // Estado consolidado 1:1 estricto con trama grid y sin figuras de fondo
  const previewState: PostState = {
    ...initialPostState,
    aspectRatio: '1:1',
    currentColor: activeColorHex,
    category: currentTheme.category,
    title: currentTheme.title,
    subtitle: currentTheme.subtitle,
    activeModule: currentTheme.module,
    code: currentTheme.code || initialPostState.code,
    codeFilename: currentTheme.codeFilename || initialPostState.codeFilename,
    kpis: currentTheme.kpis || initialPostState.kpis,
    chartBars: currentTheme.chartBars || initialPostState.chartBars,
    chatMessages: currentTheme.chatMessages || initialPostState.chatMessages,
    chatContactName: currentTheme.chatContactName || initialPostState.chatContactName,
    steps: currentTheme.steps || initialPostState.steps,
    contentHighlightText: currentTheme.contentHighlightText || initialPostState.contentHighlightText,
    contentHighlightStyle: currentTheme.contentHighlightStyle || initialPostState.contentHighlightStyle,
    tags: currentTheme.tags,
    cta: currentTheme.cta,
    handle: '@empresa.dev',
    companyName: 'Tu Empresa',
    // Parámetros de fondo inmutables:
    shapesEnabled: false,
    shapeType: 'none',
    shapeCount: 0,
    patternEnabled: true,
    bgPattern: 'grid',
    patternScale: 90,
    patternOpacity: 85,
    patternVignette: 'vignette',
    lightIntensity: 60,
    lightDirection: 'dual-corners-1',
    lightsEnabled: true,
    headerShape: 'line',
    footerShape: 'line',
  };

  const ratioConfig = aspectRatios['1:1'];
  const { nativeW, nativeH } = ratioConfig;

  // Cálculo de escala responsive preciso y estable para el contenedor 1:1
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availW = rect.width - 24;
      const availH = (rect.height || 520) - 24;

      if (availW > 0 && availH > 0) {
        const factor = Math.min(availW / nativeW, availH / nativeH);
        setScale(Math.max(0.22, Math.min(factor, 0.46)));
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener('resize', updateScale);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [nativeW, nativeH]);

  const scaledW = Math.round(nativeW * scale);
  const scaledH = Math.round(nativeH * scale);

  const handleApplyAndCreate = () => {
    updatePostState({
      ...previewState,
      activeStep: 1,
    });
    setWizardModalOpen(true);
    if (onSelectState) {
      onSelectState(previewState);
    }
  };

  return (
    <div
      className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-[#070B16]/95 border border-slate-800/90 rounded-3xl p-4 sm:p-7 shadow-2xl ${className}`}
    >
      {/* ===================================================================== */}
      {/* COLUMNA IZQUIERDA: EL RENDER LIMPIO (SIN LABELS NI DETALLES EXTRA)    */}
      {/* ===================================================================== */}
      <div className="lg:col-span-7 flex items-center justify-center w-full">
        <div
          ref={containerRef}
          className="w-full flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 rounded-2xl border border-slate-800/80 relative overflow-hidden"
          style={{ minHeight: '480px' }}
        >
          {/* Trama de fondo ambiental suave */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${activeColorHex} 1px, transparent 1px)`,
              backgroundSize: '18px 18px',
            }}
          />

          {/* Marco del Canvas con halo de acento suave */}
          <div
            className="relative rounded-2xl overflow-hidden ring-1 ring-white/20 transition-all duration-300"
            style={{
              width: `${scaledW}px`,
              height: `${scaledH}px`,
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 45px ${activeColorHex}25`,
            }}
          >
            {/* Lienzo Real escalado nativo */}
            <div
              style={{
                width: `${nativeW}px`,
                height: `${nativeH}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              <CanvasTarget state={previewState} />
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* COLUMNA DERECHA: OPCIONES (EJEMPLOS) Y BOTÓN CTA (SIN DETALLES/LABELS) */}
      {/* ===================================================================== */}
      <div className="lg:col-span-5 flex flex-col justify-center space-y-5 text-left">
        {/* Selector de las 6 Temáticas (sin labels, solo botones de ejemplo) */}
        <div className="grid grid-cols-2 gap-2.5">
          {SHOWCASE_THEMES.map((theme) => {
            const Icon = theme.icon;
            const isSelected = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActiveThemeId(theme.id)}
                className={`px-3 py-3 rounded-2xl text-xs font-mono font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white border shadow-lg'
                    : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800'
                }`}
                style={{
                  borderColor: isSelected ? activeColorHex : undefined,
                  boxShadow: isSelected ? `0 0 16px ${activeColorHex}30` : undefined,
                }}
              >
                <Icon
                  className="w-4 h-4 shrink-0 transition-colors"
                  style={{ color: isSelected ? activeColorHex : undefined }}
                />
                <span className="truncate">{theme.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selector de los 8 Colores (sin labels de texto ni códigos hex) */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {SHOWCASE_COLORS.map((c) => {
              const isSelected = activeColorHex === c.hex;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveColorHex(c.hex)}
                  title={c.name}
                  aria-label={c.name}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110 shadow-lg'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: c.hex,
                    boxShadow: isSelected ? `0 0 16px ${c.hex}70` : undefined,
                  }}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow" />}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-mono font-semibold text-slate-400 shrink-0 ml-2">1080 × 1080</span>
        </div>

        {/* ÚNICO BOTÓN PRINCIPAL CON EL CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleApplyAndCreate}
            className="w-full py-4 rounded-2xl text-white font-mono text-sm font-bold transition-all duration-200 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02] active:scale-[0.99]"
            style={{
              backgroundColor: activeColorHex,
              boxShadow: `0 12px 30px -6px ${activeColorHex}50`,
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Comienza a crear con esta plantilla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
