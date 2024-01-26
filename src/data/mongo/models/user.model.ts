import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
	},
	validatedEmail: {
		type: Boolean,
		default: false,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
	},
	avatar: {
		type: String,
	},
	role: {
		type: [String],
		enum: ['ADMIN', 'USER'],
		default: 'USER',
	},
});

export const UserModel = mongoose.model('User', userSchema);
