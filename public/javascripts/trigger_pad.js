function TriggerPad(socket, sound_bank, current_identifier) {

  var self = this;

  var trigger_bank  = document.getElementById("trigger_bank");
  this.element      = $("<div class='trigger'><h3>" + current_identifier.type + "</h3></div>");
  $(trigger_bank).append(this.element)
  

  this.element.click(function() {
    socket.emit('triggerinstrument', current_identifier);
  });
  
  socket.on('sendtriggerinstrument', function(identifier) {
    if (current_identifier.id == identifier.id) {
      self.element.animate({ backgroundColor: "black"}, 6);
      self.element.animate({ backgroundColor: "white"}, 6);
    }
  });
}
