var mongoose = require('mongoose');
var Schema = mongoose.Schema;
bookSchema = new Schema( {
	
	unique_id: Number,
	bookname: String,
	owner:String,
	price:Number,
    picture:String,
    sold:Number,
	genre:Number,
	description:String,
	buyer:String,
}),

Book = mongoose.model('Book', bookSchema);

module.exports = Book;