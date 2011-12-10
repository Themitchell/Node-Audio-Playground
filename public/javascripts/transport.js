function Transport() {
  var self      = this;
  
  this.element  = document.getElementById("transport")
  this.toggle   = new Toggle("Transport On/Off");
  this.state    = this.toggle.state;
  $(this.element).append(this.toggle.wrapper, this.toggle.label)
  
  
  
  
  // var init_tempo = 120;
  // this.element  = document.getElementById('metronome');
  // this.tempo_input  = $('<input type="text" name="bpm" class="bpm" />');
  // this.tempo_input.value = init_tempo;
  // this.click = new Audio('samples/click.ogg');
  // this.visual_aid = $('<div class="visual_aid off"></div>');
  // $(this.element).append(
  //   $('<div class="state_wrapper">').append(this.toggle),
  //   $('<label>State (On/Off)</label>'),
  //   $('<div class="visual_aid_wrapper">').append(this.visual_aid),
  //   ('<label>Beat Indicator</label>'),
  //   this.tempo_input,
  //   $('<label>Bpm</label>')
  // );
  // 
  // this.tempo        = parseInt(this.tempo_input.val());
  // this.counter    = 0;
  // this.toggle      = new Toggle(this);
  // this.state = toggle.state;
  // 
  // var interval;
  // 
  // 
  // this.visual_aid.hide();

  // 
  // 
  // function startClick() {
  //     var spb     = 60/tempo; /* seconds per beat */
  //     var mspb    = 1000/spb; /* milliseconds per beat */
  //     
  //     /* Set counter to 0 */
  //     self.counter = 0;
  //     
  //     /* Set state to on (1) */
  //     self.state = 1;
  //     
  //     interval = setInterval(function () {
  //         performClick();
  //     }, mspb);
  // }
  // this.start_click = startClick;
  // 
  // 
  // function stopClick() {
  //   self.state = 0;
  //   clearInterval(interval);
  // }
  // this.stopClick = stopClick;
  // 
  // 
  // function performClick() {
  //   self.click.play();
  //   self.visual_aid.fadeIn(100);
  //   self.visual_aid.fadeOut(100);
  //   self.counter++;
  // }
  // this.performClick = performClick;
  // 
  // 
  // this.state.toggle.click( function() {
  //   if ($(this).hasClass('off')) {
  //      this.start_click();
  //      self.toggle.addClass('on');
  //      self.toggle.removeClass('off');
  //   }
  //   else if ($(this).hasClass('on')) {
  //     self.stopClick();
  //     self.toggle.addClass('off');
  //     self.toggle.removeClass('on');
  //   }
  // });
}