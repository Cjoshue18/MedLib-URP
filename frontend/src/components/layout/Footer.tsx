import React from 'react';
import { ExternalLink } from 'lucide-react';
import { INSTITUTIONAL_LINKS } from '../../constants/institutionalLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full text-white border-t-4 border-[#008744] bg-[#0F172A] mt-auto">
      <div className="px-6 max-w-[1280px] mx-auto py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="font-display text-xl sm:text-2xl text-white font-extrabold block">
                BVE-FAMURP
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
                  <svg
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
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

      <div className="border-t border-slate-800/80 bg-[#020617] py-5">
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
