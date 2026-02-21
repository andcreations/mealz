export interface UserProperties<T = any> {
  id: string;
  userId: string;
  propertyId: string;
  data: T;
  modifiedAt: number;
}