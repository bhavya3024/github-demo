var express = require('express');
var app = express();
var mongoose = require('mongoose');
var port = process.env.port;
mongoose.connect('mongodb://localhost:'+process.env.port+'/chatMessenger');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var session = require('express-session');
var logSignController = require('./controllers/logSignController');
var messageController = require('./controllers/messageController');
var changeSettingController = require('./controllers/changeSettingController');
var profileController = require('./controllers/profileController');
var groupMessageController = require('./controllers/groupMessageController');
app.use(session({secret: "Shh, its a secret!"}));
app.use('/assets',express.static(path.join(__dirname,'src')));
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
app.get('/main/*',function(req,res,next){
 if(req.session.email){
   res.redirect('http://localhost:8080/user/profile.html');
 }
 else{
     next();
 }
});
app.get('/user/*',function(req,res,next){
 if(req.session.email){
   next();
 }
 else{
   res.redirect('http://localhost:8080/main/welcome.html');
 }
});
app.use('/user',express.static(path.join(__dirname,'pre')));
app.use('/main',express.static(path.join(__dirname,'views')));
app.use('/file',express.static(path.join(__dirname,'files')));
logSignController(app);
messageController(app,io);
changeSettingController(app);
profileController(app);
groupMessageController(app,io);
server.listen(8080);
