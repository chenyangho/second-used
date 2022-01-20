var mongoose = require('mongoose');
var Schema = mongoose.Schema;
reminderSchema = new Schema( {
	unique_id: Number,
    user:String,
	date:String,
    content:String,
    group:String,
    sender:String
}),

Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;