import React from 'react';
import { ExternalLink, Clock, MapPin, Phone } from 'lucide-react';
import { INSTITUTIONAL_LINKS } from '../../constants/institutionalLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full text-white border-t-4 border-[#008744] bg-[#222222] mt-auto">
      <div className="px-6 max-w-[1280px] mx-auto pt-12 pb-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-2">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#008744]/20 flex items-center justify-center text-[#8cf9a9] shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Horario de Atención
              </h4>
              <p className="text-sm font-semibold text-slate-100">
                Lunes a Viernes: 08:00 - 21:00
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Sábados: 08:00 - 15:00
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#008744]/20 flex items-center justify-center text-[#8cf9a9] shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Ubicación
              </h4>
              <p className="text-sm font-semibold text-slate-100">
                Campus URP - Facultad de Medicina
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Piso 4, Ala Sur
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#008744]/20 flex items-center justify-center text-[#8cf9a9] shrink-0 mt-0.5">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Contacto Directo
              </h4>
              <p className="text-sm font-semibold text-slate-100">
                biblioteca.famurp@urp.edu.pe
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Tel: +51 1 708-0000 Anexo 212
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="font-display text-xl sm:text-2xl text-white font-extrabold block">
                MedLib URP
              </span>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
                Biblioteca Virtual y Especializada de la Facultad de Medicina Humana - Universidad Ricardo Palma.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Síguenos en:
              </span>
              <div className="flex items-center gap-4">
                <a
                  href={INSTITUTIONAL_LINKS.facebookFamurp}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Oficial Facultad de Medicina Humana URP"
                  aria-label="Facebook Oficial FAMURP"
                  className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all transform hover:scale-105 cursor-pointer"
                >
                  <svg className="w-5 h-5 drop-shadow-md transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="#1877F2" />
                    <path
                      fill="#FFFFFF"
                      d="M14.5 12h-2v7h-3v-7h-1.5v-2.5H9.5V8c0-1.8 1-2.8 2.8-2.8h2.2v2.5h-1.4c-.9 0-1.1.4-1.1 1.1v.7h2.5L14.5 12z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-[#8cf9a9] transition-colors">
                    Facebook
                  </span>
                </a>

                <a
                  href={INSTITUTIONAL_LINKS.instagramBibFamurp}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram Oficial @bib_famurp"
                  aria-label="Instagram Oficial Biblioteca FMH URP"
                  className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all transform hover:scale-105 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-[#8cf9a9] transition-colors">
                    Instagram
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <a
              href="https://www.urp.edu.pe/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white text-xs sm:text-sm font-bold tactile-btn-green transition-all cursor-pointer"
            >
              <span>Portal Principal URP (urp.edu.pe)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 bg-[#0F172A] py-5">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Universidad Ricardo Palma. Todos los derechos reservados.</p>
          <p className="text-slate-400">
            Portal de Recursos Médicos &bull; FAMURP
          </p>
        </div>
      </div>
    </footer>
  );
};
