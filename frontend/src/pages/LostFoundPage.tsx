import React from 'react';
import { 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Info, 
  AlertCircle
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { InstagramCommunityFeed } from '../features/community';

export const LostFoundPage: React.FC = () => {

  const lostItems = [
    {
      id: 'lost-1',
      title: 'Estuche de disección negro con instrumental quirúrgico',
      location: 'Mesa 4 — Sala de Lectura de Libros',
      date: '20 de Agosto, 2026',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVy8k5krBimW03Z7yv_lJAstUZ40bSmjN4c-aN9j_5VPG6735hD7gcrO3fAQtururStUswR4oNLoM7eI7U5vDRLt4-fdvP3IEc-iPN7_h5yToqfBFr1sGkAWZqz7P0NUZaSJ2H3Ut2AhYarRb-_Hvoo7_y3u_y2wcnNSP33wa0XyV4Q51MJatWruVooDFUXZJRLWrszWfDQvOUVevdVEdrUMBvJLgImhhrdm8zq_yAdgvkosswZyA',
      status: 'En Custodia',
      notes: 'Hallado durante la ronda de cierre nocturna en sala general.'
    },
    {
      id: 'lost-2',
      title: 'Estetoscopio Littmann Classic III azul marino',
      location: 'Cubículo de Estudio Grupal 2 — Piso 4',
      date: '28 de Agosto, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      status: 'En Custodia',
      notes: 'Olvidado sobre la mesa de discusión clínica de internos.'
    },
    {
      id: 'lost-3',
      title: 'Cuaderno espiralado y compendio de Farmacología',
      location: 'Sala Multimedia & Hemeroteca',
      date: '02 de Septiembre, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      status: 'En Custodia',
      notes: 'Contiene apuntes manuscritos de dosificación y terapéutica médica.'
    },
    {
      id: 'lost-4',
      title: 'Calculadora científica Casio fx-991LA Plus',
      location: 'Laboratorio de Cómputo B',
      date: '05 de Septiembre, 2026',
      imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
      status: 'En Custodia',
      notes: 'Dejada junto a la terminal 12 tras el examen de bioestadística.'
    }
  ];

  return (
    <div className="w-full pb-20">
      <main className="max-w-[1280px] mx-auto px-6 pt-10">
        <div className="flex flex-col gap-12">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Publicaciones de Objetos Bajo Custodia
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actualizado diariamente por el personal de sala FAMURP
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#008744]">
                <ShieldCheck className="w-4 h-4" />
                <span>Custodia Segura en Mostrador</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {lostItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-slate-900 shadow-urp-brutal-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col group"
                >
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white text-[10px]">
                        <InstagramIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">bib_famurp</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#008744] text-white">
                      {item.status}
                    </span>
                  </div>

                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3 leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      <ul className="space-y-2 text-xs text-slate-600 mb-4">
                        <li className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#008744] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item.location}</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.date}</span>
                        </li>
                      </ul>

                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed mb-4">
                        {item.notes}
                      </p>
                    </div>

                    <button 
                      onClick={() => alert(`Para reclamar "${item.title}": Acércate al mostrador de la Biblioteca de Medicina (Piso 4) portando tu carné universitario URP.`)}
                      className="w-full py-2 px-3 rounded-xl border-2 border-slate-900 font-bold text-xs text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-urp-brutal-sm tactile-btn cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Reclamar en Mostrador</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center gap-3 text-xs text-amber-900 font-semibold">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                Nota: Todo objeto hallado permanece bajo custodia en recepción durante un plazo máximo de 30 días hábiles conforme al reglamento de biblioteca URP.
              </span>
            </div>
          </div>

          <InstagramCommunityFeed
            subtitle="Sigue nuestras publicaciones en vivo para avisos inmediatos de objetos encontrados, horarios y servicios."
            footerNote="Publicaciones sincronizadas en tiempo real desde la cuenta oficial de la Biblioteca de Medicina Humana URP."
          />
        </div>
      </main>
    </div>
  );
};
