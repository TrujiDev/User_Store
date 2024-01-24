import { Request, Response } from 'express';

export class AuthController {
	constructor() {}

	loginUser = (req: Request, res: Response) => {
		res.json({ message: 'login' });
	};

	registerUser = (req: Request, res: Response) => {
		res.json({ message: 'register' });
	};

	validateEmail = (req: Request, res: Response) => {
		res.json({ message: 'validate-email' });
	};
}
