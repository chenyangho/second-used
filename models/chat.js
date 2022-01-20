var mongoose = require('mongoose');
var Schema = mongoose.Schema;
chatSchema = new Schema( {
	
	unique_id: Number,
	username1: String,
    username2:String,
	date:String,
	content:String,
	
	
}),

Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;