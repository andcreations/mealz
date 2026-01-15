import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CPUUsage, EventLoop, Memory } from '@mealz/backend-system';

import { 
  METRIC_SYSTEM_CPU_USAGE,
  METRIC_SYSTEM_EVENT_LOOP_DELAY,
  METRIC_SYSTEM_EVENT_LOOP_UTILIZATION,
  METRIC_SYSTEM_MEMORY_RSS,
  METRIC_SYSTEM_MEMORY_ARRAY_BUFFERS,
  METRIC_SYSTEM_MEMORY_EXTERNAL,
  METRIC_SYSTEM_MEMORY_HEAP_TOTAL,
  METRIC_SYSTEM_MEMORY_HEAP_USED,
} from '../consts';
import { registerMetric, setMetric } from '../metrics';

@Injectable()
export class SystemMetricsService implements OnModuleInit, OnModuleDestroy {
  private static readonly METRIC_UPDATE_INTERVAL = 1000;

  private readonly cpuUsage = new CPUUsage();
  private readonly eventLoop = new EventLoop();
  private readonly memory = new Memory();
  private interval: NodeJS.Timeout;

  public onModuleInit(): void {
    // CPU metrics
    registerMetric({
      name: METRIC_SYSTEM_CPU_USAGE,
      type: 'gauge',
      description: 'CPU usage percentage (100% -> one core fully used)',
      labels: [],
    });

    // event loop metrics
    registerMetric({
      name: METRIC_SYSTEM_EVENT_LOOP_UTILIZATION,
      type: 'gauge',
      description: 'Event loop utilization percentage',
      labels: [],
    });
    registerMetric({
      name: METRIC_SYSTEM_EVENT_LOOP_DELAY,
      type: 'gauge',
      description: 'Event loop delay in milliseconds',
      labels: [],
    });

    // memory metrics
    registerMetric({
      name: METRIC_SYSTEM_MEMORY_RSS,
      type: 'gauge',
      description: 'Total memory allocated to the process',
      labels: [],
    });
    registerMetric({
      name: METRIC_SYSTEM_MEMORY_HEAP_TOTAL,
      type: 'gauge',
      description: 'Memory heap total in megabytes',
      labels: [],
    });
    registerMetric({
      name: METRIC_SYSTEM_MEMORY_HEAP_USED,
      type: 'gauge',
      description: 'Memory heap used in megabytes',
      labels: [],
    });
    registerMetric({
      name: METRIC_SYSTEM_MEMORY_EXTERNAL,
      type: 'gauge',
      description: 'Memory external in megabytes',
      labels: [],
    });
    registerMetric({
      name: METRIC_SYSTEM_MEMORY_ARRAY_BUFFERS,
      type: 'gauge',
      description: 'Memory array buffers in megabytes',
      labels: [],
    });

    // interval
    this.interval = setInterval(
      () => this.updateMetrics(),
      SystemMetricsService.METRIC_UPDATE_INTERVAL,
    );
  }

  public onModuleDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  private updateMetrics(): void {
    // CPU metrics
    const cpuUsage = this.cpuUsage.getUsageInPercent();
    setMetric(METRIC_SYSTEM_CPU_USAGE, {}, cpuUsage);

    // event loop metrics
    const eventLoopUtilization = this.eventLoop.getUtilizationInPercent();
    setMetric(METRIC_SYSTEM_EVENT_LOOP_UTILIZATION, {}, eventLoopUtilization);
    
    const eventLoopDelay = this.eventLoop.getDelayInMilliseconds();
    setMetric(METRIC_SYSTEM_EVENT_LOOP_DELAY, {}, eventLoopDelay);

    // memory metrics
    const toMegabytes = (value: number) => value / 1024 / 1024;
    const memory = this.memory.getInfo();
    setMetric(
      METRIC_SYSTEM_MEMORY_RSS,
      {},
      toMegabytes(memory.rss)
    );
    setMetric(
      METRIC_SYSTEM_MEMORY_HEAP_TOTAL,
      {},
      toMegabytes(memory.heapTotal),
    );
    setMetric(
      METRIC_SYSTEM_MEMORY_HEAP_USED,
      {},
      toMegabytes(memory.heapUsed),
    );
    setMetric(
      METRIC_SYSTEM_MEMORY_EXTERNAL,
      {},
      toMegabytes(memory.external),
    );
    setMetric(
      METRIC_SYSTEM_MEMORY_ARRAY_BUFFERS,
      {},
      toMegabytes(memory.arrayBuffers),
    );
  }
}