function Equaliser(socket, sound_source, current_identifier) {
  var self = this;
  
  this.toggle_window  = new Toggle(0, 'internal', 'EQ', 'toggle_eq_window');
  this.element        = $("<div class=\"floating_window eq_window closed\"></div>");
  this.close_button   = $("<span class=\"close\">x</span>")
  this.fader_bank     = $("<div class=\"fader_bank\"></div>")
  this.element.append(this.close_button, this.fader_bank);
  

  
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

  // 
  // var lowpass = IIRFilter(LOWPASS, 200, sound_source.rate);
  // filter.process(sound_source.samples);
}