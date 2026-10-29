import React from 'react';
import { Home, BookOpen } from 'lucide-react';
import type { AppView } from '../core/types/navigation';

interface NotFoundPageProps {
  onNavigate: (view: AppView, query?: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-[calc(100vh-16rem)] flex items-center justify-center px-6 py-16 sm:py-24">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-12 text-center flex flex-col items-center">
        <div className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-[#0F172A] mb-4 select-none leading-none">
          ERROR <span className="text-[#008744]">404</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#0F172A] tracking-tight mb-4">
          Página o <span className="font-lora italic font-normal text-[#008744]">Expediente</span> No Encontrado
        </h1>

        <p className="font-sans text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
          La dirección web ingresada no coincide con ningún catálogo, recurso bibliográfico o sección activa del portal de la Facultad de Medicina Humana (URP). Es posible que el recurso haya sido reubicado o que el enlace sea incorrecto.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto bg-[#00A859] hover:bg-[#008744] text-white tactile-btn-green flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-sans font-semibold cursor-pointer select-none transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('directory')}
            className="w-full sm:w-auto bg-white hover:border-[#008744] hover:text-[#008744] border-2 border-slate-200 text-slate-800 tactile-btn flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-sans font-semibold cursor-pointer select-none transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span>Explorar Bases de Datos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
