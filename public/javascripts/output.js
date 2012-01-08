function Output(sound_source) {
  
  var self          = this;
  this.buffer       = new Array();
  this.audio        = new Audio();
  this.audio.mozSetup(sound_source.channels, sound_source.rate);
  
  // function writeAudio(event) {
  //   self.buffer = event.frameBuffer;
  //   self.audio.mozWriteAudio([]);
  //   self.audio.mozWriteAudio(self.buffer);
  // }
  // sound_source.audio.addEventListener('MozAudioAvailable', writeAudio, false);
}