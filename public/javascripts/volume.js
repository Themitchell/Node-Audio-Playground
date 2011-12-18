function Volume(socket, sound_source, current_identifier) {
  var self = this;
  
  this.value  = valueToVolume(current_identifier.volume_fader_value);
  this.fader  = $("<div class='fader'></div>");
  
  
  function handleFader(volume_fader_value) {
    sound_source.audio[0].volume = valueToVolume(volume_fader_value);
    self.fader.slider({ value: volume_fader_value });
  }
  
  this.fader.slider({
    animation: true,
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 127,
    value: current_identifier.volume_fader_value,
    slide: function( event, ui ) {
      if (event.originalEvent.originalEvent instanceof MouseEvent) {
        current_identifier.volume_fader_value = ui.value;
        socket.emit('volumechannelinstrument', current_identifier);
      }
    }
  });
  
  socket.on('sendvolumechannelinstrument', function(identifier) {
    if (current_identifier.id == identifier.id) { handleFader(identifier.volume_fader_value); }
  });
}