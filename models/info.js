var mongoose = require('mongoose');
var Schema = mongoose.Schema;
infoSchema = new Schema( {
	
	unique_id: Number,
	exam: Number,
	exam_name:String,
	topic: String,
	review:String,
	date:String,
	writer:String,
	writer_id:Number,
	points:Number,
	exam_count:Number,
	study_period:String,
	used_book:String,
	study_style:String,
	advice:String,
	next_target:String,
}),

Info = mongoose.model('Info', infoSchema);

module.exports = Info;