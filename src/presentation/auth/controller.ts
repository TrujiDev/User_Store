import { Request, Response } from 'express';
import { RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.service';

export class AuthController {
	constructor(public readonly authService: AuthService) {}

	loginUser = (req: Request, res: Response) => {
		res.json({ message: 'login' });
	};

	registerUser = (req: Request, res: Response) => {
		const [error, registerDto] = RegisterUserDto.create(req.body);
		if (error) return res.status(400).json({ message: error });

		this.authService.registerUser(registerDto!)
			.then(user => res.json(user))
	};

	validateEmail = (req: Request, res: Response) => {
		res.json({ message: 'validate-email' });
	};
}
