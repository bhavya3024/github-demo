var users = require('../models/userModel');
var message = require('../models/messageModel');
var group =  require('../models/groupModel');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var fs = require('fs');
module.exports = function(app,io){
 io.on('connection',function(socket){
    socket.on('room',function(data){
   socket.join(data);
  });
    socket.on('sendMessage',function(data){
        var msg  = new message({
          fromUser:data.fromEmail,
          toUser:data.toEmail,
          fromName:data.fromName,
          toName:data.toName,
          message:data.message,
          date:data.date,
          link:data.link
        });
        msg.save(function(err){
       if(err)
       {
         socket.emit('error');
       }
       else{
         if(data.fromEmail<data.toEmail)
         room = data.fromEmail+data.toEmail;
         else room = data.toEmail+data.fromEmail;
         io.in(room).emit('newMessage',data);
       }
      });
});
socket.on('loadMessages',function(data){ 
 message.find({$or:[{fromUser:data.from,toUser:data.to},{fromUser:data.to,toUser:data.from}]}).sort({date:1}).exec(function(err,res){
 if(err){
 }
 else{
   socket.emit('messages',res);
 }
});
});
socket.on('sendFile',function(data){
  var fileList = [], unique = false,counter=0;
  fs.readdirSync('./files/').forEach(file =>{
    fileList.push(file);
  });
  while(unique === false){
   if(fileList.indexOf(data.fileName)>-1){
     counter++;
     if(data.fileName.indexOf('(')>-1){
       data.fileName = data.fileName.replace(data.fileName.substring(data.fileName.lastIndexOf('(')+1,data.fileName.lastIndexOf(')')),counter);
     }
     else{
       data.fileName = data.fileName.substring(0,data.fileName.lastIndexOf('.'))+'('+counter+')'+data.fileName.substr(data.fileName.lastIndexOf('.'));
     }
   }
   else{
     unique = true;
   }
} 
    var base64Data = data.file.split(',').pop();
    fs.writeFile("./files/"+data.fileName, base64Data, 'base64', function(err) {
    });
    socket.emit('newFileName',data.fileName);
  });
});
}

