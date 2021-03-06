const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
	name: {
		type: String,
		required: [true, 'Name is required']
	},
	email: {
		type: String, 
		required: [true, 'Email is required'],
		unique: true
	},
	password: {
		type: String,
		required: [true, 'Password is required']
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	chatrooms: [
		{
			type: Schema.Types.ObjectId,
			ref: 'ChatRoom'
		}
	],
})

UserSchema.set("toJSON", {
	transform: (doc, ret, opt) => {
		delete ret["password"];
		return ret
	}
})

const User = mongoose.model('User', UserSchema);

module.exports = User;