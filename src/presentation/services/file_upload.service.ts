export class FileUploadService {
	constructor() {}

	private checkFolder(folderPath: string) {
		throw new Error('Method not implemented.');
	}

	public uploadSingle(
		file: any,
		folder: string = 'uploads',
		validExtensions: string[] = ['jpg', 'png', 'jpeg', 'gif']
	) {}

	public uploadMultiple(
		file: any[],
		folder: string = 'uploads',
		validExtensions: string[] = ['jpg', 'png', 'jpeg', 'gif']
	) {}
}
