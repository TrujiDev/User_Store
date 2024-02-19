import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { Uuid } from '../../config';
import { CustomError } from '../../domain';
import e from 'express';

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
			const fileExtension = file.mimetype.split('/').at(1) ?? '';
			if (!validExtensions.includes(fileExtension)) {
				throw CustomError.badRequest(
					`Invalid file extension. Valid extensions are: ${validExtensions.join(
						', '
					)}`
				);
			}
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
			throw error;
		}
	}

	async uploadMultiple(
		file: any[],
		folder: string = 'uploads',
		validExtensions: string[] = ['jpg', 'png', 'jpeg', 'gif']
	) {}
}
