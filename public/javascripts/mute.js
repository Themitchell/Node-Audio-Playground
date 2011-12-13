function Mute(socket, sound_source, volume, current_identifier) {
  var self = this;
  this.toggle = new Toggle('internal', 'M', 'mute');
  
  function handleToggle() {
    //     /*  TODO: Work out how to make mutes force a solo when exiting solos exist
    //         var solo_buttons = $('.solo_button.unsolo');
    //         if (solo_buttons >= 0) {
    //             this.next().click();
    //         }
    //         This currently causes a loop whereby a solo no longer works as it uses
    //         muteOrUnmute() to create a solo.
    //     */
    if (self.toggle.state == 0) {
      sound_source.audio[0].volume = 0;
    }
    else if (self.toggle.state == 1) {
      sound_source.audio[0].volume = volume;
    }
    self.toggle.change_state();
  }
  
  this.toggle.button.click( function() {
    socket.emit('mutechannelinstrument', current_identifier);
  });
  
  socket.on('sendmutechannelinstrument', function(identifier) {
    if (current_identifier.id == identifier.id) { handleToggle(); }
  });
}