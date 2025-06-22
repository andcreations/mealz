export type FieldsOf<T> = keyof T;

export class Parameter {
  public constructor(private readonly name: string) {
    throw new Error('Parameters are not supported yet');
  }

  public getName(): string {
    return this.name;
  }
}
export function parameter(name: string): Parameter {
  return new Parameter(name);
}

export type Value<V> = V | Parameter;

export type WhereOperator = {
  $eq?: Value<string | number | boolean>;
  $ne?: Value<string | number | boolean>;
  $gt?: Value<number>;
  $gte?: Value<number>;
  $lt?: Value<number>;
  $lte?: Value<number>;
  $in?: Value<string | number>[];
  $nin?: Value<string | number>[];
  $like?: Value<string>;
};

export type WhereCondition<T> = {
  [K in FieldsOf<T>]?: WhereOperator;
};

export const WHERE_AND = '$and';
export type WhereAnd<T> = {
  [WHERE_AND]: Where<T>[];
};

export const WHERE_OR = '$or';
export type WhereOr<T> = {
  [WHERE_OR]: Where<T>[];
};

export type Where<T> = WhereCondition<T> | WhereAnd<T> | WhereOr<T>;

