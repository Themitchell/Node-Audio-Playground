function Channel(sound_source, type) {
  
  /* GLOBAL SETUP */

  var self          = this;
  var mixer         = document.getElementById("mixer");
  this.element      = $("<div class='channel_strip' id='" + type + "'><h3>" + type + "</h3></div>");
  
  this.volume       = new Volume(sound_source);
  this.meter        = $("<canvas class='meter'></canvas>");
  this.controls     = $("<div class='controls'></div>").append(this.volume.fader, this.meter);
  
  this.mute         = new Mute(sound_source, this.volume.value);
  this.solo         = new Solo();
  this.buttons      = $("<div class='buttons'></div>").append(this.mute.button, this.solo.button);
  
  this.element.append(this.controls, this.buttons);
  $(mixer).append(this.element);
  
}