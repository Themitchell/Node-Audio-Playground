function Solo(socket, current_identifier) {
  var self = this;
  this.toggle = new Toggle(current_identifier.solod, 'internal', 'S', 'solo');
  
  function handleToggle(state) {
    current_identifier.solod = state;
    
    if (self.toggle.state == 0) {
      
      // var enabled_solo_buttons = $('.button.on.solo')
      // enabled_solo_buttons.each( function() {
      //   this.click();
      // });
      // 
      // $(button).addClass('unsolo').removeClass('solo');
      // 
      // var disabled_mutes_except_own = $('.mute_button.mute').not($(button).prev());
      // disabled_mutes_except_own.each( function() {
      //   this.click();
      // });
    }
    else if (self.toggle.state == 1) {

      // $(button).addClass('solo').removeClass('unsolo');
      // 
      // var enabled_mutes_except_own = $('.mute_button.unmute').not($(button).prev());
      // enabled_mutes_except_own.each( function() {
      //   this.click();
      // });
    }
    self.toggle.change_state(state);
  }
  
  this.toggle.button.click( function() {
    if (current_identifier.solod == 0) {
	    current_identifier.solod = 1;
	  }
	  else if (current_identifier.solod == 1) {
	    current_identifier.solod = 0;
	  }
    socket.emit('solochannelinstrument', current_identifier);
  });
  
  socket.on('sendsolochannelinstrument', function(identifier) {
    if (current_identifier.id == identifier.id) { handleToggle(identifier.solod); }
  });
}