import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { resourceService, ResourceApiDto, getDatabaseLogoUrl } from '../../guides';
import { BentoHexCard } from './BentoHexCard';
import { HomeBentoMolecularBonds } from './HomeBentoMolecularBonds';
import { HEX_POSITIONS } from '../constants/bentoGridGeometry';

interface BentoDatabasesCardProps {
  className?: string;
  onNavigate?: (view: any, query?: string) => void;
}

const FALLBACK_TICKER_ITEMS = [
  'Bases de Datos Médicas',
  'UpToDate Anywhere',
  'ClinicalKey',
  'PubMed NLM',
  'DynaMed EBM',
  'ScienceDirect',
  'AccessMedicina',
  'BMJ Best Practice',
  'Scopus',
  'Nature Medicine',
  'Cochrane Library',
  'Embase',
];

export const BentoDatabasesCard: React.FC<BentoDatabasesCardProps> = ({
  className = '',
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerItems, setTickerItems] = useState<string[]>(FALLBACK_TICKER_ITEMS);
  const [resources, setResources] = useState<ResourceApiDto[]>(() =>
    resourceService.getCachedLiteResources()
  );
  const [isLoading, setIsLoading] = useState(() => resources.length === 0);
  const [flippedHexIds, setFlippedHexIds] = useState<Set<number>>(new Set());
  const [isAllFlipped, setIsAllFlipped] = useState(false);
  const hexTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const allFlipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTouchRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;

    if (resources.length > 0) {
      resources
        .filter((r) => r.mostrarEnHexagonos)
        .forEach((r) => {
          const url = getDatabaseLogoUrl(r.logoUrl);
          if (url) {
            const img = new Image();
            img.src = url;
          }
        });
    }

    resourceService
      .getResources(true)
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setResources(data);
          data
            .filter((r) => r.mostrarEnHexagonos)
            .forEach((r) => {
              const url = getDatabaseLogoUrl(r.logoUrl);
              if (url) {
                const img = new Image();
                img.src = url;
              }
            });
        }
        if (isMounted) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    resourceService.getResourceNames().then((names) => {
      if (isMounted && names.length > 0) {
        setTickerItems(names);
      }
    });

    return () => {
      isMounted = false;
      if (allFlipTimerRef.current) clearTimeout(allFlipTimerRef.current);
      hexTimersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const handleHexHover = (id: number) => {
    if (Date.now() - lastTouchRef.current < 800) {
      return;
    }

    const existingTimer = hexTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      hexTimersRef.current.delete(id);
    }

    setFlippedHexIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    const timer = setTimeout(() => {
      setFlippedHexIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      hexTimersRef.current.delete(id);
    }, 7000);

    hexTimersRef.current.set(id, timer);
  };

  const handleHexClick = (id: number) => {
    const existingTimer = hexTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      hexTimersRef.current.delete(id);
    }

    setFlippedHexIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFlipAll = () => {
    if (allFlipTimerRef.current) {
      clearTimeout(allFlipTimerRef.current);
    }
    hexTimersRef.current.forEach((timer) => clearTimeout(timer));
    hexTimersRef.current.clear();

    if (isAllFlipped || flippedHexIds.size > 0) {
      setIsAllFlipped(false);
      setFlippedHexIds(new Set());
    } else {
      setIsAllFlipped(true);
      allFlipTimerRef.current = setTimeout(() => {
        setIsAllFlipped(false);
      }, 5000);
    }
  };

  const hexagonResources = useMemo(() => {
    const selected = resources.filter((r) => r.mostrarEnHexagonos && r.isActive);
    if (selected.length >= 15) {
      return selected.slice(0, 15);
    }
    const selectedIds = new Set(selected.map((r) => r.id));
    const fallbackCandidates = resources.filter(
      (r) => !selectedIds.has(r.id) && r.isActive && r.logoUrl
    );
    const combined = [...selected, ...fallbackCandidates];
    if (combined.length >= 15) {
      return combined.slice(0, 15);
    }
    const remaining = resources.filter(
      (r) => !combined.some((c) => c.id === r.id) && r.isActive
    );
    return [...combined, ...remaining].slice(0, 15);
  }, [resources]);

  const activeSlots = useMemo(() => {
    return HEX_POSITIONS.map((pos, index) => {
      const res = hexagonResources[index];
      return {
        id: res ? res.id : index + 1000,
        resource: res || null,
        col: pos.col,
        row: pos.row,
        innerBond: pos.innerBond,
      };
    });
  }, [hexagonResources]);

  useEffect(() => {
    const tracks = [
      { interval: 3500, unflipDelay: 2500, initialDelay: 800 },
      { interval: 5400, unflipDelay: 3900, initialDelay: 2400 },
      { interval: 4400, unflipDelay: 3100, initialDelay: 1600 },
    ];

    const timeouts: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timeout[] = [];

    tracks.forEach((track) => {
      const startTrack = () => {
        const intervalId = setInterval(() => {
          if (isAllFlipped || activeSlots.length === 0) return;

          setFlippedHexIds((prev) => {
            const availableSlots = activeSlots.filter((slot) => !prev.has(slot.id));
            if (availableSlots.length === 0) return prev;

            const randomSlot =
              availableSlots[Math.floor(Math.random() * availableSlots.length)];
            const targetId = randomSlot.id;

            const next = new Set(prev);
            next.add(targetId);

            const unflipTimer = setTimeout(() => {
              setFlippedHexIds((curr) => {
                if (!curr.has(targetId)) return curr;
                const updated = new Set(curr);
                updated.delete(targetId);
                return updated;
              });
              hexTimersRef.current.delete(targetId);
            }, track.unflipDelay);

            const existing = hexTimersRef.current.get(targetId);
            if (existing) clearTimeout(existing);
            hexTimersRef.current.set(targetId, unflipTimer);

            return next;
          });
        }, track.interval);

        intervals.push(intervalId);
      };

      const delayId = setTimeout(startTrack, track.initialDelay);
      timeouts.push(delayId);
    });

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
      intervals.forEach((id) => clearInterval(id));
    };
  }, [activeSlots, isAllFlipped]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNavigate && searchQuery.trim()) {
      onNavigate('directory', searchQuery.trim());
    } else if (onNavigate) {
      onNavigate('directory');
    }
  };

  return (
    <div
      className={`col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 lg:col-start-1 lg:row-start-1 rounded-lg border border-slate-200 bg-white p-5 sm:p-7 lg:p-8 flex flex-col justify-between relative min-h-[460px] lg:min-h-[500px] ${className}`}
    >
      <div className="w-full text-left space-y-3">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#008744] block">
            Colección Científica Especializada
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0F172A] tracking-tight">
            Bases de Datos Medicina
          </h2>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en UpToDate, ClinicalKey, guías clínicas, revistas..."
            className="w-full h-12 pl-11 pr-28 rounded-lg bg-white text-slate-900 border border-slate-300 focus:border-[#00A859] focus:outline-none text-xs sm:text-sm placeholder:text-slate-400 shadow-xs transition-all"
          />
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <button
            type="submit"
            className="absolute right-1.5 h-9 px-4 rounded-md bg-[#00A859] hover:bg-[#008744] text-white font-display text-xs font-bold tracking-wide uppercase transition-colors shadow-xs cursor-pointer"
          >
            Buscar
          </button>
        </form>

        <div className="w-full overflow-hidden py-1.5 border-y border-slate-100 select-none">
          <div className="animate-marquee-scroll flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
            {[...tickerItems, ...tickerItems].map((name, index) => (
              <React.Fragment key={`${name}-${index}`}>
                <span>{name}</span>
                <span className="text-slate-300">&bull;</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center py-4 flex-1 overflow-visible">
        <div className="relative w-full max-w-[530px] aspect-[510/360] select-none">
          <div
            className="absolute cursor-pointer group z-20 select-none touch-manipulation"
            style={{
              left: `${(17 / 510) * 100}%`,
              top: `${(174.707 / 360) * 100}%`,
              width: `${(96 / 510) * 100}%`,
              height: `${(83.138 / 360) * 100}%`,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            }}
            onClick={handleFlipAll}
            onTouchStart={() => {
              lastTouchRef.current = Date.now();
            }}
            title="Girar todos los recursos"
            aria-label="Girar todos los recursos"
          >
            <svg viewBox="0 0 96 83.14" className="w-full h-full overflow-visible drop-shadow-xs">
              <polygon
                points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
                className="fill-white group-hover:fill-white stroke-[#0F172A] group-hover:stroke-[#008744] stroke-[2] group-hover:stroke-[2.5] transition-all duration-200"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 group-hover:text-[#008744] transition-colors p-1 select-none pointer-events-none">
              <RotateCcw
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${
                  isAllFlipped ? 'rotate-180 text-[#008744]' : 'group-hover:-rotate-45'
                }`}
              />
              <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider mt-0.5 text-slate-500 group-hover:text-[#008744]">
                {isAllFlipped ? 'Volver' : 'Girar'}
              </span>
            </div>
          </div>

          <HomeBentoMolecularBonds />

          {activeSlots.map((slot) => (
            <BentoHexCard
              key={slot.id}
              slot={slot}
              isFlipped={isAllFlipped || flippedHexIds.has(slot.id)}
              isAllFlipped={isAllFlipped}
              isLoading={isLoading}
              onClick={handleHexClick}
              onTouchStart={() => {
                lastTouchRef.current = Date.now();
              }}
              onMouseEnter={handleHexHover}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
