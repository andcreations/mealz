import { distance } from 'fastest-levenshtein'
import { jaccard } from './jaccard'
import { stripDiacritics } from './string'

export interface IsStringSimilarOptions {
  subSetMatch?: boolean
  fuzzy?: boolean
  similarityThreshold?: number
  tokenThreshold?: number
  normalizeFunc?: (str: string) => string,
}

export function stringSimilarity(a: string, b: string): number {
  const d = distance(a, b)
  const max = Math.max(1, Math.max(a.length, b.length))
  return 1 - d / max // 0..1
}

export function isStringSimilar(
  strA: string,
  strB: string,
  options?: IsStringSimilarOptions
): boolean {
  const {
    subSetMatch = true,
    fuzzy = true,
    similarityThreshold = 0.8,
    tokenThreshold = 0.8,
    normalizeFunc = stripDiacritics,
  } = options ?? {}

  const normalizedStrA = normalizeFunc(strA)
  const normalizedStrB = normalizeFunc(strB)

  if (!normalizedStrA || !normalizedStrB) {
    return false
  }
  if (normalizedStrA === normalizedStrB) {
    return true
  }

  const tokensA = new Set(normalizedStrA.split(' '))
  const tokensB = new Set(normalizedStrB.split(' '))

  if (subSetMatch) {
    // If one is a subset of the other (e.g., "walnut porridge" vs "porridge")
    const isSubset =
      [...tokensA].every((token) => tokensB.has(token)) ||
      [...tokensB].every((token) => tokensA.has(token))
    if (isSubset) {
      return true
    }
  }

  if (!fuzzy) {
    return false
  }

  const strSimilarity = stringSimilarity(normalizedStrA, normalizedStrB)
  if (strSimilarity >= similarityThreshold) {
    return true
  }

  const tokenSimilarity = jaccard(tokensA, tokensB)
  if (tokenSimilarity >= tokenThreshold) {
    return true
  }

  return false
}
