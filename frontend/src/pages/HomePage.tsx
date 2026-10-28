import React from 'react';
import {
  HomeHero,
  HomeBentoGrid,
} from '../features/home';

interface HomePageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found', query?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <main className="w-full bg-white text-slate-900 overflow-hidden">
      <HomeHero onNavigate={onNavigate} />

      <section className="max-w-[1280px] mx-auto px-6 py-16 pb-24">
        <div className="w-full max-w-[1280px] mx-auto">
          <HomeBentoGrid />
        </div>
      </section>
    </main>
  );
};
