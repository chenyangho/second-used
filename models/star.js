var mongoose = require('mongoose');
var Schema = mongoose.Schema;

starSchema = new Schema( {
	unique_id: Number,
	username: String,
	star:Number
	
}),
Star = mongoose.model('Star', starSchema);

module.exports = Star;