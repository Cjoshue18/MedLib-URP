import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Building2,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Send,
  GraduationCap,
} from 'lucide-react';
import { ConferenceSummary, TipoParticipante, TipoDocumento, RegisterParticipantRequest } from '../../types';
import { conferenceService } from '../../services/conferenceService';

import { ConferenceParticipantFormFields } from './ConferenceParticipantFormFields';
import { ConferenceRegistrationSuccessCard } from './ConferenceRegistrationSuccessCard';

interface ConferenceRegistrationViewProps {
  conference: ConferenceSummary;
  onBackToCalendar: () => void;
}

export const ConferenceRegistrationView: React.FC<ConferenceRegistrationViewProps> = ({
  conference,
  onBackToCalendar,
}) => {
  const [tipoParticipante, setTipoParticipante] = useState<TipoParticipante>('Estudiante');
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('CODIGO_URP');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [cicloAcademico, setCicloAcademico] = useState<number | null>(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (tipoParticipante === 'Estudiante') {
      setTipoDocumento('CODIGO_URP');
      if (cicloAcademico === null) setCicloAcademico(1);
    } else {
      setTipoDocumento('DNI');
      setCicloAcademico(null);
    }
    setNumeroDocumento('');
    setErrorMessage(null);
  }, [tipoParticipante]);

  useEffect(() => {
    setNumeroDocumento('');
    setErrorMessage(null);
  }, [tipoDocumento]);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (tipoDocumento === 'DNI') {
      const clean = val.replace(/\D/g, '').slice(0, 8);
      setNumeroDocumento(clean);
    } else if (tipoDocumento === 'CODIGO_URP') {
      const clean = val.replace(/\D/g, '').slice(0, 9);
      setNumeroDocumento(clean);
    } else {
      const clean = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 9);
      setNumeroDocumento(clean);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (tipoDocumento === 'DNI' && numeroDocumento.length !== 8) {
      setErrorMessage('El DNI debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    if (tipoDocumento === 'CODIGO_URP' && numeroDocumento.length !== 9) {
      setErrorMessage('El código de estudiante URP debe tener exactamente 9 dígitos numéricos.');
      return;
    }

    if (tipoDocumento === 'CE' && numeroDocumento.length !== 9) {
      setErrorMessage('El Carné de Extranjería (CE) debe contener exactamente 9 caracteres.');
      return;
    }

    if (!nombres.trim() || !apellidos.trim()) {
      setErrorMessage('Debe ingresar sus nombres y apellidos completos.');
      return;
    }

    if (!correo.trim() || !correo.includes('@')) {
      setErrorMessage('Debe ingresar un correo electrónico institucional o de contacto válido.');
      return;
    }

    if (tipoParticipante === 'Estudiante' && (!cicloAcademico || cicloAcademico < 1 || cicloAcademico > 14)) {
      setErrorMessage('Por favor seleccione un ciclo académico válido (1 al 14).');
      return;
    }

    const payload: RegisterParticipantRequest = {
      tipoParticipante,
      tipoDocumento,
      numeroDocumento,
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correo: correo.trim().toLowerCase(),
      cicloAcademico: tipoParticipante === 'Estudiante' ? cicloAcademico : null,
    };

    setIsSubmitting(true);
    try {
      await conferenceService.registerParticipant(conference.idConferencia, payload);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado al procesar la pre-inscripción.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const registrationLink = `${window.location.origin}${window.location.pathname}#conferencias?inscripcion=${conference.idConferencia}`;

  const handleCopyRegistrationLink = () => {
    navigator.clipboard.writeText(registrationLink).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const startDate = new Date(conference.fechaHoraInicio);
  const endDate = new Date(conference.fechaHoraFin);

  if (isSuccess) {
    return (
      <ConferenceRegistrationSuccessCard
        conference={conference}
        nombres={nombres}
        apellidos={apellidos}
        tipoDocumento={tipoDocumento}
        numeroDocumento={numeroDocumento}
        tipoParticipante={tipoParticipante}
        correo={correo}
        cicloAcademico={cicloAcademico}
        registrationLink={registrationLink}
        copiedLink={copiedLink}
        onCopyRegistrationLink={handleCopyRegistrationLink}
        onBackToCalendar={onBackToCalendar}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      <button
        type="button"
        onClick={onBackToCalendar}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#008744] px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Calendario de Conferencias</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-[#008744] text-white px-6 sm:px-8 py-6 border-b border-emerald-700 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-wider uppercase text-emerald-100 block">
                Formulario Oficial ALFIN &bull; FAMURP
              </span>
              <h1 className="text-xl sm:text-2xl font-display font-black leading-tight text-white">
                Pre-inscripción a Capacitación Médica
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white">
                {conference.modalidad}
              </span>
              {conference.asistenciaAbierta && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white animate-pulse">
                  Asistencia en Vivo Habilitada
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-display font-extrabold text-slate-900">
              {conference.tituloEvento}
            </h2>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#008744]" />
                Ponente: <strong>{conference.expositorPonente}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#008744]" />
                {conference.entidadEditorial}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#008744]" />
                {startDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#008744]" />
                {startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-tight font-semibold">{errorMessage}</span>
              </div>
            )}

            <ConferenceParticipantFormFields
              tipoParticipante={tipoParticipante}
              setTipoParticipante={setTipoParticipante}
              tipoDocumento={tipoDocumento}
              setTipoDocumento={setTipoDocumento}
              numeroDocumento={numeroDocumento}
              onDocumentChange={handleDocumentChange}
              nombres={nombres}
              setNombres={setNombres}
              apellidos={apellidos}
              setApellidos={setApellidos}
              correo={correo}
              setCorreo={setCorreo}
              cicloAcademico={cicloAcademico}
              setCicloAcademico={setCicloAcademico}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#008744] hover:bg-[#006b35] text-white font-display font-black text-sm shadow-urp-brutal-green tactile-btn-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registrando Pre-inscripción...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirmar Pre-inscripción Oficial</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
