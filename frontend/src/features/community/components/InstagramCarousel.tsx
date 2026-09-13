import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LostItemPost } from '../services/lostFoundService';
import { InstagramPostEmbed } from './InstagramPostEmbed';
import { InstagramIcon } from '../../../components/common/InstagramIcon';

interface InstagramCarouselProps {
  posts: LostItemPost[];
  isLoading?: boolean;
}

export const InstagramCarousel: React.FC<InstagramCarouselProps> = ({
  posts,
  isLoading = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, posts.length - itemsPerView);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsPerView, maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    if (deltaX > 45) {
      handleNext();
    } else if (deltaX < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs h-[450px] animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-28 bg-slate-200 rounded"></div>
                  <div className="h-2.5 w-16 bg-slate-100 rounded"></div>
                </div>
              </div>
              <div className="w-full flex-1 bg-slate-100 rounded-xl my-4"></div>
              <div className="space-y-2">
                <div className="h-3 w-4/5 bg-slate-200 rounded"></div>
                <div className="h-2.5 w-1/2 bg-slate-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#008744] flex items-center justify-center mx-auto mb-3 border border-emerald-100">
          <InstagramIcon className="w-7 h-7" />
        </div>
        <h3 className="font-display font-extrabold text-base text-slate-900">
          No hay publicaciones de objetos perdidos activas
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
          Las pertenencias recuperadas en salas de lectura y laboratorios de la Facultad de Medicina se publican aquí para su entrega presencial en el mostrador.
        </p>
      </div>
    );
  }

  const offsetPercent = currentIndex * (100 / itemsPerView);

  return (
    <div className="relative w-full group">
      <div
        className="overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${offsetPercent}%)`,
          }}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2 sm:px-2.5 flex flex-col"
            >
              <div className="w-full h-full bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between p-2">
                <div className="w-full flex items-center justify-center min-h-[440px]">
                  <InstagramPostEmbed url={post.urlInstagram} captioned={false} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {posts.length > itemsPerView && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all cursor-pointer ${
              currentIndex === 0
                ? 'opacity-0 pointer-events-none scale-90'
                : 'opacity-100 scale-100 hover:scale-105 active:scale-95'
            }`}
            title="Ver publicación anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white transition-all cursor-pointer ${
              currentIndex >= maxIndex
                ? 'opacity-0 pointer-events-none scale-90'
                : 'opacity-100 scale-100 hover:scale-105 active:scale-95'
            }`}
            title="Ver publicación siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-7 bg-[#008744]'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Diapositiva ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
