function Volume(socket, sound_source, current_identifier) {
  var self = this;
  
  this.value  = valueToVolume(100);
  this.fader  = $("<div class='fader'></div>");
  
  
  function handleFader(fader_value) {
    sound_source.audio[0].volume = valueToVolume(fader_value);
    self.fader.slider({ value: fader_value });
  }
  
  this.fader.slider({
    animation: true,
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 127,
    value: 100,
    slide: function( event, ui ) {
      if (event.originalEvent.originalEvent instanceof MouseEvent) {
        socket.emit('volumechannelinstrument', current_identifier, ui.value);
      }
    }
  });
  
  socket.on('sendvolumechannelinstrument', function(identifier, fader_value) {
    if (current_identifier.id == identifier.id) { handleFader(fader_value); }
  });
}