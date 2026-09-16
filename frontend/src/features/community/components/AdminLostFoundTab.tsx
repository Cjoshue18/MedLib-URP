import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '../../../components/common/InstagramIcon';
import { lostFoundService, LostItemPost } from '../services/lostFoundService';
import { InstagramPostEmbed } from './InstagramPostEmbed';
import { AdminNewPostModal } from './AdminNewPostModal';
import { MAX_ACTIVE_LOST_FOUND_POSTS } from '../constants/lostFoundConstants';

interface AdminLostFoundTabProps {
  onShowFeedback: (message: string) => void;
}

export const AdminLostFoundTab: React.FC<AdminLostFoundTabProps> = ({ onShowFeedback }) => {
  const [lostPosts, setLostPosts] = useState<LostItemPost[]>([]);
  const [isLoadingLostPosts, setIsLoadingLostPosts] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

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

  const handleSavePost = async (url: string) => {
    await lostFoundService.createPost(url);
    onShowFeedback('Publicación agregada con éxito al catálogo de objetos perdidos.');
    await loadLostPosts();
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
            Gestiona hasta {MAX_ACTIVE_LOST_FOUND_POSTS} publicaciones simultáneas que se visualizarán en el carrusel del portal de estudiantes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
            <span>Activas: </span>
            <span className="text-[#008744] font-black">{lostPosts.length}</span>
            <span> / {MAX_ACTIVE_LOST_FOUND_POSTS}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsNewPostModalOpen(true)}
            disabled={lostPosts.length >= MAX_ACTIVE_LOST_FOUND_POSTS}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs text-white shadow-xs transition-colors ${
              lostPosts.length >= MAX_ACTIVE_LOST_FOUND_POSTS
                ? 'bg-slate-400 cursor-not-allowed opacity-70'
                : 'bg-[#008744] hover:bg-[#00572B] cursor-pointer'
            }`}
            title={lostPosts.length >= MAX_ACTIVE_LOST_FOUND_POSTS ? `Límite alcanzado (máximo ${MAX_ACTIVE_LOST_FOUND_POSTS} publicaciones)` : 'Registrar nueva publicación'}
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
            onClick={() => setIsNewPostModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008744] hover:bg-[#00572B] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Primera Publicación</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lostPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <span className="text-[11px] font-bold text-slate-500">
                  Publicación #{post.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={post.urlInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Ver en Instagram"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Retirar de cartelera"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="w-full flex justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 min-h-[380px]">
                  <InstagramPostEmbed url={post.urlInstagram} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminNewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onSavePost={handleSavePost}
      />
    </div>
  );
};
