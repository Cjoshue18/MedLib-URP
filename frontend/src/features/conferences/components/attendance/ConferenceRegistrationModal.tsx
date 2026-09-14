import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Send 
} from 'lucide-react';
import { ConferenceSummary, TipoParticipante, TipoDocumento, RegisterParticipantRequest } from '../../types';
import { conferenceService } from '../../services/conferenceService';


interface ConferenceRegistrationModalProps {
  conference: ConferenceSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ConferenceRegistrationModal: React.FC<ConferenceRegistrationModalProps> = ({
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
      cicloAcademico: tipoParticipante === 'Estudiante' ? cicloAcademico : null
    };

    setIsSubmitting(true);
    try {
      await conferenceService.registerParticipant(conference.idConferencia, payload);
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal overflow-hidden flex flex-col z-10 max-h-[92vh]">
        <div className="bg-[#008744] text-white px-6 py-5 flex items-center justify-between border-b-2 border-slate-900 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-100 block">
                Formulario Oficial ALFIN FAMURP
              </span>
              <h2 className="text-base sm:text-lg font-display font-black leading-tight">
                Pre-inscripción a Capacitación
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
            <h3 className="text-sm font-extrabold font-display text-slate-900">
              {conference.tituloEvento}
            </h3>
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
                {new Date(conference.fechaHoraInicio).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - {new Date(conference.fechaHoraFin).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#008744] flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-display font-black text-slate-900">
                  ¡Pre-inscripción Confirmada!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Estimado(a) <strong>{nombres} {apellidos}</strong>, tus datos han sido registrados en la nómina oficial. Te esperamos puntualmente en la sesión.
                </p>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-xl bg-[#008744] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-sm hover:bg-[#006b35] transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          ) : (
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
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirmar Pre-inscripción</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
