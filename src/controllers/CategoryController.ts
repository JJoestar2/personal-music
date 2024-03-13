import express from 'express';
import { injectable, inject } from "inversify";
import { RegistrableController } from "./RegistrableController";
import CategoryService from '../services/CategoryService';
import TYPES from '../types';

@injectable()
class CategoryController implements RegistrableController {
    constructor(@inject(TYPES.CategoryService) private service: CategoryService) {}
    public register(app: express.Application): void {
        app
        .route('/category')
        .get(async(req: express.Request, res: express.Response) => {
            const categories = await this.service.getCategories();
            if (categories) res.json(categories);
        })
        .post(async(req: express.Request, res: express.Response) => {
            const { name } = req.body;
            const category = await this.service.addCategory({ name });
            if (category) {
                res.json(category);  
            }
        });
    }
}

export default CategoryController;