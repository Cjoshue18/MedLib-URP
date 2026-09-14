import React from 'react';
import { TipoParticipante, TipoDocumento } from '../../types';


interface ConferenceParticipantFormFieldsProps {
  tipoParticipante: TipoParticipante;
  setTipoParticipante: (val: TipoParticipante) => void;
  tipoDocumento: TipoDocumento;
  setTipoDocumento: (val: TipoDocumento) => void;
  numeroDocumento: string;
  onDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nombres: string;
  setNombres: (val: string) => void;
  apellidos: string;
  setApellidos: (val: string) => void;
  correo: string;
  setCorreo: (val: string) => void;
  cicloAcademico: number | null;
  setCicloAcademico: (val: number | null) => void;
}

export const ConferenceParticipantFormFields: React.FC<ConferenceParticipantFormFieldsProps> = ({
  tipoParticipante,
  setTipoParticipante,
  tipoDocumento,
  setTipoDocumento,
  numeroDocumento,
  onDocumentChange,
  nombres,
  setNombres,
  apellidos,
  setApellidos,
  correo,
  setCorreo,
  cicloAcademico,
  setCicloAcademico,
}) => {
  return (
    <>
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
          <label htmlFor="participant-doc-type" className="text-xs font-extrabold text-slate-800 block mb-1">
            Tipo de Documento:
          </label>
          <select
            id="participant-doc-type"
            name="document-type"
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
          <label htmlFor="participant-doc-number" className="text-xs font-extrabold text-slate-800 block mb-1">
            N° de Documento / Código:
          </label>
          <input
            id="participant-doc-number"
            name="username"
            autoComplete="username"
            type="text"
            value={numeroDocumento}
            onChange={onDocumentChange}
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
          <label htmlFor="participant-given-name" className="text-xs font-extrabold text-slate-800 block mb-1">
            Nombres Completos:
          </label>
          <input
            id="participant-given-name"
            name="given-name"
            autoComplete="given-name"
            type="text"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            placeholder="Ej. Carlos Eduardo"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
          />
        </div>
        <div>
          <label htmlFor="participant-family-name" className="text-xs font-extrabold text-slate-800 block mb-1">
            Apellidos Completos:
          </label>
          <input
            id="participant-family-name"
            name="family-name"
            autoComplete="family-name"
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
          <label htmlFor="participant-email" className="text-xs font-extrabold text-slate-800 block mb-1">
            Correo Institucional o de Contacto:
          </label>
          <input
            id="participant-email"
            name="email"
            autoComplete="email"
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
            <label htmlFor="participant-academic-cycle" className="text-xs font-extrabold text-slate-800 block mb-1">
              Ciclo Académico:
            </label>
            <select
              id="participant-academic-cycle"
              name="academic-cycle"
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
    </>
  );
};
