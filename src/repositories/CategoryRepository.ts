import { DataSource, Repository } from 'typeorm';
import { MusicCategories } from '../entity';
import { injectable } from 'inversify';
import { AppDataSource } from '../data-source';

export type CategoryData = {
    name: string;
};

export interface ICategoryRepository {
  getAllCategories(): Promise<{ success: boolean; data?: MusicCategories[]; message?: string }>;
  createNewCategory(data: CategoryData): Promise<{ success: boolean; data?: MusicCategories; message?: string }>;
  deleteCategory(id: number): Promise<{ success: boolean; message?: string }>;
}

@injectable()
export default class CategoryRepository implements ICategoryRepository {

  public async getAllCategories(): Promise<{ success: boolean; data?: MusicCategories[]; message?: string }> {
    try {
      const categoryRepo = AppDataSource.getRepository(MusicCategories);
      const categories = await categoryRepo.find();
      return { success: true, data: categories };
    } catch (error) {
      console.error('Error getting all categories:', error);
      return { success: false, message: 'Error getting all categories' };
    }
  }

  public async createNewCategory(data: CategoryData): Promise<{ success: boolean; data?: MusicCategories; message?: string }> {
    try {
      const categoryRepo = AppDataSource.getRepository(MusicCategories);
      const category = categoryRepo.create(data);
      await categoryRepo.save(category);
      return { success: true, data: category };
    } catch (error) {
      console.error('Error creating new category:', error);
      return { success: false, message: 'Error creating new category' };
    }
  }

  public async deleteCategory(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      const categoryRepo = AppDataSource.getRepository(MusicCategories);
      const deleteResult = await categoryRepo.delete(id);

      if (deleteResult.affected === 0) {
        return { success: false, message: 'Category not found' };
      }

      return { success: true, message: 'Category successfully deleted' };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, message: 'Error deleting category' };
    }
  }
}