import React from 'react';
import { ExternalLink, Clock, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#12161a] text-white w-full border-t-2 border-slate-800 pt-12 pb-8 mt-auto">
      <div className="px-6 max-w-[1280px] mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-2 border-b border-slate-800/90 pb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#008744]/15 border border-[#008744]/30 flex items-center justify-center text-[#8cf9a9] shrink-0 mt-0.5">
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
            <div className="w-10 h-10 rounded-full bg-[#008744]/15 border border-[#008744]/30 flex items-center justify-center text-[#8cf9a9] shrink-0 mt-0.5">
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
            <div className="w-10 h-10 rounded-full bg-[#008744]/15 border border-[#008744]/30 flex items-center justify-center text-[#8cf9a9] shrink-0 mt-0.5">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Contacto Directo
              </h4>
              <p className="text-sm font-semibold text-slate-100">
                fvalero@urp.edu.pe
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Tel: +51 1 708-0000 Anexo 212
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-1.5">
            <span className="font-display text-xl sm:text-2xl text-white font-extrabold block">
              MedLib URP
            </span>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Biblioteca Virtual y Especializada de la Facultad de Medicina Humana — Universidad Ricardo Palma.
            </p>
          </div>

          <div>
            <a
              href="https://www.urp.edu.pe/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white text-xs sm:text-sm font-bold shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer"
            >
              <span>Portal Principal URP (urp.edu.pe)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Universidad Ricardo Palma. Todos los derechos reservados.</p>
          <p className="text-slate-500">
            Portal de Recursos Médicos
          </p>
        </div>
      </div>
    </footer>
  );
};
