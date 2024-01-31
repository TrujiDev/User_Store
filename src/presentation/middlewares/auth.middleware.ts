import { NextFunction, Request, Response } from 'express';
import { UserEntity } from '../../domain';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data';

export class AuthMiddleware {
	
	static async validateJwt(req: Request, res: Response, next: NextFunction) {
		const authorization = req.header('Authorization');
		if (!authorization) return res.status(401).json({ error: 'Unauthorized' });
		if (!authorization.startsWith('Bearer '))
			return res.status(401).json({ error: 'Invalid Bearer Token' });
		const token = authorization.split(' ').at(1) || '';

		try {
			const payload = await JwtAdapter.validateToken<{ id: string }>(token);
			if (!payload) return res.status(401).json({ error: 'Invalid token' });

			const user = await UserModel.findById(payload.id);
			if (!user) return res.status(401).json({ error: 'User not found' });

			req.body.user = UserEntity.fromObject(user);
			const userReq = req.body.user;

			next();
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
}
