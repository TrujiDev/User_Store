import { Request, Response } from 'express';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.service';

export class AuthController {
	constructor(public readonly authService: AuthService) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message });
		}

		console.log(`${error}`);
		return res.status(500).json({ error: 'Internal server error' });
	};

	loginUser = (req: Request, res: Response) => {
		const [error, loginDto] = LoginUserDto.create(req.body);
		if (error) return res.status(400).json({ message: error });

		this.authService
			.loginUser(loginDto!)
			.then(user => res.json(user))
			.catch(error => this.handleError(error, res));
	};

	registerUser = (req: Request, res: Response) => {
		const [error, registerDto] = RegisterUserDto.create(req.body);
		if (error) return res.status(400).json({ message: error });

		this.authService
			.registerUser(registerDto!)
			.then(user => res.json(user))
			.catch(error => this.handleError(error, res));
	};

	validateEmail = (req: Request, res: Response) => {
		const { token } = req.params;

		this.authService
			.validateEmail(token)
			.then(() => res.json('Email was validated properly'))
			.catch(error => this.handleError(error, res));
	};
}
