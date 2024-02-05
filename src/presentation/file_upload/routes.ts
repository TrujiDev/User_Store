import { Router } from 'express';
import { FileUploadController } from './controller';

export class FileUploadRoutes {
	static get routes(): Router {
		const router = Router();

		const fileUploadController = new FileUploadController();

		router.post('/single/:type', fileUploadController.uploadFile);
		router.post('/multiple/:type', fileUploadController.uploadMultipleFiles);

		return router;
	}
}
