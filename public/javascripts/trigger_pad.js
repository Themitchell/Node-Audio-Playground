function TriggerPad(socket, sound_bank, type) {

  var self = this;

  var trigger_bank  = document.getElementById("trigger_bank");
  this.element      = $("<div class='trigger'><h3>" + type + "</h3></div>");
  $(trigger_bank).append(this.element)
  

  this.element.click(function() { 
    socket.emit('triggerinstrument', type);
  });
  
  socket.on('sendtriggerinstrument', function(instrument_type) {
    if (type == instrument_type) {
      self.element.animate({ backgroundColor: "#AAA"}, 5);
      self.element.animate({ backgroundColor: "#FFF"}, 5);
    }
  });
}
