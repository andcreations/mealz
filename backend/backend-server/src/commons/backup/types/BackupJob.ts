export abstract class BackupJob<TCfg> {
  private id: string;

  public getId(): string {
    return this.id;
  }

  /**
   * Initialize the backup job.
   * @param id Backup job identifier.
   * @param cfg Backup job configuration
   */
  protected async init(id: string,cfg: TCfg): Promise<void> {
    this.id = id;
  }

  /**
   * Run the backup job.
   */
  public abstract run(): Promise<void>;
}