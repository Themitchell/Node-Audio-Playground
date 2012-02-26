var express     = require('express')
var socketio    = require('socket.io');
var redis       = require('redis');
var _           = require('underscore')._;
var backbone    = require('backbone');
var ejs         = require('ejs');

var models      = require('./app/models/models');
var AppModel    = new models.AppModel;

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
  app.set('view engine', require('ejs'));
  app.set('views', __dirname + '/app/views');
  app.use(express.static(__dirname + '/public'));
});



// routing
app.get('/*.(js|css)', function(req, res){
  res.sendfile('./'+req.url);
});

app.get('/', function (req, res) {  
  res.render('instruments/index.ejs');
});

app.get('/chat', function (req, res) {  
  res.render('messages/index.ejs');
});





// Redis
store.lrange('messages', -10, -1, function(err, data) {
  if (data) {
    _.each(data, function(jsonMessage) {
      var message = new models.Message();
      message.mport(jsonMessage);
      AppModel.messages.add(message);
    });

    console.log('Revived ' + AppModel.messages.length + ' messages');
  }
  else {
    console.log('No data returned for key');
  }
});

store.lrange('instruments', -40, -1, function(err, data) {
  if (data) {
    _.each(data, function(jsonInstrument) {
      var instrument = new models.Instrument();
      instrument.mport(jsonInstrument);
      AppModel.instruments.add(instrument);
    });

    console.log('Revived ' + AppModel.instruments.length + ' instruments');
  }
  else {
    console.log('No data returned for key');
  }
});







io.sockets.on('connection', function(client) {
  
  initChat(client);
  
  //   // USER EVENTS
  //   client.on('addUser', function(username) {
  //   client.username = username;
  //   sessions.all_entries.push(username);
  //   
  //   client.emit('createMenu', instruments.accepted_types);
  //   client.emit('setCurrentUser', username);
  //     io.sockets.emit('updateConnectedUsers', sessions.all_entries);
  //     
  //     client.emit('updateChatMessage', 'SERVER', 'You have connected as ' + username);
  //     for (var i=0; i<instruments.all_entries.length; i++) {
  //       var identifier = instruments.all_entries[i];
  //       console.log("New Instrument: " + identifier.id + " created from existing instruments in pool");
  //       console.log(identifier.volume_fader_value);
  //       client.emit('createInstrument', client.username, identifier); 
  //     }
  //     client.broadcast.emit('updateChatMessage', 'SERVER', username + ' has connected');
  // });
  // 
  // client.on('disconnect', function() {
  //   clientDisconnect(client, io, sessions, instruments)
  // });
	
	
	
	// CHAT EVENTS
	client.on('message', function(sent_message) {	 
    doMessage(client, io, sent_message)
	});


    // AUDIO EVENTS
  client.on('instrument', function(sent_instrument) {
    doNewInstrument(client, io, sent_instrument)
    // var instrument_identifier = instruments.create_identifier(instrument_type);
    //     console.log("Creating Instrument: " + instrument_identifier.id);
    //       io.sockets.emit('createInstrument', client.username, instrument_identifier);
  });
  // 
  // client.on('triggerinstrument', function(instrument_identifier) {
  //   console.log("Triggering Instrument: " + instrument_identifier.id);
  //  io.sockets.emit('sendtriggerinstrument', instrument_identifier);
  // });
  // 
  // client.on('mutechannelinstrument', function(instrument_identifier) {
  //   console.log("Muting Instrument: " + instrument_identifier.id);
  //   instruments.update_identifier(instrument_identifier);
  //  io.sockets.emit('sendmutechannelinstrument', instrument_identifier);
  // });
  // 
  // client.on('solochannelinstrument', function(instrument_identifier) {
  //   console.log("Soloing Instrument: " + instrument_identifier.id);
  //   instruments.update_identifier(instrument_identifier);
  //  io.sockets.emit('sendsolochannelinstrument', instrument_identifier);
  // });
  // 
  // client.on('volumechannelinstrument', function(instrument_identifier) {
  //   console.log("Changing volume of Instrument: " + instrument_identifier.id);
  //   instruments.update_identifier(instrument_identifier);
  //  io.sockets.emit('sendvolumechannelinstrument', instrument_identifier);
  // });
  // 
  // client.on('changedGraphicEq', function(instrument_identifier) {
  //   console.log("Changing equalisation of Instrument: " + instrument_identifier.id);
  //   instruments.update_identifier(instrument_identifier);
  //  io.sockets.emit('sendGraphicEq', instrument_identifier);
  // });
});

function initChat(client) {  
  _.each(AppModel.messages.models, function(message) {
    client.emit('message', message.xport());
  });
}

function doMessage(client, io, sent_message) {
  var message = new models.Message();
  message.mport(sent_message);

  store.incr('next.message.id', function(err, new_id) {
    message.set({ id: new_id });
    AppModel.messages.add(message);

    console.log('(' + client.sessionId + ') ' + message.get('id') + ' ' + message.get('username') + ': ' + message.get('body'));

    store.rpush('messages', message.xport(), redis.print);
    store.bgsave();
    
    client.emit( 'message', message.xport());
    client.broadcast.emit( 'message', message.xport());
  });
}

function doNewInstrument(client, io, sent_instrument) {
  var instrument = new models.Instrument();
  instrument.mport(sent_instrument);

  store.incr('next.instrument.id', function(err, new_id) {
    instrument.set({ id: new_id });
    AppModel.instruments.add(instrument);

    console.log('(' + client.sessionId + ') ' + instrument.get('id') + ' ' + instrument.get('type'));

    store.rpush('instruments', instrument.xport(), redis.print);
    store.bgsave();
    
    client.emit( 'instrument', instrument.xport());
    client.broadcast.emit( 'instrument', instrument.xport());
  });
}

function clientDisconnect(client, io, sessions, instruments) {
  if (sessions.all_entries.length == 1) { instruments.all_entries = new Array() }
  sessions.remove_entry(client.username);
  io.sockets.emit('updateConnectedUsers', sessions.all_entries);
  client.broadcast.emit('updateChatMessage', 'SERVER', client.username + ' has disconnected');
}

app.listen(8000);