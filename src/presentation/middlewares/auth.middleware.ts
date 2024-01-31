import { NextFunction, Request, Response } from 'express';
import { CustomError, UserEntity } from '../../domain';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data';

export class AuthMiddleware {
	static async validateJwt(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization;
		if (!authHeader) return CustomError.unauthorized('Token not provided');
		if (!authHeader.startsWith('Bearer '))
			return CustomError.badRequest('Invalid token');
		const token = authHeader.split(' ').at(1) || '';

		try {
			const payload = await JwtAdapter.validateToken<{ id: string }>(token);
			if (!payload) return CustomError.unauthorized('Invalid token');

			const user = await UserModel.findById(payload.id);
			if (!user) return CustomError.unauthorized('Invalid token');

			req.body.user = UserEntity.fromObject(user);

			next();
		} catch (error) {
			console.log(error);
			return CustomError.internalServer('Internal server error');
		}
	}
}
