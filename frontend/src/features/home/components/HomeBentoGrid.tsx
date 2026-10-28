import React from 'react';
import { BentoDatabasesCard } from './BentoDatabasesCard';
import { BentoScheduleCard } from './BentoScheduleCard';
import { BentoFaqCtaCard } from './BentoFaqCtaCard';
import { BentoCollectionsCard } from './BentoCollectionsCard';

interface HomeBentoGridProps {
  onNavigate?: (view: any, query?: string) => void;
}

export const HomeBentoGrid: React.FC<HomeBentoGridProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-stretch w-full">
      <BentoDatabasesCard onNavigate={onNavigate} />

      <div className="col-span-1 md:col-span-1 md:row-span-2 lg:col-span-2 lg:row-span-2 lg:col-start-5 lg:row-start-1 rounded-lg border-2 border-dashed border-slate-200 bg-transparent flex flex-col items-center justify-center p-6 min-h-[460px] lg:min-h-[500px]">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Elemento 2</span>
      </div>

      <BentoScheduleCard />

      <BentoFaqCtaCard onNavigate={onNavigate} />

      <BentoCollectionsCard onNavigate={onNavigate} />
    </div>
  );
};
