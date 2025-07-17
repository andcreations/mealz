export function patchAtIndex<T>(
  array: T[],
  index: number,
  update: Partial<T>,
): T[] {
  return [
    ...array.slice(0, index),
    {
      ...array[index],
      ...update,
    },
    ...array.slice(index + 1),
  ];
}

export function removeFromIndex<T>(array: T[], index: number): T[] {
  return array.filter((_, itemIndex) => index !== itemIndex);
}