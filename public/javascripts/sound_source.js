function SoundSource(socket, instrument, sound_bank, current_identifier) {
  var self = this;
  
  var sound_bank    = document.getElementById("sound_bank");
  
  this.trigger_pad  = new TriggerPad(socket, sound_bank, current_identifier.type);
  this.audio        = new Audio();
  this.audio.volume = 0;
  
  if (current_identifier.type == 'osc') {
    this.sound_samples = new Float32Array(22050);
    this.audio.mozSetup(2, 44100);
    for (var i = 0; i < self.sound_samples.length ; i++) {
      self.sound_samples[i] = Math.sin( i / 80 );  
    }
  }
  else {
    this.audio.src = 'samples/' + current_identifier.type + '.ogg';
    this.audio.setAttribute('class', 'file');
  }
  $(sound_bank).append($(this.audio));

  function play() {
      /*  TODO: Ok so event listeners for audio availability only work on preloaded audio.
                Oscillators therefore do not trigger the listener and cannot therefore meter or write currently
      */
      if (current_identifier.type == 'osc') {
        self.audio.mozWriteAudio(this.sound_samples)
      } else {
        self.audio.currentTime = 0;
        self.audio.play();
      }
  }
  this.play = play;
  
  socket.on('sendtriggerinstrument', function(identifier) {
    if (current_identifier.id == identifier.id) {
      self.play();
    }
  });
}
