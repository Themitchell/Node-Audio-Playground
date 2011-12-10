function Volume(socket, sound_source, type) {
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
        socket.emit('volumechannelinstrument', type, ui.value);
      }
    }
  });
  
  socket.on('sendvolumechannelinstrument', function(instrument_type, fader_value) {
    if (instrument_type == type) { handleFader(fader_value); }
  });
}


// 
// self.value = valueToVolume(ui.value);
// sound_source.audio[0].volume = self.value;