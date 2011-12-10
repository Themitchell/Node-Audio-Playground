function Solo() {
  this.button = $("<span class='solo_button solo'>S</span>");
  
  function toggle(button) {
    if ($(button).hasClass('solo')) {
      
      var enabled_solo_buttons = $('.solo_button.unsolo')
      enabled_solo_buttons.each( function() {
        this.click();
      });
      
      $(button).addClass('unsolo').removeClass('solo');
      
      var disabled_mutes_except_own = $('.mute_button.mute').not($(button).prev());
      disabled_mutes_except_own.each( function() {
        this.click();
      });
    }
    else if ($(button).hasClass('unsolo')) {

      $(button).addClass('solo').removeClass('unsolo');

      var enabled_mutes_except_own = $('.mute_button.unmute').not($(button).prev());
      enabled_mutes_except_own.each( function() {
        this.click();
      });
    }
  }
  
  this.button.click(function() {
    toggle(this);
  });
}