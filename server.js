var express     = require('express')
var app         = express.createServer()
var io          = require('socket.io').listen(app);
var global      = require('./config/globals.js')
var sessions    = require('./config/sessions.js')
var instruments = require('./config/instruments.js')


app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});
app.listen(8080);


// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
  // USER EVENTS
  socket.on('adduser', function(username) {
	  socket.username = username;
	  sessions.all.push(username);
	  
	  socket.emit('createMenu', instruments.accepted_types);
	  socket.emit('setCurrentUser', username);
    io.sockets.emit('updateConnectedUsers', sessions.all);
    
    socket.emit('updateChatMessage', 'SERVER', 'You have connected as ' + username);
    socket.broadcast.emit('updateChatMessage', 'SERVER', username + ' has connected');
	});
	
	socket.on('disconnect', function() {
    // for (var i=0; i<sessions.all.length; i++) {
    //   if (sessions.all[i] == socket.username) { sessions.all.splice(i, 1); }
    // }
		io.sockets.emit('updateConnectedUsers', global.sessions);
    socket.broadcast.emit('updateChatMessage', 'SERVER', socket.username + ' has disconnected');
	});
	
	
	
	// CHAT EVENTS
	socket.on('sendChatMessage', function(message) {
		io.sockets.emit('updateChatMessage', socket.username, message);
	});


  // AUDIO EVENTS
	socket.on('sendCreateInstrument', function(instrument_type) {
		io.sockets.emit('createInstrument', socket.username, instrument_type);
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