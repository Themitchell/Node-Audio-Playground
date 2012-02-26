/* SOCKETS ============================================================ */
var app         = require('../server');
var socketio    = require('socket.io');
var io          = socketio.listen(app);

var storage     = require('../lib/storage.js')



io.sockets.on('connection', function(client) {
  
    storage.initChat(client);
    storage.initInstruments(client);
 
    // CHAT EVENTS
 
    client.on('message', function(sent_message) {  
        storage.doMessage(client, AppModel.messages, sent_message)
    });


    // AUDIO EVENTS

    client.on('instrument', function(sent_instrument) {
        storage.doNewInstrument(client, sent_instrument)
    });

    client.on('trigger', function(instrument) {
        storage.doTrigger(client, instrument);
    });
  
});