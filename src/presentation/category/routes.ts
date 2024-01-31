import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';

export class CategoryRoutes {
	static get routes(): Router {
		const router = Router();

		const categoryService = new CategoryService();

		const categoryController = new CategoryController(categoryService);

		router.post('/', categoryController.createCategory);
		router.get(
			'/',
			[AuthMiddleware.validateJwt],
			categoryController.getCategories
		);

		return router;
	}
}
