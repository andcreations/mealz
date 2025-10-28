export function labelToId(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}

export function stripDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}