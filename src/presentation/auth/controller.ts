import { Request, Response } from 'express';
import { CustomError, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.service';

export class AuthController {
	constructor(public readonly authService: AuthService) {}

	private handleError = (error: Error, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message });
		}

		console.log(`${error}`);
		return res.status(500).json({ error: error.message });
	};

	loginUser = (req: Request, res: Response) => {
		res.json({ message: 'login' });
	};

	registerUser = (req: Request, res: Response) => {
		const [error, registerDto] = RegisterUserDto.create(req.body);
		if (error) return res.status(400).json({ message: error });

		this.authService.registerUser(registerDto!)
			.then(user => res.json(user))
			.catch(error => this.handleError(error, res));
	};

	validateEmail = (req: Request, res: Response) => {
		res.json({ message: 'validate-email' });
	};
}
