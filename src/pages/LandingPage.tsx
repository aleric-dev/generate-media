import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Download,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  Code2,
  BarChart3,
  MessageSquare,
  Layers,
  Cpu,
  Sliders,
  Eye,
  Share2,
  HelpCircle,
  Lock,
  Laptop,
} from 'lucide-react';
import { LandingShowcasePreview } from '../components/LandingShowcasePreview';
import { PageTransitionLoader } from '../components/PageTransitionLoader';

// Preguntas frecuentes (FAQ)
const FAQ_ITEMS = [
  {
    q: '¿La herramienta es totalmente gratuita y de uso comercial?',
    a: 'Sí, Aleric Media Studio es de acceso 100% libre. Todas las imágenes generadas te pertenecen íntegramente y puedes usarlas tanto en tus redes personales como en campañas comerciales de tu agencia o empresa.',
  },
  {
    q: '¿Las imágenes exportadas incluyen marcas de agua o logos forzados?',
    a: 'No. Las exportaciones en PNG son limpias, nítidas y libres de cualquier marca ajena. Tú configuras tu propio logotipo corporativo, colores institucionales y @handle.',
  },
  {
    q: '¿Por qué las imágenes se generan a 1080p nativo?',
    a: 'El estándar de 1080p (como 1080×1350 para Instagram o 1080×1080 para LinkedIn) garantiza que los algoritmos de compresión de redes sociales no pixelicen ni degraden los textos finos de código fuente o gráficas.',
  },
  {
    q: '¿Mis datos, códigos o logos se envían a algún servidor externo?',
    a: 'No. El motor de renderizado opera 100% en el lado del cliente (en tu propio navegador) usando tecnologías vectoriales SVG y HTML Canvas. Ni tu código ni tus imágenes se transfieren ni almacenan en bases de datos externas.',
  },
  {
    q: '¿Cómo funciona la memoria de marca para no reconfigurarla siempre?',
    a: 'Aleric Media Studio utiliza el almacenamiento local de tu navegador (localStorage). Al guardar tu perfil de marca (logo, colores, tipografías y handle), se aplicará automáticamente cada vez que inicies un nuevo diseño.',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handleStartCreating = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/inicio');
    }, 600);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative overflow-x-hidden">
      {/* Loader de transición al navegar al espacio de trabajo */}
      <PageTransitionLoader isLoading={isTransitioning} message="Cargando espacio de trabajo..." />

      {/* ========================================================================= */}
      {/* HERO PRINCIPAL: ALTO IMPACTO Y CENTRADO VISUAL                           */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-center items-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 z-10">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Estudio de Generación Visual en 1080p Nativo</span>
          </div>

          {/* Titular Principal */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.16] sm:leading-[1.12]">
              Crea publicaciones técnicas de{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
                alto impacto visual
              </span>{' '}
              en segundos.
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Diseñado para arquitectos de software, desarrolladores y agencias técnicas. Sin marcas de agua, con
              módulos reales de código, métricas KPI, gráficos y chats optimizados para retención en redes.
            </p>
          </div>

          {/* CTA PRINCIPAL: COMIENZA A CREAR */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleStartCreating}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold font-mono text-sm sm:text-base transition-all duration-200 shadow-xl shadow-indigo-600/35 hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Comienza a crear</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('showcase-interactivo')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-sm font-semibold border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Ver ejemplos en vivo</span>
            </button>
          </div>

          {/* Badges de Confianza / Micro-Proof */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Gratis & Sin Registro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Exportación Ultra HQ sin marcas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Render 100% en tu Navegador</span>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div
          onClick={() => scrollToSection('showcase-interactivo')}
          className="mt-12 sm:mt-16 flex flex-col items-center gap-1.5 cursor-pointer select-none text-slate-400 hover:text-indigo-300 transition group"
        >
          <span className="text-[11px] font-mono tracking-wider uppercase">Explora el renderizado Ultra HQ</span>
          <ChevronDown className="w-4 h-4 text-indigo-400 animate-bounce group-hover:translate-y-1 transition-transform" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHOWCASE VISUAL INTERACTIVO: EJEMPLOS REALES EN VIVO                   */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 3. SHOWCASE VISUAL INTERACTIVO: LIENZO REAL 1:1 CON FONDO ANARANJADO / ROJO */}
      {/* ========================================================================= */}
      <section id="showcase-interactivo" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 z-10">
        <div className="text-center space-y-3 pb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-300 text-xs font-mono border border-orange-500/25">
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>Lienzo Real Cuadrado 1:1</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Observa la calidad editorial con tus propios ojos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl mx-auto">
            Elige entre los diferentes ejemplos y tonos para ver la fidelidad de renderizado en vivo.
          </p>
        </div>

        {/* Componente Modular Aislado para Máxima Estabilidad */}
        <LandingShowcasePreview />
      </section>


      {/* ========================================================================= */}
      {/* 4. LOS 9 MÓDULOS EDITORIALES NATIVOS                                      */}
      {/* ========================================================================= */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 z-10">
        <div className="text-center space-y-3 pb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Arquitectura Modular Completa</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            9 motores especializados para cada tipo de contenido
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl mx-auto">
            Desde código de bajo nivel hasta ofertas comerciales. Elige el componente exacto que tu audiencia necesita
            ver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Módulo 1: Code */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800/90 hover:border-indigo-500/40 transition-all duration-200 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Bloques de Código</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Terminal elegante con resaltado de sintaxis, numeración de líneas opcional, nombre de fichero y badges de
              tecnologías (Postgres, Rust, Python, TypeScript).
            </p>
          </div>

          {/* Módulo 2: KPI */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800/90 hover:border-emerald-500/40 transition-all duration-200 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Indicadores KPI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Números titánicos con etiquetas de métricas y flechas de tendencia (+450%, &lt;0.2s latencia, 99.9%
              disponibilidad) para respaldar tus resultados.
            </p>
          </div>

          {/* Módulo 3: Chart */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800/90 hover:border-sky-500/40 transition-all duration-200 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Gráficas Comparativas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Barras porcentuales horizontales con código de colores para contrastar alternativas, velocidad de carga o
              eficiencia de infraestructura.
            </p>
          </div>

          {/* Módulo 4: Chat */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-200 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">4. Diálogos de Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulación de mensajes estilo WhatsApp o soporte al cliente con estado &quot;en línea&quot; y marcas de tiempo,
              ideal para captar leads comerciales.
            </p>
          </div>

          {/* Módulo 5: Steps */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800/90 hover:border-pink-500/40 transition-all duration-200 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">5. Pasos de Proceso</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tarjetas secuenciales 01, 02 y 03 con título y descripción breve para guías paso a paso, metodologías
              ágiles y flujos de arquitectura.
            </p>
          </div>

          {/* Módulo 6: Promo */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800/90 hover:border-amber-500/40 transition-all duration-200 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">6. Ofertas & Promociones</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bloque publicitario con titular de oferta, cupón de descuento con borde discontinuo y botón de reclamo
              diseñado para lanzamientos.
            </p>
          </div>

          {/* Módulo 7: CTA Directo */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800/90 hover:border-purple-500/40 transition-all duration-200 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <ArrowRight className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">7. Llamadas a la Acción (CTA)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tarjeta de conversión directa con badge de solución rápida, frase de impacto y botón destacado para la
              última diapositiva de carruseles.
            </p>
          </div>

          {/* Módulo 8: Texto & Citas */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800/90 hover:border-rose-500/40 transition-all duration-200 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">8. Declaraciones Editoriales</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cita tipográfica con formato de tarjeta o texto puro de alta jerarquía para frases lapidarias, opiniones de
              ingeniería o anuncios.
            </p>
          </div>

          {/* Módulo 9: Imágenes & Mockups */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800/90 hover:border-blue-500/40 transition-all duration-200 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">9. Capturas & Diagramas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inserta capturas de pantallas de dashboards, diagramas de infraestructura o logos de clientes con bordes
              de cristal, neón o redondeados.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MULTI-FORMATO: LOS 4 ASPECT RATIOS EN 1080P (9:16 -> 4:5 -> 1:1 -> 16:9) */}
      {/* ========================================================================= */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 z-10 border-t border-slate-800/60">
        <div className="text-center space-y-3 pb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-mono border border-sky-500/20">
            <Share2 className="w-3.5 h-3.5" />
            <span>Proporciones Reales a Escala</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Exporta en la proporción exacta para cada canal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl mx-auto">
            Visualiza la altura y proporción matemática real de cada formato: desde el formato vertical completo 9:16
            hasta el panorámico 16:9.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* ================================================================= */}
          {/* 1. RATIO 9:16 (EL MÁS ALTO - 1080 × 1920 px)                      */}
          {/* ================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080D1A]/85 border border-slate-800 hover:border-sky-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-bold border border-sky-500/30">
                  9:16
                </span>
                <span className="text-[11px] font-mono text-slate-400">1080 × 1920 px</span>
              </div>
              <h3 className="text-sm font-bold text-white">Stories & Reels</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El más alto de todos. Formato vertical de pantalla completa para Instagram Stories, TikTok y Reels.
              </p>
            </div>

            {/* Escenario responsive: en móvil centrado y adaptado, en desktop base alineada a 300px */}
            <div className="w-full h-[275px] sm:h-[300px] bg-slate-950/70 rounded-xl border border-slate-800/80 p-3 flex items-center sm:items-end justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="absolute bottom-0 inset-x-0 h-px bg-slate-800" />

              {/* Mockup 9:16 Proporcional Real: w:145px, h:258px en móvil / w:150px, h:267px en desktop */}
              <div
                className="w-[145px] h-[258px] sm:w-[150px] sm:h-[267px] bg-slate-900 rounded-xl border border-sky-500/40 p-2.5 flex flex-col justify-between shadow-xl relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
                style={{
                  boxShadow: '0 15px 30px -10px rgba(0,0,0,0.8), 0 0 20px rgba(56,189,248,0.15)',
                }}
              >
                {/* Header 9:16 */}
                <div className="flex items-center justify-between">
                  <div className="h-1.5 w-10 bg-sky-400 rounded-full" />
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                </div>

                {/* Contenido Vertical */}
                <div className="space-y-2 my-auto">
                  <div className="h-2 w-14 bg-sky-500/30 rounded" />
                  <div className="h-2.5 w-full bg-slate-300/80 rounded" />
                  <div className="h-2 w-4/5 bg-slate-500 rounded" />

                  {/* Bloque de código o kpi simulado */}
                  <div className="p-2 rounded bg-slate-950/90 border border-slate-800 space-y-1 mt-2">
                    <div className="h-1.5 w-12 bg-emerald-400/80 rounded" />
                    <div className="h-1.5 w-20 bg-slate-600 rounded" />
                    <div className="h-1.5 w-16 bg-sky-400/60 rounded" />
                  </div>
                </div>

                {/* Footer 9:16 */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <div className="h-1.5 w-12 bg-slate-500 rounded" />
                  <span className="text-[8px] font-mono text-sky-400 font-bold">@story</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. RATIO 4:5 (VERTICAL ESTÁNDAR - 1080 × 1350 px)                 */}
          {/* ================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080D1A]/85 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                  4:5
                </span>
                <span className="text-[11px] font-mono text-slate-400">1080 × 1350 px</span>
              </div>
              <h3 className="text-sm font-bold text-white">Instagram & LinkedIn Feed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El estándar de oro para retención en feeds. Ocupa el máximo espacio vertical sin ser cortado.
              </p>
            </div>

            {/* Escenario responsive: en móvil h-[225px] centrado, en desktop h-[300px] base alineada */}
            <div className="w-full h-[225px] sm:h-[300px] bg-slate-950/70 rounded-xl border border-slate-800/80 p-3 flex items-center sm:items-end justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="absolute bottom-0 inset-x-0 h-px bg-slate-800" />

              {/* Mockup 4:5 Proporcional Real: w:155px, h:194px en móvil / w:150px, h:188px en desktop */}
              <div
                className="w-[155px] h-[194px] sm:w-[150px] sm:h-[188px] bg-slate-900 rounded-xl border border-indigo-500/40 p-2.5 flex flex-col justify-between shadow-xl relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
                style={{
                  boxShadow: '0 15px 30px -10px rgba(0,0,0,0.8), 0 0 20px rgba(99,102,241,0.15)',
                }}
              >
                {/* Header 4:5 */}
                <div className="flex items-center justify-between">
                  <div className="h-2 w-12 bg-indigo-400 rounded-full" />
                  <div className="h-1.5 w-6 bg-slate-700 rounded" />
                </div>

                {/* Contenido 4:5 */}
                <div className="space-y-1.5 my-auto">
                  <div className="h-2 w-full bg-slate-300/80 rounded" />
                  <div className="h-1.5 w-3/4 bg-slate-500 rounded" />

                  <div className="p-2 rounded-lg bg-slate-950/90 border border-slate-800 flex items-center justify-between mt-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-400">+340%</span>
                    <div className="h-1.5 w-8 bg-emerald-400 rounded" />
                  </div>
                </div>

                {/* Footer 4:5 */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <div className="h-1.5 w-14 bg-slate-500 rounded" />
                  <span className="text-[8px] font-mono text-indigo-400 font-bold">@post</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 3. RATIO 1:1 (POST CUADRADO UNIVERSAL - 1080 × 1080 px)           */}
          {/* ================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080D1A]/85 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                  1:1
                </span>
                <span className="text-[11px] font-mono text-slate-400">1080 × 1080 px</span>
              </div>
              <h3 className="text-sm font-bold text-white">Post Cuadrado Universal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El formato clásico para cuadrículas de perfil en Instagram, carruseles de LinkedIn y posts cruzados.
              </p>
            </div>

            {/* Escenario responsive: en móvil h-[195px] centrado, en desktop h-[300px] base alineada */}
            <div className="w-full h-[195px] sm:h-[300px] bg-slate-950/70 rounded-xl border border-slate-800/80 p-3 flex items-center sm:items-end justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="absolute bottom-0 inset-x-0 h-px bg-slate-800" />

              {/* Mockup 1:1 Proporcional Real: w:165px, h:165px en móvil / w:150px, h:150px en desktop */}
              <div
                className="w-[165px] h-[165px] sm:w-[150px] sm:h-[150px] bg-slate-900 rounded-xl border border-emerald-500/40 p-2.5 flex flex-col justify-between shadow-xl relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
                style={{
                  boxShadow: '0 15px 30px -10px rgba(0,0,0,0.8), 0 0 20px rgba(16,185,129,0.15)',
                }}
              >
                {/* Header 1:1 */}
                <div className="flex items-center justify-between">
                  <div className="h-2 w-10 bg-emerald-400 rounded-full" />
                  <div className="h-1.5 w-8 bg-slate-700 rounded" />
                </div>

                {/* Contenido 1:1 */}
                <div className="space-y-1.5 my-auto">
                  <div className="h-2 w-full bg-slate-300/80 rounded" />
                  <div className="h-1.5 w-3/4 bg-slate-500 rounded" />
                  <div className="h-4 w-full bg-slate-950 rounded border border-slate-800 flex items-center px-1.5">
                    <div className="h-1.5 w-16 bg-emerald-400 rounded" />
                  </div>
                </div>

                {/* Footer 1:1 */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <div className="h-1.5 w-10 bg-slate-500 rounded" />
                  <span className="text-[8px] font-mono text-emerald-400 font-bold">@feed</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 4. RATIO 16:9 (PANORÁMICO / EL MÁS BAJO - 1920 × 1080 px)          */}
          {/* ================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080D1A]/85 border border-slate-800 hover:border-purple-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                  16:9
                </span>
                <span className="text-[11px] font-mono text-slate-400">1920 × 1080 px</span>
              </div>
              <h3 className="text-sm font-bold text-white">Landscape & X (Twitter)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El más ancho y bajo. Ideal para cabeceras de artículos técnicos, Open Graph cards y banners de X.
              </p>
            </div>

            {/* Escenario responsive: en móvil h-[160px] centrado, en desktop h-[300px] base alineada */}
            <div className="w-full h-[160px] sm:h-[300px] bg-slate-950/70 rounded-xl border border-slate-800/80 p-3 flex items-center sm:items-end justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="absolute bottom-0 inset-x-0 h-px bg-slate-800" />

              {/* Mockup 16:9 Proporcional Real: w:230px, h:130px en móvil / w:204px, h:115px en desktop */}
              <div
                className="w-[230px] h-[130px] sm:w-[204px] sm:h-[115px] bg-slate-900 rounded-xl border border-purple-500/40 p-2.5 flex flex-col justify-between shadow-xl relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
                style={{
                  boxShadow: '0 15px 30px -10px rgba(0,0,0,0.8), 0 0 20px rgba(192,132,252,0.15)',
                }}
              >
                {/* Header 16:9 */}
                <div className="flex items-center justify-between">
                  <div className="h-2 w-12 bg-purple-400 rounded-full" />
                  <div className="h-1.5 w-10 bg-slate-700 rounded" />
                </div>

                {/* Contenido Horizontal en 2 columnas */}
                <div className="grid grid-cols-2 gap-2 items-center my-auto">
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-slate-300/80 rounded" />
                    <div className="h-1.5 w-3/4 bg-slate-500 rounded" />
                  </div>
                  <div className="h-6 bg-slate-950 rounded border border-slate-800 flex items-center justify-center">
                    <span className="text-[7px] font-mono text-purple-300 font-bold">1920×1080</span>
                  </div>
                </div>

                {/* Footer 16:9 */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <div className="h-1.5 w-16 bg-slate-500 rounded" />
                  <span className="text-[8px] font-mono text-purple-400 font-bold">@banner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ESTUDIO DE ESTILOS: 11 TRAMAS ALGORÍTMICAS Y LUCES                     */}
      {/* ========================================================================= */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 z-10">
        <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-slate-950/90 border border-indigo-500/20 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-mono border border-indigo-500/25">
              <Sliders className="w-3.5 h-3.5" />
              <span>Estética de Alta Ingeniería</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              11 tramas CSS matemáticas e iluminación dual
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No uses fondos planos y aburridos. Media Studio integra tramas procedimentales generadas con CSS puro para
              evitar peso innecesario, combinadas con máscaras de viñeta radial y focos de luz direccionales.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'Circuit', code: 'circuit', icon: '⚡' },
              { name: 'Dot Grid', code: 'dots', icon: '⁖' },
              { name: 'Matrix', code: 'matrix', icon: '░' },
              { name: 'Blueprint', code: 'grid', icon: '▦' },
              { name: 'Neural Net', code: 'neural', icon: '⌬' },
              { name: 'Hexagons', code: 'hexagons', icon: '⎔' },
            ].map((p) => (
              <div
                key={p.code}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center text-center space-y-1.5"
              >
                <span className="text-lg">{p.icon}</span>
                <span className="text-xs font-bold text-slate-200 font-mono">{p.name}</span>
                <span className="text-[10px] text-indigo-400 font-mono">Procedimental</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Focos duales de esquina configurables (10% a 100%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>Modos Dark y Light con paletas armónicas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Tipografías Google Fonts (Space Mono, Inter, Outfit)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FLUJO DE TRABAJO EN 3 PASOS                                           */}
      {/* ========================================================================= */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 z-10">
        <div className="text-center space-y-3 pb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-mono border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flujo Ágil</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            De cero a una publicación lista en menos de un minuto
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Sin curvas de aprendizaje complejas como Photoshop o Figma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800 space-y-3 relative">
            <span className="text-2xl font-mono font-extrabold text-indigo-500/40">01</span>
            <h3 className="text-base font-bold text-white">Configura tu Marca</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ingresa el nombre de tu empresa, tu @handle y sube tu logo. Se almacena localmente para todos tus
              próximos posts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800 space-y-3 relative">
            <span className="text-2xl font-mono font-extrabold text-emerald-500/40">02</span>
            <h3 className="text-base font-bold text-white">Inyecta tu Contenido</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Escribe tus titulares técnicos, pega tu código fuente o define tus métricas KPI. El canvas actualiza el
              diseño al instante.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090E1B]/90 border border-slate-800 space-y-3 relative">
            <span className="text-2xl font-mono font-extrabold text-sky-500/40">03</span>
            <h3 className="text-base font-bold text-white">Exporta en Ultra HQ</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pulsa un botón y descarga tu PNG a 1080p con nitidez absoluta y cero marcas de agua, listo para publicar.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PRIVACIDAD & RENDIMIENTO CLIENT-SIDE                                   */}
      {/* ========================================================================= */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#070B16] border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacidad Total Garantizada</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Tus datos y códigos nunca salen de tu navegador
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A diferencia de otros generadores en la nube, Aleric Media Studio procesa la rasterización 100% en
              cliente. No almacenamos tus imágenes ni requerimos registrar tarjetas de crédito.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono space-y-1">
              <span className="text-xl font-bold text-emerald-400">0 ms</span>
              <span className="text-[10px] text-slate-400 block">Espera en cola</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono space-y-1">
              <span className="text-xl font-bold text-indigo-400">100%</span>
              <span className="text-[10px] text-slate-400 block">Privado en local</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FAQ: PREGUNTAS FRECUENTES INTERACTIVAS                                 */}
      {/* ========================================================================= */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 z-10">
        <div className="text-center space-y-3 pb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Respuestas Rápidas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-3 text-left">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#090E1B]/90 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3 text-sm sm:text-base font-bold text-white hover:text-indigo-300 transition cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. GRAN BANNER CTA FINAL: COMIENZA A CREAR                               */}
      {/* ========================================================================= */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 z-10">
        <div className="rounded-3xl bg-gradient-to-b from-indigo-900/30 via-slate-900/90 to-[#060913] border border-indigo-500/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-3 z-10 relative">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Eleva el estándar visual de tu marca técnica hoy mismo
            </h2>
            <p className="text-slate-400 text-xs sm:text-base max-w-xl mx-auto font-mono">
              Genera tu primera publicación en alta fidelidad y comprueba la nitidez en tus redes sociales.
            </p>
          </div>

          <div className="pt-2 z-10 relative flex justify-center">
            <button
              type="button"
              onClick={handleStartCreating}
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold font-mono text-sm sm:text-base transition shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.99] flex items-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Comienza a crear</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
