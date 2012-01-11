function Meter(sound_source, channels, sample_rate, output, current_identifier) {

  var self              = this;
  
  this.wrapper          = $("<div class='meter mono'></div>");
  
  /* Build Array of canvases and contexts for each channel of audio */
  this.canvases          = new Array(channels);
  this.contexts          = new Array(channels);
    
  /* Build Array of canvases and contexts for each channel of audio */
  for (var i=0; i<self.canvases.length; i++) {
    var canvas           = $("<canvas></canvas>");
    canvas.width  = 10;
    canvas.height = 256;
    self.canvases[i]   = canvas[0];
    self.contexts[i]   = canvas[0].getContext('2d');
    self.wrapper.append(canvas);
    if (i=1) {
      self.wrapper.removeClass('mono');
      self.wrapper.addClass('stereo');
    }
  }
  
  function convertVolumeToHeight(input, canvas) {
    return ( ( canvas.height/100 ) * amplitudeAsPercentage(input) ) * output.volume;
  }
  
  var write_count = 0;
  function doYourThing(input) {
    
    var signals = new Array(channels);
    for (var i=0; i<signals.length; i++) {
      
      var signal = new Float32Array(input.length/self.canvases.length);
      for (var j=0, fbl = input.length/signals.length; j<fbl; j++ ) {
        
        if (input[(i+1)*j] < 0) {
          signal[j] = convertVolumeToHeight(-input[(i+1)*j], self.canvases[i]);
        }
        else {
          signal[j] = convertVolumeToHeight(input[(i+1)*j], self.canvases[i]);
        }
      }
      signals[i] = signal;
    }
    
    
    var grds = new Array(self.canvases.length);
    for (var i=0; i<self.canvases.length; i++) {      
      
      self.contexts[i].clearRect(0,0, self.canvases[i].width, self.canvases[i].height);
      var grd = self.contexts[i].createLinearGradient(0, 0, self.canvases[i].width, self.canvases[i].height);
      grd.addColorStop(1,"#00FF00");
      grds[i] = grd;
    }
    
    
    var write_count_this_buffer = 0;
    
    var animation_frame_multiplier              = Math.round(sample_rate/50); /* 50 fps */
    var remaining_frames_before_playing_buffer  = animation_frame_multiplier - write_count;    
    

    
    for (var i=0; i<signals.length; i++) {
      for (var j = 0; j<signals[i].length; j++) {
        write_count++;
        write_count_this_buffer++;
        
        if (write_count == 1) {
          self.contexts[i].fillStyle = grds[i];
          self.contexts[i].fillRect(0, self.canvases[i].height, self.canvases[i].width, -signals[i][j] );
        } else if (write_count == animation_frame_multiplier) {
          write_count = 0;
        }
      }
    }
  }
  this.do_your_thing = doYourThing;
}