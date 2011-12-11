function Chat(connection) {
  var self         = this;
  this.element     = document.getElementById('chat');
  this.message_box = $("<input id=\"message\" />");
	this.send_button = $("<input type=\"button\" id=\"send_button\" value=\"send\" />");	
	this.stream      = $("<ul id=\"stream\"></ul>");
  
	$(this.element).append("<h2>Stream</h2>", this.message_box, this.send_button, this.stream);
	
	// On clicking SEND
  this.send_button.click( function() {
    var message = self.message_box.val();
    self.message_box.val('');
    connection.socket.emit('sendChatMessage', message);
  });

  // On ENTER keypress
  $('#data').keypress(function(e) {
    if(e.which == 13) {
      $(this).blur();
      $('#datasend').focus().click();
    }
  });
	
  connection.socket.on('updateChatMessage', function(username, message) {
    self.stream.prepend('<li><b>' + username + ':</b> ' + message + '</li>');
  });
}