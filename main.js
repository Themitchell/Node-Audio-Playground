$ = jQuery

function init() {
  var instrument_players  = document.getElementById("instrument_players");
  var mixer               = document.getElementById("mixer");
  var menu_items          = document.getElementById('options').children;
  var print               = document.getElementById('print')
  
  function instrument(name) {
    // create instrument elements
    var audio         = $("<audio class='sample' src='samples/" + name + ".ogg'></audio>");
    var trigger       = $("<div class='trigger'><h3>" + name + "</h3></div>");
    var instrument    = $("<div class='instrument' id='" + name + "'></div>");
    
    instrument.append(audio, trigger);
    $(instrument_players).append(instrument);
    audio[0].volume = valueToVolume(100);
    
    
    debugger;
    
    // create mixer elements
    var mix_channel   = $("<div class='channel_strip' id='" + name + "'><h3>" + name + "</h3></div>");
    var fader         = $("<div class='fader'></div>");
    var meter         = $("<canvas class='meter'></canvas>");
    var mute          = $("<span class='mute_button mute'>M</span>");
    var solo          = $("<span class='solo_button solo'>S</span>");
    var controls      = $("<div class='controls'></div>").append(fader, meter);
    var buttons       = $("<div class='buttons'></div>").append(mute, solo);
    
    mix_channel.append(controls, buttons)
    $(mixer).append(mix_channel);
    
    var volume        = valueToVolume(100);
    fader.slider({
       orientation: "vertical",
       range: "min",
       min: 0,
       max: 127,
       value: 100,
       slide: function( event, ui ) {
         volume = valueToVolume(ui.value);
         audio[0].volume = volume;
       }
    });
    
    
    
    
    
    
    
    var context = meter[0].getContext('2d');
    var channels;
    var rate;
    var frameBufferLength;

    function loadedMetadata() {
      channels          = audio[0].mozChannels;
      rate              = audio[0].mozSampleRate;
      frameBufferLength = audio[0].mozFrameBufferLength;
    }

    function audioAvailable(event) {   
      var fb    = event.frameBuffer;
      var time  = event.time; /* Not used - note to self! */
      var signal = new Float32Array(fb.length / channels); /* This is where we store the amplitude value per frame */
      
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
        animateMeter(signal[i], context);
      }
    }
    
    audio[0].addEventListener('MozAudioAvailable', audioAvailable, false);
    audio[0].addEventListener('loadedmetadata', loadedMetadata, false);
    
    mute.click(function() {
      muteOrUnmute(mute, audio, volume);
    });
    
    solo.click(function() {
      soloOrUnsolo(solo);
    });
    
    trigger.click(function() { 
      hitTrigger(trigger, audio);
    });
  }
  
  function amplitudeToPercentage(sample) {
    
  }  
  
  function animateMeter(sample, context, meter) {
    // context.clearRect(0, 0, meter.width, meter.height)
    // var meter_value = amplitudeToPercentage(sample);
  }
  
  function valueToVolume(value) {
    return (1/128)*value;
  }

  function hitTrigger(trigger, audio) {
    trigger.animate({ backgroundColor: "#AAA"}, 50);
    trigger.animate({ backgroundColor: "#FFF"}, 50);
    audio[0].currentTime = 0;
    audio[0].play();
  }

  function muteOrUnmute(button, audio, volume) {
    if (button.hasClass('mute')) {
      audio[0].volume = 0;
      button.addClass('unmute').removeClass('mute');
    } else if (button.hasClass('unmute')) {
      sample[0].volume = volume;
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

  
  
  $(menu_items).click(function() {
    instrument(this.innerHTML);
  })
}


$(document).ready(function() {
  init();
});