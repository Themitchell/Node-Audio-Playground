function Output(sound_source) {
  
  var self          = this;
  this.audio        = new Audio();
  this.audio.mozSetup(sound_source.channels, sound_source.rate);
  
  function writeAudio(event) {
    self.audio.mozWriteAudio([]);
    self.audio.mozWriteAudio(event.frameBuffer);
  }
  sound_source.audio.addEventListener('MozAudioAvailable', writeAudio, false);
}