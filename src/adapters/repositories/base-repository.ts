import { Model } from "mongoose";
import { IRepository } from "../../domain/port/repository-interface";

export abstract class BaseRepository<T> implements IRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(item: T): Promise<void> {
    await this.model.create(item);
  }

  async read(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, item: Partial<T>): Promise<boolean | null> {
    return await this.model.findByIdAndUpdate(id, item, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  async list(limit?: number): Promise<T[]> {
    if (limit && limit <= 0) {
      throw new Error("Invalid limit parameter. It must be a positive number.");
    }
    let query = this.model.find();
    if (limit) {
      query = query.limit(limit);
    }
    return query.exec();
  }
}
