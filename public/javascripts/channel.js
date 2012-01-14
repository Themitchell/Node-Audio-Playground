function Channel(socket, instrument, sound_source, current_identifier) {

  var self          = this;
  
  var mixer         = document.getElementById("mixer");
  this.element      = $("<div class='channel_strip' id='" + current_identifier.type + "'><h3>" + current_identifier.type + "</h3></div>");
  this.output       = new Audio();
  this.output.mozSetup(instrument.channels, instrument.rate);
  this.buffers      = new Array();
  
  
  this.output.addEventListener('loadedmetadata', function() {
    self.equaliser    = new Equaliser(socket, sound_source, instrument.rate, current_identifier);
    self.inserts      = $("<div class=\"inserts\"></div>").append(self.equaliser.floating_window.toggle.button, self.equaliser.floating_window.element);

    self.volume       = new Volume(socket, this, sound_source, current_identifier);
    self.meter        = new Meter(sound_source, instrument.channels, instrument.rate, this, current_identifier);
    self.controls     = $("<div class='controls'></div>").append(self.volume.fader, self.meter.wrapper, self.inserts);

    self.mute         = new Mute(socket, this, self.volume.value, current_identifier);
    self.solo         = new Solo(socket, current_identifier);
    self.buttons      = $("<div class='buttons'></div>").append(self.mute.toggle.button, self.solo.toggle.button);

    self.element.append(self.controls, self.buttons);
    $(mixer).append(self.element);
  }, false);
  
  function process(input) {
    
    self.buffers.push(input);
    // If there's buffered data, write that  
    while(self.buffers.length > 0) {
      var buffer = self.buffers.shift();
      var signal  = self.equaliser.process(input);
      var written = self.output.mozWriteAudio(signal);
      self.meter.do_your_thing(signal);
          
      // If all data wasn't written, keep it in the buffers:  
      if(written < buffer.length) {  
        self.buffers.unshift(buffer.slice(written));  
        return;  
      }
    }
  }
  self.process = process;
}