function Equaliser(socket, sound_source, sample_rate, current_identifier) {
  var self = this;
  
  this.sound_source     = sound_source;
  this.element          = $("<div class=\"insert equaliser\"></div>");
  this.floating_window  = new FloatingWindow(this, "eq");
  this.fader_bank       = $("<div class=\"fader_bank\"></div>");
  this.element.append(this.fader_bank);
  
  var freqz       = [0];
  
  var grapheq     = new GraphicalEq(sample_rate);
  grapheq.setMinimumFrequency(30);
  grapheq.setMaximumFrequency(30000);
  grapheq.setBandsPerOctave(1.2);
  grapheq.recalculateFilters();
  
  this.fader_bank.empty();
  for (var i=0; i<grapheq.filters.length; i++) {
    
    var band_label_text;
    if (grapheq.filters[i].f0 > 1000) { 
      band_label_text = (grapheq.filters[i].f0/1000).toFixed(2) + "k";
    }
    else if (grapheq.filters[i].f0 < 1000) { 
      band_label_text = grapheq.filters[i].f0.toFixed(2);
    }
    var band_fader      = $("<div id=\"band_"+i+"\" class=\"slider\"></div>");
    var band_wrapper    = $("<li><span class=\"band_frequency\">" + band_label_text + "Hz</span></li>");
    band_wrapper.prepend(band_fader);
    self.fader_bank.append(band_wrapper);
    
    band_fader.slider({
      orientation: 'vertical',
      range: 'min',
      min: -24,
      max: 3,
      step: 0.1,
      value: 0,
      slide:
      changeBandGain
    });
  }

  function process(input) {
    var output = grapheq.process(input);
    return output;
  }
  this.process = process;
  
  function changeBandGain(event, ui) {
    grapheq.setBandGain(ui.handle.parentNode.id.split("_")[1], ui.value);
    plotCoeffs();
  }
  
  function plotCoeffs() {
    freqz = new Float32Array(grapheq.freqzs[0].length);

    for (var i=0; i<freqz.length; i++) {
      for (var j=0; j<grapheq.freqzs.length; j++) {
        freqz[i] += grapheq.freqzs[j][i];
      }
    }
  }
}