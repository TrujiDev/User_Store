import { CategoryModel } from '../../data';
import {
	CreateCategoryDto,
	CustomError,
	PaginationDto,
	UserEntity,
} from '../../domain';

export class CategoryService {
	// DI
	constructor() {}

	async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
		const categoryExists = await CategoryModel.findOne({
			name: createCategoryDto.name,
		});
		if (categoryExists) throw CustomError.badRequest('Category already exists');

		try {
			const category = new CategoryModel({
				...createCategoryDto,
				user: user.id,
			});

			await category.save();

			return {
				id: category.id,
				name: category.name,
				available: category.available,
			};
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	async getCategories(paginationDto: PaginationDto) {
		const { page, limit } = paginationDto;
		try {
			const [totalCategories, categories] = await Promise.all([
				CategoryModel.countDocuments(),
				CategoryModel.find()
					.skip((page - 1) * limit)
					.limit(limit),
			]);

			return {
				page,
				limit,
				totalCategories,
				next:
					(page + 1) * limit < totalCategories
						? `api/categories?page=${page + 1}&limit=${limit}`
						: null,
				prev:
					page - 1 > 0 ? `api/categories?page=${page - 1}&limit=${limit}` : null,
				categories: categories.map(category => ({
					id: category.id,
					name: category.name,
					available: category.available,
				})),
			};
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}
}
