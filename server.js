var express = require('express')
var app = express.createServer()
var io  = require('socket.io').listen(app);

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});
app.listen(8080);


// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


// usernames which are currently connected to the chat
var usernames = new Array();

io.sockets.on('connection', function(socket) {
  
  // USER EVENTS
  socket.on('adduser', function(username) {
	  socket.username = username;
	  usernames.push(username);
	  
	  socket.emit('setCurrentUser', username);
    io.sockets.emit('updateConnectedUsers', usernames);
    
    socket.emit('updateChatMessage', 'SERVER', 'You have connected as ' + username);
    socket.broadcast.emit('updateChatMessage', 'SERVER', username + ' has connected');
	});
	
	socket.on('disconnect', function() {
	  for (var i=0; i<usernames.length; i++) {
	    console.log(usernames[i]);
	    if (usernames[i] == socket.username) { usernames.splice(i, 1); }
	  }
		io.sockets.emit('updateConnectedUsers', usernames);
    socket.broadcast.emit('updateChatMessage', 'SERVER', socket.username + ' has disconnected');
	});
	
	
	
	// CHAT EVENTS
	socket.on('sendChatMessage', function(message) {
		io.sockets.emit('updateChatMessage', socket.username, message);
	});


  // AUDIO EVENTS
	socket.on('sendCreateInstrument', function(instrument_type) {
		io.sockets.emit('updateCreateInstrument', socket.username, instrument_type);
	});
	
	socket.on('triggerinstrument', function(instrument_type) {
		io.sockets.emit('sendtriggerinstrument', instrument_type);
	});
	
	socket.on('mutechannelinstrument', function(instrument_type) {
		io.sockets.emit('sendmutechannelinstrument', instrument_type);
	});
	
	socket.on('solochannelinstrument', function(instrument_type) {
		io.sockets.emit('sendsolochannelinstrument', instrument_type);
	});
	
	socket.on('volumechannelinstrument', function(instrument_type, fader_value) {
		io.sockets.emit('sendvolumechannelinstrument', instrument_type, fader_value);
	});
});