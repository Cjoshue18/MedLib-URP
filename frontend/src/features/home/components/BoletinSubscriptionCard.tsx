import React, { useState } from 'react';
import {
  GraduationCap,
  ChevronDown,
  AtSign,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { newsletterService } from '../services/newsletterService';

export interface BoletinSubscriptionCardProps {
  variant?: 'home' | 'conferences';
  onNavigateToDirectory?: () => void;
  className?: string;
}

export type NivelBoletin = 'pregrado' | 'posgrado' | 'residentado' | 'docente' | 'otro';

const LEVEL_MAP: Record<NivelBoletin, string> = {
  pregrado: 'Pregrado',
  posgrado: 'Posgrado',
  residentado: 'Residentado',
  docente: 'Docente',
  otro: 'Otro',
};

export const BoletinSubscriptionCard: React.FC<BoletinSubscriptionCardProps> = ({
  variant = 'home',
  onNavigateToDirectory,
  className = '',
}) => {
  const [academicLevel, setAcademicLevel] = useState<NivelBoletin>('pregrado');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await newsletterService.subscribe(cleanEmail, LEVEL_MAP[academicLevel]);
      setFeedback({
        type: 'success',
        message: response.message,
      });
      setEmail('');
      setTimeout(() => {
        setFeedback(null);
      }, 5000);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error al procesar la suscripción.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConferences = variant === 'conferences';

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`.trim()}
    >
      <div className="bg-[#008744] p-5 sm:p-6 pb-7 text-white">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight leading-tight">
          {isConferences ? '¡Boletín de Conferencias Médicas!' : '¡Acceso Directo al Conocimiento Médico!'}
        </h2>
        <p className="text-xs text-white/90 mt-2 leading-relaxed">
          {isConferences
            ? 'Alertas sobre ponencias científicas, capacitaciones clínicas y talleres organizados por la FAMURP.'
            : 'Bases de datos, conferencias, literatura científica para toda la facultad médica.'}
        </p>
      </div>

      <div className="-mt-3.5 relative z-10 bg-white rounded-t-2xl p-4 sm:p-5 space-y-4 text-slate-900">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label
              htmlFor={isConferences ? 'academic-level-conferences' : 'academic-level-home'}
              className="flex items-center gap-1.5 font-bold text-slate-800 uppercase tracking-wider text-[11px]"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#008744]" />
              <span>Nivel Académico</span>
            </label>
            <span className="text-[11px] font-medium text-slate-400">Requerido</span>
          </div>
          <div className="relative">
            <select
              id={isConferences ? 'academic-level-conferences' : 'academic-level-home'}
              value={academicLevel}
              onChange={(e) => setAcademicLevel(e.target.value as NivelBoletin)}
              disabled={isSubmitting}
              className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744] focus:bg-white focus:border-transparent transition-all cursor-pointer disabled:opacity-60"
            >
              <option value="pregrado">Pregrado</option>
              <option value="posgrado">Posgrado</option>
              <option value="residentado">Residentado</option>
              <option value="docente">Docente</option>
              <option value="otro">Otro</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor={isConferences ? 'newsletter-email-conferences' : 'newsletter-email-home'}
              className="block text-[10px] sm:text-[10.5px] font-bold text-slate-800 uppercase tracking-tight mb-1.5 whitespace-nowrap"
            >
              {isConferences ? 'Correo Institucional URP' : 'Recibe correos con novedades, conferencias y más'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <AtSign className="w-4 h-4" />
              </span>
              <input
                id={isConferences ? 'newsletter-email-conferences' : 'newsletter-email-home'}
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (feedback?.type === 'error') setFeedback(null);
                }}
                placeholder="tu.correo@urp.edu.pe"
                required
                disabled={isSubmitting}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744] focus:bg-white focus:border-transparent transition-all disabled:opacity-60"
              />
            </div>
            <div className="flex items-start gap-1.5 mt-1.5 text-[11px] text-slate-500 font-medium leading-snug">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#008744] shrink-0 mt-0.5" />
              <span>Dominio institucional URP para activación de licencias y alertas.</span>
            </div>
          </div>

          {feedback?.type === 'error' && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span className="leading-snug">{feedback.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-lg bg-[#008744] hover:bg-[#006b35] disabled:opacity-70 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registrando...</span>
              </>
            ) : feedback?.type === 'success' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{feedback.message}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Registrarme al Boletín y Biblioteca</span>
              </>
            )}
          </button>
        </form>

        <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/90 text-[#008744] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-[#008744]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900 block">
              Acceso institucional validado
            </span>
            <p className="text-[11px] text-slate-600 leading-snug">
              {isConferences
                ? 'Notificaciones exclusivas de conferencias y capacitaciones médicas.'
                : 'Acceso con cuenta institucional a literatura científica y soporte clínico.'}
            </p>
          </div>
        </div>

        {!isConferences && onNavigateToDirectory && (
          <button
            type="button"
            onClick={onNavigateToDirectory}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <span>Explorar Catálogo de Bases de Datos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
