import { ProductModel } from '../../data';
import { CreateProductDto, CustomError, PaginationDto } from '../../domain';

export class ProductService {
	constructor() {}
	async getAll(paginationDto: PaginationDto) {
		const { page, limit } = paginationDto;

		try {
			const [products, total] = await Promise.all([
				ProductModel.countDocuments(),
				ProductModel.find()
					.skip((page - 1) * limit)
					.limit(limit),
			]);

			return {
				page,
				limit,
				total,
				next: `api/products?page=${page + 1}&limit=${limit}`,
				prev:
					(page - 1) * limit > 0
						? `api/products?page=${page - 1}&limit=${limit}`
						: null,
				products,
			};
		} catch (error) {}
	}

	async create(createProductDto: CreateProductDto) {
		const productExists = await ProductModel.findOne({
			name: createProductDto.name,
		});
		if (productExists) throw CustomError.badRequest('Product already exists');

		try {
			const product = new ProductModel(createProductDto);

			await product.save();

			return product;
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}
}