import { regularExps } from '../../../config/regular-exp';

export class LoginUserDto {
	private constructor(
		public readonly email: string,
		public readonly password: string
	) {}

	static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
		const { name, email, password } = object;

		if (!email) return ['Missing email'];
		if (!regularExps.email.test(email)) return ['Invalid email'];
		if (!password) return ['Missing password'];
		if (password.length < 8)
			return ['Password must be at least 8 characters long'];

		return [undefined, new LoginUserDto( email, password)];
	}
}
