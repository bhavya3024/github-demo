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
  app.get('/signUp',function(req,res){
    res.sendfile('signUp.html');
    });
    app.get('/',function(req,res){
     if(req.session.email){
       res.redirect('http://localhost:8080/user/profile.html');
     }
     else{
       res.redirect('http://localhost:8080/main/welcome.html');
     }
    });
    app.get('/logOut',function(req,res){
    req.session.destroy();
    res.status(200).send();
  });
app.post('/authenticate',function(req,res){    
  users.find({email:req.body.email,password:req.body.password},function(err,response){
       if(err){
         throw err;
        res.status(401);
        res.end();
      }else if(!err){
        if(response.length > 0){
          req.session.email = req.body.email;
          req.session.name = response[0].firstName +' '+response[0].lastName;
          req.session.id = response[0]._id;
          req.session.profilePicture = response[0].profilePicture;
          res.status(200).send();
        }
        else{
          res.status(401).send('Invalid credentials');
          res.end();
        }
      }
    });
});
app.post('/register',function(req,res){
  group.find(function(err,groups){
    console.log(groups);
     var groupCheck = [],groupName,groupJSON={};
    for(var i = 0; i<groups.length;i++){
        groupName  = groups[i].groupName;
          groupJSON[groupName] = -1;
       groupCheck.push(groupJSON);
    }
users.findOne({email:req.body.email},function(err,data){
var user = new users({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        password:req.body.password,
        profilePicture:'http://localhost:8080/file/default-profile.png',
     });
     if(err)
     {
       res.status(401).send('Error creating account');
     }
     else{
   if(data === null)
   {
    user.save(function(err){
      res.status(200).send('New account has been created');
     });
   }
   else{
     res.status(401).send('Email already exists');
   }
  }
});
  });
});
}