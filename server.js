var express     = require('express')
var app         = express.createServer()
var io          = require('socket.io').listen(app);
var global      = require('./config/globals.js')
var sessions    = require('./lib/sessions.js')
var instruments = require('./lib/instruments.js')


app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});
app.listen(8080);


// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

io.sockets.on('connection', function(socket) {
  
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
      console.log(identifier.muted);
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
		io.sockets.emit('sendsolochannelinstrument', instrument_identifier);
	});
	
	socket.on('volumechannelinstrument', function(instrument_identifier, fader_value) {
	  console.log("Changing volume of Instrument: " + instrument_identifier.id);
		io.sockets.emit('sendvolumechannelinstrument', instrument_identifier, fader_value);
	});
});