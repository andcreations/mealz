export type SQLiteParamValue = string | number;
export type SQLiteParams = Record<string, SQLiteParamValue>;

export class SQLiteStatement {
  private sql: string = '';
  private params: SQLiteParams = {};

  public constructor(sql = '', params: SQLiteParams = {}) {
    this.sql = sql;
    this.params = params;
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
    return {
      sql: this.sql,
      params: JSON.stringify(this.params),
    };
  }
}