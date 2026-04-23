export const palette = [
  '#2563eb', '#0f766e', '#f97316', '#dc2626', '#7c3aed', '#0891b2', '#65a30d', '#db2777',
  '#d97706', '#059669', '#4f46e5', '#e11d48', '#0d9488', '#ca8a04', '#9333ea', '#be185d',
  '#1d4ed8', '#15803d', '#c2410c', '#7e22ce',
] as const;

export function colorForIndex(index: number): string {
  return palette[index % palette.length];
}
