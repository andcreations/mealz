export function encode(value: any): Buffer {
  return Buffer.from(JSON.stringify(value));
}

export function decode<T>(buffer: Buffer): T {
  return JSON.parse(buffer.toString()) as T;
}