import { Router } from 'express';
import { CategoryController } from './controller';

export class CategoryRoutes {
	static get routes(): Router {
		const router = Router();

		const categoryController = new CategoryController();

		router.post('/', categoryController.createCategory);
		router.get('/', categoryController.getCategories);

		return router;
	}
}
