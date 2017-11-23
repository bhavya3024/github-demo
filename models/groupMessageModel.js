var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var groupMessageSchema = new Schema({
groupName:String,
from:JSON,
groupMembers:[{
    email:String,
    name:String
}],
groupMessage:String,
link:String,
date:String
});

var groupMessage = mongoose.model('groupMessage',groupMessageSchema);
module.exports = groupMessage;