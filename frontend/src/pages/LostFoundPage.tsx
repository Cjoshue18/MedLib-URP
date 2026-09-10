import React from 'react';

export const LostFoundPage: React.FC = () => {
  return (
    <main className="flex-grow w-full px-6 max-w-[1280px] mx-auto py-10">
      <div className="mb-8 border-b border-border-subtle pb-4">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-text-slate flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '32px' }}>
            account_balance
          </span>
          COMUNIDAD Y SERVICIOS DE BIBLIOTECA FAMURP
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="font-title-lg text-title-lg text-text-slate flex items-center gap-2">
              <span>📦</span> OBJETOS PERDIDOS EN SALA
            </h2>
            <p className="font-body-md text-secondary mt-1">
              Pertenencias bajo custodia en mostrador
            </p>
          </div>

          <div className="bg-surface-card border border-border-subtle rounded-xl p-6 hover:border-primary-container hover:shadow-lg transition-all duration-200 flex flex-col gap-4">
            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="w-full sm:w-1/3 aspect-square bg-surface-container-low rounded-lg flex items-center justify-center overflow-hidden border border-border-subtle flex-shrink-0">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVy8k5krBimW03Z7yv_lJAstUZ40bSmjN4c-aN9j_5VPG6735hD7gcrO3fAQtururStUswR4oNLoM7eI7U5vDRLt4-fdvP3IEc-iPN7_h5yToqfBFr1sGkAWZqz7P0NUZaSJ2H3Ut2AhYarRb-_Hvoo7_y3u_y2wcnNSP33wa0XyV4Q51MJatWruVooDFUXZJRLWrszWfDQvOUVevdVEdrUMBvJLgImhhrdm8zq_yAdgvkosswZyA" 
                  alt="Estuche de disección negro" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2">
                <h3 className="font-label-md text-text-slate text-xl font-bold">
                  Estuche de disección negro
                </h3>
                <ul className="flex flex-col gap-2 mt-2">
                  <li className="flex items-center gap-2 font-body-md text-secondary text-sm">
                    <span className="material-symbols-outlined text-primary-container text-lg">location_on</span>
                    Mesa 4 - Sala de Lectura Libros
                  </li>
                  <li className="flex items-center gap-2 font-body-md text-secondary text-sm">
                    <span className="material-symbols-outlined text-primary-container text-lg">calendar_month</span>
                    Hallado: 20 de Agosto
                  </li>
                  <li className="flex items-center gap-2 font-label-md text-text-slate text-sm font-semibold mt-1">
                    <span className="material-symbols-outlined text-[#0284c7] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
                    Estado: En Custodia (Reclamar)
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[#0284c7]/10 text-[#0284c7] rounded-lg p-3.5 flex items-center gap-2 border border-[#0284c7]/20">
              <span className="material-symbols-outlined text-lg">info</span>
              <span className="font-caption text-sm font-medium">Reclámalo en recepción con tu carné.</span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="font-title-lg text-title-lg text-text-slate flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
              SÍGUENOS EN INSTAGRAM (@famurp.biblioteca)
            </h2>
            <p className="font-body-md text-secondary mt-1">
              Novedades, tips de búsqueda y eventos
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <a 
              className="group block relative aspect-square bg-surface-container-low rounded-lg overflow-hidden border border-border-subtle hover:border-primary-container transition-colors" 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFZtyMAFbJzZAKcaoAJtauXVMRKojLKsmHfQ83SsTLUHAuUJVa3EToToempkBO8H-ulaUc88vSvVv_3dUSwVGebgP4CvQKgR7OLCf6UEfgiJphT2nvFNv4s5Wr8qaUMUh6uSta1_HffoFP4ODGCxMr4BxxxhRZ7EjGwgSmjSvKxozSp_EGMEbtGBS4M-pub7c2t_hSTALF25q_vHlt7kO3zApeGmErjDkpDyTsZsYPZMhxu67tqJc" 
                alt="Tips PubMed" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                <span className="text-white font-label-md text-sm font-semibold drop-shadow-md">Tips PubMed</span>
              </div>
            </a>

            <a 
              className="group block relative aspect-square bg-surface-container-low rounded-lg overflow-hidden border border-border-subtle hover:border-primary-container transition-colors" 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5hUXxyb5mta11r1OYcNfZZL38qbptAE2T482UJC7Oi2GiNgFN8_jUyWf24xWjsRLpRQdG399aPQGqxKqgyYGPq5HNVXsWpyImqT_HkIqBnbBwhAD7ieE7yAKco-qQgy17ULTRlBFcxXvrqySpJP-rXxtOtQbs-_4_iKNg0s5a8lMckVKLMNXk91M_l-U23v3ZtDuSHYF3VezqZZsB9_UoGxUGVUhSKZH9Nk5Nxp3tKH5Mch44NnY" 
                alt="Taller ALFIN" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                <span className="text-white font-label-md text-sm font-semibold drop-shadow-md">Taller ALFIN</span>
              </div>
            </a>

            <a 
              className="group block relative aspect-square bg-surface-container-low rounded-lg overflow-hidden border border-border-subtle hover:border-primary-container transition-colors hidden sm:block" 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkA0_SVovJirv9tp8jpWtv9KoDpd8x5aWBqvLGscC-IA4oTGGgSPmqbVC5xzlX8FJ7x6UhvlaHLZiTOrSibyfdSbEY_bOYabh8lBgK0p60HkYLOybJTtH2yJWRAHh-pD4cmhE3GPaJDr-t8UfFr31vLFOVzMrvccnQPvX9bPjGO7ZoIIfbbR-Uaqk0ZXo0Y4OQ8VijczwoqOlgvXFTxsOH5O7u7DU_9Z_1IUzX45zp8zKsYzEBgh8" 
                alt="Estudiantes en biblioteca" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

          <div className="mt-2 flex justify-start">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="bg-primary-container text-white px-6 py-3 rounded-lg font-label-md hover:bg-surface-tint transition-colors flex items-center gap-2 h-[44px] font-semibold shadow-sm"
            >
              Seguir en Instagram
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};
