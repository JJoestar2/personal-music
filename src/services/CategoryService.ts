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
    getCategories(): Promise<IServiceResponse<MusicCategories[]>>;
    addCategory(data: CategoryData): Promise<IServiceResponse<MusicCategories>>;
    deleteCategory(categoryId: number): Promise<IServiceResponse<null>>;
}

@injectable()
export default class CategoryService implements ICategoryService {
    constructor(@inject(TYPES.CategoryRepository) private repository: CategoryRepository) {}

    public async getCategories(): Promise<IServiceResponse<MusicCategories[]>> {
        try {
            const response = await this.repository.getAllCategories();
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