var express = require('express')
var app = express.createServer()
var io  = require('socket.io').listen(app);

app.configure(function(){
  // Serve assets from public directory
  app.use(express.static(__dirname + '/public'));
});

app.listen(8080);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function(socket) {

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function(data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username) {
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function() {
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
	});
	
	
	
	
	
	// when the client emits 'createinstrument', this listens and executes
	socket.on('createinstrument', function(instrument_type) {
		// we tell the client to execute 'sendcreateinstrument' with 1 parameter
		io.sockets.emit('sendcreateinstrument', socket.username, instrument_type);
	});
	
	// when the client emits 'triggerinstrument', this listens and executes
	socket.on('triggerinstrument', function(instrument_type) {
		// we tell the client to execute 'sendtriggerinstrument' with 1 parameter
		io.sockets.emit('sendtriggerinstrument', instrument_type);
	});
});