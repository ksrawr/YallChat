const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = Schema({
	content: {
		type: String,
		required: [true, "Blank message cannot be sent"]
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;