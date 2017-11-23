var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var groupSchema = new Schema({
groupName:String,
groupMembers:JSON,
groupAdmin:JSON,
groupProfilePicture:String
});
var group = mongoose.model('group',groupSchema);
module.exports = group;