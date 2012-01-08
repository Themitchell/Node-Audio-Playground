function Output(sound_source) {
  
  var self          = this;
  
  this.buffer       = new Array();
  this.audio        = new Audio();
  this.audio.mozSetup(sound_source.channels, sound_source.rate);
}