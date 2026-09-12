import React from 'react';
import {
  HomeHero,
  HomeBentoGrid,
  HomeUpcomingActivities,
  HomeCommunityFeed,
} from '../features/home';

interface HomePageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found', query?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <main className="w-full bg-[#f8fafc] text-slate-900 overflow-hidden">
      <HomeHero onNavigate={onNavigate} />

      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <HomeBentoGrid onNavigate={onNavigate} />
          </div>

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <HomeUpcomingActivities onNavigate={onNavigate} />
          </div>
        </div>
      </section>

      <HomeCommunityFeed />
    </main>
  );
};
