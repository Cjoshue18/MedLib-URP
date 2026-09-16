import React from 'react';
import { Users, BookOpen, GraduationCap, Stethoscope, Award } from 'lucide-react';
import { NewsletterStats, SubscriberItem } from '../services/newsletterService';

interface AdminNewsletterStatsProps {
  stats: NewsletterStats | null;
  subscribers: SubscriberItem[];
}

export const AdminNewsletterStats: React.FC<AdminNewsletterStatsProps> = ({ stats, subscribers }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
          <Users className="w-4 h-4 text-[#008744]" />
        </div>
        <p className="text-2xl font-display font-black text-slate-900 mt-2">
          {stats ? stats.totalSuscriptores : subscribers.length}
        </p>
        <span className="text-[10px] text-slate-400 font-medium">Correos activos</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Pregrado</span>
          <BookOpen className="w-4 h-4 text-emerald-600" />
        </div>
        <p className="text-2xl font-display font-black text-emerald-800 mt-2">
          {stats ? stats.pregrado : subscribers.filter((s) => s.nivelAcademico === 'Pregrado').length}
        </p>
        <span className="text-[10px] text-slate-400 font-medium">Estudiantes pregrado</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Posgrado</span>
          <GraduationCap className="w-4 h-4 text-blue-600" />
        </div>
        <p className="text-2xl font-display font-black text-blue-800 mt-2">
          {stats ? stats.posgrado : subscribers.filter((s) => s.nivelAcademico === 'Posgrado').length}
        </p>
        <span className="text-[10px] text-slate-400 font-medium">Maestrías/Doctorados</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Residentado</span>
          <Stethoscope className="w-4 h-4 text-amber-600" />
        </div>
        <p className="text-2xl font-display font-black text-amber-800 mt-2">
          {stats ? stats.residentado : subscribers.filter((s) => s.nivelAcademico === 'Residentado').length}
        </p>
        <span className="text-[10px] text-slate-400 font-medium">Especialidades</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Docentes</span>
          <Award className="w-4 h-4 text-purple-600" />
        </div>
        <p className="text-2xl font-display font-black text-purple-800 mt-2">
          {stats ? stats.docente : subscribers.filter((s) => s.nivelAcademico === 'Docente').length}
        </p>
        <span className="text-[10px] text-slate-400 font-medium">Cuerpo docente</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Otros</span>
          <Users className="w-4 h-4 text-slate-500" />
        </div>
        <p className="text-2xl font-display font-black text-slate-800 mt-2">
          {stats ? stats.otro : subscribers.filter((s) => s.nivelAcademico === 'Otro').length}
        </p>
        <span className="text-[10px] text-slate-400 font-medium">Otros estamentos</span>
      </div>
    </div>
  );
};
