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