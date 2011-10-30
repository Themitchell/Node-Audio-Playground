var midiNoteFreq =  [ 16.35,    17.32,    18.35,    19.45,    20.6,     21.83,    23.12,    24.5,     25.96,    27.5,  29.14,    30.87,
                      32.7,     34.65,    36.71,    38.89,    41.2,     43.65,    46.25,    49,       51.91,    55,    58.27,    61.74,
                      65.41,    69.3,     73.42,    77.78,    82.41,    87.31,    92.5,     98,       103.83,   110,   116.54,   123.47,
                      130.81,   138.59,   146.83,   155.56,   164.81,   174.61,   185,      196,      207.65,   220,   233.08,   246.94,
                      261.63,   277.18,   293.66,   311.13,   329.63,   349.23,   369.99,   392,      415.3,    440,   466.16,   493.88,
                      523.25,   554.37,   587.33,   622.25,   659.26,   698.46,   739.99,   783.99,   830.61,   880,   932.33,   987.77,
                      1046.5,   1108.73,  1174.66,  1244.51,  1318.51,  1396.91,  1479.98,  1567.98,  1661.22,  1760,  1864.66,  1975.53,
                      2093,     2217.46,  2349.32,  2489.02,  2637.02,  2793.83,  2959.96,  3135.96,  3322.44,  3520,  3729.31,  3951.07,
                      4186.01,  4434.92,  4698.64,  4978 ];

function Instrument(sound_bank, mixer, trigger_bank, type, printer) {
    
    var sound_source            = new SoundSource(sound_bank, type);
    var channel                 = new Channel(mixer, sound_source, type);
    
    var trigger                 = $("<div class='trigger'><h3>" + type + "</h3></div>");
    $(trigger_bank).append(trigger)
      
    trigger.click(function() { 
        trigger.animate({ backgroundColor: "#AAA"}, 5);
        sound_source.play();
        trigger.animate({ backgroundColor: "#FFF"}, 5);
    });
    
    
    function Channel(mixer, sound_source, type) {
        var self = this
        // create channel elements
        var mix_channel    = $("<div class='channel_strip' id='" + type + "'><h3>" + type + "</h3></div>");
        var fader          = $("<div class='fader'></div>");
        self.meter          = $("<canvas class='meter'></canvas>");
        var mute           = $("<span class='mute_button mute'>M</span>");
        var solo           = $("<span class='solo_button solo'>S</span>");
        var controls       = $("<div class='controls'></div>").append(fader, self.meter);
        var buttons        = $("<div class='buttons'></div>").append(mute, solo);
    
        mix_channel.append(controls, buttons)
        $(mixer).append(mix_channel);
    
        volume = valueToVolume(100);
        fader.slider({
            orientation: "vertical",
            range: "min",
            min: 0,
            max: 127,
            value: 100,
            slide: function( event, ui ) {
                volume = valueToVolume(ui.value);
                sound_source.audio[0].volume = volume;
            }
        });
        
        mute.click(function() {
            muteOrUnmute(mute, sound_source, volume);
        });

        solo.click(function() {
            soloOrUnsolo(solo);
        });
        
        function muteOrUnmute(button, sound_source, volume) {
            if (button.hasClass('mute')) {
                sound_source.audio[0].volume = 0;
                button.addClass('unmute').removeClass('mute');
            } else if (button.hasClass('unmute')) {
                sound_source.audio[0].volume = volume;
                button.addClass('mute').removeClass('unmute');
            }
        }
        
        function soloOrUnsolo(button) {
            // TODO: Make this actually do something other that turn on a pretty light
            // Maybe refactor muteOrUnmute(); to only mute audio and perform the UI changes separately
            if (button.hasClass('solo')) {
                button.addClass('unsolo').removeClass('solo');
            } else if (button.hasClass('unsolo')) {
                button.addClass('solo').removeClass('unsolo');
            }
        }
    }




    function SoundSource(sound_bank, type) {
        var self = this
        
        // create sound source elements
        self.audio           = $("<audio class='sample' src='samples/" + type + ".ogg'></audio>");
        $(sound_bank).append()
        
        self.audio[0].volume = valueToVolume(100);

        var channels;
        var rate;
        var frame_buffer_length;

        function loadedMetadata() {
            channels                = self.audio[0].mozChannels;
            rate                    = self.audio[0].mozSampleRate;
            frame_buffer_length     = self.audio[0].mozFrameBufferLength;
        }
        
        function audioAvailable(event) {   
            var fb          = event.frameBuffer;
            var time        = event.time; /* Not used - note to self! */
            var signal      = new Float32Array(fb.length / channels); /* This is where we store the amplitude value per frame */

            // If stereo signal, then merge into mono signal and place into signal array above
            if (channels == 2) {
                for (var i = 0, fbl = frame_buffer_length / 2; i < fbl; i++ ) {
                    signal[i] = (fb[2*i] + fb[2*i+1]) / 2; /* Load array with average amplitude values from each channel */
                }
            } else if (channels == 1) {
                signal = fb /* Load array with original mono channel */
            }
            // iterate over the position of the playhead
            for (var i = 0; i < frame_buffer_length; i++) {
                animateMeter(signal[i]);
             }
        }
        
        
        
        function writeSamples (event) {
          lines.push (event.frameBuffer[0] + ', ' + event.frameBuffer[1] + ', ' + event.frameBuffer[2]);
          printer.innerHTML = lines.join('<br>');
        }
        
        
        
        
        function play() {
            self.audio[0].currentTime = 0;
            self.audio[0].play();
        }
        this.play = play;
        
        var lines = [];
        
        self.audio[0].addEventListener('MozAudioAvailable', writeSamples, false);
        self.audio[0].addEventListener('loadedmetadata', loadedMetadata, false);
    }
    
    
    
    function valueToVolume(value) {
        return (1/128)*value;
    }
    
    function animateMeter(sample) {
        // var context = channel.meter[0].getContext('2d');
        // context.clearRect(0, 0, channel.meter.width, channel.meter.height)
        // var meter_value = (channel.meter.height()/100)*amplitudeAsPercentage(sample);
        // debugger;
    }
    
    function amplitudeAsPercentage(sample) {
        if (sample < 0) {
            /* Return the value as positive  */
            return (0-sample)*100;  
        } else {
            return sample*100;
        }
    }
}




function init() {
    var printer = document.getElementById("printer");
    var sound_bank      = document.getElementById("sound_bank");
    var mixer           = document.getElementById("mixer");
    var trigger_bank    = document.getElementById("trigger_bank");
    
    var menu_items      = document.getElementById('options').children;
    
    $(menu_items).click(function() {
      var instrument = new Instrument(sound_bank, mixer, trigger_bank, this.innerHTML, printer);
    })
}

$ = jQuery
$(document).ready(function() {
  init();
});