var midiNoteFreq =  /* 0 */ [ 16.35,    17.32,    18.35,    19.45,    20.6,     21.83,    23.12,    24.5,     25.96,    27.5,  29.14,    30.87,
                    /* 1 */   32.7,     34.65,    36.71,    38.89,    41.2,     43.65,    46.25,    49,       51.91,    55,    58.27,    61.74,
                    /* 2 */   65.41,    69.3,     73.42,    77.78,    82.41,    87.31,    92.5,     98,       103.83,   110,   116.54,   123.47,
                    /* 3 */   130.81,   138.59,   146.83,   155.56,   164.81,   174.61,   185,      196,      207.65,   220,   233.08,   246.94,
                    /* 4 */   261.63,   277.18,   293.66,   311.13,   329.63,   349.23,   369.99,   392,      415.3,    440,   466.16,   493.88,
                    /* 5 */   523.25,   554.37,   587.33,   622.25,   659.26,   698.46,   739.99,   783.99,   830.61,   880,   932.33,   987.77,
                    /* 6 */   1046.5,   1108.73,  1174.66,  1244.51,  1318.51,  1396.91,  1479.98,  1567.98,  1661.22,  1760,  1864.66,  1975.53,
                    /* 7 */   2093,     2217.46,  2349.32,  2489.02,  2637.02,  2793.83,  2959.96,  3135.96,  3322.44,  3520,  3729.31,  3951.07,
                    /* 8 */   4186.01,  4434.92,  4698.64,  4978 ];


function Instrument(socket, type) {
    var sound_bank      = document.getElementById("sound_bank");
    var mixer           = document.getElementById("mixer");
    var trigger_bank    = document.getElementById("trigger_bank");
    var printer         = document.getElementById("printer");

    var sound_source    = new SoundSource(sound_bank, type);
    var channel         = new Channel(mixer, sound_source, type);
    var trigger         = $("<div class='trigger'><h3>" + type + "</h3></div>");
    $(trigger_bank).append(trigger)

    trigger.click(function() { 
      socket.emit('triggerinstrument', type);
    });

    // listener, whenever the server emits 'sendcreateinstrument', this clicks the instrument
    socket.on('sendtriggerinstrument', function(instrument_type) {
      trigger.animate({ backgroundColor: "#AAA"}, 5);
      sound_source.play();
      trigger.animate({ backgroundColor: "#FFF"}, 5);
    });

    // var channels;
    // var rate;
    // var frame_buffer_length;

    // function loadedMetadata() {
    //     channels                = self.audio[0].mozChannels;
    //     rate                    = self.audio[0].mozSampleRate;
    //     frame_buffer_length     = self.audio[0].mozFrameBufferLength;
    // }

    // function audioAvailable(event) {
    //     /* var time        = event.time; */
    //     var fb          = event.frameBuffer;

    //     /* This is where we store the amplitude value per frame */
    //     var signal      = new Float32Array(fb.length / channels);

    //     /* If stereo signal, then merge into mono signal and place into signal array above */
    //     if (channels == 2) {
    //         for (var i = 0, fbl = frame_buffer_length / 2; i < fbl; i++ ) {
    //             /* Load array with average amplitude values from each channel and convert to mono for display */
    //             signal[i] = (fb[2*i] + fb[2*i+1]) / 2;
    //         }
    //     } else if (channels == 1) {
    //         signal = fb /* Load array with original mono channel */
    //     }
    //     /* iterate over the position of the playhead */
    //     for (var i = 0; i < frame_buffer_length; i++) {
    //         animateMeter(signal[i]);
    //      }
    // }


    function Channel(mixer, sound_source, type) {
        var self = this;

        /* create channel elements */
        var mix_channel    = $("<div class='channel_strip' id='" + type + "'><h3>" + type + "</h3></div>");
        var fader          = $("<div class='fader'></div>");
        self.meter         = $("<canvas class='meter'></canvas>");
        var mute           = $("<span class='mute_button mute'>M</span>");
        var solo           = $("<span class='solo_button solo'>S</span>");
        var controls       = $("<div class='controls'></div>").append(fader, self.meter);
        var buttons        = $("<div class='buttons'></div>").append(mute, solo);

        mix_channel.append(controls, buttons)
        $(mixer).append(mix_channel);

        var volume = valueToVolume(100);
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
            muteOrUnmute(this, sound_source, volume);
        });

        solo.click(function() {
            soloOrUnsolo(this);
        });

        function muteOrUnmute(button, sound_source, volume) {
            /*  TODO: Work out how to make mutes force a solo when exiting solos exist

                var solo_buttons = $('.solo_button.unsolo');
                if (solo_buttons >= 0) {
                    this.next().click();
                }

                This currently causes a loop whereby a solo no longer works as it uses
                muteOrUnmute() to create a solo.
            */
            if ($(button).hasClass('mute')) {
                /* Set sound source level to zero */
                sound_source.audio[0].volume = 0;

                /* Turn on mute light */
                $(button).addClass('unmute').removeClass('mute');
            } else if ($(button).hasClass('unmute')) {
                /* Set sound source level to fader value */
                sound_source.audio[0].volume = volume;

                /* Turn off mute light */
                $(button).addClass('mute').removeClass('unmute');
            }
        }

        function soloOrUnsolo(button) {
            if ($(button).hasClass('solo')) {
                /* Check for any other solo buttons and disable them */
                var enabled_solo_buttons = $('.solo_button.unsolo')
                enabled_solo_buttons.each( function() {
                    this.click();
                });

                /* Turn on solo light */
                $(button).addClass('unsolo').removeClass('solo');

                /* Find mutes for all channels except this on and turn them on */
                var disabled_mutes_except_own = $('.mute_button.mute').not($(button).prev());
                disabled_mutes_except_own.each( function() {
                    this.click();
                });

            } else if ($(button).hasClass('unsolo')) {
                /* Turn off solo light */
                $(button).addClass('solo').removeClass('unsolo');

                /* Find mutes for all channels except this on and turn them off */
                var enabled_mutes_except_own = $('.mute_button.unmute').not($(button).prev());
                enabled_mutes_except_own.each( function() {
                    this.click();
                });
            }
        }
    }



    function SoundSource(sound_bank, type) {
        var self = this;

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
        $(sound_bank).append(self.audio)

        self.audio[0].volume = valueToVolume(100);

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



    function valueToVolume(value) {
        return (1/128)*value;
    }

    function animateMeter(sample) {
        /*  var context = channel.meter[0].getContext('2d');
            context.clearRect(0, 0, channel.meter.width, channel.meter.height)
            var meter_value = (channel.meter.height()/100)*amplitudeAsPercentage(sample);
            debugger;
        */
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