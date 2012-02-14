function init() {
  var connection  = new Connection();
  var chat        = new Chat(connection);
}

$(document).ready( function() {
  init();
});