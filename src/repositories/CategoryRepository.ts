import { DataSource, EntityRepository, Repository } from 'typeorm';
import { MusicCategories } from '../entity';
import { injectable } from 'inversify';
import { AppDataSource } from '../data-source';

export type CategoryData = {
    name: string,
}

export interface ICategoryRepository {
    getAllCategories(): Promise<MusicCategories[]>;
    createNewCategory(data: CategoryData): Promise<MusicCategories>;
    deleteCategory(id: number): Promise<void>;
}

@injectable()
export default class CategoryRepository implements ICategoryRepository {

 public async getAllCategories(): Promise<MusicCategories[]> {
    const categoryRepo = AppDataSource.getRepository(MusicCategories);
    return await categoryRepo.find();
 }

 public async createNewCategory(data: CategoryData): Promise<MusicCategories> {
    const categoryRepo = AppDataSource.getRepository(MusicCategories);
    const category = categoryRepo.create({
        ...data,
    });
    await categoryRepo.save(category);
    return category;
  }

  public async deleteCategory(categoryId: number): Promise<void> {
    const categoryRepo = AppDataSource.getRepository(MusicCategories);
    await categoryRepo.delete(categoryId);
  }
}