import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { Uuid } from '../../config';

export class FileUploadService {
	constructor(private readonly uuid = Uuid.v4) {}

	private checkFolder(folderPath: string) {
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath);
		}
	}

	async uploadSingle(
		file: UploadedFile,
		folder: string = 'uploads',
		validExtensions: string[] = ['jpg', 'png', 'jpeg', 'gif']
	) {
		try {
			const fileExtension = file.mimetype.split('/').at(1);
			const destination = path.resolve(__dirname, '../../../', folder);
			this.checkFolder(destination);

			const fileName = `${this.uuid()}.${fileExtension}`;

			file.mv(`${destination}/${fileName}`);

			return {
				fileName,
				destination,
				extension: fileExtension,
				mimetype: file.mimetype,
				size: file.size,
			};
		} catch (error) {
			console.log(error);
		}
	}

	async uploadMultiple(
		file: any[],
		folder: string = 'uploads',
		validExtensions: string[] = ['jpg', 'png', 'jpeg', 'gif']
	) {}
}
