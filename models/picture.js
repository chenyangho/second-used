var mongoose = require('mongoose');
var Schema = mongoose.Schema;
pictureSchema = new Schema( {
	
	unique_id: Number,
	link: String,
	
}),

Picture = mongoose.model('Picture', pictureSchema);

module.exports = Picture;