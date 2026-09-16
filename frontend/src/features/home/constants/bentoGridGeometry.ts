export interface HexPosition {
  col: number;
  row: number;
  innerBond?: { x1: number; y1: number; x2: number; y2: number };
}

export const HEX_POSITIONS: HexPosition[] = [
  { col: 0, row: 0 },
  { col: 0, row: 1, innerBond: { x1: 30, y1: 6.5, x2: 66, y2: 6.5 } },
  { col: 1, row: 0 },
  { col: 1, row: 1, innerBond: { x1: 8.6, y1: 39.6, x2: 26.6, y2: 8.4 } },
  { col: 1, row: 2 },
  { col: 2, row: 0 },
  { col: 2, row: 1 },
  { col: 2, row: 2, innerBond: { x1: 30, y1: 6.5, x2: 66, y2: 6.5 } },
  { col: 2, row: 3 },
  { col: 3, row: 0, innerBond: { x1: 26.6, y1: 74.7, x2: 8.6, y2: 43.5 } },
  { col: 3, row: 1 },
  { col: 3, row: 2 },
  { col: 4, row: 0, innerBond: { x1: 30, y1: 6.5, x2: 66, y2: 6.5 } },
  { col: 4, row: 1, innerBond: { x1: 69.4, y1: 8.4, x2: 87.4, y2: 39.6 } },
  { col: 4, row: 2 },
];
