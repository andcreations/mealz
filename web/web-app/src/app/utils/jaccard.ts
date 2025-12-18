export function jaccard(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter((x) => set2.has(x))).size
  const union = new Set([...set1, ...set2]).size
  if (union === 0) {
    return 0
  }
  return intersection / union
}
