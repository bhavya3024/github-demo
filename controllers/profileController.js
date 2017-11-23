var users = require('../models/userModel');
var message = require('../models/messageModel');
var group =  require('../models/groupModel');
var groupMessage = require('../models/groupMessageModel');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var fs = require('fs');
var express = require('express');
module.exports = function(app){
    app.get('/contacts',function(req,res){
        users.find({email:{$ne:req.session.email}},function(err,data){
           if(err){
             res.send(401).send('error');
           }
           else if (data === null){
           }
           else{
             res.status(200).json({
              contacts:data,
              currentEmail:req.session.email,
              currentName:req.session.name,
              profilePicture:req.session.profilePicture
             });
           }
       });
      });
     app.get('/showMembers',function(req,res){
       users.find({email:{$ne:req.session.email}},function(err,data){
       if(err){
         res.status(401).send('Error creating group');
       }
       else{
         res.status(200).json(data);
       }
     });
     });
     app.get('/showGroups',function(req,res){
      group.find({groupMembers:{$elemMatch:{email:req.session.email}}}, function(err,groups){
        if(err){
            res.status(401).send('Error finding groups');
        }
        else if(groups === undefined){
            res.status(401).send('No Groups');
        }
        else{
                res.status(200).send(groups);
        }
    });
    });
     app.post('/createGroup',function(req,res){
       group.find({groupName:req.body.name},function(err,data){ 
        if(err){
          res.status(401).send(err);
        }
        else if(data.length > 0){
          res.status(401).send('Group Name already exists');
        }
        else{
          req.body.members.push({
            name:req.session.name,
            email:req.session.email,
         });
        var grp = new group({
          groupName:req.body.name,
          groupMembers:req.body.members,
          groupAdmin:{
            name:req.session.name,
            email:req.session.email
          },
          groupProfilePicture:'/file/default-profile.png'
        });
        grp.save(function(err){
       if(err){
          res.stauts(401).send(err);
        }
       else{
         for(var i = 0;i<req.body.members.length;i++){
           users.update({email:req.body.members[i].email},{$pushAll:{groups:[req.body.name]}},function(err,data){
             if(err){
               res.status(401).send('Error creating group');
             }
           });
         }
         res.status(200).send('New group has been created');
       }
       });
        }
      });
});
}
