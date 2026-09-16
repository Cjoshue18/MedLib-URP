import React, { useState } from 'react';
import { X, AlertCircle, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { InstagramIcon } from '../../../components/common/InstagramIcon';
import { InstagramPostEmbed } from './InstagramPostEmbed';

interface AdminNewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePost: (url: string) => Promise<void>;
}

export const AdminNewPostModal: React.FC<AdminNewPostModalProps> = ({
  isOpen,
  onClose,
  onSavePost,
}) => {
  const [newPostUrl, setNewPostUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postModalError, setPostModalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostUrl.trim()) {
      setPostModalError('Por favor ingresa la URL de la publicación de Instagram.');
      return;
    }

    setIsSubmitting(true);
    setPostModalError(null);

    try {
      await onSavePost(newPostUrl.trim());
      setNewPostUrl('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar la publicación.';
      setPostModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-200">
              <InstagramIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">
                Nueva Publicación de Instagram
              </h3>
              <p className="text-[11px] text-slate-500">
                Añade el enlace de un post oficial
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {postModalError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{postModalError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Enlace del Post (URL)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={newPostUrl}
                onChange={(e) => {
                  setNewPostUrl(e.target.value);
                  if (postModalError) setPostModalError(null);
                }}
                placeholder="https://www.instagram.com/p/C_abc123/"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#008744] focus:border-transparent"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Ejemplo: https://www.instagram.com/p/DdHuc4YmbVI/
            </p>
          </div>

          {newPostUrl.includes('instagram.com') && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold text-slate-700 mb-2">Vista previa:</p>
              <div className="max-h-[460px] overflow-y-auto rounded-xl bg-white border border-slate-200 p-3 shadow-inner [scrollbar-width:thin] [scrollbar-color:#94a3b8_#f1f5f9]">
                <div className="w-full flex justify-center py-1">
                  <InstagramPostEmbed url={newPostUrl} />
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008744] hover:bg-[#00572B] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar y Publicar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
