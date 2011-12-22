function Channel(socket, sound_source, current_identifier) {
  
  /* GLOBAL SETUP */

  var self          = this;
  var mixer         = document.getElementById("mixer");
  this.element      = $("<div class='channel_strip' id='" + current_identifier.type + "'><h3>" + current_identifier.type + "</h3></div>");

  this.volume       = new Volume(socket, sound_source, current_identifier);
  this.meter        = new Meter(sound_source, current_identifier);
  this.controls     = $("<div class='controls'></div>").append(this.volume.fader, this.meter.wrapper);
  
  this.equaliser    = new Equaliser(socket, sound_source, current_identifier);
  
  this.mute         = new Mute(socket, sound_source, this.volume.value, current_identifier);
  this.solo         = new Solo(socket, current_identifier);
  this.buttons      = $("<div class='buttons'></div>").append(this.mute.toggle.button, this.solo.toggle.button, this.equaliser.toggle_window.button);
  
  this.element.append(this.controls, this.buttons, this.equaliser.element);
  $(mixer).append(this.element);
  
}