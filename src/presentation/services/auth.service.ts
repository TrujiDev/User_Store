import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import {
	CustomError,
	RegisterUserDto,
	UserEntity,
	LoginUserDto,
} from '../../domain';
import { EmailService } from './email.service';

export class AuthService {
	constructor(private readonly emailService: EmailService) {}

	public async registerUser(registerUserDto: RegisterUserDto) {
		const existUser = await UserModel.findOne({ email: registerUserDto.email });
		if (existUser) throw CustomError.badRequest('User already exists');

		try {
			const user = new UserModel(registerUserDto);

			user.password = bcryptAdapter.hash(registerUserDto.password);

			await user.save();

			await this.sendEmailVerification(user.email);

			const { password, ...userEntity } = UserEntity.fromObject(user);

			const token = await JwtAdapter.generateToken({
				id: user._id,
			});
			if (!token) throw CustomError.internalServer('Error generating token');

			return { user: userEntity, token };
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}

	public async loginUser(loginUserDto: LoginUserDto) {
		const user = await UserModel.findOne({ email: loginUserDto.email });
		if (!user) throw CustomError.badRequest('Invalid credentials');

		const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password);
		if (!isMatch) throw CustomError.badRequest('Invalid credentials');

		const { password, ...userEntity } = UserEntity.fromObject(user);

		const token = await JwtAdapter.generateToken({
			id: user._id,
		});
		if (!token) throw CustomError.internalServer('Error generating token');

		return { user: userEntity, token };
	}

	private async sendEmailVerification(email: string) {
		const token = await JwtAdapter.generateToken({ email });
		if (!token) throw CustomError.internalServer('Error generating token');

		const url = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
		const html = `
			<p>Click <a href="${url}">here</a> to validate your email</p>
		`;

		const mailOptions = {
			to: email,
			subject: 'Email validation',
			htmlBody: html,
		};

		const isSent = await this.emailService.sendEmail(mailOptions);
		if (!isSent) throw CustomError.internalServer('Error sending email');

		return true;
	}

	public async validateEmail(token: string) {
		const payload = await JwtAdapter.validateToken(token);
		if (!payload) throw CustomError.unauthorized('Invalid token');

		const { email } = payload as { email: string };
		if (!email) throw CustomError.internalServer('Email not in token');

		const user = await UserModel.findOne({ email });
		if (!user) throw CustomError.internalServer('User not found');

		user.validatedEmail = true;
		await user.save();
	}
}
