export type SQLiteParamValue = string | number | Buffer;
export type SQLiteParams = Record<string, SQLiteParamValue>;

export class SQLiteStatement {
  private sql: string = '';
  private params: SQLiteParamValue[] = [];

  public constructor(sql = '', params: SQLiteParamValue[] = []) {
    this.sql = sql;
    this.params = params;
  }

  public hasSQL(): boolean {
    return this.sql.length > 0;
  }

  public getSQL(): string {
    return this.sql;
  }

  public getParams(): SQLiteParamValue[] {
    return this.params;
  }

  public appendSQL(sql: string): void {
    this.sql += sql;
  }

  public addParam(value: SQLiteParamValue): void {
    this.params.push(value);
  }

  public append(other: SQLiteStatement): void {
    const tr = new Error().stack
    this.sql += other.sql;
    this.params = [
      ...this.params,
      ...other.params,
    ];
  }

  public toContext(): Record<string, string> {
    const paramsForContext: (string | number) [] = [];
    this.params.forEach(value => {
      if (value instanceof Buffer) {
        paramsForContext.push(`Binary buffer of size ${value.length}`);
        return;
      }
      if (typeof value === 'number') {
        paramsForContext.push(value);
        return;
      }
      paramsForContext.push(value.toString());
    });
    return {
      sql: this.sql,
      params: JSON.stringify(paramsForContext),
    };
  }
}