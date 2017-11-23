var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
fromUser:String,
toUser:String,
fromName:String,
toName:String,
message:String,
date:String,
link:String
});
var message = mongoose.model('messages',messageSchema);
module.exports = message;
