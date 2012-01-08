function Equaliser(socket, sound_source, current_identifier) {
  var self = this;
  
  this.sound_source   = sound_source;
  this.toggle_window  = new Toggle(0, 'internal', 'EQ', 'toggle_eq_window');
  this.element        = $("<div class=\"floating_window eq_window closed\"></div>");
  this.close_button   = $("<span class=\"close\">x</span>")
  this.fader_bank     = $("<div class=\"fader_bank\"></div>")
  this.element.append(this.close_button, this.fader_bank);
  var signal = new Float32Array(2048);
  

  
  this.toggle_window.button.click( function() {
    if ($(this).hasClass('off')) {
	    startOverlay();

  		self.element.css({
				"top": "50%",
				"left": "50%",
				"width": 600,
				"height": 400,
				"margin-top": -(400/2),
				"margin-left":-(600/2) //to position it in the middle
			}).animate(
			  {"opacity":"1"},
			  200, 
			  "linear"
			);

	    $(self.element).removeClass('closed');
	    $(self.element).addClass('open');
	  }
  });
  
  this.close_button.click(function(){
    self.element.animate(
		  {"opacity":"0"},
		  200, 
		  "linear"
		).css({
			"top": 0,
			"left": "-9999px",
			"width": 600,
			"height": 400,
			"margin-top": 0,
			"margin-left": 0 //to position it in the middle
		});
	
		$(self.element).removeClass('closed');
    $(self.element).addClass('open');
  
    killOverlay();
  });
  
  
  
  
  
  
  
  
  
  /****************************************************/
  
  var freqz       = [0];
  var writeCount  = 0;
  
  var grapheq     = new GraphicalEq(sound_source.rate);
  grapheq.setMinimumFrequency(30);
  grapheq.setMaximumFrequency(30000);
  grapheq.setBandsPerOctave(1.2);
  grapheq.recalculateFilters();
  
  this.fader_bank.empty();
  for (var i=0; i<grapheq.filters.length; i++) {
    
    var band_fader   = $("<div id=\"band_"+i+"\" class=\"slider\"></div>");
    var band_wrapper = $("<li><span class=\"band_frequency\">" + grapheq.filters[i].f0.toFixed(2) + " Hz</span></li>");
    band_wrapper.prepend(band_fader);
    self.fader_bank.append(band_wrapper);
    
    band_fader.slider({
      orientation: 'vertical',
      range: 'min',
      min: -24,
      max: 3,
      step: 0.1,
      value: 0,
      slide:
      changeBandGain
    });
  }

  function audioWritten(event) {
    signal = event.frameBuffer;
    sound_source.buffer = grapheq.processStereo(signal);
    sound_source.output.audio.mozWriteAudio([]); // flush
    sound_source.output.audio.mozWriteAudio(sound_source.buffer);
    writeCount++;
  }
  sound_source.audio.addEventListener('MozAudioAvailable', audioWritten, false);
  
  function changeBandGain(event, ui) {
    grapheq.setBandGain(ui.handle.parentNode.id.split("_")[1], ui.value);
    plotCoeffs();
  }
  
  function plotCoeffs() {
    freqz = new Float32Array(grapheq.freqzs[0].length);

    for (var i=0; i<freqz.length; i++) {
      for (var j=0; j<grapheq.freqzs.length; j++) {
        freqz[i] += grapheq.freqzs[j][i];
      }
    }
  }
}