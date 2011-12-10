function Channel(socket, sound_source, type) {
  
  /* GLOBAL SETUP */

  var self          = this;
  var mixer         = document.getElementById("mixer");
  this.element      = $("<div class='channel_strip' id='" + type + "'><h3>" + type + "</h3></div>");
  
  this.volume       = new Volume(sound_source);
  this.meter        = $("<canvas class='meter'></canvas>");
  this.controls     = $("<div class='controls'></div>").append(this.volume.fader, this.meter);
  
  this.mute         = new Mute(socket, sound_source, this.volume.value, type);
  this.solo         = new Solo(socket, type);
  this.buttons      = $("<div class='buttons'></div>").append(this.mute.toggle.button, this.solo.toggle.button);
  
  this.element.append(this.controls, this.buttons);
  $(mixer).append(this.element);
  
}