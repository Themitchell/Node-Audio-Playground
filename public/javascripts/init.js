function init() {
  var connection  = new Connection();
  var chat        = new Chat(connection);
  
  
  /* GLOBALS */
  var instruments           = new Array(total_no_instruments);
  var total_no_instruments  = 8;
  var menu_items            = document.getElementById('options').children;
  // var transport            = new Transport();

  connection.socket.on('updateCreateInstrument', function(username, instrument_type) {
    var instrument = new Instrument(connection.socket, instrument_type);
    instruments.push(instrument);
  });

  $(menu_items).click( function() {
    connection.socket.emit('sendCreateInstrument', this.innerHTML);
  });
}

$(document).ready( function() {
  init();
});