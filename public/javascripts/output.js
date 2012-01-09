function Output(channels, sample_rate, frame_buffer_length) {
  
  var self          = this;
  
  this.signal       = new Float32Array(frame_buffer_length);
  this.audio        = new Audio();
  this.audio.mozSetup(channels, sample_rate);
  
  this.channels;
  this.rate;
  
  function prepare(frame_buffer) {
    self.signal = frame_buffer;
    // self.signal = grapheq.processStereo(self.signal);

    var output  = self.signal;
    self.audio.mozWriteAudio([]); // flush
    self.audio.mozWriteAudio(output);
  }
  this.prepare = prepare;
  
  this.audio.addEventListener('loadedmetadata', function() {
    self.channels            = self.audio.mozChannels;
    self.rate                = self.audio.mozSampleRate;
  }, false);
}