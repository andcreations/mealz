export function labelToId(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}