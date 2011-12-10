function Mute(socket, sound_source, volume, type) {
  this.button = $("<span class='mute_button mute'>M</span>");
  
  function toggle(button, sound_source, volume) {
      /*  TODO: Work out how to make mutes force a solo when exiting solos exist
          var solo_buttons = $('.solo_button.unsolo');
          if (solo_buttons >= 0) {
              this.next().click();
          }
          This currently causes a loop whereby a solo no longer works as it uses
          muteOrUnmute() to create a solo.
      */

      if ($(button).hasClass('mute')) {
          sound_source.audio[0].volume = 0;
          $(button).addClass('unmute').removeClass('mute');
      }
      else if ($(button).hasClass('unmute')) {
          sound_source.audio[0].volume = volume;
          $(button).addClass('mute').removeClass('unmute');
      }
  }
  
  this.button.click(function() {
    socket.emit('mutechannelinstrument', type)
    toggle(this, sound_source, volume);
  });
  
  socket.on('sendmutechannelinstrument', function(instrument_type) {
    if (type == instrument_type) {
      self.trigger_pad.element.animate({ backgroundColor: "#AAA"}, 5);
      self.play();
      self.trigger_pad.element.animate({ backgroundColor: "#FFF"}, 5);
    }
  });
}