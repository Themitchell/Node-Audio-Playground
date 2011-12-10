function Volume(sound_source) {
  var self = this;
  
  this.value  = valueToVolume(100);
  this.fader  = $("<div class='fader'></div>");
  
  this.fader.slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 127,
    value: 100,
    slide: function( event, ui ) {
      self.value = valueToVolume(ui.value);
      sound_source.audio[0].volume = self.value;
    }
  });
}