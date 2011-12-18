function Mute(socket, sound_source, volume, current_identifier) {
  var self = this;
  console.log("Mute create remotely init mute value is equal to ==" + current_identifier.muted);
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
    console.log("Changing mute state from: " +  self.toggle.state + " to: " + state);
    current_identifier.muted = state;
    if (current_identifier.muted == 0) {
      sound_source.audio[0].volume = 0;
    }
    else if (current_identifier.muted == 1) {
      sound_source.audio[0].volume = volume;
    }
    self.toggle.change_state(state);
  }
  
  this.toggle.button.click( function() {
    if (current_identifier.muted == 0) {
	    current_identifier.muted = 1;
	    console.log("Mute switched to off for instrument: " + current_identifier.id);
	  }
	  else if (current_identifier.muted == 1) {
	    current_identifier.muted = 0;
	    console.log("Mute switched to off for instrument: " + current_identifier.id);
	  }
    socket.emit('mutechannelinstrument', current_identifier);
  });
  
  socket.on('sendmutechannelinstrument', function(identifier) {
    console.log("Recieved mute for instrument Instrument: " + identifier.id);
    if (current_identifier.id == identifier.id) {
      handleToggle(identifier.muted);
      console.log("Muted Instrument: " + identifier.id);
    }
  });
}