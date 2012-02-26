var redis       = require('redis');
var _           = require('underscore')._;
var backbone    = require('backbone');

var models      = require('../app/models/models');
var AppModel    = new models.AppModel;

var store       = redis.createClient();
store.on("error", function (err) {
  console.log("REDIS ERROR!!! - " + err);
});


/* REDIS ============================================================ */
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



exports.initChat = function(client) {
  _.each(AppModel.messages.models, function(model) {
    client.emit('message', model.xport());
  });
}

exports.doMessage = function(client, sent_model) {
  var model = new models.Message();
  model.mport(sent_model);

  store.incr('next.message.id', function(err, new_id) {
    model.set({ id: new_id });
    AppModel.messages.add(model);

    console.log('(' + client.sessionId + ') ' + model.get('id') + ' created');

    store.rpush('messages', model.xport(), redis.print);
    store.bgsave();
    
    client.emit( 'message', model.xport());
    client.broadcast.emit( 'message', model.xport());
  });
}

exports.initInstruments = function(client) {  
  _.each(AppModel.instruments.models, function(model) {
    client.emit('instrument', model.xport());
  });
}

exports.doNewInstrument = function(client, sent_instrument) {
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

exports.doTrigger = function(client, io, instrument) {
  console.log('(' + client.sessionId + ') ' + 'Triggered: ' + instrument.get('id') + ' ' + instrument.get('type'));
  io.sockets.emit('trigger', instrument);
}

exports.clientDisconnect = function(client, io, sessions, instruments) {
  io.sockets.emit('updateConnectedUsers', sessions.all_entries);
  client.broadcast.emit('updateChatMessage', 'SERVER', client.username + ' has disconnected');
}