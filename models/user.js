var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	passwordConf: String,
	class:String,
	studentId:Number,
	picture:String,
	contact:String,
	description:String,
	star:Number
	
}),
User = mongoose.model('User', userSchema);

module.exports = User;