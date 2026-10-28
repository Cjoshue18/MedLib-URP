import React from 'react';
import { BookOpen, Newspaper, GraduationCap, ArrowRight } from 'lucide-react';
import {
  BENTO_COLLECTIONS,
  BentoCollectionItem,
} from '../constants/bentoCollectionsData';

interface BentoCollectionsCardProps {
  className?: string;
  onNavigate?: (view: string) => void;
}

export const BentoCollectionsCard: React.FC<BentoCollectionsCardProps> = ({
  className = '',
  onNavigate,
}) => {
  const renderIcon = (type: BentoCollectionItem['type']) => {
    switch (type) {
      case 'books':
        return <BookOpen className="w-5 h-5" />;
      case 'journals':
        return <Newspaper className="w-5 h-5" />;
      case 'theses':
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 lg:col-start-3 lg:row-start-3 rounded-lg bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-sm min-h-[360px] lg:min-h-[419px] ${className}`}
    >
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#008744]">
            ACERVO DOCUMENTAL
          </span>
          <h3 className="text-2xl font-display font-black text-[#0F172A]">
            Colecciones &amp; Repositorios
          </h3>
        </div>
        <span className="text-xs font-bold text-slate-500">Acceso Centralizado</span>
      </div>

      <div className="divide-y divide-slate-100 py-2 flex-1 flex flex-col justify-around">
        {BENTO_COLLECTIONS.map((item) => (
          <div
            key={item.id}
            className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-[#008744]/10 text-[#008744] flex items-center justify-center shrink-0 group-hover:bg-[#008744] group-hover:text-white transition-all">
                {renderIcon(item.type)}
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#0F172A] group-hover:text-[#008744] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                  {item.description}
                </p>
              </div>
            </div>

            <a
              href={item.href}
              target={item.isExternal ? '_blank' : undefined}
              rel={item.isExternal ? 'noreferrer' : undefined}
              onClick={(e) => {
                if (!item.isExternal && onNavigate) {
                  e.preventDefault();
                  onNavigate('directory');
                }
              }}
              className="w-10 h-10 rounded-full border border-slate-200 hover:border-[#008744] hover:bg-[#008744] text-[#0F172A] hover:text-white flex items-center justify-center transition-all shrink-0 self-end sm:self-center group-hover:translate-x-1"
              title={`Ir a ${item.title}`}
              aria-label={`Ir a ${item.title}`}
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Repositorio institucional homologado por SUNEDU y Renati.</span>
        <span className="font-bold text-[#008744]">Actualizado 2026</span>
      </div>
    </div>
  );
};
