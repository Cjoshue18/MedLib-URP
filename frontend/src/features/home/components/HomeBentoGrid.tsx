import React, { useState, useRef, useEffect } from 'react';
import { Stethoscope, RotateCcw } from 'lucide-react';

interface HomeBentoGridProps {
  onNavigate: (view: 'directory') => void;
}

const hexItems = [
  { id: 'bmj-best-practice', title: 'BMJ Best Practice', abbr: 'BBP', cat: 'Point-of-Care', col: 0, row: 0 },
  { id: 'uptodate', title: 'UpToDate', abbr: 'UTD', cat: 'Soporte Clínico', col: 0, row: 1, innerBond: { x1: 30, y1: 6.5, x2: 66, y2: 6.5 } },
  { id: 'biodigital', title: 'BioDigital 3D', abbr: 'BIO', cat: 'Anatomía 3D', col: 1, row: 0 },
  { id: 'dynamedex', title: 'DynaMedex', abbr: 'DYNA', cat: 'Point-of-Care', col: 1, row: 1, innerBond: { x1: 8.6, y1: 39.6, x2: 26.6, y2: 8.4 } },
  { id: 'scielo', title: 'SciELO', abbr: 'SCI', cat: 'Open Access', col: 1, row: 2 },
  { id: 'clinicalkey-espanol', title: 'ClinicalKey', abbr: 'CK', cat: 'Elsevier', col: 2, row: 0 },
  { id: 'scopus', title: 'Scopus', abbr: 'SCOP', cat: 'Investigación', col: 2, row: 1 },
  { id: 'pubmed', title: 'PubMed', abbr: 'PUB', cat: 'MEDLINE', col: 2, row: 2, innerBond: { x1: 30, y1: 6.5, x2: 66, y2: 6.5 } },
  { id: 'accessmedicina', title: 'AccessMedicina', abbr: 'ACC', cat: 'McGraw-Hill', col: 2, row: 3 },
  { id: 'nejm', title: 'NEJM', abbr: 'NEJM', cat: 'Medicina General', col: 3, row: 0, innerBond: { x1: 26.6, y1: 74.7, x2: 8.6, y2: 43.5 } },
  { id: 'the-bmj', title: 'The BMJ', abbr: 'BMJ', cat: 'Revistas Q1', col: 3, row: 1 },
  { id: 'epistemonikos', title: 'Epistemonikos', abbr: 'EPI', cat: 'Evidencia Clínica', col: 3, row: 2 },
  { id: 'nature', title: 'Nature', abbr: 'NAT', cat: 'Genómica', col: 4, row: 0, innerBond: { x1: 30, y1: 6.5, x2: 66, y2: 6.5 } },
  { id: 'sciencedirect', title: 'ScienceDirect', abbr: 'SD', cat: 'Elsevier', col: 4, row: 1, innerBond: { x1: 69.4, y1: 8.4, x2: 87.4, y2: 39.6 } },
  { id: 'cochrane', title: 'Cochrane Library', abbr: 'COCH', cat: 'Revisiones Q1', col: 4, row: 2 },
];

export const HomeBentoGrid: React.FC<HomeBentoGridProps> = ({ onNavigate }) => {
  const [flippedHexIds, setFlippedHexIds] = useState<Set<string>>(new Set());
  const [isAllFlipped, setIsAllFlipped] = useState(false);
  const hexTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const allFlipTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (allFlipTimerRef.current) clearTimeout(allFlipTimerRef.current);
      hexTimersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const handleHexHover = (id: string) => {
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

  const handleHexClick = (id: string) => {
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

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#008744] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm">
          <Stethoscope className="w-3.5 h-3.5 text-white" />
          <span>Colección Científica Especializada</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
          Bases de Datos Médicas
        </h2>

        <p className="text-sm text-slate-600">
          Herramientas clave suscritas por la facultad para diagnóstico, farmacología y soporte clínico.
        </p>
      </div>

      <div className="relative w-full py-6 overflow-visible flex items-center justify-center">
        <div className="relative w-full max-w-[530px] aspect-[510/360] select-none">
          <div
            className="absolute cursor-pointer group z-20"
            style={{
              left: `${(17 / 510) * 100}%`,
              top: `${(174.707 / 360) * 100}%`,
              width: `${(96 / 510) * 100}%`,
              height: `${(83.138 / 360) * 100}%`,
            }}
            onClick={handleFlipAll}
            title="Girar todos los recursos"
            aria-label="Girar todos los recursos"
          >
            <svg viewBox="0 0 96 83.14" className="w-full h-full overflow-visible drop-shadow-xs">
              <polygon
                points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
                className="fill-white group-hover:fill-emerald-50/80 stroke-slate-800 group-hover:stroke-[#008744] stroke-[2] group-hover:stroke-[2.5] transition-all duration-200"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 group-hover:text-[#008744] transition-colors p-1 select-none pointer-events-none">
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

          <svg
            viewBox="0 0 510 360"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
          >
            <polyline
              points="113,-33.1 161,-33.1 185,8.4"
              fill="none"
              stroke="#008744"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="401,50 449,50 473,91.6"
              fill="none"
              stroke="#008744"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="473"
              cy="91.6"
              r="5"
              fill="white"
              stroke="#008744"
              strokeWidth="2"
            />
            <polyline
              points="17,50 -31,50 -55,91.6"
              fill="none"
              stroke="#008744"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="-55"
              cy="91.6"
              r="5"
              fill="white"
              stroke="#008744"
              strokeWidth="2"
            />
            <polyline
              points="41,341 89,341 113,299.4"
              fill="none"
              stroke="#008744"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="257"
              y1="299.4"
              x2="281"
              y2="341"
              stroke="#008744"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {hexItems.map((item) => {
            const cx = 65 + item.col * 72;
            const cy = 50 + item.row * 83.138 + (item.col % 2 !== 0 ? 41.569 : 0);
            const leftPct = ((cx - 48) / 510) * 100;
            const topPct = ((cy - 41.569) / 360) * 100;
            const widthPct = (96 / 510) * 100;
            const heightPct = (83.138 / 360) * 100;
            const isFlipped = isAllFlipped || flippedHexIds.has(item.id);

            const yTop = cy - 41.569;
            const yBottom = cy + 41.569;
            const tTop = Math.max(0, Math.min(1, (yTop - 10) / 340));
            const tBottom = Math.max(0, Math.min(1, (yBottom - 10) / 340));
            const topG = Math.round(195 - tTop * (195 - 48));
            const topB = Math.round(112 - tTop * (112 - 20));
            const botG = Math.round(195 - tBottom * (195 - 48));
            const botB = Math.round(112 - tBottom * (112 - 20));
            const topColor = `rgb(0, ${topG}, ${topB})`;
            const botColor = `rgb(0, ${botG}, ${botB})`;

            return (
              <div
                key={item.id}
                className="absolute cursor-pointer transition-all duration-200"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                  perspective: '800px',
                  zIndex: isFlipped ? 30 : 10,
                }}
                onClick={() => handleHexClick(item.id)}
                onMouseEnter={() => handleHexHover(item.id)}
                title={`${item.title} — ${item.cat}`}
              >
                <div
                  className={`w-full h-full relative transition-transform duration-500 ease-out preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  style={{
                    transitionDelay: isAllFlipped ? `${item.col * 40 + item.row * 30}ms` : '0ms',
                  }}
                >
                  <div className="absolute inset-0 w-full h-full backface-hidden">
                    <svg viewBox="0 0 96 83.14" className="w-full h-full drop-shadow-xs overflow-visible">
                      <defs>
                        <linearGradient id={`grad-${item.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={topColor} />
                          <stop offset="100%" stopColor={botColor} />
                        </linearGradient>
                      </defs>
                      <polygon
                        points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
                        fill={`url(#grad-${item.id})`}
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="transition-colors duration-200"
                      />
                      {item.innerBond && (
                        <line
                          x1={item.innerBond.x1}
                          y1={item.innerBond.y1}
                          x2={item.innerBond.x2}
                          y2={item.innerBond.y2}
                          stroke="#8cf9a9"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.45"
                        />
                      )}
                    </svg>
                  </div>

                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <svg viewBox="0 0 96 83.14" className="w-full h-full drop-shadow-md overflow-visible">
                      <polygon
                        points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
                        fill="#0f172a"
                        stroke="#00a859"
                        strokeWidth="2.5"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1.5 text-center select-none pointer-events-none">
                      <span className="text-[#8cf9a9] font-black text-[8px] uppercase tracking-wider leading-none">
                        {item.abbr}
                      </span>
                      <span className="text-white font-extrabold text-[9px] sm:text-[10px] leading-tight mt-0.5 line-clamp-2 px-1">
                        {item.title}
                      </span>
                      <span className="text-emerald-400 text-[7px] sm:text-[8px] font-semibold truncate max-w-[70px] mt-0.5">
                        {item.cat}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute left-[83%] sm:left-[84%] top-[72%] -translate-y-1/2 select-none z-20 whitespace-nowrap">
            <button
              type="button"
              onClick={() => onNavigate('directory')}
              className="inline-flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-[#008744] hover:text-[#00572b] transition-all hover:translate-x-1 cursor-pointer group"
              title="Ver más bases de datos médicas"
            >
              <span>Ver Más</span>
              <span className="text-lg sm:text-xl leading-none font-black text-[#008744] group-hover:translate-x-1 transition-transform">
                &gt;
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
