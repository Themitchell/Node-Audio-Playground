function Connection() {
  var self = this;
  this.socket = io.connect('http://r2d2.local:8000');
  this.username;
  this.username_element = $("<span id=\"username\"></span>");
  this.connected_element = $('<ul></ul>');

  $('#user').append("<h2></h2>");
  $('#connected_users').append("<h2>Connected Users</h2>", this.connected_element);
  
  this.socket.on('connect', function() {
    self.username = prompt("What's your name?");
    self.socket.emit('addUser', self.username);
  });

  this.socket.on('setCurrentUser', function(username) {
    self.username = username;
    self.username_element.text(username);
    $('#user h2').append("Hello ", self.username_element);
  });
  
  this.socket.on('updateConnectedUsers', function(usernames) {
    self.connected_element.empty();
    $.each( usernames, function( index, value ) {
      self.connected_element.append('<li>' + value + '</li>');
    });
  });
}