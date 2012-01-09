function Meter(sound_source, current_identifier) {

  var self            = this;
  this.wrapper        = $("<div class='meter'></div>");
  this.canvas         = $("<canvas></canvas>");
  this.canvas[0].width   = 10;
  this.canvas[0].height  = 256;
  this.wrapper.append(this.canvas);
  var context         = this.canvas[0].getContext('2d');
  
  // function doYourThing(event) {
  //   var fb        = event.frameBuffer;
  //   var signal    = new Float32Array(fb.length / sound_source.output.channels);
  // 
  //   if (sound_source.output.channels == 2) {
  //     for (var i = 0, fbl = sound_source.output.frame_buffer_length / 2; i < fbl; i++ ) {
  //       signal[i] = (fb[2*i] + fb[2*i+1]) / 2;
  //     }
  //   }
  //   else {
  //     for (var i = 0, fbl = sound_source.output.frame_buffer_length; i < fbl; i++ ) {
  //       if (sound_source.output.buffer[i] < 0) {
  //         signal[i] = -fb[i];
  //       }
  //       else {
  //         signal[i] = fb[i];
  //       }
  //     }
  //   }
  // 
  // 
  //   context.clearRect(0,0, self.canvas[0].width, self.canvas[0].height);
  //   var grd = context.createLinearGradient(0, 0, self.canvas[0].width, self.canvas[0].height);
  //   grd.addColorStop(0,"#FF0000");
  //   grd.addColorStop(1,"#00FF00");
  // 
  //   for (var i = 0; i < signal.length; i++) {
  //     var percentage = amplitudeAsPercentage(sound_source.output.buffer[i]);
  //     var new_height = ( ( self.canvas[0].height/100 ) * percentage ) * sound_source.output.audio.volume;
  //     context.fillStyle = grd;
  //     context.fillRect(0, self.canvas[0].height, self.canvas[0].width, -new_height);
  //   }
  // }
  // this.do_your_thing = doYourThing();
}