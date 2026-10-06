import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MedicalDatabase } from '../../data/databasesData';

interface DatabaseMasonryProps {
  items: MedicalDatabase[];
  renderItem: (item: MedicalDatabase, index: number) => React.ReactNode;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right';
  blurToFocus?: boolean;
}

const MEDIA_QUERIES = ['(min-width: 1024px)', '(min-width: 768px)'];
const MEDIA_VALUES = [3, 2];
const DEFAULT_COLUMNS = 1;

const useMediaColumns = (): number => {
  const getColumns = (): number => {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS;
    for (let i = 0; i < MEDIA_QUERIES.length; i++) {
      if (window.matchMedia(MEDIA_QUERIES[i]).matches) {
        return MEDIA_VALUES[i];
      }
    }
    return DEFAULT_COLUMNS;
  };

  const [columns, setColumns] = useState<number>(getColumns);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaList = MEDIA_QUERIES.map((q) => window.matchMedia(q));
    const update = () => setColumns(getColumns());
    mediaList.forEach((mql) => mql.addEventListener('change', update));
    return () => {
      mediaList.forEach((mql) => mql.removeEventListener('change', update));
    };
  }, []);

  return columns;
};

const getInitialPosition = (direction: 'bottom' | 'top' | 'left' | 'right') => {
  switch (direction) {
    case 'top':
      return { x: 0, y: -70 };
    case 'bottom':
      return { x: 0, y: 70 };
    case 'left':
      return { x: -70, y: 0 };
    case 'right':
      return { x: 70, y: 0 };
    default:
      return { x: 0, y: 70 };
  }
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const DatabaseMasonry: React.FC<DatabaseMasonryProps> = ({
  items,
  renderItem,
  ease = 'power3.out',
  duration = 0.7,
  stagger = 0.045,
  animateFrom = 'bottom',
  blurToFocus = true,
}) => {
  const columns = useMediaColumns();
  const containerRef = useRef<HTMLDivElement>(null);

  const columnGroups = useMemo(() => {
    const groups: Array<Array<{ item: MedicalDatabase; originalIndex: number }>> = Array.from(
      { length: columns },
      () => []
    );

    items.forEach((item, index) => {
      groups[index % columns].push({ item, originalIndex: index });
    });

    return groups;
  }, [items, columns]);

  const itemsKey = useMemo(() => items.map((i) => i.id).join('|'), [items]);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || items.length === 0) return;

    const itemElements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('.masonry-item')
    );

    if (itemElements.length === 0) return;

    itemElements.sort((a, b) => {
      const idxA = Number(a.getAttribute('data-index') ?? 0);
      const idxB = Number(b.getAttribute('data-index') ?? 0);
      return idxA - idxB;
    });

    const initialPos = getInitialPosition(animateFrom);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemElements,
        {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          filter: blurToFocus ? 'blur(8px)' : 'none',
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: blurToFocus ? 'blur(0px)' : 'none',
          duration,
          ease,
          stagger: {
            amount: Math.min(items.length * stagger, 0.85),
            from: 'start',
          },
          clearProps: 'transform,filter',
          overwrite: 'auto',
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [itemsKey, duration, ease, stagger, animateFrom, blurToFocus]);

  return (
    <div
      ref={containerRef}
      className="grid gap-4 items-start w-full"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {columnGroups.map((group, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4">
          {group.map(({ item, originalIndex }) => (
            <div
              key={item.id}
              data-key={item.id}
              data-index={originalIndex}
              className="masonry-item"
            >
              {renderItem(item, originalIndex)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
