import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file_upload.service';

export class FileUploadRoutes {
	static get routes(): Router {
		const router = Router();

		const fileUploadService = new FileUploadService();
		const fileUploadController = new FileUploadController(fileUploadService);

		router.post('/single/:type', fileUploadController.uploadFile);
		router.post('/multiple/:type', fileUploadController.uploadMultipleFiles);

		return router;
	}
}
