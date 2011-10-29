function Instrument(sound_bank, mixer, trigger_bank, type) {
    
    var sound_source            = new SoundSource(sound_bank, type);
    var channel                 = new Channel(mixer, sound_source, type);
    var meter_canvas_context    = channel.meter[0].getContext('2d');
    
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
        
        function amplitudeToPercentage(sample) {

        }
        
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
        var frameBufferLength;

        function loadedMetadata() {
            channels                = self.audio[0].mozChannels;
            rate                    = self.audio[0].mozSampleRate;
            frameBufferLength       = self.audio[0].mozFrameBufferLength;
        }
        
        function audioAvailable(event) {   
            var fb          = event.frameBuffer;
            var time        = event.time; /* Not used - note to self! */
            var signal      = new Float32Array(fb.length / channels); /* This is where we store the amplitude value per frame */

            // If stereo signal, then merge into mono signal and place into signal array above
            if (channels == 2) {
                for (var i = 0, fbl = frameBufferLength / 2; i < fbl; i++ ) {
                    signal[i] = (fb[2*i] + fb[2*i+1]) / 2; /* Load array with alternate amplitude values from each channel */
                }
            } else if (channels == 1) {
                signal = fb /* Load array with original mono channel */
            }
            // iterate over the position of the playhead
            for (var i = 0; i < frameBufferLength; i++) {
                animateMeter(signal[i], meter_canvas_context);
            }
        }
        
        function play() {
            self.audio[0].currentTime = 0;
            self.audio[0].play();
        }
        this.play = play;
        
        self.audio[0].addEventListener('MozAudioAvailable', audioAvailable, false);
        self.audio[0].addEventListener('loadedmetadata', loadedMetadata, false);
    }
    
    function valueToVolume(value) {
      return (1/128)*value;
    }
    
    function animateMeter(sample, context, meter) {
      // context.clearRect(0, 0, meter.width, meter.height)
      // var meter_value = amplitudeToPercentage(sample);
    }
}




function init() {
    var sound_bank      = document.getElementById("sound_bank");
    var mixer           = document.getElementById("mixer");
    var trigger_bank    = document.getElementById("trigger_bank");
    
    
    var menu_items      = document.getElementById('options').children;
    
    $(menu_items).click(function() {
      var instrument = new Instrument(sound_bank, mixer, trigger_bank, this.innerHTML);
    })
}

$ = jQuery
$(document).ready(function() {
  init();
});