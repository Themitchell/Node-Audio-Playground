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
    var mixer           = document.getElementById("mixer");
    var printer         = document.getElementById("printer");
    
    this.SoundSource    = new SoundSource(socket, sound_bank, type);    
    this.Channel         = new Channel(mixer, this.SoundSource, type);

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

    function animateMeter(sample) {
        /*  var context = channel.meter[0].getContext('2d');
            context.clearRect(0, 0, channel.meter.width, channel.meter.height)
            var meter_value = (channel.meter.height()/100)*amplitudeAsPercentage(sample);
            debugger;
        */
    }
}