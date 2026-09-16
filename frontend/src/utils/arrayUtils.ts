export const splitIntoColumns = <T>(items: T[], columnCount: number): T[][] => {
  if (columnCount <= 1) return [items];

  const columns: T[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });

  return columns;
};
