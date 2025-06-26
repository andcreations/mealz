export type SQLiteParamValue = string | number | Buffer;
export type SQLiteParams = Record<string, SQLiteParamValue>;

export class SQLiteStatement {
  private sql: string = '';
  private params: SQLiteParams = {};

  public constructor(sql = '', params: SQLiteParams = {}) {
    this.sql = sql;
    this.params = params;
  }

  public hasSQL(): boolean {
    return this.sql.length > 0;
  }

  public getSQL(): string {
    return this.sql;
  }

  public getParams(): SQLiteParams {
    return this.params;
  }

  public appendSQL(sql: string): void {
    this.sql += sql;
  }

  public setParam(name: string, value: SQLiteParamValue): void {
    this.params[name] = value;
  }

  public append(other: SQLiteStatement): void {
    this.sql += other.sql;
    this.params = {
      ...this.params,
      ...other.params,
    };  
  }

  public toContext(): Record<string, string> {
    const params: Record<string, string | number> = {};
    Object.keys(this.params).forEach((key) => {
      const value = this.params[key];
      if (value instanceof Buffer) {
        params[key] = `Binary buffer of size ${value.length}`;
        return;
      }
      if (typeof value === 'number') {
        params[key] = value;
        return;
      }
      params[key] = value.toString();
    });
    return {
      sql: this.sql,
      params: JSON.stringify(params),
    };
  }
}