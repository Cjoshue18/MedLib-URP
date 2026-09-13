import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Radio, 
  Send, 
  User, 
  Calendar, 
  Clock, 
  Building2, 
  Video, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { ConferenceSummary, TipoParticipante, TipoDocumento, MarkAttendanceRequest } from '../types';
import { conferenceService } from '../services/conferenceService';

interface AttendanceLiveViewProps {
  conference: ConferenceSummary;
  onBackToCalendar: () => void;
}

export const AttendanceLiveView: React.FC<AttendanceLiveViewProps> = ({
  conference,
  onBackToCalendar
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
  const [timestampRegistrado, setTimestampRegistrado] = useState<string | null>(null);

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

    if (tipoParticipante === 'Estudiante' && (!cicloAcademico || cicloAcademico < 1 || cicloAcademico > 14)) {
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
      cicloAcademico: tipoParticipante === 'Estudiante' ? cicloAcademico : null
    };

    setIsSubmitting(true);
    try {
      await conferenceService.markAttendance(conference.idConferencia, payload);
      setIsSuccess(true);
      setTimestampRegistrado(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
          <span>Volver al Calendario de Conferencias</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-display font-black text-slate-900">
              Marcación de Asistencia Cerrada
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
              La asistencia para la conferencia <strong>"{conference.tituloEvento}"</strong> no se encuentra habilitada en este momento. La administración abrirá la lista durante el transcurso de la sesión.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={onBackToCalendar}
              className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Volver al Calendario
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-white p-8 text-center border-b border-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 border-2 border-emerald-400 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
              Asistencia Registrada &bull; BVE-FAMURP
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black leading-tight text-white">
              ¡Asistencia Marcada con Éxito!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
              Tu participación en la capacitación en vivo ha sido validada y registrada con marca temporal en el sistema de acreditación académica.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Actividad Académica
              </h2>
              <p className="text-base font-display font-black text-slate-900">
                {conference.tituloEvento}
              </p>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-600 pt-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#008744]" />
                  {conference.expositorPonente}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#008744]" />
                  {conference.entidadEditorial}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#008744]" />
                  Hora de marcación: <strong>{timestampRegistrado}</strong>
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                Constancia de Marcación en Vivo
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                <p><strong>Participante:</strong> {nombres} {apellidos}</p>
                <p><strong>{tipoDocumento}:</strong> {numeroDocumento}</p>
                <p><strong>Rol / Estamento:</strong> {tipoParticipante}</p>
                <p><strong>Correo:</strong> {correo}</p>
                {cicloAcademico && <p><strong>Ciclo Académico:</strong> {cicloAcademico}° Ciclo</p>}
                <p><strong>Estado:</strong> <span className="text-emerald-700 font-bold">Presente (En Sesión)</span></p>
              </div>
            </div>

            {conference.enlaceVirtual && (
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-blue-900">
                    Transmisión en Vivo (Microsoft Teams)
                  </h3>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Puedes regresar a la sala de videoconferencia para continuar la capacitación.
                  </p>
                </div>
                <a
                  href={conference.enlaceVirtual}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Volver a la Sala Teams</span>
                </a>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBackToCalendar}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#008744] hover:bg-[#006b35] text-white font-display font-black text-sm shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Ver Calendario de Conferencias</span>
              </button>
            </div>
          </div>
        </div>
      </div>
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
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  Marcación en Vivo &bull; Microsoft Teams / Presencial
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-black leading-tight text-white">
                Registro de Asistencia a Conferencia
              </h1>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white animate-pulse">
                Asistencia Habilitada
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-white">
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
                {conference.modalidad === 'Virtual' ? (
                  <Video className="w-3.5 h-3.5 text-[#008744]" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#008744]" />
                )}
                {conference.modalidad}
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

            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-2">
                Tipo de Participante:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Estudiante', 'Docente', 'Residentado', 'Otro'] as TipoParticipante[]).map((rol) => (
                  <button
                    key={rol}
                    type="button"
                    onClick={() => setTipoParticipante(rol)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      tipoParticipante === rol
                        ? 'bg-[#008744] text-white border-slate-900 shadow-urp-brutal-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {rol}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Tipo de Documento:
                </label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                >
                  <option value="CODIGO_URP">Código Universitario (9 dígitos)</option>
                  <option value="DNI">DNI (8 dígitos)</option>
                  <option value="CE">Carné de Extranjería (CE)</option>
                </select>
              </div>

              <div className="sm:col-span-7">
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  N° de Documento / Código:
                </label>
                <input
                  type="text"
                  value={numeroDocumento}
                  onChange={handleDocumentChange}
                  placeholder={
                    tipoDocumento === 'DNI' 
                      ? 'Ej. 74829103' 
                      : tipoDocumento === 'CODIGO_URP' 
                        ? 'Ej. 202210452' 
                        : 'Ej. 001234567'
                  }
                  maxLength={tipoDocumento === 'DNI' ? 8 : 9}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Nombres Completos:
                </label>
                <input
                  type="text"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  placeholder="Ej. Carlos Eduardo"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                />
              </div>
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Apellidos Completos:
                </label>
                <input
                  type="text"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  placeholder="Ej. Mendoza Morales"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className={tipoParticipante === 'Estudiante' ? 'sm:col-span-8' : 'sm:col-span-12'}>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Correo Institucional o de Contacto:
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="ejemplo@urp.edu.pe"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                />
              </div>

              {tipoParticipante === 'Estudiante' && (
                <div className="sm:col-span-4">
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    Ciclo Académico:
                  </label>
                  <select
                    value={cicloAcademico || 1}
                    onChange={(e) => setCicloAcademico(parseInt(e.target.value, 10))}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                  >
                    {Array.from({ length: 14 }, (_, i) => i + 1).map((c) => (
                      <option key={c} value={c}>
                        {c}° Ciclo {c >= 13 ? '(Internado)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBackToCalendar}
                className="py-2.5 px-5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-7 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white font-display font-black text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validando Asistencia...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Registrar mi Asistencia</span>
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
