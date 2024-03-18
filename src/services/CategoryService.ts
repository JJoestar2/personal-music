import { injectable, inject } from 'inversify';
import CategoryRepository, { CategoryData } from '../repositories/CategoryRepository';
import { MusicCategories } from '../entity';
import TYPES from '../types';

interface IServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}  
export interface ICategoryService {
    getCategories(page: number, limit: number): Promise<IServiceResponse<{categories: MusicCategories[], total: number}>>;
    addCategory(data: CategoryData): Promise<IServiceResponse<MusicCategories>>;
    deleteCategory(categoryId: number): Promise<IServiceResponse<null>>;
}

@injectable()
export default class CategoryService implements ICategoryService {
    constructor(@inject(TYPES.CategoryRepository) private repository: CategoryRepository) {}

    public async getCategories(page: number = 1, limit: number = 10): Promise<IServiceResponse<{categories: MusicCategories[], total: number}>> {
        try {
            const response = await this.repository.getAllCategories(page, limit);
            return { success: true, data: response.data, message: response.message };
        } catch (error) {
            console.error('Error getting categories:', error);
            return { success: false, message: 'Failed to retrieve categories' };
        }
    }

    public async addCategory(data: CategoryData): Promise<IServiceResponse<MusicCategories>> {
        try {
            const response = await this.repository.createNewCategory(data);
            if (!response.success) {
                return { success: false, message: response.message };
            }
            return { success: true, data: response.data, message: 'Category successfully added' };
        } catch (error) {
            console.error('Error adding category:', error);
            return { success: false, message: 'Failed to add category' };
        }
    }

    public async deleteCategory(categoryId: number): Promise<IServiceResponse<null>> {
        try {
            const response = await this.repository.deleteCategory(categoryId);
            if (!response.success) {
                return { success: false, message: response.message };
            }
            return { success: true, message: 'Category successfully deleted' };
        } catch (error) {
            console.error('Error deleting category:', error);
            return { success: false, message: 'Failed to delete category' };
        }
    }
}