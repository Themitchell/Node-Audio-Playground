function SoundSource(socket, sound_bank, type) {
    var self = this;
    
    /* GLOBAL SETUP */
    var sound_bank    = document.getElementById("sound_bank");
    var trigger_bank  = document.getElementById("trigger_bank");
    this.trigger      = $("<div class='trigger'><h3>" + type + "</h3></div>");
    $(trigger_bank).append(this.trigger)
    
    
    var osc_samples = new Float32Array(22050);
    /* Select sound source kind [file, osc] */
    if (type == 'osc') {
        /* Create new audio output and setup with 2 channels 44.1kHz */
        self.audio  = $(new Audio);
        self.audio[0].mozSetup(2, 44100);

        for (var i = 0; i < osc_samples.length ; i++) {  
            /* Calculate value for sound soundsource and load array */
            osc_samples[i] = Math.sin( i / 80 );  
        }  
    } else {
        self.audio  = $("<audio class='file' src='samples/" + type + ".ogg'></audio>");
    }
    $(sound_bank).append(this.audio)

    this.audio[0].volume = valueToVolume(100);
    
    
    
    
    /* LISTENERS */
    
    this.trigger.click(function() { 
      socket.emit('triggerinstrument', type);
    });
    
    socket.on('sendtriggerinstrument', function(instrument_type) {
      if (type == instrument_type) {
        self.trigger.animate({ backgroundColor: "#AAA"}, 5);
        self.play();
        self.trigger.animate({ backgroundColor: "#FFF"}, 5);
      }
    });

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
}
