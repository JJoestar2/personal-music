import { injectable, inject } from 'inversify';
import CategoryRepository, { CategoryData } from '../repositories/CategoryRepository';
import { MusicCategories } from '../entity';
import TYPES from '../types';

export interface ICategoryService {
    getCategories(): Promise<MusicCategories[]>;
    addCategory(data: CategoryData): Promise<MusicCategories>;
    deleteCategory(categoryId: number): Promise<void>;
}

@injectable()
export default class CategoryService implements ICategoryService {
    constructor(@inject(TYPES.CategoryRepository) private repository: CategoryRepository) {}

    public async getCategories(): Promise<MusicCategories[]> {
        const categories = await this.repository.getAllCategories();
        return categories;
    }

    public async addCategory(data: CategoryData): Promise<MusicCategories> {
        const category = await this.repository.createNewCategory(data);
        return category;
    }

    public async deleteCategory(categoryId: number): Promise<void> {
        return await this.repository.deleteCategory(categoryId);
    }
}