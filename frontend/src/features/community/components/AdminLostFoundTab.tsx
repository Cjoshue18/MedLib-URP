import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  ExternalLink,
  AlertCircle,
  Link as LinkIcon,
  X,
  RefreshCw,
} from 'lucide-react';
import { InstagramIcon } from '../../../components/common/InstagramIcon';
import { lostFoundService, LostItemPost } from '../services/lostFoundService';
import { InstagramPostEmbed } from './InstagramPostEmbed';

interface AdminLostFoundTabProps {
  onShowFeedback: (message: string) => void;
}

export const AdminLostFoundTab: React.FC<AdminLostFoundTabProps> = ({ onShowFeedback }) => {
  const [lostPosts, setLostPosts] = useState<LostItemPost[]>([]);
  const [isLoadingLostPosts, setIsLoadingLostPosts] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostUrl, setNewPostUrl] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postModalError, setPostModalError] = useState<string | null>(null);

  const loadLostPosts = async () => {
    setIsLoadingLostPosts(true);
    try {
      const data = await lostFoundService.getPosts();
      setLostPosts(data);
    } catch {
      setLostPosts([]);
    } finally {
      setIsLoadingLostPosts(false);
    }
  };

  useEffect(() => {
    loadLostPosts();
  }, []);

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostUrl.trim()) {
      setPostModalError('Por favor ingresa la URL de la publicación de Instagram.');
      return;
    }

    setIsSubmittingPost(true);
    setPostModalError(null);

    try {
      await lostFoundService.createPost(newPostUrl.trim());
      setIsNewPostModalOpen(false);
      setNewPostUrl('');
      onShowFeedback('Publicación agregada con éxito al catálogo de objetos perdidos.');
      await loadLostPosts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar la publicación.';
      setPostModalError(msg);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    const confirmed = window.confirm('¿Confirmas que deseas retirar esta publicación de la cartelera de objetos perdidos?');
    if (!confirmed) return;

    try {
      await lostFoundService.deletePost(id);
      onShowFeedback('Publicación retirada correctamente.');
      await loadLostPosts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la publicación.';
      onShowFeedback(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
            Publicaciones de Instagram
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestiona hasta 6 publicaciones simultáneas que se visualizarán en el carrusel del portal de estudiantes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
            <span>Activas: </span>
            <span className="text-[#008744] font-black">{lostPosts.length}</span>
            <span> / 6</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setPostModalError(null);
              setNewPostUrl('');
              setIsNewPostModalOpen(true);
            }}
            disabled={lostPosts.length >= 6}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs text-white shadow-xs transition-colors ${
              lostPosts.length >= 6
                ? 'bg-slate-400 cursor-not-allowed opacity-70'
                : 'bg-[#008744] hover:bg-[#00572B] cursor-pointer'
            }`}
            title={lostPosts.length >= 6 ? 'Límite alcanzado (máximo 6 publicaciones)' : 'Registrar nueva publicación'}
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Publicación</span>
          </button>
        </div>
      </div>

      {isLoadingLostPosts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"></div>
          ))}
        </div>
      ) : lostPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#008744] mx-auto flex items-center justify-center mb-3 border border-emerald-100">
            <InstagramIcon className="w-7 h-7" />
          </div>
          <h3 className="font-display font-extrabold text-base text-slate-800">
            No hay publicaciones registradas
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Copia el enlace de un post de Instagram de la cuenta oficial y regístralo para que aparezca en el carrusel público.
          </p>
          <button
            type="button"
            onClick={() => {
              setPostModalError(null);
              setNewPostUrl('');
              setIsNewPostModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008744] hover:bg-[#00572B] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Primera Publicación</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lostPosts.map((post, idx) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-[11px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-600 truncate max-w-[180px]">
                    {post.urlInstagram}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePost(post.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                  title="Eliminar publicación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex items-center justify-center bg-white min-h-[380px]">
                <InstagramPostEmbed url={post.urlInstagram} captioned={false} />
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Registrado: {new Date(post.fechaCreacion).toLocaleDateString('es-PE')}</span>
                <a
                  href={post.urlInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#008744] hover:underline inline-flex items-center gap-1"
                >
                  <span>Abrir enlace</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => !isSubmittingPost && setIsNewPostModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl z-10 overflow-hidden max-h-[92vh] flex flex-col my-auto">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-900 text-base">
                    Incrustar Publicación de Instagram
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pega el enlace oficial del post de Instagram
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                disabled={isSubmittingPost}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                  onClick={() => setIsNewPostModalOpen(false)}
                  disabled={isSubmittingPost}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008744] hover:bg-[#00572B] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmittingPost ? (
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
      )}
    </div>
  );
};
