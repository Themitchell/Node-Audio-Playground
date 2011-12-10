function SoundSource(socket, sound_bank, type) {
    var self = this;
    
    var sound_bank    = document.getElementById("sound_bank");
    var osc_samples = new Float32Array(22050);
    
    this.trigger_pad  = new TriggerPad(socket, sound_bank, type);
    this.audio        = $(new Audio());
    
    if (type == 'osc') {
      this.audio[0].mozSetup(2, 44100);

      for (var i = 0; i < osc_samples.length ; i++) {  
        osc_samples[i] = Math.sin( i / 80 );  
      }
    } else {
      this.audio[0].src = 'samples/' + type + '.ogg';
      this.audio[0].setAttribute('class', 'file');
    }
    $(sound_bank).append(this.audio);

    function play() {
        /*  TODO: This is carp. Surely I can load the buffer prior to playing the sample then
            call play rather than having to stream like this. Should I just be using a playing
            single waveform loop audio file. Why cannot I not just create audio out of a single 
            and load that in place of a sample Float32Array
        */
        if (type == 'osc') {
            self.audio[0].mozWriteAudio(osc_samples);
        } else {
            self.audio[0].currentTime = 0;
            self.audio[0].play();
        }
    }
    this.play = play;
    
    socket.on('sendtriggerinstrument', function(instrument_type) {
      if (type == instrument_type) {
        self.play();
      }
    });
}
