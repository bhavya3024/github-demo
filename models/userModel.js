var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
firstName:String,
lastName:String,
email:String,
password:String,
profilePicture:String,
groups:JSON
});
var users = mongoose.model('users',userSchema);
module.exports = users;