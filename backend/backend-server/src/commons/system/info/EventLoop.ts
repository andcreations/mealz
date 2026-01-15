import { 
  performance,
  monitorEventLoopDelay,
  IntervalHistogram,
} from 'perf_hooks';

// ELU = active_time / (active_time + idle_time)
// ELU high + delay high -> CPU pressure / blocking JS / too much sync work
// ELU low + delay high -> often timers delayed by OS scheduling / container throttling
// ELU high + CPU low -> can indicate blocking I/O callbacks or single-thread contention

export class EventLoop {
  private lastUtilization = performance.eventLoopUtilization(); // ELU
  private eventLoopHistogram: IntervalHistogram;

  public constructor() {
    // resolution in milliseconds
    this.eventLoopHistogram = monitorEventLoopDelay({ resolution: 10 });
    this.eventLoopHistogram.enable();
  }

  public getUtilizationInPercent(): number {
    const now = performance.eventLoopUtilization();
    const diff = performance.eventLoopUtilization(now, this.lastUtilization);
    this.lastUtilization = now;
    return diff.utilization * 100;
  }

  public getDelayInMilliseconds(): number {
    const delayInNanoseconds = Math.max(this.eventLoopHistogram.max, 0);
    this.eventLoopHistogram.reset();

    if (Number.isNaN(delayInNanoseconds)) {
      return Infinity;
    }

    // convert to milliseconds
    return delayInNanoseconds / 1_000_000;
  }
}