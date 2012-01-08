function SoundSource(socket, sound_bank, current_identifier) {
    var self = this;
    
    var sound_bank    = document.getElementById("sound_bank");
    
    this.trigger_pad  = new TriggerPad(socket, sound_bank, current_identifier);
    this.audio        = new Audio();
    this.channels;
    this.rate;
    this.frame_buffer_length;
    
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
    
    function handleLoadedMetadata() {
      self.channels            = self.audio.mozChannels;
      self.rate                = self.audio.mozSampleRate;
      self.frame_buffer_length = self.sound_samples != undefined ? self.sound_samples.length : self.audio.mozFrameBufferLength;
      self.output              = new Output(self);
    }
    this.audio.addEventListener('loadedmetadata', handleLoadedMetadata, false);

    function play() {
        /*  TODO: This is carp. Surely I can load the buffer prior to playing the sample then
            call play rather than having to stream like this. Should I just be using a playing
            single waveform loop audio file. Why cannot I not just create audio out of a single 
            and load that in place of a sample Float32Array
        */
        if (current_identifier.type == 'osc') {
          self.audio.mozWriteAudio(this.sound_samples);
        } else {
          self.audio.volume = 0
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
