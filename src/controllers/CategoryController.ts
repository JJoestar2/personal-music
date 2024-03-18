import express from 'express';
import { injectable, inject } from "inversify";
import { RegistrableController } from "./RegistrableController";
import CategoryService from '../services/CategoryService';
import TYPES from '../types';

@injectable()
class CategoryController implements RegistrableController {
    constructor(@inject(TYPES.CategoryService) private service: CategoryService) {}
    public register(app: express.Application): void {
        app.route('/category')
        .get(async (req: express.Request, res: express.Response) => {
            try {
                const { page, limit } = req.query;
                const result = await this.service.getCategories(Number(page || 1), Number(limit || 10));
                result.success ? res.json(result) : res.status(404).json(result);
            } catch (error) {
                console.error('Error getting categories:', error);
                res.status(500).json({ success: false, message: 'Error getting categories' });
            }
        })
        .post(async (req: express.Request, res: express.Response) => {
            const { name } = req.body;
            try {
                const result = await this.service.addCategory({ name });
                result.success ? res.status(201).json(result) : res.status(400).json(result);
            } catch (error) {
                console.error('Error adding category:', error);
                res.status(500).json({ success: false, message: 'Error adding category' });
            }
        })

        app.route('/category/:id')
        .delete(async (req: express.Request, res: express.Response) => {
            const { id } = req.params;
            try {
                const result = await this.service.deleteCategory(parseInt(id));
                result.success ? res.json(result) : res.status(404).json(result);
            } catch (error) {
                console.error('Error deleting soundtrack:', error);
                res.status(500).json({ success: false, message: 'Error deleting soundtrack' });
            }
        });
    }
}

export default CategoryController;