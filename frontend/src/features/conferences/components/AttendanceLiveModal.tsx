import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Radio, 
  Send, 
  User, 
  Calendar, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { ConferenceSummary, TipoParticipante, TipoDocumento, MarkAttendanceRequest } from '../types';
import { conferenceService } from '../services/conferenceService';

interface AttendanceLiveModalProps {
  conference: ConferenceSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AttendanceLiveModal: React.FC<AttendanceLiveModalProps> = ({
  conference,
  isOpen,
  onClose,
  onSuccess
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

  useEffect(() => {
    if (isOpen) {
      setNumeroDocumento('');
      setNombres('');
      setApellidos('');
      setCorreo('');
      setTipoParticipante('Estudiante');
      setTipoDocumento('CODIGO_URP');
      setCicloAcademico(1);
      setErrorMessage(null);
      setIsSuccess(false);
      setTimestampRegistrado(null);
    }
  }, [isOpen, conference]);

  if (!isOpen || !conference) return null;

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
      if (onSuccess) {
        onSuccess();
      }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col z-10 max-h-[92vh]">
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400 block">
                  Marcación en Vivo
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  Teams / Zoom
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-display font-black leading-tight text-white">
                Registro de Asistencia ALFIN
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold font-display text-slate-900">
                {conference.tituloEvento}
              </h3>
              {conference.asistenciaAbierta ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Asistencia Abierta
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black border border-slate-300">
                  Asistencia Cerrada
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#008744]" />
                {conference.expositorPonente}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#008744]" />
                {new Date(conference.fechaHoraInicio).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#008744]" />
                {new Date(conference.fechaHoraInicio).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {!conference.asistenciaAbierta && !isSuccess && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm space-y-1">
              <p className="font-extrabold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                La marcación de asistencia no está disponible en este momento
              </p>
              <p className="text-amber-800 leading-relaxed text-xs">
                La biblioteca abre el registro durante la transmisión en vivo de la conferencia en Microsoft Teams. Si estás en la reunión, espera a que el moderador indique que el formulario está habilitado.
              </p>
            </div>
          )}

          {isSuccess ? (
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#008744] flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-display font-black text-slate-900">
                  ¡Asistencia Acreditada con Éxito!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Participante: <strong>{nombres} {apellidos}</strong><br />
                  Hora registrada: <strong className="text-[#008744]">{timestampRegistrado}</strong>
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#008744] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Constancia de Asistencia Válida para SUNEDU</span>
                </div>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-xl bg-[#008744] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-sm hover:bg-[#006b35] transition-all cursor-pointer"
                >
                  Finalizar
                </button>
              </div>
            </div>
          ) : (
            conference.asistenciaAbierta && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-tight font-medium">{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Tipo de Participante:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Estudiante', 'Docente', 'Residentado', 'Otro'] as TipoParticipante[]).map((rol) => (
                      <button
                        key={rol}
                        type="button"
                        onClick={() => setTipoParticipante(rol)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">
                      Tipo de Documento:
                    </label>
                    <select
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                    >
                      <option value="CODIGO_URP">Código Universitario (9 dígitos)</option>
                      <option value="DNI">DNI (8 dígitos)</option>
                      <option value="CE">Carné de Extranjería (CE)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-7">
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">
                      Nombres:
                    </label>
                    <input
                      type="text"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      placeholder="Ej. Carlos Eduardo"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">
                      Apellidos:
                    </label>
                    <input
                      type="text"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      placeholder="Ej. Mendoza Morales"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className={tipoParticipante === 'Estudiante' ? 'sm:col-span-8' : 'sm:col-span-12'}>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">
                      Correo Institucional o de Contacto:
                    </label>
                    <input
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="ejemplo@urp.edu.pe"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                    />
                  </div>

                  {tipoParticipante === 'Estudiante' && (
                    <div className="sm:col-span-4">
                      <label className="text-xs font-extrabold text-slate-700 block mb-1">
                        Ciclo Académico:
                      </label>
                      <select
                        value={cicloAcademico || 1}
                        onChange={(e) => setCicloAcademico(parseInt(e.target.value, 10))}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
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

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-6 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs shadow-urp-brutal-sm tactile-btn transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Validando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Marcar Mi Asistencia Ahora</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};
