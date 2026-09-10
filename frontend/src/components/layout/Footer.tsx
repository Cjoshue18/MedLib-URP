import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f172a] w-full py-12 mt-auto">
      <div className="px-6 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <span className="font-headline-md text-headline-md text-white font-bold block mb-3">
            MedLib-URP
          </span>
          <p className="font-caption text-slate-400 max-w-sm leading-relaxed">
            © 2026 Universidad Ricardo Palma - Facultad de Medicina Humana. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <a 
            className="font-body-md text-slate-400 hover:text-white transition-colors text-sm" 
            href="https://www.sunedu.gob.pe" 
            target="_blank" 
            rel="noreferrer"
          >
            SUNEDU Accreditation
          </a>
          <a 
            className="font-body-md text-slate-400 hover:text-white transition-colors text-sm" 
            href="https://www.cinda.cl" 
            target="_blank" 
            rel="noreferrer"
          >
            IAC-CINDA
          </a>
          <a 
            className="font-body-md text-slate-400 hover:text-white transition-colors text-sm" 
            href="#"
            onClick={(e) => { e.preventDefault(); alert("MedLib URP cumple estrictamente con la Ley N° 29733 (Protección de Datos Personales del Perú)."); }}
          >
            Privacy Policy
          </a>
          <a 
            className="font-body-md text-slate-400 hover:text-white transition-colors text-sm" 
            href="mailto:biblioteca.medicina@urp.edu.pe"
          >
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};
