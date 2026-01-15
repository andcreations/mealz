import { MemoryInfo } from '../types';

// @see https://nodejs.org/en/learn/diagnostics/memory/understanding-and-tuning-memory
export class Memory {
  public getInfo(): MemoryInfo {
    const usage = process.memoryUsage();
    return {
      rss: usage.rss,
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      external: usage.external,
      arrayBuffers: usage.arrayBuffers,
    }
  }
}
