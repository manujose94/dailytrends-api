export interface IRepository<T> {
  create(item: T): Promise<void>;
  read(id: string): Promise<T | null>;
  update(query: any, item: Partial<T>): Promise<boolean | null>;
  delete(id: string): Promise<void>;
  list(limit?: number): Promise<T[]>;
}
