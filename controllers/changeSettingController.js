var users = require('../models/userModel');
var message = require('../models/messageModel');
var group =  require('../models/groupModel');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var fs = require('fs');
var express = require('express');
module.exports = function(app){
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(session({secret: "Shh, its a secret!"}));   
  app.get('/getGeneralDetails',function(req,res){
  users.find({email:req.session.email},function(err,data){
   if(err){
       res.status(401).send('Error getting details');
   }
   else if(data === undefined)
   {
       res.status(401).send('No details available');
   }
   else{
        res.status(200).send(data[0]);
      }
});
});
app.put('/addMembers',function(req,res){
  group.update({groupName:req.body.groupName},{$pushAll:{groupMembers:req.body.newMembers}},function(err,data){
    if(err){
          throw err;
        }
        else{
          res.status(200).send('Successfully added');
        }
  });  
});
app.put('/deleteMembers',function(req,res){
  var emails = [];
  group.update({groupName:req.body.groupName},{$pullAll:{groupMembers:req.body.deleteMembers}},function(err,data){
    if(err){
      res.status(401).send('Error deleting the group Members');
      }
      else{
        res.status(200).send('Succesfully removed');
      }
}); 
});
app.put('/changeGeneral',function(req,res){
  users.update({email:req.session.email},{$set:{firstName:req.body.firstName,lastName:req.body.lastName,email:req.body.email}},function(err,data){
  if(err){
     res.status(401).send('Error changing details');
  }
  else{
      req.session.email = req.body.email;
      res.status(200).send('Successfully updated');
  }
});
});
app.post('/checkAdmin',function(req,res){
  group.find({groupName:req.body.groupName,'groupAdmin.email':req.session.email},function(err,data){
    if(err){
        throw err;
      }
    else if(data.length === 0){
      res.status(200).send('N');
      }
    else{
      res.status(200).send('Y');
      }
  });
});
app.post('/addDeleteMembers',function(req,res){
 var members = [];
   users.find({email:{$ne:req.session.email}},{email:1, firstName:1,lastName:1,_id:0},function(err,user){
     if(err)
        throw err;
    else{
      for(var i = 0; i<user.length; i++){
        members.push({
           email:user[i].email,
           name:user[i].firstName+' '+user[i].lastName
        });
      }
group.find({groupName:req.body.groupName},{groupMembers:1,_id:0},function(err,data){
     if(err)
       throw err;
      else{
       data[0].groupMembers = data[0].groupMembers.filter(function(e){
          return e.email !== req.session.email ;
       });
          res.status(200).json({
            members:members,
            present:data[0].groupMembers
          });
      }
  });
    }
   });
});
app.put('/changePassword',function(req,res){
  users.update({email:req.session.email,password:req.body.oldPassword},{$set:{password:req.body.newPassword}},function(err,data){
    if(err){
      res.status(401).send('Error changing password');
    }
    else if(data){
      req.session.destroy();
      res.status(200).send('Password successfully changed');
    }
    else{
      res.status(401).send('Invalid credentials');
    }
});
});
app.put('/changeGroupName',function(req,res){
  group.update({groupName:req.body.oldGroupName},{$set:{groupName:req.body.newGroupName}},function(err){
    if(err){
       throw err;
    }
    else{
      res.status(200).send('Successfully Updated');
    }
});
});
app.put('/changeGroupProfilePicture',function(req,res){
  var fileList = [], unique = false,counter=0;
  fs.readdirSync('./files/').forEach(file =>{
    fileList.push(file);
  });
  while(unique === false){
   if(fileList.indexOf(req.body.file)>-1){
     counter++;
     if(req.body.file.indexOf('(')>-1)
     {
       req.body.file = req.body.file.replace(req.body.file.substring(req.body.file.lastIndexOf('(')+1,req.body.file.lastIndexOf(')')),counter);
     }
     else{
       req.body.file = req.body.file.substring(0,req.body.file.lastIndexOf('.'))+'('+counter+')'+req.body.file.substr(req.body.file.lastIndexOf('.'));
     }
   }
   else{
     unique = true;
   }
}
 var base64Data = req.body.fileData.split(',').pop();
 fs.writeFile('./files/'+req.body.file,base64Data,'base64',function(err){
 });
 req.body.groupProfilePicture = '/file/'+req.body.file;
 group.update({groupName:req.body.groupName},{$set:{groupProfilePicture:req.body.groupProfilePicture}},function(err){
 if(err){
    res.status(401).send('Error changing group Profile Picture');
 }
 else{
   group.find({groupName:req.body.groupName},function(err,data){
    if(err){
    throw err;
    }
    else{
    res.status(200).send(data);
    }
  });
 }
});
});
app.put('/changeProfilePicture',function(req,res){
  var fileList = [], unique = false,counter=0;
  fs.readdirSync('./files/').forEach(file =>{
    fileList.push(file);
  });
  while(unique === false){
   if(fileList.indexOf(req.body.file)>-1){
     counter++;
     if(req.body.file.indexOf('(')>-1){
       req.body.file = req.body.file.replace(req.body.file.substring(req.body.file.lastIndexOf('(')+1,req.body.file.lastIndexOf(')')),counter);
     }
     else{
       req.body.file = req.body.file.substring(0,req.body.file.lastIndexOf('.'))+'('+counter+')'+req.body.file.substr(req.body.file.lastIndexOf('.'));
     }
   }
   else{
     unique = true;
   }
}
  var base64Data = req.body.fileData.split(',').pop();
  fs.writeFile("./files/"+req.body.file, base64Data, 'base64', function(err) {
  });
  req.body.profilePicture = '/file/'+req.body.file;
  users.update({email:req.session.email},{$set:{profilePicture:req.body.profilePicture}},function(err,data){
  if(err){
    res.status(401).send('Error updating Profile Picture');
  }
  else{
    req.session.profilePicture = req.body.profilePicture;
    res.status(200).send('Successfully Updated!');
  }
});
});
}