import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Radio,
  Send,
  User,
  Calendar,
  Clock,
  Building2,
} from 'lucide-react';
import { ConferenceSummary, TipoParticipante, TipoDocumento, MarkAttendanceRequest } from '../../types';
import { conferenceService } from '../../services/conferenceService';
import { ConferenceParticipantFormFields } from './ConferenceParticipantFormFields';
import { AttendanceLiveSuccessCard } from './AttendanceLiveSuccessCard';

interface AttendanceLiveViewProps {
  conference: ConferenceSummary;
  onBackToCalendar: () => void;
}

export const AttendanceLiveView: React.FC<AttendanceLiveViewProps> = ({
  conference,
  onBackToCalendar,
}) => {
  const [tipoParticipante, setTipoParticipante] = useState<TipoParticipante>('Pregrado');
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('CODIGO_URP');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [cicloAcademico, setCicloAcademico] = useState<number | null>(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timestampRegistrado, setTimestampRegistrado] = useState<string | null>(null);

  useEffect(() => {
    if (tipoParticipante === 'Pregrado' || tipoParticipante === 'Estudiante') {
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

    if (!conference.asistenciaAbierta) {
      setErrorMessage('La marcación de asistencia para este evento está cerrada por la administración.');
      return;
    }

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

    const isPregrado = tipoParticipante === 'Pregrado' || tipoParticipante === 'Estudiante';

    if (isPregrado && (!cicloAcademico || cicloAcademico < 1 || cicloAcademico > 14)) {
      setErrorMessage('Por favor seleccione un ciclo académico válido (1 al 14).');
      return;
    }

    const payload: MarkAttendanceRequest = {
      tipoParticipante,
      tipoDocumento,
      numeroDocumento,
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correo: correo.trim().toLowerCase(),
      cicloAcademico: isPregrado ? cicloAcademico : null,
    };

    setIsSubmitting(true);
    try {
      await conferenceService.markAttendance(conference.idConferencia, payload);
      setIsSuccess(true);
      setTimestampRegistrado(
        new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado al registrar la asistencia.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const startDate = new Date(conference.fechaHoraInicio);
  const endDate = new Date(conference.fechaHoraFin);

  if (!conference.asistenciaAbierta) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
        <button
          type="button"
          onClick={onBackToCalendar}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#008744] px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Calendario</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <Radio className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900">
            Marcación de Asistencia Cerrada
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            El control de asistencia en tiempo real para la conferencia <strong>"{conference.tituloEvento}"</strong> no está habilitado actualmente.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onBackToCalendar}
              className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-urp-brutal-sm tactile-btn cursor-pointer"
            >
              Regresar al Calendario
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <AttendanceLiveSuccessCard
        conference={conference}
        nombres={nombres}
        apellidos={apellidos}
        tipoDocumento={tipoDocumento}
        numeroDocumento={numeroDocumento}
        tipoParticipante={tipoParticipante}
        correo={correo}
        cicloAcademico={cicloAcademico}
        timestampRegistrado={timestampRegistrado}
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
        <div className="bg-slate-900 text-white px-6 sm:px-8 py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-wider uppercase text-emerald-400 block">
                Sesión en Vivo &bull; Sala Virtual URP
              </span>
              <h1 className="text-xl sm:text-2xl font-display font-black leading-tight text-white">
                Marcación de Asistencia en Tiempo Real
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white animate-pulse">
                Asistencia Abierta
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white">
                {conference.modalidad}
              </span>
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
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-sm shadow-urp-brutal-green tactile-btn-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validando Asistencia...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Marcar Asistencia Oficial Ahora</span>
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
