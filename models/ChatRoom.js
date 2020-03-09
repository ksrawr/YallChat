const mongoose = require('mongoose');
Const Message = require('./Message');
const Schema = mongoose.Schema;

const ChatRoomSchema = Schema({
	name: {
		type: String,
		required: [true, 'ChatRoom requires a name']
	},
	author: {
		type: Schema.Type.ObjectId,
		ref: 'User'
	},
	users: [
		{
			type: Schema.Type.ObjectId,
			ref: 'User',
		}
	],
	messages: [Message.schema]
})

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;