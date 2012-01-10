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
  
  var write_count = 0;
  function doYourThing(input) {
    var signals = new Array(channels);
    var grds    = new Array(channels);
    
    /* Fore each channel of audio */
    for (var i=0; i<self.canvases.length; i++) {
      /* create the signal */
      var signal    = new Float32Array(input.length/self.canvases.length);
      
      /* and then for each frame of audio in the channel */
      for (var j=0, fbl = input.length/signals.length; j<fbl; j++ ) {
        
        /* convert the signal to positive values and add it to the channel signal array */
        if (input[(i+1)*j] < 0) {
          signal[j] = -input[(i+1)*j];
        }
        else {
          signal[j] = input[(i+1)*j];
        }
      }
      signals[i] = signal;
      
      self.contexts[i].clearRect(0,0, self.canvases[i].width, self.canvases[i].height);
      var grd = self.contexts[i].createLinearGradient(0, 0, self.canvases[i].width, self.canvases[i].height);
      grd.addColorStop(1,"#00FF00");
      grds[i] = grd;
    }
    
    for (var i=0; i<signals.length; i++) {
      for (var j = 0; j<signals[i].length; j++) {
        write_count++;
        if (write_count == 1) {
          var percentage = amplitudeAsPercentage(signals[i][j]);
          var new_height = ( ( self.canvases[i].height/100 ) * percentage ) * output.volume;
          self.contexts[i].fillStyle = grds[i];
          self.contexts[i].fillRect(0, self.canvases[i].height, self.canvases[i].width, -new_height);
        } else if (write_count == Math.round(sample_rate/50)) {
          write_count = 0;
        }
      }
    }
  }
  this.do_your_thing = doYourThing;
}