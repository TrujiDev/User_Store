import { UserModel } from '../../data';
import { RegisterUserDto } from '../../domain';

export class AuthService {
	constructor() {}

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) return { error: 'User already exists' };

        return 'Alrigth!'
    }
}
