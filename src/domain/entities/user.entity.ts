import { CustomError } from '../errors/custom.error';

export class UserEntity {
	constructor(
		public id: string,
		public name: string,
		public email: string,
		public validatedEmail: boolean,
		public password: string,
		public role: string[],
		public avatar?: string
	) {}

	static fromObject(object: { [key: string]: any }) {
		const { id, _id, name, email, validatedEmail, password, role, avatar } =
			object;

		if (!id && !_id) {
			throw CustomError.badRequest('Missing id');
		}

		if (!name) throw CustomError.badRequest('Missing name');
		if (!email) throw CustomError.badRequest('Missing email');
		if (validatedEmail === undefined)
			throw CustomError.badRequest('Missing validatedEmail');
		if (!password) throw CustomError.badRequest('Missing password');
		if (!role) throw CustomError.badRequest('Missing role');

		return new UserEntity(
			id || _id,
			name,
			email,
			validatedEmail,
			password,
			role,
			avatar
		);
	}
}
