function Solo(socket, type) {
  var self = this;
  this.toggle = new Toggle('internal', 'S', 'solo');
  
  function handleToggle() {
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
    self.toggle.change_state();
  }
  
  this.toggle.button.click( function() {
    socket.emit('solochannelinstrument', type);
  });
  
  socket.on('sendsolochannelinstrument', function(instrument_type) {
    if (instrument_type == type) { handleToggle(); }
  });
}