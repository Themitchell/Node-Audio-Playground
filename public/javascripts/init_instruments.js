function initInstruments() {
  var connection  = new Connection();
  var chat        = new Chat(connection);
  
  var instruments           = new Array(total_no_instruments);
  var total_no_instruments  = 8;
  // var transport            = new Transport();
  
  connection.socket.on('createMenu', function(instrument_types) {
    new Menu(connection, instrument_types);
  });
  
  connection.socket.on('createInstrument', function(username, identifier) {
    var instrument = new Instrument(connection.socket, identifier);
  });
}

$(document).ready( function() {
  initInstruments();
});