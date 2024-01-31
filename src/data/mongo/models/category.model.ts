import mongoose, { Schema } from 'mongoose';

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	available: {
		type: Boolean,
		default: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

export const CategoryModel = mongoose.model('Category', categorySchema);
