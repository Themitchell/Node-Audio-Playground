function Chat(connection) {
  var self         = this;
  this.element     = document.getElementById('chat');
  this.message_box = $("input#message");
	this.send_button = $("input#send_button");	
	this.stream      = $("ul#stream");
  
	$(this.element).append(this.message_box, this.send_button, this.stream);
	
	// On clicking SEND
  this.send_button.click( function() {
    var message = self.message_box.val();
    self.message_box.val('');
    connection.socket.emit('sendChatMessage', message);
  });

  // On ENTER keypress
  this.message_box.keypress(function(e) {
    if(e.which == 13) {
      $(this).blur();
      self.send_button.focus().click();
    }
  });
	
  connection.socket.on('updateChatMessage', function(username, message) {
    self.stream.prepend('<li><b>' + username + ':</b> ' + message + '</li>');
  });
}