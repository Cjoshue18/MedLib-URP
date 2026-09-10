import React, { useState, useEffect } from 'react';

interface HomePageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Start on Slide 3 (Catálogo OPAC as shown in screen.png), cycle smoothly
  const [currentSlide, setCurrentSlide] = useState(3);
  const totalSlides = 4;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Auto advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  const slides = [
    {
      tag: 'Directorio Biomédico',
      title: 'Explora más de 15 bases de datos científicas',
      description: 'Acceso exclusivo a literatura médica de alto impacto para investigadores y estudiantes de la facultad.',
      buttonText: 'Ingresar al Directorio',
      action: () => onNavigate('directory'),
      bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsn8AqQ7LQ9a7cpggMBvOo6uUtrDzH-RSxjVguqDpbMJ4HrbR9A-H1tjWOhVwFAkv25jpxu7FRHWcRdVDnJ1GfTbZRBWr_PHq4LnbgDAa95RG2AV2ezQfXz8SULwv-R4d3Gbi2B-8jFLyWcR5p3crJ9W-_QXBYdzRbW_wX5JSeLLCyDFa-MJm0Epzakv-ZBMnnXyLyc1pD5hP3gFleqHJ3gVeZkOZ0PRYN2N4w7CPxz92CiEwdDJU'
    },
    {
      tag: 'Conferencias & ALFIN',
      title: 'Potencia tus habilidades de investigación',
      description: 'Participa en talleres especializados en búsqueda y gestión de información biomédica.',
      buttonText: 'Ver Calendario',
      action: () => onNavigate('conferences'),
      bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoxyVJ9hVxn0zsPakl41qGZYZ3-sp9xMLeBPWGMBHsyurYWXN9At3vpLT2RjXTzre8Fpci-TZL4CWddottiT7jirnRFsqoJE7uJr13rgyTnYfCQDmxPg1JgW9xPo2tioK4-wAMUAXBOX072KwNH70TxRf1mRzxBUg5LQba0by2n-QiFKm4L_GuKRC5Vwqadv5bD76FZKg9Ob6UB4gLqrnBNfXIhHcxdCTN4PYOnJYX-7T7fvaCnUs'
    },
    {
      tag: 'Objetos Perdidos',
      title: 'Recupera tus pertenencias en sala',
      description: 'Revisa el registro actualizado de objetos encontrados en las instalaciones de la biblioteca.',
      buttonText: 'Consultar Registro',
      action: () => onNavigate('lost-found'),
      bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAidUIRZ5AE2f3_TC91yGMET1xv7yiwGPDI56rUABykDP0yC6nE6aHSoR-2gFHBMjKMVlzfsYYq2CvhCxZ9QbYDIqcB5G2tievSZsp1djZ_nA_R0l-lUbmro5718TiyMehlOpVvmaJgfG4H2HMIxA3OyHU0rxbBpE2jhF3wFZVXHdhwDBRkUFpTOYD_GTNX20FemdOC5psYFmq7Ch-j5de0EzCLAMn-V4e20Lb9L76wSe-rNTB6YMY'
    },
    {
      tag: 'Catálogo ABNOPAC',
      title: 'Accede a nuestra colección física completa',
      description: 'Busca libros, revistas y material de referencia disponible en las estanterías de la facultad.',
      buttonText: 'Buscar en ABNOPAC',
      action: () => window.open('https://biblioteca.urp.edu.pe/abnopac/abnetcl.exe/OUPRkTEemSX5fzUCA6ikVwrO3fz?ACC=101', '_blank'),
      bgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF4LTqwOPgPOC1XTyiv340j1CucejKPYS9ZE3vHvhU-AzFWFA8z8ck0ux2u0FlQK2lvvKFUSXiWwzD4QK0wdOglcnmeZBOcUonEUAcPTrzAXFDFdCPHdObHH_cKq5k_dYpmGL_mr7tvzWyRllUWM_XYSQiAOS0irqWGjxUn7G14p80moJFvBYNd7Au9HE0EBT4cUR-65jRBRloFPH3snHRLTDIYW8POsMvIeWIApyvi42lQl-KMKo'
    }
  ];

  return (
    <main className="w-full">
      {/* Hero Carousel matching Stitch */}
      <section className="relative w-full h-[600px] overflow-hidden bg-slate-900 group">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.bgUrl}')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-6 max-w-[1280px] mx-auto w-full z-10">
              <span className="text-primary-fixed font-label-md tracking-wider uppercase mb-4 font-semibold">
                {slide.tag}
              </span>
              <h1 className="font-display-lg text-white mb-6 max-w-2xl">
                {slide.title}
              </h1>
              <p className="font-body-lg text-slate-300 max-w-xl mb-8 leading-relaxed">
                {slide.description}
              </p>
              <button
                onClick={slide.action}
                className="bg-primary-container text-white px-8 py-3 rounded-full font-label-md w-fit hover:bg-primary transition-colors cursor-pointer font-semibold shadow-md"
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Ir a slide ${idx + 1}`}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'bg-primary-fixed scale-125' : 'bg-white/50 hover:bg-white'
              }`}
            ></button>
          ))}
        </div>

        {/* Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors z-20 opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl">chevron_left</span>
        </button>
        <button
          onClick={nextSlide}
          aria-label="Siguiente"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors z-20 opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl">chevron_right</span>
        </button>
      </section>

      {/* Feature Grid */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nuevas Bases de Datos 2026 */}
          <div className="lg:col-span-2 bg-surface-card rounded-xl border border-border-subtle p-6 hover:shadow-lg transition-shadow duration-300 hover:border-primary">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-title-lg text-title-lg text-on-surface">
                Nuevas Bases de Datos 2026
              </h2>
              <button
                onClick={() => onNavigate('directory')}
                className="text-primary font-label-md flex items-center gap-1 hover:underline cursor-pointer font-semibold"
              >
                Ver todas <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigate('directory')}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-border-subtle"
              >
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-sm text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">science</span>
                </div>
                <div>
                  <h3 className="font-label-md text-on-surface font-semibold">DynaMedex</h3>
                  <p className="font-caption text-secondary">Suscripción Institucional</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('directory')}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-border-subtle"
              >
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-sm text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">biotech</span>
                </div>
                <div>
                  <h3 className="font-label-md text-on-surface font-semibold">BioDigital</h3>
                  <p className="font-caption text-secondary">Anatomía 3D interactiva</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('directory')}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-border-subtle"
              >
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-sm text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">medical_information</span>
                </div>
                <div>
                  <h3 className="font-label-md text-on-surface font-semibold">ClinicalKey</h3>
                  <p className="font-caption text-secondary">Búsqueda clínica avanzada</p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('directory')}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-border-subtle"
              >
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-sm text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">menu_book</span>
                </div>
                <div>
                  <h3 className="font-label-md text-on-surface font-semibold">AccessMedicine</h3>
                  <p className="font-caption text-secondary">Textos médicos clave</p>
                </div>
              </div>
            </div>
          </div>

          {/* Próximas Actividades */}
          <div className="bg-surface-card rounded-xl border border-border-subtle p-6 hover:shadow-lg transition-shadow duration-300 hover:border-primary flex flex-col justify-between">
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface mb-2">
                Próximas Actividades
              </h2>
              <p className="font-caption text-caption text-secondary mb-6">
                Conferencias y capacitaciones ALFIN programadas.
              </p>

              <div className="space-y-4">
                <div 
                  onClick={() => onNavigate('conferences')}
                  className="flex gap-4 p-3 rounded-lg hover:bg-surface-container-lowest transition-colors border border-transparent hover:border-border-subtle cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center bg-primary-container text-white rounded-lg w-14 h-14 flex-shrink-0">
                    <span className="font-headline-md leading-none">15</span>
                    <span className="font-caption uppercase font-semibold">NOV</span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-on-surface font-semibold line-clamp-1">
                      Capacitación: Uso avanzado de ClinicalKey
                    </h3>
                    <p className="font-caption text-secondary flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> 10:00 AM - 12:00 PM
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => onNavigate('conferences')}
                  className="flex gap-4 p-3 rounded-lg hover:bg-surface-container-lowest transition-colors border border-transparent hover:border-border-subtle cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center bg-primary-container text-white rounded-lg w-14 h-14 flex-shrink-0">
                    <span className="font-headline-md leading-none">22</span>
                    <span className="font-caption uppercase font-semibold">NOV</span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-on-surface font-semibold line-clamp-1">
                      Taller: Búsqueda bibliográfica en Scopus
                    </h3>
                    <p className="font-caption text-secondary flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> 03:00 PM - 05:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('conferences')}
              className="w-full mt-6 py-2.5 border border-slate-700 text-slate-700 rounded-full font-label-md hover:bg-slate-50 transition-colors cursor-pointer font-semibold"
            >
              Ver Calendario Completo
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Section: Newsletter & Instagram */}
      <section className="max-w-[1280px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Newsletter Subscription */}
          <div className="lg:col-span-1 bg-surface-card rounded-xl border border-border-subtle p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h2 className="font-title-lg text-on-surface mb-2">
                Suscríbete al boletín de noticias
              </h2>
              <p className="font-caption text-secondary mb-6 leading-relaxed">
                Recibe las últimas actualizaciones y recursos médicos en tu correo institucional.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@urp.edu.pe"
                className="w-full px-4 py-2.5 rounded border border-border-subtle bg-white text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-sm"
              />
              <button
                type="submit"
                className="w-full bg-primary-container text-white py-2.5 rounded-full font-label-md hover:bg-primary transition-colors cursor-pointer font-semibold shadow-sm"
              >
                {subscribed ? '¡Suscrito con éxito!' : 'Suscribirme'}
              </button>
            </form>
          </div>

          {/* Follow us on Instagram */}
          <div className="lg:col-span-2 bg-surface-card rounded-xl border border-border-subtle p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-title-lg text-on-surface">
                  Síguenos en Instagram
                </h2>
                <p className="font-caption text-secondary font-medium">@famurp.biblioteca</p>
              </div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="bg-primary-container text-white px-6 py-2 rounded-full font-label-md hover:bg-primary transition-colors cursor-pointer font-semibold shadow-sm"
              >
                Seguir en Instagram
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low border border-border-subtle group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsn8AqQ7LQ9a7cpggMBvOo6uUtrDzH-RSxjVguqDpbMJ4HrbR9A-H1tjWOhVwFAkv25jpxu7FRHWcRdVDnJ1GfTbZRBWr_PHq4LnbgDAa95RG2AV2ezQfXz8SULwv-R4d3Gbi2B-8jFLyWcR5p3crJ9W-_QXBYdzRbW_wX5JSeLLCyDFa-MJm0Epzakv-ZBMnnXyLyc1pD5hP3gFleqHJ3gVeZkOZ0PRYN2N4w7CPxz92CiEwdDJU"
                  alt="Biblioteca Digital URP"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low border border-border-subtle group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoxyVJ9hVxn0zsPakl41qGZYZ3-sp9xMLeBPWGMBHsyurYWXN9At3vpLT2RjXTzre8Fpci-TZL4CWddottiT7jirnRFsqoJE7uJr13rgyTnYfCQDmxPg1JgW9xPo2tioK4-wAMUAXBOX072KwNH70TxRf1mRzxBUg5LQba0by2n-QiFKm4L_GuKRC5Vwqadv5bD76FZKg9Ob6UB4gLqrnBNfXIhHcxdCTN4PYOnJYX-7T7fvaCnUs"
                  alt="Talleres de investigación"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low border border-border-subtle group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAidUIRZ5AE2f3_TC91yGMET1xv7yiwGPDI56rUABykDP0yC6nE6aHSoR-2gFHBMjKMVlzfsYYq2CvhCxZ9QbYDIqcB5G2tievSZsp1djZ_nA_R0l-lUbmro5718TiyMehlOpVvmaJgfG4H2HMIxA3OyHU0rxbBpE2jhF3wFZVXHdhwDBRkUFpTOYD_GTNX20FemdOC5psYFmq7Ch-j5de0EzCLAMn-V4e20Lb9L76wSe-rNTB6YMY"
                  alt="Módulo de atención al usuario"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-low border border-border-subtle group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF4LTqwOPgPOC1XTyiv340j1CucejKPYS9ZE3vHvhU-AzFWFA8z8ck0ux2u0FlQK2lvvKFUSXiWwzD4QK0wdOglcnmeZBOcUonEUAcPTrzAXFDFdCPHdObHH_cKq5k_dYpmGL_mr7tvzWyRllUWM_XYSQiAOS0irqWGjxUn7G14p80moJFvBYNd7Au9HE0EBT4cUR-65jRBRloFPH3snHRLTDIYW8POsMvIeWIApyvi42lQl-KMKo"
                  alt="Colección médica física"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
