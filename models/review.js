var mongoose = require('mongoose');
var Schema = mongoose.Schema;
reviewSchema = new Schema( {
	
	unique_id: Number,
    user:String,
	review:String,
	date:String,
	writer:String,
    star:Number
}),

Review = mongoose.model('Review', reviewSchema);

module.exports = Review;