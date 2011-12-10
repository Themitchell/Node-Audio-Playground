function Mute(socket, sound_source, volume, type) {
  var self = this;
  this.toggle = new Toggle('internal', 'M', 'mute');
  
  // function toggle(button, sound_source, volume) {
  //     /*  TODO: Work out how to make mutes force a solo when exiting solos exist
  //         var solo_buttons = $('.solo_button.unsolo');
  //         if (solo_buttons >= 0) {
  //             this.next().click();
  //         }
  //         This currently causes a loop whereby a solo no longer works as it uses
  //         muteOrUnmute() to create a solo.
  //     */
  // 
  //     if ($(button).hasClass('mute')) {
  //         sound_source.audio[0].volume = 0;
  //         $(button).addClass('unmute').removeClass('mute');
  //     }
  //     else if ($(button).hasClass('unmute')) {
  //         sound_source.audio[0].volume = volume;
  //         $(button).addClass('mute').removeClass('unmute');
  //     }
  // }
  
  function handleResponse() {
    if (self.toggle.state == 0) {
      sound_source.audio[0].volume = 0;
    }
    else if (self.toggle.state == 0) {
      sound_source.audio[0].volume = volume;
    }
    self.toggle.change_state();
  }
  
  this.toggle.button.click( function( event ) {
    socket.emit('mutechannelinstrument', type);
  });
  
  socket.on('sendmutechannelinstrument', function(instrument_type) {
    if (instrument_type == type) { handleResponse(); }
  });
}