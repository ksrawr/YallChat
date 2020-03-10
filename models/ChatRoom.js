const mongoose = require('mongoose');
const Message = require('./Message');
const Schema = mongoose.Schema;

const ChatRoomSchema = Schema({
	name: {
		type: String,
		required: [true, 'ChatRoom requires a name']
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		}
	],
	messages: [Message.schema],
	date: {
		type: Date,
		default: Date.now
	}
})

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;