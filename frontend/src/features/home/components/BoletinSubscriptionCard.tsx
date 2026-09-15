import React, { useState } from 'react';
import { Send, ShieldCheck, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { newsletterService } from '../services/newsletterService';

export interface BoletinSubscriptionCardProps {
  variant?: 'home' | 'conferences';
  onNavigateToDirectory?: () => void;
  className?: string;
}

const LEVEL_MAP: Record<'pregrado' | 'posgrado' | 'residentado', string> = {
  pregrado: 'Pregrado',
  posgrado: 'Posgrado',
  residentado: 'Residentado',
};

export const BoletinSubscriptionCard: React.FC<BoletinSubscriptionCardProps> = ({
  variant = 'home',
  onNavigateToDirectory,
  className = '',
}) => {
  const [admissionsTab, setAdmissionsTab] = useState<'pregrado' | 'posgrado' | 'residentado'>('pregrado');
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
      const response = await newsletterService.subscribe(cleanEmail, LEVEL_MAP[admissionsTab]);
      setFeedback({
        type: 'success',
        message: response.message,
      });
      setEmail('');
      setTimeout(() => {
        setFeedback(null);
      }, 5000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error al procesar la suscripción.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConferences = variant === 'conferences';

  const formSection = (
    <div className={isConferences ? 'space-y-4' : 'p-5 text-slate-900 space-y-4'}>
      <div>
        <span className="text-xs font-bold text-slate-700 block mb-1.5">
          {isConferences ? 'Modalidad académica:' : 'Selecciona tu nivel académico:'}
        </span>
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
          <button
            type="button"
            onClick={() => setAdmissionsTab('pregrado')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              admissionsTab === 'pregrado'
                ? 'bg-[#008744] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pregrado
          </button>
          <button
            type="button"
            onClick={() => setAdmissionsTab('posgrado')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              admissionsTab === 'posgrado'
                ? 'bg-[#008744] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Posgrado
          </button>
          <button
            type="button"
            onClick={() => setAdmissionsTab('residentado')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              admissionsTab === 'residentado'
                ? 'bg-[#008744] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Residentado
          </button>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-3 pt-0.5">
        <div>
          <label
            htmlFor={isConferences ? 'newsletter-email-conferences' : 'newsletter-email-home'}
            className="text-xs font-bold text-slate-700 block mb-1"
          >
            {isConferences ? 'Correo institucional:' : 'Recibe alertas bibliográficas y novedades:'}
          </label>
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
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008744] disabled:opacity-60"
          />
        </div>

        {feedback?.type === 'error' && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{feedback.message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl bg-[#008744] hover:bg-[#006b35] disabled:opacity-70 text-white font-bold text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer flex items-center justify-center gap-2"
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
              <span>Registrarme al Boletín</span>
            </>
          )}
        </button>
      </form>

      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <ShieldCheck className="w-4 h-4 text-[#008744] shrink-0 mt-0.5" />
        <span className="text-slate-600 leading-snug">
          {isConferences
            ? 'Notificaciones exclusivas de horas ALFIN para acreditación médica SUNEDU.'
            : 'Acceso con cuenta institucional a literatura científica y soporte clínico.'}
        </span>
      </div>

      {!isConferences && onNavigateToDirectory && (
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onNavigateToDirectory}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Explorar Catálogo de Bases de Datos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {!isConferences && (
        <p className="text-[10px] text-center text-slate-400">
          (*) Servicios médicos exclusivos para la comunidad médica URP
        </p>
      )}
    </div>
  );

  if (isConferences) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs p-6 ${className}`.trim()}>
        <div className="border-b border-slate-200 pb-3 mb-4">
          <span className="text-[10px] font-bold text-[#008744] uppercase tracking-wider block">
            COMUNIDAD FAMURP
          </span>
          <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900">
            Suscríbete al Boletín
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Recibe notificaciones sobre nuevas capacitaciones y recursos bibliográficos.
          </p>
        </div>
        {formSection}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden ${className}`.trim()}>
      <div className="bg-gradient-to-r from-[#00572B] via-[#008744] to-[#00A859] p-5 text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8cf9a9] block mb-0.5">
            FACULTAD DE MEDICINA HUMANA
          </span>
          <h2 className="text-lg sm:text-xl font-display font-black leading-tight">
            ¡ACCESO DIRECTO <br />AL CONOCIMIENTO!
          </h2>
        </div>
        <div className="text-right flex flex-col items-center bg-black/20 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-white/20 shrink-0">
          <span className="text-2xl font-black leading-none text-white">{new Date().getFullYear() - 1969}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#8cf9a9]">Años URP</span>
        </div>
      </div>
      {formSection}
    </div>
  );
};
