export class CPUUsage {
  private lastUsage: NodeJS.CpuUsage = process.cpuUsage();
  private lastTime: bigint = process.hrtime.bigint();

  // 100% means one core is at full usage
  public getUsageInPercent(): number {
    const currentUsage = process.cpuUsage();
    const currentTime = process.hrtime.bigint();

    // microseconds to seconds
    const userDiff = (currentUsage.user - this.lastUsage.user) / 1e6;
    const systemDiff = (currentUsage.system - this.lastUsage.system) / 1e6;
    const cpuTime = userDiff + systemDiff;    

    // nanoseconds to seconds
    const timeDiff = Number(currentTime - this.lastTime) / 1e9;

    this.lastUsage = currentUsage;
    this.lastTime = currentTime;

    // percent
    return cpuTime / timeDiff * 100;
  }
}