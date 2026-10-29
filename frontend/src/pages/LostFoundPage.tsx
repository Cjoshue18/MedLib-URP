import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  InstagramCarousel,
  lostFoundService,
  LostItemPost
} from '../features/community';

export const LostFoundPage: React.FC = () => {
  const [posts, setPosts] = useState<LostItemPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await lostFoundService.getPosts();
        setPosts(data);
      } catch {
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-full pb-20">
      <main className="max-w-[1280px] mx-auto px-6 pt-10">
        <div className="flex flex-col gap-12">
          <div>
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                Publicaciones de Objetos Bajo Custodia
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pertenencias recuperadas en salas de lectura y laboratorios de la Facultad de Medicina Humana URP.
              </p>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900 font-semibold shadow-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                Nota: Todo objeto hallado permanece bajo custodia en recepción durante un plazo máximo de 30 días.
              </span>
            </div>

            <InstagramCarousel posts={posts} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};
