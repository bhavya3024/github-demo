var users = require('../models/userModel');
var message = require('../models/messageModel');
var group =  require('../models/groupModel');
var groupMessage = require('../models/groupMessageModel');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var fs = require('fs');
module.exports = function(app,io){
io.on('connection',function(socket){
  socket.on('groupRoom',function(data){
    socket.join(data);
});
socket.on('loadGroupMessage',function(data){
  groupMessage.find({groupName:data},function(err,data){
    if(err){
    }
    else{
      socket.emit('groupMessages',data);
    }
  });
});
socket.on('groupMessage',function(data){
  group.find({groupName:data.groupName},function(err,res){
    if(err){
      throw err;
    }
    else if(res === undefined){
    }
    else{
      var grpMsg = new groupMessage({
       groupName:data.groupName,
       from:data.from,
       groupMembers:res[0].groupMembers,
       groupMessage:data.message,
       link:data.link,
       date:data.date
      });
      console.log(grpMsg);
      grpMsg.save(function(err){
       if(err){
         throw err;
       }
       else{
         console.log('saved');
         io.in(grpMsg.groupName).emit('newGroupMessage',grpMsg);
       }
     });
    }
 });  
});
});
}

