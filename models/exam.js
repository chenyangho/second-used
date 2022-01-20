var mongoose = require('mongoose');
var Schema = mongoose.Schema;
examSchema = new Schema( {
	
	unique_id: Number,
	name: String,
	price:Number, 
    picture:String,
    difficulty:Number,
    pass_rate:Number,
    time_need:Number,
    valuable:Number,
    return_rate:Number,
    date:String,
    web:String,
    info:String,
    length:Number,
    pass_percent:Number,
    exam_way:String,

}),

Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;