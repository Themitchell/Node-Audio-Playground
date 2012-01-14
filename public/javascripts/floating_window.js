function FloatingWindow(owner, owner_type) {
  var self = this;
  this.toggle         = new Toggle(0, 'internal', owner_type.toUpperCase(), 'toggle_' + owner_type + '_window');
  this.element        = $("<div class=\"floating_window " + owner_type + "_window closed\"></div>");
  this.close_button   = $("<span class=\"close\">x</span>");
  this.element.append(this.close_button, owner.element);
  
  this.toggle.button.click( function() {
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
}