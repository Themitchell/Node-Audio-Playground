function Channel(socket, instrument, sound_source, current_identifier) {
  
  /* GLOBAL SETUP */

  var self          = this;
  var mixer         = document.getElementById("mixer");
  this.element      = $("<div class='channel_strip' id='" + current_identifier.type + "'><h3>" + current_identifier.type + "</h3></div>");
  
  /* This forces the components to wait until the audio source and the audio output is ready before affecting audio elements */
  sound_source.audio.addEventListener('loadedmetadata', function() {
    sound_source.output.audio.addEventListener('loadedmetadata', function() {
      self.equaliser    = new Equaliser(socket, sound_source, current_identifier);
      self.inserts      = $("<div class=\"inserts\"></div>").append(self.equaliser.toggle_window.button, self.equaliser.element);
    
      self.volume       = new Volume(socket, sound_source, current_identifier);
      self.meter        = new Meter(sound_source, current_identifier);
      self.controls     = $("<div class='controls'></div>").append(self.volume.fader, self.meter.wrapper, self.inserts);

      self.mute         = new Mute(socket, sound_source, self.volume.value, current_identifier);
      self.solo         = new Solo(socket, current_identifier);
      self.buttons      = $("<div class='buttons'></div>").append(self.mute.toggle.button, self.solo.toggle.button);

      self.element.append(self.controls, self.buttons);
      $(mixer).append(self.element);
    }, false);
  }, false);
}