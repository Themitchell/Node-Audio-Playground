function TriggerPad(socket, sound_bank, type) {

  var self = this;

  var trigger_bank  = document.getElementById("trigger_bank");
  this.element      = $("<div class='trigger'><h3>" + type + "</h3></div>");
  $(trigger_bank).append(this.element)
  

  this.element.click(function() { 
    socket.emit('triggerinstrument', type);
  });
}
