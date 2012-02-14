var express     = require('express')
var socketio    = require('socket.io');
var redis       = require('redis');
var _           = require('underscore')._;
var backbone    = require('backbone');

var models      = require('./app/models/models');
var AppModel    = new models.AppModel

var global      = require('./config/globals.js');
var sessions    = require('./lib/sessions.js');
var instruments = require('./lib/instruments.js');

var app         = express.createServer()
var io          = socketio.listen(app);
var store       = redis.createClient();

store.on("error", function (err) {
  console.log("Error " + err);
});



app.configure( function() {
  app.use(express.static(__dirname + '/public'));
});



// routing
app.get('/*.(js|css)', function(req, res){
  res.sendfile('./'+req.url);
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/app/views/index.html');
});
app.get('/chat', function (req, res) {
  res.sendfile(__dirname + '/app/views/chat.html');
});

app.listen(8000);


io.sockets.on('connection', function(socket) {
  console.log('Socket connected: ' + socket.id);

  // subscribe.on("addUser", function(username) {
  //     client.send(message);
  // });
  
  // USER EVENTS
  socket.on('addUser', function(username) {
	  socket.username = username;
	  sessions.all_entries.push(username);
	  
	  socket.emit('createMenu', instruments.accepted_types);
	  socket.emit('setCurrentUser', username);
    io.sockets.emit('updateConnectedUsers', sessions.all_entries);
    
    socket.emit('updateChatMessage', 'SERVER', 'You have connected as ' + username);
    for (var i=0; i<instruments.all_entries.length; i++) {
      var identifier = instruments.all_entries[i];
      console.log("New Instrument: " + identifier.id + " created from existing instruments in pool");
      console.log(identifier.volume_fader_value);
      socket.emit('createInstrument', socket.username, identifier); 
    }
    socket.broadcast.emit('updateChatMessage', 'SERVER', username + ' has connected');
	});
	
	socket.on('disconnect', function() {
	  if (sessions.all_entries.length == 1) { instruments.all_entries = new Array()}
    sessions.remove_entry(socket.username);
		io.sockets.emit('updateConnectedUsers', sessions.all_entries);
    socket.broadcast.emit('updateChatMessage', 'SERVER', socket.username + ' has disconnected');
	});
	
	
	
	// CHAT EVENTS
	socket.on('sendChatMessage', function(message) {
		io.sockets.emit('updateChatMessage', socket.username, message);
	});


  // AUDIO EVENTS
	socket.on('sendCreateInstrument', function(instrument_type) {
	  var instrument_identifier = instruments.create_identifier(instrument_type);
	  console.log("Creating Instrument: " + instrument_identifier.id);
    io.sockets.emit('createInstrument', socket.username, instrument_identifier);
	});
	
	socket.on('triggerinstrument', function(instrument_identifier) {
	  console.log("Triggering Instrument: " + instrument_identifier.id);
		io.sockets.emit('sendtriggerinstrument', instrument_identifier);
	});
	
	socket.on('mutechannelinstrument', function(instrument_identifier) {
	  console.log("Muting Instrument: " + instrument_identifier.id);
	  instruments.update_identifier(instrument_identifier);
		io.sockets.emit('sendmutechannelinstrument', instrument_identifier);
	});
	
	socket.on('solochannelinstrument', function(instrument_identifier) {
	  console.log("Soloing Instrument: " + instrument_identifier.id);
	  instruments.update_identifier(instrument_identifier);
		io.sockets.emit('sendsolochannelinstrument', instrument_identifier);
	});
	
	socket.on('volumechannelinstrument', function(instrument_identifier) {
	  console.log("Changing volume of Instrument: " + instrument_identifier.id);
	  instruments.update_identifier(instrument_identifier);
		io.sockets.emit('sendvolumechannelinstrument', instrument_identifier);
	});
	
	socket.on('changedGraphicEq', function(instrument_identifier) {
	  console.log("Changing equalisation of Instrument: " + instrument_identifier.id);
	  instruments.update_identifier(instrument_identifier);
		io.sockets.emit('sendGraphicEq', instrument_identifier);
	});
});


// var io      = require('socket.io');
// var express = require('express');
// var app     = express.createServer();
// 
// io = io.listen(app);
// 
// app.listen('3000');
// var pub = require('node_redis').createClient(); //publish cli
// var redis = require('node_redis').createClient(); //sub cli
// redis.psubscribe('*');  
// 
// redis.on('pmessage',function(pat,ch,msg){
//     io.sockets.in(ch).emit('news',msg);
// });
// 
// io.sockets.on('connection',function(socket){
//     console.log('Socket connected: ' + socket.id);
// 
//     socket.on('channel',function(ch){
//         socket.join(ch)
// 
//          //Publishing data on ch
//          pub.publish(ch,"Hello " + ch);  
//     });
// 
// 
//     socket.on('disconnect',function(){
//         console.log('Socket dis connected: ' + socket.id);
//     });
// });
