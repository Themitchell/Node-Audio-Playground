function Mute(socket, sound_source, volume, current_identifier) {
  var self = this;
  this.toggle = new Toggle(current_identifier.muted, 'internal', 'M', 'mute');
  
  function handleToggle(state) {
    //     /*  TODO: Work out how to make mutes force a solo when exiting solos exist
    //         var solo_buttons = $('.solo_button.unsolo');
    //         if (solo_buttons >= 0) {
    //             this.next().click();
    //         }
    //         This currently causes a loop whereby a solo no longer works as it uses
    //         muteOrUnmute() to create a solo.
    //     */
    current_identifier.muted = state;
    if (current_identifier.muted == 0) {
      sound_source.audio.volume = volume;
    }
    else if (current_identifier.muted == 1) {
      sound_source.audio.volume = 0;
    }
    self.toggle.change_state(state);
  }
  
  this.toggle.button.click( function() {
    if (current_identifier.muted == 0) {
	    current_identifier.muted = 1;
	  }
	  else if (current_identifier.muted == 1) {
	    current_identifier.muted = 0;
	  }
    socket.emit('mutechannelinstrument', current_identifier);
  });
  
  socket.on('sendmutechannelinstrument', function(identifier) {
    if (current_identifier.id == identifier.id) {
      handleToggle(identifier.muted);
    }
  });
}